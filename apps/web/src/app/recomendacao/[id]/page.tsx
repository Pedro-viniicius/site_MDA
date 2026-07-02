import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Laptop,
  Monitor as MonitorIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { AcoesRecomendacao } from "@/components/site/acoes-recomendacao";
import { buscarRecomendacao, type Recomendacao } from "@/lib/api";
import { formatarPreco } from "@/lib/formato";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sua recomendação",
  description: "Recomendação personalizada de computador feita pela MDA Soluções em Tecnologia.",
};

const ROTULO_CONFIANCA: Record<Recomendacao["nivel_confianca"], string> = {
  alta: "Recomendação com alta confiança",
  media: "Boa recomendação — vale revisar os avisos",
  baixa: "Recomendação inicial — fale com um especialista",
};

async function carregar(id: string): Promise<Recomendacao | null> {
  try {
    return await buscarRecomendacao(id);
  } catch {
    return null;
  }
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
  // Avisos internos (margem, estoque) ficam para o painel; ao cliente mostramos os relevantes.
  const avisosCliente = recomendacao.avisos.filter(
    (aviso) => !aviso.includes("incluir no orçamento")
  );

  return (
    <>
      <Navbar />
      <main id="conteudo" className="flex-1 bg-navy-50/60">
        <section className="fundo-marca text-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
            <Badge className="bg-navy-800 text-acao-clara">{ROTULO_CONFIANCA[recomendacao.nivel_confianca]}</Badge>
            <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
              Encontramos o computador certo para você!
            </h1>
            <p className="mt-3 max-w-2xl text-navy-100">
              Com base nas suas respostas, esta é a configuração que melhor equilibra o que
              você precisa com o quanto quer investir.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
          {/* Resumo amigável */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Nossa recomendação, em bom português</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-foreground/90">{recomendacao.resumo_cliente}</p>
            </CardContent>
          </Card>

          {/* Máquina recomendada */}
          {build && (
            <Card className="border-acao/30 shadow-sm">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="secondary" className="gap-1 text-navy-800">
                    <IconeTipo aria-hidden className="size-3.5" />
                    {build.tipo === "notebook" ? "Notebook" : "Computador de mesa"}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Investimento estimado</p>
                    <p className="font-heading text-2xl font-bold text-navy-800">
                      {formatarPreco(recomendacao.orcamento_estimado)}
                    </p>
                  </div>
                </div>
                <CardTitle className="font-heading text-2xl">{build.nome}</CardTitle>
                <CardDescription>{build.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="mb-3 font-heading text-base font-semibold text-navy-900">
                    O que vem nessa configuração
                  </h2>
                  <ul className="grid gap-2 text-sm sm:grid-cols-2">
                    {build.componentes.map((item) => (
                      <li
                        key={`${item.categoria}-${item.nome}`}
                        className="rounded-lg border bg-card px-3 py-2"
                      >
                        <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                          {item.categoria}
                        </span>
                        <span className="font-medium">{item.nome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-semibold text-navy-900">
                      <CheckCircle2 aria-hidden className="size-5 text-green-600" />
                      Vai muito bem para
                    </h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {build.pontos_fortes.map((ponto) => (
                        <li key={ponto} className="flex gap-2">
                          <span aria-hidden className="text-green-600">•</span>
                          <span className="first-letter:uppercase">{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-3 flex items-center gap-2 font-heading text-base font-semibold text-navy-900">
                      <CircleSlash aria-hidden className="size-5 text-amber-600" />
                      Pode não ser ideal para
                    </h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {build.limitacoes.map((limite) => (
                        <li key={limite} className="flex gap-2">
                          <span aria-hidden className="text-amber-600">•</span>
                          <span className="first-letter:uppercase">{limite}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Avisos de transparência */}
          {avisosCliente.length > 0 && (
            <Card className="border-amber-300/60 bg-amber-50/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-base text-amber-900">
                  <AlertTriangle aria-hidden className="size-5" />
                  Combinados importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-amber-900/90">
                  {avisosCliente.map((aviso) => (
                    <li key={aviso}>{aviso}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-xl">E agora?</CardTitle>
              <CardDescription>
                Peça o orçamento sem compromisso ou converse com a nossa equipe — quem
                responde é gente de verdade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AcoesRecomendacao
                recommendationId={recomendacao.id}
                sessionId={recomendacao.session_id}
                nomeBuild={build?.nome ?? "computador recomendado"}
              />
              <p className="mt-6 text-sm text-muted-foreground">
                Prefere ver outras opções?{" "}
                <Link href="/pcs-prontos" className="font-medium text-acao underline">
                  Conheça os computadores prontos
                </Link>{" "}
                ou{" "}
                <Link href="/encontrar" className="font-medium text-acao underline">
                  refaça a recomendação
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Rodape />
    </>
  );
}
