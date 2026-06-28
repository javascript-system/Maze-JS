Blockly.setLocale(Blockly.Msg);
let currentMaxBlocks = Infinity;
let workspace = null;
let orgCrnt = null;
let currentBlockedTypes = [];
Blockly.defineBlocksWithJsonArray([
    {
        "type": "start_block",
        "message0": "Ao iniciar programa",
        "nextStatement": null,
        "colour": 20,
        "tooltip": "O código deve começar aqui.",
        "helpUrl": "",
        "tooltip": "Coloque seus comandos aqui. O robô começará a ler a partir deste bloco."
    },
    {
        "type": "move_advance",
        "message0": "Avançar 1 casa",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "helpUrl": "",
        "tooltip": "Faz o robô andar uma casa para a frente na direção atual."
    },
    {
        "type": "rotate_player",
        "message0": "Virar para a %1",
        "args0": [{
            "type": "field_dropdown",
            "name": "DIRECTION",
            "options": [["Direita ↻", "90"], ["Esquerda ↺", "-90"], ["Meia volta 🔀", "180"]]
        }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 285,
        "helpUrl": "",
        "tooltip": "Faz o robô virar para a esquerda, direita ou dar meia volta por meio de sua posição relativa atual."
    },
    {
        "type": "repeat_until_end",
        "message0": "repita até o final %1 %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "input_statement", "name": "DO" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "helpUrl": "",
        "tooltip": "Executa os blocos internos em loop até que o robô pise no bloco de Saída."
    },
    {
        "type": "check_path",
        "message0": "caminho livre a %1",
        "args0": [{
            "type": "field_dropdown",
            "name": "DIR",
            "options": [
                ["frente", "front"],
                ["trás", "back"],
                ["direita", "right"],
                ["esquerda", "left"]
            ]
        }],
        "output": "Boolean",
        "colour": 210,
        "helpUrl": "",
        "tooltip": "Verifica se há um caminho seguro na direção escolhida. Retorna verdadeiro ou falso."
    }
]);

javascript.javascriptGenerator.forBlock['start_block'] = () => "";
javascript.javascriptGenerator.forBlock['move_advance'] = () => 'advance();\n';
javascript.javascriptGenerator.forBlock['rotate_player'] = (block) => `rotate(${block.getFieldValue('DIRECTION')});\n`;
javascript.javascriptGenerator.forBlock['check_path'] = (block) => [`vCheckPath('${block.getFieldValue('DIR')}')`, javascript.javascriptGenerator.ORDER_ATOMIC];
javascript.javascriptGenerator.forBlock['repeat_until_end'] = (block, gen) => {
    const branch = gen.statementToCode(block, 'DO');
    return `let loopLimit = 0;while(!vCheckEnd() && loopLimit++ < 500) {\n${branch}}\n`;
};
javascript.javascriptGenerator.forBlock['controls_repeat_ext'] = function (block, generator) {
    const repeats = generator.valueToCode(block, 'TIMES', javascript.javascriptGenerator.ORDER_ASSIGNMENT) || '0';
    const branch = generator.statementToCode(block, 'DO');
    return `for (let times_done = 0; times_done < ${repeats}; times_done++) {\n${branch}}\n`;
};

window.updateBlocklyLevel = function (maxBlocks, blockedTypes = []) {
    if (blockedTypes.length > 0 || (maxBlocks !== undefined && maxBlocks !== null)) {
        currentMaxBlocks = (maxBlocks && maxBlocks > 0) ? maxBlocks : Infinity;
        orgCrnt = currentMaxBlocks;
        currentBlockedTypes = blockedTypes;
    }
    currentMaxBlocks = (maxBlocks && maxBlocks > 0) ? maxBlocks : Infinity;
    orgCrnt = currentMaxBlocks;
    currentMaxBlocks = settings.infiniteBlocks == true ? Infinity : orgCrnt;
    const maxBlocksSpan = document.getElementById('max-blocks');
    const counterDiv = document.getElementById('block-counter');
    maxBlocksSpan.innerText = currentMaxBlocks === Infinity ? "∞" : currentMaxBlocks;
    counterDiv.style.display = "block";


    const tools = [
        { "kind": "block", "type": "move_advance" },
        { "kind": "block", "type": "rotate_player" },
        { "kind": "block", "type": "repeat_until_end" },
        { "kind": "block", "type": "controls_if" },
        { "kind": "block", "type": "check_path" },
        { "kind": "block", "type": "controls_repeat_ext", "inputs": { "TIMES": { "shadow": { "type": "math_number", "fields": { "NUM": 3 } } } } }
    ];

    const filtered = settings.allBlocks ? tools : tools.filter(t => !blockedTypes.includes(t.type));
    const toolboxConfig = { "kind": "flyoutToolbox", "contents": filtered };
    if (!workspace) {
        workspace = Blockly.inject('blocklyDiv', {
            toolbox: toolboxConfig,
            trashcan: false,
            renderer: 'zelos',
            theme: Blockly.Themes.Zelos,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.8,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            }
        });

        workspace.addChangeListener(async (ev) => {
            if (ev.type === Blockly.Events.BLOCK_CREATE || ev.type === Blockly.Events.BLOCK_DELETE || ev.type === Blockly.Events.BLOCK_MOVE) {
                const allBlocks = workspace.getAllBlocks(false).filter(b => !b.isShadow());
                const usedCount = allBlocks.length;
                document.getElementById('used-blocks').innerText = usedCount;
                if (usedCount > currentMaxBlocks && ev.type === Blockly.Events.BLOCK_CREATE && settings.infiniteBlocks == false) {
                    const newBlock = workspace.getBlockById(ev.blockId);
                    if (newBlock) {
                        newBlock.dispose(false);
                        await dropdown(`
                            <h1>Ops! você atingiu o limite de blocos desta fase!</h1>
                            <p>Infelizmente, para um desafio válido, precisamos que você use até ${currentMaxBlocks} blocos nesta fase.</p>
                        `);
                    }
                }
            }
        });
    } else {
        workspace.updateToolbox(toolboxConfig);
    }

    if (blockedTypes.length > 0) {
        resetWorkspaceWithStartBlock();
    }
};

function resetWorkspaceWithStartBlock() {
    workspace.clear();
    const startBlock = workspace.newBlock('start_block');
    startBlock.initSvg();
    startBlock.render();
    startBlock.setDeletable(false);
    startBlock.moveBy(20, 20);
}

window.executeBlocklyCode = function () {
    if (!workspace) return;
    killLevel();

    setTimeout(async () => {
        if (typeof loadLevel === 'function') loadLevel(currentLevelIndex);
        vPlayer.gx = player.gx;
        vPlayer.gy = player.gy;
        vPlayer.dir = player.dir;
        isRunning = true;
        const startBlock = workspace.getBlocksByType('start_block')[0];
        if (startBlock) {
            const code = javascript.javascriptGenerator.blockToCode(startBlock);
            try {
                eval(code);
            } catch (e) {
                await dropdown(`<h1 style="color: red">Um erro inesperado aconteçeu</h1><p>Erro na execução do código: <span style="color: red">"${e}"</span></p>`);
            }
        } else {
            await dropdown("<h1 style=\"color: red\">Erro</h1><p>Bloco \"Ao iniciar programa\" não encontrado!</p>");
        }
    }, 400);
};

window.addEventListener('DOMContentLoaded', () => {
    if (typeof levels !== 'undefined') {
        updateBlocklyLevel(levels[0].maxBlocks, levels[0].blocksBlocked);
    }
});