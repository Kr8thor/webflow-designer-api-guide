/**
 * Webflow Designer Toolkit Manager
 *
 * Unified interface for all Designer API operations
 */

import { webflow } from './types';

/**
 * Main Toolkit Manager
 */
export class DesignerToolkit {
  private selectedTab: string = 'dashboard';
  private stats: ToolkitStats = {
    components: 0,
    pages: 0,
    assets: 0,
    tokens: 0,
    elements: 0
  };

  /**
   * Initialize the toolkit
   */
  async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Webflow Designer Toolkit');
      await this.updateStats();
      console.log('✅ Toolkit ready');
    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Update all statistics
   */
  async updateStats(): Promise<void> {
    try {
      const components = webflow.getComponents?.() || [];
      const pages = webflow.getAllPages?.() || [];
      const assets = webflow.getAssets?.() || [];
      const tokens = webflow.getVariables?.() || [];
      const page = webflow.getCurrentPage();
      const elements = page?.getElements?.() || [];

      this.stats = {
        components: components.length,
        pages: pages.length,
        assets: assets.length,
        tokens: tokens.length,
        elements: elements.length
      };
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  /**
   * Get all components with details
   */
  async getComponents(): Promise<ComponentInfo[]> {
    try {
      const components = webflow.getComponents?.() || [];
      return components.map((c: any) => ({
        id: c.getId?.(),
        name: c.getName?.(),
        instances: (c.getInstances?.() || []).length,
        variants: (c.getVariants?.() || []).length
      }));
    } catch (error) {
      console.error('Failed to get components:', error);
      return [];
    }
  }

  /**
   * Get all pages
   */
  async getPages(): Promise<PageInfo[]> {
    try {
      const pages = webflow.getAllPages?.() || [];
      return pages.map((p: any) => ({
        id: p.getId?.(),
        name: p.getName?.(),
        elements: (p.getElements?.() || []).length
      }));
    } catch (error) {
      console.error('Failed to get pages:', error);
      return [];
    }
  }

  /**
   * Get all assets
   */
  async getAssets(): Promise<AssetInfo[]> {
    try {
      const assets = webflow.getAssets?.() || [];
      let totalSize = 0;

      const infos: AssetInfo[] = assets.map((a: any) => {
        const size = a.getSize?.() || 0;
        totalSize += size;
        return {
          id: a.getId?.(),
          name: a.getName?.(),
          type: a.getType?.() || 'unknown',
          size
        };
      });

      this.stats.assetSize = totalSize;
      return infos;
    } catch (error) {
      console.error('Failed to get assets:', error);
      return [];
    }
  }

  /**
   * Get all tokens
   */
  async getTokens(): Promise<TokenInfo[]> {
    try {
      const tokens = webflow.getVariables?.() || [];
      return tokens.map((t: any) => ({
        id: t.getId?.(),
        name: t.getName?.(),
        type: t.getType?.() || 'unknown',
        value: t.getValue?.()
      }));
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return [];
    }
  }

  /**
   * Get selection statistics
   */
  getSelectionStats(): SelectionStats {
    try {
      const selected = webflow.getSelectedElements();
      return {
        count: selected.length,
        elements: selected.map((e: any) => ({
          name: e.getName?.() || '(unnamed)',
          tag: e.getTagName?.() || 'div'
        }))
      };
    } catch (error) {
      console.error('Failed to get selection stats:', error);
      return { count: 0, elements: [] };
    }
  }

  /**
   * Update selection with class
   */
  async updateSelectionClass(className: string, add: boolean): Promise<number> {
    try {
      const selected = webflow.getSelectedElements();
      if (selected.length === 0) {
        webflow.notify.error('Please select elements first');
        return 0;
      }

      let updated = 0;
      for (const element of selected) {
        try {
          const attrs = element.getAttributes?.() || {};
          const classes = (attrs.class || '').split(' ').filter((c: string) => c);

          if (add) {
            if (!classes.includes(className)) {
              classes.push(className);
              updated++;
            }
          } else {
            const filtered = classes.filter((c: string) => c !== className);
            if (filtered.length !== classes.length) {
              updated++;
            }
          }

          element.setAttributes?.({ ...attrs, class: classes.join(' ') });
        } catch (err) {
          console.warn('Failed to update element:', err);
        }
      }

      if (updated > 0) {
        webflow.notify.success(`Updated ${updated} element(s)`);
      }
      return updated;
    } catch (error) {
      console.error('Failed to update selection:', error);
      webflow.notify.error('Failed to update elements');
      return 0;
    }
  }

  /**
   * Get current page info
   */
  getCurrentPageInfo(): PageInfo | null {
    try {
      const page = webflow.getCurrentPage();
      if (!page) return null;

      return {
        id: page.getId?.() || '',
        name: page.getName?.() || '',
        elements: (page.getElements?.() || []).length
      };
    } catch (error) {
      console.error('Failed to get page info:', error);
      return null;
    }
  }

  /**
   * Get dashboard stats
   */
  getDashboardStats(): DashboardStats {
    return {
      ...this.stats,
      currentPage: this.getCurrentPageInfo()?.name || 'None',
      selection: this.getSelectionStats().count
    };
  }
}

/**
 * Types
 */

interface ToolkitStats {
  components: number;
  pages: number;
  assets: number;
  tokens: number;
  elements: number;
  assetSize?: number;
}

interface DashboardStats extends ToolkitStats {
  currentPage: string;
  selection: number;
}

interface ComponentInfo {
  id: string;
  name: string;
  instances: number;
  variants: number;
}

interface PageInfo {
  id: string;
  name: string;
  elements: number;
}

interface AssetInfo {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface TokenInfo {
  id: string;
  name: string;
  type: string;
  value: any;
}

interface SelectionStats {
  count: number;
  elements: Array<{ name: string; tag: string }>;
}

export {
  ToolkitStats,
  DashboardStats,
  ComponentInfo,
  PageInfo,
  AssetInfo,
  TokenInfo,
  SelectionStats
};
