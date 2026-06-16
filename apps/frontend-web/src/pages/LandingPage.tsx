import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Gauge,
  Code2,
  FileText,
  BrainCircuit,
  Lock,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { AppMockup } from '@/components/AppMockup';
import { ThemeToggle } from '@/components/ThemeToggle';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-app-gradient">
      {/* ============== TOP NAV (style Socialynx : logo a fond gauche, actions a fond droite) ============== */}
      <header className="flex items-center justify-between px-8 py-5">
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-foreground"
        >
          SkillForge
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-surface px-2 py-2 shadow-lg md:inline-flex">
          <a
            href="#produit"
            className="px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Produit
          </a>
          <a
            href="#fonctionnement"
            className="px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Fonctionnement
          </a>
          <a
            href="#securite"
            className="px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Securite
          </a>
          <a
            href="#tarifs"
            className="px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Tarifs
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="md">
              Se connecter
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="cta" size="md">
              Commencer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 md:py-20 lg:grid-cols-2 lg:gap-8">
        {/* Hero left : texte + CTA */}
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Nouveau · Generation de tests propulsee par GPT-4o
          </div>

          <h1 className="font-display text-display-sm leading-[1.05] tracking-tighter text-foreground sm:text-display lg:text-display-lg">
            Recrutement{' '}
            <span className="bg-text-accent-gradient bg-clip-text text-transparent">
              technique
            </span>
            <br />
            assiste par IA,
            <br />
            du CV au verdict.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            SkillForge analyse le CV, genere un test sur mesure, execute le code dans
            une sandbox Docker durcie, et restitue un compte rendu IA — en quelques
            minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/login">
              <Button variant="cta" size="xl">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#fonctionnement">
              <Button variant="secondary" size="xl">
                Voir comment ca marche
              </Button>
            </a>
          </div>

          <div className="mt-10">
            <AvatarStack count={4} label="3 200+ candidats evalues" />
          </div>
        </div>

        {/* Hero right : mockup app */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <AppMockup />
        </div>
      </section>

      {/* ============== TRUST BAR ============== */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-border bg-surface/60 px-6 py-5 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">
              Construit avec des standards industriels
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-muted">
              <span>Spring Boot 3</span>
              <span>·</span>
              <span>PostgreSQL 16</span>
              <span>·</span>
              <span>Docker · seccomp</span>
              <span>·</span>
              <span>React 19</span>
              <span>·</span>
              <span>Argon2id</span>
              <span>·</span>
              <span>JWT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FONCTIONNEMENT (3 colonnes) ============== */}
      <section id="fonctionnement" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Comment ca marche
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
            Du CV au verdict,
            <br />
            <span className="bg-text-accent-gradient bg-clip-text text-transparent">
              en 3 etapes.
            </span>
          </h2>
          <p className="mt-4 text-base text-muted">
            Un workflow concu pour les recruteurs techniques exigeants, sans
            compromis sur la securite.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <Card variant="elevated" className="group p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong transition-transform group-hover:scale-110">
              <FileText className="h-5 w-5" />
            </div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
              01 · ingest
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Importez le CV
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              PDF, DOCX, ou texte libre. L'IA extrait competences, technologies, et
              annees d'experience.
            </p>
          </Card>

          {/* Step 2 */}
          <Card variant="elevated" className="group p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong transition-transform group-hover:scale-110">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
              02 · generate
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Generez le test
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              QCM, exercices de code (PHP, JS), cas pratiques. Adapte au profil du
              candidat, en un clic.
            </p>
          </Card>

          {/* Step 3 */}
          <Card variant="elevated" className="group p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong transition-transform group-hover:scale-110">
              <Gauge className="h-5 w-5" />
            </div>
            <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
              03 · verdict
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Recevez le verdict
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Score, compte rendu IA, detection d'anomalies. Decidez en quelques
              minutes au lieu de plusieurs heures.
            </p>
          </Card>
        </div>
      </section>

      {/* ============== FEATURES ALTERNEES ============== */}
      <section id="produit" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Big feature 1 (col-span-2) */}
          <Card variant="elevated" className="overflow-hidden lg:col-span-2">
            <div className="p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                <Code2 className="h-3.5 w-3.5" />
                Sandbox Docker durcie
              </div>
              <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                Execution de code candidat sans risque pour vos systemes.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Chaque snippet est execute dans un conteneur seccomp + cap-drop=ALL,
                sans reseau, FS read-only, 256 Mo RAM max, 5 secondes wall-clock.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
                  seccomp
                </span>
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
                  cap-drop=ALL
                </span>
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
                  network=none
                </span>
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
                  read-only FS
                </span>
                <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
                  pids-limit=64
                </span>
              </div>
            </div>
          </Card>

          {/* Big feature 2 (col-span-1) */}
          <Card variant="elevated" className="p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Multi-modeles LLM
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              OpenAI, Anthropic Claude, GitHub Models, mock. Choisissez selon votre
              budget et vos contraintes.
            </p>
          </Card>

          {/* Small feature 1 */}
          <Card variant="elevated" className="p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Argon2id + JWT
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Hashage moderne des mots de passe, sessions stateless, tokens
              candidats signes a usage unique.
            </p>
          </Card>

          {/* Small feature 2 */}
          <Card variant="elevated" className="p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Compte rendu IA
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Forces, faiblesses, raisons de recommandation : un brief humain pret a
              transmettre au manager.
            </p>
          </Card>

          {/* Small feature 3 */}
          <Card variant="elevated" className="p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              RGPD by design
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Donnees hebergees en UE, purge automatique 12 mois, droits d'acces et
              effacement integres.
            </p>
          </Card>
        </div>
      </section>

      {/* ============== SECURITE (highlight) ============== */}
      <section id="securite" className="mx-auto max-w-7xl px-6 py-20">
        <Card
          variant="elevated"
          className="overflow-hidden bg-gradient-to-br from-foreground via-foreground-soft to-foreground p-12 text-background"
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                <ShieldCheck className="h-3.5 w-3.5" />
                Securite niveau production
              </div>
              <h3 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Pensee comme une plateforme bancaire,
                <br />
                pas un POC d'ecole.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
                Authentification forte, isolation totale de l'execution candidat,
                journaux d'audit, validation par OPA, scans Trivy sur chaque image —
                rien n'est laisse au hasard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                'Argon2id hashing',
                'JWT signed',
                'Seccomp syscalls allowlist',
                'No network in sandbox',
                'Read-only filesystem',
                'PIDs limit 64',
                'Memory cap 256 Mo',
                '5s wall-clock max',
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ============== CTA FINAL ============== */}
      <section id="tarifs" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
            Pret a evaluer votre prochain
            <br />
            <span className="bg-text-accent-gradient bg-clip-text text-transparent">
              recrutement tech ?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            Cree pendant un stage M2 a l'Universite Cote d'Azur · Innovation
            recrutement assistee par IA.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login">
              <Button variant="cta" size="xl">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-gradient text-[10px] font-bold text-white">
              S
            </div>
            <span>SkillForge · © 2026 · Tsarajoro</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Confidentialite</a>
            <a href="#" className="hover:text-foreground">Conditions</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
