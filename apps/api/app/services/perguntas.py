"""Perguntas do onboarding guiado.

Fonte única de verdade do fluxo de perguntas: o frontend recebe esta lista
ao iniciar uma sessão. A linguagem evita jargão técnico de propósito —
o cliente não precisa entender de hardware.
"""

from app.schemas.onboarding import OpcaoPergunta, Pergunta

PERGUNTAS: list[Pergunta] = [
    Pergunta(
        chave="usos",
        titulo="O que você vai fazer no seu computador?",
        apoio="Pode marcar quantas opções quiser. É isso que nos ajuda a entender o que você precisa — sem complicação.",
        tipo="escolha_multipla",
        opcoes=[
            OpcaoPergunta(valor="uso_diario", rotulo="Uso do dia a dia", descricao="Internet, vídeos, e-mails e tarefas simples"),
            OpcaoPergunta(valor="estudos", rotulo="Estudos", descricao="Aulas online, pesquisas e trabalhos"),
            OpcaoPergunta(valor="trabalho_escritorio", rotulo="Trabalho de escritório", descricao="Documentos, e-mails e reuniões online"),
            OpcaoPergunta(valor="planilhas_dados", rotulo="Planilhas e dados", descricao="Excel pesado, relatórios e sistemas de gestão"),
            OpcaoPergunta(valor="programacao", rotulo="Programação", descricao="Desenvolvimento de sistemas, sites ou apps"),
            OpcaoPergunta(valor="jogos", rotulo="Jogos", descricao="Dos mais leves aos mais pesados"),
            OpcaoPergunta(valor="design_grafico", rotulo="Design gráfico", descricao="Photoshop, Illustrator, Canva profissional"),
            OpcaoPergunta(valor="edicao_video", rotulo="Edição de vídeo", descricao="Premiere, DaVinci, CapCut e similares"),
            OpcaoPergunta(valor="modelagem_3d_cad", rotulo="Engenharia, arquitetura ou 3D", descricao="AutoCAD, Revit, SketchUp, Blender"),
            OpcaoPergunta(valor="streaming", rotulo="Transmissões ao vivo", descricao="Lives no YouTube, Twitch ou aulas online"),
            OpcaoPergunta(valor="ia_dados", rotulo="Inteligência artificial e ciência de dados", descricao="Treinos de modelos, análises pesadas"),
            OpcaoPergunta(valor="gestao_negocio", rotulo="Gestão do meu negócio", descricao="Sistemas, emissão de notas, atendimento"),
        ],
    ),
    Pergunta(
        chave="intensidade",
        titulo="Com que intensidade você pretende usar?",
        apoio="Isso nos ajuda a não recomendar nem mais nem menos do que você precisa.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="leve", rotulo="Uso leve", descricao="Algumas horas por dia, tarefas simples"),
            OpcaoPergunta(valor="medio", rotulo="Uso moderado", descricao="Uso diário constante, vários programas abertos"),
            OpcaoPergunta(valor="pesado", rotulo="Uso intenso", descricao="Trabalho profissional, projetos grandes ou jogos exigentes"),
        ],
    ),
    Pergunta(
        chave="tipo_equipamento",
        titulo="Você prefere um computador de mesa ou um notebook?",
        apoio="Computadores de mesa costumam entregar mais desempenho pelo mesmo valor. Notebooks ganham em mobilidade.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="desktop", rotulo="Computador de mesa", descricao="Mais desempenho e facilidade de upgrade"),
            OpcaoPergunta(valor="notebook", rotulo="Notebook", descricao="Para levar para onde você for"),
            OpcaoPergunta(valor="tanto_faz", rotulo="Pode me sugerir", descricao="Confio na recomendação de vocês"),
        ],
    ),
    Pergunta(
        chave="perifericos",
        titulo="O que você já tem em casa?",
        apoio="Assim não recomendamos nada que você já possui.",
        tipo="escolha_multipla",
        obrigatoria=False,
        opcoes=[
            OpcaoPergunta(valor="tenho_monitor", rotulo="Já tenho monitor"),
            OpcaoPergunta(valor="tenho_teclado_mouse", rotulo="Já tenho teclado e mouse"),
            OpcaoPergunta(valor="preciso_de_tudo", rotulo="Preciso de tudo", descricao="Monte o conjunto completo para mim"),
        ],
    ),
    Pergunta(
        chave="orcamento",
        titulo="Quanto você pretende investir?",
        apoio="Fique tranquilo: mostramos o melhor possível dentro do seu valor, com transparência.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="ate_2500", rotulo="Até R$ 2.500"),
            OpcaoPergunta(valor="2500_4000", rotulo="Entre R$ 2.500 e R$ 4.000"),
            OpcaoPergunta(valor="4000_6000", rotulo="Entre R$ 4.000 e R$ 6.000"),
            OpcaoPergunta(valor="6000_9000", rotulo="Entre R$ 6.000 e R$ 9.000"),
            OpcaoPergunta(valor="acima_9000", rotulo="Acima de R$ 9.000"),
            OpcaoPergunta(valor="nao_sei", rotulo="Ainda não sei", descricao="Quero ver as opções primeiro"),
        ],
    ),
    Pergunta(
        chave="prioridade",
        titulo="O que é mais importante para você?",
        apoio="Escolha o que pesa mais na sua decisão.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="desempenho", rotulo="Desempenho máximo", descricao="Quero a máquina mais rápida possível"),
            OpcaoPergunta(valor="economia", rotulo="Melhor custo-benefício", descricao="Só o necessário, sem gastar à toa"),
            OpcaoPergunta(valor="upgrades", rotulo="Poder evoluir depois", descricao="Começar bem e melhorar aos poucos"),
            OpcaoPergunta(valor="silencio", rotulo="Silêncio", descricao="Um computador discreto e silencioso"),
            OpcaoPergunta(valor="portabilidade", rotulo="Portabilidade", descricao="Levar comigo para qualquer lugar"),
            OpcaoPergunta(valor="estetica", rotulo="Visual bonito", descricao="Um setup para dar orgulho de mostrar"),
        ],
    ),
    Pergunta(
        chave="conectividade",
        titulo="Alguma dessas facilidades é importante para você?",
        apoio="Pode marcar mais de uma — ou nenhuma, se não fizer diferença.",
        tipo="escolha_multipla",
        obrigatoria=False,
        opcoes=[
            OpcaoPergunta(valor="wifi", rotulo="Wi-Fi integrado", descricao="Internet sem cabo de rede"),
            OpcaoPergunta(valor="bluetooth", rotulo="Bluetooth", descricao="Fones, caixas de som e acessórios sem fio"),
            OpcaoPergunta(valor="muitas_usb", rotulo="Várias entradas USB", descricao="Para conectar muitos acessórios"),
            OpcaoPergunta(valor="dois_monitores", rotulo="Dois monitores", descricao="Mais espaço de tela para trabalhar"),
        ],
    ),
    Pergunta(
        chave="programas",
        titulo="Tem algum programa específico que você usa?",
        apoio="Se souber o nome, conta pra gente (ex.: AutoCAD, Premiere, um jogo favorito). Se não souber, sem problema — pode pular.",
        tipo="texto",
        obrigatoria=False,
    ),
    Pergunta(
        chave="automatico",
        titulo="Como você prefere a nossa sugestão?",
        apoio="Nos dois casos, um especialista da MDA revisa tudo antes da montagem.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="sugerir_tudo", rotulo="Podem sugerir tudo por mim", descricao="Quero a recomendação completa, sem me preocupar"),
            OpcaoPergunta(valor="quero_revisar", rotulo="Quero revisar com um especialista", descricao="Prefiro conversar antes de fechar"),
        ],
    ),
]


def obter_perguntas() -> list[Pergunta]:
    return PERGUNTAS


def perguntas_obrigatorias() -> set[str]:
    return {p.chave for p in PERGUNTAS if p.obrigatoria}
