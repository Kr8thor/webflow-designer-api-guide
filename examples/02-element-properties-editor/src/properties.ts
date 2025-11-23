/**
 * Properties Manager - Element Property Management
 *
 * Handles all property, attribute, style, and class operations on elements.
 */

import { webflow } from '@webflow/designer-api';

/**
 * Properties Manager class
 */
export class PropertiesManager {
  /**
   * Get all properties of an element
   */
  getElementProperties(element: webflow.Element): object {
    try {
      return {
        id: element.getId?.(),
        name: element.getName?.(),
        tagName: element.getTagName?.(),
        attributes: element.getAttributes?.() || {},
        classes: this.getElementClasses(element)
      };
    } catch (error) {
      console.error('Failed to get properties:', error);
      return {};
    }
  }

  /**
   * Set a single element property
   */
  setElementProperty(
    element: webflow.Element,
    name: string,
    value: any
  ): boolean {
    try {
      if (name === 'class') {
        // Handle class specially
        if (Array.isArray(value)) {
          return this.updateClasses(element, value);
        } else if (typeof value === 'string') {
          element.setAttributes?.({ ...element.getAttributes?.() || {}, class: value });
          return true;
        }
      } else {
        // Set as attribute
        const attrs = element.getAttributes?.() || {};
        attrs[name] = value;
        element.setAttributes?.(attrs);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to set property ${name}:`, error);
      return false;
    }
  }

  /**
   * Remove a property/attribute
   */
  removeElementProperty(element: webflow.Element, name: string): boolean {
    try {
      const attrs = element.getAttributes?.() || {};
      delete attrs[name];
      element.setAttributes?.(attrs);
      return true;
    } catch (error) {
      console.error(`Failed to remove property ${name}:`, error);
      return false;
    }
  }

  /**
   * Get all classes on element
   */
  getElementClasses(element: webflow.Element): string[] {
    try {
      const attrs = element.getAttributes?.() || {};
      const classStr = attrs.class || '';
      return classStr.split(' ').filter((cls) => cls.length > 0);
    } catch (error) {
      console.error('Failed to get classes:', error);
      return [];
    }
  }

  /**
   * Add class to element
   */
  addElementClass(element: webflow.Element, className: string): boolean {
    try {
      if (!className || className.includes(' ')) {
        console.warn('Invalid class name:', className);
        return false;
      }

      const classes = this.getElementClasses(element);

      if (classes.includes(className)) {
        return false; // Already has class
      }

      classes.push(className);
      return this.updateClasses(element, classes);
    } catch (error) {
      console.error('Failed to add class:', error);
      return false;
    }
  }

  /**
   * Remove class from element
   */
  removeElementClass(element: webflow.Element, className: string): boolean {
    try {
      const classes = this.getElementClasses(element);
      const filtered = classes.filter((cls) => cls !== className);

      if (filtered.length === classes.length) {
        return false; // Class wasn't present
      }

      return this.updateClasses(element, filtered);
    } catch (error) {
      console.error('Failed to remove class:', error);
      return false;
    }
  }

  /**
   * Toggle class on element
   */
  toggleElementClass(element: webflow.Element, className: string): boolean {
    try {
      const classes = this.getElementClasses(element);

      if (classes.includes(className)) {
        return this.removeElementClass(element, className);
      } else {
        return this.addElementClass(element, className);
      }
    } catch (error) {
      console.error('Failed to toggle class:', error);
      return false;
    }
  }

  /**
   * Update all classes on element
   */
  private updateClasses(element: webflow.Element, classes: string[]): boolean {
    try {
      const attrs = element.getAttributes?.() || {};
      attrs.class = classes.join(' ');
      element.setAttributes?.(attrs);
      return true;
    } catch (error) {
      console.error('Failed to update classes:', error);
      return false;
    }
  }

  /**
   * Apply inline styles to element
   */
  applyInlineStyles(element: webflow.Element, styles: Record<string, string>): void {
    try {
      for (const [property, value] of Object.entries(styles)) {
        element.setInlineStyle?.(property, value);
      }
    } catch (error) {
      console.error('Failed to apply styles:', error);
    }
  }

  /**
   * Remove inline style from element
   */
  removeInlineStyle(element: webflow.Element, property: string): void {
    try {
      element.setInlineStyle?.(property, '');
    } catch (error) {
      console.error(`Failed to remove style ${property}:`, error);
    }
  }

  /**
   * Get computed styles (if available)
   */
  getComputedStyles(element: webflow.Element): Record<string, string> {
    try {
      // Note: Designer API may not expose computed styles directly
      // This is a placeholder for the capability
      const attrs = element.getAttributes?.() || {};
      const style = attrs.style || '';

      const parsed: Record<string, string> = {};
      style.split(';').forEach((rule) => {
        const [prop, value] = rule.split(':');
        if (prop && value) {
          parsed[prop.trim()] = value.trim();
        }
      });

      return parsed;
    } catch (error) {
      console.error('Failed to get computed styles:', error);
      return {};
    }
  }

  /**
   * Check if element has class
   */
  hasClass(element: webflow.Element, className: string): boolean {
    return this.getElementClasses(element).includes(className);
  }

  /**
   * Get attribute value
   */
  getAttribute(element: webflow.Element, name: string): any {
    try {
      const attrs = element.getAttributes?.() || {};
      return attrs[name] || null;
    } catch (error) {
      console.error(`Failed to get attribute ${name}:`, error);
      return null;
    }
  }

  /**
   * Set attribute value
   */
  setAttribute(element: webflow.Element, name: string, value: any): boolean {
    try {
      const attrs = element.getAttributes?.() || {};
      attrs[name] = value;
      element.setAttributes?.(attrs);
      return true;
    } catch (error) {
      console.error(`Failed to set attribute ${name}:`, error);
      return false;
    }
  }

  /**
   * Validate property value
   */
  validateProperty(name: string, value: any): boolean {
    // Basic validation
    if (name === 'aria-label') {
      return typeof value === 'string' && value.length > 0 && value.length <= 255;
    }

    if (name.startsWith('data-')) {
      return typeof value === 'string' || typeof value === 'number';
    }

    if (name === 'class') {
      if (typeof value === 'string') {
        return /^[a-zA-Z0-9\s\-_]*$/.test(value);
      }
      if (Array.isArray(value)) {
        return value.every((v) => typeof v === 'string');
      }
    }

    return true;
  }

  /**
   * Batch set properties
   */
  batchSetProperties(
    element: webflow.Element,
    properties: Record<string, any>
  ): number {
    let count = 0;

    for (const [name, value] of Object.entries(properties)) {
      if (this.validateProperty(name, value)) {
        if (this.setElementProperty(element, name, value)) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Clone properties from one element to another
   */
  cloneProperties(
    sourceElement: webflow.Element,
    targetElement: webflow.Element,
    includeClasses = true,
    includeStyles = true
  ): boolean {
    try {
      const sourceAttrs = sourceElement.getAttributes?.() || {};
      const targetAttrs = targetElement.getAttributes?.() || {};

      // Copy attributes (except class if not included)
      for (const [name, value] of Object.entries(sourceAttrs)) {
        if (name === 'class' && !includeClasses) continue;
        targetAttrs[name] = value;
      }

      targetElement.setAttributes?.(targetAttrs);

      // Copy styles if included
      if (includeStyles) {
        const styles = this.getComputedStyles(sourceElement);
        this.applyInlineStyles(targetElement, styles);
      }

      return true;
    } catch (error) {
      console.error('Failed to clone properties:', error);
      return false;
    }
  }
}

export { PropertiesManager as default };
