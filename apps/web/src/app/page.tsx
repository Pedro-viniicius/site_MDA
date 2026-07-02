import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calculator,
  Camera,
  CheckCircle2,
  Code2,
  Cpu,
  Gamepad2,
  GraduationCap,
  Handshake,
  MessageSquareText,
  Package,
  Palette,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { BuildCard } from "@/components/site/build-card";
import { CabecalhoSecao } from "@/components/site/cabecalho-secao";
import { FaixaConfianca } from "@/components/site/selo-confianca";
import { FormularioLead } from "@/components/site/formulario-lead";
import { listarBuilds, type Build } from "@/lib/api";

export const dynamic = "force-dynamic";

const PASSOS = [
  {
    icone: MessageSquareText,
    titulo: "Conte o que você precisa",
    texto: "Perguntas simples sobre o seu dia a dia. Nada de termos técnicos.",
  },
  {
    icone: Cpu,
    titulo: "Receba a recomendação",
    texto: "Cruzamos suas respostas com configurações testadas e compatíveis.",
  },
  {
    icone: UserCheck,
    titulo: "Revise com um especialista",
    texto: "Uma pessoa de verdade confere tudo com você, sem compromisso.",
  },
  {
    icone: Package,
    titulo: "Receba pronto para usar",
    texto: "Montado, testado e configurado. É ligar e começar.",
  },
];

const BENEFICIOS = [
  {
    icone: ShieldCheck,
    titulo: "Compatibilidade garantida",
    texto: "Cada peça é verificada para funcionar em conjunto — sem surpresas depois.",
  },
  {
    icone: Sparkles,
    titulo: "Sem enrolação técnica",
    texto: "Explicamos tudo em linguagem simples. Você entende o que está levando.",
  },
  {
    icone: BadgeCheck,
    titulo: "Transparência no preço",
    texto: "Você sabe o que cada parte custa e por que ela está na configuração.",
  },
  {
    icone: Handshake,
    titulo: "Suporte humano de verdade",
    texto: "Especialistas acompanham você antes, durante e depois da compra.",
  },
];

const CASOS_DE_USO = [
  { icone: Briefcase, rotulo: "Trabalho e escritório" },
  { icone: GraduationCap, rotulo: "Estudos" },
  { icone: Calculator, rotulo: "Planilhas e gestão" },
  { icone: Gamepad2, rotulo: "Jogos" },
  { icone: Palette, rotulo: "Design gráfico" },
  { icone: Camera, rotulo: "Edição de vídeo" },
  { icone: Ruler, rotulo: "Engenharia e CAD" },
  { icone: Code2, rotulo: "Programação" },
];

async function buildsDestaque(): Promise<Build[]> {
  try {
    const todas = await listarBuilds();
    const slugs = ["pc-estudos-rotina", "pc-gamer-entrada", "pc-design-edicao"];
    const destaque = todas.filter((b) => slugs.includes(b.slug));
    return destaque.length > 0 ? destaque : todas.slice(0, 3);
  } catch {
    return []; // API fora do ar: a home continua funcionando sem a vitrine.
  }
}

/** Composição visual do hero: prévia de uma recomendação real. */
function VisualHero() {
  return (
    <div aria-hidden className="relative hidden md:block">
      {/* Card principal */}
      <div className="relative rounded-2xl border border-navy-700/70 bg-navy-800/60 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-sm text-navy-100">Sua recomendação</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-400/15 px-2.5 py-1 text-xs font-medium text-green-300">
            <CheckCircle2 className="size-3.5" /> Alta confiança
          </span>
        </div>
        <p className="mt-4 font-heading text-xl font-semibold text-white">PC Estudos e Rotina</p>
        <p className="mt-1 text-sm text-navy-100">
          “O computador certo para estudos, planilhas e uso do dia a dia.”
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-navy-100">
          {["Compatibilidade revisada", "Cabe no orçamento", "Pronto para upgrades", "Revisão humana"].map(
            (item) => (
              <p key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0 text-acao-clara" /> {item}
              </p>
            )
          )}
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-navy-700/70 pt-4">
          <p className="text-xs text-navy-100">Investimento estimado</p>
          <p className="font-heading text-2xl font-bold text-white">R$ 2.890</p>
        </div>
      </div>
      {/* Chips flutuantes */}
      <span className="absolute -left-6 -top-4 inline-flex rotate-[-4deg] items-center gap-1.5 rounded-full border border-navy-700/70 bg-navy-900/90 px-3 py-1.5 text-xs font-medium text-navy-100 shadow-lg">
        <Cpu className="size-3.5 text-acao-clara" /> 6 núcleos
      </span>
      <span className="absolute -bottom-4 right-8 inline-flex rotate-[3deg] items-center gap-1.5 rounded-full border border-navy-700/70 bg-navy-900/90 px-3 py-1.5 text-xs font-medium text-navy-100 shadow-lg">
        <Sparkles className="size-3.5 text-acao-clara" /> 16 GB RAM · SSD
      </span>
    </div>
  );
}

export default async function PaginaInicial() {
  const destaques = await buildsDestaque();

  return (
    <>
      <Navbar />
      <main id="conteudo">
        {/* ---------------- Hero ---------------- */}
        <section className="fundo-hero relative overflow-hidden text-white">
          <div aria-hidden className="padrao-grade absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[7fr_5fr] md:items-center md:py-28">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-acao-clara/40 bg-navy-800/60 px-4 py-1.5 text-sm text-acao-clara">
                <Sparkles aria-hidden className="size-4" />
                Recomendação guiada, do jeito humano
              </p>
              <h1 className="font-heading text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                Você não precisa entender de peças.{" "}
                <span className="text-acao-clara">A gente entende por você.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
                Conte o que você faz no dia a dia e receba, em minutos, o computador ideal
                para o seu uso e o seu bolso — montado, testado e garantido pela MDA.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  render={<Link href="/encontrar" />}
                  size="lg"
                  className="h-13 bg-acao px-7 text-base font-semibold text-white shadow-lg shadow-acao/30 transition-transform hover:scale-[1.02] hover:bg-acao-escura"
                >
                  Encontrar meu computador ideal <ArrowRight aria-hidden />
                </Button>
                <Button
                  render={<Link href="/pcs-prontos" />}
                  size="lg"
                  variant="ghost"
                  className="h-13 px-6 text-base text-navy-100 hover:bg-navy-800 hover:text-white"
                >
                  Ver computadores prontos
                </Button>
              </div>
              <p className="mt-4 text-sm text-navy-100/80">
                Leva menos de 3 minutos · Gratuito · Sem compromisso
              </p>
              <FaixaConfianca invertido className="mt-8 justify-start" />
            </div>
            <VisualHero />
          </div>
        </section>

        {/* ---------------- Como funciona ---------------- */}
        <section aria-labelledby="como-funciona" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <CabecalhoSecao
            id="como-funciona"
            chapeu="Como funciona"
            titulo="Do seu jeito de usar ao computador pronto"
            descricao="Quatro passos simples — e em todos eles você fala com gente de verdade."
          />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map(({ icone: Icone, titulo, texto }, indice) => (
              <li key={titulo} className="relative">
                <Card className="card-elevavel h-full border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="flex size-12 items-center justify-center rounded-xl bg-navy-800 text-white shadow-md shadow-navy-800/20"
                      >
                        <Icone className="size-6" />
                      </span>
                      <span
                        aria-hidden
                        className="font-heading text-4xl font-bold text-navy-100"
                      >
                        {indice + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold text-navy-900">
                      {titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texto}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- Benefícios ---------------- */}
        <section aria-labelledby="beneficios" className="bg-navy-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <CabecalhoSecao
              id="beneficios"
              chapeu="Por que a MDA"
              titulo="Confiança em cada detalhe"
              descricao="Escolher um computador não precisa ser um salto no escuro."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFICIOS.map(({ icone: Icone, titulo, texto }) => (
                <Card key={titulo} className="card-elevavel h-full border-navy-100 shadow-sm">
                  <CardContent className="pt-6">
                    <span
                      aria-hidden
                      className="mb-4 flex size-12 items-center justify-center rounded-xl bg-acao/10 text-acao"
                    >
                      <Icone className="size-6" />
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-navy-900">{titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texto}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Casos de uso ---------------- */}
        <section aria-labelledby="casos-de-uso" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <CabecalhoSecao
            id="casos-de-uso"
            chapeu="Para o que você precisa"
            titulo="Escolha o seu uso — a gente cuida do resto"
            descricao="Do mais simples ao mais pesado, sempre com a configuração certa."
          />
          <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CASOS_DE_USO.map(({ icone: Icone, rotulo }) => (
              <li key={rotulo}>
                <Link
                  href="/encontrar"
                  className="card-elevavel group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acao"
                >
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800 transition-colors group-hover:bg-acao group-hover:text-white"
                  >
                    <Icone className="size-5" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{rotulo}</span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- PCs prontos (vitrine) ---------------- */}
        <section aria-labelledby="pcs-prontos" className="bg-navy-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <CabecalhoSecao
                id="pcs-prontos"
                chapeu="Vitrine"
                titulo="Computadores prontos para levar"
                descricao="Montados e testados pela nossa equipe para os usos mais comuns."
                alinhamento="esquerda"
              />
              <Button render={<Link href="/pcs-prontos" />} variant="outline">
                Ver todos <ArrowRight aria-hidden />
              </Button>
            </div>
            {destaques.length > 0 ? (
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {destaques.map((build) => (
                  <BuildCard key={build.id} build={build} compacto />
                ))}
              </div>
            ) : (
              <Card className="mt-12 border-dashed">
                <CardContent className="py-12 text-center text-muted-foreground">
                  A vitrine está sendo atualizada. Visite a página de{" "}
                  <Link href="/pcs-prontos" className="text-acao underline">
                    computadores prontos
                  </Link>{" "}
                  em instantes.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* ---------------- CTA final ---------------- */}
        <section aria-labelledby="contato" className="fundo-hero relative overflow-hidden text-white">
          <div aria-hidden className="padrao-grade absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <h2 id="contato" className="mx-auto max-w-2xl font-heading text-3xl font-bold sm:text-4xl">
              Pronto para ter um computador que{" "}
              <span className="text-acao-clara">entende você</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-navy-100">
              Comece agora — e, se preferir conversar antes, é gente de verdade que responde.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                render={<Link href="/encontrar" />}
                size="lg"
                className="h-13 bg-acao px-7 text-base font-semibold text-white shadow-lg shadow-acao/30 transition-transform hover:scale-[1.02] hover:bg-acao-escura"
              >
                Encontrar meu computador ideal <ArrowRight aria-hidden />
              </Button>
              <FormularioLead
                origem="contato"
                titulo="Falar com a equipe MDA"
                descricao="Deixe seu contato e retornaremos rapidinho."
              >
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-13 px-6 text-base text-navy-100 hover:bg-navy-800 hover:text-white"
                >
                  Falar com um especialista
                </Button>
              </FormularioLead>
            </div>
            <FaixaConfianca invertido className="mt-10" />
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
