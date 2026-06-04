import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, ClipboardList, FilePlus2, Sparkles } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* En-tete */}
      <div>
        <Badge tone="success" className="mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          ia.active
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demarrez un nouveau recrutement ou consultez les questions a valider.
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Candidats analyses" value="—" hint="ce mois-ci" />
        <StatCard label="Tests envoyes" value="—" hint="ce mois-ci" />
        <StatCard label="Banque de questions" value="—" hint="questions validees" />
      </div>

      {/* Actions principales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ActionCard
          to="/new-test"
          icon={<FilePlus2 className="h-5 w-5" />}
          title="Demarrer un test"
          description="Televerser le CV d'un candidat. L'IA en extrait les competences et propose un test sur mesure que vous pourrez valider."
          cta="Nouveau test"
          variant="primary"
        />
        <ActionCard
          to="/review"
          icon={<ClipboardList className="h-5 w-5" />}
          title="Revoir les questions"
          description="Consulter et modifier les questions en attente de validation dans la banque."
          cta="Voir la banque"
          variant="outline"
        />
      </div>

      {/* Banniere IA */}
      <Card className="border-dashed">
        <CardBody className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              powered by
            </h3>
            <p className="mt-1 text-sm">
              <span className="font-mono font-medium">gpt-4o-mini</span>
              <span className="text-muted-foreground"> via GitHub Models — gratuit pour le POC</span>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardBody>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      </CardBody>
    </Card>
  );
}

function ActionCard({
  to,
  icon,
  title,
  description,
  cta,
  variant,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  variant: 'primary' | 'outline';
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link to={to} className="mt-4 inline-block">
          <Button variant={variant}>
            {cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}
