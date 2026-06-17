import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { AppMockup } from '@/components/AppMockup';
import {
  ArrowRight,
  ClipboardList,
  FilePlus2,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-6">
      {/* ============ HERO ASYMETRIQUE (style Socialynx) ============ */}
      <section className="grid grid-cols-1 items-center gap-12 pt-8 lg:grid-cols-2 lg:gap-8 lg:pt-12">
        {/* Gauche : texte + CTA */}
        <div className="animate-fade-in-up">
          <Badge tone="accent" className="mb-6">
            <Sparkles className="h-3 w-3" />
            IA active · gpt-4o-mini
          </Badge>

          <h1 className="font-display text-display-sm leading-[1.02] tracking-tighter text-foreground sm:text-display lg:text-display-lg">
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
            Demarrez un test sur mesure en moins d'une minute. L'IA analyse,
            la sandbox execute, vous decidez.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/app/new-test">
              <Button variant="cta" size="xl">
                <FilePlus2 className="h-4 w-4" />
                Demarrer un test
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app/review">
              <Button variant="secondary" size="xl">
                Banque de questions
              </Button>
            </Link>
          </div>

          <div className="mt-10">
            <AvatarStack count={4} label="3 200+ candidats evalues" />
          </div>
        </div>

        {/* Droite : mockup app (le visuel impressionnant) */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <AppMockup />
        </div>
      </section>

      {/* ============ SECTIONS CARDS (style Socialynx "Data & Analytics") ============ */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* Big card gauche (col-span-2) : Demarrer */}
        <Card variant="elevated" className="overflow-hidden lg:col-span-2">
          <div className="grid items-center gap-6 p-8 sm:grid-cols-[1fr,auto]">
            <div>
              <Badge tone="accent" className="mb-3">
                <BrainCircuit className="h-3 w-3" />
                Generation par IA
              </Badge>
              <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                Du CV au test,
                <br />
                en 3 etapes.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                Upload du CV, validation des competences detectees, generation
                de QCM + exercices code + cas pratiques.
              </p>
              <Link to="/app/new-test" className="mt-5 inline-block">
                <Button variant="cta" size="md">
                  <FilePlus2 className="h-4 w-4" />
                  Nouveau test
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mini illustration */}
            <div className="hidden flex-col gap-2 sm:flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong shadow-sm">
                <FilePlus2 className="h-7 w-7" />
              </div>
              <div className="ml-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-md">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                <ShieldCheck className="h-7 w-7" />
              </div>
            </div>
          </div>
        </Card>

        {/* Small card droite : Banque de questions */}
        <Card variant="elevated" className="p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Banque de questions
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Consultez et validez les questions en attente. Filtrez par sujet,
            difficulte ou statut.
          </p>
          <Link to="/app/review" className="mt-5 inline-block">
            <Button variant="secondary" size="sm">
              Voir la banque
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        {/* Small card 1 : Sandbox */}
        <Card variant="elevated" className="p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Sandbox Docker
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Execution candidat 100% isolee : seccomp, cap-drop=ALL, network=none,
            FS read-only.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
              seccomp
            </span>
            <span className="rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
              network=none
            </span>
          </div>
        </Card>

        {/* Small card 2 : Multi-LLM */}
        <Card variant="elevated" className="p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Multi-LLM
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            OpenAI, Anthropic Claude, GitHub Models, mock. Choisissez selon
            votre budget et vos contraintes.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-background-soft px-3 py-1 text-xs font-medium text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            gpt-4o-mini · gratuit POC
          </div>
        </Card>

        {/* Small card 3 : Compte rendu IA */}
        <Card variant="elevated" className="p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-strong">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Compte rendu IA
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Forces, faiblesses, recommandation argumentee : un brief humain
            pret a transmettre.
          </p>
        </Card>
      </section>
    </div>
  );
}
