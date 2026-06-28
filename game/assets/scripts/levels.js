const chapter1Levels = [
    {   //nível 1
        initialMessage: "<h1>Bem vindo ao jogo!</h1><p>Tente usar os blocos ao lado para chegar no final da fase;<br>O seu objetivo é programar um robô pelo labirinto e chegar no bloco verde com um \"+\" escrito</p>",
        width: 7,
        blocksBlocked: ["rotate_player", "repeat_until_end", "check_path", "controls_repeat_ext", "controls_if"],
        layout: [
            "N", "N", "N", "N", "N", "N", "N",
            "N", "P", ".", ".", ".", "E", "N",
            "N", "N", "N", "N", "N", "N", "N",
        ]
    },

    {
        //nível 2
        initialMessage: "<p>Perfeito! agora use o <strong>bloco de curva</strong> para fazer esse mini labirinto!</p>",
        width: 7,
        blocksBlocked: ["repeat_until_end", "check_path", "controls_repeat_ext", "controls_if"],
        layout: [
            "N", "N", "N", "N", "N", "N", "N",
            "N", "N", "N", ".", ".", "E", "N",
            "N", "N", "N", ".", "N", "N", "N",
            "N", "P", ".", ".", "N", "N", "N",
            "N", "N", "N", "N", "N", "N", "N"
        ]
    },

    {
        //nível 3
        initialMessage: "<p>Ok, agora tente usar esse novo <strong>bloco de repetição</strong>, ele irá executar um loop em cadeia até você passar de fase, e use o bloco de curva para fazer o zigue-zague!</p>",
        width: 9,
        maxBlocks: 6,
        blocksBlocked: ["check_path", "controls_repeat_ext", "controls_if"],
        layout: [
            "N", "N", "N", "N", "N", "N", ".", "E", "N",
            "N", "N", "N", "N", "N", ".", ".", "N", "N",
            "N", "N", "N", "N", ".", ".", "N", "N", "N",
            "N", "N", "N", ".", ".", "N", "N", "N", "N",
            "N", "N", ".", ".", "N", "N", "N", "N", "N",
            "N", "P", ".", "N", "N", "N", "N", "N", "N",
            "N", "N", "N", "N", "N", "N", "N", "N", "N"
        ]
    },

    {//nível 4
        initialMessage: "<p>Ótimo! Agora tente, usar o <strong>bloco condicional</strong> junto com o <strong>bloco de retorno</strong>, exemplo: se (Caminho livre a (frente)) faça (Avançar 1 casa)</p>",
        width: 6,
        maxBlocks: 6,
        blocksBlocked: ["controls_repeat_ext"],
        layout: [
            "N", "N", "N", "N", "N", "N",
            "N", ".", ".", ".", ".", "N",
            "N", ".", "N", "N", ".", "N",
            "N", ".", "N", "N", ".", "N",
            "N", ".", "E", "N", ".", "N",
            "N", "N", "N", "N", ".", "N",
            "N", "P", ".", ".", ".", "N",
            "N", "N", "N", "N", "N", "N",
        ]
    },

    {//nível 5
        initialMessage: "<p>Muito bem! Agora conheça o <strong>botão</strong> e a <strong>porta</strong>, para abrir a porta, você deve fazer o seu robô pisar no botão <strong>rosa</strong>.</p>",
        width: 10,
        maxBlocks: 11,
        blocksBlocked: ["controls_repeat_ext"],
        layout: [
            "N", "N", "N", "N", "N", "N", "N", "N", "N", "N",
            "N", "P", ".", ".", ".", ".", ".", ".", ".", "N",
            "N", "N", "N", "N", "N", "N", ".", "N", "N", "N",
            "N", { special: "B", opens: 1 }, ".", ".", ".", ".", ".", { special: "D", id: 1 }, "E", "N",
            "N", "N", "N", "N", "N", "N", "N", "N", "N", "N",
        ]
    },

    {//nível 6
        initialMessage: "<p>Você está indo bem! agora, cuidado ao deslizar pelos blocos de <strong>gelo</strong>, e lembre-se de tomar cuidado com as <strong>paredes cinzas</strong> para não bater de cara!<br>Conheça também o mais novo bloco de <strong>repetição</strong>! ele funciona como o repetir até o final, porém não é até o final, mas sim <strong>quantas vezes você quiser</strong>!</p>",
        width: 10,
        maxBlocks: 9,
        blocksBlocked: ["check_path", "controls_if"],
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "P", ".", "I", "I", "I", "I", "I", ".", "#",
            "#", "I", "N", "N", "I", "N", "N", "N", ".", "#",
            "#", "I", "#", "I", "I", "I", "I", "I", ".", "#",
            "#", "I", ".", "E", "I", "N", "N", "N", ".", "#",
            "#", "I", ".", "I", "I", "I", "I", "I", ".", "#",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
        ]
    },
    {//nível 7
        initialMessage: "<p>Exelente! agora conheça o <strong>switch</strong>, multiplos deles podem ser apertados mais de uma vez para abrir portas, só cuidado para não <strong>confundir com o botão rosa!</strong>, <strong>DICA: ao sair e voltar em um switch ele vai abrir/fechar a porta novamente!</strong></p>",
        maxBlocks: 24,
        width: 10,
        blocksBlocked: ["repeat_until_end"],
        layout: [
            "N", "N", "N", "N", "N", "N", "N", "N", "N", "N",
            "#", "P", ".", ".", ".", ".", ".", "N", "N", "N",
            "#", "#", "#", "#", "#", "#", ".", "N", "N", "N",
            "#", { special: "S", id: 1 }, ".", ".", ".", ".", ".", { special: "D", id: 2 }, "E", "N",
            "#", "#", "#", "#", "#", "#", { special: "D", id: 1 }, "N", "N", "N",
            "#", ".", ".", { special: "B", opens: 2 }, { special: "S", id: 1 }, ".", ".", "N", "N", "N",
            "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"
        ]
    },
    {//nível 8
        initialMessage: "<p>Uau! você está <strong>dominando</strong> os labirintos, agora é seu último desafio de aprendizado, antes de poder sair para os níveis mais difícieis:<br>conheça os <strong>espinhos</strong>! onde quer que vá, não pise!</p>",
        blocksBlocked: ["check_path", "controls_if"],
        width: 12,
        maxBlocks: 12,
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "P", "I", "I", "I", "I", "I", "I", "T", "#", "E", "#",
            "#", "I", "#", "#", "#", "#", "#", "#", "#", "#", "I", "#",
            "#", "I", "#", "#", "#", "#", "#", "#", "#", "#", "I", "#",
            "#", "I", "#", "#", "#", "#", "#", "#", "#", "#", "I", "#",
            "#", "I", "#", "T", "#", "#", "#", "#", "#", "#", "I", "#",
            "#", "I", "#", "I", "T", "#", "#", "#", "#", "#", "I", "#",
            "#", "I", ".", "I", "I", "I", "I", "I", "I", "I", ".", "#",
            "#", "I", ".", ".", ".", "#", "#", "I", "#", "#", "I", "#",
            "#", "I", "I", "T", "I", "T", "#", "I", "#", "#", "I", "#",
            "#", ".", "I", "I", ".", "I", "I", "T", "#", "#", "T", "#",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
        ]
    },
]

const chapter2Levels = [
    {//nível 1
        initialMessage: "<p>Agora você está entrando no mundo do gelo, tome cuidado para não deslizar demais!</p>",
        width: 13,
        maxBlocks: 33,
        blocksBlocked: ["check_path", "controls_if", "repeat_until_end"],
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "P", ".", "I", "I", ".", "#", "E", "I", "I", { special: "D", id: 1 }, "#", "#",
            "#", "#", ".", "#", "I", ";", "#", "#", "#", "#", "I", "#", "#",
            "#", "#", ".", "#", "I", "I", ".", ".", ".", "#", "I", "#", "#",
            "#", "#", ".", "#", "#", "#", "#", "#", ".", "#", "I", "#", "#",
            "#", "#", ".", "I", "I", "I", ".", "#", ".", ".", "I", "#", "#",
            "#", "#", "#", "#", "#", "#", ".", "#", "#", "#", "I", "#", "#",
            "#", "#", ".", "I", ".", "#", ".", ".", ".", "#", "I", "#", "#",
            "#", "#", "I", "#", "I", "#", "#", "#", ".", "#", "I", "#", "#",
            "#", "#", { special: "B", opens: 1 }, "#", ".", "I", "I", "I", ".", "I", ".", "#", "#",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
        ]
    },
    {//nível 2
        width: 13,
        maxBlocks: 24,
        blocksBlocked: ["check_path", "controls_if", "repeat_until_end"],
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "N",
            "#", "P", ".", "I", "I", ".", ".", "I", "T", ".", "E", "#", "N",
            "#", "#", "I", "#", "I", "#", ".", ".", ".", "#", { special: "D", id: 1 }, "#", "N",
            "#", "#", "I", "#", "I", "#", ".", "T", "I", "#", "I", "#", "N",
            "#", "#", "I", "#", "T", "#", "#", "#", "I", "#", "I", "#", "N",
            "#", "#", ".", "I", { special: "B", opens: 1 }, "#", "N", "#", ".", "I", ".", "#", "N",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "N",
        ]
    },

    {//nível 3
        width: 12,
        maxBlocks: 12,
        blocksBlocked: ["check_path", "controls_if", "repeat_until_end"],
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "P", ".", "I", "I", "#", ".", "I", "I", ".", "#", "#",
            "#", "#", "I", "#", "I", "#", "I", "#", "#", "I", "#", "#",
            "#", "#", "I", "#", "I", "I", ".", ".", "#", "I", "#", "#",
            "#", "#", "I", "#", "#", "#", "#", "I", "#", "I", "#", "#",
            "#", "#", ".", "I", "I", "I", "I", ".", "#", "E", "#", "#",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
        ]
    },

    {//nível 4
        width: 13,
        maxBlocks: 18,
        blocksBlocked: ["check_path", "controls_if", "repeat_until_end"],
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "P", "I", "I", "I", ".", "I", "#", ".", "E", "#", "#", "#",
            "#", "#", "#", "#", "#", "I", "#", "#", "I", "#", "#", "#", "#",
            "#", ".", "I", "I", "I", ".", "I", "I", { special: "D", id: 1 }, "#", "#", "#", "#",
            "#", "I", "#", "#", "#", "#", "#", "#", "I", "#", "#", "#", "#",
            "#", ".", "I", "I", "I", { special: "S", id: 1 }, "I", { special: "D", id: 1 }, "I", "#", "#", "#", "#",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
        ]
    },

    {//nível 5
        width: 13,
        blocksBlocked: ["check_path", "controls_if"],
        maxBlocks: 17,
        layout: [
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "#", ".", "#", ".", "#", ".", "#", ".", "#", "E", "#", "#",
            "#", ".", "I", "I", "I", "I", "I", "I", "I", "I", "I", "T", "#",
            "#", ".", "I", "I", "I", "I", "I", "I", "I", "I", ".", "T", "#",
            "#", ".", "#", ".", "#", ".", "#", ".", "#", ".", "#", ".", "#",
            "#", ".", "I", "I", "I", "I", "I", "I", "I", "I", ".", "I", "#",
            "#", "T", "I", "I", "I", "I", "I", "I", "I", "I", ".", "I", "#",
            "#", "#", ".", "#", ".", "#", ".", "#", ".", "#", ".", "#", "#",
            "#", ".", "I", "I", "I", "I", "I", "I", "I", "I", "I", "T", "#",
            "#", ".", "I", "I", "I", "I", "I", "I", "I", "I", ".", "T", "#",
            "#", "P", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
            "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#",
        ]
    }
]


const levels = [
    ...chapter1Levels, //ids: 0 - 7
    ...chapter2Levels, //ids: 8 - 15
];