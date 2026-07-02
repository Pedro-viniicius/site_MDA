"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  gerarRecomendacao,
  iniciarOnboarding,
  responderPergunta,
  type Pergunta,
} from "@/lib/api";

type Fase = "carregando" | "erro" | "perguntando" | "gerando";

/**
 * Fluxo guiado de recomendação: uma pergunta por vez, com progresso,
 * possibilidade de voltar e linguagem acolhedora do início ao fim.
 */
export function FluxoOnboarding() {
  const roteador = useRouter();
  const [fase, setFase] = useState<Fase>("carregando");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, unknown>>({});
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const iniciar = useCallback(async () => {
    setFase("carregando");
    try {
      const dados = await iniciarOnboarding();
      setSessionId(dados.session_id);
      setPerguntas(dados.perguntas);
      setIndice(0);
      setRespostas({});
      setFase("perguntando");
    } catch {
      setFase("erro");
    }
  }, []);

  useEffect(() => {
    void iniciar();
  }, [iniciar]);

  // Ao trocar de pergunta, leva o foco para o título (leitores de tela e teclado).
  useEffect(() => {
    if (fase === "perguntando") tituloRef.current?.focus();
  }, [indice, fase]);

  if (fase === "carregando") {
    return (
      <Card className="mx-auto w-full max-w-2xl shadow-sm">
        <CardContent className="space-y-4 py-10">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (fase === "erro") {
    return (
      <Card className="mx-auto w-full max-w-2xl border-dashed shadow-sm">
        <CardContent className="py-14 text-center">
          <p className="font-heading text-xl text-navy-900">Não conseguimos começar agora.</p>
          <p className="mt-2 text-muted-foreground">
            Nosso servidor não respondeu. Respire fundo e tente de novo — geralmente resolve.
          </p>
          <Button onClick={() => void iniciar()} className="mt-6 bg-acao text-white hover:bg-acao-escura">
            <RefreshCw aria-hidden /> Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (fase === "gerando") {
    return (
      <Card className="mx-auto w-full max-w-2xl shadow-sm">
        <CardContent className="py-16 text-center">
          <Sparkles aria-hidden className="mx-auto size-10 animate-pulse text-acao" />
          <p className="mt-6 font-heading text-xl text-navy-900" role="status">
            Montando a sua recomendação...
          </p>
          <p className="mt-2 text-muted-foreground">
            Estamos cruzando suas respostas com as configurações testadas pela nossa equipe.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pergunta = perguntas[indice];
  const total = perguntas.length;
  const valorAtual = respostas[pergunta.chave];
  const ultima = indice === total - 1;

  function respostaVazia(): boolean {
    if (valorAtual == null) return true;
    if (Array.isArray(valorAtual)) return valorAtual.length === 0;
    return String(valorAtual).trim() === "";
  }

  async function avancar() {
    if (pergunta.obrigatoria && respostaVazia()) {
      setErroValidacao(
        pergunta.tipo === "escolha_multipla"
          ? "Escolha pelo menos uma opção para continuar."
          : "Escolha uma opção para continuar."
      );
      return;
    }
    setErroValidacao(null);
    setEnviando(true);
    try {
      if (!respostaVazia()) {
        await responderPergunta(sessionId!, pergunta.chave, valorAtual ?? null);
      }
      if (ultima) {
        setFase("gerando");
        const recomendacao = await gerarRecomendacao(sessionId!);
        roteador.push(`/recomendacao/${recomendacao.id}`);
        return;
      }
      setIndice(indice + 1);
    } catch (erro) {
      setFase("perguntando");
      toast.error("Algo deu errado.", {
        description: erro instanceof Error ? erro.message : "Tente novamente em instantes.",
      });
    } finally {
      setEnviando(false);
    }
  }

  function voltar() {
    setErroValidacao(null);
    if (indice > 0) setIndice(indice - 1);
  }

  function definirResposta(valor: unknown) {
    setErroValidacao(null);
    setRespostas((atual) => ({ ...atual, [pergunta.chave]: valor }));
  }

  function alternarMultipla(valor: string, marcado: boolean) {
    const lista = Array.isArray(valorAtual) ? [...(valorAtual as string[])] : [];
    definirResposta(marcado ? [...lista, valor] : lista.filter((v) => v !== valor));
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-navy-800">
          Pergunta {indice + 1} de {total}
        </p>
        <Progress
          value={((indice + 1) / total) * 100}
          aria-label={`Progresso: pergunta ${indice + 1} de ${total}`}
        />
      </div>

      <Card className="shadow-sm">
        <CardContent className="py-8">
          <h2
            ref={tituloRef}
            tabIndex={-1}
            className="font-heading text-2xl font-bold text-navy-900 outline-none"
          >
            {pergunta.titulo}
          </h2>
          {pergunta.apoio && <p className="mt-2 text-muted-foreground">{pergunta.apoio}</p>}
          {!pergunta.obrigatoria && (
            <p className="mt-1 text-sm text-muted-foreground">(Opcional — pode pular se preferir.)</p>
          )}

          <div className="mt-6">
            {pergunta.tipo === "escolha_unica" && (
              <RadioGroup
                value={(valorAtual as string) ?? null}
                onValueChange={(valor) => definirResposta(valor)}
                className="gap-3"
              >
                {pergunta.opcoes.map((opcao) => (
                  <label
                    key={opcao.valor}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-acao/60 has-data-checked:border-acao has-data-checked:bg-navy-50"
                  >
                    <RadioGroupItem value={opcao.valor} className="mt-0.5" />
                    <span>
                      <span className="block font-medium">{opcao.rotulo}</span>
                      {opcao.descricao && (
                        <span className="block text-sm text-muted-foreground">{opcao.descricao}</span>
                      )}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}

            {pergunta.tipo === "escolha_multipla" && (
              <div className="grid gap-3" role="group" aria-label={pergunta.titulo}>
                {pergunta.opcoes.map((opcao) => {
                  const marcado =
                    Array.isArray(valorAtual) && (valorAtual as string[]).includes(opcao.valor);
                  return (
                    <label
                      key={opcao.valor}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-acao/60 has-data-checked:border-acao has-data-checked:bg-navy-50"
                    >
                      <Checkbox
                        checked={marcado}
                        onCheckedChange={(estado) => alternarMultipla(opcao.valor, estado === true)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block font-medium">{opcao.rotulo}</span>
                        {opcao.descricao && (
                          <span className="block text-sm text-muted-foreground">{opcao.descricao}</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {pergunta.tipo === "texto" && (
              <Textarea
                value={(valorAtual as string) ?? ""}
                onChange={(evento) => definirResposta(evento.target.value)}
                rows={4}
                placeholder="Escreva aqui, do seu jeito..."
                aria-label={pergunta.titulo}
              />
            )}
          </div>

          {erroValidacao && (
            <p role="alert" className="mt-4 text-sm font-medium text-destructive">
              {erroValidacao}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={voltar}
              disabled={indice === 0 || enviando}
            >
              <ArrowLeft aria-hidden /> Voltar
            </Button>
            <Button
              type="button"
              onClick={() => void avancar()}
              disabled={enviando}
              className="bg-acao px-6 text-white hover:bg-acao-escura"
            >
              {enviando ? (
                <>
                  <Loader2 aria-hidden className="animate-spin" /> Salvando...
                </>
              ) : ultima ? (
                <>
                  Ver minha recomendação <Sparkles aria-hidden />
                </>
              ) : (
                <>
                  {!pergunta.obrigatoria && respostaVazia() ? "Pular" : "Continuar"}{" "}
                  <ArrowRight aria-hidden />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Suas respostas ficam guardadas só para montar a recomendação — nada de spam.
      </p>
    </div>
  );
}
