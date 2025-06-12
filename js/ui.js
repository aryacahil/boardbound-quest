// File: js/ui.js (Versi Final dengan Ikon & Nama di Pion)

export class UI {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.leftPanel = document.getElementById('left-info-panel');
        this.rightPanel = document.getElementById('right-info-panel');
        this.toastContainer = document.getElementById('toast-container');
        this.reassignCenterPanelElements();
    }

    reassignCenterPanelElements() {
        this.diceDisplay = document.getElementById('dice-display');
        this.rollDiceBtn = document.getElementById('roll-dice-btn');
    }

    createPlayerInfoPanels(players) {
        this.leftPanel.innerHTML = '';
        this.rightPanel.innerHTML = '';
        players.forEach((player, index) => {
            const panelHTML = `
                <div class="player-card" id="player-card-${index}">
                    <h3 style="color:${player.color};">${player.name || `Player ${index + 1}`}</h3>
                    <p><strong>Class:</strong> ${player.class}</p>
                    <p><strong>HP:</strong> <span id="hp-${index}">${player.hp}</span></p>
                    <p><strong>Position:</strong> <span id="pos-${index}">${player.position + 1}</span></p>
                </div>`;
            if (index % 2 === 0) {
                this.leftPanel.innerHTML += panelHTML;
            } else {
                this.rightPanel.innerHTML += panelHTML;
            }
        });
    }

    updatePlayerStats(player) {
        if (!document.getElementById(`hp-${player.index}`)) return;
        document.getElementById(`hp-${player.index}`).textContent = player.hp;
        document.getElementById(`pos-${player.index}`).textContent = player.position + 1;
        document.querySelectorAll('.player-card').forEach(card => card.classList.remove('active'));
        document.getElementById(`player-card-${player.index}`).classList.add('active');
    }

    updateDiceDisplay(number) {
        if (!this.diceDisplay) return;
        this.diceDisplay.textContent = number;
    }

    // --- PERUBAHAN UTAMA DI SINI ---
    createPlayerPawn(player) {
        const pawn = document.createElement('div');
        pawn.classList.add('player-pawn');
        pawn.id = `player-${player.index}`;
        
        // Menggunakan warna pemain sebagai border dan gambar ikon sebagai background
        pawn.style.borderColor = player.color;
        pawn.style.backgroundImage = `url('${player.icon}')`;

        const nameTag = document.createElement('span');
        nameTag.classList.add('pawn-name');
        nameTag.textContent = player.name || `P${player.index + 1}`;
        pawn.appendChild(nameTag);

        this.gameBoard.appendChild(pawn);
    }

    renderPlayerPosition(player, visualTileId) {
        const pawn = document.getElementById(`player-${player.index}`);
        const tile = document.querySelector(`[data-tile-id='${visualTileId}']`);
        if (!pawn || !tile) return;

        const offsetX = (player.index % 2) * 20;
        const offsetY = Math.floor(player.index / 2) * 10;

        pawn.style.top = `${tile.offsetTop + 5 + offsetY}px`;
        pawn.style.left = `${tile.offsetLeft + 5 + offsetX}px`;
    }

    addLog(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = message;
        this.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}