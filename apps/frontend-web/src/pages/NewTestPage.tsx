import { FormEvent, useState } from 'react';
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
import { CheckCircle2, FileUp, Sparkles, X, ArrowRight, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/cn';

const PROFILES = [
  { code: 'DEV_PHP', label: 'Developpeur PHP' },
  { code: 'INT_WORDPRESS', label: 'Integrateur WordPress' },
  { code: 'DEV_VUE', label: 'Developpeur Vue.js' },
  { code: 'SEO_TECH', label: 'Specialiste SEO technique' },
];

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

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
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
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleGenerate = async () => {
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
                <select
                  value={profileCode}
                  onChange={(e) => setProfileCode(e.target.value)}
                  className="block h-[42px] w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground transition-all hover:border-border-strong focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
                >
                  {PROFILES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Email du candidat
                </label>
                <Input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
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
                  required
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Fichier CV (PDF ou DOCX)
                </label>
                <label className="flex h-[42px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background-soft px-4 text-sm text-muted transition-all hover:border-accent hover:bg-accent-soft/30 hover:text-foreground">
                  <FileUp className="h-4 w-4" />
                  <span className="flex-1 truncate">
                    {file ? file.name : 'Cliquez pour choisir un fichier'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <Button type="submit" variant="cta" size="lg" disabled={analyzing || !file}>
              <FileUp className="h-4 w-4" />
              {analyzing ? 'Analyse du CV en cours…' : 'Analyser le CV'}
              {!analyzing && <ArrowRight className="h-4 w-4" />}
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
                    className={cn(
                      'group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                      selected
                        ? 'border-foreground bg-foreground text-background shadow-md'
                        : 'border-border bg-surface text-muted hover:border-border-strong hover:text-foreground',
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
              disabled={generating || selectedSkills.size === 0}
              className="mt-6"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? 'Generation des questions…' : 'Generer le test'}
              {!generating && <ArrowRight className="h-4 w-4" />}
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
                {generated.questions.length} questions creees en statut PENDING_REVIEW.
                Editez-les ou supprimez-les depuis « Revoir les questions ».
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <div className="mb-5 inline-flex flex-wrap items-center gap-3 rounded-full border border-border bg-background-soft px-4 py-2 font-mono text-[11px] text-muted">
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="h-3 w-3 text-accent" />
                <span className="text-foreground">{generated.llmProvider}</span>
                <span className="text-muted-soft">/</span>
                <span className="text-foreground">{generated.llmModel}</span>
              </div>
              <span className="text-muted-soft">·</span>
              <span>{generated.tokensUsed} tokens</span>
              <span className="text-muted-soft">·</span>
              <span>{generated.costEur} EUR</span>
            </div>

            <div className="space-y-2">
              {generated.questions.map((q) => (
                <QuestionPreview key={q.id} q={q} />
              ))}
            </div>
            <Button onClick={handleGoReview} variant="cta" size="lg" className="mt-6">
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

function QuestionPreview({ q }: { q: Question }) {
  const tone =
    q.type === 'QCM' ? 'info' : q.type === 'CODE' ? 'warning' : 'success';
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background-soft px-4 py-3 transition-colors hover:bg-surface">
      <Badge tone={tone} variant="mono">
        {q.type}
      </Badge>
      <div className="flex-1">
        <p className="text-sm text-foreground">
          {q.statement || (
            <em className="text-muted">(enonce dans le payload)</em>
          )}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">
          difficulte : {q.difficulty}/5
        </p>
      </div>
    </div>
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
