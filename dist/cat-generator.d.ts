import { GeneratedCat, CatGeneratorOptions } from './types';
export declare class CatGenerator {
    private traits;
    private width;
    private height;
    private responsive;
    constructor(options?: CatGeneratorOptions);
    /**
     * Generate a cat from a seed
     */
    generateCat(seed: string): GeneratedCat;
    /**
     * Generate multiple cats from seeds
     */
    generateCats(seeds: string[]): GeneratedCat[];
    /**
     * Generate a random cat with a random seed
     */
    generateRandomCat(): GeneratedCat;
    /**
     * Generate attributes based on seed
     */
    private generateAttributes;
    /**
     * Select a trait based on rarity weights
     */
    private selectTraitByRarity;
    /**
     * Render the cat as SVG
     */
    private renderCat;
    /**
     * Generate a responsive cat that scales dynamically
     */
    generateResponsiveCat(seed: string): GeneratedCat;
    /**
     * Helper method to darken a color
     */
    private darkenColor;
    /**
     * Add decorative background footprints
     */
    private addBackgroundFootprints;
    private drawTail;
    /**
     * Calculate trait rarities for the generated cat
     */
    private calculateTraitRarities;
    private getTraitRarity;
    /**
     * Generate a unique ID for the cat
     */
    private generateId;
    /**
     * Helper method to determine if an accessory is a neck accessory
     */
    private isNeckAccessory;
    /**
     * Helper method to determine if an accessory is a head/neck accessory (has SVG asset)
     */
    private isHeadOrNeckAccessory;
    /**
     * Generate a cat that is guaranteed to have at least one head or neck accessory
     */
    generateCatWithAccessory(seed: string, accessory?: string): GeneratedCat;
}
//# sourceMappingURL=cat-generator.d.ts.map