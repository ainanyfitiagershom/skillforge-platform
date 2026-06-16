import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ApiError,
  ExtractedSkill,
  GenerateResponse,
  Question,
  api,
} from '@/lib/api';
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  FileUp,
  ListChecks,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const PROFILES = [
  { code: 'DEV_PHP', label: 'Developpeur PHP', hint: 'Backend, API, Laravel' },
  { code: 'INT_WORDPRESS', label: 'Integrateur WordPress', hint: 'Theme, CMS, SEO' },
  { code: 'DEV_VUE', label: 'Developpeur Vue.js', hint: 'Frontend, SPA, TypeScript' },
  { code: 'SEO_TECH', label: 'Specialiste SEO technique', hint: 'Audit, performance, crawl' },
];

const QUESTION_TYPE_LABELS: Record<Question['type'], string> = {
  QCM: 'QCM',
  CODE: 'Code',
  CAS_PRATIQUE: 'Cas pratique',
};

const QUESTION_TYPE_HELPERS: Record<Question['type'], string> = {
  QCM: 'Validation rapide des bases et concepts',
  CODE: 'Exercices pratiques a executer',
  CAS_PRATIQUE: 'Mise en situation projet',
};

export function NewTestPage() {
  const navigate = useNavigate();
  const [profileCode, setProfileCode] = useState('DEV_PHP');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateDisplayName, setCandidateDisplayName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [skills, setSkills] = useState<ExtractedSkill[] | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [llmInfo, setLlmInfo] = useState<{
    provider: string;
    tokens: number;
    cost: string;
  } | null>(null);

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);

  const [error, setError] = useState<string | null>(null);
  const uploadLocked = Boolean(skills);
  const generationLocked = Boolean(generated);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || uploadLocked) return;
    setError(null);
    setAnalyzing(true);
    setGenerated(null);
    try {
      const res = await api.uploadCv(file, candidateEmail, candidateDisplayName, profileCode);
      setSkills(res.skills);
      setSelectedSkills(new Set(res.skills.map((s) => s.skillCode)));
      setLlmInfo({ provider: res.llmProvider, tokens: res.tokensUsed, cost: res.costEur });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'upload");
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSkill = (code: string) => {
    if (generationLocked) return;
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (generationLocked) return;
    setError(null);
    setGenerating(true);
    try {
      const skillCodes = Array.from(selectedSkills);
      const res = await api.generateQuestions({
        profileCode,
        skillCodes,
        types: [
          { type: 'QCM', count: 5 },
          { type: 'CODE', count: 3 },
          { type: 'CAS_PRATIQUE', count: 2 },
        ],
        difficulty: 3,
      });
      setGenerated(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur lors de la generation');
    } finally {
      setGenerating(false);
    }
  };

  const handleGoReview = () => navigate('/app/review');

  return (
    <div className="mx-auto max-w-3xl space-y-12 pt-8">
      {/* ============ HEADER calme ============ */}
      <div className="text-center">
        <Badge tone="accent" className="mb-4">
          <Sparkles className="h-3 w-3" />
          Nouveau test
        </Badge>
        <h1 className="font-display text-display-sm leading-[1.05] tracking-tighter text-foreground">
          Demarrer un{' '}
          <span className="bg-text-accent-gradient bg-clip-text text-transparent">
            recrutement.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-muted">
          3 etapes : upload du CV, validation des competences, generation du
          test par l'IA.
        </p>
      </div>

      {/* ============ STEPS — discret ============ */}
      <Steps current={generated ? 3 : skills ? 2 : 1} />

      {/* ============ ETAPE 1 ============ */}
      <Card variant="elevated">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft font-mono text-xs font-bold text-accent-strong">
                01
              </span>
              CV et profil cible
            </CardTitle>
            <CardDescription>
              Choisissez le poste vise, ajoutez l'identite du candidat et televersez son CV.
            </CardDescription>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Profil cible
                </label>
                <ProfileSelect
                  value={profileCode}
                  onChange={setProfileCode}
                  disabled={uploadLocked}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Email du candidat
                </label>
                <Input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  disabled={uploadLocked}
                  required
                  placeholder="jean.dupont@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Nom complet
                </label>
                <Input
                  value={candidateDisplayName}
                  onChange={(e) => setCandidateDisplayName(e.target.value)}
                  disabled={uploadLocked}
                  required
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Fichier CV (PDF ou DOCX)
                </label>
                <label
                  className={cn(
                    'flex h-[42px] items-center gap-3 rounded-xl border border-dashed border-border bg-background-soft px-4 text-sm text-muted transition-all',
                    uploadLocked
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:border-accent hover:bg-accent-soft/30 hover:text-foreground',
                  )}
                >
                  <FileUp className="h-4 w-4" />
                  <span className="flex-1 truncate">
                    {file ? file.name : 'Cliquez pour choisir un fichier'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={uploadLocked}
                    required
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <Button type="submit" variant="cta" size="lg" disabled={analyzing || !file || uploadLocked}>
              {uploadLocked ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <FileUp className="h-4 w-4" />
              )}
              {uploadLocked
                ? 'CV analyse'
                : analyzing
                  ? 'Analyse du CV en cours…'
                  : 'Analyser le CV'}
              {!analyzing && !uploadLocked && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* ============ ETAPE 2 ============ */}
      {skills && (
        <Card variant="elevated" className="animate-fade-in-up">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft font-mono text-xs font-bold text-accent-strong">
                  02
                </span>
                Competences detectees
              </CardTitle>
              <CardDescription>
                Decochez celles qui ne sont pas pertinentes pour le test.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            {llmInfo && (
              <div className="mb-5 inline-flex flex-wrap items-center gap-3 rounded-full border border-border bg-background-soft px-4 py-2 font-mono text-[11px] text-muted">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-foreground">{llmInfo.provider}</span>
                </div>
                <span className="text-muted-soft">·</span>
                <span>
                  {llmInfo.tokens} tokens
                </span>
                <span className="text-muted-soft">·</span>
                <span>{llmInfo.cost} EUR</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => {
                const selected = selectedSkills.has(s.skillCode);
                return (
                  <button
                    key={s.skillCode}
                    onClick={() => toggleSkill(s.skillCode)}
                    type="button"
                    disabled={generationLocked}
                    className={cn(
                      'group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed',
                      selected
                        ? 'border-foreground bg-foreground text-background shadow-md'
                        : 'border-border bg-surface text-muted hover:border-border-strong hover:text-foreground',
                      generationLocked && 'opacity-70',
                    )}
                  >
                    {selected ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5 opacity-40" />
                    )}
                    {s.displayName}
                    <span
                      className={cn(
                        'font-mono text-[10px]',
                        selected ? 'text-background/60' : 'text-muted-soft',
                      )}
                    >
                      {s.level.toLowerCase()}
                    </span>
                  </button>
                );
              })}
            </div>
            <Button
              onClick={handleGenerate}
              variant="cta"
              size="lg"
              disabled={generating || selectedSkills.size === 0 || generationLocked}
              className="mt-6"
            >
              {generationLocked ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generationLocked
                ? 'Test genere'
                : generating
                  ? 'Generation des questions…'
                  : 'Generer le test'}
              {!generating && !generationLocked && <ArrowRight className="h-4 w-4" />}
            </Button>
          </CardBody>
        </Card>
      )}

      {/* ============ ETAPE 3 ============ */}
      {generated && (
        <Card variant="elevated" className="animate-fade-in-up">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft font-mono text-xs font-bold text-accent-strong">
                  03
                </span>
                Questions generees
              </CardTitle>
              <CardDescription>
                Les questions sont pretes pour la revue. Verifiez les enonces,
                ajustez les payloads et publiez le test depuis l'ecran de revue.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border border-border bg-background-soft px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ListChecks className="h-4 w-4 text-accent" />
                  {generated.questions.length} questions en attente de revue
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['QCM', 'CODE', 'CAS_PRATIQUE'] as Question['type'][]).map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] text-muted"
                    >
                      <span className="font-semibold text-foreground">
                        {generated.questions.filter((q) => q.type === type).length}
                      </span>{' '}
                      {QUESTION_TYPE_LABELS[type]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background-soft px-4 py-3 font-mono text-[11px] text-muted">
                <div className="mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="h-3 w-3 text-accent" />
                  <span className="text-foreground">{generated.llmProvider}</span>
                </div>
                <div>{generated.llmModel}</div>
                <div className="mt-1">
                  {generated.tokensUsed} tokens · {generated.costEur} EUR
                </div>
              </div>
            </div>

            <QuestionList questions={generated.questions} />

            <Button onClick={handleGoReview} variant="cta" size="lg" className="mt-6 w-full sm:w-auto">
              Aller a la revue des questions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardBody>
        </Card>
      )}

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}
    </div>
  );
}

function ProfileSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = PROFILES.find((profile) => profile.code === value) ?? PROFILES[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="profileCode" value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'group flex h-[48px] w-full items-center gap-3 rounded-2xl border bg-surface px-3.5 text-left shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-65',
          open
            ? 'border-accent ring-4 ring-accent/15'
            : 'border-border hover:border-border-strong hover:bg-background-soft/40',
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <BriefcaseBusiness className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {selected.label}
          </span>
          <span className="block truncate font-mono text-[10px] uppercase tracking-wide text-muted">
            {selected.hint}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
            open && 'rotate-180 text-accent-strong',
          )}
        />
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-border bg-surface-elevated p-1.5 shadow-lg animate-fade-in-up"
        >
          {PROFILES.map((profile) => {
            const active = profile.code === value;
            return (
              <button
                key={profile.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(profile.code);
                  setOpen(false);
                }}
                className={cn(
                  'flex min-h-[54px] w-full items-center gap-3 rounded-xl px-3 text-left transition-colors',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-background-soft',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                    active
                      ? 'border-background/20 bg-background/10 text-background'
                      : 'border-border bg-accent-soft text-accent-strong',
                  )}
                >
                  {active ? <Check className="h-4 w-4" /> : <BriefcaseBusiness className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {profile.label}
                  </span>
                  <span
                    className={cn(
                      'block truncate font-mono text-[10px] uppercase tracking-wide',
                      active ? 'text-background/60' : 'text-muted',
                    )}
                  >
                    {profile.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuestionList({ questions }: { questions: Question[] }) {
  const groups = (['QCM', 'CODE', 'CAS_PRATIQUE'] as Question['type'][]).map((type) => ({
    type,
    questions: questions.filter((q) => q.type === type),
  }));

  return (
    <div className="space-y-5">
      {groups.map(({ type, questions }) => {
        if (questions.length === 0) return null;
        return (
          <section key={type} className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {QUESTION_TYPE_LABELS[type]}
                </h4>
                <p className="text-xs text-muted">
                  {QUESTION_TYPE_HELPERS[type]}
                </p>
              </div>
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] text-muted">
                {questions.length}
              </span>
            </div>

            <div className="space-y-2">
              {questions.map((q, index) => (
                <QuestionPreview key={q.id} q={q} index={index + 1} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function QuestionPreview({ q, index }: { q: Question; index: number }) {
  const tone =
    q.type === 'QCM' ? 'info' : q.type === 'CODE' ? 'warning' : 'success';
  const difficultyLabel = `${q.difficulty}/5`;

  return (
    <article className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition-colors hover:border-border-strong hover:bg-background-soft/50">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-soft font-mono text-xs font-bold text-muted">
        {String(index).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone={tone} variant="mono">
            {QUESTION_TYPE_LABELS[q.type]}
          </Badge>
          <span className="rounded-full border border-border bg-background-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted">
            difficulte {difficultyLabel}
          </span>
        </div>
        <p className="text-[15px] font-medium leading-6 text-foreground">
          {q.statement || (
            <em className="font-normal text-muted">Enonce disponible dans le payload.</em>
          )}
        </p>
      </div>
    </article>
  );
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: 'CV' },
    { num: 2, label: 'Competences' },
    { num: 3, label: 'Questions' },
  ];
  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((s, i) => {
        const active = current >= s.num;
        const done = current > s.num;
        return (
          <div key={s.num} className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] font-bold transition-all',
                done
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-surface text-muted',
              )}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.num}
            </div>
            <span
              className={cn(
                'text-xs font-medium transition-colors',
                active ? 'text-foreground' : 'text-muted',
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'h-px w-8 transition-colors',
                  current > s.num ? 'bg-emerald-500' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
