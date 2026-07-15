import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CodeEditor } from '@/components/CodeEditor';
import {
  ApiError,
  CandidateQuestionView,
  FraudEventType,
  RunCodeResult,
  api,
} from '@/lib/api';
import { useFraudTracker, FraudSignal } from '@/lib/useFraudTracker';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export function CandidatePassationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const indexStorageKey = token ? `skillforge.passation.${token}.index` : null;

  const [questions, setQuestions] = useState<CandidateQuestionView[] | null>(null);
  const [passationId, setPassationId] = useState<string | null>(null);
  const [fraudConsent, setFraudConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const tracker = useFraudTracker(passationId, fraudConsent);

  // Lecture synchrone de l index sauvegarde AVANT le premier render, pour eviter
  // que l'effet de persistance ecrase "0" par-dessus la vraie valeur au mount.
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (!token) return 0;
    const saved = sessionStorage.getItem(`skillforge.passation.${token}.index`);
    if (!saved) return 0;
    const n = parseInt(saved, 10);
    return Number.isNaN(n) || n < 0 ? 0 : n;
  });
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [submitting, setSubmitting] = useState(false);

  // Chrono : recalcule elapsed a partir de startedAt (persistant en base) plutot que d un compteur local.
  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    if (startedAt == null) return;
    const tick = () => setElapsedSec(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    api
      .candidateResolveInvitation(token)
      .then((res) => {
        if (cancelled) return;
        setQuestions(res.questions);
        const raw = sessionStorage.getItem(`skillforge.passation.${token}`);
        if (!raw) {
          setError("Vous n'avez pas commence le test. Revenez sur l'accueil.");
          return;
        }
        let sessionData: { id: string; fraudConsent?: boolean };
        try {
          sessionData = JSON.parse(raw);
        } catch {
          setError('Session corrompue. Recommencez depuis le lien initial.');
          return;
        }
        setPassationId(sessionData.id);
        setFraudConsent(sessionData.fraudConsent === true);

        // Restauration de l etat serveur (F5 candidat, changement d onglet...)
        api
          .candidateGetState(sessionData.id)
          .then((state) => {
            if (cancelled) return;
            setStartedAt(new Date(state.startedAt).getTime());
            const restored: Record<string, AnswerState> = {};
            for (const a of state.answers) {
              const s: AnswerState = {};
              if (a.answerText != null) s.text = a.answerText;
              if (a.submittedCode != null) s.code = a.submittedCode;
              if (a.qcmSelectedIndex != null) s.qcmIndex = a.qcmSelectedIndex;
              if (a.lastTestsTotal != null && a.lastTestsTotal > 0) {
                s.runResult = {
                  status: 'OK',
                  exitCode: 0,
                  stdout: a.lastStdout ?? '',
                  stderr: a.lastStderr ?? '',
                  durationMs: 0,
                  testsPassed: a.lastTestsPassed ?? 0,
                  testsTotal: a.lastTestsTotal,
                  score: a.score == null
                    ? 0
                    : (typeof a.score === 'number' ? a.score : parseFloat(a.score)) / 100,
                };
              }
              restored[a.questionId] = s;
            }
            setAnswers(restored);
          })
          .catch(() => {
            // Sans etat serveur, on demarre a zero (nouvelle passation).
            setStartedAt(Date.now());
          });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement');
      });

    return () => {
      cancelled = true;
    };
  }, [token, indexStorageKey]);

  // Clamp defensif : si l index sauvegarde depasse le nombre de questions
  // (ex: passation regeneree avec moins de questions), on retombe sur 0.
  const safeIndex = questions && currentIndex >= questions.length ? 0 : currentIndex;

  // Persistance de l index courant a chaque changement.
  useEffect(() => {
    if (indexStorageKey) sessionStorage.setItem(indexStorageKey, String(safeIndex));
  }, [safeIndex, indexStorageKey]);

  const currentQuestion = useMemo(
    () => (questions ? questions[safeIndex] : null),
    [questions, safeIndex],
  );

  const questionMountedAt = useRef<Record<string, number>>({});
  useEffect(() => {
    if (currentQuestion && questionMountedAt.current[currentQuestion.id] == null) {
      questionMountedAt.current[currentQuestion.id] = Date.now();
    }
  }, [currentQuestion]);

  const updateAnswer = (questionId: string, patch: Partial<AnswerState>) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], ...patch },
    }));

    if (fraudConsent && patch.text != null) {
      const mountedAt = questionMountedAt.current[questionId];
      if (mountedAt) {
        tracker.signalFastAnswer(questionId, Date.now() - mountedAt, patch.text.length);
      }
    }
  };

  const handleSubmit = async () => {
    if (!passationId) return;
    setSubmitting(true);
    try {
      const final = await api.candidateSubmit(passationId);
      sessionStorage.removeItem(`skillforge.passation.${token}`);
      if (indexStorageKey) sessionStorage.removeItem(indexStorageKey);
      navigate(`/candidate/passation/${token}/done`, {
        state: { score: final.globalScore, breakdown: final.scoreBreakdown },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur de soumission');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-gradient p-6">
        <Card variant="elevated" className="max-w-md p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Une erreur est survenue
              </h2>
              <p className="mt-2 text-sm text-muted">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!questions || !passationId || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-gradient p-6">
        <Card variant="elevated" className="p-10 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted">Chargement du test…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient text-foreground">
      {/* Header sticky avec progression */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-md">
              <span className="font-display text-lg font-bold">S</span>
            </div>
            <div>
              <div className="font-display text-base font-bold tracking-tight">
                SkillForge
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                test en cours
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="muted">
              Question {safeIndex + 1} / {questions.length}
            </Badge>
            <Badge tone="accent">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{formatTime(elapsedSec)}</span>
            </Badge>
            <ThemeToggle />
          </div>
        </div>
        <div className="h-1 bg-background-soft">
          <div
            className="h-full bg-accent-gradient transition-all duration-300"
            style={{ width: `${((safeIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <QuestionCard
          question={currentQuestion}
          passationId={passationId}
          state={answers[currentQuestion.id]}
          onChange={(patch) => updateAnswer(currentQuestion.id, patch)}
        />

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setCurrentIndex(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Precedente
          </Button>

          {safeIndex < questions.length - 1 ? (
            <Button variant="cta" size="lg" onClick={() => setCurrentIndex(safeIndex + 1)}>
              Suivante
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="cta" size="lg" onClick={handleSubmit} disabled={submitting}>
              <Check className="h-4 w-4" />
              {submitting ? 'Envoi…' : 'Soumettre le test'}
            </Button>
          )}
        </div>
      </main>

      <FraudBanner signal={tracker.lastSignal} />
    </div>
  );
}

const FRAUD_LABELS: Record<FraudEventType, string> = {
  FOCUS_LOSS: 'Sortie de l onglet detectee',
  PASTE_SUSPICIOUS: 'Copier-coller volumineux detecte',
  FAST_ANSWER: 'Temps de reponse inhabituel detecte',
  DEVTOOLS_OPEN: 'Outils developpeur detectes',
};

function FraudBanner({ signal }: { signal: FraudSignal | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!signal) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 3500);
    return () => window.clearTimeout(t);
  }, [signal]);

  if (!signal || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl',
        'border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg backdrop-blur-md',
        'dark:border-amber-700 dark:bg-amber-950/50',
        'animate-fade-in-up',
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
      <div className="text-xs text-amber-900 dark:text-amber-100">
        <div className="font-semibold">{FRAUD_LABELS[signal.type]}</div>
        <div className="mt-0.5 opacity-80">Evenement enregistre pour le recruteur.</div>
      </div>
    </div>
  );
}

type AnswerState = {
  qcmIndex?: number;
  text?: string;
  code?: string;
  runResult?: RunCodeResult;
  running?: boolean;
};

function QuestionCard({
  question,
  passationId,
  state,
  onChange,
}: {
  question: CandidateQuestionView;
  passationId: string;
  state?: AnswerState;
  onChange: (patch: Partial<AnswerState>) => void;
}) {
  const tone =
    question.type === 'QCM' ? 'info' : question.type === 'CODE' ? 'warning' : 'success';

  let payload: AnyPayload = {};
  try {
    payload = JSON.parse(question.publicPayload);
  } catch {
    /* JSON invalide cote backend, on tolere */
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge tone={tone}>{question.type}</Badge>
          <Badge tone="muted">Difficulte {question.difficulty}/5</Badge>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-base leading-relaxed text-foreground">
          {question.statement || (
            <em className="text-muted">(enonce dans le payload)</em>
          )}
        </p>

        <div className="mt-6">
          {question.type === 'QCM' && (
            <QcmAnswerEditor
              passationId={passationId}
              questionId={question.id}
              options={payload.options ?? []}
              selectedIndex={state?.qcmIndex}
              onChange={onChange}
            />
          )}

          {question.type === 'CAS_PRATIQUE' && (
            <TextAnswerEditor
              passationId={passationId}
              questionId={question.id}
              scenario={payload.scenario ?? ''}
              value={state?.text ?? ''}
              onChange={onChange}
            />
          )}

          {question.type === 'CODE' && (
            <CodeAnswerEditor
              passationId={passationId}
              questionId={question.id}
              language={(payload.language as 'PHP' | 'JS') ?? 'JS'}
              starterCode={payload.starterCode ?? ''}
              code={state?.code ?? payload.starterCode ?? ''}
              runResult={state?.runResult}
              running={state?.running ?? false}
              onChange={onChange}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

type AnyPayload = {
  options?: string[];
  correctIndex?: number;
  scenario?: string;
  starterCode?: string;
  hiddenTests?: string;
  language?: string;
  explanation?: string;
};

function QcmAnswerEditor({
  passationId,
  questionId,
  options,
  selectedIndex,
  onChange,
}: {
  passationId: string;
  questionId: string;
  options: string[];
  selectedIndex?: number;
  onChange: (patch: Partial<AnswerState>) => void;
}) {
  const handleSelect = (i: number) => {
    onChange({ qcmIndex: i });
    void api.candidateSaveTextAnswer(passationId, questionId, String(i));
  };
  return (
    <div className="space-y-2.5">
      {options.length === 0 && (
        <p className="text-sm text-muted">
          Aucune option disponible pour cette question.
        </p>
      )}
      {options.map((opt, i) => {
        const checked = selectedIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className={
              'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm transition-all ' +
              (checked
                ? 'border-foreground bg-foreground/5 text-foreground shadow-sm'
                : 'border-border bg-surface text-muted hover:border-border-strong hover:text-foreground')
            }
          >
            <span
              className={
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ' +
                (checked
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border-strong')
              }
            >
              {checked ? <Check className="h-3.5 w-3.5" /> : null}
            </span>
            <span className="flex-1 font-medium">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function TextAnswerEditor({
  passationId,
  questionId,
  scenario,
  value,
  onChange,
}: {
  passationId: string;
  questionId: string;
  scenario: string;
  value: string;
  onChange: (patch: Partial<AnswerState>) => void;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (next: string) => {
    onChange({ text: next });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      void api.candidateSaveTextAnswer(passationId, questionId, next);
    }, 1000);
  };

  return (
    <div>
      {scenario && (
        <div className="mb-4 rounded-2xl border border-border bg-background-soft px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Scenario
          </p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">
            {scenario}
          </p>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        rows={8}
        className="block w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
        placeholder="Votre reponse ici…"
      />
      <p className="mt-2 font-mono text-[10px] text-muted">
        Sauvegarde automatique 1 s apres la derniere frappe
      </p>
    </div>
  );
}

function CodeAnswerEditor({
  passationId,
  questionId,
  language,
  starterCode: _starter,
  code,
  runResult,
  running,
  onChange,
}: {
  passationId: string;
  questionId: string;
  language: 'PHP' | 'JS';
  starterCode: string;
  code: string;
  runResult?: RunCodeResult;
  running: boolean;
  onChange: (patch: Partial<AnswerState>) => void;
}) {
  const handleRun = async () => {
    onChange({ running: true });
    try {
      const result = await api.candidateRunCode(
        passationId,
        questionId,
        language,
        code,
      );
      onChange({ runResult: result, running: false });
    } catch (err) {
      onChange({
        running: false,
        runResult: {
          status: 'ERROR',
          exitCode: -1,
          stdout: '',
          stderr: err instanceof Error ? err.message : 'Erreur reseau',
          durationMs: 0,
          testsPassed: 0,
          testsTotal: 0,
          score: 0,
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge tone="accent">{language}</Badge>
        <span className="font-mono text-[10px] text-muted">
          execute en sandbox Docker durcie (seccomp + cap-drop=ALL)
        </span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <CodeEditor language={language} value={code} onChange={(v) => onChange({ code: v })} />
      </div>
      <Button
        onClick={handleRun}
        variant="cta"
        size="lg"
        disabled={running || code.trim().length === 0}
      >
        <Play className="h-4 w-4" />
        {running ? 'Execution en sandbox…' : 'Executer'}
      </Button>

      {runResult && <RunResultPanel result={runResult} />}
    </div>
  );
}

function RunResultPanel({ result }: { result: RunCodeResult }) {
  const tone =
    result.status === 'OK'
      ? 'success'
      : result.status === 'TIMEOUT' || result.status === 'OOM'
        ? 'warning'
        : 'danger';
  return (
    <div className="rounded-2xl border border-border bg-background-soft p-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
        <Badge tone={tone}>{result.status}</Badge>
        <span>
          exit: <span className="text-foreground">{result.exitCode}</span>
        </span>
        <span>·</span>
        <span>
          duration: <span className="text-foreground">{result.durationMs} ms</span>
        </span>
        {result.testsTotal > 0 && (
          <>
            <span>·</span>
            <span>
              tests:{' '}
              <span className="text-foreground">
                {result.testsPassed}/{result.testsTotal}
              </span>
            </span>
            <span>·</span>
            <span>
              score:{' '}
              <span className="text-foreground">
                {Math.round(result.score * 100)}%
              </span>
            </span>
          </>
        )}
      </div>
      {result.stdout && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            stdout
          </p>
          <pre className="mt-1 overflow-x-auto rounded-xl bg-surface p-3 font-mono text-[11px] text-foreground">
            {result.stdout}
          </pre>
        </div>
      )}
      {result.stderr && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-danger">
            stderr
          </p>
          <pre className="mt-1 overflow-x-auto rounded-xl bg-surface p-3 font-mono text-[11px] text-danger">
            {result.stderr}
          </pre>
        </div>
      )}
    </div>
  );
}

function formatTime(s: number): string {
  const mm = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}
