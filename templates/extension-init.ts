// Extension Init Template
// Basic scaffold for creating a Webflow Designer Extension
// Use this as a starting point for any new extension project

import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Webflow Designer API object available globally
 * Provides access to all Designer API methods and events
 */
declare global {
  interface Window {
    webflow: WebflowAPI;
  }
}

interface WebflowAPI {
  /**
   * Get the root element of the current page
   */
  getRootElement: () => Promise<HTMLElement>;

  /**
   * Get the currently selected element in the Designer
   */
  getSelectedElement: () => Promise<HTMLElement | null>;

  /**
   * Get information about the current site
   */
  getSiteInfo: () => Promise<SiteInfo>;

  /**
   * Subscribe to Designer events
   */
  on: (event: string, handler: (data: any) => void) => void;

  /**
   * Unsubscribe from Designer events
   */
  off: (event: string, handler: (data: any) => void) => void;

  /**
   * Publish changes to the Designer
   */
  triggerUpdate: (updates: any) => Promise<void>;
}

interface SiteInfo {
  id: string;
  name: string;
  url: string;
  displayName: string;
}

/**
 * Main Extension Initialization
 */
async function initializeExtension() {
  console.log('🚀 Initializing Webflow Designer Extension...');

  try {
    // Wait for Webflow API to be available
    if (!window.webflow) {
      console.error('❌ Webflow API not available');
      return;
    }

    // Get site information
    const siteInfo = await window.webflow.getSiteInfo();
    console.log('✅ Connected to site:', siteInfo.displayName);

    // Initialize React app
    const container = document.getElementById('root');
    if (!container) {
      console.error('❌ Root container not found');
      return;
    }

    const root = createRoot(container);
    root.render(<App siteInfo={siteInfo} />);

    // Setup Designer event listeners
    setupEventListeners();

    console.log('✅ Extension initialized successfully');
  } catch (error) {
    console.error('❌ Extension initialization failed:', error);
  }
}

/**
 * Setup Designer API event listeners
 */
function setupEventListeners() {
  // Listen to element selection changes
  window.webflow.on('selectedElementChanged', (element) => {
    console.log('📍 Selected element changed:', element);
    // Update your UI based on selection
  });

  // Listen to page navigation
  window.webflow.on('pageChanged', (page) => {
    console.log('📄 Page changed:', page);
  });

  // Listen to breakpoint changes
  window.webflow.on('breakpointChanged', (breakpoint) => {
    console.log('📱 Breakpoint changed:', breakpoint);
  });
}

/**
 * Error handling wrapper for API calls
 */
export async function safeAPICall<T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error(`❌ ${errorMessage}:`, error);
    return null;
  }
}

/**
 * Initialize extension when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

export default initializeExtension;
