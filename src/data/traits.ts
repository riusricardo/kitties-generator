import { CatTraits } from '../types';

export const DEFAULT_CAT_TRAITS: CatTraits = {
  colors: [
    // Classic cat colors
    '#D2691E', // Saddle Brown (Orange tabby)
    '#8B4513', // Saddle Brown (Brown tabby)
    '#2F4F4F', // Dark Slate Gray (Gray)
    '#000000', // Black
    '#FFFFFF', // White
    '#F5DEB3', // Wheat (Cream)
    '#DEB887', // Burlywood (Light brown)
    '#C0C0C0', // Silver
    '#778899', // Light Slate Gray
    '#A0522D', // Sienna (Dark brown)
    
    // Modern/cute colors inspired by Fat Cat Avatar
    '#FFB6C1', // Light Pink
    '#87CEEB', // Sky Blue
    '#98FB98', // Pale Green
    '#DDA0DD', // Plum (Lavender)
    '#F0E68C', // Khaki (Pale yellow)
    '#FFA07A', // Light Salmon
    '#20B2AA', // Light Sea Green
    '#FFE4E1', // Misty Rose
    '#F0F8FF', // Alice Blue
    '#F5F5DC', // Beige
    '#E6E6FA', // Lavender
    '#FFF8DC', // Cornsilk
    '#FFE4B5', // Moccasin
    '#FFEFD5', // Papaya Whip
    '#F0FFFF', // Azure
    '#F5FFFA', // Mint Cream
  ],
  
  furPatterns: [
    'solid',
    'stripes',
    'spots',
    'calico',
    'tuxedo',
    'tabby',
    'tortoiseshell',
    'bicolor',
    'colorpoint',
    'mackerel',
    'classic',
    'ticked',
    'rosette',
    'marble',
    'van',
    'harlequin',
    'gradient',
    'ombre',
    'patches',
    'swirl',
  ],
  
  eyeShapes: [
    'round',
    'almond',
    'oval',
    'wide',
    'narrow',
    'upturned',
    'downturned',
    'sleepy',
    'alert',
    'mysterious',
    'bright',
    'gentle',
    'fierce',
    'curious',
    'wise',
    'playful',
    'sparkly',
    'dreamy',
    'mischievous',
    'loving',
  ],
  
  mouths: [
    'smile',
    'neutral',
    'open',
    'tongue',
    'whiskers',
    'small',
    'wide',
    'cute',
    'serious',
    'playful',
    'surprised',
    'sleepy',
    'content',
    'mischievous',
    'blep',
    'yawn',
    'meow',
    'purr',
  ],
  
  accessories: [
    'none',
    'bow-tie',
    'hat',
    'glasses',
    'crown',
    '1st-place-medal',
    'adhesive-bandage',
    'scarf',
    'flower',
    'necklace',
    'mask',
    'bowtie',
    'ribbon',
    'mask',
    'headband',
    'bow',
    'charm',
    'brooch',
  ],
};

export const RARITY_WEIGHTS = {
  common: 0.3,
  uncommon: 0.25,
  rare: 0.2,
  legendary: 0.2,
  mythical: 0.1,
};

export const TRAIT_RARITIES = {
  colors: {
    common: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    uncommon: ['#FFA07A', '#87CEEB', '#F0E68C', '#FFB6C1'],
    rare: ['#D2691E', '#708090', '#000000', '#FFFFFF'],
    legendary: ['#8B4513', '#FF69B4'],
    mythical: [],
  },
  furPatterns: {
    common: ['solid', 'stripes', 'spots', 'tabby'],
    uncommon: ['calico', 'tuxedo', 'tortoiseshell', 'bicolor'],
    rare: ['colorpoint', 'mackerel', 'classic', 'ticked'],
    legendary: ['rosette', 'marble', 'van'],
    mythical: ['harlequin'],
  },
  eyeShapes: {
    common: ['round', 'almond', 'oval', 'wide'],
    uncommon: ['narrow', 'upturned', 'downturned', 'sleepy'],
    rare: ['alert', 'mysterious', 'bright', 'gentle'],
    legendary: ['fierce', 'curious', 'wise'],
    mythical: ['playful'],
  },
  mouths: {
    common: ['smile', 'cute', 'neutral', 'playful'],
    uncommon: ['tongue', 'whiskers', 'small', 'wide'],
    rare: ['serious', 'surprised', 'open'],
    legendary: ['sleepy', 'content', 'mischievous'],
    mythical: ['blep'],
  },
  accessories: {
    common: ['none', 'scarf', 'bow-tie', 'glasses', 'adhesive-bandage'],
    uncommon: ['hat', 'flower', 'necklace', 'bowtie', 'ribbon'],
    rare: ['crown', '1st-place-medal', 'mask'],
    legendary: ['mask', 'crown', '1st-place-medal', 'mask'],
    mythical: ['mask'],
  },
};
