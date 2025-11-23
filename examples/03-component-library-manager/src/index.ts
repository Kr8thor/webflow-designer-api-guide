/**
 * Component Library Manager - Entry Point
 */

import { webflow } from '@webflow/designer-api';
import { ComponentLibraryManager } from './manager';

async function initializeExtension(): Promise<void> {
  try {
    console.log('🚀 Initializing Component Library Manager');

    const manager = new ComponentLibraryManager();
    (window as any).componentLibrary = manager;

    // Load and display components
    const components = await manager.getAllComponents();
    console.log(`📦 Found ${components.length} components`);

    // Setup UI
    setupUI(manager);

    webflow.notify.success('Component Library Manager loaded');
  } catch (error) {
    console.error('Initialization failed:', error);
    webflow.notify.error('Failed to initialize');
  }
}

function setupUI(manager: ComponentLibraryManager): void {
  const container = document.createElement('div');
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 16px;
    font-size: 13px;
  `;

  const header = document.createElement('h2');
  header.textContent = '📦 Component Library';
  header.style.margin = '0 0 16px 0';
  container.appendChild(header);

  const stats = document.createElement('div');
  stats.style.cssText = 'background: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 16px;';

  const componentStats = manager.getComponentStats() as any;
  stats.innerHTML = `
    <p style="margin: 0;"><strong>${componentStats.totalComponents}</strong> Components</p>
    <p style="margin: 4px 0;"><strong>${componentStats.totalInstances}</strong> Instances</p>
    <p style="margin: 4px 0;"><strong>${componentStats.totalVariants}</strong> Variants</p>
  `;
  container.appendChild(stats);

  const buttons = document.createElement('div');
  buttons.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = '🔄 Refresh';
  refreshBtn.style.cssText = 'padding: 8px 12px; background: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer;';
  refreshBtn.onclick = async () => {
    const updated = await manager.getAllComponents();
    webflow.notify.success(`Loaded ${updated.length} components`);
  };
  buttons.appendChild(refreshBtn);

  const exportBtn = document.createElement('button');
  exportBtn.textContent = '💾 Export';
  exportBtn.style.cssText = 'padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;';
  exportBtn.onclick = () => {
    const backup = manager.exportComponentLibrary();
    console.log('Component Library Backup:', backup);
    webflow.notify.success('Exported to console');
  };
  buttons.appendChild(exportBtn);

  const graphBtn = document.createElement('button');
  graphBtn.textContent = '🔗 Dependencies';
  graphBtn.style.cssText = 'padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;';
  graphBtn.onclick = () => {
    const graph = manager.getDependencyGraph();
    console.log('Dependency Graph:', graph);
    webflow.notify.info('Dependency graph logged');
  };
  buttons.appendChild(graphBtn);

  container.appendChild(buttons);
  document.body.appendChild(container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}
