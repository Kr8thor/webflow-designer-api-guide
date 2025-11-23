/**
 * Element Properties Editor - Main Entry Point
 *
 * Advanced example demonstrating:
 * - Property and attribute editing
 * - Style application and management
 * - Class manipulation
 * - History and undo/redo
 * - Batch operations
 */

import { webflow } from '@webflow/designer-api';
import { PropertyEditor } from './editor';

/**
 * Initialize the extension
 */
async function initializeExtension(): Promise<void> {
  try {
    console.log('🚀 Initializing Element Properties Editor');

    if (!webflow) {
      throw new Error('Designer API not available');
    }

    // Create editor instance
    const editor = new PropertyEditor();
    console.log('✅ Property editor initialized');

    // Make editor globally available for debugging
    (window as any).propertyEditor = editor;

    // Setup UI
    setupEditorUI(editor);
    console.log('✅ UI setup complete');

    webflow.notify.success('Element Properties Editor loaded');
    console.log('✅ Extension ready');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    webflow.notify.error('Failed to initialize editor');
    throw error;
  }
}

/**
 * Setup editor UI
 */
function setupEditorUI(editor: PropertyEditor): void {
  // Create container
  const container = document.createElement('div');
  container.id = 'editor-container';
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    padding: 16px;
  `;

  // Header
  const header = document.createElement('h2');
  header.textContent = '✏️ Element Editor';
  header.style.cssText = 'margin: 0 0 16px 0; font-size: 15px;';
  container.appendChild(header);

  // Properties display
  const propsDiv = document.createElement('div');
  propsDiv.id = 'properties-display';
  propsDiv.style.cssText = `
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
    max-height: 200px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 11px;
  `;
  propsDiv.innerHTML = '<p style="margin: 0; color: #999;">Select an element to edit</p>';
  container.appendChild(propsDiv);

  // Buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;';

  // Undo button
  const undoBtn = document.createElement('button');
  undoBtn.textContent = '↶ Undo';
  undoBtn.style.cssText = 'padding: 6px 10px; background: #0066ff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
  undoBtn.onclick = () => {
    if (editor.undo()) {
      updateDisplay(editor, propsDiv);
    }
  };
  buttonContainer.appendChild(undoBtn);

  // Redo button
  const redoBtn = document.createElement('button');
  redoBtn.textContent = '↷ Redo';
  redoBtn.style.cssText = 'padding: 6px 10px; background: #0066ff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
  redoBtn.onclick = () => {
    if (editor.redo()) {
      updateDisplay(editor, propsDiv);
    }
  };
  buttonContainer.appendChild(redoBtn);

  // Clear history button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '🗑️ Clear';
  clearBtn.style.cssText = 'padding: 6px 10px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
  clearBtn.onclick = () => {
    editor.clearHistory();
  };
  buttonContainer.appendChild(clearBtn);

  container.appendChild(buttonContainer);

  // Quick actions
  const actionsDiv = document.createElement('div');
  actionsDiv.style.cssText = 'border-top: 1px solid #e0e0e0; padding-top: 12px;';

  const actionsTitle = document.createElement('h3');
  actionsTitle.textContent = 'Quick Actions';
  actionsTitle.style.cssText = 'margin: 0 0 8px 0; font-size: 12px; font-weight: 600;';
  actionsDiv.appendChild(actionsTitle);

  // Add common class button
  const addClassBtn = document.createElement('button');
  addClassBtn.textContent = 'Add .active';
  addClassBtn.style.cssText = 'padding: 6px 10px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; margin-right: 8px; margin-bottom: 8px;';
  addClassBtn.onclick = () => {
    if (editor.addClass('active')) {
      updateDisplay(editor, propsDiv);
    }
  };
  actionsDiv.appendChild(addClassBtn);

  // Export button
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export';
  exportBtn.style.cssText = 'padding: 6px 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; margin-right: 8px; margin-bottom: 8px;';
  exportBtn.onclick = () => {
    const props = editor.exportProperties();
    console.log('Exported Properties:', props);
    webflow.notify.info('Properties exported to console');
  };
  actionsDiv.appendChild(exportBtn);

  container.appendChild(actionsDiv);

  // Append to document
  document.body.appendChild(container);

  // Setup listener to update display
  webflow.on('selectedElementsChange', () => {
    updateDisplay(editor, propsDiv);
  });
}

/**
 * Update properties display
 */
function updateDisplay(editor: PropertyEditor, container: HTMLElement): void {
  const selected = editor.getSelectedElement();

  if (!selected) {
    container.innerHTML = '<p style="margin: 0; color: #999;">No element selected</p>';
    return;
  }

  const props = editor.getCurrentProperties();
  const history = editor.getHistoryState();

  let html = `<p style="margin: 4px 0;"><strong>${selected.getName?.() || 'Element'}</strong></p>`;
  html += `<p style="margin: 4px 0; color: #666;">ID: ${selected.getId?.()}</p>`;
  html += `<p style="margin: 4px 0; color: #666;">History: ${history.entries} entries</p>`;

  if (props) {
    html += `<p style="margin: 4px 0; color: #666;"><pre style="margin: 0;">${JSON.stringify(props, null, 2)}</pre></p>`;
  }

  container.innerHTML = html;
}

// Start extension
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
