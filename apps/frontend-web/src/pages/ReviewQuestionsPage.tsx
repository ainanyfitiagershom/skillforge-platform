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
  Send,
  Link2,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const PROFILE_LABELS: Record<string, string> = {
  DEV_PHP: 'Développeur PHP',
  INT_WORDPRESS: 'Intégrateur WordPress',
  DEV_VUE: 'Développeur Vue.js',
  SEO_TECH: 'Spécialiste SEO technique',
};

export function ReviewQuestionsPage() {
  const [groups, setGroups] = useState<CandidateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ q: ReviewQuestion; testId: string } | null>(null);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [validating, setValidating] = useState<string | null>(null);

  const [invitingTestId, setInvitingTestId] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<{ token: string; expiresAt: string } | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const openInvite = (testId: string) => {
    setInvitingTestId(testId);
    setInvitation(null);
    setInviteError(null);
  };

  const closeInvite = () => {
    setInvitingTestId(null);
    setInvitation(null);
    setInviteError(null);
    setInviting(false);
  };

  const generateInvitation = async () => {
    if (!invitingTestId) return;
    setInviting(true);
    setInviteError(null);
    try {
      const res = await api.inviteCandidate(invitingTestId);
      setInvitation({ token: res.token, expiresAt: res.expiresAt });
    } catch (err) {
      setInviteError(err instanceof ApiError ? err.message : "Erreur lors de la création de l'invitation");
    } finally {
      setInviting(false);
    }
  };

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

  const remove = async (q: ReviewQuestion) => {
    if (!confirm('Supprimer définitivement cette question ?')) return;
    try {
      await api.deleteQuestion(q.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  /** One-click : approuve toutes les questions PENDING du test puis ouvre le modal invitation. */
  const validateAndInvite = async (group: CandidateGroup) => {
    setValidating(group.testId);
    setError(null);
    try {
      const pending = group.questions.filter((q) => q.status === 'PENDING_REVIEW');
      if (pending.length > 0) {
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
      }
      openInvite(group.testId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur lors de la validation');
    } finally {
      setValidating(null);
    }
  };

  const removeTest = async (group: CandidateGroup) => {
    const label = group.candidateName ?? group.candidateEmail;
    if (!confirm(`Supprimer définitivement le test pour ${label} (${group.questions.length} questions) ?`))
      return;
    try {
      await Promise.all(group.questions.map((q) => api.deleteQuestion(q.id)));
      await load();
      if (expandedTestId === group.testId) setExpandedTestId(null);
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

  const stats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    for (const g of groups) {
      for (const q of g.questions) {
        if (q.status === 'PENDING_REVIEW') pending++;
        else if (q.status === 'APPROVED') approved++;
      }
    }
    return { pending, approved, totalTests: groups.length };
  }, [groups]);

  const invitingGroup = useMemo(
    () => groups.find((g) => g.testId === invitingTestId) ?? null,
    [groups, invitingTestId],
  );

  if (loading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center px-6 py-24">
        <div className="flex items-center gap-3 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement des tests à valider…
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-soft text-muted">
          <Inbox className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tighter text-foreground">
          Aucun test à valider
        </h2>
        <p className="mt-3 text-sm text-muted">
          Démarrez un nouveau test depuis le menu pour générer des questions.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-6 py-8 xl:px-10">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="accent" className="mb-3">
            <ClipboardList className="h-3 w-3" />
            Tests générés par l'IA
          </Badge>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {stats.pending > 0 ? (
              <>
                {stats.pending} question{stats.pending > 1 ? 's' : ''} en attente{' '}
                <span className="text-muted">de validation</span>
              </>
            ) : (
              <>Tout est validé.</>
            )}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {stats.totalTests} test{stats.totalTests > 1 ? 's' : ''} généré
            {stats.totalTests > 1 ? 's' : ''}
            {stats.approved > 0 && ` · ${stats.approved} question${stats.approved > 1 ? 's' : ''} déjà approuvée${stats.approved > 1 ? 's' : ''}`}
          </p>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {/* Grille responsive : 1/2/3 cols selon largeur. Une card depliee prend toute la largeur */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => {
          const isExpanded = expandedTestId === g.testId;
          return (
            <div key={g.testId} className={cn(isExpanded && 'md:col-span-2 xl:col-span-3')}>
              <TestCard
                group={g}
                expanded={isExpanded}
                onToggleExpand={() =>
                  setExpandedTestId(isExpanded ? null : g.testId)
                }
                validating={validating === g.testId}
                onValidateAndInvite={() => validateAndInvite(g)}
                onInviteOnly={() => openInvite(g.testId)}
                onDeleteTest={() => removeTest(g)}
                onApproveQuestion={(q) => updateStatus(q, 'APPROVED')}
                onRejectQuestion={(q) => updateStatus(q, 'REJECTED')}
                onRemoveQuestion={remove}
                onEditQuestion={(q) => setEditing({ q, testId: g.testId })}
              />
            </div>
          );
        })}
      </div>

      {editing && (
        <EditModal
          question={editing.q}
          onChange={(q) => setEditing({ ...editing, q })}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}

      {invitingTestId && invitingGroup && (
        <InvitationModal
          candidateEmail={invitingGroup.candidateEmail}
          candidateName={invitingGroup.candidateName}
          invitation={invitation}
          inviting={inviting}
          error={inviteError}
          onGenerate={generateInvitation}
          onClose={closeInvite}
        />
      )}
    </div>
  );
}

// Palette des types de questions : pastilles colorees dans la preview.
const TYPE_DOT_COLORS: Record<ReviewQuestion['type'], string> = {
  QCM: 'bg-sky-500',
  CODE: 'bg-amber-500',
  CAS_PRATIQUE: 'bg-violet-500',
};

const TYPE_LABELS: Record<ReviewQuestion['type'], string> = {
  QCM: 'QCM',
  CODE: 'Code',
  CAS_PRATIQUE: 'Cas pratique',
};

const AVATAR_GRADIENTS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-fuchsia-400 to-pink-600',
];

function initialsOf(name: string | null, email: string): string {
  const base = (name ?? email).trim();
  if (!base) return '?';
  const parts = base.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return base.slice(0, 1).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function gradientOf(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum = (sum + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

function TestCard({
  group,
  expanded,
  validating,
  onToggleExpand,
  onValidateAndInvite,
  onInviteOnly,
  onDeleteTest,
  onApproveQuestion,
  onRejectQuestion,
  onRemoveQuestion,
  onEditQuestion,
}: {
  group: CandidateGroup;
  expanded: boolean;
  validating: boolean;
  onToggleExpand: () => void;
  onValidateAndInvite: () => void;
  onInviteOnly: () => void;
  onDeleteTest: () => void;
  onApproveQuestion: (q: ReviewQuestion) => void;
  onRejectQuestion: (q: ReviewQuestion) => void;
  onRemoveQuestion: (q: ReviewQuestion) => void;
  onEditQuestion: (q: ReviewQuestion) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const q of group.questions) {
      if (q.status === 'PENDING_REVIEW') c.pending++;
      else if (q.status === 'APPROVED') c.approved++;
      else if (q.status === 'REJECTED') c.rejected++;
    }
    return c;
  }, [group.questions]);

  const byType = useMemo(() => {
    const g: Record<ReviewQuestion['type'], ReviewQuestion[]> = {
      QCM: [],
      CODE: [],
      CAS_PRATIQUE: [],
    };
    for (const q of group.questions) g[q.type].push(q);
    return g;
  }, [group.questions]);

  const avgDifficulty = useMemo(() => {
    if (group.questions.length === 0) return 0;
    const sum = group.questions.reduce((a, q) => a + q.difficulty, 0);
    return Math.round((sum / group.questions.length) * 10) / 10;
  }, [group.questions]);

  const allApproved = counts.pending === 0 && counts.approved > 0;
  const profileLabel = PROFILE_LABELS[group.profileCode] ?? group.profileCode;
  const createdDate = new Date(group.testCreatedAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const initials = initialsOf(group.candidateName, group.candidateEmail);
  const gradient = gradientOf(group.candidateEmail);

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* HEADER : identite candidat + menu */}
      <div className="flex items-start gap-4 p-6">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-md',
            gradient,
          )}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {group.candidateName ?? group.candidateEmail}
            </h3>
            {allApproved && (
              <Badge tone="success" variant="mono">
                <Check className="h-3 w-3" />
                Validé
              </Badge>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {group.candidateEmail}
            </span>
            <span>·</span>
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
        </div>

        {/* Menu contextuel */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-soft hover:text-foreground"
            title="Plus d'actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-2xl border border-border bg-surface py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteTest();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-danger transition-colors hover:bg-danger/5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer ce test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW : pastilles par type + stats */}
      <div className="border-t border-border bg-background-soft/40 px-6 py-4">
        <div className="mb-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          {(['QCM', 'CODE', 'CAS_PRATIQUE'] as const).map((type) =>
            byType[type].length > 0 ? (
              <TypePreview key={type} type={type} questions={byType[type]} />
            ) : null,
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span>
            <strong className="text-foreground">{group.questions.length}</strong> question
            {group.questions.length > 1 ? 's' : ''} au total
          </span>
          <span>·</span>
          <span>
            Difficulté moyenne{' '}
            <strong className="text-foreground">{avgDifficulty.toFixed(1)}/5</strong>
          </span>
          {counts.pending > 0 && (
            <>
              <span>·</span>
              <span className="text-amber-700 dark:text-amber-400">
                {counts.pending} en attente
              </span>
            </>
          )}
          {counts.approved > 0 && (
            <>
              <span>·</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                {counts.approved} approuvée{counts.approved > 1 ? 's' : ''}
              </span>
            </>
          )}
          {counts.rejected > 0 && (
            <>
              <span>·</span>
              <span className="text-rose-700 dark:text-rose-400">
                {counts.rejected} refusée{counts.rejected > 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ACTIONS PRINCIPALES */}
      <div className="grid gap-2 border-t border-border bg-surface p-4 sm:grid-cols-[1fr_auto_auto]">
        {allApproved ? (
          <Button variant="cta" size="lg" onClick={onInviteOnly} disabled={validating}>
            <Send className="h-4 w-4" />
            Envoyer l'invitation
          </Button>
        ) : (
          <Button
            variant="cta"
            size="lg"
            onClick={onValidateAndInvite}
            disabled={validating || group.questions.length === 0}
          >
            {validating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validation en cours…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Valider et envoyer ({counts.pending})
              </>
            )}
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={onToggleExpand}>
          <Eye className="h-4 w-4" />
          {expanded ? 'Masquer' : 'Réviser'} le détail
        </Button>
      </div>

      {/* DETAIL DEPLIABLE */}
      {expanded && (
        <div className="border-t border-border bg-background-soft/30 px-6 py-5">
          <div className="space-y-3">
            {group.questions.map((q) => (
              <QuestionRow
                key={q.id}
                question={q}
                onApprove={() => onApproveQuestion(q)}
                onReject={() => onRejectQuestion(q)}
                onRemove={() => onRemoveQuestion(q)}
                onEdit={() => onEditQuestion(q)}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function TypePreview({
  type,
  questions,
}: {
  type: ReviewQuestion['type'];
  questions: ReviewQuestion[];
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {questions.map((q) => (
          <span
            key={q.id}
            title={`${TYPE_LABELS[type]} · Difficulté ${q.difficulty}/5 · ${q.status === 'PENDING_REVIEW' ? 'En attente' : q.status === 'APPROVED' ? 'Approuvée' : 'Refusée'}`}
            className={cn(
              'inline-block h-2.5 w-2.5 rounded-full transition-transform hover:scale-125',
              TYPE_DOT_COLORS[type],
              q.status === 'REJECTED' && 'opacity-30',
              q.status === 'PENDING_REVIEW' && 'ring-2 ring-amber-300 dark:ring-amber-500',
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted">
        {questions.length} {TYPE_LABELS[type]}
      </span>
    </div>
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
    if (question.status === 'APPROVED') return <Badge tone="success">Approuvée</Badge>;
    if (question.status === 'REJECTED') return <Badge tone="danger">Refusée</Badge>;
    return <Badge tone="warning">En attente</Badge>;
  }, [question.status]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-background-soft font-mono text-xs font-bold text-muted hover:text-foreground"
          title={open ? 'Replier' : 'Déplier'}
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
              Difficulté {question.difficulty}/5
            </Badge>
            {statusBadge}
          </div>
          <p className="text-sm leading-6 text-foreground">
            {question.statement || (
              <em className="text-muted">(énoncé dans le payload)</em>
            )}
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            title="Éditer"
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
            <CardTitle>Éditer la question</CardTitle>
            <CardDescription>
              Modifiez l'énoncé, la difficulté ou le payload JSON.
            </CardDescription>
          </div>
        </CardHeader>
        <CardBody className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
              Énoncé
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
              Difficulté (1 à 5)
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
            Squelette proposé au candidat
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
            Aucun starterCode généré.
          </div>
        )}

        {parsed.hiddenTests && (
          <details className="rounded-xl border border-border bg-surface">
            <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground">
              <FlaskConical className="h-3.5 w-3.5 text-accent" />
              Tests cachés (exécutés en sandbox)
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
            Scénario
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

function InvitationModal({
  candidateEmail,
  candidateName,
  invitation,
  inviting,
  error,
  onGenerate,
  onClose,
}: {
  candidateEmail: string;
  candidateName: string | null;
  invitation: { token: string; expiresAt: string } | null;
  inviting: boolean;
  error: string | null;
  onGenerate: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const link = invitation
    ? `${window.location.origin}/candidate/passation/${invitation.token}`
    : '';

  const expiresLabel = invitation
    ? new Date(invitation.expiresAt).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard refuse en non-HTTPS, l utilisateur peut selectionner manuellement */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-md">
      <Card variant="elevated" className="w-full max-w-xl animate-fade-in-up">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-4 w-4 text-accent" />
              Envoyer l'invitation
            </CardTitle>
            <CardDescription>
              {invitation
                ? 'Lien généré — copiez-le et transmettez-le au candidat par email.'
                : 'Un lien unique sera créé pour ce test, valable 24 heures.'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardBody className="space-y-5">
          <div className="rounded-2xl border border-border bg-background-soft px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Destinataire
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">
              {candidateName ?? candidateEmail}
            </div>
            {candidateName && (
              <div className="text-xs text-muted">{candidateEmail}</div>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {invitation ? (
            <>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Lien du candidat
                </label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={link}
                    onFocus={(e) => e.currentTarget.select()}
                    className="block flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 font-mono text-xs text-foreground focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
                  />
                  <Button
                    type="button"
                    variant={copied ? 'primary' : 'secondary'}
                    size="md"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5" />
                        Copier
                      </>
                    )}
                  </Button>
                </div>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  Expire le {expiresLabel}
                </p>
              </div>

              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-accent-strong hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Tester le lien dans un nouvel onglet
              </a>
            </>
          ) : (
            <p className="text-sm text-muted">
              En cliquant sur « Générer le lien », le système crée une invitation
              à usage unique. Le lien ne fonctionnera que pour ce test et
              expirera dans 24 heures.
            </p>
          )}
        </CardBody>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <Button variant="ghost" onClick={onClose}>
            {invitation ? 'Fermer' : 'Annuler'}
          </Button>
          {!invitation && (
            <Button variant="cta" onClick={onGenerate} disabled={inviting}>
              {inviting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Générer le lien
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
