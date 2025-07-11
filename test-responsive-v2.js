import { CatGenerator } from './dist/index.esm.js';

console.log('🧪 Testing New Responsive System');
console.log('================================');

try {
  // Test responsive generation
  const responsiveGenerator = new CatGenerator({ responsive: true });
  const responsiveCat = responsiveGenerator.generateCat('test-responsive-v2');
  
  // Show just the opening SVG tag
  const svgMatch = responsiveCat.svgData.match(/<svg[^>]*>/);
  if (svgMatch) {
    console.log('\n📱 Responsive SVG opening tag:');
    console.log(svgMatch[0]);
    
    // Check if it contains the old 400 500 references
    const contains400500 = svgMatch[0].includes('400') || svgMatch[0].includes('500');
    console.log('\n✅ Contains 400/500 references:', contains400500);
    
    if (!contains400500) {
      console.log('🎉 SUCCESS: No fixed 400/500 dimensions found!');
    } else {
      console.log('❌ ISSUE: Still contains 400/500 references');
    }
  }
  
  // Test default for comparison
  const defaultGenerator = new CatGenerator({ responsive: false });
  const defaultCat = defaultGenerator.generateCat('test-default-v2');
  
  const defaultSvgMatch = defaultCat.svgData.match(/<svg[^>]*>/);
  if (defaultSvgMatch) {
    console.log('\n📊 Default SVG opening tag:');
    console.log(defaultSvgMatch[0]);
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
