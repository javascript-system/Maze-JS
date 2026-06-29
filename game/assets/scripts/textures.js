const textures = {
    wall: (c) => {
        c.fillStyle = '#45475a'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#313244'; c.fillRect(1, 1, 14, 14);
        c.fillStyle = '#1e1e2e'; c.fillRect(4, 4, 8, 8);
    },

    floor: (c) => {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#f0f0f0'; c.fillRect(0, 0, 1, 16); c.fillRect(0, 0, 16, 1);
    },

    player: (c) => {
        c.fillStyle = '#f9e2af'; c.fillRect(3, 3, 10, 10);
        c.fillStyle = '#11111b'; c.fillRect(10, 5, 3, 2); c.fillRect(10, 9, 3, 2);
    },

    ice: (c) => {
        c.fillStyle = '#89dceb'; c.fillRect(0, 0, 16, 16);
        c.fillStyle = '#ffffff'; c.globalAlpha = 0.5; c.fillRect(2, 2, 4, 1); c.fillRect(8, 10, 5, 1);
    },

    button: (c) => {
        c.fillStyle = '#f38ba8'; c.beginPath(); c.arc(8, 8, 5, 0, 7); c.fill();
        c.fillStyle = '#11111b'; c.fillRect(6, 6, 4, 4);
    },

    end: (c) => {
        c.fillStyle = '#a6e3a1'; c.fillRect(2, 2, 12, 12);
        c.fillStyle = '#ffffff'; c.fillRect(6, 4, 4, 8); c.fillRect(4, 6, 8, 4);
    },

    trap: (c) => {
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
    },

    switch: (c) => {
        c.fillStyle = '#cba6f7'; c.fillRect(4, 4, 8, 8);
        c.fillStyle = '#ffffff'; c.fillRect(7, 5, 2, 6);
    },

    door: {
        closed: (c) => {
            c.fillStyle = '#fab387'; c.fillRect(2, 2, 12, 12);
            c.fillStyle = '#45475a'; c.fillRect(7, 6, 2, 4);
        },

        opened: (c) => {
            c.strokeStyle = '#fab387'; c.lineWidth = 1; c.strokeRect(2, 2, 12, 12);
        }
    }
}
