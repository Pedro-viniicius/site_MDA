import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cpu, LayoutDashboard, PcCase, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Painel administrativo",
  description: "Gestão interna da MDA Soluções em Tecnologia.",
};

const LINKS = [
  { href: "/admin", rotulo: "Visão geral", icone: LayoutDashboard },
  { href: "/admin/componentes", rotulo: "Componentes", icone: Cpu },
  { href: "/admin/builds", rotulo: "PCs prontos", icone: PcCase },
  { href: "/admin/leads", rotulo: "Leads", icone: Users },
];

/**
 * Estrutura do painel administrativo.
 * O acesso ainda é aberto para demonstração — a autenticação está no ROADMAP.
 */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="fundo-marca text-navy-100 md:w-64 md:shrink-0">
        <div className="flex items-center justify-between gap-3 p-4 md:flex-col md:items-start">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/marca/logo-branca.png"
              alt="MDA Soluções em Tecnologia"
              width={90}
              height={73}
              className="h-10 w-auto"
            />
            <span className="font-heading text-sm font-semibold text-white">Painel MDA</span>
          </Link>
          <Badge className="bg-navy-800 text-acao-clara">Demonstração</Badge>
        </div>
        <nav aria-label="Menu do painel" className="px-2 pb-4">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {LINKS.map(({ href, rotulo, icone: Icone }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-navy-800 hover:text-white focus-visible:outline-2 focus-visible:outline-acao-clara"
                >
                  <Icone aria-hidden className="size-4" />
                  {rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden px-5 pb-6 text-xs text-navy-100/70 md:block">
          <p>
            Acesso será protegido por login em uma próxima fase.{" "}
            <Link href="/" className="underline hover:text-white">
              Voltar ao site
            </Link>
          </p>
        </div>
      </aside>
      <main id="conteudo" className="flex-1 bg-navy-50/50 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
