import Image from "next/image";
import Link from "next/link";

/** Rodapé institucional sobre o azul-marinho da marca. */
export function Rodape() {
  return (
    <footer className="fundo-marca mt-auto border-t border-navy-700/60 text-navy-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Image
            src="/marca/logo-branca.png"
            alt="MDA Soluções em Tecnologia"
            width={140}
            height={114}
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Computadores montados com cuidado, explicados com clareza. Você conta o que
            precisa, a gente cuida do resto.
          </p>
        </div>

        <nav aria-label="Links do rodapé" className="text-sm">
          <h2 className="mb-3 font-semibold text-white">Navegação</h2>
          <ul className="space-y-2">
            <li><Link className="hover:text-white hover:underline" href="/">Início</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/encontrar">Encontrar meu computador ideal</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/pcs-prontos">PCs prontos</Link></li>
            <li><Link className="hover:text-white hover:underline" href="/login">Área administrativa</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="mb-3 font-semibold text-white">Atendimento</h2>
          <ul className="space-y-2">
            <li>Seg. a sáb., das 9h às 18h</li>
            <li>WhatsApp: (00) 00000-0000 (em breve)</li>
            <li>E-mail: contato@mdasolucoes.com.br (em breve)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-700/60 py-4 text-center text-xs text-navy-100/80">
        © {new Date().getFullYear()} MDA Soluções em Tecnologia® — Todos os direitos reservados.
      </div>
    </footer>
  );
}
