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

    // PERUBAHAN: Layout panel pemain dibuat selang-seling
    createPlayerInfoPanels(players) {
        this.leftPanel.innerHTML = '';
        this.rightPanel.innerHTML = '';

        players.forEach((player, index) => {
            const panelHTML = `
                <div class="player-card" id="player-card-${index}">
                    <h3 style="color:${player.color};">${player.name}</h3>
                    <p><strong>Class:</strong> ${player.class}</p>
                    <p><strong>HP:</strong> <span id="hp-${index}">${player.hp}</span></p>
                    <p><strong>Posisi:</strong> <span id="pos-${index}">${player.position + 1}</span></p>
                </div>`;
            
            // Jika index genap (0, 2, 4...) ke kiri, ganjil (1, 3, 5...) ke kanan
            if (index % 2 === 0) { 
                this.leftPanel.innerHTML += panelHTML;
            } else { 
                this.rightPanel.innerHTML += panelHTML;
            }
        });
    }
    
    updatePlayerStats(player) {
        if(!document.getElementById(`hp-${player.index}`)) return;
        document.getElementById(`hp-${player.index}`).textContent = player.hp;
        document.getElementById(`pos-${player.index}`).textContent = player.position + 1;
        document.querySelectorAll('.player-card').forEach(card => card.classList.remove('active'));
        document.getElementById(`player-card-${player.index}`).classList.add('active');
    }

    updateDiceDisplay(number) {
        if (!this.diceDisplay) return;
        this.diceDisplay.textContent = number;
    }
    
    createPlayerPawn(player) {
        const pawn = document.createElement('div');
        pawn.classList.add('player-pawn');
        pawn.id = `player-${player.index}`;
        pawn.style.backgroundColor = player.color;
        pawn.textContent = player.index + 1;
        this.gameBoard.appendChild(pawn);
    }

    renderPlayerPosition(player, visualTileId) {
        const pawn = document.getElementById(`player-${player.index}`);
        const tile = document.querySelector(`[data-tile-id='${visualTileId}']`);
        if (!pawn || !tile) return;
        
        const offsetX = (player.index % 2) * 5;
        const offsetY = Math.floor(player.index / 2) * 5;
        
        pawn.style.top = `${tile.offsetTop + 10 + offsetY}px`;
        pawn.style.left = `${tile.offsetLeft + 10 + offsetX}px`;
    }
    
    // PERUBAHAN TOTAL: Menggunakan sistem notifikasi "toast"
    addLog(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = message; // innerHTML agar tag <strong> terbaca
        this.toastContainer.appendChild(toast);

        // Hapus notifikasi setelah animasi selesai (4 detik)
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}