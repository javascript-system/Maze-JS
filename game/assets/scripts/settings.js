const DEFAULT_SETTINGS = {
    language: "detect",
    showIntro: true,
    volumeMaster: 100,
    volumeEffects: 70,
    volumeMusic: 65,
    outputTarget: "javascript",
    showErrors: true,
    infiniteBlocks: false,
    infiniteLoopAllowed: false,
    allBlocks: false
};

function getConfigs() {
    const saved = localStorage.getItem("game_settings");
    if (!saved) return { ...DEFAULT_SETTINGS };
    try {
        return JSON.parse(saved);
    } catch (e) {
        return { ...DEFAULT_SETTINGS };
    }
}

function settingsMenu(show) {
    const overlay = document.getElementById("settings-overlay");

    if (!show) {
        overlay.style.display = "none";
        return Promise.resolve({ reason: "Closed" });
    }

    const currentSettings = getConfigs();
    document.getElementById("cfg-all-blocks").checked = currentSettings.allBlocks;
    document.getElementById("cfg-show-intro").checked = currentSettings.showIntro;
    document.getElementById("cfg-volume-master").value = currentSettings.volumeMaster;
    document.getElementById("cfg-volume-effects").value = currentSettings.volumeEffects;
    document.getElementById("cfg-volume-music").value = currentSettings.volumeMusic;
    document.getElementById("cfg-output-target").value = currentSettings.outputTarget;
    document.getElementById("cfg-show-errors").checked = currentSettings.showErrors;
    document.getElementById("cfg-infinite-blocks").checked = currentSettings.infiniteBlocks;
    document.getElementById("cfg-infinite-loop").checked = currentSettings.infiniteLoopAllowed;
    const volumeSliders = ['master', 'effects', 'music'];
    volumeSliders.forEach(type => {
        const slider = document.getElementById(`cfg-volume-${type}`);
        const label = document.getElementById(`val-volume-${type}`);
        label.textContent = slider.value;
        slider.oninput = function () { label.textContent = this.value; };
    });

    overlay.style.display = "flex";
    return new Promise((resolve) => {
        const btnSave = document.getElementById("btn-settings-save");
        const btnCancel = document.getElementById("btn-settings-cancel");
        const btnReset = document.getElementById("btn-settings-reset");

        const cleanUp = () => {
            btnSave.onclick = null;
            btnCancel.onclick = null;
            btnReset.onclick = null;
            overlay.style.display = "none";
        };

        btnSave.onclick = () => {
            const updatedSettings = {
                allBlocks: document.getElementById("cfg-all-blocks").checked,
                showIntro: document.getElementById("cfg-show-intro").checked,
                volumeMaster: parseInt(document.getElementById("cfg-volume-master").value),
                volumeEffects: parseInt(document.getElementById("cfg-volume-effects").value),
                volumeMusic: parseInt(document.getElementById("cfg-volume-music").value),
                outputTarget: document.getElementById("cfg-output-target").value,
                showErrors: document.getElementById("cfg-show-errors").checked,
                infiniteBlocks: document.getElementById("cfg-infinite-blocks").checked,
                infiniteLoopAllowed: document.getElementById("cfg-infinite-loop").checked
            };

            window.updateBlocklyLevel();
            localStorage.setItem("game_settings", JSON.stringify(updatedSettings));
            cleanUp();
            resolve(updatedSettings);
        };

        btnCancel.onclick = () => {
            cleanUp();
            resolve({ reason: "Unsaved" });
        };

        btnReset.onclick = () => {
            const confirmWipe = confirm("Tem certeza que deseja apagar todas as configurações? Isso não pode ser desfeito.");
            if (confirmWipe) {
                localStorage.removeItem("game_settings");
                cleanUp();
                resolve({ ...DEFAULT_SETTINGS, reason: "Reseted" });
            }
        };
    });
}