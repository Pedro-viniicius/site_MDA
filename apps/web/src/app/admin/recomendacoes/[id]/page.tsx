import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, MessageCircleQuestion, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buscarRecomendacao, type Recomendacao } from "@/lib/api";
import { formatarData, formatarPreco } from "@/lib/formato";

export const dynamic = "force-dynamic";

const COR_CONFIANCA: Record<Recomendacao["nivel_confianca"], string> = {
  alta: "bg-green-100 text-green-800",
  media: "bg-amber-100 text-amber-800",
  baixa: "bg-red-100 text-red-800",
};

async function carregar(id: string): Promise<Recomendacao | null> {
  try {
    return await buscarRecomendacao(id);
  } catch {
    return null;
  }
}

function ValorResposta({ valor }: { valor: unknown }) {
  if (valor == null || valor === "") return <span className="text-muted-foreground">não informado</span>;
  if (Array.isArray(valor)) return <>{valor.join(", ")}</>;
  return <>{String(valor)}</>;
}

/** Visão técnica interna: tudo o que a equipe de montagem/vendas precisa. */
export default async function PainelRecomendacao({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recomendacao = await carregar(id);
  if (!recomendacao) notFound();

  const tecnico = recomendacao.resumo_tecnico as Record<string, unknown>;
  const notas = (tecnico.notas_compatibilidade as string[]) ?? [];
  const riscos = (tecnico.riscos as string[]) ?? [];
  const upgrades = (tecnico.sugestoes_upgrade as string[]) ?? [];
  const restricoes = (tecnico.restricoes_cliente as Record<string, unknown>) ?? {};

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1 text-sm font-medium text-acao hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" /> Voltar para leads
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-900">
            Recomendação — visão técnica
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerada em {formatarData(recomendacao.criado_em)} · ID {recomendacao.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={COR_CONFIANCA[recomendacao.nivel_confianca]}>
            Confiança {recomendacao.nivel_confianca}
          </Badge>
          <Badge variant="secondary">{recomendacao.perfil_detectado}</Badge>
        </div>
      </header>

      {/* Build e consumo */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="font-heading text-xl">
              {recomendacao.build?.nome ?? String(tecnico.build ?? "Build")}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Zap aria-hidden className="size-4 text-amber-600" />
                {recomendacao.watts_estimados} W estimados
              </span>
              <span className="font-heading text-lg font-semibold text-navy-800">
                {formatarPreco(recomendacao.orcamento_estimado)}
              </span>
            </div>
          </div>
          <CardDescription>
            Preço placeholder — {String(tecnico.margem_observacao ?? "definir margem real.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {recomendacao.build?.componentes.map((item) => (
              <li key={`${item.categoria}-${item.nome}`} className="rounded-lg border bg-card px-3 py-2">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                  {item.categoria}
                </span>
                <span className="font-medium">{item.nome}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <h2 className="mb-2 font-semibold text-navy-900">Notas de compatibilidade</h2>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {notas.map((nota) => (
                  <li key={nota}>{nota}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-2 font-semibold text-navy-900">Sugestões de upgrade</h2>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {upgrades.map((upgrade) => (
                  <li key={upgrade}>{upgrade}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Estoque:</span>{" "}
            {String(tecnico.estoque_observacao ?? "validar com fornecedor.")}
          </p>
        </CardContent>
      </Card>

      {/* Riscos */}
      {riscos.length > 0 && (
        <Card className="border-amber-300/60 bg-amber-50/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-base text-amber-900">
              <AlertTriangle aria-hidden className="size-5" /> Pontos de atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-amber-900/90">
              {riscos.map((risco) => (
                <li key={risco}>{risco}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Respostas do cliente */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Respostas do cliente</CardTitle>
            <CardDescription>O que foi informado no onboarding guiado.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {Object.entries(recomendacao.respostas_cliente).map(([chave, valor]) => (
                <div key={chave} className="flex flex-wrap justify-between gap-2 border-b pb-2 last:border-0">
                  <dt className="font-medium capitalize text-foreground/80">
                    {chave.replaceAll("_", " ")}
                  </dt>
                  <dd className="text-right text-muted-foreground">
                    <ValorResposta valor={valor} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Restrições registradas: já possui{" "}
              {Array.isArray(restricoes.ja_possui) && restricoes.ja_possui.length > 0
                ? (restricoes.ja_possui as string[]).join(", ")
                : "nada informado"}
              .
            </p>
          </CardContent>
        </Card>

        {/* Perguntas para o vendedor */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <MessageCircleQuestion aria-hidden className="size-5 text-acao" />
              Antes de fechar, pergunte ao cliente
            </CardTitle>
            <CardDescription>Sugestões geradas junto com a recomendação.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              {recomendacao.perguntas_para_vendedor.map((pergunta) => (
                <li key={pergunta}>{pergunta}</li>
              ))}
            </ul>
            <Separator className="my-4" />
            <p className="text-sm">
              <span className="font-semibold text-navy-900">Próxima ação sugerida:</span>{" "}
              <span className="text-muted-foreground">
                {String(tecnico.proxima_acao ?? "Entrar em contato com o cliente.")}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo enviado ao cliente */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">O que o cliente leu</CardTitle>
          <CardDescription>Resumo amigável exibido na página do cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-acao/40 pl-4 text-sm italic leading-relaxed text-muted-foreground">
            {recomendacao.resumo_cliente}
          </blockquote>
          <p className="mt-3 text-xs text-muted-foreground">
            <Link
              href={`/recomendacao/${recomendacao.id}`}
              className="font-medium text-acao underline"
            >
              Abrir a página do cliente
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
