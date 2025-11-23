/**
 * Page Operations Template
 *
 * Comprehensive guide for managing pages, page settings, SEO metadata,
 * and page-level operations in Webflow.
 *
 * @example
 * ```typescript
 * const pageMgr = new PageManager(webflow)
 * const page = await pageMgr.createPage('Home', '/home')
 * await pageMgr.setMetadata(page.id, { title: 'Welcome' })
 * const pages = await pageMgr.listPages()
 * ```
 */

import type { WebflowDesignerAPI } from '@webflow/designer'

/**
 * Page information
 */
interface Page {
  id: string
  name: string
  slug: string
  title?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  status: 'draft' | 'published' | 'archived'
  order: number
}

/**
 * SEO metadata
 */
interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  robots?: string
  author?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  twitterCreator?: string
  twitterImage?: string
}

/**
 * Open Graph metadata
 */
interface OpenGraphMetadata {
  title: string
  description: string
  image: string
  url: string
  type?: string
  locale?: string
}

/**
 * Page settings
 */
interface PageSettings {
  layout?: string
  template?: string
  customCode?: {
    head?: string
    body?: string
  }
  favicon?: string
  password?: string
  published: boolean
}

/**
 * Main page manager class
 */
export class PageManager {
  private webflow: WebflowDesignerAPI
  private pages: Map<string, Page> = new Map()
  private metadata: Map<string, SEOMetadata> = new Map()

  constructor(webflow: WebflowDesignerAPI) {
    this.webflow = webflow
  }

  /**
   * Create a new page
   *
   * @param name - Page name
   * @param slug - Page slug/URL
   * @returns Created page
   */
  async createPage(name: string, slug: string): Promise<Page> {
    // Validate slug
    if (!this.isValidSlug(slug)) {
      throw new Error('Invalid slug format')
    }

    // Check for duplicates
    const existing = Array.from(this.pages.values()).find(p => p.slug === slug)
    if (existing) {
      throw new Error(`Page with slug "${slug}" already exists`)
    }

    const page: Page = {
      id: this.generateId(),
      name,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
      status: 'draft',
      order: this.pages.size
    }

    this.pages.set(page.id, page)
    return page
  }

  /**
   * Get page by ID
   *
   * @param id - Page ID
   * @returns Page or null
   */
  async getPage(id: string): Promise<Page | null> {
    return this.pages.get(id) || null
  }

  /**
   * Get page by slug
   *
   * @param slug - Page slug
   * @returns Page or null
   */
  async getPageBySlug(slug: string): Promise<Page | null> {
    for (const page of this.pages.values()) {
      if (page.slug === slug) return page
    }
    return null
  }

  /**
   * List all pages
   *
   * @returns All pages
   */
  async listPages(): Promise<Page[]> {
    return Array.from(this.pages.values()).sort((a, b) => a.order - b.order)
  }

  /**
   * List published pages
   *
   * @returns Published pages only
   */
  async listPublishedPages(): Promise<Page[]> {
    return Array.from(this.pages.values())
      .filter(p => p.published && p.status === 'published')
      .sort((a, b) => a.order - b.order)
  }

  /**
   * Rename page
   *
   * @param id - Page ID
   * @param newName - New name
   */
  async renamePage(id: string, newName: string): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    page.name = newName
    page.updatedAt = new Date()
  }

  /**
   * Update page slug
   *
   * @param id - Page ID
   * @param newSlug - New slug
   */
  async updatePageSlug(id: string, newSlug: string): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    if (!this.isValidSlug(newSlug)) {
      throw new Error('Invalid slug format')
    }

    // Check for duplicates
    const existing = Array.from(this.pages.values()).find(p => p.slug === newSlug && p.id !== id)
    if (existing) {
      throw new Error(`Page with slug "${newSlug}" already exists`)
    }

    page.slug = newSlug
    page.updatedAt = new Date()
  }

  /**
   * Set SEO metadata for page
   *
   * @param id - Page ID
   * @param seo - SEO metadata
   */
  async setSEOMetadata(id: string, seo: Partial<SEOMetadata>): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    const existing = this.metadata.get(id) || {}
    const updated = { ...existing, ...seo } as SEOMetadata

    // Validate
    if (!updated.title || !updated.description) {
      throw new Error('Title and description are required')
    }

    this.metadata.set(id, updated)
    page.title = updated.title
    page.description = updated.description
    page.updatedAt = new Date()
  }

  /**
   * Get SEO metadata for page
   *
   * @param id - Page ID
   * @returns SEO metadata or null
   */
  async getSEOMetadata(id: string): Promise<SEOMetadata | null> {
    return this.metadata.get(id) || null
  }

  /**
   * Set Open Graph metadata
   *
   * @param id - Page ID
   * @param og - Open Graph metadata
   */
  async setOpenGraphMetadata(id: string, og: Partial<OpenGraphMetadata>): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    const existing = this.metadata.get(id) || {}
    const updated: SEOMetadata = {
      ...existing,
      ogTitle: og.title,
      ogDescription: og.description,
      ogImage: og.image,
      ogType: og.type
    }

    this.metadata.set(id, updated)
    page.updatedAt = new Date()
  }

  /**
   * Publish page
   *
   * @param id - Page ID
   */
  async publishPage(id: string): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    // Check requirements
    const seo = this.metadata.get(id)
    if (!seo?.title || !seo?.description) {
      throw new Error('SEO metadata required before publishing')
    }

    page.published = true
    page.status = 'published'
    page.updatedAt = new Date()
  }

  /**
   * Unpublish page
   *
   * @param id - Page ID
   */
  async unpublishPage(id: string): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    page.published = false
    page.status = 'draft'
    page.updatedAt = new Date()
  }

  /**
   * Archive page
   *
   * @param id - Page ID
   */
  async archivePage(id: string): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    page.status = 'archived'
    page.published = false
    page.updatedAt = new Date()
  }

  /**
   * Delete page
   *
   * @param id - Page ID
   */
  async deletePage(id: string): Promise<void> {
    const page = this.pages.get(id)
    if (!page) throw new Error(`Page ${id} not found`)

    this.pages.delete(id)
    this.metadata.delete(id)
  }

  /**
   * Reorder pages
   *
   * @param pageIds - IDs in new order
   */
  async reorderPages(pageIds: string[]): Promise<void> {
    for (let i = 0; i < pageIds.length; i++) {
      const page = this.pages.get(pageIds[i])
      if (page) {
        page.order = i
      }
    }
  }

  /**
   * Duplicate page
   *
   * @param id - Page ID to duplicate
   * @param newName - Name for duplicated page
   * @returns New page
   */
  async duplicatePage(id: string, newName: string): Promise<Page> {
    const original = this.pages.get(id)
    if (!original) throw new Error(`Page ${id} not found`)

    // Generate unique slug
    let newSlug = original.slug + '-copy'
    let counter = 1
    while (Array.from(this.pages.values()).some(p => p.slug === newSlug)) {
      newSlug = `${original.slug}-copy-${counter}`
      counter++
    }

    const newPage = await this.createPage(newName, newSlug)

    // Copy metadata
    const seo = this.metadata.get(id)
    if (seo) {
      await this.setSEOMetadata(newPage.id, { ...seo })
    }

    return newPage
  }

  /**
   * Get page hierarchy
   *
   * @returns Tree structure of pages
   */
  async getPageHierarchy(): Promise<Array<Page & { children: Page[] }>> {
    const pages = await this.listPages()
    // Simple implementation - in real app would handle nested pages
    return pages.map(p => ({ ...p, children: [] }))
  }

  /**
   * Search pages
   *
   * @param query - Search query
   * @returns Matching pages
   */
  async searchPages(query: string): Promise<Page[]> {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.pages.values()).filter(
      p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.slug.toLowerCase().includes(lowerQuery) ||
        p.title?.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get page statistics
   *
   * @returns Statistics object
   */
  async getStatistics(): Promise<{
    totalPages: number
    publishedPages: number
    draftPages: number
    archivedPages: number
  }> {
    const pages = Array.from(this.pages.values())
    return {
      totalPages: pages.length,
      publishedPages: pages.filter(p => p.status === 'published').length,
      draftPages: pages.filter(p => p.status === 'draft').length,
      archivedPages: pages.filter(p => p.status === 'archived').length
    }
  }

  /**
   * Export pages as JSON
   *
   * @returns JSON representation
   */
  async exportPages(): Promise<string> {
    const pages = await this.listPages()
    const data = pages.map(p => ({
      ...p,
      seo: this.metadata.get(p.id)
    }))
    return JSON.stringify(data, null, 2)
  }

  /**
   * Helper: Validate slug format
   *
   * @private
   */
  private isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
  }

  /**
   * Generate unique page ID
   *
   * @private
   */
  private generateId(): string {
    return `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Example usage patterns
 *
 * @example
 * ```typescript
 * const webflow = await getWebflowAPI()
 * const pages = new PageManager(webflow)
 *
 * // Create pages
 * const home = await pages.createPage('Home', 'home')
 * const about = await pages.createPage('About', 'about')
 * const blog = await pages.createPage('Blog', 'blog')
 *
 * // Set SEO metadata
 * await pages.setSEOMetadata(home.id, {
 *   title: 'Welcome Home',
 *   description: 'Your website homepage',
 *   keywords: ['home', 'welcome']
 * })
 *
 * // Set Open Graph
 * await pages.setOpenGraphMetadata(home.id, {
 *   title: 'Welcome Home',
 *   description: 'Visit our website',
 *   image: 'https://example.com/og-image.jpg'
 * })
 *
 * // Publish pages
 * await pages.publishPage(home.id)
 * await pages.publishPage(about.id)
 *
 * // List pages
 * const allPages = await pages.listPages()
 * const published = await pages.listPublishedPages()
 *
 * // Get statistics
 * const stats = await pages.getStatistics()
 * console.log(`Total pages: ${stats.totalPages}`)
 * console.log(`Published: ${stats.publishedPages}`)
 * ```
 */
