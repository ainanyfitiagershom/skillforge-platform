import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ApiError,
  ExtractedSkill,
  GenerateResponse,
  Question,
  api,
} from '@/lib/api';
import { CheckCircle2, FileUp, Sparkles, X } from 'lucide-react';
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

  const handleGoReview = () => navigate('/review');

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="muted" className="mb-2">
          /new-test
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Nouveau test pour un candidat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Etape 1 : televerser le CV. Etape 2 : valider les competences. Etape 3 : generer
          et revoir les questions.
        </p>
      </div>

      {/* Indicateur d'etapes */}
      <Steps
        current={
          generated ? 3 : skills ? 2 : 1
        }
      />

      {/* ETAPE 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">01.</span>
            CV et profil cible
          </CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  profil cible
                </label>
                <select
                  value={profileCode}
                  onChange={(e) => setProfileCode(e.target.value)}
                  className="block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {PROFILES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  email du candidat
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
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  nom complet
                </label>
                <Input
                  value={candidateDisplayName}
                  onChange={(e) => setCandidateDisplayName(e.target.value)}
                  required
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  fichier cv (pdf ou docx)
                </label>
                <Input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={analyzing || !file}>
              <FileUp className="h-4 w-4" />
              {analyzing ? (
                <span className="font-mono">$ analyzing CV…</span>
              ) : (
                'Analyser le CV'
              )}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* ETAPE 2 */}
      {skills && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">02.</span>
              Competences detectees
            </CardTitle>
          </CardHeader>
          <CardBody>
            {llmInfo && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                provider: <span className="text-foreground">{llmInfo.provider}</span>
                <span>·</span>
                tokens: <span className="text-foreground">{llmInfo.tokens}</span>
                <span>·</span>
                cost: <span className="text-foreground">{llmInfo.cost} EUR</span>
              </div>
            )}
            <p className="mb-3 text-sm text-muted-foreground">
              Cliquez sur une competence pour l'inclure ou l'exclure de la generation du test.
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => {
                const selected = selectedSkills.has(s.skillCode);
                return (
                  <button
                    key={s.skillCode}
                    onClick={() => toggleSkill(s.skillCode)}
                    type="button"
                    className={cn(
                      'group inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground',
                    )}
                  >
                    {selected ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3 opacity-50" />
                    )}
                    {s.displayName}
                    <span
                      className={cn(
                        'font-mono text-[9px]',
                        selected ? 'text-primary-foreground/70' : 'text-muted-foreground',
                      )}
                    >
                      ({s.level.toLowerCase()})
                    </span>
                  </button>
                );
              })}
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating || selectedSkills.size === 0}
              className="mt-5"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? (
                <span className="font-mono">$ generating questions…</span>
              ) : (
                'Generer le test'
              )}
            </Button>
          </CardBody>
        </Card>
      )}

      {/* ETAPE 3 */}
      {generated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">03.</span>
              Questions generees
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              provider: <span className="text-foreground">{generated.llmProvider}</span>
              <span>·</span>
              model: <span className="text-foreground">{generated.llmModel}</span>
              <span>·</span>
              tokens: <span className="text-foreground">{generated.tokensUsed}</span>
              <span>·</span>
              cost: <span className="text-foreground">{generated.costEur} EUR</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {generated.questions.length} questions creees en statut PENDING_REVIEW. Vous
              pouvez les editer ou les supprimer sur la page « Revoir les questions ».
            </p>
            <div className="space-y-2">
              {generated.questions.map((q) => (
                <QuestionPreview key={q.id} q={q} />
              ))}
            </div>
            <Button onClick={handleGoReview} className="mt-5">
              Aller a la revue des questions
            </Button>
          </CardBody>
        </Card>
      )}

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2 font-mono text-xs text-danger">
          ✗ {error}
        </div>
      )}
    </div>
  );
}

function QuestionPreview({ q }: { q: Question }) {
  const tone =
    q.type === 'QCM' ? 'info' : q.type === 'CODE' ? 'warning' : 'success';
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5">
      <Badge tone={tone}>{q.type}</Badge>
      <div className="flex-1">
        <p className="text-sm">{q.statement || <em className="text-muted-foreground">(enonce dans le payload)</em>}</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          difficulty: {q.difficulty}/5
        </p>
      </div>
    </div>
  );
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: 'Televerser CV' },
    { num: 2, label: 'Valider competences' },
    { num: 3, label: 'Generer questions' },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const active = current >= s.num;
        return (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] font-medium transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground',
              )}
            >
              {s.num}
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-px w-8 transition-colors',
                  current > s.num ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
