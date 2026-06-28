//level difficulties
const diffs = {
    d0: "☆☆☆☆☆",
    d1: "⭐☆☆☆☆",
    d2: "⭐⭐☆☆☆",
    d3: "⭐⭐⭐☆☆",
    d4: "⭐⭐⭐⭐☆",
    d5: "⭐⭐⭐⭐⭐",
    d6: "🌟",
    d7: "🌟🌟",
    d8: "🌟🌟🌟",
    d9: "🌟✨🌟",
    d10: "✨✨✨"
}

const diffsColors = {
    d6: `style="color: white; font-weight: bold; background-color: #2a3333ff"`,
    d7: `style="color: white; font-weight: bold; background-color: #374b4bff"`,
    d8: `style="color: white; font-weight: bold; background-color: #3c6a6bff"`,
    d9: `style="color: white; font-weight: bold; background-color: #00f7ffff"`,
    d10: `style="color: white; font-weight: bold; background-color: #cc00ffff"`,
}

const chapters = [
    {
        name: "Tutoriais",
        color: "#f1c40f",
        description: "Aprenda os comandos básicos do robô e blocos do jogo.",
        levels: [
            { id: 0, name: "Primeiros Passos", difficulty: diffs.d0 },
            { id: 1, name: "Fazendo a Curva", difficulty: diffs.d0 },
            { id: 2, name: "O Poder do Loop", difficulty: diffs.d1 },
            { id: 3, name: "A logica dos sensores", difficulty: diffs.d1 },
            { id: 4, name: "Os botões", difficulty: diffs.d4 },
            { id: 5, name: "Os blocos de gelo", difficulty: diffs.d2 },
            { id: 6, name: "O famoso toggle", difficulty: diffs.d4 },
            { id: 7, name: "Os espetos gelados", difficulty: diffs.d2 }
        ]
    },

    {
        name: "A Lógica da inércia",
        color: "#00ffeaff",
        description: "Deslize pelos blocos de gelo, e cuidado com as paredes e espinhos",
        levels: [
            { id: 8, name: "A sala do ártico", difficulty: diffs.d6 },
            { id: 9, name: "Botão congelado", difficulty: diffs.d3 },
            { id: 10, name: "Gelo = poucos blocos", difficulty: diffs.d2},
            { id: 11, name: "A mira da inércia", difficulty: diffs.d4},
            { id: 12, name: "O xadrês-deDeGelo", difficulty: diffs.d4}
        ]
    },
];