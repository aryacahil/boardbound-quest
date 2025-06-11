export class Player {
    constructor(name, classData, index) {
        this.name = name || `Player ${index + 1}`;
        this.class = classData.name;
        this.hp = classData.hp;
        this.attack = classData.attack;
        this.color = classData.color;

        this.position = 0;
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