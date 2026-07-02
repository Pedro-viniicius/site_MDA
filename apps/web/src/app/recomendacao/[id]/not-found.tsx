import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";

/** Estado para recomendações inexistentes ou expiradas. */
export default function RecomendacaoNaoEncontrada() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-navy-50/60 px-4 py-16">
        <Card className="w-full max-w-md border-dashed text-center shadow-sm">
          <CardContent className="py-14">
            <SearchX aria-hidden className="mx-auto size-10 text-muted-foreground" />
            <h1 className="mt-4 font-heading text-xl font-bold text-navy-900">
              Não encontramos essa recomendação
            </h1>
            <p className="mt-2 text-muted-foreground">
              O link pode estar incompleto ou a recomendação foi removida. Sem problema:
              fazer uma nova leva menos de 3 minutos.
            </p>
            <Button
              render={<Link href="/encontrar" />}
              className="mt-6 bg-acao text-white hover:bg-acao-escura"
            >
              Fazer nova recomendação
            </Button>
          </CardContent>
        </Card>
      </main>
      <Rodape />
    </>
  );
}
