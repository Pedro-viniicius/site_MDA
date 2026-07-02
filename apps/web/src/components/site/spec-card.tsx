import { iconeDaCategoria } from "@/lib/icones";
import { cn } from "@/lib/utils";

type Props = {
  categoria: string;
  nome: string;
  className?: string;
};

/** Card compacto de especificação: ícone da categoria + nome do componente. */
export function SpecCard({ categoria, nome, className }: Props) {
  const Icone = iconeDaCategoria(categoria);
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card p-3.5 shadow-xs transition-shadow hover:shadow-sm",
        className
      )}
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800"
      >
        <Icone className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {categoria}
        </p>
        <p className="truncate text-sm font-medium text-foreground" title={nome}>
          {nome}
        </p>
      </div>
    </div>
  );
}
