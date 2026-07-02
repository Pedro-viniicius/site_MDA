"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { criarLead } from "@/lib/api";

const esquemaLead = z
  .object({
    nome: z.string().min(2, "Conte pra gente o seu nome."),
    email: z.string().email("Esse e-mail não parece válido.").or(z.literal("")).optional(),
    telefone: z.string().max(30, "Telefone muito longo.").optional(),
    mensagem: z.string().max(2000, "Mensagem muito longa.").optional(),
  })
  .refine((dados) => (dados.email && dados.email.length > 0) || (dados.telefone && dados.telefone.length > 0), {
    message: "Deixe um e-mail ou um telefone para a gente falar com você.",
    path: ["telefone"],
  });

type DadosLead = z.infer<typeof esquemaLead>;

type Props = {
  origem: string;
  recommendationId?: string | null;
  sessionId?: string | null;
  mensagemInicial?: string;
  titulo?: string;
  descricao?: string;
  children: React.ReactElement; // gatilho (botão)
};

/**
 * Diálogo de pedido de orçamento/contato. Envia um lead para a API e
 * confirma com o cliente em tom acolhedor.
 */
export function FormularioLead({
  origem,
  recommendationId,
  sessionId,
  mensagemInicial,
  titulo = "Solicitar orçamento",
  descricao = "Deixe seu contato e retornaremos rapidinho — sem compromisso.",
  children,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DadosLead>({
    resolver: zodResolver(esquemaLead),
    defaultValues: { mensagem: mensagemInicial ?? "" },
  });

  async function enviar(dados: DadosLead) {
    try {
      await criarLead({
        nome: dados.nome,
        email: dados.email || undefined,
        telefone: dados.telefone || undefined,
        mensagem: dados.mensagem || undefined,
        origem,
        recommendation_id: recommendationId ?? undefined,
        session_id: sessionId ?? undefined,
      });
      toast.success("Recebemos o seu pedido!", {
        description: "Um especialista da MDA vai entrar em contato em breve.",
      });
      setAberto(false);
      reset();
    } catch (erro) {
      toast.error("Não conseguimos enviar agora.", {
        description: erro instanceof Error ? erro.message : "Tente novamente em instantes.",
      });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(enviar)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="lead-nome">Seu nome *</Label>
            <Input id="lead-nome" placeholder="Como podemos te chamar?" {...register("nome")} />
            {errors.nome && (
              <p role="alert" className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="lead-telefone">WhatsApp / telefone</Label>
              <Input id="lead-telefone" placeholder="(00) 00000-0000" {...register("telefone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-email">E-mail</Label>
              <Input id="lead-email" type="email" placeholder="voce@email.com" {...register("email")} />
            </div>
          </div>
          {(errors.telefone || errors.email) && (
            <p role="alert" className="text-sm text-destructive">
              {errors.telefone?.message ?? errors.email?.message}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="lead-mensagem">Mensagem (opcional)</Label>
            <Textarea
              id="lead-mensagem"
              rows={3}
              placeholder="Alguma observação? Pode escrever à vontade."
              {...register("mensagem")}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-acao text-white hover:bg-acao-escura">
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden className="animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar pedido"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
