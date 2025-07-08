import { CatAttributes, CatTraits, GeneratedCat, CatGeneratorOptions } from './types';
import { SeededRandom } from './utils/random';
import { DEFAULT_CAT_TRAITS, TRAIT_RARITIES, RARITY_WEIGHTS } from './data/traits';
import { SVGBuilder } from './rendering/svg-builder';

export class CatGenerator {
  private traits: CatTraits;
  private width: number;
  private height: number;

  constructor(options: CatGeneratorOptions = {}) {
    this.traits = { ...DEFAULT_CAT_TRAITS, ...options.customTraits };
    this.width = options.width || 400;
    this.height = options.height || 400;
  }

  /**
   * Generate a cat from a seed
   */
  generateCat(seed: string): GeneratedCat {
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
  generateCats(seeds: string[]): GeneratedCat[] {
    return seeds.map(seed => this.generateCat(seed));
  }

  /**
   * Generate a random cat with a random seed
   */
  generateRandomCat(): GeneratedCat {
    const seed = Math.random().toString(36).substring(2, 15);
    return this.generateCat(seed);
  }

  /**
   * Generate attributes based on seed
   */
  private generateAttributes(random: SeededRandom): CatAttributes {
    const attributes: CatAttributes = {
      color: this.selectTraitByRarity(random, 'colors'),
      furPattern: this.selectTraitByRarity(random, 'furPatterns'),
      eyeShape: this.selectTraitByRarity(random, 'eyeShapes'),
      mouth: this.selectTraitByRarity(random, 'mouths'),
      accessory: this.selectTraitByRarity(random, 'accessories'),
      mutationFlags: this.generateMutations(random),
    };

    return attributes;
  }

  /**
   * Select a trait based on rarity weights
   */
  private selectTraitByRarity(random: SeededRandom, traitType: keyof typeof TRAIT_RARITIES): string {
    const rarityRoll = random.random();
    let cumulativeWeight = 0;
    
    const rarityOrder = ['mythical', 'legendary', 'rare', 'uncommon', 'common'] as const;
    
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
   * Generate mutation flags
   */
  private generateMutations(random: SeededRandom): string[] {
    const mutations: string[] = [];
    const mutationChance = 0.15; // 15% chance for any mutation
    
    if (random.randomBool(mutationChance)) {
      const numMutations = random.randomInt(1, 3);
      for (let i = 0; i < numMutations; i++) {
        const mutation = this.selectTraitByRarity(random, 'mutations');
        if (!mutations.includes(mutation)) {
          mutations.push(mutation);
        }
      }
    }
    
    return mutations;
  }

  /**
   * Render the cat as SVG
   */
  private renderCat(attributes: CatAttributes, random: SeededRandom): string {
    const svg = new SVGBuilder(this.width, this.height, random);
    
    // Background
    const bgGradient = svg.addRadialGradient('#F0F8FF', this.darkenColor('#F0F8FF', 10));
    svg.rect(0, 0, this.width, this.height, `url(#${bgGradient})`);
    
    // Add background footprints for texture
    this.addBackgroundFootprints(svg, random);
    
    // Cat body positioning
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const catSize = Math.min(this.width, this.height) * 0.3;
    
    // Draw tail first so it appears behind the body
    this.drawTail(svg, centerX, centerY, catSize, attributes.color);
    
    // Draw neck accessories before head so they appear on the neck behind the head
    if (this.isNeckAccessory(attributes.accessory)) {
      svg.drawAccessory(centerX, centerY - catSize * 0.5, catSize, attributes.accessory);
    }
    
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
    
    // Draw non-neck accessories (head accessories)
    if (!this.isNeckAccessory(attributes.accessory)) {
      svg.drawAccessory(centerX, centerY - catSize * 0.5, catSize, attributes.accessory);
    }
    
    // Apply mutations
    this.applyMutations(svg, centerX, centerY, catSize, attributes.mutationFlags);
    
    // Draw whiskers last on face so they appear on top of other features
    svg.drawWhiskers(centerX, centerY - catSize * 0.5, catSize);
    
    // Draw legs last so they appear on top of everything else
    svg.drawCatLegs(centerX, centerY, catSize, attributes.color);
    
    return svg.build();
  }

  /**
   * Helper method to darken a color
   */
  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Add decorative background footprints
   */
  private addBackgroundFootprints(svg: SVGBuilder, random: SeededRandom): void {
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

  private drawTail(svg: SVGBuilder, x: number, y: number, size: number, color: string): void {
    const tailStartX = x - size * 0.5;
    const tailStartY = y + size * 0.6;
    const tailEndX = x - size * 1.8;
    const tailEndY = y + size * 0.2;
    
    // Enhanced tail with better positioning and rounded end
    const tailPath = `M ${tailStartX} ${tailStartY} 
                      C ${x - size * 0.8} ${y + size * 0.2} 
                        ${x - size * 1.2} ${y + size * 0.1} 
                        ${tailEndX} ${tailEndY}`;
    
    const gradientId = svg.addGradient(color, svg.darkenColorPublic(color, 20));
    svg.path(tailPath, 'none', `url(#${gradientId})`, size * 0.22);
    svg.path(tailPath, 'none', svg.darkenColorPublic(color, 30), 2);
    
    // Rounded tail end
    svg.circle(tailEndX, tailEndY, size * 0.11, `url(#${gradientId})`, svg.darkenColorPublic(color, 30), 2);
  }

  private applyMutations(svg: SVGBuilder, x: number, y: number, size: number, mutations: string[]): void {
    mutations.forEach(mutation => {
      switch (mutation) {
        case 'glowing-eyes':
          svg.circle(x - size * 0.32, y - size * 0.1, size * 0.3, 'rgba(255, 255, 0, 0.3)');
          svg.circle(x + size * 0.32, y - size * 0.1, size * 0.3, 'rgba(255, 255, 0, 0.3)');
          break;
        case 'sparkles':
          for (let i = 0; i < 5; i++) {
            const sparkleX = x + (Math.random() - 0.5) * size * 2;
            const sparkleY = y + (Math.random() - 0.5) * size * 2;
            svg.text(sparkleX, sparkleY, '✨', size * 0.12, '#FFD700');
          }
          break;
        case 'double-tail':
          const tailStartX2 = x + size * 0.5;
          const tailStartY2 = y + size * 0.6;
          const tailEndX2 = x + size * 1.8;
          const tailEndY2 = y + size * 0.2;
          
          const tailPath2 = `M ${tailStartX2} ${tailStartY2} 
                            C ${x + size * 0.8} ${y + size * 0.2} 
                              ${x + size * 1.2} ${y + size * 0.1} 
                              ${tailEndX2} ${tailEndY2}`;
          
          const gradientId2 = svg.addGradient('#FFB6C1', svg.darkenColorPublic('#FFB6C1', 20));
          svg.path(tailPath2, 'none', `url(#${gradientId2})`, size * 0.22);
          svg.path(tailPath2, 'none', svg.darkenColorPublic('#FFB6C1', 30), 2);
          svg.circle(tailEndX2, tailEndY2, size * 0.11, `url(#${gradientId2})`, svg.darkenColorPublic('#FFB6C1', 30), 2);
          break;
        case 'extra-fluffy':
          // Add extra fluffy outline
          svg.circle(x, y, size * 1.1, 'rgba(255, 255, 255, 0.3)');
          break;
        case 'rainbow-fur':
          // Add rainbow gradient overlay
          const rainbowGradient = svg.addGradient('#FF0000', '#00FF00');
          svg.circle(x, y, size * 0.8, `url(#${rainbowGradient})`, 'none', 0);
          break;
      }
    });
  }

  /**
   * Calculate trait rarities for the generated cat
   */
  private calculateTraitRarities(attributes: CatAttributes): Record<string, any> {
    const rarities: Record<string, any> = {};
    
    // Calculate rarity for each trait
    rarities.color = this.getTraitRarity(attributes.color, 'colors');
    rarities.furPattern = this.getTraitRarity(attributes.furPattern, 'furPatterns');
    rarities.eyeShape = this.getTraitRarity(attributes.eyeShape, 'eyeShapes');
    rarities.mouth = this.getTraitRarity(attributes.mouth, 'mouths');
    rarities.accessory = this.getTraitRarity(attributes.accessory, 'accessories');
    rarities.mutationFlags = attributes.mutationFlags.map(mutation => 
      this.getTraitRarity(mutation, 'mutations')
    );
    
    return rarities;
  }

  private getTraitRarity(trait: string, traitType: keyof typeof TRAIT_RARITIES): string {
    for (const [rarity, traits] of Object.entries(TRAIT_RARITIES[traitType])) {
      if ((traits as string[]).includes(trait)) {
        return rarity;
      }
    }
    return 'common';
  }

  /**
   * Generate a unique ID for the cat
   */
  private generateId(seed: string): string {
    return `cat_${seed.substring(0, 8)}_${Date.now()}`;
  }

  /**
   * Helper method to determine if an accessory is a neck accessory
   */
  private isNeckAccessory(accessory: string): boolean {
    const neckAccessories = [
      'bow-tie', 'bowtie', 'bandana', 'scarf', 'necklace', 'bell', 'ribbon'
    ];
    return neckAccessories.includes(accessory);
  }
}
