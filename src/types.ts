export interface CatAttributes {
  color: string;
  furPattern: string;
  eyeShape: string;
  mouth: string;
  accessory: string;
}

export interface CatTraits {
  colors: string[];
  furPatterns: string[];
  eyeShapes: string[];
  mouths: string[];
  accessories: string[];
}

export interface GeneratedCat {
  id: string;
  seed: string;
  attributes: CatAttributes;
  svgData: string;
  traits: Record<string, any>;
}

export interface CatGeneratorOptions {
  width?: number;
  height?: number;
  format?: 'svg' | 'png' | 'base64';
  customTraits?: Partial<CatTraits>;
  responsive?: boolean; // Make SVGs scalable by removing fixed dimensions
}
