import { HeartHandshake, ShieldCheck, UserCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Selo = { icone: LucideIcon; rotulo: string };

const SELOS_PADRAO: Selo[] = [
  { icone: ShieldCheck, rotulo: "Compatibilidade revisada" },
  { icone: UserCheck, rotulo: "Validado por especialista" },
  { icone: Wallet, rotulo: "Orçamento sem compromisso" },
  { icone: HeartHandshake, rotulo: "Suporte humano" },
];

/** Selo individual de confiança (chip com ícone). */
export function SeloConfianca({
  icone: Icone,
  rotulo,
  invertido = false,
}: Selo & { invertido?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium",
        invertido
          ? "border-navy-700/70 bg-navy-800/50 text-navy-100"
          : "border-navy-100 bg-navy-50 text-navy-800"
      )}
    >
      <Icone aria-hidden className={cn("size-4", invertido ? "text-acao-clara" : "text-acao")} />
      {rotulo}
    </span>
  );
}

/** Faixa horizontal com os selos de confiança da MDA. */
export function FaixaConfianca({
  invertido = false,
  className,
  selos = SELOS_PADRAO,
}: {
  invertido?: boolean;
  className?: string;
  selos?: Selo[];
}) {
  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {selos.map((selo) => (
        <li key={selo.rotulo}>
          <SeloConfianca {...selo} invertido={invertido} />
        </li>
      ))}
    </ul>
  );
}
