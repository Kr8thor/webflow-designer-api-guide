/**
 * Webflow Designer Toolkit - Main Entry Point
 *
 * Complete extension integrating all Designer API capabilities:
 * - Component management
 * - Token/variable management
 * - Asset management
 * - Page operations
 * - Event handling
 * - Selection management
 *
 * All with a professional, intuitive UI
 */

import { webflow } from './types';
import { DesignerToolkit } from './toolkit';
import { buildUI } from './ui';

/**
 * Initialize the extension
 */
async function initializeExtension(): Promise<void> {
  try {
    console.log('🚀 Initializing Webflow Designer Toolkit');

    if (!webflow) {
      throw new Error('Designer API not available');
    }

    // Create toolkit manager
    const toolkit = new DesignerToolkit();

    // Initialize
    await toolkit.initialize();
    console.log('✅ Toolkit initialized');

    // Build UI
    await buildUI(toolkit);
    console.log('✅ UI loaded');

    // Make toolkit available globally for debugging
    (window as any).toolkit = toolkit;

    // Notify user
    webflow.notify.success('Designer Toolkit ready - See right panel');
    console.log('✅ Extension ready');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    webflow.notify.error('Failed to initialize Designer Toolkit');
    throw error;
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeExtension().catch(console.error);
  });
} else {
  initializeExtension().catch(console.error);
}

export { DesignerToolkit };
