import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { FluxoOnboarding } from "@/components/onboarding/fluxo";

export const metadata: Metadata = {
  title: "Encontrar meu computador ideal",
  description:
    "Responda perguntas simples — sem termos técnicos — e descubra o computador certo para o seu uso e o seu bolso.",
};

export default function PaginaEncontrar() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="flex-1 bg-navy-50/60">
        <section className="fundo-marca text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              Vamos encontrar o seu computador ideal
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">
              Sem termos técnicos, sem pegadinha. Você conta o que precisa e a gente cuida
              do resto — leva menos de 3 minutos.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <FluxoOnboarding />
        </div>
      </main>
      <Rodape />
    </>
  );
}
