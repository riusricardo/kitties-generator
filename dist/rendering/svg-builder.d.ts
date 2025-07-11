import { SeededRandom } from '../utils/random';
export declare class SVGBuilder {
    private elements;
    private defs;
    private width;
    private height;
    private random;
    private gradientCounter;
    constructor(width: number, height: number, random: SeededRandom);
    addElement(element: string): void;
    circle(cx: number, cy: number, r: number, fill: string, stroke?: string, strokeWidth?: number): void;
    ellipse(cx: number, cy: number, rx: number, ry: number, fill: string, stroke?: string, strokeWidth?: number): void;
    path(d: string, fill: string, stroke?: string, strokeWidth?: number): void;
    polygon(points: string, fill: string, stroke?: string, strokeWidth?: number): void;
    rect(x: number, y: number, width: number, height: number, fill: string, stroke?: string, strokeWidth?: number): void;
    text(x: number, y: number, text: string, fontSize: number, fill: string, fontFamily?: string): void;
    group(elements: string[], transform?: string): void;
    build(): string;
    addGradient(color1: string, color2: string): string;
    addRadialGradient(color1: string, color2: string): string;
    /**
     * Embed a browser-compatible SVG asset from the original high-quality assets
     */
    embedSVGAsset(assetName: string, x: number, y: number, size: number, scale?: number): void;
    /**
     * Sanitize SVG content by removing problematic namespace elements
     */
    private sanitizeSVGContent;
    drawCatHead(x: number, y: number, size: number, color: string): void;
    drawCatEyes(x: number, y: number, eyeShape: string, size: number): void;
    drawCatMouth(x: number, y: number, mouthType: string, size: number): void;
    drawFurPattern(x: number, y: number, size: number, pattern: string, baseColor: string): void;
    private drawStripes;
    private drawSpots;
    private drawCalico;
    private drawTuxedo;
    drawWhiskers(x: number, y: number, size: number): void;
    drawCheekBlush(x: number, y: number, size: number): void;
    drawCatBody(x: number, y: number, size: number, color: string): void;
    drawCatLegs(x: number, y: number, size: number, color: string): void;
    private drawPawPrint;
    drawAccessory(x: number, y: number, size: number, accessoryType: string): void;
    private drawBowTie;
    private drawHat;
    private drawCrown;
    private drawGlasses;
    private drawFlower;
    private drawScarf;
    private drawNecklace;
    private drawRibbon;
    private draw1stPlaceMedal;
    private drawAdhesiveBandage;
    private drawMask;
    private lightenColor;
    darkenColor(color: string, amount: number): string;
    darkenColorPublic(color: string, amount: number): string;
}
//# sourceMappingURL=svg-builder.d.ts.map