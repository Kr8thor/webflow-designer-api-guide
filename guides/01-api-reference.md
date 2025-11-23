# Designer API Complete Reference

**Status**: Complete
**Last Updated**: November 23, 2025
**Target Audience**: Extension developers
**Scope**: All Designer API methods and properties

---

## Table of Contents

1. [Core API Structure](#core-api-structure)
2. [Element Methods](#element-methods)
3. [Page Methods](#page-methods)
4. [Component Methods](#component-methods)
5. [Variable/Token Methods](#variabletoken-methods)
6. [Asset Methods](#asset-methods)
7. [Event System](#event-system)
8. [Notification System](#notification-system)
9. [Utility Methods](#utility-methods)

---

## Core API Structure

The Designer API is accessed via the `webflow` object, which is injected into the extension context.

### Accessing the API

```typescript
import { webflow } from '@webflow/designer-api';

// webflow is now available
const selected = webflow.getSelectedElements();
const page = webflow.getCurrentPage();
```

### TypeScript Support

```typescript
// Full type safety with TypeScript
interface DesignerAPI {
  getSelectedElements(): Element[];
  getCurrentPage(): Page | null;
  getComponents(): Component[];
  getVariables(): Variable[];
  // ... all other methods
}
```

---

## Element Methods

Elements are the building blocks of Webflow sites.

### Selection

#### `getSelectedElements(): Element[]`

Get currently selected elements in the Designer.

```typescript
const selected = webflow.getSelectedElements();
console.log(`${selected.length} elements selected`);

selected.forEach((el) => {
  console.log(el.getName()); // Element name
});
```

**Returns**: Array of Element objects
**Scope**: Current page only
**Throws**: None (returns empty array if nothing selected)

#### `selectElements(elements: Element[]): void`

Programmatically select elements.

```typescript
const element = webflow.getElement('element-id');
if (element) {
  webflow.selectElements([element]);
}
```

**Parameters**:
- `elements`: Array of Element objects to select

**Throws**: Error if element doesn't exist

### Element Properties

#### `createElem(tag: string, options?: CreateElemOptions): Element`

Create a new HTML element.

```typescript
const div = webflow.createElem('div', {
  attributes: {
    class: 'container',
    'data-component': 'card'
  },
  text: 'Hello World'
});
```

**Parameters**:
- `tag`: HTML tag name ('div', 'section', 'img', etc.)
- `options`:
  - `attributes`: Object of HTML attributes
  - `text`: Element text content
  - `html`: Element HTML content

**Returns**: New Element object

#### `getElement(elementId: string): Element | null`

Get element by ID.

```typescript
const element = webflow.getElement('my-element-id');
if (element) {
  element.setAttributes({ class: 'highlighted' });
}
```

**Parameters**:
- `elementId`: The element's unique ID

**Returns**: Element object or null if not found

#### `Element.getId(): string`

Get element's unique identifier.

```typescript
const id = element.getId();
console.log(`Element ID: ${id}`);
```

#### `Element.getName(): string | null`

Get element's display name (from Designer).

```typescript
const name = element.getName();
console.log(`Element name: ${name}`);
```

#### `Element.getTagName(): string`

Get element's HTML tag.

```typescript
const tag = element.getTagName();
if (tag === 'button') {
  element.setAttributes({ type: 'submit' });
}
```

**Returns**: Tag name in lowercase ('div', 'button', 'a', etc.)

#### `Element.getAttributes(): Record<string, any>`

Get all element attributes.

```typescript
const attrs = element.getAttributes();
console.log(attrs.class); // CSS classes
console.log(attrs['data-id']); // Data attributes
```

**Returns**: Object with all attributes

#### `Element.setAttributes(attrs: Record<string, any>): void`

Set element attributes.

```typescript
element.setAttributes({
  class: 'btn btn-primary',
  'aria-label': 'Submit Form',
  'data-component': 'button'
});
```

#### `Element.getChildren(): Element[]`

Get child elements.

```typescript
const children = element.getChildren();
children.forEach((child) => {
  console.log(child.getName());
});
```

**Returns**: Array of child Element objects

#### `Element.getParent(): Element | null`

Get parent element.

```typescript
const parent = element.getParent();
if (parent?.getName() === 'container') {
  console.log('Inside a container');
}
```

### Styling

#### `Element.setInlineStyle(property: string, value: string): void`

Apply inline CSS style.

```typescript
element.setInlineStyle('color', 'red');
element.setInlineStyle('font-size', '18px');
element.setInlineStyle('margin-top', '20px');
```

**Parameters**:
- `property`: CSS property name (camelCase or kebab-case)
- `value`: CSS value

#### `Element.setStyleValue(property: string, value: any): void`

Apply style with design token support.

```typescript
// Apply color token
element.setStyleValue('color', {
  designTokenId: 'color_primary'
});

// Apply direct value
element.setStyleValue('color', '#ff0000');
```

### Lifecycle

#### `Element.delete(): void`

Delete the element from the page.

```typescript
element.delete();
webflow.notify.success('Element deleted');
```

**Note**: Action is undoable in Designer

#### `Element.detach(): void`

Detach element (for components).

```typescript
element.detach(); // Converts component instance to regular element
```

---

## Page Methods

### Navigation

#### `getAllPages(): Page[]`

Get all pages in the site.

```typescript
const pages = webflow.getAllPages();
pages.forEach((page) => {
  console.log(page.getName());
});
```

**Returns**: Array of Page objects

#### `getCurrentPage(): Page | null`

Get currently active page.

```typescript
const page = webflow.getCurrentPage();
if (page) {
  console.log(`Current page: ${page.getName()}`);
}
```

#### `getPage(pageId: string): Page | null`

Get page by ID.

```typescript
const page = webflow.getPage('page-id-123');
if (page) {
  // Page found
}
```

### Page Properties

#### `Page.getName(): string`

Get page name.

```typescript
const name = webflow.getCurrentPage()?.getName();
```

#### `Page.getElements(): Element[]`

Get all elements on page.

```typescript
const page = webflow.getCurrentPage();
const elements = page?.getElements?.() || [];
```

#### `Page.getId(): string`

Get page ID.

```typescript
const pageId = page.getId();
```

---

## Component Methods

### Working with Components

#### `getComponents(): Component[]`

Get all components in site.

```typescript
const components = webflow.getComponents();
components.forEach((comp) => {
  console.log(`${comp.getName()} - ${comp.getInstances().length} instances`);
});
```

**Returns**: Array of Component objects

#### `Component.getId(): string`

Get component ID.

```typescript
const id = component.getId();
```

#### `Component.getName(): string`

Get component name.

```typescript
const name = component.getName();
```

#### `Component.getInstances(): Element[]`

Get all instances of component.

```typescript
const instances = component.getInstances();
console.log(`${instances.length} instances found`);
```

#### `Component.getVariants(): string[]`

Get available variants.

```typescript
const variants = component.getVariants?.() || [];
console.log('Available variants:', variants);
```

#### `Component.setName(name: string): void`

Rename component.

```typescript
component.setName('New Component Name');
```

#### `Element.createComponent(name: string): Component`

Create component from element.

```typescript
const selected = webflow.getSelectedElements()[0];
const component = selected?.createComponent('My Component');
```

---

## Variable/Token Methods

### Managing Design Tokens

#### `getVariables(): Variable[]`

Get all design variables/tokens.

```typescript
const variables = webflow.getVariables?.() || [];
variables.forEach((variable) => {
  console.log(`${variable.getName()} = ${variable.getValue()}`);
});
```

#### `getVariableById(id: string): Variable | null`

Get variable by ID.

```typescript
const colorVar = webflow.getVariableById('color-primary');
if (colorVar) {
  const value = colorVar.getValue();
}
```

#### `Variable.getId(): string`

Get variable ID.

```typescript
const id = variable.getId();
```

#### `Variable.getName(): string`

Get variable name.

```typescript
const name = variable.getName();
```

#### `Variable.getType(): string`

Get variable type.

```typescript
const type = variable.getType(); // 'color', 'typography', etc.
```

#### `Variable.getValue(): any`

Get variable value.

```typescript
const value = variable.getValue();
if (typeof value === 'string') {
  console.log('Hex color:', value);
}
```

#### `Variable.setValue(value: any): void`

Update variable value.

```typescript
variable.setValue('#ff0000');
```

#### `Variable.setName(name: string): void`

Rename variable.

```typescript
variable.setName('Primary Color');
```

#### `Variable.delete(): void`

Delete variable.

```typescript
variable.delete();
```

---

## Asset Methods

### Managing Site Assets

#### `getAssets(): Asset[]`

Get all site assets.

```typescript
const assets = webflow.getAssets?.() || [];
assets.forEach((asset) => {
  console.log(`${asset.getName()} - ${asset.getSize()} bytes`);
});
```

#### `getAsset(assetId: string): Asset | null`

Get asset by ID.

```typescript
const image = webflow.getAsset('image-123');
```

---

## Event System

### Listening to Designer Events

#### `webflow.on(eventType: string, callback: Function): void`

Register event listener.

```typescript
webflow.on('selectedElementsChange', (elements) => {
  console.log(`${elements.length} elements selected`);
});

webflow.on('pageChange', (page) => {
  console.log(`Switched to ${page?.getName()}`);
});
```

**Available Events**:
- `selectedElementsChange`: User selected different elements
- `pageChange`: User switched pages
- `elementCreate`: New element created
- `elementDelete`: Element deleted
- `elementUpdate`: Element modified
- `componentCreate`: New component created
- `componentDelete`: Component deleted
- `variableCreate`: New variable created
- `variableDelete`: Variable deleted
- `variableUpdate`: Variable modified

#### `webflow.off(eventType: string, callback?: Function): void`

Unregister event listener.

```typescript
const handler = (elements) => {
  console.log('Selection changed');
};

webflow.on('selectedElementsChange', handler);

// Later, remove listener
webflow.off('selectedElementsChange', handler);
```

---

## Notification System

### User Feedback

#### `webflow.notify.success(message: string): void`

Show success notification.

```typescript
webflow.notify.success('Changes saved');
```

#### `webflow.notify.error(message: string): void`

Show error notification.

```typescript
webflow.notify.error('Failed to save');
```

#### `webflow.notify.warning(message: string): void`

Show warning notification.

```typescript
webflow.notify.warning('This action is permanent');
```

#### `webflow.notify.info(message: string): void`

Show info notification.

```typescript
webflow.notify.info('5 elements updated');
```

---

## Utility Methods

### General Utilities

#### Type Guards

```typescript
// Check if object is Element
if (element instanceof webflow.Element) {
  element.setAttributes({});
}

// Check if object is Page
if (page instanceof webflow.Page) {
  const elements = page.getElements();
}
```

#### Safe Access Patterns

```typescript
// Safe chaining
const page = webflow.getCurrentPage();
const elements = page?.getElements?.() || [];

// Optional chaining for variants
const variants = component.getVariants?.() || [];
```

---

## Error Handling

### Common Patterns

```typescript
try {
  const element = webflow.getElement('unknown-id');
  if (!element) {
    throw new Error('Element not found');
  }

  element.setAttributes({ class: 'active' });
  webflow.notify.success('Updated');
} catch (error) {
  console.error('Operation failed:', error);
  webflow.notify.error('Failed to update element');
}
```

### Validation

```typescript
function updateElements(elements: any[]): number {
  let updated = 0;

  for (const el of elements) {
    // Validate it's an Element
    if (!el?.setAttributes || !el?.getAttributes) {
      console.warn('Invalid element');
      continue;
    }

    try {
      el.setAttributes({ 'data-updated': 'true' });
      updated++;
    } catch (error) {
      console.warn('Failed to update element:', error);
    }
  }

  return updated;
}
```

---

## Complete Example: Element Manipulation

```typescript
import { webflow } from '@webflow/designer-api';

// Get current page
const page = webflow.getCurrentPage();
if (!page) {
  webflow.notify.error('No page loaded');
  throw new Error('No page available');
}

// Get all elements
const elements = page.getElements();
console.log(`Page has ${elements.length} elements`);

// Find specific element
const target = elements.find((el) =>
  el.getName()?.includes('card')
);

if (target) {
  // Update attributes
  target.setAttributes({
    class: 'card active',
    'data-component': 'card',
    'aria-label': 'Featured Card'
  });

  // Apply styles
  target.setInlineStyle('background-color', '#f0f0f0');
  target.setInlineStyle('padding', '20px');

  // Get children
  const children = target.getChildren();
  console.log(`Card has ${children.length} children`);

  webflow.notify.success('Card updated');
}

// Listen for changes
webflow.on('selectedElementsChange', (selected) => {
  console.log(`Selection changed to ${selected.length} elements`);
});
```

---

## API Reference Summary

| Category | Methods |
|----------|---------|
| **Elements** | getSelectedElements, selectElements, createElem, getElement |
| **Properties** | getId, getName, getTagName, getAttributes, setAttributes |
| **Styling** | setInlineStyle, setStyleValue |
| **Hierarchy** | getChildren, getParent |
| **Pages** | getAllPages, getCurrentPage, getPage |
| **Components** | getComponents, getInstances, getVariants |
| **Variables** | getVariables, getVariableById |
| **Assets** | getAssets, getAsset |
| **Events** | on, off |
| **UI** | notify.success, notify.error, notify.warning, notify.info |

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Status**: Complete and Production Ready
