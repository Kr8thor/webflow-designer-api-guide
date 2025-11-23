# Element Properties Editor Example

Advanced example demonstrating comprehensive element property manipulation and real-time editing.

## Overview

This example shows how to:
- Create a visual property editor
- Manipulate element attributes dynamically
- Apply inline styles programmatically
- Handle batch element operations
- Provide real-time visual feedback
- Validate user input

## What This Extension Does

A fully-featured element property editor with:
1. **Attribute Editor** - View and edit element attributes
2. **Style Editor** - Apply inline CSS styles
3. **Class Manager** - Add/remove CSS classes
4. **Batch Operations** - Apply changes to multiple elements
5. **History & Undo** - Revert recent changes
6. **Live Preview** - See changes in real-time

## Key Features

### Attribute Management
```typescript
// View element attributes
getAttributes(): { [key: string]: any }

// Update attributes
setAttributes(attrs: { [key: string]: any }): void

// Add single attribute
setAttributeSafely(name: string, value: string): boolean
```

### Style Application
```typescript
// Apply inline styles
setInlineStyle(property: string, value: string): void

// Get computed styles
getComputedStyles(): CSSStyleDeclaration

// Remove specific style
removeInlineStyle(property: string): void
```

### Class Manipulation
```typescript
// Add class
addClass(className: string): void

// Remove class
removeClass(className: string): void

// Toggle class
toggleClass(className: string): void

// Get all classes
getClasses(): string[]
```

### Batch Operations
```typescript
// Apply to multiple elements
applyPropertiesToSelection(properties: PropertyUpdate[]): number

// Batch add classes
addClassToElements(elements: Element[], className: string): number

// Batch remove classes
removeClassFromElements(elements: Element[], className: string): number
```

## Architecture

```
02-element-properties-editor/
├── src/
│   ├── index.ts              # Entry point
│   ├── editor.ts             # Property editor UI & logic
│   ├── properties.ts         # Property management
│   ├── history.ts            # Undo/redo functionality
│   └── utils.ts              # Helper functions
├── manifest.json             # Extension manifest
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## Installation

```bash
cd examples/02-element-properties-editor
npm install
npm run build
```

## Usage Example

### Basic Property Editing

```typescript
import { PropertyEditor } from './src/editor';

// Initialize editor
const editor = new PropertyEditor();

// Edit selected element
editor.editSelectedElement({
  'aria-label': 'New label',
  'data-section': 'hero',
  'class': 'heading-large'
});

// Apply styles
editor.applyStyles({
  'color': '#ff0000',
  'font-size': '24px',
  'margin-top': '20px'
});

// Update classes
editor.updateClasses(['active', 'highlighted']);
```

### Batch Operations

```typescript
const selected = webflow.getSelectedElements();

// Apply same properties to all selected
for (const element of selected) {
  editor.editElement(element, {
    'data-component': 'card',
    'class': 'interactive'
  });
}
```

### History & Undo

```typescript
// Get history
editor.getHistory(); // Returns array of changes

// Undo last change
editor.undo();

// Redo change
editor.redo();

// Clear history
editor.clearHistory();
```

## Component Details

### Property Editor (editor.ts)

```typescript
export class PropertyEditor {
  editSelectedElement(updates: PropertyUpdate): boolean
  editElement(element: Element, updates: PropertyUpdate): boolean
  applyStyles(styles: StyleUpdate): void
  updateClasses(classes: string[]): void
  getHistory(): HistoryEntry[]
  undo(): boolean
  redo(): boolean
}
```

### Properties Manager (properties.ts)

```typescript
export class PropertiesManager {
  getElementProperties(element: Element): object
  setElementProperty(element: Element, name: string, value: any): boolean
  removeElementProperty(element: Element, name: string): boolean
  getElementClasses(element: Element): string[]
  addElementClass(element: Element, className: string): boolean
  removeElementClass(element: Element, className: string): boolean
  applyInlineStyles(element: Element, styles: Record<string, string>): void
}
```

### History Manager (history.ts)

```typescript
export class HistoryManager {
  record(change: Change): void
  undo(): boolean
  redo(): boolean
  getHistory(): Change[]
  clear(): void
}
```

## Workflow

1. **Select Element**
   - User selects element in Designer canvas
   - Editor displays current properties, attributes, and styles

2. **Edit Properties**
   - User modifies properties in the editor UI
   - Changes applied in real-time to canvas
   - History recorded automatically

3. **Preview**
   - Visual feedback in Designer canvas
   - Property validation displayed
   - Error states shown for invalid inputs

4. **Undo/Redo**
   - User can revert changes at any point
   - Full change history maintained
   - Multiple undo/redo levels supported

## Advanced Features

### Property Validation
```typescript
validateProperty(name: string, value: any): boolean {
  // Validate attributes
  if (name === 'aria-label') {
    return value.length > 0 && value.length <= 255;
  }

  // Validate data attributes
  if (name.startsWith('data-')) {
    return typeof value === 'string';
  }

  return true;
}
```

### Intelligent Defaults
```typescript
// Auto-suggest common attributes
const commonAttributes = {
  'role': ['button', 'link', 'heading', 'main'],
  'aria-label': [],
  'data-component': ['card', 'button', 'image', 'form'],
  'class': [] // Populated from active styles
};
```

### Batch Editing Preview
```typescript
// Show what will change before applying
displayBatchPreview(elements: Element[], changes: PropertyUpdate) {
  const preview = elements.map(el => ({
    element: el.getName(),
    current: el.getAttributes(),
    proposed: { ...el.getAttributes(), ...changes }
  }));

  showPreviewModal(preview);
}
```

## Testing Scenarios

### Scenario 1: Edit Single Element
1. Select one element
2. Edit attributes and styles
3. Verify changes in Designer
4. Use undo to revert

### Scenario 2: Batch Operations
1. Select multiple elements
2. Apply same class to all
3. Verify all elements updated
4. Use undo to revert all at once

### Scenario 3: Complex Attribute Management
1. Add custom data attributes
2. Edit ARIA labels
3. Apply accessibility attributes
4. Verify in browser console

### Scenario 4: Style Application
1. Apply multiple inline styles
2. Remove specific styles
3. Check cascading with CSS classes
4. Verify responsive breakpoints

## Performance Considerations

- **Batch Updates**: Group multiple changes for single render
- **Debounced Input**: Delay property application while typing
- **Selective Refresh**: Only update changed properties
- **History Limits**: Keep last 50 changes in history

## Error Handling

```typescript
try {
  editor.applyStyles(styles);
  webflow.notify.success('Styles applied');
} catch (error) {
  console.error('Failed to apply styles:', error);
  webflow.notify.error('Could not apply styles');
  editor.undo(); // Revert on error
}
```

## Real-World Use Cases

1. **Accessibility Enhancement** - Add ARIA labels and roles
2. **Data Attributes** - Add component tracking data
3. **Style Standardization** - Apply consistent classes
4. **Batch Updates** - Edit dozens of elements simultaneously
5. **Property Templates** - Save and reuse property sets

## Next Steps

- Implement keyboard shortcuts for common operations
- Add property templates and presets
- Create comparison view for bulk edits
- Add style inheritance visualization
- Implement collaborative editing

## Resources

- [Element API Reference](https://developers.webflow.com/element-api)
- [ARIA Reference](https://www.w3.org/WAI/ARIA/apg/)
- [CSS Properties Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

**Status**: Production Ready
**Last Updated**: November 23, 2025
**Version**: 1.0
