import { CatGenerator } from './index';
import * as fs from 'fs';

// Example usage of the CryptoKitty generator
function main() {
  console.log('🐱 CryptoKitty Generator Demo');
  console.log('=============================');

  // Create a new cat generator
  const generator = new CatGenerator({
    width: 400,
    height: 400,
    format: 'svg'
  });

  // Generate a cat with a specific seed
  const seed = 'my-special-cat-seed';
  const cat = generator.generateCat(seed);

  console.log(`\n🎯 Generated Cat ID: ${cat.id}`);
  console.log(`🎲 Seed: ${cat.seed}`);
  console.log('\n📊 Cat Attributes:');
  console.log(`   Color: ${cat.attributes.color}`);
  console.log(`   Fur Pattern: ${cat.attributes.furPattern}`);
  console.log(`   Eye Shape: ${cat.attributes.eyeShape}`);
  console.log(`   Mouth: ${cat.attributes.mouth}`);
  console.log(`   Accessory: ${cat.attributes.accessory}`);
  console.log(`   Mutations: ${cat.attributes.mutationFlags.join(', ') || 'None'}`);

  console.log('\n🏆 Trait Rarities:');
  Object.entries(cat.traits).forEach(([trait, rarity]) => {
    console.log(`   ${trait}: ${Array.isArray(rarity) ? rarity.join(', ') : rarity}`);
  });

  // Save the SVG to a file
  const filename = `cat-${seed}.svg`;
  fs.writeFileSync(filename, cat.svgData);
  console.log(`\n💾 SVG saved to: ${filename}`);

  // Generate multiple cats with different seeds
  console.log('\n🔄 Generating multiple cats...');
  const seeds = ['seed1', 'seed22', 'seed33', 'hello-world', 'crypto-kitty1'];
  const cats = generator.generateCats(seeds);

  cats.forEach((cat, index) => {
    console.log(`\nCat ${index + 1}:`);
    console.log(`  Color: ${cat.attributes.color}`);
    console.log(`  Pattern: ${cat.attributes.furPattern}`);
    console.log(`  Eyes: ${cat.attributes.eyeShape}`);
    console.log(`  Mutations: ${cat.attributes.mutationFlags.join(', ') || 'None'}`);
    
    // Save each cat
    const catFilename = `cat-${cat.seed}.svg`;
    fs.writeFileSync(catFilename, cat.svgData);
  });

  // Generate a random cat
  console.log('\n🎲 Generating random cat...');
  const randomCat = generator.generateRandomCat();
  console.log(`Random cat seed: ${randomCat.seed}`);
  console.log(`Color: ${randomCat.attributes.color}`);
  console.log(`Pattern: ${randomCat.attributes.furPattern}`);
  
  fs.writeFileSync(`cat-random-${randomCat.seed}.svg`, randomCat.svgData);

  console.log('\n✅ Demo complete! Check the generated SVG files.');
}

// Run the demo
if (require.main === module) {
  main();
}

export { main };
