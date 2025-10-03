/**
 * Loading State Management Utilities
 *
 * This module provides utilities for managing loading states across
 * authentication components with consistent behavior and visual feedback.
 */

export interface LoadingState {
  isLoading: boolean;
  type: 'initializing' | 'signing-in' | 'validating' | 'signing-out' | 'loading' | 'checking-session';
  provider?: 'google' | 'apple' | 'general';
  message?: string;
  progress?: number;
  startTime?: number;
  timeout?: number;
}

export interface LoadingOptions {
  type?: LoadingState['type'];
  provider?: LoadingState['provider'];
  message?: string;
  timeout?: number;
  minDuration?: number;
  maxDuration?: number;
}

/**
 * Loading Manager class for handling complex loading scenarios
 */
export class LoadingManager {
  private state: LoadingState;
  private listeners: Set<(state: LoadingState) => void> = new Set();
  private timeoutId?: number;

  constructor(initialState: LoadingState = { isLoading: false, type: 'loading' }) {
    this.state = initialState;
  }

  /**
   * Get current loading state
   */
  getState(): LoadingState {
    return { ...this.state };
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.state.isLoading;
  }

  /**
   * Start loading with specified options
   */
  start(options: LoadingOptions = {}): void {
    const now = Date.now();

    this.state = {
      isLoading: true,
      type: options.type || 'loading',
      provider: options.provider || 'general',
      message: options.message,
      progress: 0,
      startTime: now,
      timeout: options.timeout,
    };

    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set timeout if specified
    if (options.timeout) {
      this.timeoutId = window.setTimeout(() => {
        this.stop();
      }, options.timeout);
    }

    this.notifyListeners();
  }

  /**
   * Stop loading
   */
  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.state = {
      ...this.state,
      isLoading: false,
      progress: 100,
    };

    this.notifyListeners();
  }

  /**
   * Update loading progress (0-100)
   */
  updateProgress(progress: number): void {
    this.state.progress = Math.max(0, Math.min(100, progress));
    this.notifyListeners();
  }

  /**
   * Update loading message
   */
  updateMessage(message: string): void {
    this.state.message = message;
    this.notifyListeners();
  }

  /**
   * Update loading type
   */
  updateType(type: LoadingState['type']): void {
    this.state.type = type;
    this.notifyListeners();
  }

  /**
   * Add state change listener
   */
  addListener(listener: (state: LoadingState) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Remove state change listener
   */
  removeListener(listener: (state: LoadingState) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener({ ...this.state });
      } catch (error) {
        console.error('Loading state listener error:', error);
      }
    });
  }

  /**
   * Reset loading manager to initial state
   */
  reset(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.state = {
      isLoading: false,
      type: 'loading',
      provider: 'general',
      progress: 0,
    };

    this.notifyListeners();
  }

  /**
   * Get loading duration in milliseconds
   */
  getDuration(): number {
    return this.state.startTime ? Date.now() - this.state.startTime : 0;
  }

  /**
   * Execute a function with automatic loading state management
   */
  async executeWithLoading<T>(
    fn: () => Promise<T>,
    options: LoadingOptions & {
      minDuration?: number;
      maxDuration?: number;
      errorHandler?: (error: Error) => void;
    } = {}
  ): Promise<T> {
    const { minDuration = 0, maxDuration = 30000, errorHandler, ...loadingOptions } = options;
    const startTime = Date.now();

    this.start(loadingOptions);

    try {
      // Set max duration timeout
      const maxTimeoutId = window.setTimeout(() => {
        throw new Error(`Operation timed out after ${maxDuration}ms`);
      }, maxDuration);

      const result = await fn();
      clearTimeout(maxTimeoutId);

      // Ensure minimum loading duration for better UX
      const elapsed = Date.now() - startTime;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      this.stop();
      return result;
    } catch (error) {
      if (errorHandler) {
        errorHandler(error as Error);
      }
      this.stop();
      throw error;
    }
  }

  /**
   * Cleanup and destroy loading manager
   */
  destroy(): void {
    this.reset();
    this.listeners.clear();
  }
}

/**
 * Global loading manager for application-wide loading states
 */
export const globalLoadingManager = new LoadingManager();

/**
 * Utility function to create a loading manager with default options
 */
export function createLoadingManager(defaultOptions: LoadingOptions = {}): LoadingManager {
  return new LoadingManager({
    isLoading: false,
    type: defaultOptions.type || 'loading',
    provider: defaultOptions.provider || 'general',
    message: defaultOptions.message,
    timeout: defaultOptions.timeout,
  });
}

/**
 * Simulate progress updates for long-running operations
 */
export async function simulateProgress(
  loadingManager: LoadingManager,
  duration: number = 2000,
  steps: number = 10
): Promise<void> {
  const stepDuration = duration / steps;

  for (let i = 1; i <= steps; i++) {
    loadingManager.updateProgress((i / steps) * 100);

    if (i < steps) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
  }
}

/**
 * Debounced loading state to prevent flickering
 */
export function createDebouncedLoading(
  loadingManager: LoadingManager,
  delay: number = 300
): {
  start: (options?: LoadingOptions) => void;
  stop: () => void;
} {
  let timeoutId: number | undefined;
  let isActive = false;

  return {
    start: (options?: LoadingOptions) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!isActive) {
        timeoutId = window.setTimeout(() => {
          loadingManager.start(options);
          isActive = true;
        }, delay);
      }
    },

    stop: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      if (isActive) {
        loadingManager.stop();
        isActive = false;
      }
    },
  };
}

/**
 * Create a loading state that shows only if operation takes longer than threshold
 */
export function createThresholdLoading(
  loadingManager: LoadingManager,
  threshold: number = 500
): {
  start: (options?: LoadingOptions) => Promise<void>;
  stop: () => void;
} {
  let timeoutId: number | undefined;
  let startTime: number | undefined;

  return {
    start: async (options?: LoadingOptions) => {
      startTime = Date.now();

      return new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(() => {
          loadingManager.start(options);
          resolve();
        }, threshold);
      });
    },

    stop: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      // If we started loading but operation completed quickly,
      // ensure minimum display time for UX
      if (startTime && loadingManager.isLoading()) {
        const elapsed = Date.now() - startTime;
        const minDisplayTime = 800; // Minimum time to show loading state

        if (elapsed < minDisplayTime) {
          setTimeout(() => {
            loadingManager.stop();
          }, minDisplayTime - elapsed);
        } else {
          loadingManager.stop();
        }
      }
    },
  };
}
