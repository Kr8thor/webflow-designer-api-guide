/**
 * UI Components - Extension Interface
 */

import { webflow } from './types';
import { DesignerToolkit, DashboardStats, ComponentInfo, PageInfo, AssetInfo, TokenInfo } from './toolkit';

/**
 * Build and display the UI
 */
export async function buildUI(toolkit: DesignerToolkit): Promise<void> {
  const container = document.createElement('div');
  container.id = 'toolkit-container';
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    color: #333;
  `;

  // Header
  const header = createHeader();
  container.appendChild(header);

  // Tab navigation
  const tabs = createTabs(toolkit);
  container.appendChild(tabs);

  // Content area
  const content = document.createElement('div');
  content.id = 'content-area';
  content.style.cssText = 'padding: 16px; min-height: 400px;';

  // Load dashboard initially
  await loadDashboard(toolkit, content);

  container.appendChild(content);
  document.body.appendChild(container);

  // Setup event listeners
  webflow.on('selectedElementsChange', async () => {
    await updateDashboard(toolkit, content);
  });

  webflow.on('pageChange', async () => {
    await updateDashboard(toolkit, content);
  });
}

/**
 * Create header
 */
function createHeader(): HTMLElement {
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
    background: linear-gradient(135deg, #0066ff, #0052cc);
    color: white;
  `;

  const title = document.createElement('h2');
  title.textContent = '⚙️ Designer Toolkit';
  title.style.cssText = 'margin: 0; font-size: 18px; font-weight: 600;';
  header.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Complete design system management';
  subtitle.style.cssText = 'margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;';
  header.appendChild(subtitle);

  return header;
}

/**
 * Create tab navigation
 */
function createTabs(toolkit: DesignerToolkit): HTMLElement {
  const tabs = document.createElement('div');
  tabs.style.cssText = `
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    background: #f9f9f9;
  `;

  const tabConfig = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'components', label: '🧩 Components' },
    { id: 'pages', label: '📄 Pages' },
    { id: 'assets', label: '🖼️ Assets' },
    { id: 'tokens', label: '🎨 Tokens' }
  ];

  for (const tab of tabConfig) {
    const button = document.createElement('button');
    button.textContent = tab.label;
    button.style.cssText = `
      flex: 1;
      padding: 12px;
      border: none;
      background: transparent;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
    `;

    button.onclick = async () => {
      // Update active state
      tabs.querySelectorAll('button').forEach((b) => {
        b.style.borderBottomColor = 'transparent';
        b.style.color = '#666';
      });
      button.style.borderBottomColor = '#0066ff';
      button.style.color = '#0066ff';

      // Load content
      const content = document.getElementById('content-area');
      if (!content) return;

      content.innerHTML = '';

      switch (tab.id) {
        case 'dashboard':
          await loadDashboard(toolkit, content);
          break;
        case 'components':
          await loadComponents(toolkit, content);
          break;
        case 'pages':
          await loadPages(toolkit, content);
          break;
        case 'assets':
          await loadAssets(toolkit, content);
          break;
        case 'tokens':
          await loadTokens(toolkit, content);
          break;
      }
    };

    if (tab.id === 'dashboard') {
      button.style.borderBottomColor = '#0066ff';
      button.style.color = '#0066ff';
    }

    tabs.appendChild(button);
  }

  return tabs;
}

/**
 * Load dashboard tab
 */
async function loadDashboard(toolkit: DesignerToolkit, container: HTMLElement): Promise<void> {
  const stats = toolkit.getDashboardStats();

  const html = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div class="stat-card">
        <div class="stat-label">Components</div>
        <div class="stat-value">${stats.components}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pages</div>
        <div class="stat-value">${stats.pages}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Tokens</div>
        <div class="stat-value">${stats.tokens}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Assets</div>
        <div class="stat-value">${stats.assets}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Page Elements</div>
        <div class="stat-value">${stats.elements}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Selected</div>
        <div class="stat-value">${stats.selection}</div>
      </div>
    </div>

    <div style="border: 1px solid #e5e5e5; border-radius: 6px; padding: 12px; background: #f9f9f9; margin-bottom: 16px;">
      <p style="margin: 0 0 8px 0; font-weight: 600;">Current Page</p>
      <p style="margin: 0; color: #0066ff; font-weight: 500;">${stats.currentPage}</p>
    </div>

    <div>
      <p style="margin: 0 0 8px 0; font-weight: 600;">Quick Actions</p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button onclick="alert('See guides for advanced operations')" style="padding: 6px 12px; background: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
          📖 Learn More
        </button>
        <button onclick="alert('Open API Reference for details')" style="padding: 6px 12px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
          📚 API Docs
        </button>
      </div>
    </div>

    <style>
      .stat-card {
        background: white;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        padding: 12px;
        text-align: center;
      }
      .stat-label {
        font-size: 11px;
        color: #999;
        margin-bottom: 4px;
      }
      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #0066ff;
      }
    </style>
  `;

  container.innerHTML = html;
}

/**
 * Update dashboard
 */
async function updateDashboard(toolkit: DesignerToolkit, container: HTMLElement): Promise<void> {
  await toolkit.updateStats();
  await loadDashboard(toolkit, container);
}

/**
 * Load components tab
 */
async function loadComponents(toolkit: DesignerToolkit, container: HTMLElement): Promise<void> {
  const components = await toolkit.getComponents();

  if (components.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No components found</p>';
    return;
  }

  let html = '<div style="max-height: 400px; overflow-y: auto;">';

  for (const comp of components) {
    html += `
      <div style="padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 12px;">
        <p style="margin: 0; font-weight: 600; color: #0066ff;">${comp.name}</p>
        <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">
          ${comp.instances} instances • ${comp.variants} variants
        </p>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Load pages tab
 */
async function loadPages(toolkit: DesignerToolkit, container: HTMLElement): Promise<void> {
  const pages = await toolkit.getPages();

  if (pages.length === 0) {
    container.innerHTML = '<p style="color: #999;">No pages found</p>';
    return;
  }

  let html = '<div style="max-height: 400px; overflow-y: auto;">';

  for (const page of pages) {
    html += `
      <div style="padding: 8px; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0; font-weight: 600; color: #0066ff;">${page.name}</p>
        <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">${page.elements} elements</p>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Load assets tab
 */
async function loadAssets(toolkit: DesignerToolkit, container: HTMLElement): Promise<void> {
  const assets = await toolkit.getAssets();

  if (assets.length === 0) {
    container.innerHTML = '<p style="color: #999;">No assets found</p>';
    return;
  }

  let html = '<div style="max-height: 400px; overflow-y: auto;">';

  for (const asset of assets) {
    const size = (asset.size / 1024).toFixed(1);
    html += `
      <div style="padding: 8px; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0; font-weight: 600; color: #0066ff;">${asset.name}</p>
        <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">${asset.type} • ${size}KB</p>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Load tokens tab
 */
async function loadTokens(toolkit: DesignerToolkit, container: HTMLElement): Promise<void> {
  const tokens = await toolkit.getTokens();

  if (tokens.length === 0) {
    container.innerHTML = '<p style="color: #999;">No tokens found</p>';
    return;
  }

  let html = '<div style="max-height: 400px; overflow-y: auto;">';

  for (const token of tokens) {
    html += `
      <div style="padding: 8px; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0; font-weight: 600; color: #0066ff;">${token.name}</p>
        <p style="margin: 4px 0 0 0; color: #999; font-size: 11px;">${token.type}</p>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}
