import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listarBuilds, type Build } from "@/lib/api";
import { formatarPreco } from "@/lib/formato";

export const dynamic = "force-dynamic";

async function carregar(): Promise<Build[] | null> {
  try {
    return await listarBuilds();
  } catch {
    return null;
  }
}

export default async function PainelBuilds() {
  const builds = await carregar();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-900">PCs prontos</h1>
          <p className="mt-1 text-muted-foreground">
            Builds pré-configuradas exibidas no site (leitura).
          </p>
        </div>
        <Badge variant="secondary">Montagem de builds em breve</Badge>
      </header>

      {!builds ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center text-muted-foreground">
            Não foi possível carregar as builds. Verifique se a API está no ar.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {builds.map((build) => (
            <Card key={build.id} className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">
                    {build.tipo === "notebook" ? "Notebook" : "Desktop"} · {build.perfil}
                  </Badge>
                  <span className="font-heading font-semibold text-navy-800">
                    {formatarPreco(build.preco)}
                  </span>
                </div>
                <CardTitle className="font-heading text-lg">{build.nome}</CardTitle>
                <CardDescription>{build.uso_alvo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Entrega:</span>{" "}
                  CPU tier {build.requisitos.cpu_tier} · GPU tier {build.requisitos.gpu_tier} ·{" "}
                  {build.requisitos.ram_gb} GB RAM · {build.requisitos.ssd_gb} GB SSD
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  {build.componentes.map((item) => (
                    <li key={`${item.categoria}-${item.nome}`}>
                      <span className="font-medium text-foreground/80">{item.categoria}:</span>{" "}
                      {item.nome}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
