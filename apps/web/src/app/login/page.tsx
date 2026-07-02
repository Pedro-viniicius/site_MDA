import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/site/navbar";
import { Rodape } from "@/components/site/rodape";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesso à área administrativa da MDA Soluções em Tecnologia.",
};

/**
 * Página de login (placeholder polido).
 * A autenticação real está prevista no ROADMAP — por enquanto o painel
 * administrativo pode ser visitado livremente em /admin para demonstração.
 */
export default function PaginaLogin() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="flex flex-1 items-center justify-center bg-navy-50 px-4 py-16">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="items-center text-center">
            <Image
              src="/marca/logo-azul.png"
              alt="MDA Soluções em Tecnologia"
              width={116}
              height={94}
              className="mx-auto h-16 w-auto"
            />
            <CardTitle className="mt-4 font-heading text-2xl">Área administrativa</CardTitle>
            <CardDescription>
              Acesso restrito à equipe MDA para gestão de catálogo, builds e leads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="gap-1.5">
                <Lock aria-hidden className="size-3" />
                Login com senha em desenvolvimento
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-email">E-mail</Label>
              <Input id="login-email" type="email" placeholder="voce@mdasolucoes.com.br" disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-senha">Senha</Label>
              <Input id="login-senha" type="password" placeholder="••••••••" disabled />
            </div>
            <Button className="w-full" disabled>
              Entrar (em breve)
            </Button>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground">
            <p>
              Enquanto a autenticação não chega, você pode{" "}
              <Link href="/admin" className="font-medium text-acao underline">
                visitar o painel de demonstração
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </main>
      <Rodape />
    </>
  );
}
