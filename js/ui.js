export class UI {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.leftPanel = document.getElementById('left-info-panel');
        this.rightPanel = document.getElementById('right-info-panel');
        this.reassignCenterPanelElements();
    }

    reassignCenterPanelElements() {
        this.gameLog = document.getElementById('game-log');
        this.diceDisplay = document.getElementById('dice-display');
        this.rollDiceBtn = document.getElementById('roll-dice-btn');
    }

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
                </div>
            `;
            if (index < 2) { 
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
        
        pawn.style.top = `${tile.offsetTop + 15 + offsetY}px`;
        pawn.style.left = `${tile.offsetLeft + 15 + offsetX}px`;
    }
    
    addLog(message) {
        if (!this.gameLog) return;
        this.gameLog.innerHTML = `<p>${message}</p>` + this.gameLog.innerHTML;
    }
}