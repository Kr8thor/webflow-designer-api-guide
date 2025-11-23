/**
 * Component Management Template
 *
 * Comprehensive guide for working with Webflow components, instances, and variants.
 * Covers: creating components, managing instances, handling variants, and component operations.
 *
 * @example
 * import { ComponentManager } from './templates/component-management';
 * const manager = new ComponentManager();
 * const components = await manager.getAllComponents();
 */

import { webflow } from '@webflow/designer-api';

/**
 * Interface for component metadata
 */
export interface ComponentInfo {
  id: string;
  name: string;
  instances: number;
  variants: string[];
  created: Date;
  modified: Date;
}

/**
 * Interface for component instance
 */
export interface ComponentInstance {
  id: string;
  componentId: string;
  name: string;
  element: webflow.Element;
  variant?: string;
}

/**
 * Comprehensive component management class
 */
export class ComponentManager {
  /**
   * Get all components in the current site
   */
  async getAllComponents(): Promise<ComponentInfo[]> {
    try {
      const components = webflow.getComponents();

      return components.map(component => ({
        id: component.getId(),
        name: component.getName(),
        instances: component.getInstances().length,
        variants: component.getVariants?.() || [],
        created: new Date(),
        modified: new Date()
      }));
    } catch (error) {
      console.error('Failed to get components:', error);
      webflow.notify.error('Failed to load components');
      throw error;
    }
  }

  /**
   * Get component by ID
   */
  async getComponentById(componentId: string): Promise<webflow.Component | null> {
    try {
      const components = webflow.getComponents();
      return components.find(c => c.getId() === componentId) || null;
    } catch (error) {
      console.error('Failed to get component:', error);
      return null;
    }
  }

  /**
   * Get all instances of a component
   */
  async getComponentInstances(
    componentId: string
  ): Promise<ComponentInstance[]> {
    try {
      const component = await this.getComponentById(componentId);

      if (!component) {
        throw new Error(`Component ${componentId} not found`);
      }

      const instances = component.getInstances();

      return instances.map(instance => ({
        id: instance.getId(),
        componentId,
        name: instance.getName(),
        element: instance as unknown as webflow.Element,
        variant: instance.getVariant?.()
      }));
    } catch (error) {
      console.error('Failed to get component instances:', error);
      webflow.notify.error('Failed to load component instances');
      throw error;
    }
  }

  /**
   * Create a component from selected elements
   */
  async createComponentFromSelection(
    componentName: string
  ): Promise<string | null> {
    try {
      const selected = webflow.getSelectedElements();

      if (selected.length === 0) {
        webflow.notify.error('Please select elements to create a component');
        return null;
      }

      // Create component from first selected element
      const component = selected[0].createComponent(componentName);

      webflow.notify.success(`Component "${componentName}" created`);
      return component.getId();
    } catch (error) {
      console.error('Failed to create component:', error);
      webflow.notify.error('Failed to create component');
      return null;
    }
  }

  /**
   * Detach all instances of a component
   */
  async detachComponentInstances(componentId: string): Promise<boolean> {
    try {
      const instances = await this.getComponentInstances(componentId);

      if (instances.length === 0) {
        webflow.notify.warning('No instances to detach');
        return false;
      }

      let detachedCount = 0;

      for (const instance of instances) {
        try {
          const element = webflow.getElement(instance.id);
          element?.detach?.();
          detachedCount++;
        } catch (err) {
          console.error(`Failed to detach instance ${instance.id}:`, err);
        }
      }

      webflow.notify.success(
        `Detached ${detachedCount} of ${instances.length} instances`
      );
      return detachedCount > 0;
    } catch (error) {
      console.error('Failed to detach instances:', error);
      webflow.notify.error('Failed to detach component instances');
      return false;
    }
  }

  /**
   * Get component variants
   */
  async getComponentVariants(componentId: string): Promise<string[]> {
    try {
      const component = await this.getComponentById(componentId);

      if (!component) {
        return [];
      }

      return component.getVariants?.() || [];
    } catch (error) {
      console.error('Failed to get variants:', error);
      return [];
    }
  }

  /**
   * Apply variant to all instances
   */
  async applyVariantToInstances(
    componentId: string,
    variantName: string
  ): Promise<number> {
    try {
      const instances = await this.getComponentInstances(componentId);

      let appliedCount = 0;

      for (const instance of instances) {
        try {
          const element = webflow.getElement(instance.id);
          element?.setVariant?.(variantName);
          appliedCount++;
        } catch (err) {
          console.error(`Failed to apply variant to ${instance.id}:`, err);
        }
      }

      webflow.notify.success(`Applied variant to ${appliedCount} instances`);
      return appliedCount;
    } catch (error) {
      console.error('Failed to apply variants:', error);
      webflow.notify.error('Failed to apply variant');
      return 0;
    }
  }

  /**
   * Reset component instance to default
   */
  async resetInstance(instanceId: string): Promise<boolean> {
    try {
      const element = webflow.getElement(instanceId);

      if (!element) {
        webflow.notify.error('Instance not found');
        return false;
      }

      element.reset?.();
      webflow.notify.success('Instance reset');
      return true;
    } catch (error) {
      console.error('Failed to reset instance:', error);
      webflow.notify.error('Failed to reset instance');
      return false;
    }
  }

  /**
   * Rename component
   */
  async renameComponent(componentId: string, newName: string): Promise<boolean> {
    try {
      const component = await this.getComponentById(componentId);

      if (!component) {
        webflow.notify.error('Component not found');
        return false;
      }

      component.setName(newName);
      webflow.notify.success(`Component renamed to "${newName}"`);
      return true;
    } catch (error) {
      console.error('Failed to rename component:', error);
      webflow.notify.error('Failed to rename component');
      return false;
    }
  }

  /**
   * Get component instance count
   */
  async getInstanceCount(componentId: string): Promise<number> {
    try {
      const instances = await this.getComponentInstances(componentId);
      return instances.length;
    } catch (error) {
      console.error('Failed to count instances:', error);
      return 0;
    }
  }

  /**
   * Delete component (detaches all instances first)
   */
  async deleteComponent(componentId: string): Promise<boolean> {
    try {
      // Detach all instances first
      await this.detachComponentInstances(componentId);

      const component = await this.getComponentById(componentId);

      if (component) {
        component.delete?.();
      }

      webflow.notify.success('Component deleted');
      return true;
    } catch (error) {
      console.error('Failed to delete component:', error);
      webflow.notify.error('Failed to delete component');
      return false;
    }
  }

  /**
   * Export component definition as JSON
   */
  async exportComponent(componentId: string): Promise<object | null> {
    try {
      const component = await this.getComponentById(componentId);

      if (!component) {
        return null;
      }

      const instances = await this.getComponentInstances(componentId);

      return {
        id: component.getId(),
        name: component.getName(),
        instances: instances.length,
        variants: await this.getComponentVariants(componentId),
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to export component:', error);
      return null;
    }
  }
}

/**
 * Quick helper functions for common operations
 */

/**
 * Select all instances of a component
 */
export async function selectComponentInstances(
  componentId: string
): Promise<number> {
  try {
    const manager = new ComponentManager();
    const instances = await manager.getComponentInstances(componentId);

    const elements = instances
      .map(inst => webflow.getElement(inst.id))
      .filter((el): el is webflow.Element => el !== null);

    if (elements.length > 0) {
      webflow.selectElements(elements);
      webflow.notify.success(
        `Selected ${elements.length} component instances`
      );
    }

    return elements.length;
  } catch (error) {
    console.error('Failed to select instances:', error);
    webflow.notify.error('Failed to select component instances');
    return 0;
  }
}

/**
 * Get component statistics
 */
export async function getComponentStats(): Promise<object> {
  try {
    const manager = new ComponentManager();
    const components = await manager.getAllComponents();

    const totalInstances = components.reduce(
      (sum, comp) => sum + comp.instances,
      0
    );

    return {
      totalComponents: components.length,
      totalInstances,
      averageInstancesPerComponent:
        components.length > 0 ? totalInstances / components.length : 0,
      componentsWithVariants: components.filter(c => c.variants.length > 0)
        .length,
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get statistics:', error);
    return {};
  }
}

export default ComponentManager;
