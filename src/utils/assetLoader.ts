/**
 * Robust Asset Loader with Fallbacks and Retry Logic
 *
 * Provides resilient asset loading for Three.js and other resources.
 * Handles failures gracefully with automatic retries and fallback options.
 *
 * @module utils/assetLoader
 */

export interface AssetConfig<T = any> {
  /** Primary URL to load from (e.g., CDN) */
  primary: string;
  /** Optional fallback URL (e.g., local copy) */
  fallback?: string;
  /** Default value to use if all loading fails */
  defaultValue?: T;
  /** Custom error message */
  errorMessage?: string;
}

export interface LoadOptions {
  /** Number of retry attempts for primary URL */
  retries?: number;
  /** Base delay between retries in ms (exponential backoff) */
  retryDelay?: number;
  /** Timeout for each load attempt in ms */
  timeout?: number;
  /** Enable logging */
  verbose?: boolean;
}

const DEFAULT_OPTIONS: Required<LoadOptions> = {
  retries: 3,
  retryDelay: 1000,
  timeout: 30000,
  verbose: true
};

/**
 * Delays execution for specified milliseconds
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wraps a promise with a timeout
 */
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

/**
 * Robust Asset Loader class
 *
 * Handles asset loading with automatic retries, fallbacks, and error recovery.
 */
export class RobustAssetLoader {
  /**
   * Loads an asset with retry logic and fallback support
   *
   * @template T - Type of the asset being loaded
   * @param {Function} loader - Async function that loads from a URL
   * @param {AssetConfig<T>} config - Asset configuration with primary/fallback URLs
   * @param {LoadOptions} options - Loading options (retries, delays, etc.)
   * @returns {Promise<T>} The loaded asset
   * @throws {Error} If all loading attempts fail and no default value provided
   *
   * @example
   * ```typescript
   * import { RGBELoader } from 'three-stdlib';
   *
   * const hdr = await RobustAssetLoader.loadWithRetry(
   *   (url) => new Promise((resolve, reject) => {
   *     new RGBELoader().load(url, resolve, undefined, reject);
   *   }),
   *   {
   *     primary: 'https://cdn.example.com/env.hdr',
   *     fallback: '/assets/fallback-env.hdr',
   *     defaultValue: null,
   *     errorMessage: 'HDR environment map'
   *   },
   *   { retries: 3, verbose: true }
   * );
   * ```
   */
  static async loadWithRetry<T>(
    loader: (url: string) => Promise<T>,
    config: AssetConfig<T>,
    options: LoadOptions = {}
  ): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError: Error | null = null;

    // Attempt to load from primary URL with retries
    for (let attempt = 1; attempt <= opts.retries; attempt++) {
      try {
        if (opts.verbose && attempt > 1) {
          console.log(
            `[AssetLoader] Retry ${attempt}/${opts.retries} for: ${config.primary}`
          );
        }

        const result = await withTimeout(
          loader(config.primary),
          opts.timeout
        );

        if (opts.verbose && attempt > 1) {
          console.log(`[AssetLoader] ✓ Succeeded on retry ${attempt}`);
        }

        return result;
      } catch (error) {
        lastError = error as Error;

        if (opts.verbose) {
          console.warn(
            `[AssetLoader] Attempt ${attempt}/${opts.retries} failed:`,
            error
          );
        }

        // Wait before next retry (exponential backoff)
        if (attempt < opts.retries) {
          const backoffDelay = opts.retryDelay * Math.pow(2, attempt - 1);
          await delay(backoffDelay);
        }
      }
    }

    // Primary URL failed - try fallback
    if (config.fallback) {
      try {
        if (opts.verbose) {
          console.warn(
            `[AssetLoader] Primary URL failed, attempting fallback: ${config.fallback}`
          );
        }

        const result = await withTimeout(
          loader(config.fallback),
          opts.timeout
        );

        if (opts.verbose) {
          console.log('[AssetLoader] ✓ Fallback succeeded');
        }

        return result;
      } catch (fallbackError) {
        if (opts.verbose) {
          console.error('[AssetLoader] Fallback also failed:', fallbackError);
        }
        lastError = fallbackError as Error;
      }
    }

    // Both primary and fallback failed - use default value if provided
    if (config.defaultValue !== undefined) {
      if (opts.verbose) {
        console.warn(
          '[AssetLoader] Using default value after all load attempts failed'
        );
      }
      return config.defaultValue;
    }

    // No default value - throw error
    const errorMsg =
      config.errorMessage ||
      `Failed to load asset from: ${config.primary}${config.fallback ? ` or ${config.fallback}` : ''}`;
    throw new Error(`${errorMsg} - ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Preloads multiple assets in parallel
   *
   * @template T - Type of assets being loaded
   * @param {Array} assets - Array of asset configurations
   * @param {Function} loader - Loader function
   * @param {LoadOptions} options - Loading options
   * @returns {Promise<T[]>} Array of loaded assets (same order as input)
   *
   * @example
   * ```typescript
   * const [hdr, model, texture] = await RobustAssetLoader.preloadAssets(
   *   [
   *     {
   *       primary: 'https://cdn.example.com/env.hdr',
   *       fallback: '/assets/env.hdr'
   *     },
   *     {
   *       primary: 'https://cdn.example.com/model.glb',
   *       fallback: '/assets/model.glb'
   *     },
   *     {
   *       primary: 'https://cdn.example.com/texture.jpg',
   *       defaultValue: null
   *     }
   *   ],
   *   (url) => fetch(url).then(r => r.blob()),
   *   { verbose: false }
   * );
   * ```
   */
  static async preloadAssets<T>(
    assets: AssetConfig<T>[],
    loader: (url: string) => Promise<T>,
    options: LoadOptions = {}
  ): Promise<T[]> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (opts.verbose) {
      console.log(`[AssetLoader] Preloading ${assets.length} assets...`);
    }

    const loadPromises = assets.map((config, index) =>
      this.loadWithRetry(loader, config, {
        ...opts,
        verbose: opts.verbose && assets.length <= 5 // Only log individual assets if < 5
      }).catch(error => {
        if (opts.verbose) {
          console.error(
            `[AssetLoader] Asset ${index + 1}/${assets.length} failed:`,
            error
          );
        }
        throw error;
      })
    );

    const results = await Promise.all(loadPromises);

    if (opts.verbose) {
      console.log(`[AssetLoader] ✓ All ${assets.length} assets loaded successfully`);
    }

    return results;
  }

  /**
   * Loads assets with a progress callback
   *
   * @template T - Type of assets being loaded
   * @param {Array} assets - Array of asset configurations
   * @param {Function} loader - Loader function
   * @param {Function} onProgress - Progress callback (loaded, total, percentage)
   * @param {LoadOptions} options - Loading options
   * @returns {Promise<T[]>} Array of loaded assets
   *
   * @example
   * ```typescript
   * const assets = await RobustAssetLoader.loadWithProgress(
   *   assetConfigs,
   *   loader,
   *   (loaded, total, percentage) => {
   *     console.log(`Loading: ${percentage}% (${loaded}/${total})`);
   *     updateProgressBar(percentage);
   *   }
   * );
   * ```
   */
  static async loadWithProgress<T>(
    assets: AssetConfig<T>[],
    loader: (url: string) => Promise<T>,
    onProgress: (loaded: number, total: number, percentage: number) => void,
    options: LoadOptions = {}
  ): Promise<T[]> {
    const total = assets.length;
    let loaded = 0;

    const updateProgress = () => {
      loaded++;
      const percentage = Math.round((loaded / total) * 100);
      onProgress(loaded, total, percentage);
    };

    const loadPromises = assets.map(async (config) => {
      try {
        const result = await this.loadWithRetry(loader, config, options);
        updateProgress();
        return result;
      } catch (error) {
        updateProgress(); // Update progress even on failure
        throw error;
      }
    });

    return Promise.all(loadPromises);
  }
}

/**
 * Common asset configurations for this project
 */
export const ASSET_CONFIGS = {
  /**
   * HDR Environment Map
   */
  GEM_HDR: {
    primary: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/large_corridor_1k-1.hdr',
    fallback: '/assets/fallback-env.hdr',
    defaultValue: null,
    errorMessage: 'HDR environment map'
  },

  /**
   * Gem 3D Model
   */
  GEM_MODEL: {
    primary: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/gem.json',
    fallback: '/assets/gem.json',
    defaultValue: null,
    errorMessage: 'Gem 3D model'
  },

  /**
   * Silk Background Image
   */
  SILK_BACKGROUND: {
    primary: 'https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/SilkCardFallback.jpeg',
    fallback: '/assets/silk-fallback.jpg',
    defaultValue: undefined,
    errorMessage: 'Silk background texture'
  }
} as const;
