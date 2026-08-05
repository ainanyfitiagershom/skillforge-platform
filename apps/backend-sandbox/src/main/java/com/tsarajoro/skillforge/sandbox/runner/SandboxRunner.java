package com.tsarajoro.skillforge.sandbox.runner;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallback;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.model.AccessMode;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Capability;
import com.github.dockerjava.api.model.Frame;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.StreamType;
import com.github.dockerjava.api.model.Volume;
import com.tsarajoro.skillforge.sandbox.api.ExecutionRequest;
import com.tsarajoro.skillforge.sandbox.api.ExecutionResult;
import com.tsarajoro.skillforge.sandbox.api.ExecutionResult.ExecutionStatus;
import com.tsarajoro.skillforge.sandbox.api.Language;
import com.tsarajoro.skillforge.sandbox.config.SandboxProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Execute le code candidat dans un conteneur Docker durci, ephemere, isole.
 *
 * Strategie en 6 etapes :
 * 1. Ecrire le code et les tests caches dans un repertoire temporaire local
 * 2. Creer le conteneur avec TOUS les flags de durcissement
 * 3. Demarrer + attendre la fin (ou timeout)
 * 4. Capturer stdout / stderr (tronques) et exit code
 * 5. Parser les resultats des tests (PHPUnit / Jest)
 * 6. Supprimer le conteneur + le repertoire temporaire
 */
@Service
public class SandboxRunner {

    private static final Logger log = LoggerFactory.getLogger(SandboxRunner.class);

    private final DockerClient docker;
    private final SandboxProperties props;

    public SandboxRunner(DockerClient docker, SandboxProperties props) {
        this.docker = docker;
        this.props = props;
    }

    public ExecutionResult execute(ExecutionRequest req) {
        int timeout = req.timeoutSeconds() != null ? req.timeoutSeconds() : props.timeoutSeconds();
        // Recherche tolerante (PHP / php / Php tous acceptes)
        String image = props.runtimes().get(req.language().name().toLowerCase());
        if (image == null) {
            image = props.runtimes().get(req.language().name());
        }
        if (image == null) {
            throw new IllegalArgumentException("no runtime image for language " + req.language());
        }

        // 1) Ecrire les fichiers dans un repertoire temporaire local monte en /work
        Path workDir;
        try {
            workDir = Files.createTempDirectory("skillforge-sandbox-");
            writeFiles(workDir, req);
        } catch (IOException e) {
            throw new SandboxExecutionException("cannot create temp workdir: " + e.getMessage(), e);
        }

        String containerId = null;
        long start = System.nanoTime();
        try {
            // 2) Construire la configuration de durcissement
            HostConfig hostConfig = buildHardenedHostConfig(workDir);

            // 3) Creer le conteneur
            //    --entrypoint vide : on court-circuite docker-entrypoint.sh qui casse
            //    quand toutes les capabilities Linux sont droppees (le script shell
            //    a besoin d au moins CAP_DAC_READ_SEARCH pour resoudre "command -v").
            //    En executant directement php/node, on evite le probleme sans affaiblir
            //    la securite (les binaires sont deja monkey-tested par le RUN du Dockerfile).
            CreateContainerResponse created = docker.createContainerCmd(image)
                    .withHostConfig(hostConfig)
                    .withWorkingDir("/work")
                    .withEntrypoint(new String[]{})
                    .withCmd(buildCommand(req.language(), req.hiddenTests() != null && !req.hiddenTests().isBlank()))
                    .withUser("1001:1001")
                    .withName("skillforge-sb-" + UUID.randomUUID().toString().substring(0, 8))
                    .exec();
            containerId = created.getId();

            // 4) Demarrer + attendre fin ou timeout
            docker.startContainerCmd(containerId).exec();

            StringBuilder stdout = new StringBuilder();
            StringBuilder stderr = new StringBuilder();
            AtomicLong bytesCaptured = new AtomicLong(0);
            CountDownLatch logsDone = new CountDownLatch(1);

            docker.logContainerCmd(containerId)
                    .withStdOut(true)
                    .withStdErr(true)
                    .withFollowStream(true)
                    .exec(new ResultCallback.Adapter<Frame>() {
                        @Override
                        public void onNext(Frame frame) {
                            long current = bytesCaptured.get();
                            if (current >= props.maxStdoutBytes()) return;
                            String text = new String(frame.getPayload(), StandardCharsets.UTF_8);
                            long room = props.maxStdoutBytes() - current;
                            if (text.length() > room) {
                                text = text.substring(0, (int) room) + "\n[OUTPUT TRUNCATED]";
                            }
                            bytesCaptured.addAndGet(text.length());
                            if (frame.getStreamType() == StreamType.STDERR) {
                                stderr.append(text);
                            } else {
                                stdout.append(text);
                            }
                        }
                        @Override
                        public void onComplete() { logsDone.countDown(); }
                    });

            boolean finishedInTime = docker.waitContainerCmd(containerId)
                    .start()
                    .awaitCompletion(timeout + 2L, TimeUnit.SECONDS);

            long durationMs = (System.nanoTime() - start) / 1_000_000;

            if (!finishedInTime) {
                // 5a) Timeout -> on tue
                safelyKill(containerId);
                return new ExecutionResult(ExecutionStatus.TIMEOUT, 137, stdout.toString(),
                        stderr.toString(), durationMs, 0, 0, 0.0);
            }

            // Recuperer exit code + raison
            InspectContainerResponse inspect = docker.inspectContainerCmd(containerId).exec();
            int exitCode = inspect.getState().getExitCodeLong() != null
                    ? inspect.getState().getExitCodeLong().intValue()
                    : -1;
            boolean oomKilled = Boolean.TRUE.equals(inspect.getState().getOOMKilled());

            // Attendre la fin du flux de logs (avec un cap)
            logsDone.await(1, TimeUnit.SECONDS);

            ExecutionStatus status;
            if (oomKilled) {
                status = ExecutionStatus.OOM;
            } else if (exitCode == 0) {
                status = ExecutionStatus.OK;
            } else {
                status = ExecutionStatus.ERROR;
            }

            // 5b) Parser le score des tests caches
            int[] testCounts = parseTestResults(req.language(), stdout.toString(), stderr.toString());
            int passed = testCounts[0];
            int total = testCounts[1];
            double score;
            if (total > 0) {
                score = (double) passed / total;
            } else {
                score = exitCode == 0 ? 1.0 : 0.0;
            }

            return new ExecutionResult(status, exitCode, stdout.toString(), stderr.toString(),
                    durationMs, passed, total, score);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SandboxExecutionException("execution interrupted", e);
        } finally {
            // 6) Cleanup
            if (containerId != null) safelyRemove(containerId);
            try {
                deleteRecursively(workDir);
            } catch (IOException ioe) {
                log.warn("cannot delete temp workdir {}: {}", workDir, ioe.getMessage());
            }
        }
    }

    /**
     * Construit la config Docker avec TOUS les flags de durcissement.
     */
    private HostConfig buildHardenedHostConfig(Path workDir) {
        long memoryBytes = (long) props.memoryMb() * 1024 * 1024;
        long nanoCpus = (long) (props.cpus() * 1_000_000_000L);

        // Monter le workdir local en /work en read-only (le code ne peut pas se modifier)
        Bind workBind = new Bind(workDir.toAbsolutePath().toString(), new Volume("/work"), AccessMode.ro);

        HostConfig hc = HostConfig.newHostConfig()
                .withBinds(workBind)
                .withNetworkMode("none")                  // aucun reseau
                .withReadonlyRootfs(true)                 // FS root en lecture seule
                .withMemory(memoryBytes)                  // limite RAM
                .withMemorySwap(memoryBytes)              // pas de swap supplementaire
                .withNanoCPUs(nanoCpus)                   // limite CPU
                .withPidsLimit((long) props.pidsLimit())  // bloque les fork bombs
                .withCapDrop(Capability.values())         // drop TOUTES les capabilities Linux
                .withSecurityOpts(List.of(
                        "no-new-privileges",
                        "seccomp=" + readSeccompProfile()
                ));

        return hc;
    }

    private String readSeccompProfile() {
        try {
            return Files.readString(Path.of(props.seccompProfilePath()));
        } catch (IOException e) {
            throw new SandboxExecutionException(
                    "cannot read seccomp profile at " + props.seccompProfilePath(), e);
        }
    }

    /**
     * Ecrit user-code et hidden-tests dans le workdir local.
     * Le workdir est cree en 700 par defaut : on l'ouvre en 755 et les fichiers en 644
     * pour que l'utilisateur non-privilegie 1001 du conteneur puisse lire les sources.
     */
    private void writeFiles(Path workDir, ExecutionRequest req) throws IOException {
        setPosixPermissions(workDir, "rwxr-xr-x");
        if (req.language() == Language.PHP) {
            Path sol = workDir.resolve("solution.php");
            Files.writeString(sol, req.userCode());
            setPosixPermissions(sol, "rw-r--r--");
            if (req.hiddenTests() != null && !req.hiddenTests().isBlank()) {
                Path tests = workDir.resolve("HiddenTest.php");
                Files.writeString(tests, req.hiddenTests());
                setPosixPermissions(tests, "rw-r--r--");
            }
        } else if (req.language() == Language.JS) {
            Path sol = workDir.resolve("solution.js");
            Files.writeString(sol, req.userCode());
            setPosixPermissions(sol, "rw-r--r--");
            if (req.hiddenTests() != null && !req.hiddenTests().isBlank()) {
                Path tests = workDir.resolve("hidden.test.js");
                Files.writeString(tests, req.hiddenTests());
                setPosixPermissions(tests, "rw-r--r--");
            }
        }
    }

    private void setPosixPermissions(Path path, String perms) {
        try {
            Files.setPosixFilePermissions(path,
                    java.nio.file.attribute.PosixFilePermissions.fromString(perms));
        } catch (UnsupportedOperationException | IOException e) {
            log.debug("cannot set posix permissions on {}: {}", path, e.getMessage());
        }
    }

    /**
     * Construit la commande lancee dans le conteneur.
     * - Avec tests caches  : phpunit / jest (parsing du score apres)
     * - Sans tests caches  : juste php / node sur la solution (exit code = score)
     */
    private String[] buildCommand(Language lang, boolean hasTests) {
        if (lang == Language.PHP) {
            return hasTests
                    ? new String[]{"phpunit", "--colors=never", "--do-not-cache-result", "HiddenTest.php"}
                    : new String[]{"php", "solution.php"};
        }
        if (lang == Language.JS) {
            // Node 20 Permission Model : bloque toute lecture FS hors /work et /usr/local/lib
            // (dependances Jest via require). Sans autorisation --allow-child-process, empeche
            // aussi tout spawn de sous-process. --max-old-space-size limite V8 en RAM.
            String[] hardened = {
                    "node",
                    "--experimental-permission",
                    "--allow-fs-read=/work",
                    "--allow-fs-read=/usr/local/lib/node_modules",
                    "--allow-fs-read=/usr/lib",
                    "--max-old-space-size=200"
            };
            String[] target = hasTests
                    ? new String[]{"/usr/local/bin/jest", "--colors=false", "hidden.test.js"}
                    : new String[]{"solution.js"};
            String[] full = new String[hardened.length + target.length];
            System.arraycopy(hardened, 0, full, 0, hardened.length);
            System.arraycopy(target, 0, full, hardened.length, target.length);
            return full;
        }
        throw new IllegalArgumentException("unsupported language " + lang);
    }

    /**
     * Parse PHPUnit / Jest output pour extraire (passed, total).
     */
    private static final Pattern PHPUNIT_OK = Pattern.compile("OK \\((\\d+) test");
    private static final Pattern PHPUNIT_FAIL =
            Pattern.compile("Tests: (\\d+), Assertions: \\d+, Failures: (\\d+)");
    private static final Pattern JEST_TESTS =
            Pattern.compile("Tests:\\s+(?:(\\d+) failed,\\s+)?(?:(\\d+) passed,\\s+)?(\\d+) total");

    private int[] parseTestResults(Language lang, String stdout, String stderr) {
        String all = stdout + "\n" + stderr;
        if (lang == Language.PHP) {
            Matcher okM = PHPUNIT_OK.matcher(all);
            if (okM.find()) {
                int n = Integer.parseInt(okM.group(1));
                return new int[]{n, n};
            }
            Matcher fM = PHPUNIT_FAIL.matcher(all);
            if (fM.find()) {
                int total = Integer.parseInt(fM.group(1));
                int failed = Integer.parseInt(fM.group(2));
                return new int[]{total - failed, total};
            }
        } else if (lang == Language.JS) {
            Matcher m = JEST_TESTS.matcher(all);
            if (m.find()) {
                int failed = m.group(1) != null ? Integer.parseInt(m.group(1)) : 0;
                int passed = m.group(2) != null ? Integer.parseInt(m.group(2)) : 0;
                int total = Integer.parseInt(m.group(3));
                // sanity check
                if (passed + failed != total) passed = total - failed;
                return new int[]{passed, total};
            }
        }
        return new int[]{0, 0};
    }

    private void safelyKill(String containerId) {
        try {
            docker.killContainerCmd(containerId).exec();
        } catch (Exception ignored) {
            // deja arrete
        }
    }

    private void safelyRemove(String containerId) {
        try {
            docker.removeContainerCmd(containerId).withForce(true).exec();
        } catch (Exception e) {
            log.warn("cannot remove container {}: {}", containerId, e.getMessage());
        }
    }

    private void deleteRecursively(Path dir) throws IOException {
        if (!Files.exists(dir)) return;
        try (var stream = Files.walk(dir)) {
            stream.sorted((a, b) -> b.compareTo(a))
                    .forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {
                            // best effort
                        }
                    });
        }
    }
}
