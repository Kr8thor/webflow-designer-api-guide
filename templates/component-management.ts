/**
 * Component Management Template
 *
 * Comprehensive guide for working with Webflow Designer components
 * including creation, updates, instance management, and organization.
 *
 * @example
 * ```typescript
 * const manager = new ComponentManager(webflow)
 * const component = await manager.createButton('Primary Button')
 * const instance = await manager.createInstance(component.id)
 * await manager.renameComponent(component.id, 'Secondary Button')
 * ```
 */

import type { WebflowDesignerAPI, Element } from '@webflow/designer'

/**
 * Component information structure
 */
interface ComponentInfo {
  id: string
  name: string
  description?: string
  createdAt: Date
  modifiedAt: Date
  componentCount: number
  instances: number
  tags?: string[]
}

/**
 * Component creation options
 */
interface CreateComponentOptions {
  name: string
  description?: string
  tags?: string[]
}

/**
 * Component update options
 */
interface UpdateComponentOptions {
  name?: string
  description?: string
  tags?: string[]
}

/**
 * Main component manager class
 */
export class ComponentManager {
  private webflow: WebflowDesignerAPI
  private cache: Map<string, ComponentInfo> = new Map()

  constructor(webflow: WebflowDesignerAPI) {
    this.webflow = webflow
  }

  /**
   * Create a new component
   *
   * @param options - Component creation options
   * @returns Created component info
   */
  async createComponent(options: CreateComponentOptions): Promise<ComponentInfo> {
    try {
      // Get root element
      const root = await this.webflow.getRootElement()

      // Create component container
      const componentElement = await root.appendChild('div')
      await componentElement.setClassName('component-wrapper')

      // Set component metadata
      const component: ComponentInfo = {
        id: this.generateId(),
        name: options.name,
        description: options.description,
        createdAt: new Date(),
        modifiedAt: new Date(),
        componentCount: 0,
        instances: 0,
        tags: options.tags || []
      }

      // Cache it
      this.cache.set(component.id, component)

      return component
    } catch (error) {
      throw new Error(`Failed to create component: ${error}`)
    }
  }

  /**
   * Get component by ID
   *
   * @param id - Component ID
   * @returns Component info
   */
  async getComponent(id: string): Promise<ComponentInfo | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!
    }

    // If not in cache, return null
    return null
  }

  /**
   * List all components
   *
   * @returns Array of component info
   */
  async listComponents(): Promise<ComponentInfo[]> {
    return Array.from(this.cache.values())
  }

  /**
   * Rename component
   *
   * @param id - Component ID
   * @param newName - New component name
   */
  async renameComponent(id: string, newName: string): Promise<void> {
    const component = this.cache.get(id)
    if (!component) {
      throw new Error(`Component ${id} not found`)
    }

    component.name = newName
    component.modifiedAt = new Date()
  }

  /**
   * Update component metadata
   *
   * @param id - Component ID
   * @param updates - Updates to apply
   */
  async updateComponent(
    id: string,
    updates: UpdateComponentOptions
  ): Promise<void> {
    const component = this.cache.get(id)
    if (!component) {
      throw new Error(`Component ${id} not found`)
    }

    if (updates.name) component.name = updates.name
    if (updates.description) component.description = updates.description
    if (updates.tags) component.tags = updates.tags

    component.modifiedAt = new Date()
  }

  /**
   * Create instance of component
   *
   * @param componentId - Component ID to instantiate
   * @returns Created instance element
   */
  async createInstance(componentId: string): Promise<Element> {
    const component = this.cache.get(componentId)
    if (!component) {
      throw new Error(`Component ${componentId} not found`)
    }

    try {
      // Get root and create instance
      const root = await this.webflow.getRootElement()
      const instance = await root.appendChild('div')

      // Mark as instance
      await instance.setClassName(`component-instance-${componentId}`)

      // Update component stats
      component.instances++
      component.modifiedAt = new Date()

      return instance
    } catch (error) {
      throw new Error(`Failed to create instance: ${error}`)
    }
  }

  /**
   * Delete component
   *
   * @param id - Component ID
   */
  async deleteComponent(id: string): Promise<void> {
    const component = this.cache.get(id)
    if (!component) {
      throw new Error(`Component ${id} not found`)
    }

    // Remove from cache
    this.cache.delete(id)
  }

  /**
   * Search components by name or tag
   *
   * @param query - Search query
   * @returns Matching components
   */
  async searchComponents(query: string): Promise<ComponentInfo[]> {
    const lowerQuery = query.toLowerCase()

    return Array.from(this.cache.values()).filter(
      comp =>
        comp.name.toLowerCase().includes(lowerQuery) ||
        comp.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Get components by tag
   *
   * @param tag - Tag to search for
   * @returns Components with tag
   */
  async getComponentsByTag(tag: string): Promise<ComponentInfo[]> {
    return Array.from(this.cache.values()).filter(
      comp => comp.tags?.includes(tag)
    )
  }

  /**
   * Bulk create components from templates
   *
   * @param templates - Array of component templates
   * @returns Created components
   */
  async createFromTemplates(
    templates: CreateComponentOptions[]
  ): Promise<ComponentInfo[]> {
    const created: ComponentInfo[] = []

    for (const template of templates) {
      const component = await this.createComponent(template)
      created.push(component)
    }

    return created
  }

  /**
   * Clone component
   *
   * @param componentId - Component to clone
   * @param newName - Name for cloned component
   * @returns Cloned component
   */
  async cloneComponent(componentId: string, newName: string): Promise<ComponentInfo> {
    const original = this.cache.get(componentId)
    if (!original) {
      throw new Error(`Component ${componentId} not found`)
    }

    return this.createComponent({
      name: newName,
      description: `Clone of ${original.name}`,
      tags: [...(original.tags || [])]
    })
  }

  /**
   * Export component structure as JSON
   *
   * @param componentId - Component to export
   * @returns JSON representation
   */
  async exportComponent(componentId: string): Promise<string> {
    const component = this.cache.get(componentId)
    if (!component) {
      throw new Error(`Component ${componentId} not found`)
    }

    return JSON.stringify(component, null, 2)
  }

  /**
   * Get component statistics
   *
   * @returns Statistics object
   */
  async getStatistics(): Promise<{
    totalComponents: number
    totalInstances: number
    mostUsed: ComponentInfo | null
    averageInstancesPerComponent: number
  }> {
    const components = Array.from(this.cache.values())

    if (components.length === 0) {
      return {
        totalComponents: 0,
        totalInstances: 0,
        mostUsed: null,
        averageInstancesPerComponent: 0
      }
    }

    const totalInstances = components.reduce((sum, c) => sum + c.instances, 0)
    const mostUsed = components.reduce((max, c) =>
      c.instances > max.instances ? c : max
    )

    return {
      totalComponents: components.length,
      totalInstances,
      mostUsed,
      averageInstancesPerComponent: totalInstances / components.length
    }
  }

  /**
   * Organize components into logical groups
   *
   * @returns Components organized by prefix
   */
  async organizeByGroup(): Promise<Map<string, ComponentInfo[]>> {
    const grouped = new Map<string, ComponentInfo[]>()

    for (const component of this.cache.values()) {
      // Extract group from name (before first dash)
      const groupMatch = component.name.match(/^([^-]+)/)
      const group = groupMatch ? groupMatch[1] : 'Other'

      if (!grouped.has(group)) {
        grouped.set(group, [])
      }

      grouped.get(group)!.push(component)
    }

    return grouped
  }

  /**
   * Generate unique component ID
   *
   * @private
   * @returns Unique ID
   */
  private generateId(): string {
    return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const manager = new ComponentManager(webflow)
 *
 * // Create components
 * const button = await manager.createComponent({
 *   name: 'Button',
 *   description: 'Primary action button',
 *   tags: ['ui', 'button', 'primary']
 * })
 *
 * // Create instances
 * const instance1 = await manager.createInstance(button.id)
 * const instance2 = await manager.createInstance(button.id)
 *
 * // Search components
 * const buttonComponents = await manager.searchComponents('button')
 * const uiComponents = await manager.getComponentsByTag('ui')
 *
 * // Get statistics
 * const stats = await manager.getStatistics()
 * console.log(`Total components: ${stats.totalComponents}`)
 * console.log(`Total instances: ${stats.totalInstances}`)
 *
 * // Organize components
 * const organized = await manager.organizeByGroup()
 * for (const [group, components] of organized.entries()) {
 *   console.log(`${group}: ${components.length} components`)
 * }
 *
 * // Clone component
 * const cloned = await manager.cloneComponent(button.id, 'Button Secondary')
 *
 * // Export for backup
 * const json = await manager.exportComponent(button.id)
 * ```
 */
