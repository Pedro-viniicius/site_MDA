import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  Calculator,
  Camera,
  Code2,
  Gamepad2,
  GraduationCap,
  Handshake,
  MessageCircleQuestion,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { BuildCard } from "@/components/site/build-card";
import { FormularioLead } from "@/components/site/formulario-lead";
import { listarBuilds, type Build } from "@/lib/api";

export const dynamic = "force-dynamic";

const PASSOS = [
  {
    titulo: "Conte o que você precisa",
    texto: "Responda perguntas simples sobre o seu dia a dia. Nada de termos técnicos.",
  },
  {
    titulo: "Receba a recomendação ideal",
    texto: "Nosso sistema cruza suas respostas com configurações testadas e compatíveis.",
  },
  {
    titulo: "Converse com um especialista",
    texto: "Uma pessoa de verdade revisa tudo com você e tira qualquer dúvida.",
  },
  {
    titulo: "Receba seu computador pronto",
    texto: "Montado, testado e configurado para usar assim que chegar.",
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
    texto: "Você sabe o que cada parte custa e por que ela está na sua configuração.",
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
  { icone: PencilRuler, rotulo: "Design gráfico" },
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

export default async function PaginaInicial() {
  const destaques = await buildsDestaque();

  return (
    <>
      <Navbar />
      <main id="conteudo">
        {/* ---------------- Hero ---------------- */}
        <section className="fundo-marca text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[3fr_2fr] md:items-center md:py-28">
            <div>
              <p className="mb-4 inline-block rounded-full border border-acao-clara/40 bg-navy-800/60 px-4 py-1 text-sm text-acao-clara">
                Computadores sob medida, sem complicação
              </p>
              <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Você não precisa entender de peças. <br className="hidden sm:block" />
                <span className="text-acao-clara">A gente entende por você.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
                Conte o que você faz no dia a dia — trabalho, estudos, jogos, projetos — e
                receba a recomendação do computador ideal, montado e garantido pela MDA.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  render={<Link href="/encontrar" />}
                  size="lg"
                  className="h-12 bg-acao px-6 text-base text-white hover:bg-acao-escura"
                >
                  Encontrar meu computador ideal
                </Button>
                <Button
                  render={<Link href="/pcs-prontos" />}
                  size="lg"
                  variant="outline"
                  className="h-12 border-navy-100/40 bg-transparent px-6 text-base text-white hover:bg-navy-800 hover:text-white"
                >
                  Ver computadores prontos
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-100">
                <li className="flex items-center gap-2"><ShieldCheck aria-hidden className="size-4 text-acao-clara" /> Compatibilidade verificada</li>
                <li className="flex items-center gap-2"><Wrench aria-hidden className="size-4 text-acao-clara" /> Montagem profissional</li>
                <li className="flex items-center gap-2"><MessageCircleQuestion aria-hidden className="size-4 text-acao-clara" /> Suporte humano</li>
              </ul>
            </div>
            <div className="hidden md:block" aria-hidden>
              <div className="rounded-2xl border border-navy-700/70 bg-navy-800/50 p-6 shadow-2xl">
                <p className="text-sm text-navy-100">Exemplo de recomendação</p>
                <p className="mt-3 font-heading text-lg text-white">
                  “Esse computador atende bem às demandas que você levantou, como planilhas,
                  reuniões online e uso cotidiano...”
                </p>
                <div className="mt-4 space-y-2 text-sm text-navy-100">
                  <p>✓ Configuração equilibrada</p>
                  <p>✓ Possibilidade de upgrades futuros</p>
                  <p>✓ Revisada por um especialista</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Como funciona ---------------- */}
        <section aria-labelledby="como-funciona" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 id="como-funciona" className="text-center font-heading text-3xl font-bold text-navy-900">
            Como funciona
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Em poucos minutos você sai daqui sabendo exatamente qual computador faz sentido para você.
          </p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((passo, indice) => (
              <li key={passo.titulo}>
                <Card className="h-full shadow-sm">
                  <CardHeader>
                    <span
                      aria-hidden
                      className="mb-2 flex size-10 items-center justify-center rounded-full bg-navy-50 font-heading text-lg font-bold text-navy-800"
                    >
                      {indice + 1}
                    </span>
                    <CardTitle className="font-heading text-lg">{passo.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">
                    {passo.texto}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- Benefícios ---------------- */}
        <section aria-labelledby="beneficios" className="bg-navy-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 id="beneficios" className="text-center font-heading text-3xl font-bold text-navy-900">
              Por que escolher a MDA
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFICIOS.map(({ icone: Icone, titulo, texto }) => (
                <Card key={titulo} className="h-full border-navy-100 shadow-sm">
                  <CardHeader>
                    <Icone aria-hidden className="mb-2 size-8 text-acao" />
                    <CardTitle className="font-heading text-lg">{titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">{texto}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Casos de uso ---------------- */}
        <section aria-labelledby="casos-de-uso" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 id="casos-de-uso" className="text-center font-heading text-3xl font-bold text-navy-900">
            Para o que você precisar
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Do uso mais simples ao projeto mais pesado — sempre com a configuração certa.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CASOS_DE_USO.map(({ icone: Icone, rotulo }) => (
              <li
                key={rotulo}
                className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm font-medium shadow-sm"
              >
                <Icone aria-hidden className="size-5 shrink-0 text-acao" />
                {rotulo}
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Button
              render={<Link href="/encontrar" />}
              size="lg"
              className="h-11 bg-acao px-6 text-white hover:bg-acao-escura"
            >
              Começar minha recomendação
            </Button>
          </div>
        </section>

        {/* ---------------- PCs prontos (vitrine) ---------------- */}
        <section aria-labelledby="pcs-prontos" className="bg-navy-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="pcs-prontos" className="font-heading text-3xl font-bold text-navy-900">
                  Computadores prontos para levar
                </h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Configurações montadas e testadas pela nossa equipe para os usos mais comuns.
                </p>
              </div>
              <Button render={<Link href="/pcs-prontos" />} variant="outline">
                Ver todos
              </Button>
            </div>
            {destaques.length > 0 ? (
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {destaques.map((build) => (
                  <BuildCard key={build.id} build={build} compacto />
                ))}
              </div>
            ) : (
              <Card className="mt-10 border-dashed">
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

        {/* ---------------- Contato ---------------- */}
        <section aria-labelledby="contato" className="fundo-marca text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
            <h2 id="contato" className="font-heading text-3xl font-bold">
              Ficou com alguma dúvida?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">
              Fale com a nossa equipe. Uma pessoa de verdade responde você — sem robô, sem
              enrolação e sem compromisso.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <FormularioLead
                origem="contato"
                titulo="Falar com a equipe MDA"
                descricao="Deixe seu contato e retornaremos rapidinho."
              >
                <Button size="lg" className="h-11 bg-acao px-6 text-white hover:bg-acao-escura">
                  Falar com um especialista
                </Button>
              </FormularioLead>
              <Button
                render={<Link href="/encontrar" />}
                size="lg"
                variant="outline"
                className="h-11 border-navy-100/40 bg-transparent px-6 text-white hover:bg-navy-800 hover:text-white"
              >
                Encontrar meu computador ideal
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
