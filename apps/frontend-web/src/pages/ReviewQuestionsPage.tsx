import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ApiError, Question, api } from '@/lib/api';
import { Check, Pencil, Trash2, X } from 'lucide-react';

export function ReviewQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Question | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /questions n'est pas dans le client typé, on l'appelle direct
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
    <div className="space-y-6">
      <div>
        <Badge tone="muted" className="mb-2">
          /review
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Questions a revoir</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading
            ? '$ loading…'
            : `${questions.length} question${questions.length > 1 ? 's' : ''} en attente de validation.`}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2 font-mono text-xs text-danger">
          ✗ {error}
        </div>
      )}

      <div className="space-y-3">
        {questions.map((q) => (
          <Card key={q.id}>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge tone={q.type === 'QCM' ? 'info' : q.type === 'CODE' ? 'warning' : 'success'}>
                  {q.type}
                </Badge>
                <Badge tone="muted">diff {q.difficulty}/5</Badge>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  id: {q.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(q)}>
                  <Pencil className="h-3 w-3" /> Editer
                </Button>
                <Button variant="primary" size="sm" onClick={() => approve(q)}>
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
              <p className="text-sm font-medium">
                {q.statement || <em className="text-muted-foreground">(enonce dans le payload)</em>}
              </p>
              <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-[11px] text-muted-foreground">
                {q.jsonPayload}
              </pre>
            </CardBody>
          </Card>
        ))}
        {!loading && questions.length === 0 && (
          <Card>
            <CardBody className="py-12 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                $ no pending questions
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Aucune question en attente de validation pour le moment.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Editer la question</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              enonce
            </label>
            <textarea
              className="block w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              rows={3}
              value={question.statement}
              onChange={(e) => onChange({ ...question, statement: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              difficulte (1 a 5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={question.difficulty}
              onChange={(e) => onChange({ ...question, difficulty: Number(e.target.value) })}
              className="block w-24 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              payload json
            </label>
            <textarea
              className="block w-full rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              rows={8}
              value={question.jsonPayload}
              onChange={(e) => onChange({ ...question, jsonPayload: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Annuler
            </Button>
            <Button onClick={onSave}>Enregistrer</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
