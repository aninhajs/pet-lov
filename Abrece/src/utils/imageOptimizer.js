// Utilitários para otimização de imagens
export class ImageOptimizer {
  static cache = new Map();
  static loadingImages = new Set();

  // Otimizar URL de imagem com lazy loading
  static optimizeImageUrl(url, width = 400, height = 300, quality = 80) {
    if (!url) return null;

    // Cache da URL otimizada
    const cacheKey = `${url}-${width}x${height}-q${quality}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let optimizedUrl = url;

    // Otimizações para diferentes tipos de imagem
    if (url.includes("placeholder.com")) {
      optimizedUrl = url.replace(/\d+x\d+/, `${width}x${height}`);
    } else if (url.startsWith('data:image')) {
      // Para base64, criar uma versão redimensionada
      optimizedUrl = this.resizeBase64Image(url, width, height, quality);
    }

    this.cache.set(cacheKey, optimizedUrl);
    return optimizedUrl;
  }

  // Redimensionar imagem base64 (simplified)
  static resizeBase64Image(base64, width, height, quality = 0.8) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const resizedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedBase64);
      };
      img.src = base64;
    });
  }

  // Preload de imagem crítica
  static preloadImage(url) {
    if (this.loadingImages.has(url)) return;
    
    this.loadingImages.add(url);
    const img = new Image();
    img.onload = () => this.loadingImages.delete(url);
    img.onerror = () => this.loadingImages.delete(url);
    img.src = url;
  }

  // Lazy loading para múltiplas imagens
  static lazyLoadImages(imageUrls, callback) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => callback && callback(img);
          observer.unobserve(img);
        }
      });
    });

    return observer;
  }

  // Limpar cache quando necessário
  static clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache de imagens limpo');
  }
}

// Hook personalizado para otimização de imagens
export const useImageOptimization = () => {
  return {
    optimizeUrl: ImageOptimizer.optimizeImageUrl.bind(ImageOptimizer),
    preload: ImageOptimizer.preloadImage.bind(ImageOptimizer),
    clearCache: ImageOptimizer.clearCache.bind(ImageOptimizer),
  };
};