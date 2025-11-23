/**
 * Basic Designer Extension - Main Entry Point
 *
 * This is a foundational example demonstrating core Designer API functionality.
 * It shows how to:
 * - Initialize a Designer Extension
 * - Setup UI components
 * - Handle Designer events
 * - Provide user feedback
 *
 * @example
 * npm run build
 * # Then load the extension in Webflow Designer
 */

import { webflow } from '@webflow/designer-api';
import { initializeUI } from './ui';
import { setupEventHandlers } from './handlers';

/**
 * Initialize the extension
 */
async function initializeExtension(): Promise<void> {
  try {
    console.log('🚀 Initializing Basic Designer Extension');

    // Verify Designer API is available
    if (!webflow) {
      throw new Error('Designer API not available');
    }

    console.log('✅ Designer API available');

    // Initialize UI
    initializeUI();
    console.log('✅ UI initialized');

    // Setup event handlers
    setupEventHandlers();
    console.log('✅ Event handlers registered');

    // Notify user
    webflow.notify.success('Basic Designer Extension loaded successfully');
    console.log('✅ Extension ready');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    webflow.notify.error('Failed to initialize extension');
    throw error;
  }
}

// Start the extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeExtension().catch((error) => {
      console.error('Fatal error:', error);
    });
  });
} else {
  initializeExtension().catch((error) => {
    console.error('Fatal error:', error);
  });
}

export { initializeExtension };
