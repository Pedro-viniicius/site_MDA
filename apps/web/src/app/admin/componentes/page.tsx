import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listarCategorias, listarComponentes, type Categoria, type Componente } from "@/lib/api";
import { formatarPreco } from "@/lib/formato";

export const dynamic = "force-dynamic";

async function carregar(): Promise<{ categorias: Categoria[]; componentes: Componente[] } | null> {
  try {
    const [categorias, componentes] = await Promise.all([listarCategorias(), listarComponentes()]);
    return { categorias, componentes };
  } catch {
    return null;
  }
}

export default async function PainelComponentes() {
  const dados = await carregar();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-900">Componentes</h1>
          <p className="mt-1 text-muted-foreground">
            Catálogo atual (leitura). Os preços são placeholders do seed.
          </p>
        </div>
        <Badge variant="secondary">Cadastro e edição em breve</Badge>
      </header>

      {!dados ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center text-muted-foreground">
            Não foi possível carregar o catálogo. Verifique se a API está no ar.
          </CardContent>
        </Card>
      ) : (
        dados.categorias.map((categoria) => {
          const itens = dados.componentes.filter((c) => c.categoria_id === categoria.id);
          if (itens.length === 0) return null;
          return (
            <Card key={categoria.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-lg">{categoria.nome}</CardTitle>
                <CardDescription>{categoria.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th scope="col" className="py-2 pr-4 font-medium">Nome</th>
                        <th scope="col" className="py-2 pr-4 font-medium">Marca</th>
                        <th scope="col" className="py-2 pr-4 text-right font-medium">Preço (placeholder)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((componente) => (
                        <tr key={componente.id} className="border-b last:border-0">
                          <td className="py-2.5 pr-4 font-medium">{componente.nome}</td>
                          <td className="py-2.5 pr-4 text-muted-foreground">{componente.marca ?? "—"}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums">
                            {formatarPreco(componente.preco)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
