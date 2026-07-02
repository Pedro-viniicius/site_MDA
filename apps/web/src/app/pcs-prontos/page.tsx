import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { BuildCard } from "@/components/site/build-card";
import { listarBuilds, type Build } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PCs Prontos",
  description:
    "Computadores montados e testados pela MDA para os usos mais comuns: escritório, estudos, jogos, design, engenharia e muito mais.",
};

async function buscarBuilds(): Promise<Build[] | null> {
  try {
    return await listarBuilds();
  } catch {
    return null; // API indisponível
  }
}

export default async function PaginaPcsProntos() {
  const builds = await buscarBuilds();

  return (
    <>
      <Navbar />
      <main id="conteudo" className="flex-1">
        <section className="fundo-marca text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h1 className="font-heading text-4xl font-bold">Computadores prontos</h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-100">
              Configurações montadas, testadas e garantidas pela nossa equipe. Se preferir
              algo sob medida, use a{" "}
              <Link href="/encontrar" className="text-acao-clara underline hover:text-white">
                recomendação guiada
              </Link>{" "}
              — é rápido e gratuito.
            </p>
          </div>
        </section>

        <section aria-label="Lista de computadores prontos" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          {builds === null && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <p className="font-heading text-lg text-navy-900">
                  Não conseguimos carregar a vitrine agora.
                </p>
                <p className="mt-2 text-muted-foreground">
                  Verifique sua conexão ou tente novamente em instantes.
                </p>
              </CardContent>
            </Card>
          )}

          {builds !== null && builds.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <p className="font-heading text-lg text-navy-900">
                  Estamos preparando novas configurações.
                </p>
                <p className="mt-2 text-muted-foreground">
                  Enquanto isso, conte o que você precisa e receba uma recomendação sob medida.
                </p>
                <Button
                  render={<Link href="/encontrar" />}
                  className="mt-6 bg-acao text-white hover:bg-acao-escura"
                >
                  Encontrar meu computador ideal
                </Button>
              </CardContent>
            </Card>
          )}

          {builds !== null && builds.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {builds.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-navy-50">
          <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
            <h2 className="font-heading text-2xl font-bold text-navy-900">
              Não sabe qual escolher?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Responda algumas perguntas simples e a gente indica a opção certa para o seu
              uso e o seu bolso.
            </p>
            <Button
              render={<Link href="/encontrar" />}
              size="lg"
              className="mt-6 h-11 bg-acao px-6 text-white hover:bg-acao-escura"
            >
              Fazer a recomendação guiada
            </Button>
          </div>
        </section>
      </main>
      <Rodape />
    </>
  );
}
