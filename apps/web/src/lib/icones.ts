/**
 * Registro central de ícones do produto (lucide-react).
 *
 * - ICONES_OPCOES: ícone de cada opção do onboarding, por pergunta → valor.
 * - ICONES_CATEGORIA: ícone de cada categoria de componente (spec cards).
 * As perguntas vêm da API; os ícones são responsabilidade visual do frontend.
 */

import {
  Backpack,
  BarChart3,
  Bluetooth,
  Box,
  Braces,
  BrainCircuit,
  Briefcase,
  Camera,
  CircleDollarSign,
  CircleHelp,
  CircuitBoard,
  Clapperboard,
  Code2,
  Coins,
  Cpu,
  DraftingCompass,
  Fan,
  Feather,
  Film,
  Gamepad2,
  Gauge,
  Gem,
  GraduationCap,
  HardDrive,
  House,
  Image as ImageIcon,
  Keyboard,
  Laptop,
  LayoutGrid,
  MemoryStick,
  Monitor,
  Mouse,
  PackageOpen,
  Palette,
  PcCase,
  PenTool,
  PiggyBank,
  PlusCircle,
  Radio,
  Rocket,
  Ruler,
  Sparkles,
  Store,
  Table2,
  TrendingUp,
  UserCheck,
  Usb,
  Volume1,
  Wallet,
  Wand2,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ICONES_OPCOES: Record<string, Record<string, LucideIcon>> = {
  usos: {
    uso_diario: House,
    estudos: GraduationCap,
    trabalho_escritorio: Briefcase,
    planilhas_dados: Table2,
    programacao: Code2,
    jogos: Gamepad2,
    design_grafico: Palette,
    edicao_video: Clapperboard,
    modelagem_3d_cad: DraftingCompass,
    streaming: Camera,
    ia_dados: BrainCircuit,
    gestao_negocio: Store,
  },
  intensidade: {
    leve: Feather,
    medio: Gauge,
    pesado: Rocket,
  },
  tipo_equipamento: {
    desktop: PcCase,
    notebook: Laptop,
    tanto_faz: Wand2,
  },
  softwares: {
    office_excel: Table2,
    power_bi: BarChart3,
    canva: LayoutGrid,
    photoshop: ImageIcon,
    illustrator: PenTool,
    premiere: Clapperboard,
    davinci: Film,
    autocad: DraftingCompass,
    revit: Ruler,
    sketchup: Box,
    blender: Box,
    vscode: Code2,
    intellij: Braces,
    obs: Radio,
    jogos_steam: Gamepad2,
    outro_software: PlusCircle,
  },
  perifericos: {
    tenho_monitor: Monitor,
    tenho_teclado_mouse: Keyboard,
    preciso_de_tudo: PackageOpen,
  },
  orcamento: {
    ate_2500: PiggyBank,
    "2500_4000": Wallet,
    "4000_6000": Coins,
    "6000_9000": CircleDollarSign,
    acima_9000: Gem,
    nao_sei: CircleHelp,
  },
  prioridade: {
    desempenho: Rocket,
    economia: CircleDollarSign,
    upgrades: TrendingUp,
    silencio: Volume1,
    portabilidade: Backpack,
    estetica: Sparkles,
  },
  conectividade: {
    wifi: Wifi,
    bluetooth: Bluetooth,
    muitas_usb: Usb,
    dois_monitores: Monitor,
  },
  automatico: {
    sugerir_tudo: Wand2,
    quero_revisar: UserCheck,
  },
};

/** Ícone de uma opção do onboarding, com fallback neutro. */
export function iconeDaOpcao(chavePergunta: string, valorOpcao: string): LucideIcon {
  return ICONES_OPCOES[chavePergunta]?.[valorOpcao] ?? Sparkles;
}

/** Ícones das categorias de componentes (nomes vêm da API em pt-BR). */
export const ICONES_CATEGORIA: Record<string, LucideIcon> = {
  Processador: Cpu,
  "Placa-mãe": CircuitBoard,
  "Memória RAM": MemoryStick,
  Armazenamento: HardDrive,
  "Placa de vídeo": Gamepad2,
  "Fonte de alimentação": Zap,
  Gabinete: PcCase,
  Refrigeração: Fan,
  Monitor: Monitor,
  Teclado: Keyboard,
  Mouse: Mouse,
  Notebook: Laptop,
};

export function iconeDaCategoria(nomeCategoria: string): LucideIcon {
  return ICONES_CATEGORIA[nomeCategoria] ?? Cpu;
}
