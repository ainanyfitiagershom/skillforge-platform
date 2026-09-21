import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CodeEditor } from '@/components/CodeEditor';
import { ApiError, CandidateGroup, ReviewQuestion, api } from '@/lib/api';
import {
  Check,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  Inbox,
  FlaskConical,
  Mail,
  Calendar,
  BriefcaseBusiness,
  Send,
  Link2,
  Loader2,
  ExternalLink,
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
  const [invitation, setInvitation] = useState<{
    token: string;
    expiresAt: string;
    accessCode: string | null;
    emailSent: boolean;
    candidateEmail: string | null;
  } | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  // Modale d avertissement quand le candidat a deja passe d autres tests.
  // openInvite() la declenche automatiquement si previousSubmissionsCount > 0.
  const [reinviteWarningFor, setReinviteWarningFor] = useState<string | null>(null);
  // Modale de detail : liste des questions du test choisi (remplace l ancien expand).
  const [detailTestId, setDetailTestId] = useState<string | null>(null);

  const openInvite = (testId: string, bypassWarning = false) => {
    const group = groups.find((g) => g.testId === testId);
    if (!bypassWarning && group && group.previousSubmissionsCount > 0) {
      setReinviteWarningFor(testId);
      return;
    }
    setReinviteWarningFor(null);
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
      setInvitation({
        token: res.token,
        expiresAt: res.expiresAt,
        accessCode: res.accessCode,
        emailSent: res.emailSent,
        candidateEmail: res.candidateEmail,
      });
    } catch (err) {
      setInviteError(err instanceof ApiError ? err.message : "Erreur lors de la création de l’invitation");
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
      // openInvite gere lui-meme le check "candidat deja evalue" -> warning avant.
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
      if (detailTestId === group.testId) setDetailTestId(null);
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
            Tests générés par l’IA
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

      <TestsTable
        groups={groups}
        validating={validating}
        onOpenDetail={(testId) => setDetailTestId(testId)}
        onValidateAndInvite={validateAndInvite}
        onInviteOnly={(testId) => openInvite(testId)}
        onDeleteTest={removeTest}
      />

      {detailTestId && (() => {
        const g = groups.find((x) => x.testId === detailTestId);
        if (!g) return null;
        return (
          <TestDetailModal
            group={g}
            validating={validating === g.testId}
            onClose={() => setDetailTestId(null)}
            onApproveQuestion={(q) => updateStatus(q, 'APPROVED')}
            onRejectQuestion={(q) => updateStatus(q, 'REJECTED')}
            onRemoveQuestion={remove}
            onEditQuestion={(q) => setEditing({ q, testId: g.testId })}
            onValidateAndInvite={() => validateAndInvite(g)}
            onInviteOnly={() => openInvite(g.testId)}
            onDeleteTest={() => removeTest(g)}
          />
        );
      })()}

      {editing && (
        <EditModal
          question={editing.q}
          onChange={(q) => setEditing({ ...editing, q })}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}

      {reinviteWarningFor && (() => {
        const g = groups.find((x) => x.testId === reinviteWarningFor);
        if (!g) return null;
        return (
          <ReinviteWarningModal
            candidateName={g.candidateName ?? g.candidateEmail}
            previousCount={g.previousSubmissionsCount}
            onCancel={() => setReinviteWarningFor(null)}
            onConfirm={() => openInvite(g.testId, true)}
          />
        );
      })()}

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

/* -------------------------------------------------------------------------- */
/*  Tableau principal : filtres par colonne + tri + pagination                */
/* -------------------------------------------------------------------------- */

type TestStatus = 'EMPTY' | 'PENDING' | 'READY' | 'SENT' | 'SUBMITTED';

function deriveStatus(g: CandidateGroup): TestStatus {
  if (g.testSubmittedAt) return 'SUBMITTED';
  if (g.invitationSentAt) return 'SENT';
  const approved = g.questions.filter((q) => q.status === 'APPROVED').length;
  const pending = g.questions.filter((q) => q.status === 'PENDING_REVIEW').length;
  if (pending > 0) return 'PENDING';
  if (approved > 0) return 'READY';
  return 'EMPTY';
}

const STATUS_META: Record<TestStatus, { label: string; tone: 'success' | 'warning' | 'accent' | 'info' | 'muted' }> = {
  SUBMITTED: { label: 'Terminé', tone: 'success' },
  SENT: { label: 'Envoyé', tone: 'accent' },
  PENDING: { label: 'À valider', tone: 'warning' },
  READY: { label: 'Prêt à envoyer', tone: 'info' },
  EMPTY: { label: 'Vide', tone: 'muted' },
};

const ALL_STATUSES: TestStatus[] = ['PENDING', 'READY', 'SENT', 'SUBMITTED', 'EMPTY'];

type SortKey = 'candidate' | 'profile' | 'createdAt' | 'status';
type SortDir = 'asc' | 'desc';
const PAGE_SIZES = [10, 25, 50, 100];

function TestsTable({
  groups,
  validating,
  onOpenDetail,
  onValidateAndInvite,
  onInviteOnly,
  onDeleteTest,
}: {
  groups: CandidateGroup[];
  validating: string | null;
  onOpenDetail: (testId: string) => void;
  onValidateAndInvite: (g: CandidateGroup) => void;
  onInviteOnly: (testId: string) => void;
  onDeleteTest: (g: CandidateGroup) => void;
}) {
  // Filtres par colonne
  const [globalSearch, setGlobalSearch] = useState('');
  const [profileFilter, setProfileFilter] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<TestStatus>>(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Tri
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Pagination
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Options profil disponibles (dérivées des données)
  const availableProfiles = useMemo(() => {
    const set = new Set<string>();
    for (const g of groups) set.add(g.profileCode);
    return Array.from(set).sort();
  }, [groups]);

  // Filtrage
  const filtered = useMemo(() => {
    const search = globalSearch.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() + 24 * 3600 * 1000 : null; // fin de journée incluse

    return groups.filter((g) => {
      // Recherche globale
      if (search) {
        const hay =
          (g.candidateName ?? '').toLowerCase() +
          ' ' +
          g.candidateEmail.toLowerCase() +
          ' ' +
          (PROFILE_LABELS[g.profileCode] ?? g.profileCode).toLowerCase();
        if (!hay.includes(search)) return false;
      }
      // Filtre profil
      if (profileFilter.size > 0 && !profileFilter.has(g.profileCode)) return false;
      // Filtre statut
      if (statusFilter.size > 0 && !statusFilter.has(deriveStatus(g))) return false;
      // Filtre date
      const t = new Date(g.testCreatedAt).getTime();
      if (from != null && t < from) return false;
      if (to != null && t > to) return false;
      return true;
    });
  }, [groups, globalSearch, profileFilter, statusFilter, dateFrom, dateTo]);

  // Tri
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'candidate') {
        cmp = (a.candidateName ?? a.candidateEmail).localeCompare(
          b.candidateName ?? b.candidateEmail,
          'fr',
        );
      } else if (sortKey === 'profile') {
        cmp = (PROFILE_LABELS[a.profileCode] ?? a.profileCode).localeCompare(
          PROFILE_LABELS[b.profileCode] ?? b.profileCode,
          'fr',
        );
      } else if (sortKey === 'createdAt') {
        cmp = new Date(a.testCreatedAt).getTime() - new Date(b.testCreatedAt).getTime();
      } else {
        const order: Record<TestStatus, number> = { PENDING: 0, READY: 1, SENT: 2, SUBMITTED: 3, EMPTY: 4 };
        cmp = order[deriveStatus(a)] - order[deriveStatus(b)];
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // Reset page si les filtres réduisent le résultat
  useEffect(() => {
    setPage(1);
  }, [globalSearch, profileFilter, statusFilter, dateFrom, dateTo, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = sorted.slice(pageStart, pageStart + pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const toggleInSet = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const clearFilters = () => {
    setGlobalSearch('');
    setProfileFilter(new Set());
    setStatusFilter(new Set());
    setDateFrom('');
    setDateTo('');
  };

  const activeFiltersCount =
    (globalSearch ? 1 : 0) +
    profileFilter.size +
    statusFilter.size +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  return (
    <Card className="overflow-hidden">
      {/* Barre unique : recherche + tous les filtres + reset + compteur */}
      <div className="flex flex-wrap items-end gap-3 border-b border-border p-4">
        {/* Recherche globale */}
        <div className="flex flex-col gap-1">
          <FilterLabel>Recherche</FilterLabel>
          <div className="relative w-64">
            <input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Nom, email, profil…"
              className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Filtre profil */}
        <div className="flex flex-col gap-1">
          <FilterLabel>Profil</FilterLabel>
          <div className="min-w-[160px]">
            <MultiSelectFilter
              label="Tous"
              options={availableProfiles.map((p) => ({
                value: p,
                label: PROFILE_LABELS[p] ?? p,
              }))}
              selected={profileFilter}
              onToggle={(v) => toggleInSet(profileFilter, v, setProfileFilter)}
              onClear={() => setProfileFilter(new Set())}
            />
          </div>
        </div>

        {/* Filtre statut */}
        <div className="flex flex-col gap-1">
          <FilterLabel>Statut</FilterLabel>
          <div className="min-w-[160px]">
            <MultiSelectFilter
              label="Tous"
              options={ALL_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))}
              selected={statusFilter}
              onToggle={(v) => toggleInSet(statusFilter, v as TestStatus, setStatusFilter)}
              onClear={() => setStatusFilter(new Set())}
            />
          </div>
        </div>

        {/* Filtre dates */}
        <div className="flex flex-col gap-1">
          <FilterLabel>Créé entre</FilterLabel>
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 rounded-full border border-border bg-background px-3 text-xs text-foreground focus:border-accent focus:outline-none"
              title="Date de début"
            />
            <span className="text-muted">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 rounded-full border border-border bg-background px-3 text-xs text-foreground focus:border-accent focus:outline-none"
              title="Date de fin"
            />
          </div>
        </div>

        {/* Reset + compteur alignés à droite */}
        <div className="ml-auto flex items-center gap-3 pb-1 text-xs text-muted">
          <span>
            <span className="font-semibold text-foreground">{sorted.length}</span> résultat
            {sorted.length > 1 ? 's' : ''}
            {sorted.length !== groups.length && (
              <span className="text-muted"> sur {groups.length}</span>
            )}
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full bg-background-soft px-3 py-1 font-medium text-foreground-soft hover:text-foreground"
            >
              Effacer ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background-soft/60 text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  label="Candidat"
                  active={sortKey === 'candidate'}
                  dir={sortDir}
                  onClick={() => toggleSort('candidate')}
                />
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  label="Profil"
                  active={sortKey === 'profile'}
                  dir={sortDir}
                  onClick={() => toggleSort('profile')}
                />
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  label="Créé le"
                  active={sortKey === 'createdAt'}
                  dir={sortDir}
                  onClick={() => toggleSort('createdAt')}
                />
              </th>
              <th className="px-4 py-3 font-medium">Questions</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader
                  label="Statut"
                  active={sortKey === 'status'}
                  dir={sortDir}
                  onClick={() => toggleSort('status')}
                />
              </th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                  Aucun test ne correspond aux filtres.
                </td>
              </tr>
            )}
            {pageRows.map((g) => {
              const total = g.questions.length;
              const approved = g.questions.filter((q) => q.status === 'APPROVED').length;
              const pending = g.questions.filter((q) => q.status === 'PENDING_REVIEW').length;
              const rejected = g.questions.filter((q) => q.status === 'REJECTED').length;
              const status = deriveStatus(g);
              const isValidating = validating === g.testId;
              const canInvite = status === 'READY' || status === 'SENT';
              const canValidate = status === 'PENDING';
              const isFinal = status === 'SUBMITTED';
              return (
                <tr
                  key={g.testId}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-background-soft/40',
                    isFinal && 'opacity-70',
                  )}
                  onClick={() => onOpenDetail(g.testId)}
                >
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 truncate font-medium text-foreground">
                        {g.candidateName ?? g.candidateEmail}
                        {g.previousSubmissionsCount > 0 && (
                          <span
                            className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            title={`Déjà évalué sur ${g.previousSubmissionsCount} autre test${g.previousSubmissionsCount > 1 ? 's' : ''}`}
                          >
                            Déjà évalué ×{g.previousSubmissionsCount}
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted">{g.candidateEmail}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-3.5 w-3.5" />
                      {PROFILE_LABELS[g.profileCode] ?? g.profileCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {fmtDate(g.testCreatedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {approved} ✓
                      </span>
                      {pending > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          {pending} ⌛
                        </span>
                      )}
                      {rejected > 0 && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                          {rejected} ✗
                        </span>
                      )}
                      <span className="text-muted">/ {total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge tone={STATUS_META[status].tone}>{STATUS_META[status].label}</Badge>
                      {status === 'SENT' && g.invitationSentAt && (
                        <span className="text-[10px] text-muted">
                          envoyé le {fmtDate(g.invitationSentAt)}
                        </span>
                      )}
                      {status === 'SUBMITTED' && g.testSubmittedAt && (
                        <span className="text-[10px] text-muted">
                          rendu le {fmtDate(g.testSubmittedAt)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenDetail(g.testId)}
                        title="Voir les questions"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!isFinal && (
                        <Button
                          variant={canInvite ? 'cta' : 'secondary'}
                          size="sm"
                          onClick={() =>
                            canValidate ? onValidateAndInvite(g) : onInviteOnly(g.testId)
                          }
                          disabled={isValidating || total === 0}
                        >
                          {isValidating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : canInvite ? (
                            <Send className="h-3.5 w-3.5" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          {status === 'SENT' ? 'Renvoyer' : canInvite ? 'Inviter' : 'Valider'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTest(g)}
                        title="Supprimer le test"
                      >
                        <Trash2 className="h-4 w-4 text-muted" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span>Afficher</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-8 rounded-full border border-border bg-background px-3 text-xs text-foreground focus:border-accent focus:outline-none"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>par page</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            {sorted.length === 0
              ? '0 résultat'
              : `${pageStart + 1}–${Math.min(pageStart + pageSize, sorted.length)} sur ${sorted.length}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              className="rounded-full px-2 py-1 text-foreground-soft hover:bg-background-soft disabled:opacity-30"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="rounded-full px-2 py-1 text-foreground-soft hover:bg-background-soft disabled:opacity-30"
            >
              ◀
            </button>
            <span className="px-2 font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-full px-2 py-1 text-foreground-soft hover:bg-background-soft disabled:opacity-30"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="rounded-full px-2 py-1 text-foreground-soft hover:bg-background-soft disabled:opacity-30"
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Petite étiquette au-dessus d'un champ de filtre. */
function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
      {children}
    </span>
  );
}

/** En-tête de colonne cliquable avec indicateur de tri. */
function SortableHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 font-medium uppercase tracking-widest transition-colors hover:text-foreground',
        active ? 'text-foreground' : 'text-muted',
      )}
    >
      {label}
      <span className="text-[10px]">
        {active ? (dir === 'asc' ? '▲' : '▼') : '↕'}
      </span>
    </button>
  );
}

/** Multi-select léger sous forme de dropdown : label + compteur, cases à cocher. */
function MultiSelectFilter<T extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: Set<T>;
  onToggle: (value: T) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-8 w-full items-center justify-between gap-2 rounded-full border px-3 text-xs font-normal normal-case tracking-normal focus:outline-none',
          selected.size > 0
            ? 'border-accent bg-accent/10 text-accent-strong'
            : 'border-border bg-background text-foreground-soft hover:text-foreground',
        )}
      >
        <span className="truncate">
          {selected.size === 0
            ? label
            : `${selected.size} sélection${selected.size > 1 ? 's' : ''}`}
        </span>
        <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-2xl border border-border bg-background p-2 shadow-lg">
            <div className="max-h-64 overflow-y-auto">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-normal normal-case tracking-normal text-foreground hover:bg-background-soft"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(opt.value)}
                    onChange={() => onToggle(opt.value)}
                    className="h-3.5 w-3.5"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="mt-2 w-full rounded-lg bg-background-soft px-2 py-1.5 text-xs font-normal normal-case tracking-normal text-foreground-soft hover:text-foreground"
              >
                Effacer
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modale de detail : liste des questions d un test, actions par question    */
/* -------------------------------------------------------------------------- */

function TestDetailModal({
  group,
  validating,
  onClose,
  onApproveQuestion,
  onRejectQuestion,
  onRemoveQuestion,
  onEditQuestion,
  onValidateAndInvite,
  onInviteOnly,
  onDeleteTest,
}: {
  group: CandidateGroup;
  validating: boolean;
  onClose: () => void;
  onApproveQuestion: (q: ReviewQuestion) => void;
  onRejectQuestion: (q: ReviewQuestion) => void;
  onRemoveQuestion: (q: ReviewQuestion) => void;
  onEditQuestion: (q: ReviewQuestion) => void;
  onValidateAndInvite: () => void;
  onInviteOnly: () => void;
  onDeleteTest: () => void;
}) {
  const total = group.questions.length;
  const approved = group.questions.filter((q) => q.status === 'APPROVED').length;
  const pending = group.questions.filter((q) => q.status === 'PENDING_REVIEW').length;
  const allApproved = pending === 0 && approved > 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-6 sm:px-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-semibold tracking-tight text-foreground">
              {group.candidateName ?? group.candidateEmail}
            </h2>
            <p className="truncate text-xs text-muted">
              {group.candidateEmail} · {PROFILE_LABELS[group.profileCode] ?? group.profileCode}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {approved} approuvée{approved > 1 ? 's' : ''}
              </span>
              {pending > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  {pending} à valider
                </span>
              )}
              <span className="text-muted">sur {total}</span>
              {group.previousSubmissionsCount > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  ⚠️ Déjà évalué ×{group.previousSubmissionsCount}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted hover:bg-background-soft hover:text-foreground"
            title="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body : liste des questions */}
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto p-6">
          <div className="space-y-3">
            {group.questions.map((q, idx) => (
              <QuestionRow
                key={q.id}
                index={idx + 1}
                question={q}
                onApprove={() => onApproveQuestion(q)}
                onReject={() => onRejectQuestion(q)}
                onRemove={() => onRemoveQuestion(q)}
                onEdit={() => onEditQuestion(q)}
              />
            ))}
          </div>
        </div>

        {/* Footer : actions globales */}
        <div className="flex items-center justify-between gap-3 rounded-b-3xl border-t border-border bg-white p-4 dark:bg-neutral-900">
          <Button variant="ghost" size="sm" onClick={onDeleteTest}>
            <Trash2 className="h-4 w-4" />
            Supprimer le test
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant={allApproved ? 'cta' : 'secondary'}
              onClick={allApproved ? onInviteOnly : onValidateAndInvite}
              disabled={validating || total === 0}
            >
              {validating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : allApproved ? (
                <Send className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {allApproved ? 'Envoyer l’invitation' : 'Tout valider et inviter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Ligne compacte pour une question dans TestDetailModal. */
function QuestionRow({
  index,
  question,
  onApprove,
  onReject,
  onRemove,
  onEdit,
}: {
  index: number;
  question: ReviewQuestion;
  onApprove: () => void;
  onReject: () => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const isApproved = question.status === 'APPROVED';
  const isRejected = question.status === 'REJECTED';
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        isApproved && 'border-emerald-300/50 bg-emerald-50/40 dark:border-emerald-800/50 dark:bg-emerald-950/20',
        isRejected && 'border-rose-300/50 bg-rose-50/40 dark:border-rose-800/50 dark:bg-rose-950/20',
        !isApproved && !isRejected && 'border-border bg-white dark:bg-neutral-800',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-xs">
            <span className="font-mono font-semibold text-muted">Q{index}</span>
            <span className={cn('inline-flex h-2 w-2 rounded-full', TYPE_DOT_COLORS[question.type])} />
            <Badge tone="warning">{question.type}</Badge>
            <Badge tone="muted">difficulté {question.difficulty}/5</Badge>
            {isApproved && <Badge tone="success">Approuvée</Badge>}
            {isRejected && <Badge tone="danger">Rejetée</Badge>}
          </div>
          <p className="text-sm text-foreground">{question.statement}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit} title="Modifier">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {!isApproved && (
            <Button variant="ghost" size="sm" onClick={onApprove} title="Approuver">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            </Button>
          )}
          {!isRejected && (
            <Button variant="ghost" size="sm" onClick={onReject} title="Rejeter">
              <X className="h-3.5 w-3.5 text-rose-600" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onRemove} title="Supprimer">
            <Trash2 className="h-3.5 w-3.5 text-muted" />
          </Button>
        </div>
      </div>

      {/* Preview complet du payload selon le type (options QCM, editeur code, scenario) */}
      <div className="mt-3">
        <QuestionPayloadPreview type={question.type} jsonPayload={question.jsonPayload} />
      </div>
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

/** Preview riche du contenu d une question selon son type. */
function QuestionPayloadPreview({
  type,
  jsonPayload,
}: {
  type: ReviewQuestion['type'];
  jsonPayload: string;
}) {
  let parsed: ParsedPayload = {};
  try {
    parsed = JSON.parse(jsonPayload);
  } catch {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
        Payload JSON invalide.
      </div>
    );
  }

  if (type === 'QCM') {
    const options = parsed.options ?? [];
    const correctIndex = parsed.correctIndex ?? -1;
    return (
      <div className="space-y-1.5">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex;
          return (
            <div
              key={i}
              className={cn(
                'flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm',
                isCorrect
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                  : 'border-border bg-white dark:bg-neutral-800',
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs text-muted">{String.fromCharCode(65 + i)}</span>
                <span className="truncate text-foreground">{opt}</span>
              </div>
              {isCorrect && <Badge tone="success">correct</Badge>}
            </div>
          );
        })}
        {parsed.explanation && (
          <div className="mt-2 rounded-xl border border-dashed border-border bg-white px-3 py-2 text-xs text-muted dark:bg-neutral-800">
            <span className="font-semibold text-foreground">Explication :</span> {parsed.explanation}
          </div>
        )}
      </div>
    );
  }

  if (type === 'CODE') {
    const language = parsed.language ?? 'JS';
    const starterCode = parsed.starterCode ?? '';
    const hiddenTests = parsed.hiddenTests ?? '';
    const monacoLang: 'PHP' | 'JS' = language === 'PHP' ? 'PHP' : 'JS';
    return (
      <div className="space-y-2">
        <div className="rounded-xl border border-border bg-white overflow-hidden dark:bg-neutral-800">
          <div className="flex items-center gap-2 border-b border-border bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted dark:bg-neutral-800">
            <Badge tone="info">{language}</Badge>
            <span>Squelette proposé au candidat</span>
          </div>
          <CodeEditor
            value={starterCode || '// Aucun starterCode généré.'}
            onChange={() => {}}
            language={monacoLang}
            readOnly
            height="140px"
          />
        </div>
        {hiddenTests && (
          <details className="rounded-xl border border-border bg-white overflow-hidden dark:bg-neutral-800">
            <summary className="cursor-pointer border-b border-border bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted hover:text-foreground dark:bg-neutral-800">
              Tests cachés (exécutés en sandbox)
            </summary>
            <CodeEditor
              value={hiddenTests}
              onChange={() => {}}
              language={monacoLang}
              readOnly
              height="120px"
            />
          </details>
        )}
        {parsed.explanation && (
          <div className="rounded-xl border border-dashed border-border bg-white px-3 py-2 text-xs text-muted dark:bg-neutral-800">
            <span className="font-semibold text-foreground">Explication :</span> {parsed.explanation}
          </div>
        )}
      </div>
    );
  }

  // CAS_PRATIQUE
  return (
    <div className="space-y-2">
      {parsed.scenario && (
        <div className="rounded-xl border border-border bg-white px-3 py-2 dark:bg-neutral-800">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">Scénario</div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{parsed.scenario}</p>
        </div>
      )}
      {parsed.expectedAnswerPoints && parsed.expectedAnswerPoints.length > 0 && (
        <div className="rounded-xl border border-border bg-white px-3 py-2 dark:bg-neutral-800">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">
            Points attendus dans la réponse
          </div>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-foreground">
            {parsed.expectedAnswerPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {parsed.explanation && (
        <div className="rounded-xl border border-dashed border-border bg-white px-3 py-2 text-xs text-muted dark:bg-neutral-800">
          <span className="font-semibold text-foreground">Explication :</span> {parsed.explanation}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modale d avertissement : candidat deja evalue sur d autres tests          */
/* -------------------------------------------------------------------------- */

function ReinviteWarningModal({
  candidateName,
  previousCount,
  onCancel,
  onConfirm,
}: {
  candidateName: string;
  previousCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          Candidat déjà évalué
        </h3>
        <p className="mt-2 text-sm text-muted">
          <span className="font-medium text-foreground">{candidateName}</span> a déjà soumis{' '}
          <span className="font-semibold text-foreground">{previousCount} évaluation{previousCount > 1 ? 's' : ''}</span>{' '}
          via une autre invitation. Envoyer une nouvelle invitation créera un lien indépendant
          et ne remplacera pas les résultats précédents.
        </p>
        <p className="mt-2 text-xs text-muted">
          Consultez la page « Résultats » pour comparer les scores existants avant de renvoyer un test.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            <Send className="h-4 w-4" />
            Envoyer quand même
          </Button>
        </div>
      </div>
    </div>
  );
}

// Palette des types de questions : pastilles colorees dans la preview.
const TYPE_DOT_COLORS: Record<ReviewQuestion['type'], string> = {
  QCM: 'bg-sky-500',
  CODE: 'bg-amber-500',
  CAS_PRATIQUE: 'bg-violet-500',
};

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
              Modifiez l’énoncé, la difficulté ou le payload JSON.
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
  invitation: {
    token: string;
    expiresAt: string;
    accessCode: string | null;
    emailSent: boolean;
    candidateEmail: string | null;
  } | null;
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
              Envoyer l’invitation
            </CardTitle>
            <CardDescription>
              {invitation
                ? invitation.emailSent
                  ? "L’email d’invitation a été envoyé au candidat. Vous pouvez aussi copier le lien ci-dessous pour un envoi manuel."
                  : "Lien généré. L'envoi automatique par email a échoué (SMTP indisponible) — copiez-le et transmettez-le au candidat manuellement."
                : "Un lien unique va être créé pour ce test et envoyé par email au candidat, valable 24 heures."}
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

          {invitation && invitation.emailSent && (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <div className="font-semibold">Email envoyé à {invitation.candidateEmail}</div>
                <div className="text-xs opacity-80">
                  Le candidat va recevoir un email avec le lien de démarrage.
                </div>
              </div>
            </div>
          )}

          {invitation && !invitation.emailSent && (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <div className="font-semibold">Envoi automatique indisponible</div>
                <div className="text-xs opacity-80">
                  Copiez le lien et le code d’accès ci-dessous et transmettez-les manuellement au candidat.
                </div>
              </div>
            </div>
          )}

          {invitation?.accessCode && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                Code d’accès candidat
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={invitation.accessCode}
                  onFocus={(e) => e.currentTarget.select()}
                  className="block flex-1 rounded-xl border border-border bg-sky-50 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.35em] text-sky-900 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 dark:bg-sky-950/40 dark:text-sky-200"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={async () => {
                    if (!invitation?.accessCode) return;
                    try {
                      await navigator.clipboard.writeText(invitation.accessCode);
                    } catch {
                      /* clipboard refusé en HTTP */
                    }
                  }}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Copier
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted">
                Ce code a été envoyé dans l’email d’invitation. Le candidat doit
                le saisir pour démarrer sa passation.
              </p>
            </div>
          )}

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
