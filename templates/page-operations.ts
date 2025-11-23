/**
 * Page Operations Template
 *
 * Complete guide for managing Webflow pages programmatically.
 * Covers: creating pages, navigation, page metadata, and batch operations.
 *
 * @example
 * import { PageManager } from './templates/page-operations';
 * const pageMgr = new PageManager();
 * await pageMgr.getAllPages();
 */

import { webflow } from '@webflow/designer-api';

/**
 * Page metadata
 */
export interface PageInfo {
  id: string;
  name: string;
  path: string;
  isHome: boolean;
  isIndexPage: boolean;
  elementCount: number;
  createdAt: Date;
  lastModified: Date;
}

/**
 * Page creation options
 */
export interface CreatePageOptions {
  name: string;
  title?: string;
  description?: string;
  path?: string;
  parent?: string;
}

/**
 * Comprehensive page management class
 */
export class PageManager {
  /**
   * Get all pages in the site
   */
  async getAllPages(): Promise<PageInfo[]> {
    try {
      const pages = webflow.getAllPages?.();

      if (!pages || pages.length === 0) {
        console.log('No pages found');
        return [];
      }

      return pages.map(page => ({
        id: page.getId?.() || '',
        name: page.getName?.() || '',
        path: page.getPath?.() || '',
        isHome: page.isHomePage?.() || false,
        isIndexPage: page.isIndexPage?.() || false,
        elementCount: (page.getElements?.() || []).length,
        createdAt: new Date(),
        lastModified: new Date()
      }));
    } catch (error) {
      console.error('Failed to get pages:', error);
      webflow.notify.error('Failed to load pages');
      return [];
    }
  }

  /**
   * Get current page
   */
  async getCurrentPage(): Promise<PageInfo | null> {
    try {
      const page = webflow.getCurrentPage?.();

      if (!page) {
        return null;
      }

      return {
        id: page.getId?.() || '',
        name: page.getName?.() || '',
        path: page.getPath?.() || '',
        isHome: page.isHomePage?.() || false,
        isIndexPage: page.isIndexPage?.() || false,
        elementCount: (page.getElements?.() || []).length,
        createdAt: new Date(),
        lastModified: new Date()
      };
    } catch (error) {
      console.error('Failed to get current page:', error);
      return null;
    }
  }

  /**
   * Get page by ID
   */
  async getPageById(pageId: string): Promise<PageInfo | null> {
    try {
      const pages = await this.getAllPages();
      return pages.find(p => p.id === pageId) || null;
    } catch (error) {
      console.error('Failed to get page:', error);
      return null;
    }
  }

  /**
   * Get page by name
   */
  async getPageByName(name: string): Promise<PageInfo | null> {
    try {
      const pages = await this.getAllPages();
      return pages.find(p => p.name === name) || null;
    } catch (error) {
      console.error('Failed to get page:', error);
      return null;
    }
  }

  /**
   * Create a new page
   */
  async createPage(options: CreatePageOptions): Promise<string | null> {
    try {
      if (!options.name) {
        webflow.notify.error('Page name is required');
        return null;
      }

      const pages = webflow.getAllPages?.();

      if (!pages) {
        webflow.notify.error('Pages API not available');
        return null;
      }

      const newPage = pages.create?.({
        name: options.name,
        title: options.title || options.name,
        description: options.description,
        path: options.path || `/${options.name.toLowerCase()}`,
        parentId: options.parent
      });

      if (newPage) {
        webflow.notify.success(`Page "${options.name}" created`);
        return newPage.getId?.();
      }

      return null;
    } catch (error) {
      console.error('Failed to create page:', error);
      webflow.notify.error('Failed to create page');
      return null;
    }
  }

  /**
   * Navigate to page
   */
  async navigateToPage(pageId: string): Promise<boolean> {
    try {
      const page = webflow.getPageById?.(pageId);

      if (!page) {
        webflow.notify.error('Page not found');
        return false;
      }

      webflow.navigateToPage?.(page);
      return true;
    } catch (error) {
      console.error('Failed to navigate:', error);
      webflow.notify.error('Failed to navigate');
      return false;
    }
  }

  /**
   * Rename page
   */
  async renamePage(pageId: string, newName: string): Promise<boolean> {
    try {
      const page = webflow.getPageById?.(pageId);

      if (!page) {
        webflow.notify.error('Page not found');
        return false;
      }

      page.setName?.(newName);
      webflow.notify.success(`Page renamed to "${newName}"`);
      return true;
    } catch (error) {
      console.error('Failed to rename page:', error);
      webflow.notify.error('Failed to rename page');
      return false;
    }
  }

  /**
   * Update page properties
   */
  async updatePageProperties(
    pageId: string,
    properties: {
      title?: string;
      description?: string;
      path?: string;
    }
  ): Promise<boolean> {
    try {
      const page = webflow.getPageById?.(pageId);

      if (!page) {
        webflow.notify.error('Page not found');
        return false;
      }

      if (properties.title) {
        page.setTitle?.(properties.title);
      }

      if (properties.description) {
        page.setDescription?.(properties.description);
      }

      if (properties.path) {
        page.setPath?.(properties.path);
      }

      webflow.notify.success('Page properties updated');
      return true;
    } catch (error) {
      console.error('Failed to update page:', error);
      webflow.notify.error('Failed to update page');
      return false;
    }
  }

  /**
   * Delete page
   */
  async deletePage(pageId: string): Promise<boolean> {
    try {
      const page = webflow.getPageById?.(pageId);

      if (!page) {
        webflow.notify.error('Page not found');
        return false;
      }

      page.delete?.();
      webflow.notify.success('Page deleted');
      return true;
    } catch (error) {
      console.error('Failed to delete page:', error);
      webflow.notify.error('Failed to delete page');
      return false;
    }
  }

  /**
   * Get page elements
   */
  async getPageElements(pageId: string): Promise<webflow.Element[]> {
    try {
      const page = webflow.getPageById?.(pageId);

      if (!page) {
        return [];
      }

      return page.getElements?.() || [];
    } catch (error) {
      console.error('Failed to get page elements:', error);
      return [];
    }
  }

  /**
   * Duplicate page
   */
  async duplicatePage(pageId: string, newName: string): Promise<string | null> {
    try {
      const page = webflow.getPageById?.(pageId);

      if (!page) {
        webflow.notify.error('Page not found');
        return null;
      }

      const duplicated = page.duplicate?.();

      if (duplicated) {
        duplicated.setName?.(newName);
        webflow.notify.success(`Page duplicated as "${newName}"`);
        return duplicated.getId?.();
      }

      return null;
    } catch (error) {
      console.error('Failed to duplicate page:', error);
      webflow.notify.error('Failed to duplicate page');
      return null;
    }
  }

  /**
   * Get home page
   */
  async getHomePage(): Promise<PageInfo | null> {
    try {
      const pages = await this.getAllPages();
      return pages.find(p => p.isHome) || null;
    } catch (error) {
      console.error('Failed to get home page:', error);
      return null;
    }
  }

  /**
   * Get collection pages
   */
  async getCollectionPages(): Promise<PageInfo[]> {
    try {
      const pages = await this.getAllPages();
      return pages.filter(p => p.isIndexPage || p.path.includes(':'));
    } catch (error) {
      console.error('Failed to get collection pages:', error);
      return [];
    }
  }

  /**
   * Get page statistics
   */
  async getPageStats(): Promise<object> {
    try {
      const pages = await this.getAllPages();
      const totalElements = pages.reduce((sum, p) => sum + p.elementCount, 0);

      return {
        totalPages: pages.length,
        totalElements,
        averageElementsPerPage:
          pages.length > 0 ? totalElements / pages.length : 0,
        homePageName: (await this.getHomePage())?.name || 'Not set',
        collectionPages: (await this.getCollectionPages()).length
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return {};
    }
  }

  /**
   * Export page list as JSON
   */
  async exportPageList(): Promise<object> {
    try {
      const pages = await this.getAllPages();
      const stats = await this.getPageStats();

      return {
        exportedAt: new Date().toISOString(),
        statistics: stats,
        pages: pages.map(page => ({
          id: page.id,
          name: page.name,
          path: page.path,
          isHome: page.isHome,
          isCollection: page.isIndexPage,
          elements: page.elementCount
        }))
      };
    } catch (error) {
      console.error('Failed to export pages:', error);
      return {};
    }
  }

  /**
   * Batch create pages
   */
  async createPagesBatch(
    pages: CreatePageOptions[]
  ): Promise<number> {
    try {
      let createdCount = 0;

      for (const pageOptions of pages) {
        const id = await this.createPage(pageOptions);
        if (id) createdCount++;
      }

      webflow.notify.success(`Created ${createdCount} page(s)`);
      return createdCount;
    } catch (error) {
      console.error('Failed to batch create pages:', error);
      webflow.notify.error('Failed to create pages');
      return 0;
    }
  }

  /**
   * Search pages by name
   */
  async searchPages(query: string): Promise<PageInfo[]> {
    try {
      const pages = await this.getAllPages();
      const lowerQuery = query.toLowerCase();

      return pages.filter(
        page =>
          page.name.toLowerCase().includes(lowerQuery) ||
          page.path.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search pages:', error);
      return [];
    }
  }
}

/**
 * Quick helper functions
 */

/**
 * Get all pages
 */
export async function getAllPages(): Promise<PageInfo[]> {
  const manager = new PageManager();
  return manager.getAllPages();
}

/**
 * Get current page
 */
export async function getCurrentPage(): Promise<PageInfo | null> {
  const manager = new PageManager();
  return manager.getCurrentPage();
}

/**
 * Create new page
 */
export async function createPage(name: string): Promise<string | null> {
  const manager = new PageManager();
  return manager.createPage({ name });
}

export default PageManager;
