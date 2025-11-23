/**
 * Hybrid App Setup Template
 *
 * Complete setup for hybrid Webflow apps that combine Designer Extension
 * and Data Client functionality for powerful, full-featured applications.
 *
 * @example
 * ```typescript
 * const hybrid = new HybridAppManager(webflow, oauth)
 * await hybrid.initialize()
 * const designerData = await hybrid.getDesignerContext()
 * const siteData = await hybrid.fetchSiteData()
 * ```
 */

import type { WebflowDesignerAPI } from '@webflow/designer'
import { OAuth2Client, AuthenticatedFetcher } from './authentication-oauth'

/**
 * Hybrid app context
 */
interface HybridContext {
  designerContext: DesignerContext | null
  dataContext: DataContext | null
  user: UserInfo | null
  workspace: WorkspaceInfo | null
}

/**
 * Designer context (from Designer API)
 */
interface DesignerContext {
  site: {
    id: string
    name: string
    workspaceId: string
  }
  page: {
    id: string
    name: string
    slug: string
  }
  selectedElement: any
}

/**
 * Data context (from Data API)
 */
interface DataContext {
  site: {
    id: string
    name: string
    shortName?: string
  }
  collections: Collection[]
  customFields: CustomField[]
}

/**
 * User information
 */
interface UserInfo {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
}

/**
 * Workspace information
 */
interface WorkspaceInfo {
  id: string
  name: string
  plan: 'free' | 'basic' | 'professional' | 'business'
}

/**
 * Collection structure
 */
interface Collection {
  id: string
  slug: string
  displayName: string
  singularName: string
  fields: CustomField[]
}

/**
 * Custom field
 */
interface CustomField {
  id: string
  slug: string
  displayName: string
  type: string
  required: boolean
}

/**
 * Main hybrid app manager
 */
export class HybridAppManager {
  private webflow: WebflowDesignerAPI
  private oauth: OAuth2Client
  private fetcher: AuthenticatedFetcher
  private context: HybridContext = {
    designerContext: null,
    dataContext: null,
    user: null,
    workspace: null
  }
  private apiBaseUrl = 'https://api.webflow.com'
  private apiVersion = 'v2'

  constructor(webflow: WebflowDesignerAPI, oauth: OAuth2Client) {
    this.webflow = webflow
    this.oauth = oauth
    this.fetcher = new AuthenticatedFetcher(oauth)
  }

  /**
   * Initialize hybrid app
   *
   * Load both designer and data contexts
   */
  async initialize(): Promise<HybridContext> {
    try {
      // Load contexts in parallel
      const [designer, data] = await Promise.all([
        this.loadDesignerContext(),
        this.loadDataContext()
      ])

      this.context = {
        designerContext: designer,
        dataContext: data,
        user: await this.loadUserInfo(),
        workspace: await this.loadWorkspaceInfo()
      }

      return this.context
    } catch (error) {
      throw new Error(`Failed to initialize hybrid app: ${error}`)
    }
  }

  /**
   * Get current context
   *
   * @returns Hybrid context
   */
  getContext(): HybridContext {
    return this.context
  }

  /**
   * Load designer context
   *
   * @private
   */
  private async loadDesignerContext(): Promise<DesignerContext | null> {
    try {
      const root = await this.webflow.getRootElement()
      const page = await this.webflow.getSelectedElement() // May be null

      // Build context
      return {
        site: {
          id: 'site-id', // Extract from root
          name: 'Site Name',
          workspaceId: 'workspace-id'
        },
        page: page ? {
          id: 'page-id',
          name: 'Page Name',
          slug: 'page-slug'
        } : {
          id: '',
          name: '',
          slug: ''
        },
        selectedElement: page
      }
    } catch (error) {
      console.error('Failed to load designer context:', error)
      return null
    }
  }

  /**
   * Load data context
   *
   * @private
   */
  private async loadDataContext(): Promise<DataContext | null> {
    try {
      // Fetch site info
      const siteId = this.extractSiteId()
      if (!siteId) return null

      const site = await this.fetcher.json(`${this.apiBaseUrl}/${this.apiVersion}/sites/${siteId}`)

      // Fetch collections
      const collections = await this.fetcher.json<Collection[]>(
        `${this.apiBaseUrl}/${this.apiVersion}/sites/${siteId}/collections`
      )

      return {
        site,
        collections: collections || [],
        customFields: this.extractCustomFields(collections)
      }
    } catch (error) {
      console.error('Failed to load data context:', error)
      return null
    }
  }

  /**
   * Load user information
   *
   * @private
   */
  private async loadUserInfo(): Promise<UserInfo | null> {
    try {
      return await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/user`
      )
    } catch (error) {
      console.error('Failed to load user info:', error)
      return null
    }
  }

  /**
   * Load workspace information
   *
   * @private
   */
  private async loadWorkspaceInfo(): Promise<WorkspaceInfo | null> {
    try {
      const workspace = await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/workspace`
      )
      return workspace
    } catch (error) {
      console.error('Failed to load workspace info:', error)
      return null
    }
  }

  /**
   * Fetch site data
   *
   * Get all data for a site including pages, collections, etc.
   */
  async fetchSiteData(siteId: string): Promise<any> {
    try {
      const site = await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/sites/${siteId}`
      )

      const pages = await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/sites/${siteId}/pages`
      )

      const collections = await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/sites/${siteId}/collections`
      )

      return {
        site,
        pages,
        collections
      }
    } catch (error) {
      throw new Error(`Failed to fetch site data: ${error}`)
    }
  }

  /**
   * Get collection items
   *
   * @param collectionId - Collection ID
   * @param limit - Max items to fetch
   * @returns Collection items
   */
  async getCollectionItems(collectionId: string, limit: number = 100): Promise<any[]> {
    try {
      const items = await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/collections/${collectionId}/items?limit=${limit}`
      )
      return items
    } catch (error) {
      throw new Error(`Failed to fetch collection items: ${error}`)
    }
  }

  /**
   * Create collection item
   *
   * @param collectionId - Collection ID
   * @param data - Item data
   * @returns Created item
   */
  async createCollectionItem(collectionId: string, data: Record<string, any>): Promise<any> {
    try {
      const item = await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/collections/${collectionId}/items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )
      return item
    } catch (error) {
      throw new Error(`Failed to create collection item: ${error}`)
    }
  }

  /**
   * Update collection item
   *
   * @param collectionId - Collection ID
   * @param itemId - Item ID
   * @param data - Updated data
   */
  async updateCollectionItem(
    collectionId: string,
    itemId: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      await this.fetcher.json(
        `${this.apiBaseUrl}/${this.apiVersion}/collections/${collectionId}/items/${itemId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )
    } catch (error) {
      throw new Error(`Failed to update collection item: ${error}`)
    }
  }

  /**
   * Delete collection item
   *
   * @param collectionId - Collection ID
   * @param itemId - Item ID
   */
  async deleteCollectionItem(collectionId: string, itemId: string): Promise<void> {
    try {
      const response = await this.fetcher.fetch(
        `${this.apiBaseUrl}/${this.apiVersion}/collections/${collectionId}/items/${itemId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`)
      }
    } catch (error) {
      throw new Error(`Failed to delete collection item: ${error}`)
    }
  }

  /**
   * Sync designer changes to data
   *
   * Update data when designer makes changes
   */
  async syncDesignerChangesToData(
    collectionId: string,
    itemId: string,
    designerElement: any
  ): Promise<void> {
    const data = this.extractDataFromElement(designerElement)
    await this.updateCollectionItem(collectionId, itemId, data)
  }

  /**
   * Update designer from data
   *
   * Refresh designer when data changes
   */
  async updateDesignerFromData(itemData: Record<string, any>): Promise<void> {
    const selected = this.context.designerContext?.selectedElement
    if (!selected) return

    // Update element properties from data
    await selected.updateProperties(itemData)
  }

  /**
   * Extract site ID
   *
   * @private
   */
  private extractSiteId(): string {
    // Implementation depends on how site ID is passed
    return 'site-id'
  }

  /**
   * Extract custom fields from collections
   *
   * @private
   */
  private extractCustomFields(collections: Collection[]): CustomField[] {
    const fields: CustomField[] = []

    for (const collection of collections) {
      fields.push(...collection.fields)
    }

    return fields
  }

  /**
   * Extract data from element
   *
   * @private
   */
  private extractDataFromElement(element: any): Record<string, any> {
    // Extract relevant data from designer element
    return {
      name: element.getName(),
      text: element.getTextContent?.()
    }
  }
}

/**
 * State synchronizer for hybrid apps
 *
 * Keep designer and data in sync
 */
export class HybridStateSynchronizer {
  private manager: HybridAppManager
  private syncRules: Map<string, Function> = new Map()
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map()

  constructor(manager: HybridAppManager) {
    this.manager = manager
  }

  /**
   * Register sync rule
   *
   * @param eventType - Event type to listen for
   * @param syncFn - Function to call on event
   */
  registerSyncRule(eventType: string, syncFn: Function): void {
    this.syncRules.set(eventType, syncFn)
  }

  /**
   * Sync with debounce
   *
   * @param key - Debounce key
   * @param fn - Function to sync
   * @param delay - Debounce delay
   */
  syncDebounced(key: string, fn: () => Promise<void>, delay: number = 500): void {
    const existing = this.debounceTimers.get(key)
    if (existing) {
      clearTimeout(existing)
    }

    const timer = setTimeout(async () => {
      try {
        await fn()
      } catch (error) {
        console.error('Sync failed:', error)
      }
      this.debounceTimers.delete(key)
    }, delay)

    this.debounceTimers.set(key, timer)
  }

  /**
   * Clear all timers
   */
  clearAllTimers(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }
    this.debounceTimers.clear()
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const oauth = new OAuth2Client(config)
 * const hybrid = new HybridAppManager(webflow, oauth)
 *
 * // Initialize
 * const context = await hybrid.initialize()
 * console.log('Site:', context.designerContext?.site)
 * console.log('Collections:', context.dataContext?.collections)
 *
 * // Work with collections
 * const items = await hybrid.getCollectionItems('collection-id')
 * const newItem = await hybrid.createCollectionItem('collection-id', {
 *   name: 'New Item',
 *   slug: 'new-item'
 * })
 *
 * // Sync data
 * const synchronizer = new HybridStateSynchronizer(hybrid)
 *
 * synchronizer.syncDebounced('element-update', async () => {
 *   const selected = context.designerContext?.selectedElement
 *   if (selected) {
 *     await hybrid.updateDesignerFromData({ name: 'Updated' })
 *   }
 * }, 500)
 * ```
 */
