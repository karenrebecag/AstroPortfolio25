# Kirby 3D Implementation Guide

## Overview
This guide documents the complete implementation of the KirbyBackground.tsx component, which renders a 3D Kirby model in the MyStack section. The implementation follows the established Three.js optimization patterns from the project's `THREE_JS_IMPLEMENTATION.md` guidelines.

## Architecture & Design Patterns

### 1. Zustand State Management
The component uses a dedicated Zustand store (`useKirbyStore`) for centralized state management:

```typescript
const useKirbyStore = create<{
  isVisible: boolean;
  isPaused: boolean;
  isLoading: boolean;
  opacity: number;
  quality: 'low' | 'medium' | 'high';
  rotationSpeed: number;
  colors: { primary: string; contrast: string; };
}>
```

**Key Features:**
- **Smooth Transitions**: Opacity changes with 200ms delay for fade-in, 100ms for fade-out
- **Quality Detection**: Automatic device-based quality adjustment
- **Color Management**: Kirby-specific pink color palette (`#ffb6c1`, `#ff69b4`)

### 2. Performance Optimizations

#### Intersection Observer
```typescript
const observer = new IntersectionObserver(
  ([entry]) => {
    useKirbyStore.getState().setVisible(entry.isIntersecting);
  },
  { 
    threshold: 0,
    rootMargin: '800px 0px 200px 0px' // Early activation
  }
);
```

#### Page Visibility API
```typescript
const handleVisibilityChange = () => {
  useKirbyStore.getState().setPaused(document.hidden);
};
```

#### Quality-Based Rendering
- **Low Quality**: MeshLambertMaterial, single ambient light, no shadows
- **Medium Quality**: MeshStandardMaterial, basic PBR, directional light
- **High Quality**: Full PBR with all textures, shadows, point lights

### 3. Three.js Scene Setup

#### Camera Configuration
```typescript
const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
camera.position.set(0, 0, 3.2); // Positioned for optimal Kirby viewing
```

#### Renderer Optimizations
```typescript
const renderer = new THREE.WebGLRenderer({
  antialias: false, // Disabled for mobile performance
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limited pixel ratio
renderer.outputColorSpace = THREE.SRGBColorSpace; // Correct for GLTF
```

#### Lighting System
- **Ambient Light**: Base illumination (0.6-0.8 intensity based on quality)
- **Directional Light**: Main lighting with optional shadows (quality ≥ medium)
- **Point Light**: Accent lighting with pink tint (high quality only)

### 4. Model Loading Strategy

#### Primary Model Loading
```typescript
gltfLoader.load('/models/Kirby/base_basic_pbr.glb', (gltf) => {
  // Primary GLB with PBR textures
});
```

#### Fallback Strategy
```typescript
// Error callback with automatic fallback
gltfLoader.load('/models/Kirby/base_basic_shaded.glb', (gltf) => {
  // Alternative GLB model
});
```

#### Texture Management
- **Automatic Detection**: Uses GLB textures if available
- **Manual Loading**: Fallback to individual texture files
- **Proper Configuration**: `flipY: false` for GLB compatibility, correct color space

### 5. Material System

#### Quality-Based Materials
```typescript
// Low Quality
new THREE.MeshLambertMaterial({
  map: baseColor,
  transparent: true,
  opacity: opacity,
});

// Medium Quality
new THREE.MeshStandardMaterial({
  map: baseColor,
  roughness: 0.8,
  metalness: 0.2,
  transparent: true,
  opacity: opacity,
});

// High Quality (Full PBR)
new THREE.MeshStandardMaterial({
  map: baseColor,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  metalnessMap: metalnessMap,
  roughness: 0.8,
  metalness: 0.2,
  envMapIntensity: 0.5,
  transparent: true,
  opacity: opacity,
});
```

### 6. Animation System

#### Positioning & Scaling
```typescript
root.scale.setScalar(1.25); // 20% smaller than original
root.position.set(0, -1.2, 0); // Centered with slight downward offset
```

#### Animation Loop
```typescript
const animate = () => {
  if (!isPaused && isVisible && kirbyObject) {
    time += 0.016 * rotationSpeed;
    
    // Slow rotation
    kirbyObject.rotation.y = time * 0.05;
    
    // Gentle floating animation
    kirbyObject.position.y = -1.2 + Math.sin(time * 2) * 0.06;
    
    renderer.render(scene, camera);
  }
  animationId = requestAnimationFrame(animate);
};
```

### 7. Resource Management

#### Complete Cleanup
```typescript
// Dispose all geometries and materials
scene.traverse((object) => {
  if (object instanceof THREE.Mesh) {
    object.geometry?.dispose();
    if (Array.isArray(object.material)) {
      object.material.forEach(material => material.dispose());
    } else {
      object.material?.dispose();
    }
  }
});

// Dispose renderer and remove from DOM
renderer.dispose();
if (currentMount && currentMount.contains(renderer.domElement)) {
  currentMount.removeChild(renderer.domElement);
}
```

### 8. Responsive Design

#### Container Constraints
```typescript
const containerWidth = Math.min(currentMount.clientWidth, window.innerWidth);
const containerHeight = Math.min(currentMount.clientHeight, window.innerHeight);
```

#### Canvas Styling
```typescript
canvas.style.maxWidth = '100%';
canvas.style.maxHeight = '100%';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.display = 'block';
canvas.style.objectFit = 'contain';
```

## Integration with MyStack Section

### CSS Classes Used
- `.kirby-3d-model`: Main container class
- `.kirby-3d-container`: Three.js canvas container
- `.kirby-loading`: Loading state display
- `.loading-spinner`: Animated loading indicator

### Props Interface
```typescript
interface KirbyBackgroundProps {
  className?: string;
}
```

### Usage in MyStackIsland.tsx
```typescript
import KirbyBackground from '../three/KirbyBackground';

// In component
<KirbyBackground className="kirby-3d-model" />
```

## File Dependencies

### Required Assets
- `/models/Kirby/base_basic_pbr.glb` (Primary model)
- `/models/Kirby/base_basic_shaded.glb` (Fallback model)
- `/models/Kirby/texture_diffuse.png` (Manual texture fallback)
- `/models/Kirby/texture_roughness.png`
- `/models/Kirby/texture_metallic.png`
- `/models/Kirby/texture_normal.png`
- `/hdr/large_corridor_1k.hdr` (Environment map)

### NPM Dependencies
```json
{
  "three": "^0.x.x",
  "three-stdlib": "^2.x.x",
  "zustand": "^4.x.x"
}
```

## Performance Characteristics

### Memory Usage
- **Low Quality**: ~5-10MB
- **Medium Quality**: ~10-20MB  
- **High Quality**: ~20-40MB

### Frame Rate Targets
- **Mobile/Low-end**: 30 FPS
- **Desktop/Medium**: 60 FPS
- **High-end**: 60+ FPS

### Loading Times
- **Initial Load**: 300ms delay + model loading time
- **Fade In**: 200ms smooth transition
- **Quality Detection**: Automatic on mount

## Troubleshooting

### Common Issues
1. **Model Not Loading**: Check GLB file paths and fallback strategy
2. **Texture Issues**: Verify `flipY: false` and color space settings
3. **Performance Problems**: Adjust quality detection logic
4. **Overflow Issues**: Ensure container constraints are properly set

### Debug Information
The component includes extensive console logging for:
- Model loading progress
- Texture detection
- UV mapping verification
- Material application

## Future Enhancements

### Potential Improvements
1. **LOD System**: Multiple model resolutions based on distance
2. **Texture Streaming**: Progressive texture loading
3. **Animation Variants**: Multiple animation states
4. **Interactive Features**: Mouse/touch interaction
5. **Audio Integration**: Sound effects for interactions

### Performance Optimizations
1. **Instancing**: For multiple Kirby models
2. **Frustum Culling**: Advanced visibility detection
3. **Texture Compression**: KTX2/Basis Universal support
4. **Web Workers**: Offload heavy computations

## Conclusion

The KirbyBackground component represents a fully optimized 3D implementation following the project's established patterns. It provides excellent performance across devices while maintaining visual quality and smooth animations. The component is designed to be easily replaceable and follows the modular architecture principles of the portfolio project.
