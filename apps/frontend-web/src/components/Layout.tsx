import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearTokens, getRoleFromAccessToken, loadTokens } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { ClipboardList, FilePlus2, LayoutDashboard, LogOut } from 'lucide-react';
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
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-foreground hover:bg-muted',
    );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-border bg-card">
        {/* Header sidebar */}
        <div className="border-b border-border p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              S
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">SkillForge</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                recrutement · ia
              </div>
            </div>
          </Link>
        </div>

        {/* Status bar */}
        <div className="border-b border-border bg-muted/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="font-mono text-[10px] text-muted-foreground">
              system.online
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          <div className="px-2 pb-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            navigation
          </div>
          <NavLink to="/" end className={navItemClass}>
            <LayoutDashboard className="h-4 w-4" />
            Tableau de bord
          </NavLink>
          <NavLink to="/new-test" className={navItemClass}>
            <FilePlus2 className="h-4 w-4" />
            Nouveau test
          </NavLink>
          <NavLink to="/review" className={navItemClass}>
            <ClipboardList className="h-4 w-4" />
            Revoir les questions
          </NavLink>
        </nav>

        {/* Bas de sidebar : profil + theme */}
        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                connecte
              </div>
              <div className="truncate text-xs font-medium text-foreground">{role}</div>
            </div>
            <ThemeToggle />
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            Se deconnecter
          </Button>
        </div>
      </aside>

      {/* Zone principale */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-3">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <span>~/</span>
            <span className="text-foreground">skillforge</span>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            v1.0.0 &middot; build 2026.06.04
          </div>
        </header>

        {/* Contenu page */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
