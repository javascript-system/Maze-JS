let currentMode = "blockly";
let executingCode = false;
let monacoEditorInstance = null;
let settings = DEFAULT_SETTINGS;
let currentAudio = null;
settings = getConfigs();
updateSettings(settings);
document.addEventListener('contextmenu', e => e.preventDefault());

function updateSettings(configs) {
    let orgInfnt = settings.infiniteBlocks;
    if (currentAudio) { currentAudio.volume = (configs.volumeMaster / 100) * (configs.volumeMusic / 100); }
    const ico = document.getElementById("lang-ico");
    ico.textContent = currentMode === "code" ? "JS" : "BL";
    ico.style.backgroundColor = currentMode === "code" ? "#f3f303" : "#d67010ff";
    ico.style.color = currentMode === "code" ? "#000" : "#fff";
    if (configs.infiniteBlocks !== orgInfnt) {
        const maxBlocksSpan = document.getElementById('max-blocks');
        if (orgInfnt == false) {
            maxBlocksSpan.innerText = "∞";
        }
        else {
            maxBlocksSpan.innerText = currentMaxBlocks === Infinity ? "∞" : currentMaxBlocks;
            currentMaxBlocks = orgCrnt;
        }
    }
    settings = configs;
}

window.dropdown = function (htmlContent) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        const content = document.createElement('div');
        content.className = 'modal-content';
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'modal-body';
        bodyDiv.innerHTML = htmlContent;
        const rawCodeElement = bodyDiv.querySelector('code');
        if (rawCodeElement) {
            const langToDisplay = settings.outputTarget;
            const codeText = rawCodeElement.textContent;
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${langToDisplay}`;
            code.textContent = codeText;
            pre.appendChild(code);
            rawCodeElement.replaceWith(pre);
            setTimeout(() => Prism.highlightElement(code), 0);
        }
        const btn = document.createElement('button');
        btn.className = 'modal-button';
        btn.innerText = 'Continuar';
        btn.onclick = () => {
            document.body.removeChild(overlay);
            resolve();
        };
        content.appendChild(bodyDiv);
        content.appendChild(btn);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    });
};

window.onWinGame = async () => {
    const win = new Audio('assets/audios/win.mp3');
    win.volume = (settings.volumeMaster / 100) * (settings.volumeEffects / 100);
    win.play();

    let displayCode = "";
    const langToDisplay = settings.outputTarget;

    if (currentMode === "blockly") {
        try {
            if (typeof javascript !== 'undefined' && typeof workspace !== 'undefined' && workspace) {
                let rawCode = javascript.javascriptGenerator.workspaceToCode(workspace);
                displayCode = String(rawCode.trim())
                    .replace(/let loopLimit = 0;|\n\s*loopLimit\+\+ < 500/g, "")
                    .replace(/advance\(\);/g, "advance(); //↑")
                    .replace(/rotate\(90\);/g, "rotate_right(); //↻")
                    .replace(/rotate\(180\);/g, "rotate_halfTurn(); //↻↻")
                    .replace(/rotate\(-90\);/g, "rotate_left(); //↺");
            } else {
                displayCode = "// Código salvo com sucesso nos blocos.";
            }
        } catch (e) {
            console.warn("Gerador do Blockly ocupado, pulando leitura visual:", e);
            displayCode = "// Desafio concluído com blocos!";
        }

        await dropdown(`
            <h1>Parabéns! Nível ${currentLevelIndex + 1} Concluído!</h1>
            <p>Você conseguiu passar de nível usando a programação em blocos!</p>
            <code>${displayCode || "// Sucesso!"}</code>
        `);
    } else {
        await dropdown(`
            <h1>Parabéns! Nível ${currentLevelIndex + 1} Concluído!</h1>
            <p>Você conseguiu passar de nível com ${langToDisplay === "javascript" ? "JavaScript" : "Python"}!</p>
        `);
    }

    if (currentLevelIndex < levels.length - 1) {
        currentLevelIndex++;
        if (typeof startLevel === 'function') {
            startLevel(currentLevelIndex);
        }
    } else {
        await dropdown(`
            <h1>🏆 VOCÊ ZEROU O MAZEJS!</h1>
            <p>Parabéns! Você completou todos os desafios! O jogo será reiniciado.</p>
        `);
        location.reload();
    }
};

window.onLooseGame = async (reason) => {
    const loose = new Audio('assets/audios/loose.mp3');
    loose.volume = (settings.volumeMaster / 100) * (settings.volumeEffects / 100);
    loose.play();
    await dropdown(`
        <h1>Ops! você perdeu</h1>
        <p>Você morreu pois ${reason}, tente novamente.</p>
    `)
};

window.toggleEditorMode = function () {
    const blocklyDiv = document.getElementById("blocklyDiv");
    const monacoDiv = document.getElementById("monacoDiv");
    const counterDiv = document.getElementById("block-counter");
    if (currentMode === "blockly") {
        currentMode = "code";
        blocklyDiv.style.display = "none";
        monacoDiv.style.display = "block";
        if (counterDiv) counterDiv.style.opacity = "0.3";
        if (monacoEditorInstance) {
            setTimeout(() => {
                monacoEditorInstance.layout();
            }, 10);
        }

    } else {
        currentMode = "blockly";
        monacoDiv.style.display = "none";
        blocklyDiv.style.display = "block";
        if (counterDiv) counterDiv.style.opacity = "1";
        if (workspace) {
            Blockly.svgResize(workspace);
        }
    }
    updateSettings(settings);
};

function levelMenu(show) {
    const menu = document.getElementById('level-menu');
    menu.style.display = show ? 'flex' : 'none';

    if (show) renderChapters();
}

function renderChapters() {
    const wrapper = document.getElementById('chapters-wrapper');
    wrapper.innerHTML = '';

    chapters.forEach(chapter => {
        const section = document.createElement('section');
        section.className = 'chapter-card';
        section.style.setProperty('--chapter-color', chapter.color);

        section.innerHTML = `
            <div class="chapter-header">
                <h2>${chapter.name}</h2>
                <p>${chapter.description}</p>
            </div>
            <div class="levels-grid">
                ${chapter.levels.map(lvl => `
                    <button class="level-btn" onclick="selectLevel(${lvl.id})" ${lvl.difficulty === diffs.d6 ? diffsColors.d6 : lvl.difficulty === diffs.d7 ? diffsColors.d7 : lvl.difficulty === diffs.d8 ? diffsColors.d8 : lvl.difficulty === diffs.d9 ? diffsColors.d9 : lvl.difficulty === diffs.d10 ? diffsColors.d10 : ""}>
                        <span>${lvl.difficulty}</span>
                        <b>${lvl.name}</b>
                    </button>
                `).join('')}
            </div>
        `;
        wrapper.appendChild(section);
    });
}

function selectLevel(id) {
    currentLevelIndex = id;
    levelMenu(false);
    window.startLevel(id);
}

document.getElementById("settings-btn").addEventListener('click', async () => {
    const response = await settingsMenu(true);
    if (response.reason === "Unsaved") return;
    updateSettings(response);
});

function validate(json, schema) {
    for (const key in schema) {
        const expectedRule = schema[key];
        const isOptional = expectedRule.endsWith('?');
        const expectedType = isOptional ? expectedRule.slice(0, -1) : expectedRule;
        const hasKey = key in json;
        const value = json[key];
        if (!hasKey) {
            if (isOptional) continue;
            throw new Error(`Campo obrigatório ausente: ${key}`);
        }

        let actualType = typeof value;
        if (actualType === 'object') {
            if (Array.isArray(value)) actualType = 'array';
            else if (value === null) actualType = 'null';
        }

        if (actualType !== expectedType) {
            throw new Error(`O campo "${key}" deve ser do tipo ${expectedType}. Recebido: ${actualType}`);
        }
    }
    return true;
}

document.getElementById('levelInput').addEventListener('change', async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const levelSchema = {
        width: "number",
        blocksBlocked: "array",
        maxBlocks: "number?",
        initialMessage: "string?",
        layout: "array",
        name: "string",
        difficulty: "string"
    };

    for (const file of files) {
        await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    validate(data, levelSchema);
                    const exists = chapters.some(chapter =>
                        chapter.levels.some(level => level.name === data.name)
                    );

                    if (exists) {
                        throw new Error(`Já existe um nível cadastrado com o nome "${data.name}".`);
                    }

                    levels.push(data);
                    const newId = levels.length - 1;
                    let customChapter = chapters.find(chapter => chapter.name === "Personalizados");
                    const levelItemForChapter = {
                        id: newId,
                        name: data.name,
                        difficulty: data.difficulty
                    };

                    if (!customChapter) {
                        chapters.push({
                            name: "Personalizados",
                            color: "#75c529ff",
                            description: "Níveis personalizados (não oficiais) carregados pelo usuário!",
                            levels: [levelItemForChapter]
                        });
                    } else {
                        customChapter.levels.push(levelItemForChapter);
                    }

                    dropdown(`<h1>Sucesso</h1><p>O nível ${data.name} foi carregado como o nível #${newId + 1}</p>`);
                } catch (err) {
                    dropdown(`<h1>Erro</h1><p>Arquivo JSON inválido (${file.name}): ${err.message}<p>`);
                }

                resolve();
            };

            reader.readAsText(file);
        });
    }

    event.target.value = '';
});

document.getElementById('musicInput').addEventListener('change', (event) => {
    if (currentAudio) currentAudio.pause();
    const file = event.target.files[0];
    if (!file) return;
    const musicUrl = URL.createObjectURL(file);
    currentAudio = new Audio(musicUrl);
    currentAudio.loop = true;
    currentAudio.volume = (settings.volumeMaster / 100) * (settings.volumeMusic / 100);
    currentAudio.play();
    dropdown(`<h1>Sucesso</h1><p>Música carregada! aproveite para programar!</p>`)
});
