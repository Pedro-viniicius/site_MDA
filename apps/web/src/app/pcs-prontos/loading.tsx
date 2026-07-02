import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";
import { Skeleton } from "@/components/ui/skeleton";

/** Estado de carregamento da vitrine de PCs prontos. */
export default function CarregandoPcsProntos() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="fundo-marca">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <Skeleton className="h-10 w-72 bg-navy-700/60" />
            <Skeleton className="mt-4 h-5 w-full max-w-2xl bg-navy-700/60" />
          </div>
        </section>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, indice) => (
            <div key={indice} className="space-y-4 rounded-xl border p-6">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </main>
      <Rodape />
    </>
  );
}
