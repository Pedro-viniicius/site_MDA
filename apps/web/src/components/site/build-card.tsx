"use client";

import Link from "next/link";
import {
  Gamepad2,
  HardDrive,
  Laptop,
  MemoryStick,
  Monitor as MonitorIcon,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormularioLead } from "@/components/site/formulario-lead";
import { iconeDaCategoria } from "@/lib/icones";
import { formatarPreco } from "@/lib/formato";
import type { Build } from "@/lib/api";

/** Chips rápidos de especificação a partir do que a build entrega. */
function ChipsSpecs({ build }: { build: Build }) {
  const chips = [
    { icone: MemoryStick, rotulo: `${build.requisitos.ram_gb ?? "—"} GB RAM` },
    {
      icone: HardDrive,
      rotulo:
        (build.requisitos.ssd_gb ?? 0) >= 1000
          ? `SSD ${(build.requisitos.ssd_gb ?? 0) / 1000} TB`
          : `SSD ${build.requisitos.ssd_gb ?? "—"} GB`,
    },
    {
      icone: (build.requisitos.gpu_tier ?? 0) > 1 ? Gamepad2 : Sparkles,
      rotulo: (build.requisitos.gpu_tier ?? 0) > 1 ? "Placa de vídeo dedicada" : "Vídeo integrado",
    },
  ];
  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map(({ icone: Icone, rotulo }) => (
        <li
          key={rotulo}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-800"
        >
          <Icone aria-hidden className="size-3.5 text-acao" />
          {rotulo}
        </li>
      ))}
    </ul>
  );
}

/** Card de um computador pronto, com pedido de orçamento embutido. */
export function BuildCard({ build, compacto = false }: { build: Build; compacto?: boolean }) {
  const IconeTipo = build.tipo === "notebook" ? Laptop : MonitorIcon;
  const principais = build.componentes.slice(0, compacto ? 3 : 5);

  return (
    <Card className="card-elevavel flex h-full flex-col border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="gap-1 text-navy-800">
            <IconeTipo aria-hidden className="size-3.5" />
            {build.tipo === "notebook" ? "Notebook" : "Computador de mesa"}
          </Badge>
        </div>
        <CardTitle className="font-heading text-xl">{build.nome}</CardTitle>
        <CardDescription>{build.uso_alvo}</CardDescription>
        <p className="pt-1">
          <span className="text-xs text-muted-foreground">Investimento estimado</span>
          <span className="block font-heading text-2xl font-bold text-navy-800">
            {formatarPreco(build.preco)}
          </span>
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <ChipsSpecs build={build} />

        {!compacto && (
          <p className="text-sm leading-relaxed text-muted-foreground">{build.descricao}</p>
        )}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Principais componentes
          </h3>
          <ul className="space-y-1.5 text-sm">
            {principais.map((item) => {
              const Icone = iconeDaCategoria(item.categoria);
              return (
                <li key={`${item.categoria}-${item.nome}`} className="flex items-center gap-2">
                  <Icone aria-hidden className="size-4 shrink-0 text-navy-800/60" />
                  <span className="truncate text-foreground/90" title={item.nome}>
                    {item.nome}
                  </span>
                </li>
              );
            })}
            {build.componentes.length > principais.length && (
              <li className="text-xs text-muted-foreground">
                + {build.componentes.length - principais.length} itens na configuração completa
              </li>
            )}
          </ul>
        </div>

        {build.publico_alvo && (
          <p className="rounded-lg bg-navy-50/70 px-3 py-2 text-sm text-navy-800">
            <span className="font-semibold">Indicado para: </span>
            {build.publico_alvo}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <FormularioLead
          origem="pcs_prontos"
          titulo={`Tenho interesse no ${build.nome}`}
          descricao="Deixe seu contato e enviaremos o orçamento completo deste computador."
          mensagemInicial={`Tenho interesse no ${build.nome} (${formatarPreco(build.preco)}).`}
        >
          <Button className="w-full bg-acao text-white hover:bg-acao-escura">
            Quero este computador
          </Button>
        </FormularioLead>
        <Button render={<Link href="/encontrar" />} variant="ghost" size="sm" className="w-full text-navy-800">
          Comparar com a recomendação guiada
        </Button>
      </CardFooter>
    </Card>
  );
}
