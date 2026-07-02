"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  icone: LucideIcon;
  rotulo: string;
  descricao?: string | null;
  selecionado: boolean;
  /** "radio" para escolha única, "checkbox" para múltipla. */
  modo: "radio" | "checkbox";
  onSelecionar: () => void;
  /** Card maior (ex.: desktop × notebook). */
  destaque?: boolean;
};

/**
 * Card de opção do onboarding: ícone grande, estado selecionado bem visível,
 * totalmente acessível por teclado (botão nativo com aria-pressed/checked).
 */
export function OpcaoCard({
  icone: Icone,
  rotulo,
  descricao,
  selecionado,
  modo,
  onSelecionar,
  destaque = false,
}: Props) {
  return (
    <button
      type="button"
      role={modo === "radio" ? "radio" : "checkbox"}
      aria-checked={selecionado}
      onClick={onSelecionar}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-xl border-2 bg-card p-4 text-left transition-all duration-150",
        "hover:-translate-y-0.5 hover:border-acao/50 hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acao",
        destaque && "flex-col items-center p-6 text-center sm:gap-4",
        selecionado
          ? "border-acao bg-navy-50 shadow-sm"
          : "border-border shadow-xs"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg transition-colors",
          destaque ? "size-14" : "size-10",
          selecionado
            ? "bg-acao text-white"
            : "bg-navy-50 text-navy-800 group-hover:bg-navy-100"
        )}
      >
        <Icone className={destaque ? "size-7" : "size-5"} />
      </span>

      <span className={cn("min-w-0 flex-1", destaque && "flex-none")}>
        <span className={cn("block font-medium text-foreground", destaque && "font-heading text-lg")}>
          {rotulo}
        </span>
        {descricao && (
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
            {descricao}
          </span>
        )}
      </span>

      {/* Indicador de seleção no canto */}
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border-2 transition-all",
          modo === "radio" ? "rounded-full" : "rounded-md",
          selecionado
            ? "border-acao bg-acao text-white"
            : "border-border bg-background group-hover:border-acao/50"
        )}
      >
        {selecionado && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}
