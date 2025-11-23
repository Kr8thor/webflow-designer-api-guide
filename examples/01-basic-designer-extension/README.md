# Basic Designer Extension Example

A foundational example demonstrating core Designer API functionality with minimal setup.

## Overview

This example shows how to:
- Initialize a basic Designer Extension
- Access selected elements
- Manipulate element properties
- Respond to Designer events
- Provide user feedback

## What This Extension Does

The extension provides a simple panel with these features:
1. **Element Inspector** - Display properties of selected elements
2. **Quick Style Editor** - Apply common styling quickly
3. **Event Monitor** - Show Designer events in real-time
4. **Helper Toolbar** - Quick access to common operations

## Project Structure

```
01-basic-designer-extension/
├── src/
│   ├── index.ts           # Main extension entry point
│   ├── ui.ts              # UI component definitions
│   ├── handlers.ts        # Event handlers
│   └── utils.ts           # Utility functions
├── manifest.json          # Extension manifest
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## Setup & Installation

### Prerequisites

```bash
# Node.js 16+ and npm 7+
node --version
npm --version

# Install @webflow/designer-api
npm install @webflow/designer-api
npm install --save-dev typescript @types/node
```

### Installation Steps

```bash
# Navigate to example directory
cd examples/01-basic-designer-extension

# Install dependencies
npm install

# Build TypeScript
npm run build

# For development with watch mode
npm run dev
```

## Key Components

### Main Extension Entry Point (src/index.ts)

```typescript
import { webflow } from '@webflow/designer-api';
import { initializeUI } from './ui';
import { setupEventHandlers } from './handlers';

async function initializeExtension() {
  try {
    console.log('Initializing Basic Designer Extension');

    // Setup UI
    initializeUI();

    // Setup event handlers
    setupEventHandlers();

    webflow.notify.success('Extension loaded successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    webflow.notify.error('Failed to initialize extension');
  }
}

// Start extension
initializeExtension();
```

### Element Inspector (src/ui.ts)

```typescript
import { webflow } from '@webflow/designer-api';

export function initializeUI() {
  // Create panel container
  const panel = document.createElement('div');
  panel.id = 'extension-panel';
  panel.style.cssText = `
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;

  // Header
  const header = document.createElement('h2');
  header.textContent = 'Element Inspector';
  header.style.margin = '0 0 16px 0';
  panel.appendChild(header);

  // Selection info
  const info = document.createElement('div');
  info.id = 'selection-info';
  info.style.cssText = 'background: #f5f5f5; padding: 8px; border-radius: 4px;';
  panel.appendChild(info);

  // Update selection info
  updateSelectionInfo(info);
}

function updateSelectionInfo(container: HTMLElement) {
  const selected = webflow.getSelectedElements();

  if (selected.length === 0) {
    container.innerHTML = '<p>No elements selected</p>';
    return;
  }

  let html = `<p><strong>Selected:</strong> ${selected.length} element(s)</p>`;

  selected.forEach((el, index) => {
    html += `<p>Element ${index + 1}: ${el.getName() || 'Unnamed'}</p>`;
  });

  container.innerHTML = html;
}

export { updateSelectionInfo };
```

### Event Handlers (src/handlers.ts)

```typescript
import { webflow } from '@webflow/designer-api';
import { updateSelectionInfo } from './ui';

export function setupEventHandlers() {
  // Listen for selection changes
  webflow.on('selectedElementsChange', (elements) => {
    console.log('Selection changed:', elements.length);
    const info = document.getElementById('selection-info');
    if (info) {
      updateSelectionInfo(info);
    }
  });

  // Listen for page changes
  webflow.on('pageChange', (page) => {
    console.log('Page changed:', page?.getName());
    webflow.notify.info(`Switched to page: ${page?.getName()}`);
  });

  // Log element creation
  webflow.on('elementCreate', (element) => {
    console.log('Element created:', element.getName());
  });
}
```

### Utilities (src/utils.ts)

```typescript
import { webflow } from '@webflow/designer-api';

/**
 * Safely apply classes to selected elements
 */
export async function applyClassToSelection(className: string): Promise<number> {
  try {
    const selected = webflow.getSelectedElements();

    if (selected.length === 0) {
      webflow.notify.error('Please select elements first');
      return 0;
    }

    let applied = 0;
    for (const element of selected) {
      const current = element.getAttributes()?.class || '';
      const updated = current ? `${current} ${className}` : className;
      element.setAttributes({ class: updated });
      applied++;
    }

    webflow.notify.success(`Applied class to ${applied} element(s)`);
    return applied;
  } catch (error) {
    console.error('Failed to apply class:', error);
    webflow.notify.error('Failed to apply class');
    return 0;
  }
}

/**
 * Get element hierarchy as string
 */
export function getElementHierarchy(): string {
  const page = webflow.getCurrentPage();
  if (!page) return 'No page selected';

  let hierarchy = '';
  const elements = page.getElements?.() || [];

  function buildHierarchy(els: any[], indent = 0) {
    for (const el of els) {
      hierarchy += `${'  '.repeat(indent)}└ ${el.getName()}\n`;
      const children = el.getChildren?.() || [];
      if (children.length > 0) {
        buildHierarchy(children, indent + 1);
      }
    }
  }

  buildHierarchy(elements);
  return hierarchy;
}

/**
 * Get statistics about current page
 */
export function getPageStats(): object {
  const page = webflow.getCurrentPage();
  if (!page) return { elements: 0 };

  const elements = page.getElements?.() || [];
  const components = webflow.getComponents() || [];

  return {
    totalElements: elements.length,
    totalComponents: components.length,
    currentPage: page.getName(),
    timestamp: new Date().toISOString()
  };
}
```

## Configuration Files

### manifest.json

```json
{
  "name": "Basic Designer Extension",
  "version": "1.0.0",
  "description": "A foundational Designer Extension example",
  "permissions": [
    "element:read",
    "element:write",
    "page:read",
    "event:listen"
  ],
  "ui": {
    "position": "right"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### package.json

```json
{
  "name": "basic-designer-extension",
  "version": "1.0.0",
  "description": "Basic Designer Extension example",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc",
    "test": "echo \"Tests pending\""
  },
  "dependencies": {
    "@webflow/designer-api": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Testing the Extension

### Verification Steps

1. **Build the extension**
   ```bash
   npm run build
   ```

2. **Load in Webflow**
   - Open Webflow Designer
   - Install the extension from the built bundle

3. **Test Element Selection**
   - Select an element in the canvas
   - Verify the inspector shows the correct element

4. **Test Events**
   - Switch pages and verify the notification appears
   - Create new elements and watch the console logs

5. **Test Style Application**
   - Select multiple elements
   - Apply a class using the utilities
   - Verify styles are applied

## Troubleshooting

### Extension doesn't load
- Check browser console for errors
- Verify manifest.json is valid
- Ensure all TypeScript compiled successfully

### Selection change not detected
- Verify `webflow.on()` listener is attached
- Check browser console for event logs
- Make sure element is actually selected in Designer

### Styles not applying
- Verify element selection first
- Check that class exists in Webflow styles
- Review browser console for API errors

## Learning Path

This example teaches:
1. ✅ Basic extension initialization
2. ✅ Event listener setup
3. ✅ Element selection and manipulation
4. ✅ User feedback with notifications
5. ✅ TypeScript with Designer API
6. ✅ Error handling patterns

**Next:** Move to `02-element-properties-editor` for advanced manipulation patterns.

## Resources

- [Designer API Documentation](https://developers.webflow.com/designer-api)
- [API Playground](https://playground.webflow.dev/)
- [Webflow Developers](https://developers.webflow.com/)

---

**Status**: Production Ready
**Last Updated**: November 23, 2025
**Version**: 1.0
