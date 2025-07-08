export class SeededRandom {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Returns a pseudo-random number between 0 and 1
   */
  random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Returns a random integer between min (inclusive) and max (exclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min)) + min;
  }

  /**
   * Returns a random element from an array
   */
  randomChoice<T>(array: T[]): T {
    return array[this.randomInt(0, array.length)];
  }

  /**
   * Returns a random float between min and max
   */
  randomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Returns true with the given probability (0-1)
   */
  randomBool(probability: number = 0.5): boolean {
    return this.random() < probability;
  }
}
