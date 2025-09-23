// Sistema de pooling simple para materiales Three.js - siguiendo la guía de optimizaciones
import * as THREE from 'three';

type MaterialConfig = {
  type: 'physical' | 'standard' | 'basic';
  quality: 'low' | 'medium' | 'high';
  colors: {
    base: string;
    attenuation: string;
  };
};

class MaterialPool {
  private static instance: MaterialPool;
  private materials: Map<string, THREE.Material> = new Map();
  
  static getInstance(): MaterialPool {
    if (!MaterialPool.instance) {
      MaterialPool.instance = new MaterialPool();
    }
    return MaterialPool.instance;
  }
  
  // ✅ Reusar materiales en lugar de crear nuevos - siguiendo recomendaciones
  getMaterial(config: MaterialConfig): THREE.MeshPhysicalMaterial {
    const key = `${config.type}-${config.quality}-${config.colors.base}`;
    
    if (!this.materials.has(key)) {
      const material = this.createMaterial(config);
      this.materials.set(key, material);
    }
    
    return this.materials.get(key)!.clone() as THREE.MeshPhysicalMaterial;
  }
  
  private createMaterial(config: MaterialConfig): THREE.MeshPhysicalMaterial {
    const baseConfig = {
      transmission: 1.0,
      thickness: 4.2,
      ior: 2.4,
      roughness: 0.0,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      reflectivity: 1.0,
      attenuationDistance: 0.5,
      attenuationColor: new THREE.Color(config.colors.attenuation),
      color: new THREE.Color(config.colors.base),
    };

    // ✅ Quality-based optimizations - siguiendo la guía
    switch (config.quality) {
      case 'low':
        return new THREE.MeshPhysicalMaterial({
          ...baseConfig,
          envMapIntensity: 1.5,
          roughness: 0.1,
          clearcoat: 0.5,
        });
      case 'high':
        return new THREE.MeshPhysicalMaterial({
          ...baseConfig,
          envMapIntensity: 3.0,
          sheen: 1,
          sheenColor: new THREE.Color('#ffffff'),
          sheenRoughness: 0.1,
          iridescence: 1.0,
          iridescenceIOR: 1.5,
          iridescenceThicknessRange: [200, 600] as [number, number],
        });
      default: // medium
        return new THREE.MeshPhysicalMaterial({
          ...baseConfig,
          envMapIntensity: 2.0,
          iridescence: 0.5,
          iridescenceIOR: 1.3,
        });
    }
  }
  
  // ✅ Cleanup automático - crítico para evitar memory leaks
  dispose() {
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
  }
  
  // ✅ Método para obtener estadísticas de uso
  getStats() {
    return {
      totalMaterials: this.materials.size,
      memoryUsage: this.materials.size * 0.5 // Estimación aproximada en MB
    };
  }
}

export default MaterialPool;
