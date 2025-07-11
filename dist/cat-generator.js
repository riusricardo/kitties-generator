import { SeededRandom } from './utils/random';
import { DEFAULT_CAT_TRAITS, TRAIT_RARITIES, RARITY_WEIGHTS } from './data/traits';
import { SVGBuilder } from './rendering/svg-builder';
export class CatGenerator {
    constructor(options = {}) {
        this.traits = { ...DEFAULT_CAT_TRAITS, ...options.customTraits };
        this.width = options.width || 400;
        this.height = options.height || 500; // Increased from 400 to 500 to accommodate hats and accessories
    }
    /**
     * Generate a cat from a seed
     */
    generateCat(seed) {
        const random = new SeededRandom(seed);
        const attributes = this.generateAttributes(random);
        const svgData = this.renderCat(attributes, random);
        return {
            id: this.generateId(seed),
            seed,
            attributes,
            svgData,
            traits: this.calculateTraitRarities(attributes),
        };
    }
    /**
     * Generate multiple cats from seeds
     */
    generateCats(seeds) {
        return seeds.map(seed => this.generateCat(seed));
    }
    /**
     * Generate a random cat with a random seed
     */
    generateRandomCat() {
        const seed = Math.random().toString(36).substring(2, 15);
        return this.generateCat(seed);
    }
    /**
     * Generate attributes based on seed
     */
    generateAttributes(random) {
        const attributes = {
            color: this.selectTraitByRarity(random, 'colors'),
            furPattern: this.selectTraitByRarity(random, 'furPatterns'),
            eyeShape: this.selectTraitByRarity(random, 'eyeShapes'),
            mouth: this.selectTraitByRarity(random, 'mouths'),
            accessory: this.selectTraitByRarity(random, 'accessories'),
        };
        return attributes;
    }
    /**
     * Select a trait based on rarity weights
     */
    selectTraitByRarity(random, traitType) {
        const rarityRoll = random.random();
        let cumulativeWeight = 0;
        const rarityOrder = ['mythical', 'legendary', 'rare', 'uncommon', 'common'];
        for (const rarity of rarityOrder) {
            cumulativeWeight += RARITY_WEIGHTS[rarity];
            if (rarityRoll <= cumulativeWeight) {
                const traitsOfRarity = TRAIT_RARITIES[traitType][rarity];
                if (traitsOfRarity.length > 0) {
                    return random.randomChoice(traitsOfRarity);
                }
            }
        }
        // Fallback to common traits
        return random.randomChoice(this.traits[traitType]);
    }
    /**
     * Render the cat as SVG
     */
    renderCat(attributes, random) {
        const svg = new SVGBuilder(this.width, this.height, random);
        // REMOVED: Background - making it transparent
        // const bgGradient = svg.addRadialGradient('#F0F8FF', this.darkenColor('#F0F8FF', 10));
        // svg.rect(0, 0, this.width, this.height, `url(#${bgGradient})`);
        // REMOVED: Add background footprints for texture - transparent background
        // this.addBackgroundFootprints(svg, random);
        // Cat body positioning
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const catSize = Math.min(this.width, this.height) * 0.3;
        // Draw tail first so it appears behind the body
        this.drawTail(svg, centerX, centerY, catSize, attributes.color);
        // Draw enhanced cat body
        svg.drawCatBody(centerX, centerY, catSize, attributes.color);
        // Apply fur pattern
        svg.drawFurPattern(centerX, centerY, catSize, attributes.furPattern, attributes.color);
        // Draw cat head
        svg.drawCatHead(centerX, centerY - catSize * 0.5, catSize, attributes.color);
        // Draw eyes
        svg.drawCatEyes(centerX, centerY - catSize * 0.5, attributes.eyeShape, catSize);
        // Draw mouth
        svg.drawCatMouth(centerX, centerY - catSize * 0.5, attributes.mouth, catSize);
        // Draw cheek blush for extra cuteness - more frequent for kawaii style
        if (random.random() < 0.7) { // 70% chance for blush to match cute reference
            svg.drawCheekBlush(centerX, centerY - catSize * 0.5, catSize);
        }
        // Draw whiskers
        svg.drawWhiskers(centerX, centerY - catSize * 0.5, catSize);
        // Draw legs last so they appear on top of everything else
        svg.drawCatLegs(centerX, centerY, catSize, attributes.color);
        // Draw ALL accessories LAST so they appear in front of everything
        svg.drawAccessory(centerX, centerY - catSize * 0.5, catSize, attributes.accessory);
        return svg.build();
    }
    /**
     * Helper method to darken a color
     */
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    /**
     * Add decorative background footprints
     */
    addBackgroundFootprints(svg, random) {
        const footprintCount = 3;
        for (let i = 0; i < footprintCount; i++) {
            const x = random.randomFloat(50, this.width - 50);
            const y = random.randomFloat(50, this.height - 50);
            const size = random.randomFloat(8, 15);
            const opacity = random.randomFloat(0.1, 0.3);
            // Create a simple footprint shape
            const footprintPath = `M ${x} ${y + size * 0.8} 
                      C ${x - size * 0.6} ${y + size * 0.4} 
                        ${x - size * 0.8} ${y} 
                        ${x - size * 0.2} ${y - size * 0.4}`;
            svg.path(footprintPath, 'none', this.darkenColor('#F0F8FF', 20), size * 2.2);
            svg.circle(x, y - size * 0.4, size * 0.11, this.darkenColor('#F0F8FF', 20));
        }
    }
    drawTail(svg, x, y, size, color) {
        const tailStartX = x - size * 0.5;
        const tailStartY = y + size * 0.6;
        const tailEndX = x - size * 1.5;
        const tailEndY = y + size * 0.3;
        // Create a natural spline curve for the tail with multiple control points
        // This creates an S-shaped curve that looks more like a real cat tail
        const control1X = x - size * 0.7;
        const control1Y = y + size * 0.8;
        const control2X = x - size * 1.0;
        const control2Y = y + size * 0.4;
        const control3X = x - size * 1.4;
        const control3Y = y + size * 0.6;
        // Enhanced natural tail with spline curve using multiple Bézier segments
        const tailPath = `M ${tailStartX} ${tailStartY} 
                      C ${control1X} ${control1Y} 
                        ${control2X} ${control2Y} 
                        ${x - size * 1.2} ${y + size * 0.5}
                      S ${control3X} ${control3Y} 
                        ${tailEndX} ${tailEndY}`;
        const gradientId = svg.addGradient(color, svg.darkenColorPublic(color, 20));
        svg.path(tailPath, 'none', `url(#${gradientId})`, size * 0.22);
        svg.path(tailPath, 'none', svg.darkenColorPublic(color, 30), 2);
        // Rounded tail end
        svg.circle(tailEndX, tailEndY, size * 0.11, `url(#${gradientId})`, svg.darkenColorPublic(color, 30), 2);
    }
    /**
     * Calculate trait rarities for the generated cat
     */
    calculateTraitRarities(attributes) {
        const rarities = {};
        // Calculate rarity for each trait
        rarities.color = this.getTraitRarity(attributes.color, 'colors');
        rarities.furPattern = this.getTraitRarity(attributes.furPattern, 'furPatterns');
        rarities.eyeShape = this.getTraitRarity(attributes.eyeShape, 'eyeShapes');
        rarities.mouth = this.getTraitRarity(attributes.mouth, 'mouths');
        rarities.accessory = this.getTraitRarity(attributes.accessory, 'accessories');
        return rarities;
    }
    getTraitRarity(trait, traitType) {
        for (const [rarity, traits] of Object.entries(TRAIT_RARITIES[traitType])) {
            if (traits.includes(trait)) {
                return rarity;
            }
        }
        return 'common';
    }
    /**
     * Generate a unique ID for the cat
     */
    generateId(seed) {
        return `cat_${seed.substring(0, 8)}_${Date.now()}`;
    }
    /**
     * Helper method to determine if an accessory is a neck accessory
     */
    isNeckAccessory(accessory) {
        const neckAccessories = [
            'bow-tie', 'bowtie', 'scarf', 'necklace', 'ribbon', '1st-place-medal'
        ];
        return neckAccessories.includes(accessory);
    }
    /**
     * Helper method to determine if an accessory is a head/neck accessory (has SVG asset)
     */
    isHeadOrNeckAccessory(accessory) {
        const headOrNeckAccessories = [
            'hat', 'crown', 'bow-tie', 'bowtie', '1st-place-medal', 'scarf',
            'glasses', 'adhesive-bandage'
        ];
        return headOrNeckAccessories.includes(accessory);
    }
    /**
     * Generate a cat that is guaranteed to have at least one head or neck accessory
     */
    generateCatWithAccessory(seed, accessory) {
        if (accessory) {
            // Generate cat with specific accessory
            const random = new SeededRandom(seed);
            const attributes = this.generateAttributes(random);
            // Override the accessory with the specified one
            attributes.accessory = accessory;
            const svgData = this.renderCat(attributes, random);
            return {
                id: this.generateId(seed),
                seed,
                attributes,
                svgData,
                traits: this.calculateTraitRarities(attributes),
            };
        }
        else {
            // Generate cat with guaranteed head/neck accessory
            let attempts = 0;
            let cat = this.generateCat(seed);
            while (!this.isHeadOrNeckAccessory(cat.attributes.accessory) && attempts < 10) {
                attempts++;
                cat = this.generateCat(seed + '-attempt-' + attempts);
            }
            return cat;
        }
    }
}
//# sourceMappingURL=cat-generator.js.map