/** Utilidades de formatação em pt-BR. */

export function formatarPreco(valor: string | number): string {
  const numero = typeof valor === "string" ? Number.parseFloat(valor) : valor;
  if (Number.isNaN(numero)) return "sob consulta";
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
