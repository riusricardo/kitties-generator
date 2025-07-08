import { CatGenerator } from './index';
import * as fs from 'fs';

// Example usage of the CryptoKitty generator
function main() {
  console.log('🐱 CryptoKitty Generator Demo');
  console.log('=============================');

  // Create a new cat generator
  const generator = new CatGenerator({
    width: 400,
    height: 500,
    format: 'svg'
  });

  // Helper: list of valid neck/head accessories with external SVG assets
  const validAccessories = [
    'hat', 'crown', 'bow-tie', 'bowtie', '1st-place-medal', 'scarf', 
    'glasses', 'adhesive-bandage'
  ];

  // Generate a cat with a specific seed - guaranteed to have an accessory
  const seed = 'my-special-cat-seed';
  const cat = generator.generateCatWithAccessory(seed);

  console.log(`\n🎯 Generated Cat ID: ${cat.id}`);
  console.log(`🎲 Seed: ${cat.seed}`);
  console.log('\n📊 Cat Attributes:');
  console.log(`   Color: ${cat.attributes.color}`);
  console.log(`   Fur Pattern: ${cat.attributes.furPattern}`);
  console.log(`   Eye Shape: ${cat.attributes.eyeShape}`);
  console.log(`   Mouth: ${cat.attributes.mouth}`);
  console.log(`   Accessory: ${cat.attributes.accessory}`);

  console.log('\n🏆 Trait Rarities:');
  Object.entries(cat.traits).forEach(([trait, rarity]) => {
    console.log(`   ${trait}: ${Array.isArray(rarity) ? rarity.join(', ') : rarity}`);
  });

  // Save the SVG to a file
  const filename = `tmp/cat-${seed}.svg`;
  fs.writeFileSync(filename, cat.svgData);
  console.log(`\n💾 SVG saved to: ${filename}`);

  // Generate multiple cats with different seeds
  console.log('\n🔄 Generating multiple cats...');
  const seeds = ['34w5sdg', 'seed22', 'wtre', 'hello-744', 'crypto-45', '345', '43653fds'];
  const cats = seeds.map((seed) => {
    let c = generator.generateCat(seed);
    let tries = 0;
    while (!validAccessories.includes(c.attributes.accessory) && tries < 10) {
      c = generator.generateCat(seed + '-' + tries);
      tries++;
    }
    return c;
  });

  cats.forEach((cat, index) => {
    console.log(`\nCat ${index + 1}:`);
    console.log(`  Color: ${cat.attributes.color}`);
    console.log(`  Pattern: ${cat.attributes.furPattern}`);
    console.log(`  Eyes: ${cat.attributes.eyeShape}`);
    
    // Save each cat
    const catFilename = `tmp/cat-${cat.seed}.svg`;
    fs.writeFileSync(catFilename, cat.svgData);
  });

  // Generate a random cat
  console.log('\n🎲 Generating random cat...');
  let randomCat = generator.generateRandomCat();
  let randTries = 0;
  while (!validAccessories.includes(randomCat.attributes.accessory) && randTries < 10) {
    randomCat = generator.generateRandomCat();
    randTries++;
  }
  console.log(`Random cat seed: ${randomCat.seed}`);
  console.log(`Color: ${randomCat.attributes.color}`);
  console.log(`Pattern: ${randomCat.attributes.furPattern}`);
  
  fs.writeFileSync(`tmp/cat-random-${randomCat.seed}.svg`, randomCat.svgData);

  console.log('\n✅ Demo complete! Check the generated SVG files.');
}

// Run the demo
if (require.main === module) {
  main();
}

export { main };
