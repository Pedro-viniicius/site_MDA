"use client";

import { Bookmark, MessageCircle, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormularioLead } from "@/components/site/formulario-lead";

type Props = {
  recommendationId: string;
  sessionId: string;
  nomeBuild: string;
};

/** Ações do cliente na página de recomendação: orçamento, especialista e salvar. */
export function AcoesRecomendacao({ recommendationId, sessionId, nomeBuild }: Props) {
  async function salvarLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!", {
        description: "Guarde este link para rever sua recomendação quando quiser.",
      });
    } catch {
      toast.info("Copie o endereço da barra do navegador para guardar sua recomendação.");
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <FormularioLead
        origem="recomendacao"
        recommendationId={recommendationId}
        sessionId={sessionId}
        titulo="Solicitar orçamento"
        descricao={`Enviaremos o orçamento completo do ${nomeBuild}, sem compromisso.`}
        mensagemInicial={`Quero um orçamento do ${nomeBuild} recomendado para mim.`}
      >
        <Button size="lg" className="h-11 bg-acao px-6 text-white hover:bg-acao-escura">
          <ReceiptText aria-hidden /> Solicitar orçamento
        </Button>
      </FormularioLead>

      <FormularioLead
        origem="especialista"
        recommendationId={recommendationId}
        sessionId={sessionId}
        titulo="Falar com um especialista"
        descricao="Uma pessoa de verdade revisa a recomendação com você e tira todas as dúvidas."
      >
        <Button size="lg" variant="outline" className="h-11 px-6">
          <MessageCircle aria-hidden /> Falar com especialista
        </Button>
      </FormularioLead>

      <Button size="lg" variant="ghost" className="h-11 px-6" onClick={() => void salvarLink()}>
        <Bookmark aria-hidden /> Salvar recomendação
      </Button>
    </div>
  );
}
