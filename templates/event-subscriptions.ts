/**
 * Event Subscriptions Template
 *
 * Complete guide for subscribing to and handling Webflow Designer events.
 * Covers: element events, selection events, page events, and custom listeners.
 *
 * @example
 * import { EventManager } from './templates/event-subscriptions';
 * const eventMgr = new EventManager();
 * eventMgr.onElementSelected((elements) => console.log(elements));
 */

import { webflow } from '@webflow/designer-api';

/**
 * Event listener callback types
 */
export type ElementEventCallback = (elements: webflow.Element[]) => void;
export type PageEventCallback = (page: webflow.Page) => void;
export type DeleteEventCallback = (elementId: string) => void;
export type PropertyChangeCallback = (
  elementId: string,
  property: string,
  value: any
) => void;

/**
 * Registered listener tracking
 */
export interface RegisteredListener {
  id: string;
  event: string;
  callback: Function;
  createdAt: Date;
}

/**
 * Comprehensive event management class
 */
export class EventManager {
  private listeners: Map<string, RegisteredListener[]> = new Map();
  private listenerCounter = 0;

  /**
   * Listen for element selection changes
   */
  onElementSelected(callback: ElementEventCallback): () => void {
    try {
      webflow.on('selectedElementsChange', callback);

      const listenerId = `listener-${++this.listenerCounter}`;
      const listener: RegisteredListener = {
        id: listenerId,
        event: 'selectedElementsChange',
        callback,
        createdAt: new Date()
      };

      if (!this.listeners.has('selectedElementsChange')) {
        this.listeners.set('selectedElementsChange', []);
      }
      this.listeners.get('selectedElementsChange')!.push(listener);

      console.log('Selected elements listener registered');

      // Return unsubscribe function
      return () => {
        webflow.off('selectedElementsChange', callback);
        const listeners = this.listeners.get('selectedElementsChange');
        if (listeners) {
          const index = listeners.findIndex(l => l.id === listenerId);
          if (index > -1) listeners.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('Failed to register selection listener:', error);
      return () => {};
    }
  }

  /**
   * Listen for page changes
   */
  onPageChanged(callback: PageEventCallback): () => void {
    try {
      webflow.on('pageChange', callback);

      const listenerId = `listener-${++this.listenerCounter}`;
      const listener: RegisteredListener = {
        id: listenerId,
        event: 'pageChange',
        callback,
        createdAt: new Date()
      };

      if (!this.listeners.has('pageChange')) {
        this.listeners.set('pageChange', []);
      }
      this.listeners.get('pageChange')!.push(listener);

      console.log('Page change listener registered');

      return () => {
        webflow.off('pageChange', callback);
        const listeners = this.listeners.get('pageChange');
        if (listeners) {
          const index = listeners.findIndex(l => l.id === listenerId);
          if (index > -1) listeners.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('Failed to register page change listener:', error);
      return () => {};
    }
  }

  /**
   * Listen for element deletion
   */
  onElementDeleted(callback: DeleteEventCallback): () => void {
    try {
      webflow.on('elementDelete', (elementId: string) => {
        callback(elementId);
      });

      const listenerId = `listener-${++this.listenerCounter}`;
      const listener: RegisteredListener = {
        id: listenerId,
        event: 'elementDelete',
        callback,
        createdAt: new Date()
      };

      if (!this.listeners.has('elementDelete')) {
        this.listeners.set('elementDelete', []);
      }
      this.listeners.get('elementDelete')!.push(listener);

      console.log('Element delete listener registered');

      return () => {
        webflow.off('elementDelete', () => {});
        const listeners = this.listeners.get('elementDelete');
        if (listeners) {
          const index = listeners.findIndex(l => l.id === listenerId);
          if (index > -1) listeners.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('Failed to register delete listener:', error);
      return () => {};
    }
  }

  /**
   * Listen for property changes
   */
  onPropertyChanged(callback: PropertyChangeCallback): () => void {
    try {
      webflow.on('propertyChange', (data: any) => {
        callback(data.elementId, data.property, data.value);
      });

      const listenerId = `listener-${++this.listenerCounter}`;
      const listener: RegisteredListener = {
        id: listenerId,
        event: 'propertyChange',
        callback,
        createdAt: new Date()
      };

      if (!this.listeners.has('propertyChange')) {
        this.listeners.set('propertyChange', []);
      }
      this.listeners.get('propertyChange')!.push(listener);

      console.log('Property change listener registered');

      return () => {
        webflow.off('propertyChange', () => {});
        const listeners = this.listeners.get('propertyChange');
        if (listeners) {
          const index = listeners.findIndex(l => l.id === listenerId);
          if (index > -1) listeners.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('Failed to register property change listener:', error);
      return () => {};
    }
  }

  /**
   * Listen for element creation
   */
  onElementCreated(callback: (element: webflow.Element) => void): () => void {
    try {
      webflow.on('elementCreate', callback);

      const listenerId = `listener-${++this.listenerCounter}`;
      const listener: RegisteredListener = {
        id: listenerId,
        event: 'elementCreate',
        callback,
        createdAt: new Date()
      };

      if (!this.listeners.has('elementCreate')) {
        this.listeners.set('elementCreate', []);
      }
      this.listeners.get('elementCreate')!.push(listener);

      console.log('Element create listener registered');

      return () => {
        webflow.off('elementCreate', callback);
        const listeners = this.listeners.get('elementCreate');
        if (listeners) {
          const index = listeners.findIndex(l => l.id === listenerId);
          if (index > -1) listeners.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('Failed to register create listener:', error);
      return () => {};
    }
  }

  /**
   * Get all registered listeners
   */
  getAllListeners(): RegisteredListener[] {
    const allListeners: RegisteredListener[] = [];

    for (const listeners of this.listeners.values()) {
      allListeners.push(...listeners);
    }

    return allListeners;
  }

  /**
   * Get listeners by event type
   */
  getListenersByEvent(eventType: string): RegisteredListener[] {
    return this.listeners.get(eventType) || [];
  }

  /**
   * Unsubscribe all listeners
   */
  unsubscribeAll(): void {
    for (const [eventType, listeners] of this.listeners.entries()) {
      for (const listener of listeners) {
        webflow.off(eventType as any, listener.callback as any);
      }
    }
    this.listeners.clear();
    console.log('All listeners unsubscribed');
  }

  /**
   * Unsubscribe listeners by event type
   */
  unsubscribeByEvent(eventType: string): number {
    const listeners = this.listeners.get(eventType) || [];
    const count = listeners.length;

    for (const listener of listeners) {
      webflow.off(eventType as any, listener.callback as any);
    }

    this.listeners.delete(eventType);
    console.log(`Unsubscribed ${count} listener(s) from ${eventType}`);
    return count;
  }

  /**
   * Get listener statistics
   */
  getListenerStats(): object {
    const stats: any = {
      totalListeners: this.getAllListeners().length,
      byEvent: {}
    };

    for (const [eventType, listeners] of this.listeners.entries()) {
      stats.byEvent[eventType] = listeners.length;
    }

    return stats;
  }

  /**
   * Create debounced event handler
   */
  debounce(
    callback: Function,
    delay: number = 300
  ): (...args: any[]) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  /**
   * Create throttled event handler
   */
  throttle(
    callback: Function,
    delay: number = 300
  ): (...args: any[]) => void {
    let lastCall = 0;

    return (...args: any[]) => {
      const now = Date.now();

      if (now - lastCall >= delay) {
        callback(...args);
        lastCall = now;
      }
    };
  }

  /**
   * Listen for element selected with debounce
   */
  onElementSelectedDebounced(
    callback: ElementEventCallback,
    delay?: number
  ): () => void {
    const debouncedCallback = this.debounce(callback, delay);
    return this.onElementSelected(debouncedCallback as ElementEventCallback);
  }

  /**
   * Listen for property changed with throttle
   */
  onPropertyChangedThrottled(
    callback: PropertyChangeCallback,
    delay?: number
  ): () => void {
    const throttledCallback = this.throttle(callback, delay);
    return this.onPropertyChanged(throttledCallback as PropertyChangeCallback);
  }
}

/**
 * Quick helper functions
 */

/**
 * Subscribe to selection changes
 */
export function onElementSelected(
  callback: ElementEventCallback
): () => void {
  const manager = new EventManager();
  return manager.onElementSelected(callback);
}

/**
 * Subscribe to page changes
 */
export function onPageChanged(callback: PageEventCallback): () => void {
  const manager = new EventManager();
  return manager.onPageChanged(callback);
}

/**
 * Subscribe to element deletion
 */
export function onElementDeleted(callback: DeleteEventCallback): () => void {
  const manager = new EventManager();
  return manager.onElementDeleted(callback);
}

/**
 * Subscribe to property changes
 */
export function onPropertyChanged(
  callback: PropertyChangeCallback
): () => void {
  const manager = new EventManager();
  return manager.onPropertyChanged(callback);
}

export default EventManager;
