/**
 * Property Editor - Advanced Element Manipulation
 *
 * Provides comprehensive element property, attribute, and style management.
 * Features:
 * - Real-time property editing
 * - Attribute management
 * - Style application
 * - Class management
 * - History/undo support
 */

import { webflow } from '@webflow/designer-api';
import { PropertiesManager } from './properties';
import { HistoryManager, Change } from './history';

/**
 * Property update interface
 */
export interface PropertyUpdate {
  [key: string]: any;
}

/**
 * Property Editor class
 */
export class PropertyEditor {
  private propertiesManager: PropertiesManager;
  private historyManager: HistoryManager;
  private selectedElement: webflow.Element | null = null;

  constructor() {
    this.propertiesManager = new PropertiesManager();
    this.historyManager = new HistoryManager();
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for element selection
   */
  private setupEventListeners(): void {
    webflow.on('selectedElementsChange', (elements) => {
      this.selectedElement = elements[0] || null;
      this.updateEditorUI();
    });
  }

  /**
   * Edit the currently selected element
   */
  editSelectedElement(updates: PropertyUpdate): boolean {
    if (!this.selectedElement) {
      webflow.notify.error('Please select an element first');
      return false;
    }

    return this.editElement(this.selectedElement, updates);
  }

  /**
   * Edit a specific element
   */
  editElement(element: webflow.Element, updates: PropertyUpdate): boolean {
    try {
      const before = this.propertiesManager.getElementProperties(element);

      // Apply updates
      for (const [key, value] of Object.entries(updates)) {
        this.propertiesManager.setElementProperty(element, key, value);
      }

      const after = this.propertiesManager.getElementProperties(element);

      // Record in history
      this.historyManager.record({
        element: element.getId?.(),
        elementName: element.getName?.(),
        before,
        after,
        timestamp: new Date()
      });

      webflow.notify.success('Properties updated');
      return true;
    } catch (error) {
      console.error('Failed to edit element:', error);
      webflow.notify.error('Failed to update properties');
      return false;
    }
  }

  /**
   * Apply inline styles to selected element
   */
  applyStyles(styles: Record<string, string>): boolean {
    if (!this.selectedElement) {
      webflow.notify.error('Please select an element first');
      return false;
    }

    try {
      this.propertiesManager.applyInlineStyles(this.selectedElement, styles);

      // Record in history
      this.historyManager.record({
        element: this.selectedElement.getId?.(),
        elementName: this.selectedElement.getName?.(),
        before: {},
        after: { styles },
        timestamp: new Date()
      });

      webflow.notify.success('Styles applied');
      return true;
    } catch (error) {
      console.error('Failed to apply styles:', error);
      webflow.notify.error('Failed to apply styles');
      return false;
    }
  }

  /**
   * Update CSS classes on selected element
   */
  updateClasses(classes: string[]): boolean {
    if (!this.selectedElement) {
      webflow.notify.error('Please select an element first');
      return false;
    }

    try {
      const before = this.propertiesManager.getElementClasses(this.selectedElement);

      // Clear existing and apply new
      for (const cls of before) {
        this.propertiesManager.removeElementClass(this.selectedElement, cls);
      }

      for (const cls of classes) {
        this.propertiesManager.addElementClass(this.selectedElement, cls);
      }

      const after = this.propertiesManager.getElementClasses(this.selectedElement);

      // Record in history
      this.historyManager.record({
        element: this.selectedElement.getId?.(),
        elementName: this.selectedElement.getName?.(),
        before: { classes: before },
        after: { classes: after },
        timestamp: new Date()
      });

      webflow.notify.success('Classes updated');
      return true;
    } catch (error) {
      console.error('Failed to update classes:', error);
      webflow.notify.error('Failed to update classes');
      return false;
    }
  }

  /**
   * Add class to selected element
   */
  addClass(className: string): boolean {
    if (!this.selectedElement) {
      webflow.notify.error('Please select an element first');
      return false;
    }

    try {
      const success = this.propertiesManager.addElementClass(
        this.selectedElement,
        className
      );

      if (success) {
        this.historyManager.record({
          element: this.selectedElement.getId?.(),
          elementName: this.selectedElement.getName?.(),
          before: { action: 'addClass' },
          after: { class: className },
          timestamp: new Date()
        });

        webflow.notify.success(`Added class: ${className}`);
      }

      return success;
    } catch (error) {
      console.error('Failed to add class:', error);
      webflow.notify.error('Failed to add class');
      return false;
    }
  }

  /**
   * Remove class from selected element
   */
  removeClass(className: string): boolean {
    if (!this.selectedElement) {
      webflow.notify.error('Please select an element first');
      return false;
    }

    try {
      const success = this.propertiesManager.removeElementClass(
        this.selectedElement,
        className
      );

      if (success) {
        this.historyManager.record({
          element: this.selectedElement.getId?.(),
          elementName: this.selectedElement.getName?.(),
          before: { action: 'removeClass' },
          after: { class: className },
          timestamp: new Date()
        });

        webflow.notify.success(`Removed class: ${className}`);
      }

      return success;
    } catch (error) {
      console.error('Failed to remove class:', error);
      webflow.notify.error('Failed to remove class');
      return false;
    }
  }

  /**
   * Toggle class on selected element
   */
  toggleClass(className: string): boolean {
    if (!this.selectedElement) {
      webflow.notify.error('Please select an element first');
      return false;
    }

    try {
      const classes = this.propertiesManager.getElementClasses(this.selectedElement);
      const hasClass = classes.includes(className);

      if (hasClass) {
        return this.removeClass(className);
      } else {
        return this.addClass(className);
      }
    } catch (error) {
      console.error('Failed to toggle class:', error);
      webflow.notify.error('Failed to toggle class');
      return false;
    }
  }

  /**
   * Get current element properties
   */
  getCurrentProperties(): object | null {
    if (!this.selectedElement) {
      return null;
    }

    return this.propertiesManager.getElementProperties(this.selectedElement);
  }

  /**
   * Get history of changes
   */
  getHistory(): Change[] {
    return this.historyManager.getHistory();
  }

  /**
   * Undo last change
   */
  undo(): boolean {
    const success = this.historyManager.undo();
    if (success) {
      webflow.notify.success('Change undone');
      this.updateEditorUI();
    }
    return success;
  }

  /**
   * Redo last change
   */
  redo(): boolean {
    const success = this.historyManager.redo();
    if (success) {
      webflow.notify.success('Change redone');
      this.updateEditorUI();
    }
    return success;
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.historyManager.clear();
    webflow.notify.info('History cleared');
  }

  /**
   * Get undo/redo state
   */
  getHistoryState(): { canUndo: boolean; canRedo: boolean; entries: number } {
    const history = this.historyManager.getHistory();
    return {
      canUndo: history.length > 0,
      canRedo: false, // Simplified - would track actual redo stack
      entries: history.length
    };
  }

  /**
   * Apply properties to multiple elements
   */
  applyToMultiple(
    elements: webflow.Element[],
    properties: PropertyUpdate
  ): number {
    let applied = 0;

    for (const element of elements) {
      try {
        if (this.editElement(element, properties)) {
          applied++;
        }
      } catch (error) {
        console.warn(`Failed to apply to element:`, error);
      }
    }

    if (applied > 0) {
      webflow.notify.success(`Updated ${applied} element(s)`);
    }

    return applied;
  }

  /**
   * Update editor UI (internal)
   */
  private updateEditorUI(): void {
    // Placeholder for UI update logic
    // In real implementation, would update the extension UI panel
    console.log('UI updated for selected element:', this.selectedElement?.getName());
  }

  /**
   * Get selected element
   */
  getSelectedElement(): webflow.Element | null {
    return this.selectedElement;
  }

  /**
   * Export properties as JSON
   */
  exportProperties(): object {
    if (!this.selectedElement) {
      return { error: 'No element selected' };
    }

    return {
      element: {
        id: this.selectedElement.getId?.(),
        name: this.selectedElement.getName?.(),
        tagName: this.selectedElement.getTagName?.()
      },
      properties: this.getCurrentProperties(),
      classes: this.propertiesManager.getElementClasses(this.selectedElement),
      timestamp: new Date().toISOString()
    };
  }
}

export default PropertyEditor;
