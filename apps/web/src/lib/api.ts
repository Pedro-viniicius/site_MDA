/**
 * Cliente tipado da API da plataforma MDA.
 *
 * - No navegador usa NEXT_PUBLIC_API_URL (ex.: http://localhost:8001).
 * - No servidor Next.js usa API_URL_INTERNA (dentro do Docker: http://api:8000).
 */

export type OpcaoPergunta = {
  valor: string;
  rotulo: string;
  descricao?: string | null;
};

export type Pergunta = {
  chave: string;
  titulo: string;
  apoio?: string | null;
  tipo: "escolha_unica" | "escolha_multipla" | "texto";
  obrigatoria: boolean;
  opcoes: OpcaoPergunta[];
};

export type ItemBuild = {
  categoria: string;
  nome: string;
  quantidade: number;
};

export type Build = {
  id: number;
  slug: string;
  nome: string;
  tipo: "desktop" | "notebook";
  perfil: string;
  descricao?: string | null;
  uso_alvo?: string | null;
  publico_alvo?: string | null;
  preco: string;
  requisitos: Record<string, number>;
  pontos_fortes: string[];
  limitacoes: string[];
  componentes: ItemBuild[];
};

export type Categoria = {
  id: number;
  slug: string;
  nome: string;
  descricao?: string | null;
};

export type Componente = {
  id: number;
  categoria_id: number;
  nome: string;
  marca?: string | null;
  descricao?: string | null;
  preco: string;
  attrs: Record<string, unknown>;
  ativo: boolean;
};

export type Recomendacao = {
  id: string;
  session_id: string;
  perfil_detectado: string;
  resumo_cliente: string;
  resumo_tecnico: Record<string, unknown>;
  nivel_confianca: "alta" | "media" | "baixa";
  avisos: string[];
  perguntas_para_vendedor: string[];
  watts_estimados: number;
  orcamento_estimado: string;
  criado_em: string;
  build?: Build | null;
  respostas_cliente: Record<string, unknown>;
};

export type NovoLead = {
  nome: string;
  email?: string;
  telefone?: string;
  mensagem?: string;
  origem: string;
  session_id?: string | null;
  recommendation_id?: string | null;
};

export type Lead = NovoLead & {
  id: number;
  criado_em: string;
};

function urlBase(): string {
  if (typeof window === "undefined") {
    return (
      process.env.API_URL_INTERNA ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:8001"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";
}

async function requisitar<T>(caminho: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${urlBase()}${caminho}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    const detalhe =
      corpo && typeof corpo.detail === "string"
        ? corpo.detail
        : "Não foi possível falar com o servidor. Tente novamente em instantes.";
    throw new Error(detalhe);
  }
  return resposta.json() as Promise<T>;
}

// --- Catálogo ---
export const listarBuilds = () => requisitar<Build[]>("/builds/preconfigured");
export const listarCategorias = () => requisitar<Categoria[]>("/components/categories");
export const listarComponentes = () => requisitar<Componente[]>("/components");

// --- Onboarding / Recomendação ---
export const iniciarOnboarding = () =>
  requisitar<{ session_id: string; perguntas: Pergunta[] }>("/recommendations/start", {
    method: "POST",
  });

export const responderPergunta = (session_id: string, chave: string, valor: unknown) =>
  requisitar<{ ok: boolean }>("/recommendations/answer", {
    method: "POST",
    body: JSON.stringify({ session_id, chave, valor }),
  });

export const gerarRecomendacao = (session_id: string) =>
  requisitar<Recomendacao>("/recommendations/generate", {
    method: "POST",
    body: JSON.stringify({ session_id }),
  });

export const buscarRecomendacao = (id: string) => requisitar<Recomendacao>(`/recommendations/${id}`);

// --- Leads ---
export const criarLead = (lead: NovoLead) =>
  requisitar<Lead>("/leads", { method: "POST", body: JSON.stringify(lead) });

export const listarLeads = () => requisitar<Lead[]>("/leads");
