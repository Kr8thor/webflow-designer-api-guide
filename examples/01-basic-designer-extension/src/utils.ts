/**
 * Utility Functions - Helper Methods
 *
 * Common utility functions for:
 * - Class manipulation
 * - Element inspection
 * - Data retrieval
 * - Error handling
 */

import { webflow } from '@webflow/designer-api';

/**
 * Safely apply CSS class to selected elements
 */
export async function applyClassToSelection(
  className: string
): Promise<number> {
  try {
    const selected = webflow.getSelectedElements();

    if (selected.length === 0) {
      webflow.notify.error('Please select elements first');
      return 0;
    }

    let applied = 0;
    for (const element of selected) {
      try {
        const attrs = element.getAttributes?.() || {};
        const current = attrs.class || '';
        const updated = current ? `${current} ${className}` : className;

        element.setAttributes?.({ ...attrs, class: updated });
        applied++;
      } catch (err) {
        console.warn(`Failed to apply class to element:`, err);
      }
    }

    webflow.notify.success(`Applied class to ${applied} element(s)`);
    return applied;
  } catch (error) {
    console.error('Failed to apply class:', error);
    webflow.notify.error('Failed to apply class to elements');
    return 0;
  }
}

/**
 * Remove CSS class from selected elements
 */
export async function removeClassFromSelection(
  className: string
): Promise<number> {
  try {
    const selected = webflow.getSelectedElements();

    if (selected.length === 0) {
      webflow.notify.error('Please select elements first');
      return 0;
    }

    let removed = 0;
    for (const element of selected) {
      try {
        const attrs = element.getAttributes?.() || {};
        const current = attrs.class || '';
        const updated = current
          .split(' ')
          .filter((cls) => cls !== className)
          .join(' ');

        element.setAttributes?.({ ...attrs, class: updated });
        removed++;
      } catch (err) {
        console.warn(`Failed to remove class from element:`, err);
      }
    }

    webflow.notify.success(`Removed class from ${removed} element(s)`);
    return removed;
  } catch (error) {
    console.error('Failed to remove class:', error);
    webflow.notify.error('Failed to remove class from elements');
    return 0;
  }
}

/**
 * Get element information as object
 */
export function getElementInfo(element: webflow.Element): object {
  try {
    return {
      id: element.getId?.(),
      name: element.getName?.(),
      tagName: element.getTagName?.(),
      classes: element.getAttributes?.()?.class || '',
      attributes: element.getAttributes?.(),
      hasChildren: (element.getChildren?.() || []).length > 0,
      childCount: (element.getChildren?.() || []).length
    };
  } catch (error) {
    console.error('Failed to get element info:', error);
    return { error: String(error) };
  }
}

/**
 * Print element hierarchy to console
 */
export function printElementHierarchy(depth = 0, maxDepth = 5): string {
  try {
    if (depth > maxDepth) return '';

    const page = webflow.getCurrentPage();
    if (!page) return 'No page selected';

    let hierarchy = '';
    const elements = page.getElements?.() || [];

    function buildHierarchy(
      els: webflow.Element[],
      indent = 0
    ): void {
      for (const el of els) {
        const name = el.getName?.() || '(unnamed)';
        const tagName = el.getTagName?.() || 'div';
        hierarchy += `${'  '.repeat(indent)}├─ <${tagName}> ${name}\n`;

        const children = el.getChildren?.() || [];
        if (children.length > 0 && indent < maxDepth) {
          buildHierarchy(children, indent + 1);
        }
      }
    }

    buildHierarchy(elements);
    return hierarchy;
  } catch (error) {
    console.error('Failed to build hierarchy:', error);
    return `Error: ${String(error)}`;
  }
}

/**
 * Get count of all elements on current page
 */
export function countPageElements(): number {
  try {
    const page = webflow.getCurrentPage();
    if (!page) return 0;

    const elements = page.getElements?.() || [];

    function countAll(els: webflow.Element[]): number {
      let count = els.length;
      for (const el of els) {
        const children = el.getChildren?.() || [];
        count += countAll(children);
      }
      return count;
    }

    return countAll(elements);
  } catch (error) {
    console.error('Failed to count elements:', error);
    return 0;
  }
}

/**
 * Get all elements of a specific tag type
 */
export function getElementsByTag(
  tagName: string
): webflow.Element[] {
  try {
    const page = webflow.getCurrentPage();
    if (!page) return [];

    const elements = page.getElements?.() || [];
    const result: webflow.Element[] = [];

    function findByTag(els: webflow.Element[]): void {
      for (const el of els) {
        if (el.getTagName?.() === tagName) {
          result.push(el);
        }
        const children = el.getChildren?.() || [];
        if (children.length > 0) {
          findByTag(children);
        }
      }
    }

    findByTag(elements);
    return result;
  } catch (error) {
    console.error('Failed to find elements by tag:', error);
    return [];
  }
}

/**
 * Get current page info
 */
export function getCurrentPageInfo(): object {
  try {
    const page = webflow.getCurrentPage();

    if (!page) {
      return { status: 'No page selected' };
    }

    return {
      name: page.getName?.(),
      id: page.getId?.(),
      elementCount: countPageElements(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get page info:', error);
    return { error: String(error) };
  }
}

/**
 * Safe DOM manipulation helper
 */
export function safeSetAttribute(
  element: webflow.Element,
  name: string,
  value: string
): boolean {
  try {
    const attrs = element.getAttributes?.() || {};
    element.setAttributes?.({
      ...attrs,
      [name]: value
    });
    return true;
  } catch (error) {
    console.error(`Failed to set attribute ${name}:`, error);
    return false;
  }
}

/**
 * Safe DOM manipulation helper
 */
export function safeGetAttribute(
  element: webflow.Element,
  name: string
): string | null {
  try {
    const attrs = element.getAttributes?.() || {};
    return attrs[name] || null;
  } catch (error) {
    console.error(`Failed to get attribute ${name}:`, error);
    return null;
  }
}

/**
 * Error handler with logging
 */
export function handleError(
  context: string,
  error: unknown
): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`❌ [${context}] ${message}`);
  webflow.notify.error(`Error in ${context}`);
}

/**
 * Success logger
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

/**
 * Info logger
 */
export function logInfo(message: string): void {
  console.log(`ℹ️ ${message}`);
}

export { applyClassToSelection as default };
