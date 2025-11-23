/**
 * Utility Functions - Helper Methods
 *
 * Common utility functions for property editing.
 */

import { webflow } from '@webflow/designer-api';

/**
 * Validate HTML attribute name
 */
export function isValidAttributeName(name: string): boolean {
  if (!name || name.length === 0) return false;
  // Must start with letter, can contain letters, numbers, hyphens, underscores, colons
  return /^[a-zA-Z_:][a-zA-Z0-9_:\-]*$/.test(name);
}

/**
 * Validate CSS property name
 */
export function isValidCSSProperty(property: string): boolean {
  if (!property || property.length === 0) return false;
  // Convert to camelCase for validation
  const camelCase = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  // Basic validation - CSS properties are typically alphanumeric and hyphens
  return /^[a-zA-Z\-]+$/.test(property);
}

/**
 * Validate CSS value
 */
export function isValidCSSValue(value: string): boolean {
  if (!value) return false;
  // Basic validation - no script tags
  return !/<script|javascript:/i.test(value);
}

/**
 * Sanitize attribute value
 */
export function sanitizeAttributeValue(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Remove any potentially harmful content
  return str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
}

/**
 * Parse CSS declarations from string
 */
export function parseCSSString(cssString: string): Record<string, string> {
  const result: Record<string, string> = {};

  if (!cssString) return result;

  cssString.split(';').forEach((declaration) => {
    const [property, value] = declaration.split(':');
    if (property && value) {
      result[property.trim()] = value.trim();
    }
  });

  return result;
}

/**
 * Format CSS declarations object to string
 */
export function formatCSSString(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

/**
 * Parse class string to array
 */
export function parseClasses(classString: string): string[] {
  return classString
    .split(' ')
    .map((cls) => cls.trim())
    .filter((cls) => cls.length > 0);
}

/**
 * Format classes array to string
 */
export function formatClasses(classes: string[]): string {
  return classes.join(' ');
}

/**
 * Debounce function for property updates
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get safe attribute name (kebab-case to data attribute)
 */
export function normalizeAttributeName(name: string): string {
  // Remove leading/trailing spaces
  name = name.trim();

  // Auto-prefix data- if it looks like a data attribute
  if (!name.startsWith('data-') && !name.startsWith('aria-') && name.includes('-')) {
    return `data-${name}`;
  }

  return name;
}

/**
 * Check if attribute is ARIA
 */
export function isAriaAttribute(name: string): boolean {
  return name.toLowerCase().startsWith('aria-');
}

/**
 * Check if attribute is data attribute
 */
export function isDataAttribute(name: string): boolean {
  return name.toLowerCase().startsWith('data-');
}

/**
 * Get attribute category
 */
export function getAttributeCategory(
  name: string
): 'aria' | 'data' | 'standard' {
  if (isAriaAttribute(name)) return 'aria';
  if (isDataAttribute(name)) return 'data';
  return 'standard';
}

/**
 * Compare two property objects
 */
export function compareProperties(
  before: Record<string, any>,
  after: Record<string, any>
): Record<string, { before: any; after: any }> {
  const changes: Record<string, { before: any; after: any }> = {};

  // Check all keys
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    const beforeVal = before[key];
    const afterVal = after[key];

    if (beforeVal !== afterVal) {
      changes[key] = { before: beforeVal, after: afterVal };
    }
  }

  return changes;
}

/**
 * Format bytes to readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Batch update elements
 */
export function batchUpdateElements(
  elements: webflow.Element[],
  updates: Record<string, any>,
  callback?: (index: number, element: webflow.Element) => void
): number {
  let count = 0;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    try {
      const attrs = element.getAttributes?.() || {};

      for (const [key, value] of Object.entries(updates)) {
        attrs[key] = value;
      }

      element.setAttributes?.(attrs);
      count++;

      if (callback) {
        callback(i, element);
      }
    } catch (error) {
      console.warn(`Failed to update element ${i}:`, error);
    }
  }

  return count;
}

/**
 * Get element path in DOM
 */
export function getElementPath(element: webflow.Element): string {
  const name = element.getName?.() || 'unnamed';
  const id = element.getId?.() || '?';
  return `${name} (#${id})`;
}

/**
 * Format property for display
 */
export function formatPropertyForDisplay(
  key: string,
  value: any
): { label: string; value: string } {
  let label = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  const displayValue =
    typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);

  return { label, value: displayValue };
}

export { debounce as default };
