import { CatGenerator } from './cat-generator';
import * as fs from 'fs';

console.log('🐱 Testing All Neck Accessories');
console.log('================================');

const generator = new CatGenerator();

// List of all neck accessories
const neckAccessories = [
  'bow-tie',
  'bowtie', 
  'bandana',
  'scarf',
  'necklace',
  'bell',
  'ribbon'
];

// Generate a cat for each neck accessory
neckAccessories.forEach((accessory, index) => {
  const seed = `neck-accessory-${accessory}-${index}`;
  const cat = generator.generateCatWithAccessory(seed, accessory);
  
  console.log(`\n🎀 Testing ${accessory}:`);
  console.log(`   Seed: ${seed}`);
  console.log(`   Generated accessory: ${cat.attributes.accessory}`);
  console.log(`   Color: ${cat.attributes.color}`);
  console.log(`   Fur pattern: ${cat.attributes.furPattern}`);
  
  // Save the SVG
  const filename = `cat-neck-${accessory}.svg`;
  fs.writeFileSync(filename, cat.svgData);
  console.log(`   💾 Saved: ${filename}`);
});

console.log('\n✅ All neck accessories tested!');
console.log('📁 Check the generated SVG files to see each accessory.');
