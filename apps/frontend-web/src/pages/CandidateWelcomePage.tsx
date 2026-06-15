import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiError, api } from '@/lib/api';
import {
  AlertCircle,
  ArrowRight,
  Lock,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';

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
            ? 'Lien expire, deja utilise ou inconnu.'
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
    <div className="min-h-screen bg-app-gradient text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-md">
            <span className="font-display text-lg font-bold">S</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            SkillForge
          </span>
        </div>
        <ThemeToggle />
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-8">
        {tokenStatus === 'checking' && (
          <Card variant="elevated" className="p-10 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-accent" />
            <p className="text-sm text-muted">
              Verification du lien d'invitation en cours…
            </p>
          </Card>
        )}

        {tokenStatus === 'invalid' && (
          <Card variant="elevated" className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Lien invalide
                </h2>
                <p className="mt-2 text-sm text-muted">{tokenError}</p>
                <p className="mt-4 text-xs text-muted">
                  Verifiez aupres de votre interlocuteur RH que le lien envoye est
                  bien celui-ci.
                </p>
              </div>
            </div>
          </Card>
        )}

        {tokenStatus === 'valid' && (
          <>
            <div className="animate-fade-in-up">
              <Badge tone="success" className="mb-3">
                <ShieldCheck className="h-3 w-3" />
                Lien verifie
              </Badge>
              <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter text-foreground sm:text-5xl">
                Test technique{' '}
                <span className="bg-text-accent-gradient bg-clip-text text-transparent">
                  SkillForge
                </span>
              </h1>
              <p className="mt-3 text-base text-muted">
                {questionsCount} questions vous attendent. Avant de commencer,
                identifiez-vous.
              </p>
            </div>

            <Card variant="elevated" className="animate-fade-in-up">
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Identification
                  </CardTitle>
                  <CardDescription>
                    Vos coordonnees servent uniquement a transmettre le compte
                    rendu au recruteur.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleStart} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Email
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
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                      Nom complet
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
                    <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="cta"
                    size="xl"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      'Demarrage…'
                    ) : (
                      <>
                        Commencer le test
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>

            <Card variant="flat" className="border border-dashed border-border">
              <div className="flex items-start gap-3 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Vos donnees sont protegees
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Nom, email et reponses sont stockes uniquement pour ce
                    recrutement et purges apres 12 mois (conformite RGPD).
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
