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
  RunCodeResult,
  api,
} from '@/lib/api';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';

/**
 * Page de passation candidat (URL : /candidate/passation/:token/run).
 *
 * - Affiche les questions une par une (navigation prev/next)
 * - QCM : choix radio + sauvegarde auto sur changement
 * - CODE : Monaco editor + bouton "Executer" -> POST /candidate/.../run-code
 * - CAS_PRATIQUE : textarea libre + sauvegarde auto debouncee
 * - Chronometre global affiche dans le header
 * - Bouton "Soumettre" en fin de parcours
 */
export function CandidatePassationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Etat global
  const [questions, setQuestions] = useState<CandidateQuestionView[] | null>(null);
  const [passationId, setPassationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [submitting, setSubmitting] = useState(false);

  // Chronometre demarre a l'arrivee sur la page (en secondes)
  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Charger les questions + retrouver l'id de passation depuis sessionStorage
  useEffect(() => {
    if (!token) return;
    api
      .candidateResolveInvitation(token)
      .then((res) => {
        setQuestions(res.questions);
        const raw = sessionStorage.getItem(`skillforge.passation.${token}`);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setPassationId(parsed.id);
          } catch {
            setError('Session corrompue. Recommencez depuis le lien initial.');
          }
        } else {
          setError("Vous n'avez pas commence le test. Revenez sur l'accueil.");
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erreur de chargement'),
      );
  }, [token]);

  const currentQuestion = useMemo(
    () => (questions ? questions[currentIndex] : null),
    [questions, currentIndex],
  );

  const updateAnswer = (questionId: string, patch: Partial<AnswerState>) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], ...patch },
    }));
  };

  const handleSubmit = async () => {
    if (!passationId) return;
    setSubmitting(true);
    try {
      const final = await api.candidateSubmit(passationId);
      sessionStorage.removeItem(`skillforge.passation.${token}`);
      navigate(`/candidate/passation/${token}/done`, {
        state: { score: final.globalScore },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur de soumission');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="max-w-md">
          <CardBody>
            <p className="font-mono text-xs text-danger">✗ {error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }
  if (!questions || !passationId || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="font-mono text-xs text-muted-foreground">$ loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              S
            </div>
            <div>
              <div className="text-sm font-semibold">SkillForge</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                test en cours
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="muted">
              <span className="font-mono">
                question {currentIndex + 1} / {questions.length}
              </span>
            </Badge>
            <Badge tone="info">
              <span className="font-mono">⏱ {formatTime(elapsedSec)}</span>
            </Badge>
            <ThemeToggle />
          </div>
        </div>
        {/* Barre de progression */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
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

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Precedente
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>
              Suivante
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              <Check className="h-4 w-4" />
              {submitting ? 'Envoi…' : 'Soumettre le test'}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// Composants internes
// ============================================================

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge tone={tone}>{question.type}</Badge>
          <Badge tone="muted">diff {question.difficulty}/5</Badge>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-base leading-relaxed">
          {question.statement || (
            <em className="text-muted-foreground">(enonce dans le payload)</em>
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
              hiddenTests={payload.hiddenTests ?? null}
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
    <div className="space-y-2">
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
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
              'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors ' +
              (checked
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground')
            }
          >
            <span
              className={
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ' +
                (checked
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border')
              }
            >
              {checked ? <Check className="h-3 w-3" /> : null}
            </span>
            <span className="flex-1">{opt}</span>
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
  // Sauvegarde debouncee : 1 s apres la derniere frappe
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
        <div className="mb-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          <p className="font-mono text-[10px] uppercase tracking-widest">scenario</p>
          <p className="mt-1 whitespace-pre-wrap">{scenario}</p>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        rows={8}
        className="block w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="Votre reponse ici…"
      />
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
        $ auto-save 1s after typing
      </p>
    </div>
  );
}

function CodeAnswerEditor({
  passationId,
  questionId,
  language,
  starterCode: _starter,
  hiddenTests,
  code,
  runResult,
  running,
  onChange,
}: {
  passationId: string;
  questionId: string;
  language: 'PHP' | 'JS';
  starterCode: string;
  hiddenTests: string | null;
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
        hiddenTests,
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge tone="muted">{language}</Badge>
        <span className="font-mono text-[10px] text-muted-foreground">
          executable en sandbox Docker durcie
        </span>
      </div>
      <CodeEditor language={language} value={code} onChange={(v) => onChange({ code: v })} />
      <Button onClick={handleRun} disabled={running || code.trim().length === 0}>
        <Play className="h-4 w-4" />
        {running ? <span className="font-mono">$ running in sandbox…</span> : 'Executer'}
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
    <div className="rounded-md border border-border bg-muted/40 p-3">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
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
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            stdout
          </p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-background p-2 font-mono text-[11px]">
            {result.stdout}
          </pre>
        </div>
      )}
      {result.stderr && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-danger">
            stderr
          </p>
          <pre className="mt-1 overflow-x-auto rounded-md bg-background p-2 font-mono text-[11px] text-danger">
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
