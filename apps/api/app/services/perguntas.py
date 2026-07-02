"""Perguntas do onboarding guiado.

Fonte única de verdade do fluxo de perguntas: o frontend recebe esta lista
ao iniciar uma sessão. A linguagem evita jargão técnico de propósito —
o cliente não precisa entender de hardware.

Observação: a pergunta `softwares` é fechada (opções conhecidas). Quando o
cliente marca "outro_software", o frontend revela um campo de texto opcional
cuja resposta é gravada na chave auxiliar `programas`.
"""

from app.schemas.onboarding import OpcaoPergunta, Pergunta

# Chaves aceitas além das perguntas exibidas (respostas auxiliares).
CHAVES_AUXILIARES = {"programas"}

PERGUNTAS: list[Pergunta] = [
    Pergunta(
        chave="usos",
        titulo="O que você vai fazer no seu computador?",
        apoio="Marque tudo o que fizer parte do seu dia. É só isso que precisamos para começar.",
        tipo="escolha_multipla",
        opcoes=[
            OpcaoPergunta(valor="uso_diario", rotulo="Uso do dia a dia", descricao="Internet, vídeos e tarefas simples"),
            OpcaoPergunta(valor="estudos", rotulo="Estudos", descricao="Aulas, pesquisas e trabalhos"),
            OpcaoPergunta(valor="trabalho_escritorio", rotulo="Trabalho de escritório", descricao="Documentos, e-mails e reuniões"),
            OpcaoPergunta(valor="planilhas_dados", rotulo="Planilhas e dados", descricao="Excel pesado e relatórios"),
            OpcaoPergunta(valor="programacao", rotulo="Programação", descricao="Sites, apps e sistemas"),
            OpcaoPergunta(valor="jogos", rotulo="Jogos", descricao="Dos leves aos pesados"),
            OpcaoPergunta(valor="design_grafico", rotulo="Design gráfico", descricao="Photoshop, Illustrator, Canva"),
            OpcaoPergunta(valor="edicao_video", rotulo="Edição de vídeo", descricao="Premiere, DaVinci, CapCut"),
            OpcaoPergunta(valor="modelagem_3d_cad", rotulo="Engenharia e 3D", descricao="AutoCAD, Revit, Blender"),
            OpcaoPergunta(valor="streaming", rotulo="Lives e transmissões", descricao="YouTube, Twitch, aulas ao vivo"),
            OpcaoPergunta(valor="ia_dados", rotulo="IA e ciência de dados", descricao="Modelos e análises pesadas"),
            OpcaoPergunta(valor="gestao_negocio", rotulo="Gestão do negócio", descricao="Sistemas, notas e atendimento"),
        ],
    ),
    Pergunta(
        chave="intensidade",
        titulo="Com que intensidade você vai usar?",
        apoio="Assim acertamos a medida: nem mais, nem menos do que você precisa.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="leve", rotulo="Uso leve", descricao="Algumas horas por dia, tarefas tranquilas"),
            OpcaoPergunta(valor="medio", rotulo="Uso moderado", descricao="Todo dia, com vários programas abertos"),
            OpcaoPergunta(valor="pesado", rotulo="Uso intenso", descricao="Trabalho profissional ou jogos exigentes"),
        ],
    ),
    Pergunta(
        chave="tipo_equipamento",
        titulo="Computador de mesa ou notebook?",
        apoio="Desktops rendem mais pelo mesmo valor. Notebooks vão com você para qualquer lugar.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="desktop", rotulo="Computador de mesa", descricao="Mais desempenho e upgrades fáceis"),
            OpcaoPergunta(valor="notebook", rotulo="Notebook", descricao="Leve para levar aonde quiser"),
            OpcaoPergunta(valor="tanto_faz", rotulo="Podem me sugerir", descricao="Confio na indicação de vocês"),
        ],
    ),
    Pergunta(
        chave="softwares",
        titulo="Quais programas você costuma usar?",
        apoio="Se reconhecer algum, marque — isso deixa a recomendação mais certeira. Se não, pode pular.",
        tipo="escolha_multipla",
        obrigatoria=False,
        opcoes=[
            OpcaoPergunta(valor="office_excel", rotulo="Pacote Office / Excel"),
            OpcaoPergunta(valor="power_bi", rotulo="Power BI"),
            OpcaoPergunta(valor="canva", rotulo="Canva"),
            OpcaoPergunta(valor="photoshop", rotulo="Photoshop"),
            OpcaoPergunta(valor="illustrator", rotulo="Illustrator"),
            OpcaoPergunta(valor="premiere", rotulo="Premiere"),
            OpcaoPergunta(valor="davinci", rotulo="DaVinci Resolve"),
            OpcaoPergunta(valor="autocad", rotulo="AutoCAD"),
            OpcaoPergunta(valor="revit", rotulo="Revit"),
            OpcaoPergunta(valor="sketchup", rotulo="SketchUp"),
            OpcaoPergunta(valor="blender", rotulo="Blender"),
            OpcaoPergunta(valor="vscode", rotulo="Visual Studio Code"),
            OpcaoPergunta(valor="intellij", rotulo="IntelliJ / programação"),
            OpcaoPergunta(valor="obs", rotulo="OBS Studio"),
            OpcaoPergunta(valor="jogos_steam", rotulo="Jogos (Steam e outros)"),
            OpcaoPergunta(valor="outro_software", rotulo="Outro software", descricao="Escreva qual no campo que vai aparecer"),
        ],
    ),
    Pergunta(
        chave="perifericos",
        titulo="O que você já tem em casa?",
        apoio="Para não recomendar nada repetido.",
        tipo="escolha_multipla",
        obrigatoria=False,
        opcoes=[
            OpcaoPergunta(valor="tenho_monitor", rotulo="Já tenho monitor"),
            OpcaoPergunta(valor="tenho_teclado_mouse", rotulo="Já tenho teclado e mouse"),
            OpcaoPergunta(valor="preciso_de_tudo", rotulo="Preciso de tudo", descricao="Montamos o conjunto completo"),
        ],
    ),
    Pergunta(
        chave="orcamento",
        titulo="Quanto você pretende investir?",
        apoio="Mostramos o melhor dentro do seu valor — com transparência, sem empurrar nada.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="ate_2500", rotulo="Até R$ 2.500"),
            OpcaoPergunta(valor="2500_4000", rotulo="R$ 2.500 a R$ 4.000"),
            OpcaoPergunta(valor="4000_6000", rotulo="R$ 4.000 a R$ 6.000"),
            OpcaoPergunta(valor="6000_9000", rotulo="R$ 6.000 a R$ 9.000"),
            OpcaoPergunta(valor="acima_9000", rotulo="Acima de R$ 9.000"),
            OpcaoPergunta(valor="nao_sei", rotulo="Ainda não sei", descricao="Quero ver as opções primeiro"),
        ],
    ),
    Pergunta(
        chave="prioridade",
        titulo="O que pesa mais para você?",
        apoio="Só uma escolha — a que fala mais alto.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="desempenho", rotulo="Desempenho máximo", descricao="Quero velocidade acima de tudo"),
            OpcaoPergunta(valor="economia", rotulo="Melhor custo-benefício", descricao="Só o necessário, bem escolhido"),
            OpcaoPergunta(valor="upgrades", rotulo="Evoluir depois", descricao="Começar bem e crescer aos poucos"),
            OpcaoPergunta(valor="silencio", rotulo="Silêncio", descricao="Discreto mesmo trabalhando pesado"),
            OpcaoPergunta(valor="portabilidade", rotulo="Portabilidade", descricao="Levar comigo para todo lado"),
            OpcaoPergunta(valor="estetica", rotulo="Visual bonito", descricao="Um setup de dar orgulho"),
        ],
    ),
    Pergunta(
        chave="conectividade",
        titulo="Alguma dessas facilidades importa para você?",
        apoio="Marque as que quiser — ou nenhuma.",
        tipo="escolha_multipla",
        obrigatoria=False,
        opcoes=[
            OpcaoPergunta(valor="wifi", rotulo="Wi-Fi integrado", descricao="Internet sem cabo"),
            OpcaoPergunta(valor="bluetooth", rotulo="Bluetooth", descricao="Fones e acessórios sem fio"),
            OpcaoPergunta(valor="muitas_usb", rotulo="Várias entradas USB", descricao="Muitos acessórios conectados"),
            OpcaoPergunta(valor="dois_monitores", rotulo="Dois monitores", descricao="Mais tela para trabalhar"),
        ],
    ),
    Pergunta(
        chave="automatico",
        titulo="Última pergunta: como você prefere receber a sugestão?",
        apoio="Nos dois caminhos, um especialista da MDA revisa tudo antes da montagem.",
        tipo="escolha_unica",
        opcoes=[
            OpcaoPergunta(valor="sugerir_tudo", rotulo="Podem sugerir tudo por mim", descricao="Quero a recomendação completa, sem preocupação"),
            OpcaoPergunta(valor="quero_revisar", rotulo="Quero revisar com um especialista", descricao="Prefiro conversar antes de decidir"),
        ],
    ),
]


def obter_perguntas() -> list[Pergunta]:
    return PERGUNTAS


def chaves_validas() -> set[str]:
    """Chaves aceitas no registro de respostas (perguntas + auxiliares)."""
    return {p.chave for p in PERGUNTAS} | CHAVES_AUXILIARES


def perguntas_obrigatorias() -> set[str]:
    return {p.chave for p in PERGUNTAS if p.obrigatoria}
