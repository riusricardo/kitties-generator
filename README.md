# CryptoKitty Generator

A TypeScript library for generating CryptoKitties-style cat images with customizable attributes, similar to the popular NFT collection.

## Features

- 🎯 **Deterministic Generation**: Use seeds to generate consistent cats
- 🎨 **Rich Attributes**: Color, Fur Pattern, Eye Shape, Mouth, and Accessory
- 🏆 **Rarity System**: Traits have different rarity levels (Common, Uncommon, Rare, Legendary, Mythical)
- 🖼️ **SVG Output**: Generated cats are rendered as scalable SVG images
- 🔧 **Customizable**: Configure canvas size and custom trait sets
- 📦 **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install cryptokitty-generator
```

## Quick Start

```typescript
import { CatGenerator } from 'cryptokitty-generator';

// Create a new generator
const generator = new CatGenerator({
  width: 400,
  height: 400
});

// Generate a cat from a seed
const cat = generator.generateCat('my-seed');

console.log('Generated Cat:', {
  id: cat.id,
  seed: cat.seed,
  attributes: cat.attributes,
  traits: cat.traits
});

// Save the SVG
import fs from 'fs';
fs.writeFileSync('my-cat.svg', cat.svgData);
```

## Cat Attributes

Each generated cat has the following attributes:

### Color
16 different colors ranging from common to mythical rarity:
- Common: Red, Teal, Blue, Green, Yellow, Plum
- Uncommon: Light Salmon, Sky Blue, Khaki, Light Pink
- Rare: Chocolate, Slate Gray, Black, White
- Legendary: Saddle Brown, Hot Pink

### Fur Pattern
16 different patterns:
- Common: solid, stripes, spots, tabby
- Uncommon: calico, tuxedo, tortoiseshell, bicolor
- Rare: colorpoint, mackerel, classic, ticked
- Legendary: rosette, marble, van
- Mythical: harlequin

### Eye Shape
16 different eye shapes:
- round, almond, oval, wide, narrow, upturned, downturned, sleepy, alert, mysterious, bright, gentle, fierce, curious, wise, playful

### Mouth
16 different mouth types:
- smile, frown, neutral, open, tongue, whiskers, small, wide, cute, serious, playful, surprised, sleepy, content, mischievous, grumpy

### Accessory
16 different accessories:
- none, bow-tie, collar, hat, glasses, scarf, flower, crown, monocle, earrings, necklace, cape, bowtie, ribbon

## API Reference

### CatGenerator

```typescript
class CatGenerator {
  constructor(options?: CatGeneratorOptions);
  
  generateCat(seed: string): GeneratedCat;
  generateCats(seeds: string[]): GeneratedCat[];
  generateRandomCat(): GeneratedCat;
}
```

### CatGeneratorOptions

```typescript
interface CatGeneratorOptions {
  width?: number;           // Canvas width (default: 400)
  height?: number;          // Canvas height (default: 400)
  format?: 'svg' | 'png' | 'base64';  // Output format (default: 'svg')
  customTraits?: Partial<CatTraits>;  // Custom trait definitions
}
```

### GeneratedCat

```typescript
interface GeneratedCat {
  id: string;                // Unique cat ID
  seed: string;             // Input seed
  attributes: CatAttributes; // Cat's attributes
  svgData: string;          // Rendered SVG data
  traits: Record<string, any>; // Trait rarity information
}
```

### CatAttributes

```typescript
interface CatAttributes {
  color: string;
  furPattern: string;
  eyeShape: string;
  mouth: string;
  accessory: string;
}
```

## Examples

### Generate Multiple Cats

```typescript
const seeds = ['seed1', 'seed2', 'seed3'];
const cats = generator.generateCats(seeds);

cats.forEach((cat, index) => {
  console.log(`Cat ${index + 1}:`, cat.attributes);
  fs.writeFileSync(`cat-${index + 1}.svg`, cat.svgData);
});
```

### Generate Random Cat

```typescript
const randomCat = generator.generateRandomCat();
console.log('Random cat seed:', randomCat.seed);
```

### Custom Traits

```typescript
const customGenerator = new CatGenerator({
  customTraits: {
    colors: ['#FF0000', '#00FF00', '#0000FF'], // Only RGB colors
    accessories: ['crown', 'glasses', 'hat']   // Only specific accessories
  }
});
```

### Check Trait Rarities

```typescript
const cat = generator.generateCat('rare-cat');
console.log('Trait rarities:', cat.traits);
// Output: { color: 'common', furPattern: 'rare', eyeShape: 'legendary', ... }
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the example
npm run dev

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Inspiration

This project is inspired by the original CryptoKitties NFT collection, one of the first successful blockchain-based games. While this library doesn't create actual NFTs, it captures the spirit of procedural generation and trait-based rarity systems that made CryptoKitties special.
