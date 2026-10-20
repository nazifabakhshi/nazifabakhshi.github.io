export class Random {
    private seed: number;

    constructor();
    constructor(seed: number);
    constructor(seed?: number) {
        if (seed === undefined) {
            this.seed = Date.now(); // use system clock
        } else {
            this.seed = seed;
        }
    }

    /** Core deterministic PRNG step using recursive sinusoidal mixing */
    private nextInternal(): number {
        // mutate the seed in a repeatable way
        this.seed = Math.sin(this.seed) * 10000;
        return this.seed - Math.floor(this.seed); // keep fractional part only
    }

    /** Float in [0,1) */
    next(): number {
        return this.nextInternal();
    }

    /** Integer in [0, bound) */
    nextInt(bound: number): number {
        if (bound <= 0 || !Number.isInteger(bound)) {
            throw new Error("bound must be a positive integer");
        }
        return Math.floor(this.next() * bound);
    }

    /** Integer in [min, max] inclusive */
    nextIntRange(min: number, max: number): number {
        if (max < min) throw new Error("max must be >= min");
        return min + this.nextInt(max - min + 1);
    }
}

export const gameRNG = new Random(314159);