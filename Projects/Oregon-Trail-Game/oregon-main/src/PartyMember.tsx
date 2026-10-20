class PartyMember {
    private name!: string;
    private health!: number;
    private malnutrition!: number;
    // malnutrition should increase when the party member is on a worse food regiment, and decrease
    // on better food regiments. should also tie into party pace (ie worse food regiments are OK on
    // slower paces)
    private isAlive!: boolean;

    constructor(name: string, health = 100, malnutrition = 0, isAlive = true) {
        this!.name = name;
        this!.health = health;
        this!.malnutrition = malnutrition;
        this!.isAlive = isAlive;
    }


    // getters
    getName(): string {
        return this.name;
    }

    getHealth(): number {
        return this.health;
    }

    getMalnutrition(): number {
        return this.malnutrition;
    }

    isLiving(): boolean {
        return this.isAlive;
    }


    // setters
    setName(name: string): void {
        this.name = name;
    }

    setHealth(value: number): void {
        this.health = Math.max(0, Math.min(100, value));
        if (this.health <= 0) {
        this.isAlive = false;
        }
    }

    setMalnutrition(value: number): void {
        this.malnutrition = Math.max(0, Math.min(100, value));
    }

    setLifeState(state: boolean): void {
        this.isAlive = state;
    }

    takeDamage(damage: number): void {
        this.setHealth(this.getHealth() - damage)
        if (this.getHealth() <= 0) {
            this.setHealth(0);
            this.setLifeState(false);
        }
    }


}

export default PartyMember
