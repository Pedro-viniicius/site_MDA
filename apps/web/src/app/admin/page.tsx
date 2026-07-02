import Link from "next/link";
import { ArrowRight, Cpu, PcCase, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listarBuilds, listarComponentes, listarLeads, type Lead } from "@/lib/api";
import { formatarData } from "@/lib/formato";

export const dynamic = "force-dynamic";

type Indicadores = {
  componentes: number | null;
  builds: number | null;
  leads: number | null;
  ultimosLeads: Lead[];
};

async function carregarIndicadores(): Promise<Indicadores> {
  const [componentes, builds, leads] = await Promise.allSettled([
    listarComponentes(),
    listarBuilds(),
    listarLeads(),
  ]);
  return {
    componentes: componentes.status === "fulfilled" ? componentes.value.length : null,
    builds: builds.status === "fulfilled" ? builds.value.length : null,
    leads: leads.status === "fulfilled" ? leads.value.length : null,
    ultimosLeads: leads.status === "fulfilled" ? leads.value.slice(0, 5) : [],
  };
}

export default async function PainelVisaoGeral() {
  const dados = await carregarIndicadores();

  const cartoes = [
    {
      rotulo: "Componentes no catálogo",
      valor: dados.componentes,
      icone: Cpu,
      href: "/admin/componentes",
    },
    { rotulo: "PCs prontos ativos", valor: dados.builds, icone: PcCase, href: "/admin/builds" },
    { rotulo: "Leads recebidos", valor: dados.leads, icone: Users, href: "/admin/leads" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-bold text-navy-900">Visão geral</h1>
        <p className="mt-1 text-muted-foreground">
          Acompanhe o catálogo e os pedidos de orçamento que chegam pelo site.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {cartoes.map(({ rotulo, valor, icone: Icone, href }) => (
          <Link key={rotulo} href={href} className="group">
            <Card className="h-full shadow-sm transition-shadow group-hover:shadow-md">
              <CardHeader>
                <Icone aria-hidden className="size-6 text-acao" />
                <CardTitle className="font-heading text-3xl">
                  {valor ?? "—"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  {rotulo}
                  <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Últimos leads</CardTitle>
          <CardDescription>Pedidos de orçamento e contatos mais recentes.</CardDescription>
        </CardHeader>
        <CardContent>
          {dados.ultimosLeads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum lead por enquanto. Assim que alguém pedir um orçamento pelo site, ele
              aparece aqui.
            </p>
          ) : (
            <ul className="divide-y">
              {dados.ultimosLeads.map((lead) => (
                <li key={lead.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-medium">{lead.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.telefone || lead.email || "sem contato informado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{lead.origem}</Badge>
                    <span className="text-xs text-muted-foreground">{formatarData(lead.criado_em)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed shadow-none">
        <CardHeader>
          <CardTitle className="font-heading text-base">Próximas funcionalidades</CardTitle>
          <CardDescription>
            Cadastro e edição de componentes, regras de recomendação, fornecedores, estoque e
            preços serão gerenciados por aqui (veja o ROADMAP.md do projeto).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
