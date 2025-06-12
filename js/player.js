// File: js/player.js (Versi Final yang Sudah Diperbaiki)

export class Player {
    constructor(name, classData, index) {
        this.name = name || `Player ${index + 1}`;
        this.class = classData.name;
        this.hp = classData.hp;
        this.attack = classData.attack;
        this.color = classData.color;
        
        // --- PERBAIKAN DI SINI ---
        // Kita sekarang menyimpan path ikon ke dalam objek pemain
        this.icon = classData.icon; 

        this.position = 0; // Index di dalam array tilePath
        this.gold = 0;
        this.index = index;
    }

    move(steps) {
        this.position += steps;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    addGold(amount) {
        this.gold += amount;
    }
}