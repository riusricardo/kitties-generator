import { CatGenerator } from '../src/index';

describe('CatGenerator', () => {
  let generator: CatGenerator;

  beforeEach(() => {
    generator = new CatGenerator();
  });

  test('should generate a cat with given seed', () => {
    const seed = 'test-seed';
    const cat = generator.generateCat(seed);

    expect(cat.seed).toBe(seed);
    expect(cat.id).toContain('cat_');
    expect(cat.attributes).toHaveProperty('color');
    expect(cat.attributes).toHaveProperty('furPattern');
    expect(cat.attributes).toHaveProperty('eyeShape');
    expect(cat.attributes).toHaveProperty('mouth');
    expect(cat.attributes).toHaveProperty('accessory');
    expect(cat.attributes).toHaveProperty('mutationFlags');
    expect(cat.svgData).toContain('<svg');
    expect(cat.svgData).toContain('</svg>');
  });

  test('should generate consistent cats for same seed', () => {
    const seed = 'consistent-seed';
    const cat1 = generator.generateCat(seed);
    const cat2 = generator.generateCat(seed);

    expect(cat1.attributes).toEqual(cat2.attributes);
    expect(cat1.svgData).toEqual(cat2.svgData);
  });

  test('should generate different cats for different seeds', () => {
    const cat1 = generator.generateCat('seed1');
    const cat2 = generator.generateCat('seed2');

    expect(cat1.attributes).not.toEqual(cat2.attributes);
  });

  test('should generate multiple cats', () => {
    const seeds = ['seed1', 'seed2', 'seed3'];
    const cats = generator.generateCats(seeds);

    expect(cats).toHaveLength(3);
    cats.forEach((cat, index) => {
      expect(cat.seed).toBe(seeds[index]);
    });
  });

  test('should generate random cat', () => {
    const cat = generator.generateRandomCat();

    expect(cat.seed).toBeDefined();
    expect(cat.attributes).toBeDefined();
    expect(cat.svgData).toContain('<svg');
  });

  test('should have valid attributes', () => {
    const cat = generator.generateCat('test');
    
    expect(typeof cat.attributes.color).toBe('string');
    expect(typeof cat.attributes.furPattern).toBe('string');
    expect(typeof cat.attributes.eyeShape).toBe('string');
    expect(typeof cat.attributes.mouth).toBe('string');
    expect(typeof cat.attributes.accessory).toBe('string');
    expect(Array.isArray(cat.attributes.mutationFlags)).toBe(true);
  });

  test('should generate SVG with proper dimensions', () => {
    const generator = new CatGenerator({ width: 300, height: 300 });
    const cat = generator.generateCat('test');

    expect(cat.svgData).toContain('width="300"');
    expect(cat.svgData).toContain('height="300"');
    expect(cat.svgData).toContain('viewBox="0 0 300 300"');
  });
});
