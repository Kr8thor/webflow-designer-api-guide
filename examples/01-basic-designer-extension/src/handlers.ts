/**
 * Event Handlers - Designer Event Management
 *
 * Sets up listeners for Designer events including:
 * - Element selection changes
 * - Page navigation
 * - Element creation/deletion
 * - Property changes
 */

import { webflow } from '@webflow/designer-api';
import { updateSelectionInfo, logEvent } from './ui';

/**
 * Setup all event handlers
 */
export function setupEventHandlers(): void {
  try {
    // Register selection change listener
    registerSelectionChangeListener();

    // Register page change listener
    registerPageChangeListener();

    // Register element creation listener
    registerElementCreationListener();

    // Register element deletion listener
    registerElementDeletionListener();

    console.log('✅ All event handlers registered');
  } catch (error) {
    console.error('Failed to setup event handlers:', error);
    webflow.notify.error('Failed to setup event handlers');
  }
}

/**
 * Listen for element selection changes
 */
function registerSelectionChangeListener(): void {
  webflow.on('selectedElementsChange', (elements) => {
    try {
      console.log(`Selection changed: ${elements.length} element(s)`);

      // Update UI
      updateSelectionInfo();

      // Log to event monitor
      logEvent(
        'Selection Changed',
        `${elements.length} element(s) selected`
      );

      // Get names of selected elements
      const names = elements
        .map((el) => el.getName() || '(unnamed)')
        .join(', ');

      if (elements.length > 0) {
        console.log(`Selected elements: ${names}`);
      }
    } catch (error) {
      console.error('Error handling selection change:', error);
    }
  });

  console.log('✅ Selection change listener registered');
}

/**
 * Listen for page navigation changes
 */
function registerPageChangeListener(): void {
  webflow.on('pageChange', (page) => {
    try {
      const pageName = page?.getName?.() || 'Unknown';
      console.log(`Page changed: ${pageName}`);

      // Log to event monitor
      logEvent('Page Changed', `Navigated to: ${pageName}`);

      // Optional: Notify user
      webflow.notify.info(`Switched to page: ${pageName}`);
    } catch (error) {
      console.error('Error handling page change:', error);
    }
  });

  console.log('✅ Page change listener registered');
}

/**
 * Listen for element creation events
 */
function registerElementCreationListener(): void {
  webflow.on('elementCreate', (element) => {
    try {
      const elementName = element.getName?.() || '(unnamed)';
      const tagName = element.getTagName?.() || 'div';

      console.log(`Element created: <${tagName}> ${elementName}`);

      // Log to event monitor
      logEvent('Element Created', `<${tagName}> ${elementName}`);
    } catch (error) {
      console.error('Error handling element creation:', error);
    }
  });

  console.log('✅ Element creation listener registered');
}

/**
 * Listen for element deletion events
 */
function registerElementDeletionListener(): void {
  webflow.on('elementDelete', (elementId) => {
    try {
      console.log(`Element deleted: ${elementId}`);

      // Log to event monitor
      logEvent('Element Deleted', elementId);

      // Update UI
      updateSelectionInfo();
    } catch (error) {
      console.error('Error handling element deletion:', error);
    }
  });

  console.log('✅ Element deletion listener registered');
}

/**
 * Cleanup handlers (call when extension unloads)
 */
export function cleanupHandlers(): void {
  try {
    webflow.off('selectedElementsChange', updateSelectionInfo);
    webflow.off('pageChange');
    webflow.off('elementCreate');
    webflow.off('elementDelete');

    console.log('✅ Event handlers cleaned up');
  } catch (error) {
    console.error('Failed to cleanup handlers:', error);
  }
}

/**
 * Get a summary of all registered listeners
 */
export function getHandlersSummary(): object {
  return {
    registered: [
      'selectedElementsChange',
      'pageChange',
      'elementCreate',
      'elementDelete'
    ],
    status: 'All handlers active'
  };
}

export { setupEventHandlers as default };
