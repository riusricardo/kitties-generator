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
    // c3lysuk0ie5 -> medal
    // 43653fd334fdgs -> bowtie
    // crypto-45 -> crown
    // seed11 -> gllasses
    // Generate multiple cats with different seeds
    console.log('\n🔄 Generating multiple cats...');
    const seeds = ['seed11', 'seed22', 'seed33', 'c3lysuk0ie5', 'crypto-45', '345345', '43653fd334fdgs'];
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
        console.log(`\n🎯 Generated Cat ID: ${cat.id}`);
        console.log(`🎲 Seed: ${cat.seed}`);
        console.log('\n📊 Cat Attributes:');
        console.log(`   Color: ${cat.attributes.color}`);
        console.log(`   Fur Pattern: ${cat.attributes.furPattern}`);
        console.log(`   Eye Shape: ${cat.attributes.eyeShape}`);
        console.log(`   Mouth: ${cat.attributes.mouth}`);
        console.log(`   Accessory: ${cat.attributes.accessory}`);
        // Save each cat
        const catFilename = `tmp/cat-${cat.seed}.svg`;
        fs.writeFileSync(catFilename, cat.svgData);
    });
    // Generate 10 random cats with valid accessories
    for (let i = 0; i < 10; i++) {
        let randomCat = generator.generateRandomCat();
        let randTries = 0;
        while (!validAccessories.includes(randomCat.attributes.accessory) && randTries < 10) {
            randomCat = generator.generateRandomCat();
            randTries++;
        }
        console.log('\n🎲 Generating random cat...');
        console.log(`🎲 Seed: ${randomCat.seed}`);
        console.log('\n📊 Cat Attributes:');
        console.log(`   Color: ${randomCat.attributes.color}`);
        console.log(`   Fur Pattern: ${randomCat.attributes.furPattern}`);
        console.log(`   Eye Shape: ${randomCat.attributes.eyeShape}`);
        console.log(`   Mouth: ${randomCat.attributes.mouth}`);
        console.log(`   Accessory: ${randomCat.attributes.accessory}`);
        fs.writeFileSync(`tmp/cat-random-${randomCat.seed}.svg`, randomCat.svgData);
    }
    console.log('\n✅ Demo complete! Check the generated SVG files.');
}
// Run the demo
if (require.main === module) {
    main();
}
export { main };
//# sourceMappingURL=example.js.map