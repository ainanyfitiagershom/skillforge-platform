import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ApiError, Question, api } from '@/lib/api';
import { Check, Pencil, Trash2, X, ClipboardList, Inbox } from 'lucide-react';

export function ReviewQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Question | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/questions?status=PENDING_REVIEW', {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('skillforge.tokens') || '{}').accessToken ?? ''}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setQuestions(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const approve = async (q: Question) => {
    try {
      await api.updateQuestion(q.id, {
        type: q.type,
        statement: q.statement,
        difficulty: q.difficulty,
        jsonPayload: q.jsonPayload,
        status: 'APPROVED',
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  const reject = async (q: Question) => {
    try {
      await api.updateQuestion(q.id, {
        type: q.type,
        statement: q.statement,
        difficulty: q.difficulty,
        jsonPayload: q.jsonPayload,
        status: 'REJECTED',
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  const remove = async (q: Question) => {
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
      await api.updateQuestion(editing.id, {
        type: editing.type,
        statement: editing.statement,
        difficulty: editing.difficulty,
        jsonPayload: editing.jsonPayload,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 pt-8">
      <div className="text-center">
        <Badge tone="accent" className="mb-4">
          <ClipboardList className="h-3 w-3" />
          Banque de questions
        </Badge>
        <h1 className="font-display text-display-sm leading-[1.05] tracking-tighter text-foreground">
          Questions a{' '}
          <span className="bg-text-accent-gradient bg-clip-text text-transparent">
            valider.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-muted">
          {loading
            ? 'Chargement…'
            : `${questions.length} question${questions.length > 1 ? 's' : ''} en attente de revue.`}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id} variant="elevated">
            <CardHeader className="flex-wrap">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={q.type === 'QCM' ? 'info' : q.type === 'CODE' ? 'warning' : 'success'}>
                  {q.type}
                </Badge>
                <Badge tone="muted">Difficulte {q.difficulty}/5</Badge>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-soft">
                  id: {q.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditing(q)}>
                  <Pencil className="h-3 w-3" /> Editer
                </Button>
                <Button variant="cta" size="sm" onClick={() => approve(q)}>
                  <Check className="h-3 w-3" /> Accepter
                </Button>
                <Button variant="ghost" size="sm" onClick={() => reject(q)}>
                  <X className="h-3 w-3" /> Refuser
                </Button>
                <Button variant="danger" size="sm" onClick={() => remove(q)}>
                  <Trash2 className="h-3 w-3" /> Supprimer
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm font-medium text-foreground">
                {q.statement || (
                  <em className="text-muted">(enonce dans le payload)</em>
                )}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-2xl border border-border bg-background-soft p-4 font-mono text-[11px] text-muted">
                {q.jsonPayload}
              </pre>
            </CardBody>
          </Card>
        ))}

        {!loading && questions.length === 0 && (
          <Card variant="elevated">
            <CardBody className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background-soft text-muted">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Aucune question en attente
              </h3>
              <p className="mt-2 text-sm text-muted">
                Vous etes a jour. Demarrez un nouveau test pour generer de nouvelles questions.
              </p>
            </CardBody>
          </Card>
        )}
      </div>

      {editing && (
        <EditModal
          question={editing}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
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
  question: Question;
  onChange: (q: Question) => void;
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
              Modifiez l'enonce, la difficulte ou le payload JSON. La question
              repassera en attente de validation.
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
