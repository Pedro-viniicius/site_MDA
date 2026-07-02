"""Dados iniciais do catálogo (seed).

ATENÇÃO: todos os preços são PLACEHOLDERS em reais (R$) e devem ser
substituídos pelos preços reais do parceiro/fornecedores. Os modelos citados
são exemplos realistas de mercado para dar vida à plataforma em desenvolvimento.

A chave de cada componente (ex.: "cpu_r5_5600") é usada apenas no seed para
montar as builds — no banco, os relacionamentos usam IDs.
"""

CATEGORIAS = [
    {"slug": "cpu", "nome": "Processador", "descricao": "O cérebro do computador"},
    {"slug": "placa_mae", "nome": "Placa-mãe", "descricao": "Conecta todos os componentes"},
    {"slug": "ram", "nome": "Memória RAM", "descricao": "Velocidade para várias tarefas ao mesmo tempo"},
    {"slug": "armazenamento", "nome": "Armazenamento", "descricao": "Onde ficam seus arquivos e programas"},
    {"slug": "gpu", "nome": "Placa de vídeo", "descricao": "Desempenho gráfico para jogos e criação"},
    {"slug": "fonte", "nome": "Fonte de alimentação", "descricao": "Energia estável e segura"},
    {"slug": "gabinete", "nome": "Gabinete", "descricao": "A casa dos componentes"},
    {"slug": "cooler", "nome": "Refrigeração", "descricao": "Mantém tudo funcionando na temperatura certa"},
    {"slug": "monitor", "nome": "Monitor", "descricao": "Sua janela para o computador"},
    {"slug": "teclado", "nome": "Teclado", "descricao": "Conforto para digitar"},
    {"slug": "mouse", "nome": "Mouse", "descricao": "Precisão no dia a dia"},
    {"slug": "notebook", "nome": "Notebook", "descricao": "Computador completo para levar com você"},
]

# ---------------------------------------------------------------------------
# Componentes — attrs alimentam as regras de compatibilidade
# ---------------------------------------------------------------------------
COMPONENTES: dict[str, dict] = {
    # --- Processadores ---
    "cpu_i3_12100": {
        "categoria": "cpu", "nome": "Intel Core i3-12100", "marca": "Intel", "preco": 700,
        "descricao": "Ótimo para tarefas do dia a dia, com vídeo integrado.",
        "attrs": {"socket": "LGA1700", "watts": 60, "tier": 2, "video_integrado": True},
    },
    "cpu_r5_5600g": {
        "categoria": "cpu", "nome": "AMD Ryzen 5 5600G", "marca": "AMD", "preco": 850,
        "descricao": "Seis núcleos com gráficos integrados surpreendentes.",
        "attrs": {"socket": "AM4", "watts": 65, "tier": 2, "video_integrado": True},
    },
    "cpu_r5_5600": {
        "categoria": "cpu", "nome": "AMD Ryzen 5 5600", "marca": "AMD", "preco": 900,
        "descricao": "Custo-benefício excelente para jogos e trabalho.",
        "attrs": {"socket": "AM4", "watts": 65, "tier": 3, "video_integrado": False},
    },
    "cpu_i5_12400f": {
        "categoria": "cpu", "nome": "Intel Core i5-12400F", "marca": "Intel", "preco": 950,
        "descricao": "Seis núcleos rápidos; exige placa de vídeo dedicada.",
        "attrs": {"socket": "LGA1700", "watts": 65, "tier": 3, "video_integrado": False},
    },
    "cpu_r7_5700x": {
        "categoria": "cpu", "nome": "AMD Ryzen 7 5700X", "marca": "AMD", "preco": 1300,
        "descricao": "Oito núcleos para criação de conteúdo e jogos exigentes.",
        "attrs": {"socket": "AM4", "watts": 65, "tier": 4, "video_integrado": False},
    },
    "cpu_i7_12700f": {
        "categoria": "cpu", "nome": "Intel Core i7-12700F", "marca": "Intel", "preco": 1700,
        "descricao": "Doze núcleos para cargas profissionais pesadas.",
        "attrs": {"socket": "LGA1700", "watts": 125, "tier": 4, "video_integrado": False},
    },
    "cpu_r9_7900x": {
        "categoria": "cpu", "nome": "AMD Ryzen 9 7900X", "marca": "AMD", "preco": 2800,
        "descricao": "Doze núcleos de última geração para estações de trabalho.",
        "attrs": {"socket": "AM5", "watts": 170, "tier": 5, "video_integrado": True},
    },

    # --- Placas-mãe ---
    "placa_h610m": {
        "categoria": "placa_mae", "nome": "Placa-mãe H610M DDR4", "marca": "ASUS", "preco": 550,
        "descricao": "Base confiável para computadores de entrada Intel.",
        "attrs": {"socket": "LGA1700", "tipo_ram": "DDR4", "form_factor": "mATX", "wifi": False, "bluetooth": False},
    },
    "placa_a520m": {
        "categoria": "placa_mae", "nome": "Placa-mãe A520M", "marca": "Gigabyte", "preco": 450,
        "descricao": "Entrada acessível para processadores AMD AM4.",
        "attrs": {"socket": "AM4", "tipo_ram": "DDR4", "form_factor": "mATX", "wifi": False, "bluetooth": False},
    },
    "placa_b550m": {
        "categoria": "placa_mae", "nome": "Placa-mãe B550M", "marca": "MSI", "preco": 700,
        "descricao": "Ótimo equilíbrio para builds gamer e de trabalho AM4.",
        "attrs": {"socket": "AM4", "tipo_ram": "DDR4", "form_factor": "mATX", "wifi": False, "bluetooth": False},
    },
    "placa_b760m_wifi": {
        "categoria": "placa_mae", "nome": "Placa-mãe B760M DDR5 Wi-Fi", "marca": "ASUS", "preco": 950,
        "descricao": "Recursos modernos com Wi-Fi e Bluetooth integrados.",
        "attrs": {"socket": "LGA1700", "tipo_ram": "DDR5", "form_factor": "mATX", "wifi": True, "bluetooth": True},
    },
    "placa_b650m": {
        "categoria": "placa_mae", "nome": "Placa-mãe B650M", "marca": "ASRock", "preco": 1100,
        "descricao": "Plataforma AM5 com espaço para crescer.",
        "attrs": {"socket": "AM5", "tipo_ram": "DDR5", "form_factor": "mATX", "wifi": False, "bluetooth": False},
    },
    "placa_x670_wifi": {
        "categoria": "placa_mae", "nome": "Placa-mãe X670 Wi-Fi", "marca": "ASUS", "preco": 2000,
        "descricao": "Topo de linha AM5 para estações de trabalho.",
        "attrs": {"socket": "AM5", "tipo_ram": "DDR5", "form_factor": "ATX", "wifi": True, "bluetooth": True},
    },

    # --- Memórias RAM ---
    "ram_8_ddr4": {
        "categoria": "ram", "nome": "Memória 8 GB DDR4 3200 MHz", "marca": "Kingston", "preco": 150,
        "descricao": "O essencial para navegar e trabalhar com leveza.",
        "attrs": {"tipo_ram": "DDR4", "capacidade_gb": 8},
    },
    "ram_16_ddr4": {
        "categoria": "ram", "nome": "Kit 16 GB (2x8) DDR4 3200 MHz", "marca": "Corsair", "preco": 300,
        "descricao": "Multitarefa tranquila e jogos sem engasgos.",
        "attrs": {"tipo_ram": "DDR4", "capacidade_gb": 16},
    },
    "ram_32_ddr4": {
        "categoria": "ram", "nome": "Kit 32 GB (2x16) DDR4 3200 MHz", "marca": "Corsair", "preco": 600,
        "descricao": "Folga para edição de vídeo e projetos grandes.",
        "attrs": {"tipo_ram": "DDR4", "capacidade_gb": 32},
    },
    "ram_16_ddr5": {
        "categoria": "ram", "nome": "Kit 16 GB (2x8) DDR5 5600 MHz", "marca": "Kingston", "preco": 450,
        "descricao": "Velocidade de nova geração.",
        "attrs": {"tipo_ram": "DDR5", "capacidade_gb": 16},
    },
    "ram_32_ddr5": {
        "categoria": "ram", "nome": "Kit 32 GB (2x16) DDR5 6000 MHz", "marca": "Corsair", "preco": 900,
        "descricao": "Desempenho de sobra para criação profissional.",
        "attrs": {"tipo_ram": "DDR5", "capacidade_gb": 32},
    },
    "ram_64_ddr5": {
        "categoria": "ram", "nome": "Kit 64 GB (2x32) DDR5 6000 MHz", "marca": "Corsair", "preco": 1800,
        "descricao": "Para estações de trabalho sem limites.",
        "attrs": {"tipo_ram": "DDR5", "capacidade_gb": 64},
    },

    # --- Armazenamento ---
    "ssd_sata_480": {
        "categoria": "armazenamento", "nome": "SSD SATA 480 GB", "marca": "Kingston", "preco": 180,
        "descricao": "Sistema rápido a um preço acessível.",
        "attrs": {"tipo": "ssd_sata", "capacidade_gb": 480},
    },
    "ssd_nvme_512": {
        "categoria": "armazenamento", "nome": "SSD NVMe 512 GB", "marca": "WD", "preco": 280,
        "descricao": "Abertura de programas quase instantânea.",
        "attrs": {"tipo": "ssd_nvme", "capacidade_gb": 512},
    },
    "ssd_nvme_1tb": {
        "categoria": "armazenamento", "nome": "SSD NVMe 1 TB", "marca": "WD", "preco": 480,
        "descricao": "Espaço e velocidade para projetos e jogos.",
        "attrs": {"tipo": "ssd_nvme", "capacidade_gb": 1000},
    },
    "ssd_nvme_2tb": {
        "categoria": "armazenamento", "nome": "SSD NVMe 2 TB", "marca": "Samsung", "preco": 900,
        "descricao": "Biblioteca inteira de projetos sempre à mão.",
        "attrs": {"tipo": "ssd_nvme", "capacidade_gb": 2000},
    },
    "hdd_2tb": {
        "categoria": "armazenamento", "nome": "HD 2 TB (arquivos)", "marca": "Seagate", "preco": 400,
        "descricao": "Espaço extra para backups e arquivos grandes.",
        "attrs": {"tipo": "hdd", "capacidade_gb": 2000},
    },

    # --- Placas de vídeo ---
    "gpu_gtx1650": {
        "categoria": "gpu", "nome": "GeForce GTX 1650 4 GB", "marca": "NVIDIA", "preco": 900,
        "descricao": "Porta de entrada para jogos leves.",
        "attrs": {"watts": 75, "tier": 1, "memoria_gb": 4},
    },
    "gpu_rx6600": {
        "categoria": "gpu", "nome": "Radeon RX 6600 8 GB", "marca": "AMD", "preco": 1400,
        "descricao": "Full HD fluido na maioria dos jogos atuais.",
        "attrs": {"watts": 132, "tier": 2, "memoria_gb": 8},
    },
    "gpu_rtx3060": {
        "categoria": "gpu", "nome": "GeForce RTX 3060 12 GB", "marca": "NVIDIA", "preco": 1700,
        "descricao": "Os 12 GB ajudam muito em edição e criação.",
        "attrs": {"watts": 170, "tier": 3, "memoria_gb": 12},
    },
    "gpu_rtx4060": {
        "categoria": "gpu", "nome": "GeForce RTX 4060 8 GB", "marca": "NVIDIA", "preco": 2000,
        "descricao": "Geração atual com ótima eficiência energética.",
        "attrs": {"watts": 115, "tier": 3, "memoria_gb": 8},
    },
    "gpu_rtx4070s": {
        "categoria": "gpu", "nome": "GeForce RTX 4070 Super 12 GB", "marca": "NVIDIA", "preco": 4200,
        "descricao": "Potência para 1440p, CAD e renderização.",
        "attrs": {"watts": 220, "tier": 4, "memoria_gb": 12},
    },
    "gpu_rtx4070tis": {
        "categoria": "gpu", "nome": "GeForce RTX 4070 Ti Super 16 GB", "marca": "NVIDIA", "preco": 5800,
        "descricao": "Desempenho de estação de trabalho profissional.",
        "attrs": {"watts": 285, "tier": 5, "memoria_gb": 16},
    },

    # --- Fontes ---
    "fonte_500": {
        "categoria": "fonte", "nome": "Fonte 500 W 80 Plus Bronze", "marca": "Corsair", "preco": 300,
        "descricao": "Energia estável para configurações essenciais.",
        "attrs": {"watts": 500, "certificacao": "80 Plus Bronze"},
    },
    "fonte_600": {
        "categoria": "fonte", "nome": "Fonte 600 W 80 Plus Bronze", "marca": "Cooler Master", "preco": 400,
        "descricao": "Folga para placas de vídeo de entrada.",
        "attrs": {"watts": 600, "certificacao": "80 Plus Bronze"},
    },
    "fonte_650": {
        "categoria": "fonte", "nome": "Fonte 650 W 80 Plus Bronze", "marca": "Corsair", "preco": 450,
        "descricao": "O ponto de equilíbrio das builds gamer.",
        "attrs": {"watts": 650, "certificacao": "80 Plus Bronze"},
    },
    "fonte_750": {
        "categoria": "fonte", "nome": "Fonte 750 W 80 Plus Gold", "marca": "Corsair", "preco": 650,
        "descricao": "Eficiência alta e margem para upgrades.",
        "attrs": {"watts": 750, "certificacao": "80 Plus Gold"},
    },
    "fonte_850": {
        "categoria": "fonte", "nome": "Fonte 850 W 80 Plus Gold", "marca": "EVGA", "preco": 850,
        "descricao": "Para estações de trabalho e GPUs potentes.",
        "attrs": {"watts": 850, "certificacao": "80 Plus Gold"},
    },

    # --- Gabinetes ---
    "gab_matx": {
        "categoria": "gabinete", "nome": "Gabinete compacto mATX", "marca": "Fortrek", "preco": 250,
        "descricao": "Discreto e funcional, ocupa pouco espaço.",
        "attrs": {"form_factors": ["mATX", "ITX"], "porte": "compacto"},
    },
    "gab_atx": {
        "categoria": "gabinete", "nome": "Gabinete mid tower ATX", "marca": "Aerocool", "preco": 350,
        "descricao": "Bom fluxo de ar e espaço para crescer.",
        "attrs": {"form_factors": ["ATX", "mATX", "ITX"], "porte": "medio"},
    },
    "gab_atx_vidro": {
        "categoria": "gabinete", "nome": "Gabinete ATX lateral de vidro RGB", "marca": "Rise Mode", "preco": 500,
        "descricao": "Visual premium com iluminação personalizável.",
        "attrs": {"form_factors": ["ATX", "mATX", "ITX"], "porte": "medio"},
    },

    # --- Refrigeração ---
    "cooler_120": {
        "categoria": "cooler", "nome": "Cooler a ar 120 mm", "marca": "DeepCool", "preco": 150,
        "descricao": "Silencioso e eficiente para o dia a dia.",
        "attrs": {"tipo": "ar"},
    },
    "cooler_torre": {
        "categoria": "cooler", "nome": "Air cooler torre dupla", "marca": "DeepCool", "preco": 250,
        "descricao": "Temperaturas baixas mesmo sob carga pesada.",
        "attrs": {"tipo": "ar"},
    },
    "water_240": {
        "categoria": "cooler", "nome": "Water cooler 240 mm", "marca": "Corsair", "preco": 550,
        "descricao": "Refrigeração líquida para máximo desempenho.",
        "attrs": {"tipo": "liquida"},
    },

    # --- Monitores ---
    "mon_215": {
        "categoria": "monitor", "nome": 'Monitor 21,5" Full HD 75 Hz', "marca": "AOC", "preco": 550,
        "descricao": "Imagem nítida para trabalho e estudos.",
        "attrs": {"polegadas": 21.5, "resolucao": "1920x1080", "taxa_hz": 75},
    },
    "mon_24_144": {
        "categoria": "monitor", "nome": 'Monitor 24" Full HD 144 Hz', "marca": "LG", "preco": 900,
        "descricao": "Fluidez que faz diferença nos jogos.",
        "attrs": {"polegadas": 24, "resolucao": "1920x1080", "taxa_hz": 144},
    },
    "mon_27_qhd": {
        "categoria": "monitor", "nome": 'Monitor 27" QHD 165 Hz', "marca": "Samsung", "preco": 1600,
        "descricao": "Mais espaço e detalhe para criar e jogar.",
        "attrs": {"polegadas": 27, "resolucao": "2560x1440", "taxa_hz": 165},
    },

    # --- Periféricos ---
    "tec_membrana": {
        "categoria": "teclado", "nome": "Teclado ABNT2 membrana", "marca": "Logitech", "preco": 100,
        "descricao": "Confortável e silencioso, com ç.",
        "attrs": {"tipo": "membrana"},
    },
    "tec_mecanico": {
        "categoria": "teclado", "nome": "Teclado mecânico RGB", "marca": "Redragon", "preco": 300,
        "descricao": "Resposta precisa para jogos e digitação intensa.",
        "attrs": {"tipo": "mecanico"},
    },
    "mouse_office": {
        "categoria": "mouse", "nome": "Mouse sem fio", "marca": "Logitech", "preco": 60,
        "descricao": "Simples, confiável e sem fios pela mesa.",
        "attrs": {"tipo": "office"},
    },
    "mouse_gamer": {
        "categoria": "mouse", "nome": "Mouse gamer 12.000 DPI", "marca": "Redragon", "preco": 180,
        "descricao": "Precisão ajustável para cada jogo.",
        "attrs": {"tipo": "gamer"},
    },

    # --- Notebooks (produtos fechados) ---
    "note_essencial": {
        "categoria": "notebook", "nome": 'Notebook 15,6" Core i5 8 GB 256 GB', "marca": "Lenovo", "preco": 2800,
        "descricao": "Leve e ágil para estudos e trabalho em qualquer lugar.",
        "attrs": {"cpu_tier": 2, "gpu_tier": 0, "ram_gb": 8, "ssd_gb": 256, "tela": '15,6" Full HD', "wifi": True, "bluetooth": True},
    },
    "note_ryzen": {
        "categoria": "notebook", "nome": 'Notebook 15,6" Ryzen 5 16 GB 512 GB', "marca": "Acer", "preco": 3400,
        "descricao": "Multitarefa folgada com ótimo custo-benefício.",
        "attrs": {"cpu_tier": 3, "gpu_tier": 0, "ram_gb": 16, "ssd_gb": 512, "tela": '15,6" Full HD', "wifi": True, "bluetooth": True},
    },
    "note_performance": {
        "categoria": "notebook", "nome": 'Notebook Gamer 15,6" Core i7 RTX 4050 16 GB 512 GB', "marca": "Dell", "preco": 6500,
        "descricao": "Potência de desktop para jogar e criar em movimento.",
        "attrs": {"cpu_tier": 4, "gpu_tier": 3, "ram_gb": 16, "ssd_gb": 512, "tela": '15,6" Full HD 144 Hz', "wifi": True, "bluetooth": True},
    },
}

# ---------------------------------------------------------------------------
# Builds pré-configuradas — `requisitos` = o que a máquina ENTREGA
# ---------------------------------------------------------------------------
BUILDS: list[dict] = [
    {
        "slug": "pc-escritorio-essencial",
        "nome": "PC Escritório Essencial",
        "tipo": "desktop",
        "perfil": "escritorio",
        "descricao": "O parceiro ideal para documentos, e-mails, reuniões e sistemas de gestão. Liga rápido, trabalha em silêncio e não deixa você na mão.",
        "uso_alvo": "Escritório, home office e tarefas do dia a dia",
        "publico_alvo": "Profissionais, pequenos negócios e quem quer praticidade",
        "preco": 2490,
        "requisitos": {"cpu_tier": 2, "gpu_tier": 0, "ram_gb": 8, "ssd_gb": 480},
        "pontos_fortes": ["silencioso", "compacto", "rápido para o dia a dia", "baixo consumo de energia"],
        "limitacoes": ["não é indicado para jogos pesados nem edição profissional", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_i3_12100", "placa_h610m", "ram_8_ddr4", "ssd_sata_480", "fonte_500", "gab_matx", "cooler_120"],
    },
    {
        "slug": "pc-estudos-rotina",
        "nome": "PC Estudos e Rotina",
        "tipo": "desktop",
        "perfil": "estudos",
        "descricao": "Feito para acompanhar aulas online, pesquisas, trabalhos e aquele jogo leve no fim do dia. Memória de sobra para várias abas e programas abertos.",
        "uso_alvo": "Estudos, rotina da família e jogos leves",
        "publico_alvo": "Estudantes e famílias",
        "preco": 2890,
        "requisitos": {"cpu_tier": 2, "gpu_tier": 1, "ram_gb": 16, "ssd_gb": 512},
        "pontos_fortes": ["16 GB de memória para multitarefa", "SSD rápido", "roda jogos leves sem placa de vídeo dedicada"],
        "limitacoes": ["jogos pesados pedem uma placa de vídeo dedicada", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_r5_5600g", "placa_a520m", "ram_16_ddr4", "ssd_nvme_512", "fonte_500", "gab_matx", "cooler_120"],
    },
    {
        "slug": "pc-gamer-entrada",
        "nome": "PC Gamer de Entrada",
        "tipo": "desktop",
        "perfil": "gamer_entrada",
        "descricao": "Sua porta de entrada no mundo gamer: roda os jogos mais populares em Full HD com fluidez, sem estourar o orçamento.",
        "uso_alvo": "Jogos em Full HD, estudos e uso geral",
        "publico_alvo": "Quem está começando a jogar no PC",
        "preco": 4790,
        "requisitos": {"cpu_tier": 3, "gpu_tier": 2, "ram_gb": 16, "ssd_gb": 512},
        "pontos_fortes": ["roda os jogos populares em Full HD", "fácil de evoluir depois", "ótimo custo-benefício"],
        "limitacoes": ["jogos muito pesados podem pedir ajustes gráficos", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_r5_5600", "placa_b550m", "ram_16_ddr4", "ssd_nvme_512", "gpu_rx6600", "fonte_600", "gab_atx", "cooler_120"],
    },
    {
        "slug": "pc-gamer-performance",
        "nome": "PC Gamer Performance",
        "tipo": "desktop",
        "perfil": "gamer_performance",
        "descricao": "Desempenho de verdade para jogar no capricho: geração atual de placa de vídeo, SSD espaçoso e visual RGB para completar o setup.",
        "uso_alvo": "Jogos exigentes, transmissões e criação de conteúdo",
        "publico_alvo": "Gamers que não abrem mão de fluidez",
        "preco": 6290,
        "requisitos": {"cpu_tier": 4, "gpu_tier": 3, "ram_gb": 16, "ssd_gb": 1000},
        "pontos_fortes": ["alta taxa de quadros em Full HD", "1 TB de SSD para a biblioteca de jogos", "gabinete com lateral de vidro e RGB"],
        "limitacoes": ["para edição profissional pesada, considere 32 GB de memória", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_r7_5700x", "placa_b550m", "ram_16_ddr4", "ssd_nvme_1tb", "gpu_rtx4060", "fonte_650", "gab_atx_vidro", "cooler_torre"],
    },
    {
        "slug": "pc-design-edicao",
        "nome": "PC Design e Edição",
        "tipo": "desktop",
        "perfil": "design_edicao",
        "descricao": "Pensado para quem cria: 32 GB de memória, placa de vídeo com 12 GB e armazenamento duplo para projetos e arquivos brutos.",
        "uso_alvo": "Design gráfico, edição de vídeo e fotografia",
        "publico_alvo": "Criadores de conteúdo e profissionais criativos",
        "preco": 6690,
        "requisitos": {"cpu_tier": 4, "gpu_tier": 3, "ram_gb": 32, "ssd_gb": 1000},
        "pontos_fortes": ["32 GB de memória para projetos grandes", "12 GB de vídeo ajudam na renderização", "HD extra de 2 TB para arquivos"],
        "limitacoes": ["renderização 3D muito pesada pode pedir uma GPU superior", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_r7_5700x", "placa_b550m", "ram_32_ddr4", "ssd_nvme_1tb", "hdd_2tb", "gpu_rtx3060", "fonte_650", "gab_atx", "cooler_torre"],
    },
    {
        "slug": "pc-engenharia-cad",
        "nome": "PC Engenharia / CAD",
        "tipo": "desktop",
        "perfil": "cad_engenharia",
        "descricao": "Estação séria para AutoCAD, Revit, SketchUp e modelagem 3D: plataforma moderna DDR5, GPU potente e refrigeração líquida.",
        "uso_alvo": "Engenharia, arquitetura, CAD e modelagem 3D",
        "publico_alvo": "Engenheiros, arquitetos e projetistas",
        "preco": 10490,
        "requisitos": {"cpu_tier": 4, "gpu_tier": 4, "ram_gb": 32, "ssd_gb": 1000},
        "pontos_fortes": ["plataforma DDR5 moderna", "GPU com desempenho profissional", "Wi-Fi e Bluetooth integrados", "refrigeração líquida silenciosa"],
        "limitacoes": ["projetos extremos podem se beneficiar de 64 GB de memória", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_i7_12700f", "placa_b760m_wifi", "ram_32_ddr5", "ssd_nvme_1tb", "gpu_rtx4070s", "fonte_750", "gab_atx_vidro", "water_240"],
    },
    {
        "slug": "pc-workstation",
        "nome": "PC Workstation",
        "tipo": "desktop",
        "perfil": "workstation",
        "descricao": "Nossa máquina mais poderosa: 12 núcleos de última geração, 64 GB de memória e 16 GB de vídeo para renderização, IA e projetos sem limites.",
        "uso_alvo": "Renderização 3D, IA, ciência de dados e produção audiovisual",
        "publico_alvo": "Profissionais e estúdios que precisam do máximo",
        "preco": 15990,
        "requisitos": {"cpu_tier": 5, "gpu_tier": 5, "ram_gb": 64, "ssd_gb": 2000},
        "pontos_fortes": ["desempenho extremo em qualquer tarefa", "64 GB de memória", "2 TB de SSD NVMe", "pronta para IA e renderização"],
        "limitacoes": ["investimento alto — indicada para uso profissional intenso", "monitor e periféricos são vendidos à parte"],
        "componentes": ["cpu_r9_7900x", "placa_x670_wifi", "ram_64_ddr5", "ssd_nvme_2tb", "gpu_rtx4070tis", "fonte_850", "gab_atx_vidro", "water_240"],
    },
    {
        "slug": "notebook-estudos-trabalho",
        "nome": "Notebook Estudos e Trabalho",
        "tipo": "notebook",
        "perfil": "estudos",
        "descricao": "Leve, silencioso e com bateria para o dia todo: perfeito para levar para a aula, a biblioteca ou o escritório.",
        "uso_alvo": "Estudos, trabalho e navegação em qualquer lugar",
        "publico_alvo": "Estudantes e profissionais em movimento",
        "preco": 2990,
        "requisitos": {"cpu_tier": 2, "gpu_tier": 0, "ram_gb": 8, "ssd_gb": 256},
        "pontos_fortes": ["portátil e leve", "Wi-Fi e Bluetooth integrados", "tela Full HD confortável"],
        "limitacoes": ["não é indicado para jogos pesados nem edição profissional", "memória de 8 GB atende usos leves e moderados"],
        "componentes": ["note_essencial"],
    },
    {
        "slug": "notebook-custo-beneficio",
        "nome": "Notebook Custo-Benefício",
        "tipo": "notebook",
        "perfil": "escritorio",
        "descricao": "O equilíbrio certo entre preço e desempenho: 16 GB de memória e SSD espaçoso para trabalhar sem travar, onde você estiver.",
        "uso_alvo": "Trabalho, planilhas pesadas e multitarefa em mobilidade",
        "publico_alvo": "Profissionais que trabalham de vários lugares",
        "preco": 3590,
        "requisitos": {"cpu_tier": 3, "gpu_tier": 0, "ram_gb": 16, "ssd_gb": 512},
        "pontos_fortes": ["16 GB de memória para multitarefa", "512 GB de SSD", "ótimo custo-benefício"],
        "limitacoes": ["jogos e projetos 3D pedem placa de vídeo dedicada"],
        "componentes": ["note_ryzen"],
    },
    {
        "slug": "notebook-alta-performance",
        "nome": "Notebook Alta Performance",
        "tipo": "notebook",
        "perfil": "gamer_performance",
        "descricao": "Potência para jogar, editar e projetar em qualquer lugar, com placa de vídeo dedicada e tela de 144 Hz.",
        "uso_alvo": "Jogos, edição e projetos exigentes em mobilidade",
        "publico_alvo": "Gamers e criadores que precisam de portabilidade",
        "preco": 6990,
        "requisitos": {"cpu_tier": 4, "gpu_tier": 3, "ram_gb": 16, "ssd_gb": 512},
        "pontos_fortes": ["placa de vídeo dedicada RTX", "tela 144 Hz", "potência de desktop portátil"],
        "limitacoes": ["autonomia de bateria menor sob carga pesada", "upgrades limitados em relação a um desktop"],
        "componentes": ["note_performance"],
    },
]
