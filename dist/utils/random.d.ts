export declare class SeededRandom {
    private seed;
    constructor(seed: string | number);
    private hashString;
    /**
     * Returns a pseudo-random number between 0 and 1
     */
    random(): number;
    /**
     * Returns a random integer between min (inclusive) and max (exclusive)
     */
    randomInt(min: number, max: number): number;
    /**
     * Returns a random element from an array
     */
    randomChoice<T>(array: T[]): T;
    /**
     * Returns a random float between min and max
     */
    randomFloat(min: number, max: number): number;
    /**
     * Returns true with the given probability (0-1)
     */
    randomBool(probability?: number): boolean;
}
//# sourceMappingURL=random.d.ts.map