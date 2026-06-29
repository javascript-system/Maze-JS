const TILE_SIZE = 64;
const ANIM_SPEED = 250;
const MOVE_EASE = (t) => t * t * (3 - 2 * t);
let gameWorker = null;
let timeoutId = null;

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
const IMAGES = {};

let currentLevelIndex = 0;
let levelWidth = 0, levelHeight = 0, grid = [];
let doorStates = {};
let commandQueue = [];
let isRunning = false;
let visitedTiles = new Set();
let autoPaths = [];
let lastTime = 0;
let animTimer = 0;

let player = {
    gx: 0, gy: 0, px: 0, py: 0,
    dir: 0, currentDir: 0,
    targetGx: 0, targetGy: 0, targetDir: 0,
    startX: 0, startY: 0,
    state: 'IDLE', bumpOffset: 0, scale: 1
};

function createAssets() {
    const drawToImg = (w, h, drawFn) => {
        const off = document.createElement('canvas');
        off.width = w; off.height = h;
        const octx = off.getContext('2d');
        octx.imageSmoothingEnabled = false;
        drawFn(octx);
        const img = new Image();
        img.src = off.toDataURL();
        return img;
    };

    IMAGES['#'] = drawToImg(16, 16, c => {
        c.fillStyle = '#45475a'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#313244'; c.fillRect(1, 1, 14, 14);
        c.fillStyle = '#1e1e2e'; c.fillRect(4, 4, 8, 8);
    });
    IMAGES['.'] = drawToImg(16, 16, c => {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#f0f0f0'; c.fillRect(0, 0, 1, 16); c.fillRect(0, 0, 16, 1);
    });
    IMAGES['P'] = drawToImg(16, 16, c => {
        c.fillStyle = '#f9e2af'; c.fillRect(3, 3, 10, 10);
        c.fillStyle = '#11111b'; c.fillRect(10, 5, 3, 2); c.fillRect(10, 9, 3, 2);
    });
    IMAGES['I'] = drawToImg(16, 16, c => {
        c.fillStyle = '#89dceb'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#ffffff'; c.globalAlpha = 0.5; c.fillRect(2, 2, 4, 1); c.fillRect(8, 10, 5, 1);
    });
    IMAGES['D_closed'] = drawToImg(16, 16, c => {
        c.fillStyle = '#fab387'; c.fillRect(2, 2, 12, 12);
        c.fillStyle = '#45475a'; c.fillRect(7, 6, 2, 4);
    });
    IMAGES['D_open'] = drawToImg(16, 16, c => {
        c.strokeStyle = '#fab387'; c.lineWidth = 1; c.strokeRect(2, 2, 12, 12);
    });
    IMAGES['B'] = drawToImg(16, 16, c => {
        c.fillStyle = '#f38ba8'; c.beginPath(); c.arc(8, 8, 5, 0, 7); c.fill();
        c.fillStyle = '#11111b'; c.fillRect(6, 6, 4, 4);
    });
    IMAGES['E'] = drawToImg(16, 16, c => {
        c.fillStyle = '#a6e3a1'; c.fillRect(2, 2, 12, 12);
        c.fillStyle = '#ffffff'; c.fillRect(6, 4, 4, 8); c.fillRect(4, 6, 8, 4);
    });
    IMAGES['T'] = drawToImg(16, 16, c => {
        c.fillStyle = '#eba0ac';
        const startX = 0.5;
        for (let i = 0; i < 3; i++) {
            const baseLeft = startX + (i * 5);
            const baseRight = baseLeft + 5;
            const centerX = baseLeft + 2.5;
            const topY = 2;
            const bottomY = 14;
            c.beginPath();
            c.moveTo(baseLeft, bottomY);
            c.lineTo(centerX, topY);
            c.lineTo(baseRight, bottomY);
            c.closePath();
            c.fill();
            c.fillStyle = 'rgba(0,0,0,0.1)';
            c.beginPath();
            c.moveTo(centerX, topY);
            c.lineTo(baseRight, bottomY);
            c.lineTo(centerX, bottomY);
            c.fill();
            c.fillStyle = '#eba0ac';
        }
    });
    IMAGES['S'] = drawToImg(16, 16, c => {
        c.fillStyle = '#cba6f7'; c.fillRect(4, 4, 8, 8);
        c.fillStyle = '#ffffff'; c.fillRect(7, 5, 2, 6);
    });
}


let vPlayer = { gx: 0, gy: 0, dir: 0 };
let isFirstTimeInLevel = true;

window.startLevel = async (idx) => {
    isFirstTimeInLevel = true;
    loadLevel(idx);
    if (window.updateBlocklyLevel) {
        window.updateBlocklyLevel(levels[idx].maxBlocks, levels[idx].blocksBlocked);
    }
    if (levels[idx].initialMessage && isFirstTimeInLevel) {
        if (settings.showIntro == true) await dropdown(levels[idx].initialMessage);
        isFirstTimeInLevel = false;
    }

    isRunning = true;
};
window.advance = () => {
    let rad = vPlayer.dir * Math.PI / 180;
    vPlayer.gx += Math.round(Math.cos(rad));
    vPlayer.gy += Math.round(Math.sin(rad));
    commandQueue.push({ type: 'move' });
};
window.rotate = (deg) => {
    vPlayer.dir = (vPlayer.dir + deg) % 360;
    commandQueue.push({ type: 'turn', val: deg });
};
window.vCheckPath = (direction) => {
    let currentDir = ((vPlayer.dir % 360) + 360) % 360;
    let checkDir = currentDir;
    if (direction === 'right') checkDir += 90;
    else if (direction === 'left') checkDir -= 90;
    else if (direction === 'back') checkDir += 180;
    let rad = (checkDir * Math.PI) / 180;
    let nx = vPlayer.gx + Math.round(Math.cos(rad));
    let ny = vPlayer.gy + Math.round(Math.sin(rad));
    if (nx < 0 || nx >= levelWidth || ny < 0 || ny >= levelHeight) return false;
    let tile = grid[ny * levelWidth + nx];
    let type = (typeof tile === 'object') ? tile.special : tile;
    return "P.EBSID".includes(type);
};


window.vCheckEnd = () => {
    let tile = grid[vPlayer.gy * levelWidth + vPlayer.gx];
    let type = typeof tile === 'object' ? tile.special : tile;
    return type === 'E';
};
window.killLevel = (reason = "generic") => {
    isRunning = false;
    commandQueue = [];

    animTimer = 0;
    if (reason === "generic") return;
    let message;
    if (reason === "wall_collision") { message = "bateu em uma parede ou caiu para fora do mapa" }
    else if (reason === "trap_spike") { message = "caiu em espinhos" }
    window.onLooseGame(message); player.state = 'DYING';
};

function loadLevel(idx) {
    currentLevelIndex = idx;
    const lvl = levels[idx];
    levelWidth = lvl.width;
    grid = lvl.layout;
    levelHeight = Math.ceil(grid.length / levelWidth);
    doorStates = {}; commandQueue = []; visitedTiles.clear();

    const pIdx = grid.findIndex(v => v === "P" || v.special === "P");
    player.startX = pIdx % levelWidth;
    player.startY = Math.floor(pIdx / levelWidth);

    resetPlayerToStart();
    calculatePaths();
}

function resetPlayerToStart() {
    player.gx = player.startX;
    player.gy = player.startY;
    player.px = player.gx * TILE_SIZE;
    player.py = player.gy * TILE_SIZE;
    player.dir = 0; player.currentDir = 0; player.targetDir = 0;
    player.state = 'IDLE'; player.bumpOffset = 0; player.scale = 1;
    visitedTiles.add(`${player.gx},${player.gy}`);
}

function calculatePaths() {
    autoPaths = [];
    const isWalkable = (t) => {
        const type = typeof t === 'object' ? t.special : t;
        return "P.EBSI D".includes(type);
    };
    for (let i = 0; i < grid.length; i++) {
        let x = i % levelWidth, y = Math.floor(i / levelWidth);
        if (!isWalkable(grid[i])) continue;
        [[1, 0], [0, 1]].forEach(([dx, dy]) => {
            let nx = x + dx, ny = y + dy;
            if (nx < levelWidth && ny < levelHeight && isWalkable(grid[ny * levelWidth + nx]))
                autoPaths.push({ x1: x, y1: y, x2: nx, y2: ny });
        });
    }
}

function update(dt) {
    if (!isRunning && player.state !== 'DYING') return;

    if (player.state === 'IDLE' && commandQueue.length > 0) {
        let cmd = commandQueue.shift();
        if (cmd.type === 'move') {
            let rad = player.dir * Math.PI / 180;
            let nx = player.gx + Math.round(Math.cos(rad));
            let ny = player.gy + Math.round(Math.sin(rad));
            let tile = grid[ny * levelWidth + nx];
            let type = typeof tile === 'object' ? tile.special : tile;

            if ("#N".includes(type) || (type === 'D' && !doorStates[tile.id])) {
                player.state = 'BUMPING'; animTimer = 0;
            } else {
                player.targetGx = nx; player.targetGy = ny;
                player.state = 'MOVING'; animTimer = 0;
            }
        } else {
            player.targetDir = player.dir + cmd.val;
            player.state = 'TURNING'; animTimer = 0;
        }
    }

    if (player.state !== 'IDLE') {
        animTimer += dt;
        let t = Math.min(animTimer / ANIM_SPEED, 1);

        if (player.state === 'MOVING') {
            player.px = (player.gx + (player.targetGx - player.gx) * MOVE_EASE(t)) * TILE_SIZE;
            player.py = (player.gy + (player.targetGy - player.gy) * MOVE_EASE(t)) * TILE_SIZE;
            if (t >= 1) {
                player.gx = player.targetGx; player.gy = player.targetGy;
                player.state = 'IDLE';
                visitedTiles.add(`${player.gx},${player.gy}`);
                processTile();
            }
        } else if (player.state === 'TURNING') {
            player.currentDir = player.dir + (player.targetDir - player.dir) * MOVE_EASE(t);
            if (t >= 1) {
                player.dir = player.targetDir; player.currentDir = player.dir;
                player.state = 'IDLE';
            }
        } else if (player.state === 'BUMPING') {
            player.bumpOffset = Math.sin(t * 30) * 6;
            if (t >= 1) window.killLevel("wall_collision");
        } else if (player.state === 'DYING') {
            player.scale = 1 - t;
            player.bumpOffset = Math.sin(t * 50) * 10;
            if (t >= 1) resetPlayerToStart();
        }
    }
}

function processTile() {
    let tile = grid[player.gy * levelWidth + player.gx];
    let type = typeof tile === 'object' ? tile.special : tile;

    if (type === 'I') commandQueue.unshift({ type: 'move' });
    if (type === 'B') doorStates[tile.opens] = true;
    if (type === 'S') doorStates[tile.id] = !doorStates[tile.id];
    if (type === 'E') { isRunning = false; window.onWinGame(); }
    if (type === 'T') window.killLevel("trap_spike");
}

function draw() {
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;

    let offsetX = (canvas.width - levelWidth * TILE_SIZE) / 2;
    let offsetY = (canvas.height - levelHeight * TILE_SIZE) / 2;
    ctx.save();
    ctx.translate(offsetX, offsetY);

    autoPaths.forEach(p => {
        let v1 = visitedTiles.has(`${p.x1},${p.y1}`), v2 = visitedTiles.has(`${p.x2},${p.y2}`);
        ctx.strokeStyle = (v1 && v2) ? '#a6e3a1' : '#f9e2af';
        ctx.lineWidth = 6; ctx.beginPath();
        ctx.moveTo(p.x1 * TILE_SIZE + TILE_SIZE / 2, p.y1 * TILE_SIZE + TILE_SIZE / 2);
        ctx.lineTo(p.x2 * TILE_SIZE + TILE_SIZE / 2, p.y2 * TILE_SIZE + TILE_SIZE / 2);
        ctx.stroke();
    });

    grid.forEach((tile, i) => {
        let x = i % levelWidth, y = Math.floor(i / levelWidth);
        let type = typeof tile === 'object' ? tile.special : tile;
        if (type === 'N') return;
        ctx.drawImage(IMAGES['.'], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        let imgKey = type === 'D' ? (doorStates[tile.id] ? 'D_open' : 'D_closed') : type;
        if (IMAGES[imgKey]) ctx.drawImage(IMAGES[imgKey], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    if (player.scale > 0) {
        ctx.save();
        ctx.translate(player.px + TILE_SIZE / 2 + player.bumpOffset, player.py + TILE_SIZE / 2);
        ctx.rotate(player.currentDir * Math.PI / 180);
        ctx.scale(player.scale, player.scale);
        ctx.drawImage(IMAGES['P'], -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
        ctx.restore();
    }

    ctx.restore();
}


async function executeCode() {
    if (currentMode === "blockly") {
        executeBlocklyCode();
    }
    else if (currentMode === "code") {
        if (!monacoEditorInstance) return;
        const btn = document.getElementById("exec-btn");
        if (executingCode === true) {
            if (timeoutId) clearTimeout(timeoutId);
            killLevel();
            if (gameWorker) { gameWorker.terminate() }
            btn.innerHTML = `<img src="assets/icons/play.svg"> Interrompendo...`;
            btn.disabled = true;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        executingCode = true;
        btn.style.backgroundColor = "#4b4a4aff";
        btn.innerHTML = `<img src="assets/icons/play.svg"> Executando...`;
        btn.style.cursor = "wait";
        btn.disabled = false;
        killLevel();
        setTimeout(async () => {
            if (typeof loadLevel === 'function') loadLevel(currentLevelIndex);
            vPlayer.gx = player.gx;
            vPlayer.gy = player.gy;
            vPlayer.dir = player.dir;
            isRunning = true;
            const userCode = monacoEditorInstance.getValue();
            try {
                if (gameWorker) gameWorker.terminate();
                const sab = new SharedArrayBuffer(1024);
                const ia = new Int32Array(sab);
                ia[0] = 0;
                gameWorker = new Worker('assets/scripts/worker.js');
                timeoutId = setTimeout(() => {
                    if (gameWorker && !settings.infiniteLoopAllowed) {
                        gameWorker.terminate();
                        gameWorker = null;
                        if (settings.showErrors) dropdown(`
                    <h1 style="color: red">Security Error</h1>
                    <p>Ocorreu um erro na execução do seu script JS:</p>
                    <p>Seu código foi interrompido porque demorou mais de 3 segundos para responder. Cuidado com loops infinitos!</p>
                `);
                        executingCode = false;
                        btn.style.backgroundColor = "#4CAF50";
                        btn.innerHTML = `<img src="assets/icons/play.svg"> Rodar Solução`;
                        btn.style.cursor = "pointer";
                        killLevel();
                    }
                }, 3000);
                gameWorker.onmessage = async function (e) {
                    const message = e.data;

                    if (message.type === 'action') {
                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(() => {
                            if (gameWorker && !settings.infiniteLoopAllowed) {
                                gameWorker.terminate();
                                gameWorker = null;
                                if (settings.showErrors) dropdown(`<h1 style="color: red">Security Error</h1><p>Ocorreu um erro na execução do seu script JS:</p><p>Seu código foi interrompido porque demorou mais de 3 segundos para responder. Cuidado com loops infinitos!</p>`);
                                executingCode = false;
                                btn.style.backgroundColor = "#4CAF50";
                                btn.innerHTML = `<img src="assets/icons/play.svg"> Rodar Solução`;
                                btn.style.cursor = "pointer";
                                killLevel();
                            }
                        }, 3000);
                        if (message.action === 'advance') {
                            window.advance();
                            await new Promise(r => setTimeout(r, 400));
                        }
                        else if (message.action === 'rotate_left') {
                            window.rotate(-90);
                            await new Promise(r => setTimeout(r, 400));
                        }
                        else if (message.action === 'rotate_right') {
                            window.rotate(90);
                            await new Promise(r => setTimeout(r, 400));
                        }
                        else if (message.action === 'rotate_halfTurn') {
                            window.rotate(180);
                            await new Promise(r => setTimeout(r, 400));
                        }
                        else if (message.action === 'checkPath') {
                            const result = typeof window.vCheckPath === 'function' ? (window.vCheckPath(message.param) ? 1 : 0) : 0;
                            ia[1] = result;
                        }
                        else if (message.action === 'checkEnd') {
                            const reachedEnd = typeof window.vCheckEnd === 'function' ? window.vCheckEnd() : false;
                            ia[1] = reachedEnd ? 0 : 1;
                        }
                        ia[0] = 1;
                        Atomics.notify(ia, 0, 1);
                    }

                    else if (message.type === 'status') {
                        clearTimeout(timeoutId);
                        gameWorker.terminate();
                        gameWorker = null;

                        if (message.status === 'error' && settings.showErrors) {
                            await dropdown(`
                        <h1 style="color: red">JavaScript Error</h1>
                        <p>Ocorreu um erro na execução do seu script JS:</p>
                        <pre style="background: #fdf2f2; color: #b91c1c; padding: 10px; border-radius: 4px; text-align: left;">${message.message}</pre>
                    `);
                        }
                        executingCode = false;
                        btn.style.backgroundColor = "#4CAF50";
                        btn.innerHTML = `<img src="assets/icons/play.svg"> Rodar Solução`;
                        btn.style.cursor = "pointer";
                    }
                };
                gameWorker.postMessage({ jsCode: userCode, sab: sab });
            } catch (err) {
                if (err === "ReferenceError: SharedArrayBuffer is not defined" && settings.showErrors) { await dropdown("Error, the user are executing the code in file context, use localhost or a website for the browser to allow the execution.") }
                else { alert(err) };
                executingCode = false;
                btn.style.backgroundColor = "#4CAF50";
                btn.innerHTML = `<img src="assets/icons/play.svg"> Rodar Solução`;
                btn.style.cursor = "pointer";
                killLevel();
            }
        }, 400);
    }
}

createAssets();
window.startLevel(0);
function loop(t) {
    update(t - lastTime);
    draw();
    lastTime = t;
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
