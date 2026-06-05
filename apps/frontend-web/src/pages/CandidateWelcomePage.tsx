import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiError, api } from '@/lib/api';

/**
 * Page d'accueil du candidat (URL : /candidate/passation/:token).
 *
 * Verifie le token, demande email + nom, puis demarre la passation.
 */
export function CandidateWelcomePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [tokenStatus, setTokenStatus] = useState<'checking' | 'valid' | 'invalid'>(
    'checking',
  );
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [questionsCount, setQuestionsCount] = useState(0);

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      setTokenError('Lien invalide');
      return;
    }
    void api
      .candidateResolveInvitation(token)
      .then((res) => {
        setTokenStatus('valid');
        setQuestionsCount(res.questions.length);
      })
      .catch((err) => {
        setTokenStatus('invalid');
        const msg =
          err instanceof ApiError && err.status === 410
            ? "Lien expire, deja utilise ou inconnu."
            : err instanceof Error
              ? err.message
              : 'Erreur de validation du lien.';
        setTokenError(msg);
      });
  }, [token]);

  const handleStart = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const passation = await api.candidateStartPassation(token, email, displayName);
      // Stocker l'id de passation en sessionStorage pour la page suivante
      sessionStorage.setItem(
        `skillforge.passation.${token}`,
        JSON.stringify({ id: passation.id, candidateEmail: email }),
      );
      navigate(`/candidate/passation/${token}/run`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            S
          </div>
          <span className="text-sm font-semibold tracking-tight">SkillForge</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        {tokenStatus === 'checking' && (
          <p className="font-mono text-xs text-muted-foreground">
            $ verifying invitation token…
          </p>
        )}

        {tokenStatus === 'invalid' && (
          <Card>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-danger" />
                <div>
                  <h2 className="text-lg font-semibold">Lien invalide</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tokenError}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Verifiez aupres de votre interlocuteur RH que le lien envoye est bien
                    celui-ci.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {tokenStatus === 'valid' && (
          <>
            <div>
              <Badge tone="success" className="mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                token.valid
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight">
                Test technique SkillForge
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {questionsCount} questions vous attendent. Avant de commencer, identifiez-vous.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Identification</CardTitle>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleStart} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      email
                    </label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      nom complet
                    </label>
                    <Input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jean Dupont"
                    />
                  </div>

                  {submitError && (
                    <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-[11px] text-danger">
                      ✗ {submitError}
                    </div>
                  )}

                  <Button type="submit" disabled={submitting} className="w-full" size="lg">
                    {submitting ? (
                      <span className="font-mono">$ starting…</span>
                    ) : (
                      'Commencer le test ↵'
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>

            <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
              <p>
                Vos donnees (nom, email, reponses) sont stockees uniquement pour ce
                recrutement et seront purgees apres 12 mois (conformite RGPD).
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
