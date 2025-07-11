const { CatGenerator } = require('./dist/index.umd.js');

console.log('Testing UMD Bundle');
console.log('==================');

try {
  // Test responsive
  const generator = new CatGenerator({ responsive: true });
  const cat = generator.generateCat('test-umd');
  
  const svgMatch = cat.svgData.match(/<svg[^>]*>/);
  if (svgMatch) {
    console.log('Responsive SVG tag:');
    console.log(svgMatch[0]);
    
    const hasOldDimensions = svgMatch[0].includes('400') || svgMatch[0].includes('500');
    console.log('Contains 400/500:', hasOldDimensions);
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
