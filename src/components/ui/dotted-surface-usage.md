# DottedSurface Component Usage Guide

## Overview

The DottedSurface component creates an animated 3D particle field using Three.js. It's perfect for adding subtle, engaging background animations to your pages.

## Features

- ✅ Responsive 3D particle animation
- ✅ Theme-aware (adapts to light/dark mode)
- ✅ Performance optimized with proper cleanup
- ✅ Customizable via className prop
- ✅ Fixed positioning for background use

## Basic Usage

```tsx
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function MyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background animation */}
      <DottedSurface />

      {/* Your content */}
      <div className="relative z-10">
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

## Advanced Usage

```tsx
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function MyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Customized background with reduced opacity */}
      <DottedSurface className="opacity-30" />

      {/* Content with proper z-index */}
      <div className="relative z-10 p-8">
        <h1>Your Content</h1>
      </div>
    </div>
  );
}
```

## Props

| Prop      | Type                 | Default | Description            |
| --------- | -------------------- | ------- | ---------------------- |
| className | string               | -       | Additional CSS classes |
| ...props  | HTMLDivElement props | -       | Standard div props     |

## Styling Tips

1. **Opacity Control**: Use `opacity-30` or similar classes to make it more subtle
2. **Z-Index**: Always ensure your content has `relative z-10` or higher
3. **Performance**: The component automatically handles cleanup and resize events

## Theme Integration

The component automatically adapts to your theme:

- **Light mode**: Black particles
- **Dark mode**: Light gray particles

## Performance Notes

- Uses requestAnimationFrame for smooth animations
- Automatically cleans up Three.js resources on unmount
- Handles window resize events
- Optimized particle count for good performance

## Demo

Visit `/demo/dotted-surface` to see the component in action.
