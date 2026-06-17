import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CodeEditor } from '@/components/CodeEditor';
import { ApiError, CandidateGroup, Question, ReviewQuestion, api } from '@/lib/api';
import {
  Check,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  Inbox,
  Code2,
  ListChecks,
  FlaskConical,
  Mail,
  Calendar,
  BriefcaseBusiness,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const PROFILE_LABELS: Record<string, string> = {
  DEV_PHP: 'Developpeur PHP',
  INT_WORDPRESS: 'Integrateur WordPress',
  DEV_VUE: 'Developpeur Vue.js',
  SEO_TECH: 'Specialiste SEO technique',
};

export function ReviewQuestionsPage() {
  const [groups, setGroups] = useState<CandidateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ q: ReviewQuestion; testId: string } | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const autoSelectedRef = useRef(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setGroups(await api.reviewByCandidate());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (autoSelectedRef.current || groups.length === 0) return;
    const firstPending = groups.find((g) =>
      g.questions.some((q) => q.status === 'PENDING_REVIEW'),
    );
    setSelectedTestId((firstPending ?? groups[0]).testId);
    autoSelectedRef.current = true;
  }, [groups]);

  const updateStatus = async (q: ReviewQuestion, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.updateQuestion(q.id, {
        type: q.type,
        statement: q.statement,
        difficulty: q.difficulty,
        jsonPayload: q.jsonPayload,
        status,
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  const bulkApprove = async (questions: ReviewQuestion[]) => {
    const pending = questions.filter((q) => q.status === 'PENDING_REVIEW');
    if (pending.length === 0) return;
    if (!confirm(`Approuver les ${pending.length} questions en attente ?`)) return;
    try {
      await Promise.all(
        pending.map((q) =>
          api.updateQuestion(q.id, {
            type: q.type,
            statement: q.statement,
            difficulty: q.difficulty,
            jsonPayload: q.jsonPayload,
            status: 'APPROVED',
          }),
        ),
      );
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  const remove = async (q: ReviewQuestion) => {
    if (!confirm('Supprimer definitivement cette question ?')) return;
    try {
      await api.deleteQuestion(q.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.updateQuestion(editing.q.id, {
        type: editing.q.type,
        statement: editing.q.statement,
        difficulty: editing.q.difficulty,
        jsonPayload: editing.q.jsonPayload,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  const totalPending = useMemo(
    () =>
      groups.reduce(
        (acc, g) => acc + g.questions.filter((q) => q.status === 'PENDING_REVIEW').length,
        0,
      ),
    [groups],
  );

  const current = useMemo(
    () => groups.find((g) => g.testId === selectedTestId) ?? null,
    [groups, selectedTestId],
  );

  if (!loading && groups.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-soft text-muted">
          <Inbox className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tighter text-foreground">
          Aucun test en attente
        </h2>
        <p className="mt-3 text-sm text-muted">
          Demarrez un nouveau test depuis le menu pour generer des questions a
          valider.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden">
      {/* ============ Sidebar candidats ============ */}
      <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <div className="mb-1 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-accent" />
            <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
              Banque de questions
            </h2>
          </div>
          <p className="text-xs text-muted">
            {loading
              ? 'Chargement…'
              : `${groups.length} test${groups.length > 1 ? 's' : ''} · ${totalPending} en attente`}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {groups.map((g) => (
            <CandidateSidebarItem
              key={g.testId}
              group={g}
              active={g.testId === selectedTestId}
              onSelect={() => setSelectedTestId(g.testId)}
            />
          ))}
        </div>
      </aside>

      {/* ============ Detail panel ============ */}
      <section className="flex flex-1 flex-col overflow-hidden">
        {error && (
          <div className="border-b border-danger/30 bg-danger/5 px-6 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {current ? (
          <CandidateDetailPanel
            group={current}
            onApprove={(q) => updateStatus(q, 'APPROVED')}
            onReject={(q) => updateStatus(q, 'REJECTED')}
            onBulkApprove={() => bulkApprove(current.questions)}
            onRemove={remove}
            onEdit={(q) => setEditing({ q, testId: current.testId })}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="text-sm text-muted">
              Selectionnez un candidat dans la liste de gauche.
            </p>
          </div>
        )}
      </section>

      {editing && (
        <EditModal
          question={editing.q}
          onChange={(q) => setEditing({ ...editing, q })}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

function CandidateSidebarItem({
  group,
  active,
  onSelect,
}: {
  group: CandidateGroup;
  active: boolean;
  onSelect: () => void;
}) {
  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const q of group.questions) {
      if (q.status === 'PENDING_REVIEW') c.pending++;
      else if (q.status === 'APPROVED') c.approved++;
      else if (q.status === 'REJECTED') c.rejected++;
    }
    return c;
  }, [group.questions]);

  const profileLabel = PROFILE_LABELS[group.profileCode] ?? group.profileCode;
  const createdDate = new Date(group.testCreatedAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'block w-full border-l-2 px-5 py-3 text-left transition-colors',
        active
          ? 'border-l-accent bg-accent-soft/40'
          : 'border-l-transparent hover:bg-background-soft/60',
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3
          className={cn(
            'truncate text-sm font-semibold tracking-tight',
            active ? 'text-foreground' : 'text-foreground',
          )}
        >
          {group.candidateName ?? group.candidateEmail}
        </h3>
        {counts.pending > 0 && (
          <Badge tone="warning" variant="mono" className="shrink-0">
            {counts.pending}
          </Badge>
        )}
        {counts.pending === 0 && counts.approved > 0 && (
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1">
          <BriefcaseBusiness className="h-3 w-3" />
          {profileLabel}
        </span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {createdDate}
        </span>
      </div>
    </button>
  );
}

function CandidateDetailPanel({
  group,
  onApprove,
  onReject,
  onBulkApprove,
  onRemove,
  onEdit,
}: {
  group: CandidateGroup;
  onApprove: (q: ReviewQuestion) => void;
  onReject: (q: ReviewQuestion) => void;
  onBulkApprove: () => void;
  onRemove: (q: ReviewQuestion) => void;
  onEdit: (q: ReviewQuestion) => void;
}) {
  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const q of group.questions) {
      if (q.status === 'PENDING_REVIEW') c.pending++;
      else if (q.status === 'APPROVED') c.approved++;
      else if (q.status === 'REJECTED') c.rejected++;
    }
    return c;
  }, [group.questions]);

  const profileLabel = PROFILE_LABELS[group.profileCode] ?? group.profileCode;
  const createdDate = new Date(group.testCreatedAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <header className="border-b border-border bg-surface px-8 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {group.candidateName ?? group.candidateEmail}
              </h2>
              {counts.pending > 0 && (
                <Badge tone="warning" variant="mono">
                  {counts.pending} en attente
                </Badge>
              )}
              {counts.approved > 0 && (
                <Badge tone="success" variant="mono">
                  {counts.approved} OK
                </Badge>
              )}
              {counts.rejected > 0 && (
                <Badge tone="danger" variant="mono">
                  {counts.rejected} refusees
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {group.candidateEmail}
              </span>
              <span className="inline-flex items-center gap-1">
                <BriefcaseBusiness className="h-3 w-3" />
                {profileLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {createdDate}
              </span>
            </div>
          </div>

          {counts.pending > 0 && (
            <Button variant="cta" size="md" onClick={onBulkApprove}>
              <Check className="h-3.5 w-3.5" />
              Tout approuver ({counts.pending})
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-background-soft/30 px-8 py-6">
        <div className="space-y-3">
          {group.questions.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              onApprove={() => onApprove(q)}
              onReject={() => onReject(q)}
              onRemove={() => onRemove(q)}
              onEdit={() => onEdit(q)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function QuestionRow({
  question,
  onApprove,
  onReject,
  onRemove,
  onEdit,
}: {
  question: ReviewQuestion;
  onApprove: () => void;
  onReject: () => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);

  const typeTone =
    question.type === 'QCM' ? 'info' : question.type === 'CODE' ? 'warning' : 'success';

  const statusBadge = useMemo(() => {
    if (question.status === 'APPROVED') return <Badge tone="success">Approuvee</Badge>;
    if (question.status === 'REJECTED') return <Badge tone="danger">Refusee</Badge>;
    return <Badge tone="warning">En attente</Badge>;
  }, [question.status]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-soft font-mono text-xs font-bold text-muted hover:text-foreground"
          title={open ? 'Replier' : 'Deplier'}
        >
          {String(question.position).padStart(2, '0')}
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="min-w-0 text-left"
        >
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Badge tone={typeTone} variant="mono">
              {question.type}
            </Badge>
            <Badge tone="muted" variant="mono">
              Diff {question.difficulty}/5
            </Badge>
            {statusBadge}
          </div>
          <p className="text-sm leading-6 text-foreground">
            {question.statement || (
              <em className="text-muted">(enonce dans le payload)</em>
            )}
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            title="Editer"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-background-soft hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {question.status !== 'APPROVED' && (
            <button
              type="button"
              onClick={onApprove}
              title="Approuver"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          {question.status !== 'REJECTED' && (
            <button
              type="button"
              onClick={onReject}
              title="Refuser"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-background-soft hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            title="Supprimer"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background-soft/40 px-4 py-4">
          <QuestionPayloadPreview type={question.type} jsonPayload={question.jsonPayload} />
        </div>
      )}
    </div>
  );
}

function EditModal({
  question,
  onChange,
  onCancel,
  onSave,
}: {
  question: ReviewQuestion;
  onChange: (q: ReviewQuestion) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-md">
      <Card variant="elevated" className="w-full max-w-2xl animate-fade-in-up">
        <CardHeader>
          <div>
            <CardTitle>Editer la question</CardTitle>
            <CardDescription>
              Modifiez l'enonce, la difficulte ou le payload JSON.
            </CardDescription>
          </div>
        </CardHeader>
        <CardBody className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Enonce
            </label>
            <textarea
              className="block w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
              rows={3}
              value={question.statement}
              onChange={(e) => onChange({ ...question, statement: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Difficulte (1 a 5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={question.difficulty}
              onChange={(e) => onChange({ ...question, difficulty: Number(e.target.value) })}
              className="block w-24 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Payload JSON
            </label>
            <textarea
              className="block w-full rounded-xl border border-border bg-background-soft px-4 py-3 font-mono text-[11px] text-foreground transition-all focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
              rows={8}
              value={question.jsonPayload}
              onChange={(e) => onChange({ ...question, jsonPayload: e.target.value })}
            />
          </div>
        </CardBody>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="cta" onClick={onSave}>
            Enregistrer
          </Button>
        </div>
      </Card>
    </div>
  );
}

type ParsedPayload = {
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  language?: string;
  starterCode?: string;
  hiddenTests?: string;
  scenario?: string;
  expectedAnswerPoints?: string[];
};

function QuestionPayloadPreview({
  type,
  jsonPayload,
}: {
  type: Question['type'];
  jsonPayload: string;
}) {
  const parsed = useMemo<ParsedPayload | null>(() => {
    try {
      return JSON.parse(jsonPayload) as ParsedPayload;
    } catch {
      return null;
    }
  }, [jsonPayload]);

  if (!parsed) {
    return (
      <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-3 font-mono text-[11px] text-muted">
        {jsonPayload}
      </pre>
    );
  }

  if (type === 'QCM') {
    return (
      <div className="space-y-2">
        {(parsed.options ?? []).map((opt, i) => {
          const correct = parsed.correctIndex === i;
          return (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-3 py-2 text-sm',
                correct
                  ? 'border-emerald-300 bg-emerald-50 text-foreground dark:border-emerald-900 dark:bg-emerald-950/30'
                  : 'border-border bg-surface text-foreground',
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {correct && (
                <Badge tone="success" variant="mono">
                  Correct
                </Badge>
              )}
            </div>
          );
        })}
        {parsed.explanation && (
          <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
            <span className="font-semibold text-foreground">Explication : </span>
            {parsed.explanation}
          </p>
        )}
      </div>
    );
  }

  if (type === 'CODE') {
    const lang = (parsed.language?.toUpperCase() as 'PHP' | 'JS') ?? 'JS';
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{lang}</Badge>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Squelette propose au candidat
          </span>
        </div>

        {parsed.starterCode ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <CodeEditor
              language={lang}
              value={parsed.starterCode}
              onChange={() => {}}
              height="220px"
              readOnly
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 p-3 text-xs text-warning">
            Aucun starterCode genere.
          </div>
        )}

        {parsed.hiddenTests && (
          <details className="rounded-xl border border-border bg-surface">
            <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground">
              <FlaskConical className="h-3.5 w-3.5 text-accent" />
              Tests caches (executes en sandbox)
            </summary>
            <div className="border-t border-border">
              <CodeEditor
                language={lang}
                value={parsed.hiddenTests}
                onChange={() => {}}
                height="140px"
                readOnly
              />
            </div>
          </details>
        )}

        {parsed.explanation && (
          <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
            <span className="font-semibold text-foreground">Explication : </span>
            {parsed.explanation}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {parsed.scenario && (
        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <Code2 className="h-3 w-3" />
            Scenario
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground">{parsed.scenario}</p>
        </div>
      )}
      {parsed.expectedAnswerPoints && parsed.expectedAnswerPoints.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            <ListChecks className="h-3 w-3" />
            Points attendus
          </div>
          <ul className="ml-4 list-disc space-y-1 text-sm text-foreground">
            {parsed.expectedAnswerPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {parsed.explanation && (
        <p className="rounded-xl border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
          <span className="font-semibold text-foreground">Explication : </span>
          {parsed.explanation}
        </p>
      )}
    </div>
  );
}
