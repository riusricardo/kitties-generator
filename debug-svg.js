import { CatGenerator } from './dist/index.esm.js';

console.log('🔍 Detailed SVG Analysis');
console.log('========================');

// Test responsive generation
const responsiveGenerator = new CatGenerator({ responsive: true });
const responsiveCat = responsiveGenerator.generateCat('debug-test');

// Show the opening tag only
const svgContent = responsiveCat.svgData;
const openingTagMatch = svgContent.match(/<svg[^>]*>/);
if (openingTagMatch) {
    console.log('\n📱 Responsive SVG opening tag:');
    console.log(openingTagMatch[0]);
    
    console.log('\n🔎 Analysis:');
    console.log('- Has width attribute:', openingTagMatch[0].includes('width='));
    console.log('- Has height attribute:', openingTagMatch[0].includes('height='));
    console.log('- Has viewBox attribute:', openingTagMatch[0].includes('viewBox='));
    console.log('- Has preserveAspectRatio:', openingTagMatch[0].includes('preserveAspectRatio='));
}

// Test default generation for comparison
const defaultGenerator = new CatGenerator({ responsive: false });
const defaultCat = defaultGenerator.generateCat('debug-test-2');

const defaultOpeningTagMatch = defaultCat.svgData.match(/<svg[^>]*>/);
if (defaultOpeningTagMatch) {
    console.log('\n📊 Default SVG opening tag:');
    console.log(defaultOpeningTagMatch[0]);
}
