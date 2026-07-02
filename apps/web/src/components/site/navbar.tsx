"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/pcs-prontos", rotulo: "PCs Prontos" },
  { href: "/encontrar", rotulo: "Encontrar meu PC" },
];

/** Barra de navegação principal, sempre sobre o azul-marinho da marca. */
export function Navbar() {
  const [aberto, setAberto] = useState(false);
  const rota = usePathname();

  return (
    <header className="fundo-marca sticky top-0 z-50 border-b border-navy-700/60">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acao-clara">
          <Image
            src="/marca/logo-branca.png"
            alt="MDA Soluções em Tecnologia"
            width={116}
            height={94}
            className="h-11 w-auto"
            priority
          />
          <span className="sr-only">MDA Soluções em Tecnologia — página inicial</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={rota === link.href ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acao-clara ${
                rota === link.href
                  ? "bg-navy-700/70 text-white"
                  : "text-navy-100 hover:bg-navy-800 hover:text-white"
              }`}
            >
              {link.rotulo}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:bg-navy-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acao-clara"
          >
            Entrar
          </Link>
          <Button
            render={<Link href="/encontrar" />}
            className="ml-2 bg-acao text-white hover:bg-acao-escura"
          >
            Encontrar meu computador ideal
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          className="rounded-md p-2 text-navy-100 hover:bg-navy-800 hover:text-white focus-visible:outline-2 focus-visible:outline-acao-clara md:hidden"
        >
          {aberto ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </nav>

      {aberto && (
        <div id="menu-mobile" className="border-t border-navy-700/60 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {[...LINKS, { href: "/login", rotulo: "Entrar" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-navy-100 hover:bg-navy-800 hover:text-white"
              >
                {link.rotulo}
              </Link>
            ))}
            <Button
              render={<Link href="/encontrar" onClick={() => setAberto(false)} />}
              className="mt-2 bg-acao text-white hover:bg-acao-escura"
            >
              Encontrar meu computador ideal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
