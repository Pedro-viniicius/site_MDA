"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { OpcaoCard } from "@/components/onboarding/opcao-card";
import { iconeDaOpcao } from "@/lib/icones";
import {
  gerarRecomendacao,
  iniciarOnboarding,
  responderPergunta,
  type Pergunta,
} from "@/lib/api";

type Fase = "carregando" | "erro" | "perguntando" | "gerando";

/** Perguntas com poucas opções ganham cards grandes em linha. */
const PERGUNTAS_DESTAQUE = new Set(["intensidade", "tipo_equipamento", "automatico"]);

/**
 * Fluxo guiado de recomendação: uma pergunta por vez, com cards visuais,
 * progresso claro e possibilidade de voltar — um assistente, não um formulário.
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

  // Ao trocar de pergunta, o foco vai para o título (leitores de tela e teclado).
  useEffect(() => {
    if (fase === "perguntando") tituloRef.current?.focus();
  }, [indice, fase]);

  if (fase === "carregando") {
    return (
      <Card className="mx-auto w-full max-w-3xl shadow-sm">
        <CardContent className="space-y-4 py-10">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (fase === "erro") {
    return (
      <Card className="mx-auto w-full max-w-3xl border-dashed shadow-sm">
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
      <Card className="mx-auto w-full max-w-3xl shadow-sm">
        <CardContent className="py-16 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-navy-50">
            <Sparkles aria-hidden className="size-8 animate-pulse text-acao" />
          </span>
          <p className="mt-6 font-heading text-2xl font-bold text-navy-900" role="status">
            Montando a sua recomendação...
          </p>
          <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 aria-hidden className="size-4 text-green-600" />
              Analisando o que você precisa
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 aria-hidden className="size-4 text-green-600" />
              Comparando configurações testadas
            </li>
            <li className="flex items-center gap-2">
              <Loader2 aria-hidden className="size-4 animate-spin text-acao" />
              Verificando compatibilidade e orçamento
            </li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  const pergunta = perguntas[indice];
  const total = perguntas.length;
  const valorAtual = respostas[pergunta.chave];
  const ultima = indice === total - 1;
  const destaque = PERGUNTAS_DESTAQUE.has(pergunta.chave);
  const outroSoftwareMarcado =
    pergunta.chave === "softwares" &&
    Array.isArray(valorAtual) &&
    (valorAtual as string[]).includes("outro_software");

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
      // "Outro software" tem um campo livre auxiliar gravado na chave `programas`.
      if (pergunta.chave === "softwares") {
        const texto = (respostas["programas"] as string) ?? "";
        if (texto.trim()) {
          await responderPergunta(sessionId!, "programas", texto.trim());
        }
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

  function definirResposta(valor: unknown, chave: string = pergunta.chave) {
    setErroValidacao(null);
    setRespostas((atual) => ({ ...atual, [chave]: valor }));
  }

  function alternarMultipla(valor: string) {
    const lista = Array.isArray(valorAtual) ? [...(valorAtual as string[])] : [];
    definirResposta(
      lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progresso */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <p className="font-medium text-navy-800">
            Pergunta {indice + 1} de {total}
          </p>
          <p className="tabular-nums text-muted-foreground">
            {Math.round(((indice + 1) / total) * 100)}%
          </p>
        </div>
        <Progress
          value={((indice + 1) / total) * 100}
          aria-label={`Progresso: pergunta ${indice + 1} de ${total}`}
          className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-acao [&_[data-slot=progress-indicator]]:rounded-full"
        />
      </div>

      <Card className="shadow-md">
        <CardContent className="py-8 sm:px-8">
          {ultima && (
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-sm font-medium text-navy-800">
              <Sparkles aria-hidden className="size-3.5 text-acao" /> Falta só essa!
            </p>
          )}
          <h2
            ref={tituloRef}
            tabIndex={-1}
            className="font-heading text-2xl font-bold text-navy-900 outline-none sm:text-3xl"
          >
            {pergunta.titulo}
          </h2>
          {pergunta.apoio && <p className="mt-2 text-muted-foreground">{pergunta.apoio}</p>}
          {!pergunta.obrigatoria && (
            <p className="mt-1 text-sm font-medium text-acao">Opcional — pode pular.</p>
          )}

          {/* Opções em cards visuais */}
          <div className="mt-6">
            {pergunta.tipo !== "texto" && (
              <div
                role={pergunta.tipo === "escolha_unica" ? "radiogroup" : "group"}
                aria-label={pergunta.titulo}
                className={
                  destaque
                    ? "grid gap-3 sm:grid-cols-3"
                    : "grid gap-3 sm:grid-cols-2"
                }
              >
                {pergunta.opcoes.map((opcao) => {
                  const selecionado =
                    pergunta.tipo === "escolha_unica"
                      ? valorAtual === opcao.valor
                      : Array.isArray(valorAtual) &&
                        (valorAtual as string[]).includes(opcao.valor);
                  return (
                    <OpcaoCard
                      key={opcao.valor}
                      icone={iconeDaOpcao(pergunta.chave, opcao.valor)}
                      rotulo={opcao.rotulo}
                      descricao={opcao.descricao}
                      selecionado={selecionado}
                      modo={pergunta.tipo === "escolha_unica" ? "radio" : "checkbox"}
                      destaque={destaque}
                      onSelecionar={() =>
                        pergunta.tipo === "escolha_unica"
                          ? definirResposta(opcao.valor)
                          : alternarMultipla(opcao.valor)
                      }
                    />
                  );
                })}
              </div>
            )}

            {/* Campo livre revelado por "Outro software" */}
            {outroSoftwareMarcado && (
              <div className="mt-4 rounded-xl border border-acao/30 bg-navy-50/60 p-4">
                <Label htmlFor="outro-software" className="text-sm font-medium text-navy-900">
                  Se quiser, escreva aqui qual software você usa
                </Label>
                <Textarea
                  id="outro-software"
                  value={(respostas["programas"] as string) ?? ""}
                  onChange={(evento) => definirResposta(evento.target.value, "programas")}
                  rows={2}
                  placeholder="Ex.: Corel Draw, Rhino, um sistema da minha empresa..."
                  className="mt-2 bg-background"
                />
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

          {/* Navegação */}
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
              size="lg"
              className={
                ultima
                  ? "h-12 bg-acao px-7 text-base text-white shadow-lg shadow-acao/25 hover:bg-acao-escura"
                  : "bg-acao px-6 text-white hover:bg-acao-escura"
              }
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
        Suas respostas servem só para montar a recomendação — nada de spam.
      </p>
    </div>
  );
}
