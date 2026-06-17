import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearTokens, getRoleFromAccessToken, loadTokens } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { LogOut, FilePlus2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Layout() {
  const navigate = useNavigate();
  const tokens = loadTokens();
  const role = getRoleFromAccessToken(tokens?.accessToken);

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-4 py-1.5 text-sm transition-all',
      isActive
        ? 'font-bold text-foreground'
        : 'font-medium text-muted hover:text-foreground',
    );

  return (
    <div className="min-h-screen bg-app-gradient text-foreground">
      <header className="flex items-center justify-between px-8 py-5">
        <Link
          to="/app"
          className="font-display text-xl font-bold tracking-tight text-foreground"
        >
          SkillForge
        </Link>

        {/* Pilule nav : item actif = texte bold foreground (pas de fond) */}
        <nav className="hidden items-center gap-1 rounded-full bg-surface px-2 py-2 shadow-lg md:inline-flex">
          <NavLink to="/app" end className={navItemClass}>
            Tableau de bord
          </NavLink>
          <NavLink to="/app/review" className={navItemClass}>
            Banque de questions
          </NavLink>
          <NavLink to="/app/new-test" className={navItemClass}>
            Nouveau test
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:inline-flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-[10px] font-bold text-white">
              {(role || 'U').slice(0, 1).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Se deconnecter"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-soft hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link to="/app/new-test">
            <Button variant="cta" size="md">
              <FilePlus2 className="h-4 w-4" />
              Nouveau test
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="pb-20 pt-4">
        <Outlet />
      </main>
    </div>
  );
}
