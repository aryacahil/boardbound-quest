import { Player } from './player.js';
import { UI } from './ui.js';

const CHARACTER_CLASSES = {
    fighter: { name: "Knight", hp: 120, attack: 15, color: '#e53935', icon: 'images/fighter.png' },
    mage: { name: "Mage", hp: 80, attack: 20, color: '#1e88e5', icon: 'images/mage.png' },
    assassin: { name: "Thief", hp: 90, attack: 18, color: '#43a047', icon: 'images/assassin.png' },
    marksman: { name: "Archer", hp: 100, attack: 12, color: '#fdd835', icon: 'images/marksman.png' },
    druid: { name: "Druid", hp: 110, attack: 14, color: '#00897b', icon: 'images/druid.png' },
    dragon: { name: "Dragon", hp: 150, attack: 18, color: '#d84315', icon: 'images/dragon.png' },
    barbarian: { name: "Barbarian", hp: 100, attack: 22, color: '#795548', icon: 'images/barbarian.png' },
    alchemist: { name: "Alchemist", hp: 85, attack: 10, color: '#8e24aa', icon: 'images/alchemy.png' }
};

export class Game {
    tilePath = [
        0, 1, 2, 3, 4, 5, 6, 7, 
        15, 23, 31, 39, 47, 55, 
        63, 62, 61, 60, 59, 58, 57, 56,
        48, 40, 32, 24, 16, 8
    ];

    constructor() {
        this.ui = new UI();
        this.players = [];
        this.currentPlayerIndex = 0;
        this.isGameOver = false;

        this.setupContainer = document.getElementById('game-setup');
        this.gameContainer = document.getElementById('game-container');
        this.playerCountInput = document.getElementById('player-count');
        this.playerFormsContainer = document.getElementById('player-creation-forms');
        this.startGameBtn = document.getElementById('start-game-btn');
    }

    initSetup() {
        this.playerCountInput.addEventListener('change', () => this.generatePlayerForms());
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.generatePlayerForms();
    }

    // --- PERBAIKAN UTAMA ADA DI FUNGSI INI ---
    generatePlayerForms() {
        const count = parseInt(this.playerCountInput.value, 10);
        this.playerFormsContainer.innerHTML = '';

        // 1. Buat daftar pilihan (<option>) secara dinamis dari CHARACTER_CLASSES
        let classOptionsHTML = '';
        for (const classKey in CHARACTER_CLASSES) {
            classOptionsHTML += `<option value="${classKey}">${CHARACTER_CLASSES[classKey].name}</option>`;
        }

        // 2. Buat form untuk setiap pemain dan masukkan daftar pilihan dinamis tadi
        for (let i = 0; i < count; i++) {
            const defaultClass = 'fighter';
            const formHTML = `
                <div class="player-form">
                    <img id="class-icon-${i}" class="class-icon" src="${CHARACTER_CLASSES[defaultClass].icon}" alt="Class Icon">
                    <strong>Pemain ${i + 1}:</strong>
                    <input type="text" id="player-name-${i}" placeholder="Masukkan Nama">
                    <select id="player-class-${i}">
                        ${classOptionsHTML}
                    </select>
                </div>
            `;
            this.playerFormsContainer.innerHTML += formHTML;
        }
        this.attachFormEventListeners();
    }

    attachFormEventListeners() {
        const count = parseInt(this.playerCountInput.value, 10);
        for (let i = 0; i < count; i++) {
            const classSelect = document.getElementById(`player-class-${i}`);
            const iconImg = document.getElementById(`class-icon-${i}`);
            classSelect.addEventListener('change', (event) => {
                iconImg.src = CHARACTER_CLASSES[event.target.value].icon;
            });
        }
    }

    startGame() {
        const count = parseInt(this.playerCountInput.value, 10);
        this.players = [];
        for (let i = 0; i < count; i++) {
            const name = document.getElementById(`player-name-${i}`).value;
            const classKey = document.getElementById(`player-class-${i}`).value;
            const classData = CHARACTER_CLASSES[classKey];
            const player = new Player(name, classData, i);
            this.players.push(player);
        }
        if (this.players.length > 0) {
            this.setupContainer.style.display = 'none';
            this.gameContainer.style.display = 'flex';
            this.initGame();
        }
    }

    initGame() {
        this.createBoard();
        this.ui.createPlayerInfoPanels(this.players);
        this.players.forEach(player => {
            this.ui.createPlayerPawn(player);
            this.updatePlayerPosition(player);
        });
        this.startTurn();
    }

    createBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            if (this.tilePath.includes(i)) {
                cell.classList.add('tile');
                cell.dataset.tileId = i;
            }
            gameBoard.appendChild(cell);
        }
        const centerPanelHTML = `
            <div id="center-panel">
                <div id="game-log-container"><div id="game-log"></div></div>
                <div id="dice-display">🎲</div>
                <button id="roll-dice-btn" class="btn">ROLL DICE!</button>
            </div>`;
        gameBoard.insertAdjacentHTML('beforeend', centerPanelHTML);
        this.ui.reassignCenterPanelElements();
        this.ui.rollDiceBtn.addEventListener('click', () => this.handleRollDice());
    }
    
    startTurn() {
        if (this.isGameOver) return;
        const currentPlayer = this.getCurrentPlayer();
        this.ui.updatePlayerStats(currentPlayer);
        this.ui.addLog(`--- Giliran <strong>${currentPlayer.name}</strong> ---`);
    }
    
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.startTurn();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    handleRollDice() {
        if (this.isGameOver) return;
        const steps = Math.floor(Math.random() * 6) + 1;
        this.ui.updateDiceDisplay(steps);
        const currentPlayer = this.getCurrentPlayer();
        this.ui.addLog(`${currentPlayer.name} rolled a: ${steps}.`);
        this.movePlayer(currentPlayer, steps);
    }
    
    movePlayer(player, steps) {
        player.move(steps);
        if (player.position >= this.tilePath.length) {
            player.position %= this.tilePath.length;
            this.ui.addLog(`${player.name} passed the start!`);
        }
        this.updatePlayerPosition(player);
        this.checkTileEvent(player);
        this.nextTurn();
    }

    updatePlayerPosition(player) {
        const visualTileId = this.tilePath[player.position];
        this.ui.renderPlayerPosition(player, visualTileId);
        this.ui.updatePlayerStats(player);
    }

    checkTileEvent(player) {
        const visualTileId = this.tilePath[player.position];
        if (visualTileId === 15 || visualTileId === 48) { 
            this.ui.addLog(`Treasure! ${player.name} Found 20 Gold.`);
            player.addGold(20);
            this.ui.updatePlayerStats(player);
        }
    }
}