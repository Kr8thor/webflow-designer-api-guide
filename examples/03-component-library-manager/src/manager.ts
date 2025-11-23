/**
 * Component Library Manager
 *
 * Manages component libraries at scale with inventory, variants, and sync.
 */

import { webflow } from '@webflow/designer-api';

interface ComponentInfo {
  id: string;
  name: string;
  instanceCount: number;
  variants: string[];
  pages: string[];
  lastModified: Date;
}

interface LibraryExport {
  components: ComponentInfo[];
  exportedAt: Date;
  siteId: string;
}

export class ComponentLibraryManager {
  /**
   * Get all components with detailed info
   */
  async getAllComponents(): Promise<ComponentInfo[]> {
    try {
      const components = webflow.getComponents() || [];
      const result: ComponentInfo[] = [];

      for (const component of components) {
        const instances = component.getInstances?.() || [];
        const pages = this.getComponentPages(instances);

        result.push({
          id: component.getId?.(),
          name: component.getName?.(),
          instanceCount: instances.length,
          variants: component.getVariants?.() || [],
          pages,
          lastModified: new Date()
        });
      }

      return result;
    } catch (error) {
      console.error('Failed to get components:', error);
      webflow.notify.error('Failed to load components');
      return [];
    }
  }

  /**
   * Get component by ID with details
   */
  async getComponentDetails(componentId: string): Promise<ComponentInfo | null> {
    try {
      const components = webflow.getComponents() || [];
      const component = components.find((c) => c.getId?.() === componentId);

      if (!component) return null;

      const instances = component.getInstances?.() || [];
      const pages = this.getComponentPages(instances);

      return {
        id: component.getId?.(),
        name: component.getName?.(),
        instanceCount: instances.length,
        variants: component.getVariants?.() || [],
        pages,
        lastModified: new Date()
      };
    } catch (error) {
      console.error('Failed to get component details:', error);
      return null;
    }
  }

  /**
   * Update all instances of a component
   */
  async updateAllInstances(
    componentId: string,
    properties: Record<string, any>
  ): Promise<number> {
    try {
      const components = webflow.getComponents() || [];
      const component = components.find((c) => c.getId?.() === componentId);

      if (!component) {
        webflow.notify.error('Component not found');
        return 0;
      }

      const instances = component.getInstances?.() || [];
      let updated = 0;

      for (const instance of instances) {
        try {
          const attrs = instance.getAttributes?.() || {};
          instance.setAttributes?.({ ...attrs, ...properties });
          updated++;
        } catch (err) {
          console.warn('Failed to update instance:', err);
        }
      }

      webflow.notify.success(`Updated ${updated} instances`);
      return updated;
    } catch (error) {
      console.error('Failed to update instances:', error);
      webflow.notify.error('Failed to update instances');
      return 0;
    }
  }

  /**
   * Get component statistics
   */
  getComponentStats(): object {
    try {
      const components = webflow.getComponents() || [];
      let totalInstances = 0;
      let totalVariants = 0;
      const componentCounts = new Map<string, number>();

      for (const component of components) {
        const instances = component.getInstances?.() || [];
        const variants = component.getVariants?.() || [];

        totalInstances += instances.length;
        totalVariants += variants.length;

        // Track by variant
        for (const variant of variants) {
          const count = componentCounts.get(variant) || 0;
          componentCounts.set(variant, count + instances.length);
        }
      }

      return {
        totalComponents: components.length,
        totalInstances,
        totalVariants,
        averageInstancesPerComponent:
          components.length > 0 ? totalInstances / components.length : 0,
        averageVariantsPerComponent:
          components.length > 0 ? totalVariants / components.length : 0,
        variantUsage: Object.fromEntries(componentCounts)
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return { error: String(error) };
    }
  }

  /**
   * Export component library to JSON
   */
  exportComponentLibrary(): LibraryExport {
    try {
      const components = webflow.getComponents() || [];
      const componentInfos: ComponentInfo[] = [];

      for (const component of components) {
        const instances = component.getInstances?.() || [];
        const pages = this.getComponentPages(instances);

        componentInfos.push({
          id: component.getId?.(),
          name: component.getName?.(),
          instanceCount: instances.length,
          variants: component.getVariants?.() || [],
          pages,
          lastModified: new Date()
        });
      }

      return {
        components: componentInfos,
        exportedAt: new Date(),
        siteId: 'unknown'
      };
    } catch (error) {
      console.error('Failed to export library:', error);
      return {
        components: [],
        exportedAt: new Date(),
        siteId: 'unknown'
      };
    }
  }

  /**
   * Get pages where component instances exist
   */
  private getComponentPages(instances: webflow.Element[]): string[] {
    const pages = new Set<string>();

    try {
      const allPages = webflow.getAllPages?.() || [];

      for (const instance of instances) {
        for (const page of allPages) {
          const pageElements = page.getElements?.() || [];
          if (this.isElementInTree(instance, pageElements)) {
            pages.add(page.getName?.() || 'Unknown');
            break;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get component pages:', error);
    }

    return Array.from(pages);
  }

  /**
   * Check if element is in tree
   */
  private isElementInTree(target: webflow.Element, elements: webflow.Element[]): boolean {
    for (const el of elements) {
      if (el.getId?.() === target.getId?.()) return true;

      const children = el.getChildren?.() || [];
      if (this.isElementInTree(target, children)) return true;
    }

    return false;
  }

  /**
   * Search components
   */
  async searchComponents(query: string): Promise<ComponentInfo[]> {
    try {
      const all = await this.getAllComponents();
      const lower = query.toLowerCase();

      return all.filter((comp) =>
        comp.name.toLowerCase().includes(lower)
      );
    } catch (error) {
      console.error('Failed to search components:', error);
      return [];
    }
  }

  /**
   * Rename component
   */
  async renameComponent(componentId: string, newName: string): Promise<boolean> {
    try {
      const components = webflow.getComponents() || [];
      const component = components.find((c) => c.getId?.() === componentId);

      if (!component) {
        webflow.notify.error('Component not found');
        return false;
      }

      component.setName?.(newName);
      webflow.notify.success(`Renamed to "${newName}"`);
      return true;
    } catch (error) {
      console.error('Failed to rename component:', error);
      webflow.notify.error('Failed to rename component');
      return false;
    }
  }

  /**
   * Delete component
   */
  async deleteComponent(componentId: string): Promise<boolean> {
    try {
      const components = webflow.getComponents() || [];
      const component = components.find((c) => c.getId?.() === componentId);

      if (!component) {
        webflow.notify.error('Component not found');
        return false;
      }

      // Note: Designer API may not support direct component deletion
      // This is a placeholder for the operation
      webflow.notify.warning('Component deletion not available in Designer API');
      return false;
    } catch (error) {
      console.error('Failed to delete component:', error);
      webflow.notify.error('Failed to delete component');
      return false;
    }
  }

  /**
   * Get component dependency graph
   */
  getDependencyGraph(): object {
    try {
      const components = webflow.getComponents() || [];
      const graph: Record<string, string[]> = {};

      for (const component of components) {
        const name = component.getName?.();
        const instances = component.getInstances?.() || [];

        if (name) {
          graph[name] = instances.map((i) => i.getName?.() || 'unnamed');
        }
      }

      return graph;
    } catch (error) {
      console.error('Failed to get dependency graph:', error);
      return {};
    }
  }
}

export default ComponentLibraryManager;
