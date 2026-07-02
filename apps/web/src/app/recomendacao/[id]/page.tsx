import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleSlash,
  Gauge,
  Laptop,
  Monitor as MonitorIcon,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { AcoesRecomendacao } from "@/components/site/acoes-recomendacao";
import { FaixaConfianca } from "@/components/site/selo-confianca";
import { SpecCard } from "@/components/site/spec-card";
import { buscarRecomendacao, type Recomendacao } from "@/lib/api";
import { formatarPreco } from "@/lib/formato";
import type { LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sua recomendação",
  description: "Recomendação personalizada de computador feita pela MDA Soluções em Tecnologia.",
};

const ROTULO_CONFIANCA: Record<Recomendacao["nivel_confianca"], string> = {
  alta: "Alta confiança",
  media: "Boa recomendação",
  baixa: "Recomendação inicial",
};

const FAIXA_MAXIMA: Record<string, number | null> = {
  ate_2500: 2500,
  "2500_4000": 4000,
  "4000_6000": 6000,
  "6000_9000": 9000,
  acima_9000: null,
  nao_sei: null,
};

async function carregar(id: string): Promise<Recomendacao | null> {
  try {
    return await buscarRecomendacao(id);
  } catch {
    return null;
  }
}

/** Motivos visuais de "por que recomendamos", derivados dos dados reais. */
function montarMotivos(recomendacao: Recomendacao): { icone: LucideIcon; titulo: string; texto: string }[] {
  const respostas = recomendacao.respostas_cliente;
  const build = recomendacao.build;
  const motivos: { icone: LucideIcon; titulo: string; texto: string }[] = [];

  const faixa = FAIXA_MAXIMA[(respostas.orcamento as string) ?? "nao_sei"];
  if (faixa && Number.parseFloat(recomendacao.orcamento_estimado) <= faixa) {
    motivos.push({
      icone: Wallet,
      titulo: "Cabe no seu orçamento",
      texto: "Fica dentro da faixa de investimento que você escolheu.",
    });
  }

  const softwares = (respostas.softwares as string[]) ?? [];
  if (softwares.length > 0 || respostas.programas) {
    motivos.push({
      icone: BadgeCheck,
      titulo: "Roda os seus programas",
      texto: "A configuração considera os softwares que você marcou.",
    });
  }

  const tecnico = recomendacao.resumo_tecnico as Record<string, unknown>;
  const demanda = (tecnico.demanda_calculada as Record<string, number>) ?? {};
  const entrega = build?.requisitos ?? {};
  const atendeDemanda =
    (entrega.cpu_tier ?? 0) >= (demanda.cpu_tier ?? 0) &&
    (entrega.gpu_tier ?? 0) >= (demanda.gpu_tier ?? 0) &&
    (entrega.ram_gb ?? 0) >= (demanda.ram_gb ?? 0);
  if (atendeDemanda) {
    motivos.push({
      icone: Gauge,
      titulo: "Desempenho na medida",
      texto: "Entrega o que o seu uso pede — sem pagar por excesso.",
    });
  }

  if (build?.tipo === "desktop") {
    motivos.push({
      icone: TrendingUp,
      titulo: "Pronta para evoluir",
      texto: "Aceita upgrades no futuro, peça por peça.",
    });
  }

  motivos.push({
    icone: ShieldCheck,
    titulo: "Compatibilidade revisada",
    texto: "Todas as peças foram verificadas para funcionar juntas.",
  });

  return motivos.slice(0, 5);
}

/** Nível de desempenho em linguagem simples, a partir dos tiers da build. */
function nivelDesempenho(requisitos: Record<string, number>): string {
  const soma = (requisitos.cpu_tier ?? 0) + (requisitos.gpu_tier ?? 0);
  if (soma >= 9) return "Extremo — para o trabalho mais pesado";
  if (soma >= 7) return "Alto — projetos e jogos exigentes";
  if (soma >= 4) return "Equilibrado — dia a dia com folga";
  return "Essencial — tarefas do cotidiano";
}

export default async function PaginaRecomendacao({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recomendacao = await carregar(id);
  if (!recomendacao) notFound();

  const build = recomendacao.build;
  const IconeTipo = build?.tipo === "notebook" ? Laptop : MonitorIcon;
  const motivos = montarMotivos(recomendacao);
  const tecnico = recomendacao.resumo_tecnico as Record<string, unknown>;
  const avisosCliente = recomendacao.avisos.filter(
    (aviso) => !aviso.includes("incluir no orçamento")
  );
  const perifericosInclusos = build?.tipo === "notebook";

  const resumoRapido = [
    { icone: CheckCircle2, cor: "text-green-600", rotulo: "Ideal para", valor: build?.uso_alvo ?? "seu uso do dia a dia" },
    {
      icone: CircleSlash,
      cor: "text-amber-600",
      rotulo: "Pode não ser ideal para",
      valor: build?.limitacoes?.[0] ?? "usos muito além do informado",
    },
    { icone: Gauge, cor: "text-acao", rotulo: "Nível de desempenho", valor: nivelDesempenho(build?.requisitos ?? {}) },
    {
      icone: TrendingUp,
      cor: "text-acao",
      rotulo: "Upgrades futuros",
      valor: build?.tipo === "desktop" ? "Sim — fáceis de fazer" : "Limitados (notebook)",
    },
    {
      icone: Package,
      cor: "text-acao",
      rotulo: "Periféricos",
      valor: perifericosInclusos ? "Tudo integrado no notebook" : "Monitor e periféricos à parte",
    },
  ];

  return (
    <>
      <Navbar />
      <main id="conteudo" className="flex-1 bg-navy-50/60">
        {/* ---------- A. Hero de resumo ---------- */}
        <section className="fundo-hero relative overflow-hidden text-white">
          <div aria-hidden className="padrao-grade absolute inset-0" />
          <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-14 text-center sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge className="gap-1 bg-green-400/15 text-green-300">
                <Sparkles aria-hidden className="size-3.5" />
                {ROTULO_CONFIANCA[recomendacao.nivel_confianca]}
              </Badge>
              <Badge className="gap-1 bg-navy-800 text-navy-100">
                <IconeTipo aria-hidden className="size-3.5" />
                {build?.tipo === "notebook" ? "Notebook" : "Computador de mesa"}
              </Badge>
            </div>
            <h1 className="mt-5 font-heading text-3xl font-bold sm:text-4xl">
              Encontramos o computador certo para você!
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">
              Analisamos suas respostas e esta é a melhor combinação entre o que você
              precisa e o quanto quer investir.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-8 px-4 pb-12 sm:px-6">
          {/* ---------- B. Máquina recomendada (sobreposta ao hero) ---------- */}
          {build && (
            <Card className="-mt-14 border-acao/25 shadow-lg">
              <CardContent className="flex flex-wrap items-center justify-between gap-6 py-6">
                <div className="min-w-0">
                  <h2 className="font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
                    {build.nome}
                  </h2>
                  <p className="mt-1 max-w-md text-muted-foreground">{build.uso_alvo}</p>
                </div>
                <div className="rounded-xl bg-navy-50 px-5 py-3 text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Investimento estimado
                  </p>
                  <p className="font-heading text-3xl font-bold text-navy-800">
                    {formatarPreco(recomendacao.orcamento_estimado)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---------- F. Explicação curta ---------- */}
          <p className="rounded-xl border-l-4 border-acao bg-card p-5 text-lg leading-relaxed text-foreground/90 shadow-sm">
            {recomendacao.resumo_cliente}
          </p>

          {/* ---------- C. Por que recomendamos ---------- */}
          <section aria-labelledby="motivos">
            <h2 id="motivos" className="font-heading text-xl font-bold text-navy-900">
              Por que recomendamos isso para você
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {motivos.map(({ icone: Icone, titulo, texto }) => (
                <div key={titulo} className="rounded-xl border bg-card p-4 shadow-xs">
                  <span
                    aria-hidden
                    className="mb-3 flex size-10 items-center justify-center rounded-lg bg-acao/10 text-acao"
                  >
                    <Icone className="size-5" />
                  </span>
                  <p className="font-medium text-navy-900">{titulo}</p>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">{texto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- D. Resumo rápido ---------- */}
          <section aria-labelledby="resumo-rapido">
            <h2 id="resumo-rapido" className="font-heading text-xl font-bold text-navy-900">
              Resumo rápido
            </h2>
            <Card className="mt-4 shadow-sm">
              <CardContent className="grid gap-x-8 gap-y-4 py-5 sm:grid-cols-2">
                {resumoRapido.map(({ icone: Icone, cor, rotulo, valor }) => (
                  <div key={rotulo} className="flex items-start gap-3">
                    <Icone aria-hidden className={`mt-0.5 size-5 shrink-0 ${cor}`} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {rotulo}
                      </p>
                      <p className="text-sm font-medium text-foreground first-letter:uppercase">
                        {valor}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* ---------- E. Configuração ---------- */}
          {build && build.componentes.length > 0 && (
            <section aria-labelledby="configuracao">
              <h2 id="configuracao" className="font-heading text-xl font-bold text-navy-900">
                O que vem na configuração
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {build.componentes.map((item) => (
                  <SpecCard
                    key={`${item.categoria}-${item.nome}`}
                    categoria={item.categoria}
                    nome={item.nome}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ---------- Avisos de transparência ---------- */}
          {avisosCliente.length > 0 && (
            <Card className="border-amber-300/60 bg-amber-50/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-amber-900">
                  <AlertTriangle aria-hidden className="size-5" />
                  Combinados importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm text-amber-900/90">
                  {avisosCliente.map((aviso) => (
                    <li key={aviso} className="flex gap-2">
                      <span aria-hidden>•</span>
                      {aviso}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* ---------- G. Detalhes técnicos (opcional, recolhido) ---------- */}
          <Accordion className="rounded-xl border bg-card px-5 shadow-sm">
            <AccordionItem value="tecnico" className="border-0">
              <AccordionTrigger className="font-heading text-base font-semibold text-navy-900 hover:no-underline">
                Ver detalhes técnicos
              </AccordionTrigger>
              <AccordionContent>
                <dl className="grid gap-4 pb-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-muted-foreground">Consumo estimado</dt>
                    <dd className="text-foreground">{recomendacao.watts_estimados} W</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Perfil de uso detectado</dt>
                    <dd className="text-foreground">{String(tecnico.perfil_de_uso ?? recomendacao.perfil_detectado)}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-muted-foreground">Notas de compatibilidade</dt>
                    <dd>
                      <ul className="mt-1 list-inside list-disc space-y-1 text-foreground/90">
                        {((tecnico.notas_compatibilidade as string[]) ?? []).map((nota) => (
                          <li key={nota}>{nota}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-muted-foreground">Sugestões de upgrade futuro</dt>
                    <dd>
                      <ul className="mt-1 list-inside list-disc space-y-1 text-foreground/90">
                        {((tecnico.sugestoes_upgrade as string[]) ?? []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* ---------- H. Próximos passos ---------- */}
          <Card className="border-acao/25 shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-xl">E agora? Você decide o ritmo.</CardTitle>
              <p className="text-sm text-muted-foreground">
                Peça o orçamento sem compromisso ou converse antes — quem responde é gente
                de verdade.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <AcoesRecomendacao
                recommendationId={recomendacao.id}
                sessionId={recomendacao.session_id}
                nomeBuild={build?.nome ?? "computador recomendado"}
              />
              <div className="flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-sm">
                <Link
                  href="/pcs-prontos"
                  className="inline-flex items-center gap-1.5 font-medium text-acao hover:underline"
                >
                  <ArrowRight aria-hidden className="size-4" /> Ver opções parecidas
                </Link>
                <Link
                  href="/encontrar"
                  className="inline-flex items-center gap-1.5 font-medium text-acao hover:underline"
                >
                  <RefreshCw aria-hidden className="size-4" /> Refazer recomendação
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ---------- I. Faixa de confiança ---------- */}
          <FaixaConfianca className="pb-4" />
        </div>
      </main>
      <Rodape />
    </>
  );
}
