import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiError, api, saveTokens } from '@/lib/api';

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
      navigate('/');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Connexion impossible';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-12">
      {/* Sidebar minimaliste mono */}
      <aside className="hidden border-r border-border bg-muted/30 lg:col-span-1 lg:block">
        <div className="flex h-full flex-col items-center justify-between py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            S
          </div>
          <div className="space-y-3 text-center font-mono text-[9px] text-muted-foreground">
            <div>/01</div>
            <div>/02</div>
          </div>
          <div className="font-mono text-[9px] text-muted-foreground">v1.0</div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex flex-col lg:col-span-11">
        {/* Top bar avec status + toggle theme */}
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="font-mono text-[11px] text-muted-foreground">
              system.status: operational
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">
              v1.0.0
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Formulaire centre */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Sign in to SkillForge
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Plateforme de recrutement technique assistee par IA.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="vous@entreprise.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={12}
                  className="block w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="............"
                />
              </div>

              {error && (
                <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-[11px] text-danger">
                  ✗ {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <span className="font-mono">$ connecting…</span>
                ) : (
                  <>
                    Continue&nbsp;<span className="font-mono text-muted-foreground">↵</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">
                Powered by{' '}
                <span className="font-mono font-medium text-foreground">gpt-4o-mini</span>{' '}
                via GitHub Models
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>Tsarajoro &middot; 2026</span>
            <span>build 2026.06.04</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
