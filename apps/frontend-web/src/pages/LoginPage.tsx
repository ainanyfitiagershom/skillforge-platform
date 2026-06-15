import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiError, api, saveTokens } from '@/lib/api';
import { AvatarStack } from '@/components/ui/AvatarStack';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('recruteur@tsarajoro.dev');
  const [password, setPassword] = useState('password123456');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await api.login(email, password);
      saveTokens(tokens);
      navigate('/app');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Connexion impossible';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-app-gradient lg:grid-cols-2">
      {/* ============== COLONNE GAUCHE : marketing ============== */}
      <aside className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        {/* Blobs decoratifs */}
        <div
          className="blob-accent left-12 top-32 h-72 w-72"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
        />
        <div
          className="blob-accent bottom-20 right-20 h-72 w-72"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
        />

        {/* Logo + retour Landing */}
        <Link to="/" className="relative z-10 flex items-center gap-2 w-fit">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-md">
            <span className="font-display text-lg font-bold">S</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            SkillForge
          </span>
        </Link>

        {/* Pitch */}
        <div className="relative z-10 max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Recrutement technique nouvelle generation
          </div>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter text-foreground sm:text-5xl">
            Du CV au verdict,
            <br />
            <span className="bg-text-accent-gradient bg-clip-text text-transparent">
              en quelques minutes.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted">
            Sandbox Docker durcie, generation de tests par IA, compte rendu
            humain. Sans compromis sur la securite.
          </p>

          {/* Mini features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface/60 p-3 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Generation propulsee par GPT-4o
                </div>
                <div className="text-xs text-muted">
                  Multi-LLM : OpenAI, Claude, GitHub Models
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface/60 p-3 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Sandbox seccomp + cap-drop=ALL
                </div>
                <div className="text-xs text-muted">
                  Execution candidat 100% isolee, network=none
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface/60 p-3 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Compte rendu IA pret a transmettre
                </div>
                <div className="text-xs text-muted">
                  Forces, faiblesses, recommandation argumentee
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <AvatarStack count={4} label="3 200+ candidats evalues" />
        </div>
      </aside>

      {/* ============== COLONNE DROITE : formulaire ============== */}
      <main className="flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-gradient text-white shadow-md">
              <span className="font-display text-base font-bold">S</span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              SkillForge
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="hidden text-sm text-muted sm:inline">
              Pas encore de compte ?
            </span>
            <Link to="/">
              <Button variant="ghost" size="sm">
                Decouvrir
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="font-display text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl">
                Bon retour parmi nous
              </h1>
              <p className="mt-2 text-sm text-muted">
                Connectez-vous a votre espace recruteur SkillForge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@entreprise.com"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    Mot de passe
                  </label>
                  <a
                    href="#"
                    className="text-xs font-medium text-accent-strong hover:underline"
                  >
                    Oublie ?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={12}
                  placeholder="............"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="cta"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  'Connexion en cours…'
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3 backdrop-blur-md">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs text-muted">
                Demo connectee a{' '}
                <span className="font-mono font-semibold text-foreground">
                  gpt-4o-mini
                </span>{' '}
                via GitHub Models
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-5 text-center lg:px-10 lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted lg:justify-start">
            <span>© 2026 Tsarajoro</span>
            <span>·</span>
            <a href="#" className="hover:text-foreground">Confidentialite</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground">Conditions</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
