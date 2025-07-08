import { SeededRandom } from '../utils/random';
import * as fs from 'fs';
import * as path from 'path';

export class SVGBuilder {
  private elements: string[] = [];
  private defs: string[] = [];
  private width: number;
  private height: number;
  private random: SeededRandom;
  private gradientCounter: number = 0;

  constructor(width: number, height: number, random: SeededRandom) {
    this.width = width;
    this.height = height;
    this.random = random;
  }

  addElement(element: string): void {
    this.elements.push(element);
  }

  circle(cx: number, cy: number, r: number, fill: string, stroke?: string, strokeWidth?: number): void {
    const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth || 1}"` : '';
    this.addElement(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${strokeAttr} />`);
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, fill: string, stroke?: string, strokeWidth?: number): void {
    const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth || 1}"` : '';
    this.addElement(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${strokeAttr} />`);
  }

  path(d: string, fill: string, stroke?: string, strokeWidth?: number): void {
    const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth || 1}"` : '';
    this.addElement(`<path d="${d}" fill="${fill}" ${strokeAttr} />`);
  }

  polygon(points: string, fill: string, stroke?: string, strokeWidth?: number): void {
    const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth || 1}"` : '';
    this.addElement(`<polygon points="${points}" fill="${fill}" ${strokeAttr} />`);
  }

  rect(x: number, y: number, width: number, height: number, fill: string, stroke?: string, strokeWidth?: number): void {
    const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth || 1}"` : '';
    this.addElement(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" ${strokeAttr} />`);
  }

  text(x: number, y: number, text: string, fontSize: number, fill: string, fontFamily?: string): void {
    const font = fontFamily || 'Arial';
    this.addElement(`<text x="${x}" y="${y}" font-family="${font}" font-size="${fontSize}" fill="${fill}">${text}</text>`);
  }

  group(elements: string[], transform?: string): void {
    const transformAttr = transform ? `transform="${transform}"` : '';
    this.addElement(`<g ${transformAttr}>${elements.join('')}</g>`);
  }

  build(): string {
    const defsSection = this.defs.length > 0 ? `<defs>${this.defs.join('')}</defs>` : '';
    return `<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
      ${defsSection}
      ${this.elements.join('\n')}
    </svg>`;
  }

  addGradient(color1: string, color2: string): string {
    const gradientId = `gradient${this.gradientCounter++}`;
    this.defs.push(`
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    `);
    return gradientId;
  }

  addRadialGradient(color1: string, color2: string): string {
    const gradientId = `radialGradient${this.gradientCounter++}`;
    this.defs.push(`
      <radialGradient id="${gradientId}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </radialGradient>
    `);
    return gradientId;
  }

  /**
   * Load and embed an external SVG asset
   */
  embedSVGAsset(assetPath: string, x: number, y: number, size: number, scale: number = 1): void {
    try {
      const fullPath = path.resolve(process.cwd(), assetPath);
      const svgContent = fs.readFileSync(fullPath, 'utf-8');
      
      // Extract the content between <svg> tags, excluding the opening and closing svg tags
      const svgMatch = svgContent.match(/<svg[^>]*>(.*?)<\/svg>/s);
      if (!svgMatch) {
        console.warn(`Could not parse SVG content from ${assetPath}`);
        return;
      }
      
      const innerSVG = svgMatch[1];
      
      // Calculate proper transform for positioning and scaling
      // Most SVG assets are around 512-1024px, we want them to be around 50-100px
      const baseScale = (size * scale) / 1024; // Assuming source SVG is ~1024px
      const offsetX = x - (512 * baseScale); // Center horizontally
      const offsetY = y - (512 * baseScale); // Center vertically
      
      const transform = `translate(${offsetX}, ${offsetY}) scale(${baseScale})`;
      
      // Wrap the SVG content in a group with the transform
      this.addElement(`<g transform="${transform}">${innerSVG}</g>`);
      
    } catch (error) {
      console.warn(`Could not load SVG asset from ${assetPath}:`, error);
    }
  }

  // Helper methods for common cat shapes
  drawCatHead(x: number, y: number, size: number, color: string): void {
    // Add gradient definition for more depth
    const gradientId = this.addGradient(color, this.darkenColor(color, 15));
    
    // Main head shape - more rounded and compact like the reference
    this.ellipse(x, y, size * 0.95, size * 0.95, `url(#${gradientId})`, this.darkenColor(color, 30), 2);
    
    // Cat ears - properly positioned triangular ears
    const earWidth = size * 0.35;
    const earHeight = size * 0.45;
    const earOffset = size * 0.55; // Distance from center to ear base
    
    // Calculate ear base points that touch the head circle
    const leftEarBaseX = x - earOffset;
    const rightEarBaseX = x + earOffset;
    const earBaseY = y - size * 0.65; // Position on the head circle
    
    // Left ear - triangle pointing up and slightly outward
    this.path(`M ${leftEarBaseX - earWidth/2} ${earBaseY} 
               L ${leftEarBaseX - earWidth * 0.1} ${earBaseY - earHeight} 
               L ${leftEarBaseX + earWidth/2} ${earBaseY} 
               Z`, 
               `url(#${gradientId})`, this.darkenColor(color, 30), 2);
    
    // Right ear - triangle pointing up and slightly outward
    this.path(`M ${rightEarBaseX - earWidth/2} ${earBaseY} 
               L ${rightEarBaseX + earWidth * 0.1} ${earBaseY - earHeight} 
               L ${rightEarBaseX + earWidth/2} ${earBaseY} 
               Z`, 
               `url(#${gradientId})`, this.darkenColor(color, 30), 2);
    
    // Inner ears - smaller pink triangles with same diagonal tilt
    const innerEarWidth = earWidth * 0.5;
    const innerEarHeight = earHeight * 0.6;
    
    this.path(`M ${leftEarBaseX - innerEarWidth/2} ${earBaseY - innerEarHeight * 0.2} 
               L ${leftEarBaseX - innerEarWidth * 0.1} ${earBaseY - innerEarHeight} 
               L ${leftEarBaseX + innerEarWidth/2} ${earBaseY - innerEarHeight * 0.2} 
               Z`, 
               '#FFB6C1');
    
    this.path(`M ${rightEarBaseX - innerEarWidth/2} ${earBaseY - innerEarHeight * 0.2} 
               L ${rightEarBaseX + innerEarWidth * 0.1} ${earBaseY - innerEarHeight} 
               L ${rightEarBaseX + innerEarWidth/2} ${earBaseY - innerEarHeight * 0.2} 
               Z`, 
               '#FFB6C1');
  }

  drawCatEyes(x: number, y: number, eyeShape: string, size: number): void {
    const eyeY = y - size * 0.1; // Slightly lower position
    const eyeDistance = size * 0.32;
    const eyeSize = size * 0.22; // Larger eyes like the reference

    // Eye whites - larger and more expressive
    this.ellipse(x - eyeDistance, eyeY, eyeSize * 1.4, eyeSize * 1.6, '#FFFFFF', this.darkenColor('#FFFFFF', 10), 1);
    this.ellipse(x + eyeDistance, eyeY, eyeSize * 1.4, eyeSize * 1.6, '#FFFFFF', this.darkenColor('#FFFFFF', 10), 1);

    // Eye pupils based on shape - larger for more kawaii look
    switch (eyeShape) {
      case 'round':
        this.circle(x - eyeDistance, eyeY, eyeSize * 0.8, '#000');
        this.circle(x + eyeDistance, eyeY, eyeSize * 0.8, '#000');
        break;
      case 'almond':
        this.ellipse(x - eyeDistance, eyeY, eyeSize * 0.9, eyeSize * 0.7, '#000');
        this.ellipse(x + eyeDistance, eyeY, eyeSize * 0.9, eyeSize * 0.7, '#000');
        break;
      case 'wide':
        this.ellipse(x - eyeDistance, eyeY, eyeSize * 1.1, eyeSize * 0.9, '#000');
        this.ellipse(x + eyeDistance, eyeY, eyeSize * 1.1, eyeSize * 0.9, '#000');
        break;
      case 'sleepy':
        this.path(`M ${x - eyeDistance - eyeSize} ${eyeY} 
                   Q ${x - eyeDistance} ${eyeY - eyeSize * 0.3} 
                   ${x - eyeDistance + eyeSize} ${eyeY}`, 
                   'none', '#000', 3);
        this.path(`M ${x + eyeDistance - eyeSize} ${eyeY} 
                   Q ${x + eyeDistance} ${eyeY - eyeSize * 0.3} 
                   ${x + eyeDistance + eyeSize} ${eyeY}`, 
                   'none', '#000', 3);
        break;
      default:
        this.ellipse(x - eyeDistance, eyeY, eyeSize * 0.7, eyeSize * 0.9, '#000');
        this.ellipse(x + eyeDistance, eyeY, eyeSize * 0.7, eyeSize * 0.9, '#000');
    }

    // Add eye highlights - multiple for more life
    if (eyeShape !== 'sleepy') {
      this.circle(x - eyeDistance + eyeSize * 0.2, eyeY - eyeSize * 0.3, eyeSize * 0.3, '#FFFFFF');
      this.circle(x + eyeDistance + eyeSize * 0.2, eyeY - eyeSize * 0.3, eyeSize * 0.3, '#FFFFFF');
      this.circle(x - eyeDistance + eyeSize * 0.4, eyeY - eyeSize * 0.1, eyeSize * 0.12, '#FFFFFF');
      this.circle(x + eyeDistance + eyeSize * 0.4, eyeY - eyeSize * 0.1, eyeSize * 0.12, '#FFFFFF');
    }
  }

  drawCatMouth(x: number, y: number, mouthType: string, size: number): void {
    const mouthY = y + size * 0.5; // Move mouth much lower for better spacing from eyes
    const mouthSize = size * 0.25;

    // Add cute nose first - moved much lower for better spacing from eyes
    this.ellipse(x, y + size * 0.35, size * 0.06, size * 0.05, '#FFB6C1');
    
    // Add nose line - also moved lower
    this.path(`M ${x} ${y + size * 0.4} L ${x} ${y + size * 0.48}`, 'none', this.darkenColor('#FFB6C1', 40), 2);

    switch (mouthType) {
      case 'smile':
        this.path(`M ${x - mouthSize} ${mouthY} 
                   Q ${x} ${mouthY + mouthSize * 0.6} 
                   ${x + mouthSize} ${mouthY}`, 
                  'none', '#000', 3);
        break;
      case 'frown':
        this.path(`M ${x - mouthSize} ${mouthY + mouthSize * 0.4} 
                   Q ${x} ${mouthY - mouthSize * 0.2} 
                   ${x + mouthSize} ${mouthY + mouthSize * 0.4}`, 
                  'none', '#000', 3);
        break;
      case 'open':
        this.ellipse(x, mouthY + mouthSize * 0.3, mouthSize * 0.4, mouthSize * 0.3, '#000');
        // Add little teeth
        this.rect(x - mouthSize * 0.1, mouthY + mouthSize * 0.15, mouthSize * 0.05, mouthSize * 0.1, '#FFFFFF');
        this.rect(x + mouthSize * 0.05, mouthY + mouthSize * 0.15, mouthSize * 0.05, mouthSize * 0.1, '#FFFFFF');
        break;
      case 'tongue':
        this.ellipse(x, mouthY + mouthSize * 0.1, mouthSize * 0.3, mouthSize * 0.15, '#000');
        this.ellipse(x, mouthY + mouthSize * 0.4, mouthSize * 0.25, mouthSize * 0.45, '#FF69B4');
        break;
      case 'cute':
        // Small 'w' shape mouth
        this.path(`M ${x - mouthSize * 0.3} ${mouthY} 
                   Q ${x - mouthSize * 0.1} ${mouthY + mouthSize * 0.2} 
                   ${x} ${mouthY}
                   Q ${x + mouthSize * 0.1} ${mouthY + mouthSize * 0.2} 
                   ${x + mouthSize * 0.3} ${mouthY}`, 
                  'none', '#000', 2);
        break;
      default:
        this.ellipse(x, mouthY, mouthSize * 0.15, mouthSize * 0.08, '#000');
    }
  }

  drawFurPattern(x: number, y: number, size: number, pattern: string, baseColor: string): void {
    switch (pattern) {
      case 'stripes':
        this.drawStripes(x, y, size, baseColor);
        break;
      case 'spots':
        this.drawSpots(x, y, size, baseColor);
        break;
      case 'calico':
        this.drawCalico(x, y, size, baseColor);
        break;
      case 'tuxedo':
        this.drawTuxedo(x, y, size, baseColor);
        break;
      // Add more patterns as needed
    }
  }

  private drawStripes(x: number, y: number, size: number, baseColor: string): void {
    const stripeColor = this.darkenColor(baseColor, 30);
    
    // Draw curved stripes that follow the cat's body contour
    const stripeCount = 4;
    
    for (let i = 0; i < stripeCount; i++) {
      const stripeY = y - size * 0.6 + (i * size * 0.3);
      const stripeWidth = size * 0.6 + (i * size * 0.1); // Varying width
      
      // Draw curved stripe using path instead of rectangle
      this.path(`M ${x - stripeWidth * 0.5} ${stripeY} 
                 Q ${x} ${stripeY - size * 0.05} 
                 ${x + stripeWidth * 0.5} ${stripeY}`, 
                'none', stripeColor, size * 0.08);
    }
  }

  private drawSpots(x: number, y: number, size: number, baseColor: string): void {
    const spotColor = this.darkenColor(baseColor, 30);
    const spotCount = this.random.randomInt(3, 8);
    
    for (let i = 0; i < spotCount; i++) {
      const spotX = x + this.random.randomFloat(-size * 0.6, size * 0.6);
      const spotY = y + this.random.randomFloat(-size * 0.6, size * 0.6);
      const spotSize = this.random.randomFloat(size * 0.1, size * 0.2);
      this.circle(spotX, spotY, spotSize, spotColor);
    }
  }

  private drawCalico(x: number, y: number, size: number, baseColor: string): void {
    // Add orange and black patches
    this.circle(x - size * 0.3, y - size * 0.2, size * 0.3, '#FF6B35');
    this.circle(x + size * 0.4, y + size * 0.1, size * 0.25, '#2C3E50');
    this.circle(x - size * 0.1, y + size * 0.3, size * 0.2, '#FF6B35');
  }

  private drawTuxedo(x: number, y: number, size: number, baseColor: string): void {
    // White chest/belly area
    this.ellipse(x, y + size * 0.2, size * 0.4, size * 0.6, '#FFFFFF');
    // White paws
    this.circle(x - size * 0.6, y + size * 0.8, size * 0.15, '#FFFFFF');
    this.circle(x + size * 0.6, y + size * 0.8, size * 0.15, '#FFFFFF');
  }

  // Draw whiskers with more realistic curves
  drawWhiskers(x: number, y: number, size: number): void {
    const whiskerLength = size * 0.5; // Longer whiskers
    const whiskerY = y + size * 0.5; // Move whiskers much lower to align with mouth area
    
    // Left whiskers - starting more to the side and extending further outward
    this.path(`M ${x - size * 0.5} ${whiskerY - size * 0.05} 
               Q ${x - size * 0.8} ${whiskerY - size * 0.1} 
               ${x - size * 1.0} ${whiskerY - size * 0.08}`, 
               'none', '#000', 2);
    this.path(`M ${x - size * 0.5} ${whiskerY} 
               Q ${x - size * 0.8} ${whiskerY - size * 0.02} 
               ${x - size * 1.0} ${whiskerY}`, 
               'none', '#000', 2);
    this.path(`M ${x - size * 0.5} ${whiskerY + size * 0.05} 
               Q ${x - size * 0.8} ${whiskerY + size * 0.1} 
               ${x - size * 1.0} ${whiskerY + size * 0.08}`, 
               'none', '#000', 2);
    
    // Right whiskers - starting more to the side and extending further outward
    this.path(`M ${x + size * 0.5} ${whiskerY - size * 0.05} 
               Q ${x + size * 0.8} ${whiskerY - size * 0.1} 
               ${x + size * 1.0} ${whiskerY - size * 0.08}`, 
               'none', '#000', 2);
    this.path(`M ${x + size * 0.5} ${whiskerY} 
               Q ${x + size * 0.8} ${whiskerY - size * 0.02} 
               ${x + size * 1.0} ${whiskerY}`, 
               'none', '#000', 2);
    this.path(`M ${x + size * 0.5} ${whiskerY + size * 0.05} 
               Q ${x + size * 0.8} ${whiskerY + size * 0.1} 
               ${x + size * 1.0} ${whiskerY + size * 0.08}`, 
               'none', '#000', 2);
  }

  // Draw cute cheek blush
  drawCheekBlush(x: number, y: number, size: number): void {
    // Make blush more prominent and positioned lower for better spacing
    const cheekSize = size * 0.16;
    const cheekOffset = size * 0.45;
    const cheekY = y + size * 0.5; // Move to same level as whiskers
    
    // Use a slightly more vibrant pink for better visibility
    const blushColor = '#FFB6C1';
    const blushOpacity = 0.8;
    
    this.ellipse(x - cheekOffset, cheekY, cheekSize, cheekSize * 0.7, blushColor, 'none', 0);
    this.ellipse(x + cheekOffset, cheekY, cheekSize, cheekSize * 0.7, blushColor, 'none', 0);
  }

  // Draw modern cat body with better proportions
  drawCatBody(x: number, y: number, size: number, color: string): void {
    const gradientId = this.addRadialGradient(color, this.darkenColor(color, 20));
    
    // Main body - more elongated and cat-like
    this.ellipse(x, y + size * 0.8, size * 0.7, size * 0.9, `url(#${gradientId})`, this.darkenColor(color, 30), 2);
    
    // Chest area - lighter
    this.ellipse(x, y + size * 0.6, size * 0.5, size * 0.4, this.lightenColor(color, 10));
    
    // Note: Legs are now drawn separately at the end of rendering
  }

  public drawCatLegs(x: number, y: number, size: number, color: string): void {
    const legSize = size * 0.15;
    const innerEarColor = '#FFB6C1'; // Same as inner ear color
    
    // Front legs/hands positioned in the middle of the body
    const frontLegY = y + size * 0.8; // Middle of the body
    const frontLeftX = x - size * 0.4;
    const frontRightX = x + size * 0.4;
    
    // Bottom legs (hind legs) at the bottom
    const bottomLegY = y + size * 1.5; // Bottom position
    const bottomLeftX = x - size * 0.25;
    const bottomRightX = x + size * 0.25;
    
    // Draw front legs/hands in the middle of the body
    this.circle(frontLeftX, frontLegY, legSize, color, this.darkenColor(color, 20), 2);
    this.circle(frontRightX, frontLegY, legSize, color, this.darkenColor(color, 20), 2);
    
    // Draw bottom legs (hind legs)
    this.circle(bottomLeftX, bottomLegY, legSize, color, this.darkenColor(color, 20), 2);
    this.circle(bottomRightX, bottomLegY, legSize, color, this.darkenColor(color, 20), 2);
    
    // Draw footprints (paw pads) on each leg
    const pawSize = legSize * 0.4;
    
    // Front paws (hands)
    this.drawPawPrint(frontLeftX, frontLegY, pawSize, innerEarColor);
    this.drawPawPrint(frontRightX, frontLegY, pawSize, innerEarColor);
    
    // Bottom paws (feet)
    this.drawPawPrint(bottomLeftX, bottomLegY, pawSize, innerEarColor);
    this.drawPawPrint(bottomRightX, bottomLegY, pawSize, innerEarColor);
  }

  private drawPawPrint(x: number, y: number, size: number, color: string): void {
    // Main paw pad (larger ellipse) - 2x bigger, filling most of the leg circle
    this.ellipse(x, y + size * 0.1, size * 1.8, size * 1.4, color);
    
    // Toe pads - 2x larger ellipses positioned around the main pad
    this.ellipse(x - size * 0.7, y - size * 0.4, size * 0.8, size * 1.0, color);
    this.ellipse(x, y - size * 0.7, size * 0.8, size * 1.0, color);
    this.ellipse(x + size * 0.7, y - size * 0.4, size * 0.8, size * 1.0, color);
  }

  // Enhanced accessory drawing
  drawAccessory(x: number, y: number, size: number, accessoryType: string): void {
    switch (accessoryType) {
      case 'bow-tie':
      case 'bowtie':
        this.drawBowTie(x, y, size);
        break;
      case 'hat':
      case 'party-hat':
        this.drawHat(x, y, size);
        break;
      case 'glasses':
      case 'sunglasses':
        this.drawGlasses(x, y, size);
        break;
      case 'flower':
        this.drawFlower(x, y, size);
        break;
      case 'crown':
      case 'tiara':
        this.drawCrown(x, y, size);
        break;
      case 'bandana':
        this.drawBandana(x, y, size);
        break;
      case 'scarf':
        this.drawScarf(x, y, size);
        break;
      case 'necklace':
        this.drawNecklace(x, y, size);
        break;
      case 'bell':
        this.drawBell(x, y, size);
        break;
      case 'ribbon':
        this.drawRibbon(x, y, size);
        break;
    }
  }

  private drawBowTie(x: number, y: number, size: number): void {
    // Use external SVG asset for bow-tie
    const bowY = y + size * 0.8; // Position on the neck/chest area
    const bowScale = 2.0; // Larger scale for better visibility
    
    this.embedSVGAsset('assets/bow-tie-svgrepo-com.svg', x, bowY, size * 0.4, bowScale);
    
    // Option 2: Keep the manual drawing as fallback (commented out)
    /*
    const bowSize = size * 0.18;
    
    // Bow tie left wing - more angular and realistic shape
    this.path(`M ${x - bowSize * 0.2} ${bowY - bowSize * 0.4} 
               L ${x - bowSize * 1.2} ${bowY - bowSize * 0.6}
               L ${x - bowSize * 1.4} ${bowY}
               L ${x - bowSize * 1.2} ${bowY + bowSize * 0.6}
               L ${x - bowSize * 0.2} ${bowY + bowSize * 0.4}
               Z`, '#C60024');
    
    // Bow tie right wing - more angular and realistic shape
    this.path(`M ${x + bowSize * 0.2} ${bowY - bowSize * 0.4} 
               L ${x + bowSize * 1.2} ${bowY - bowSize * 0.6}
               L ${x + bowSize * 1.4} ${bowY}
               L ${x + bowSize * 1.2} ${bowY + bowSize * 0.6}
               L ${x + bowSize * 0.2} ${bowY + bowSize * 0.4}
               Z`, '#C60024');
    
    // Center knot - rectangular shape like in the reference
    this.rect(x - bowSize * 0.25, bowY - bowSize * 0.5, bowSize * 0.5, bowSize, '#A50020');
    
    // Add shadow/depth to the wings
    this.path(`M ${x - bowSize * 0.2} ${bowY - bowSize * 0.4} 
               L ${x - bowSize * 1.2} ${bowY - bowSize * 0.6}
               L ${x - bowSize * 1.4} ${bowY}
               L ${x - bowSize * 1.2} ${bowY + bowSize * 0.6}
               L ${x - bowSize * 0.2} ${bowY + bowSize * 0.4}
               Z`, '#A50020', 'none', 0);
    
    this.path(`M ${x + bowSize * 0.2} ${bowY - bowSize * 0.4} 
               L ${x + bowSize * 1.2} ${bowY - bowSize * 0.6}
               L ${x + bowSize * 1.4} ${bowY}
               L ${x + bowSize * 1.2} ${bowY + bowSize * 0.6}
               L ${x + bowSize * 0.2} ${bowY + bowSize * 0.4}
               Z`, '#A50020', 'none', 0);
    */
  }

  private drawHat(x: number, y: number, size: number): void {
    // Use the external SVG asset for the hat
    const hatY = y - size * 0.4; // Position above the head, not too high
    const hatScale = 1.5; // Slightly larger scale to be more visible
    
    this.embedSVGAsset('assets/hat-svgrepo-com.svg', x, hatY, size * 0.8, hatScale);
  }

  private drawGlasses(x: number, y: number, size: number): void {
    const glassesY = y - size * 0.1;
    const lensSize = size * 0.18;
    const lensOffset = size * 0.3;
    
    // Lens frames
    this.circle(x - lensOffset, glassesY, lensSize, 'none', '#000', 3);
    this.circle(x + lensOffset, glassesY, lensSize, 'none', '#000', 3);
    
    // Lens reflections
    this.circle(x - lensOffset, glassesY, lensSize * 0.8, 'rgba(255,255,255,0.3)');
    this.circle(x + lensOffset, glassesY, lensSize * 0.8, 'rgba(255,255,255,0.3)');
    
    // Bridge
    this.path(`M ${x - lensSize * 0.5} ${glassesY} 
               L ${x + lensSize * 0.5} ${glassesY}`, 'none', '#000', 3);
  }

  private drawFlower(x: number, y: number, size: number): void {
    const flowerX = x + size * 0.3; // Closer to neck
    const flowerY = y + size * 0.8; // Position as neck accessory, consistent with bow-tie
    const petalSize = size * 0.08;
    
    // Flower petals
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const petalX = flowerX + Math.cos(angle) * petalSize;
      const petalY = flowerY + Math.sin(angle) * petalSize;
      this.circle(petalX, petalY, petalSize * 0.7, '#FF69B4');
    }
    
    // Flower center
    this.circle(flowerX, flowerY, petalSize * 0.4, '#FFD700');
  }

  private drawCrown(x: number, y: number, size: number): void {
    const crownY = y - size * 0.7;
    const crownWidth = size * 0.8;
    
    // Crown base
    this.ellipse(x, crownY + size * 0.15, crownWidth, size * 0.1, '#FFD700', this.darkenColor('#FFD700', 20), 2);
    
    // Crown points
    for (let i = 0; i < 5; i++) {
      const pointX = x + (i - 2) * crownWidth * 0.2;
      const pointHeight = size * 0.2 + (i % 2 === 0 ? size * 0.1 : 0);
      this.path(`M ${pointX - size * 0.08} ${crownY + size * 0.15} 
                 L ${pointX} ${crownY - pointHeight} 
                 L ${pointX + size * 0.08} ${crownY + size * 0.15} 
                 Z`, '#FFD700');
    }
    
    // Crown gems
    this.circle(x, crownY, size * 0.05, '#FF0000');
    this.circle(x - crownWidth * 0.2, crownY + size * 0.05, size * 0.03, '#0000FF');
    this.circle(x + crownWidth * 0.2, crownY + size * 0.05, size * 0.03, '#0000FF');
  }

  private drawBandana(x: number, y: number, size: number): void {
    const bandanaY = y + size * 0.8;
    const bandanaWidth = size * 0.6;
    
    // Bandana triangle
    this.path(`M ${x - bandanaWidth * 0.5} ${bandanaY} 
               L ${x + bandanaWidth * 0.5} ${bandanaY}
               L ${x} ${bandanaY + size * 0.3}
               Z`, '#DC143C');
    
    // Bandana pattern (simple dots)
    this.circle(x - size * 0.1, bandanaY + size * 0.1, size * 0.02, '#FFF');
    this.circle(x + size * 0.1, bandanaY + size * 0.1, size * 0.02, '#FFF');
    this.circle(x, bandanaY + size * 0.2, size * 0.02, '#FFF');
  }

  private drawScarf(x: number, y: number, size: number): void {
    const scarfY = y + size * 0.8;
    const scarfWidth = size * 0.4;
    
    // Scarf band
    this.ellipse(x, scarfY, scarfWidth, size * 0.08, '#FF6B6B');
    
    // Scarf ends
    this.ellipse(x - scarfWidth * 0.3, scarfY + size * 0.15, size * 0.06, size * 0.2, '#FF6B6B');
    this.ellipse(x + scarfWidth * 0.3, scarfY + size * 0.15, size * 0.06, size * 0.2, '#FF6B6B');
    
    // Scarf stripes
    this.ellipse(x, scarfY, scarfWidth, size * 0.02, '#FFF');
  }

  private drawNecklace(x: number, y: number, size: number): void {
    const necklaceY = y + size * 0.8;
    const necklaceRadius = size * 0.25;
    
    // Necklace chain (simple ellipse)
    this.ellipse(x, necklaceY, necklaceRadius, size * 0.05, '#FFD700', '#DAA520', 1);
    
    // Pendant
    this.circle(x, necklaceY + size * 0.1, size * 0.06, '#FF1493');
    this.circle(x, necklaceY + size * 0.1, size * 0.03, '#FFF');
  }

  private drawBell(x: number, y: number, size: number): void {
    const bellY = y + size * 0.8;
    
    // Bell collar
    this.ellipse(x, bellY, size * 0.3, size * 0.05, '#8B4513');
    
    // Bell
    this.ellipse(x, bellY + size * 0.1, size * 0.08, size * 0.08, '#FFD700');
    this.ellipse(x, bellY + size * 0.1, size * 0.06, size * 0.06, '#FFF');
    
    // Bell highlight
    this.circle(x - size * 0.02, bellY + size * 0.08, size * 0.02, '#FFF');
  }

  private drawRibbon(x: number, y: number, size: number): void {
    const ribbonY = y + size * 0.8;
    const ribbonWidth = size * 0.2;
    
    // Ribbon bow
    this.ellipse(x - ribbonWidth * 0.5, ribbonY, ribbonWidth * 0.4, ribbonWidth * 0.8, '#FF69B4');
    this.ellipse(x + ribbonWidth * 0.5, ribbonY, ribbonWidth * 0.4, ribbonWidth * 0.8, '#FF69B4');
    
    // Ribbon center
    this.ellipse(x, ribbonY, ribbonWidth * 0.2, ribbonWidth * 0.4, '#FF1493');
    
    // Ribbon tails
    this.path(`M ${x - ribbonWidth * 0.1} ${ribbonY + ribbonWidth * 0.4} 
               L ${x - ribbonWidth * 0.3} ${ribbonY + ribbonWidth * 0.8}
               L ${x - ribbonWidth * 0.2} ${ribbonY + ribbonWidth * 0.8}
               Z`, '#FF69B4');
    this.path(`M ${x + ribbonWidth * 0.1} ${ribbonY + ribbonWidth * 0.4} 
               L ${x + ribbonWidth * 0.3} ${ribbonY + ribbonWidth * 0.8}
               L ${x + ribbonWidth * 0.2} ${ribbonY + ribbonWidth * 0.8}
               Z`, '#FF69B4');
  }

  private lightenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  public darkenColorPublic(color: string, amount: number): string {
    return this.darkenColor(color, amount);
  }
}
