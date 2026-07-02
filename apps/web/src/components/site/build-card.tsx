"use client";

import Link from "next/link";
import { Laptop, Monitor as MonitorIcon } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { FormularioLead } from "@/components/site/formulario-lead";
import { formatarPreco } from "@/lib/formato";
import type { Build } from "@/lib/api";

/** Card de um computador pronto, com pedido de orçamento embutido. */
export function BuildCard({ build, compacto = false }: { build: Build; compacto?: boolean }) {
  const Icone = build.tipo === "notebook" ? Laptop : MonitorIcon;

  return (
    <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="gap-1 text-navy-800">
            <Icone aria-hidden className="size-3.5" />
            {build.tipo === "notebook" ? "Notebook" : "Computador de mesa"}
          </Badge>
          <span className="font-heading text-lg font-semibold text-navy-800">
            {formatarPreco(build.preco)}
          </span>
        </div>
        <CardTitle className="font-heading text-xl">{build.nome}</CardTitle>
        <CardDescription>{build.uso_alvo}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {!compacto && <p className="text-sm leading-relaxed text-muted-foreground">{build.descricao}</p>}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-navy-800">Principais componentes</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {build.componentes.slice(0, compacto ? 4 : 8).map((item) => (
              <li key={`${item.categoria}-${item.nome}`} className="flex gap-2">
                <span className="min-w-28 shrink-0 font-medium text-foreground/80">{item.categoria}</span>
                <span>{item.nome}</span>
              </li>
            ))}
          </ul>
        </div>

        {build.publico_alvo && (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-navy-800">Indicado para: </span>
              {build.publico_alvo}
            </p>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <FormularioLead
          origem="pcs_prontos"
          titulo={`Tenho interesse no ${build.nome}`}
          descricao="Deixe seu contato e enviaremos o orçamento completo deste computador."
          mensagemInicial={`Tenho interesse no ${build.nome} (${formatarPreco(build.preco)}).`}
        >
          <Button className="w-full bg-acao text-white hover:bg-acao-escura">Quero este computador</Button>
        </FormularioLead>
        <Button render={<Link href="/encontrar" />} variant="outline" className="w-full">
          Comparar com a recomendação guiada
        </Button>
      </CardFooter>
    </Card>
  );
}
