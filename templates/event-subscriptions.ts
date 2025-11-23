/**
 * Event Subscriptions Template
 *
 * Comprehensive guide for subscribing to Webflow Designer events
 * and responding to user interactions.
 *
 * @example
 * ```typescript
 * const events = new EventSubscriber(webflow)
 * events.on('elementSelected', (element) => console.log(element))
 * events.on('pageChanged', (page) => refreshUI(page))
 * ```
 */

import type { WebflowDesignerAPI } from '@webflow/designer'

/**
 * Event types
 */
type EventType =
  | 'elementSelected'
  | 'elementDeselected'
  | 'elementCreated'
  | 'elementDeleted'
  | 'elementUpdated'
  | 'pageChanged'
  | 'pageCreated'
  | 'pageDeleted'
  | 'breakpointChanged'
  | 'canvasChanged'
  | 'selectionChanged'
  | 'propertiesUpdated'

/**
 * Event subscription callback
 */
type EventCallback = (data: any) => Promise<void> | void

/**
 * Subscription metadata
 */
interface Subscription {
  id: string
  event: EventType
  callback: EventCallback
  enabled: boolean
  createdAt: Date
}

/**
 * Event metadata
 */
interface EventMetadata {
  type: EventType
  timestamp: Date
  data?: any
  source?: string
}

/**
 * Main event subscriber class
 */
export class EventSubscriber {
  private webflow: WebflowDesignerAPI
  private subscriptions: Map<string, Subscription> = new Map()
  private eventHistory: EventMetadata[] = []
  private maxHistorySize = 100

  constructor(webflow: WebflowDesignerAPI) {
    this.webflow = webflow
    this.setupDefaultListeners()
  }

  /**
   * Subscribe to an event
   *
   * @param event - Event type
   * @param callback - Callback function
   * @returns Subscription ID
   */
  on(event: EventType, callback: EventCallback): string {
    const subscription: Subscription = {
      id: this.generateId(),
      event,
      callback,
      enabled: true,
      createdAt: new Date()
    }

    this.subscriptions.set(subscription.id, subscription)
    return subscription.id
  }

  /**
   * Subscribe to event once
   *
   * @param event - Event type
   * @param callback - Callback function
   * @returns Subscription ID
   */
  once(event: EventType, callback: EventCallback): string {
    const wrappedCallback = async (data: any) => {
      await callback(data)
      this.unsubscribe(subId)
    }

    const subId = this.on(event, wrappedCallback)
    return subId
  }

  /**
   * Unsubscribe from event
   *
   * @param subscriptionId - Subscription ID
   */
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId)
  }

  /**
   * List all subscriptions
   *
   * @returns All subscriptions
   */
  listSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values())
  }

  /**
   * List subscriptions for event
   *
   * @param event - Event type
   * @returns Subscriptions for event
   */
  listSubscriptionsForEvent(event: EventType): Subscription[] {
    return Array.from(this.subscriptions.values()).filter(s => s.event === event)
  }

  /**
   * Disable subscription
   *
   * @param subscriptionId - Subscription ID
   */
  disableSubscription(subscriptionId: string): void {
    const sub = this.subscriptions.get(subscriptionId)
    if (sub) {
      sub.enabled = false
    }
  }

  /**
   * Enable subscription
   *
   * @param subscriptionId - Subscription ID
   */
  enableSubscription(subscriptionId: string): void {
    const sub = this.subscriptions.get(subscriptionId)
    if (sub) {
      sub.enabled = true
    }
  }

  /**
   * Emit event
   *
   * @private
   */
  private async emit(event: EventType, data?: any): Promise<void> {
    // Record in history
    this.addToHistory({ type: event, timestamp: new Date(), data })

    // Call all subscriptions
    const subs = this.listSubscriptionsForEvent(event)

    for (const sub of subs) {
      if (sub.enabled) {
        try {
          await sub.callback(data)
        } catch (error) {
          console.error(`Error in ${event} handler:`, error)
        }
      }
    }
  }

  /**
   * Get event history
   *
   * @param limit - Max events to return
   * @returns Recent events
   */
  getHistory(limit: number = 10): EventMetadata[] {
    return this.eventHistory.slice(-limit)
  }

  /**
   * Get history for specific event
   *
   * @param event - Event type
   * @param limit - Max events to return
   * @returns Filtered events
   */
  getHistoryForEvent(event: EventType, limit: number = 10): EventMetadata[] {
    return this.eventHistory
      .filter(e => e.type === event)
      .slice(-limit)
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.eventHistory = []
  }

  /**
   * Setup default listeners
   *
   * @private
   */
  private setupDefaultListeners(): void {
    // Element events
    this.setupElementListeners()

    // Page events
    this.setupPageListeners()

    // Canvas events
    this.setupCanvasListeners()
  }

  /**
   * Setup element event listeners
   *
   * @private
   */
  private setupElementListeners(): void {
    // Element selection
    document.addEventListener('webflow:elementSelected', (e: any) => {
      this.emit('elementSelected', e.detail)
    })

    document.addEventListener('webflow:elementDeselected', (e: any) => {
      this.emit('elementDeselected', e.detail)
    })

    // Element changes
    document.addEventListener('webflow:elementCreated', (e: any) => {
      this.emit('elementCreated', e.detail)
    })

    document.addEventListener('webflow:elementDeleted', (e: any) => {
      this.emit('elementDeleted', e.detail)
    })

    document.addEventListener('webflow:elementUpdated', (e: any) => {
      this.emit('elementUpdated', e.detail)
    })
  }

  /**
   * Setup page event listeners
   *
   * @private
   */
  private setupPageListeners(): void {
    document.addEventListener('webflow:pageChanged', (e: any) => {
      this.emit('pageChanged', e.detail)
    })

    document.addEventListener('webflow:pageCreated', (e: any) => {
      this.emit('pageCreated', e.detail)
    })

    document.addEventListener('webflow:pageDeleted', (e: any) => {
      this.emit('pageDeleted', e.detail)
    })
  }

  /**
   * Setup canvas event listeners
   *
   * @private
   */
  private setupCanvasListeners(): void {
    document.addEventListener('webflow:breakpointChanged', (e: any) => {
      this.emit('breakpointChanged', e.detail)
    })

    document.addEventListener('webflow:canvasChanged', (e: any) => {
      this.emit('canvasChanged', e.detail)
    })
  }

  /**
   * Add event to history
   *
   * @private
   */
  private addToHistory(event: EventMetadata): void {
    this.eventHistory.push(event)

    // Keep history size manageable
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize)
    }
  }

  /**
   * Generate unique subscription ID
   *
   * @private
   */
  private generateId(): string {
    return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Event-driven state manager
 *
 * Useful for managing application state based on events
 */
export class EventDrivenState {
  private state: Record<string, any> = {}
  private subscribers: EventSubscriber

  constructor(subscribers: EventSubscriber) {
    this.subscribers = subscribers
    this.setupStateSync()
  }

  /**
   * Get current state
   *
   * @returns Current state object
   */
  getState(): Record<string, any> {
    return { ...this.state }
  }

  /**
   * Update state
   *
   * @param updates - Partial state updates
   */
  setState(updates: Record<string, any>): void {
    this.state = { ...this.state, ...updates }
  }

  /**
   * Setup state synchronization with events
   *
   * @private
   */
  private setupStateSync(): void {
    // Track selected element
    this.subscribers.on('elementSelected', (element) => {
      this.setState({ selectedElement: element })
    })

    this.subscribers.on('elementDeselected', () => {
      this.setState({ selectedElement: null })
    })

    // Track current page
    this.subscribers.on('pageChanged', (page) => {
      this.setState({ currentPage: page })
    })

    // Track breakpoint
    this.subscribers.on('breakpointChanged', (breakpoint) => {
      this.setState({ currentBreakpoint: breakpoint })
    })
  }
}

/**
 * Event batch processor
 *
 * Useful for debouncing rapid events
 */
export class EventBatcher {
  private batch: EventMetadata[] = []
  private timer: NodeJS.Timeout | null = null
  private callback: (events: EventMetadata[]) => void
  private delay: number

  constructor(callback: (events: EventMetadata[]) => void, delay: number = 500) {
    this.callback = callback
    this.delay = delay
  }

  /**
   * Add event to batch
   *
   * @param event - Event to batch
   */
  addEvent(event: EventMetadata): void {
    this.batch.push(event)
    this.resetTimer()
  }

  /**
   * Process batch immediately
   */
  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.batch.length > 0) {
      this.callback(this.batch)
      this.batch = []
    }
  }

  /**
   * Reset timer
   *
   * @private
   */
  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.flush()
    }, this.delay)
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const events = new EventSubscriber(webflow)
 *
 * // Subscribe to element selection
 * events.on('elementSelected', (element) => {
 *   console.log('Selected:', element.name)
 *   updateProperties(element)
 * })
 *
 * // Subscribe to page changes
 * events.on('pageChanged', (page) => {
 *   console.log('Page changed:', page.name)
 *   refreshPageSettings(page)
 * })
 *
 * // Subscribe once
 * events.once('breakpointChanged', (breakpoint) => {
 *   console.log('First breakpoint change:', breakpoint)
 * })
 *
 * // Event state management
 * const state = new EventDrivenState(events)
 * console.log('Current state:', state.getState())
 *
 * // Event batching
 * const batcher = new EventBatcher((events) => {
 *   console.log(`Processed ${events.length} events`)
 * }, 1000)
 *
 * events.on('elementUpdated', (element) => {
 *   batcher.addEvent({
 *     type: 'elementUpdated',
 *     timestamp: new Date(),
 *     data: element
 *   })
 * })
 *
 * // Get event history
 * const recent = events.getHistory(5)
 * console.log('Recent events:', recent)
 * ```
 */
