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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export function CandidatePassationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<CandidateQuestionView[] | null>(null);
  const [passationId, setPassationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [submitting, setSubmitting] = useState(false);

  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

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
              Question {currentIndex + 1} / {questions.length}
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

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Precedente
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button variant="cta" size="lg" onClick={() => setCurrentIndex((i) => i + 1)}>
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
