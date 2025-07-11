import { CatGenerator } from './dist/index.esm.js';

console.log('🔬 Testing Responsive SVG Generation');
console.log('===================================');

// Test 1: Default (non-responsive)
const defaultGenerator = new CatGenerator();
const defaultCat = defaultGenerator.generateCat('test-default');
console.log('\n📊 Default Cat SVG (first 200 chars):');
console.log(defaultCat.svgData.substring(0, 200) + '...');
console.log('Contains width/height attributes:', defaultCat.svgData.includes('width=') && defaultCat.svgData.includes('height='));

// Test 2: Responsive enabled
const responsiveGenerator = new CatGenerator({ responsive: true });
const responsiveCat = responsiveGenerator.generateCat('test-responsive');
console.log('\n📱 Responsive Cat SVG (first 200 chars):');
console.log(responsiveCat.svgData.substring(0, 200) + '...');
console.log('Contains width/height attributes:', responsiveCat.svgData.includes('width=') && responsiveCat.svgData.includes('height='));
console.log('Contains viewBox:', responsiveCat.svgData.includes('viewBox='));
console.log('Contains preserveAspectRatio:', responsiveCat.svgData.includes('preserveAspectRatio='));

// Test 3: Using convenience method
const convenienceCat = responsiveGenerator.generateResponsiveCat('test-convenience');
console.log('\n🎯 Convenience Method Cat SVG (first 200 chars):');
console.log(convenienceCat.svgData.substring(0, 200) + '...');
console.log('Contains width/height attributes:', convenienceCat.svgData.includes('width=') && convenienceCat.svgData.includes('height='));

console.log('\n✅ Test complete!');
console.log('\nFor visual testing, open responsive-demo.html in a browser.');
