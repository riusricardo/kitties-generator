<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CryptoKitty Generator Project

This is a TypeScript library for generating CryptoKitties-style cat images with customizable attributes.

## Project Structure

- `src/`: Main source code
  - `cat-generator.ts`: Main generator class
  - `types.ts`: TypeScript type definitions
  - `utils/random.ts`: Seeded random number generator
  - `data/traits.ts`: Cat trait definitions and rarity data
  - `rendering/svg-builder.ts`: SVG generation utilities
  - `example.ts`: Usage demonstration
- `dist/`: Compiled JavaScript output
- `test/`: Test files

## Key Features

- Deterministic cat generation from seeds
- Trait-based rarity system (Common, Uncommon, Rare, Legendary, Mythical)
- SVG-based cat rendering
- Full TypeScript support
- Comprehensive test coverage

## When working on this project:

1. Maintain the seeded random generation for consistency
2. Follow the existing trait rarity system
3. Keep SVG generation modular and extensible
4. Ensure all new features have corresponding tests
5. Update type definitions when adding new attributes
6. Consider visual appeal when modifying SVG rendering
