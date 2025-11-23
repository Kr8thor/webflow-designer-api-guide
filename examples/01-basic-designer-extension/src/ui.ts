/**
 * UI Components - Extension Interface
 *
 * Manages the visual interface of the extension including:
 * - Element inspector panel
 * - Style editor controls
 * - Event monitor display
 * - Helper toolbar
 */

import { webflow } from '@webflow/designer-api';

/**
 * Initialize the extension UI
 */
export function initializeUI(): void {
  // Create main container
  const container = document.createElement('div');
  container.id = 'extension-container';
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    color: #333;
  `;

  // Create header
  const header = createHeader();
  container.appendChild(header);

  // Create inspector section
  const inspector = createInspector();
  container.appendChild(inspector);

  // Create toolbar section
  const toolbar = createToolbar();
  container.appendChild(toolbar);

  // Create event monitor
  const monitor = createEventMonitor();
  container.appendChild(monitor);

  // Append to document
  document.body.appendChild(container);

  // Initial update
  updateSelectionInfo();
}

/**
 * Create header section
 */
function createHeader(): HTMLElement {
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
    background: #f9f9f9;
  `;

  const title = document.createElement('h2');
  title.textContent = '🎨 Basic Designer Extension';
  title.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600;';
  header.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Select elements to inspect and modify';
  subtitle.style.cssText = `
    margin: 8px 0 0 0;
    font-size: 12px;
    color: #666;
  `;
  header.appendChild(subtitle);

  return header;
}

/**
 * Create element inspector section
 */
function createInspector(): HTMLElement {
  const section = document.createElement('div');
  section.style.cssText = `
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
  `;

  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = 'Element Inspector';
  sectionTitle.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; font-weight: 600;';
  section.appendChild(sectionTitle);

  const info = document.createElement('div');
  info.id = 'selection-info';
  info.style.cssText = `
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    min-height: 60px;
  `;
  section.appendChild(info);

  // Initial update
  updateSelectionInfo();

  return section;
}

/**
 * Create toolbar section with quick actions
 */
function createToolbar(): HTMLElement {
  const section = document.createElement('div');
  section.style.cssText = `
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
  `;

  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = 'Quick Actions';
  sectionTitle.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; font-weight: 600;';
  section.appendChild(sectionTitle);

  // Button styles
  const buttonStyle = `
    padding: 8px 12px;
    margin-right: 8px;
    margin-bottom: 8px;
    background: #0066ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background 0.2s;
  `;

  // Button: Get hierarchy
  const hierarchyBtn = document.createElement('button');
  hierarchyBtn.textContent = 'Show Hierarchy';
  hierarchyBtn.style.cssText = buttonStyle;
  hierarchyBtn.onclick = () => {
    const hierarchy = getElementHierarchy();
    console.log('Element Hierarchy:\n' + hierarchy);
    webflow.notify.info('Hierarchy logged to console');
  };
  section.appendChild(hierarchyBtn);

  // Button: Get stats
  const statsBtn = document.createElement('button');
  statsBtn.textContent = 'Page Stats';
  statsBtn.style.cssText = buttonStyle;
  statsBtn.onclick = () => {
    const stats = getPageStats();
    console.log('Page Stats:', stats);
    webflow.notify.info(
      `Elements: ${(stats as any).totalElements}, Components: ${(stats as any).totalComponents}`
    );
  };
  section.appendChild(statsBtn);

  // Button: Clear console
  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear Console';
  clearBtn.style.cssText = `${buttonStyle} background: #666;`;
  clearBtn.onclick = () => {
    console.clear();
    webflow.notify.info('Console cleared');
  };
  section.appendChild(clearBtn);

  return section;
}

/**
 * Create event monitor section
 */
function createEventMonitor(): HTMLElement {
  const section = document.createElement('div');
  section.style.cssText = `
    padding: 16px;
  `;

  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = 'Event Monitor';
  sectionTitle.style.cssText = 'margin: 0 0 12px 0; font-size: 14px; font-weight: 600;';
  section.appendChild(sectionTitle);

  const monitor = document.createElement('div');
  monitor.id = 'event-monitor';
  monitor.style.cssText = `
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    max-height: 150px;
    overflow-y: auto;
    color: #666;
  `;
  monitor.innerHTML = '<p style="margin: 0;">Waiting for events...</p>';
  section.appendChild(monitor);

  return section;
}

/**
 * Update the selection info display
 */
export function updateSelectionInfo(): void {
  const container = document.getElementById('selection-info');
  if (!container) return;

  try {
    const selected = webflow.getSelectedElements();

    if (selected.length === 0) {
      container.innerHTML = '<p style="margin: 0; color: #999;">No elements selected</p>';
      return;
    }

    let html = `<p style="margin: 0 0 8px 0; font-weight: 600;">Selected: ${selected.length} element(s)</p>`;

    selected.forEach((el, index) => {
      const name = el.getName() || '(unnamed)';
      const tagName = el.getTagName?.() || 'div';
      html += `<p style="margin: 4px 0;">
        <span style="color: #0066ff;">[${index + 1}]</span>
        &lt;${tagName}&gt; ${name}
      </p>`;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error('Failed to update selection info:', error);
    container.innerHTML = '<p style="margin: 0; color: #cc0000;">Error loading selection</p>';
  }
}

/**
 * Log event to the event monitor
 */
export function logEvent(eventType: string, details: string): void {
  const monitor = document.getElementById('event-monitor');
  if (!monitor) return;

  // Create event entry
  const entry = document.createElement('p');
  entry.style.cssText = 'margin: 4px 0; padding: 4px; background: white; border-radius: 2px;';

  const timestamp = new Date().toLocaleTimeString();
  entry.innerHTML = `
    <span style="color: #666;">${timestamp}</span>
    <span style="color: #0066ff; margin-left: 8px; font-weight: 600;">${eventType}</span>
    <span style="color: #999; margin-left: 8px;">${details}</span>
  `;

  // Add to monitor
  monitor.insertBefore(entry, monitor.firstChild);

  // Keep last 20 events
  while (monitor.children.length > 20) {
    monitor.removeChild(monitor.lastChild!);
  }
}

/**
 * Get element hierarchy as string
 */
function getElementHierarchy(): string {
  try {
    const page = webflow.getCurrentPage();
    if (!page) return 'No page selected';

    let hierarchy = '';
    const elements = page.getElements?.() || [];

    function buildHierarchy(els: any[], indent = 0): void {
      for (const el of els) {
        const name = el.getName?.() || '(unnamed)';
        hierarchy += `${'  '.repeat(indent)}└ ${name}\n`;
        const children = el.getChildren?.() || [];
        if (children.length > 0) {
          buildHierarchy(children, indent + 1);
        }
      }
    }

    buildHierarchy(elements);
    return hierarchy;
  } catch (error) {
    console.error('Failed to get hierarchy:', error);
    return 'Error building hierarchy';
  }
}

/**
 * Get page statistics
 */
function getPageStats(): object {
  try {
    const page = webflow.getCurrentPage();
    if (!page) {
      return {
        elements: 0,
        components: 0,
        currentPage: 'No page selected'
      };
    }

    const elements = page.getElements?.() || [];
    const components = webflow.getComponents?.() || [];

    return {
      totalElements: elements.length,
      totalComponents: components.length,
      currentPage: page.getName?.() || 'Unknown',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return { error: String(error) };
  }
}

export { updateSelectionInfo as default };
