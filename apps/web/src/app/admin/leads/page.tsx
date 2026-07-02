import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listarLeads, type Lead } from "@/lib/api";
import { formatarData } from "@/lib/formato";

export const dynamic = "force-dynamic";

const ROTULO_ORIGEM: Record<string, string> = {
  recomendacao: "Recomendação guiada",
  especialista: "Falar com especialista",
  pcs_prontos: "PCs prontos",
  contato: "Contato geral",
};

async function carregar(): Promise<Lead[] | null> {
  try {
    return await listarLeads();
  } catch {
    return null;
  }
}

export default async function PainelLeads() {
  const leads = await carregar();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-heading text-3xl font-bold text-navy-900">Leads</h1>
        <p className="mt-1 text-muted-foreground">
          Pedidos de orçamento e contatos recebidos pelo site, do mais recente ao mais antigo.
        </p>
      </header>

      {!leads ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center text-muted-foreground">
            Não foi possível carregar os leads. Verifique se a API está no ar.
          </CardContent>
        </Card>
      ) : leads.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center">
            <p className="font-heading text-lg text-navy-900">Nenhum lead por enquanto</p>
            <p className="mt-2 text-muted-foreground">
              Assim que alguém pedir um orçamento ou quiser falar com um especialista, o
              contato aparece aqui com todo o histórico.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="shadow-sm">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-medium">{lead.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {[lead.telefone, lead.email].filter(Boolean).join(" · ") || "sem contato informado"}
                  </p>
                  {lead.mensagem && (
                    <p className="mt-1 line-clamp-2 max-w-xl text-sm text-muted-foreground">
                      “{lead.mensagem}”
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant="secondary">{ROTULO_ORIGEM[lead.origem] ?? lead.origem}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{formatarData(lead.criado_em)}</p>
                  </div>
                  {lead.recommendation_id && (
                    <Link
                      href={`/admin/recomendacoes/${lead.recommendation_id}`}
                      className="flex items-center gap-1 text-sm font-medium text-acao hover:underline"
                    >
                      Ver recomendação <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
