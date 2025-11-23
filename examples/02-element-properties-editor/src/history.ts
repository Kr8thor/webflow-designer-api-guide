/**
 * History Manager - Undo/Redo Support
 *
 * Maintains a history of changes for undo/redo functionality.
 */

/**
 * Change record interface
 */
export interface Change {
  element?: string;
  elementName?: string;
  before: any;
  after: any;
  timestamp: Date;
}

/**
 * History Manager class
 */
export class HistoryManager {
  private history: Change[] = [];
  private currentIndex = -1;
  private maxSize = 50;

  /**
   * Record a change
   */
  record(change: Change): void {
    try {
      // Remove any redo history if recording new change
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }

      // Add new change
      this.history.push(change);
      this.currentIndex++;

      // Maintain max size
      if (this.history.length > this.maxSize) {
        this.history.shift();
        this.currentIndex--;
      }

      console.log(`📝 Change recorded (${this.history.length} in history)`);
    } catch (error) {
      console.error('Failed to record change:', error);
    }
  }

  /**
   * Undo last change
   */
  undo(): boolean {
    try {
      if (this.currentIndex < 0) {
        console.log('Nothing to undo');
        return false;
      }

      const change = this.history[this.currentIndex];
      console.log(`↶ Undoing: ${change.elementName || 'element'}`);

      this.currentIndex--;
      return true;
    } catch (error) {
      console.error('Failed to undo:', error);
      return false;
    }
  }

  /**
   * Redo last undone change
   */
  redo(): boolean {
    try {
      if (this.currentIndex >= this.history.length - 1) {
        console.log('Nothing to redo');
        return false;
      }

      this.currentIndex++;
      const change = this.history[this.currentIndex];
      console.log(`↷ Redoing: ${change.elementName || 'element'}`);

      return true;
    } catch (error) {
      console.error('Failed to redo:', error);
      return false;
    }
  }

  /**
   * Get all history entries
   */
  getHistory(): Change[] {
    return [...this.history];
  }

  /**
   * Get current change index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get history size
   */
  getSize(): number {
    return this.history.length;
  }

  /**
   * Get can undo state
   */
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  /**
   * Get can redo state
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    console.log('🗑️  History cleared');
  }

  /**
   * Get history summary
   */
  getSummary(): object {
    return {
      totalEntries: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      entries: this.history.map((change) => ({
        element: change.elementName || 'unnamed',
        timestamp: change.timestamp.toLocaleTimeString()
      }))
    };
  }

  /**
   * Export history as JSON
   */
  export(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        entries: this.history.map((change) => ({
          element: change.element,
          elementName: change.elementName,
          before: change.before,
          after: change.after,
          timestamp: change.timestamp.toISOString()
        }))
      },
      null,
      2
    );
  }

  /**
   * Get most recent changes
   */
  getRecent(count = 10): Change[] {
    return this.history.slice(Math.max(0, this.history.length - count));
  }

  /**
   * Find changes for specific element
   */
  findByElement(elementId: string): Change[] {
    return this.history.filter((change) => change.element === elementId);
  }

  /**
   * Get history stats
   */
  getStats(): object {
    const elementIds = new Set<string>();
    let totalChanges = 0;

    for (const change of this.history) {
      if (change.element) {
        elementIds.add(change.element);
      }
      totalChanges++;
    }

    return {
      totalChanges,
      uniqueElements: elementIds.size,
      maxHistorySize: this.maxSize,
      currentSize: this.history.length
    };
  }
}

export { HistoryManager as default };
