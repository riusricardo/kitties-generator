# 🎯 Responsive CryptoKitty SVGs - Usage Guide

The CryptoKitty generator now supports **dynamic, scalable SVGs** that adapt to any container size! This solves the common issue where SVGs have fixed dimensions and don't scale properly when imported into other projects.

## 🚀 Quick Start

### Method 1: Enable Responsive Mode (Recommended)
```javascript
import { CatGenerator } from 'cryptokitty-generator';

// Create generator with responsive SVGs enabled
const generator = new CatGenerator({ responsive: true });

// Generate a cat - SVG will scale to fit any container
const cat = generator.generateCat('my-seed');
console.log(cat.svgData); // No width/height attributes, scales dynamically
```

### Method 2: Use Convenience Method
```javascript
import { CatGenerator } from 'cryptokitty-generator';

const generator = new CatGenerator();

// Generate a responsive cat (overrides default settings)
const responsiveCat = generator.generateResponsiveCat('my-seed');
```

## 📐 What's Different?

### ❌ Old (Fixed Size)
```xml
<svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Cat content -->
</svg>
```

### ✅ New (Responsive)
```xml
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <!-- Cat content -->
</svg>
```

## 🎨 Usage in Your Project

### React Component
```jsx
function CatDisplay({ seed }) {
  const generator = new CatGenerator({ responsive: true });
  const cat = generator.generateCat(seed);
  
  return (
    <div style={{ width: '200px', height: '200px' }}>
      <div dangerouslySetInnerHTML={{ __html: cat.svgData }} />
    </div>
  );
}
```

### CSS Styling
```css
.cat-container {
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
}

.cat-container svg {
  width: 100%;
  height: 100%;
}
```

### HTML
```html
<div class="cat-small" style="width: 50px; height: 50px;">
  <!-- Responsive SVG scales down -->
</div>

<div class="cat-large" style="width: 500px; height: 500px;">
  <!-- Same SVG scales up perfectly -->
</div>
```

## 🔧 Configuration Options

```javascript
const generator = new CatGenerator({
  width: 400,           // Internal coordinate system width
  height: 500,          // Internal coordinate system height  
  responsive: true,     // Enable responsive scaling
  customTraits: {...}   // Your custom traits
});
```

## 🧪 Testing

Run the demo to see responsive vs fixed comparison:
```bash
# Open in browser
open responsive-demo.html
```

## 📊 Browser Compatibility

- ✅ All modern browsers
- ✅ Mobile devices
- ✅ High DPI displays
- ✅ CSS Grid/Flexbox containers
- ✅ CSS animations/transforms

## 🎯 Use Cases

1. **Responsive Design**: SVGs adapt to different screen sizes
2. **Component Libraries**: Consistent scaling across components
3. **Dashboard Cards**: Cats fit perfectly in varying card sizes
4. **Mobile Apps**: Scale appropriately on different devices
5. **Print Media**: Vector scaling for high-quality printing

The `preserveAspectRatio="xMidYMid meet"` ensures the cat stays proportional and centered in any container!
