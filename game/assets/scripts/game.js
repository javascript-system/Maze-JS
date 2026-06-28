window.onWinGame = async () => {
    const win = new Audio('assets/audios/win.mp3');
    win.volume = (settings.volumeMaster / 100) * (settings.volumeEffects / 100);
    win.play();

    let displayCode = "";
    const langToDisplay = settings.outputTarget;

    if (currentMode === "blockly") {
        // Bloco de segurança total: tenta ler o Blockly, se não conseguir, não trava o jogo!
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

    // Código crucial que faz avançar de fase independentemente de qualquer erro acima:
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
