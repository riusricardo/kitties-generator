#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to read and process SVG files
function processSVGFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the inner SVG content (everything between <svg> tags)
  const svgMatch = content.match(/<svg[^>]*>(.*?)<\/svg>/s);
  if (!svgMatch) {
    console.warn(`Could not parse SVG content from ${filePath}`);
    return '';
  }
  
  const innerSVG = svgMatch[1];
  
  // Extract viewBox from the SVG tag
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  let viewBox = '0 0 24 24'; // default
  if (viewBoxMatch) {
    viewBox = viewBoxMatch[1];
  }
  
  // Sanitize the SVG content
  const sanitizedSVG = innerSVG
    .replace(/<sodipodi:namedview[^>]*>.*?<\/sodipodi:namedview>/gs, '')
    .replace(/<sodipodi:namedview[^>]*\/>/gs, '')
    .replace(/<metadata[^>]*>.*?<\/metadata>/gs, '')
    .replace(/\s+xmlns:sodipodi="[^"]*"/g, '')
    .replace(/\s+xmlns:inkscape="[^"]*"/g, '')
    .replace(/\s+sodipodi:[^=]*="[^"]*"/g, '')
    .replace(/\s+inkscape:[^=]*="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return {
    content: sanitizedSVG,
    viewBox: viewBox
  };
}

// Read all SVG files from assets directory
const assetsDir = path.join(__dirname, 'assets');
const outputFile = path.join(__dirname, 'src', 'data', 'embedded-assets.ts');

console.log('Processing SVG assets...');

const assets = {};
const files = fs.readdirSync(assetsDir).filter(file => file.endsWith('.svg'));

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  const assetName = path.basename(file, '.svg');
  const processed = processSVGFile(filePath);
  
  if (processed.content) {
    assets[assetName] = processed;
    console.log(`✓ Processed ${assetName}`);
  } else {
    console.log(`✗ Failed to process ${assetName}`);
  }
});

// Generate the TypeScript file
const tsContent = `// Auto-generated file - do not edit manually
// Generated from SVG assets in the assets/ directory

export interface EmbeddedAsset {
  content: string;
  viewBox: string;
}

export const EMBEDDED_ASSETS: Record<string, EmbeddedAsset> = {
${Object.entries(assets).map(([name, asset]) => 
  `  '${name}': {\n    content: \`${asset.content}\`,\n    viewBox: '${asset.viewBox}'\n  }`
).join(',\n')}
};

export function getAsset(name: string): EmbeddedAsset | null {
  return EMBEDDED_ASSETS[name] || null;
}

export function getAssetNames(): string[] {
  return Object.keys(EMBEDDED_ASSETS);
}
`;

// Ensure the directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the file
fs.writeFileSync(outputFile, tsContent);

console.log(`\n✅ Generated ${outputFile} with ${Object.keys(assets).length} assets`);
console.log('Available assets:', Object.keys(assets).join(', '));
