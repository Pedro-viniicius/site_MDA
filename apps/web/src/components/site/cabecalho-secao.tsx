import { cn } from "@/lib/utils";

type Props = {
  /** Rótulo pequeno acima do título (ex.: "Como funciona"). */
  chapeu?: string;
  titulo: string;
  descricao?: string;
  alinhamento?: "centro" | "esquerda";
  /** Use true em seções sobre fundo navy. */
  invertido?: boolean;
  id?: string;
};

/** Cabeçalho padrão de seção: chapéu + título + descrição, com hierarquia forte. */
export function CabecalhoSecao({
  chapeu,
  titulo,
  descricao,
  alinhamento = "centro",
  invertido = false,
  id,
}: Props) {
  const centralizado = alinhamento === "centro";
  return (
    <div className={cn("max-w-2xl", centralizado && "mx-auto text-center")}>
      {chapeu && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-widest",
            invertido ? "text-acao-clara" : "text-acao"
          )}
        >
          {chapeu}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          "font-heading text-3xl font-bold sm:text-4xl",
          invertido ? "text-white" : "text-navy-900"
        )}
      >
        {titulo}
      </h2>
      {descricao && (
        <p className={cn("mt-4 text-lg leading-relaxed", invertido ? "text-navy-100" : "text-muted-foreground")}>
          {descricao}
        </p>
      )}
    </div>
  );
}
