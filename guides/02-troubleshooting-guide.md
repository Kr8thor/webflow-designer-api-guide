# Designer API Troubleshooting Guide

**Status**: Complete
**Last Updated**: November 23, 2025
**Purpose**: Solve common issues and edge cases

---

## Table of Contents

1. [Initialization Issues](#initialization-issues)
2. [API Availability Problems](#api-availability-problems)
3. [Element Selection Issues](#element-selection-issues)
4. [Event Handling Problems](#event-handling-problems)
5. [Performance Issues](#performance-issues)
6. [Type Errors](#type-errors)
7. [Manifest Issues](#manifest-issues)
8. [Browser Compatibility](#browser-compatibility)

---

## Initialization Issues

### Problem: Extension fails to load

**Symptoms**:
- Extension doesn't appear in Designer
- Browser console shows initialization errors
- webflow object undefined

**Solutions**:

1. **Check manifest.json**
```json
{
  "name": "Your Extension",
  "version": "1.0.0",
  "permissions": ["element:read", "event:listen"]
}
```

2. **Verify TypeScript compilation**
```bash
npm run build
# Check for compile errors
npx tsc --noEmit
```

3. **Check console for errors**
```typescript
import { webflow } from '@webflow/designer-api';

console.log('webflow object:', webflow);
console.assert(webflow, 'Designer API not available');
```

4. **Use error boundary**
```typescript
try {
  const selected = webflow.getSelectedElements();
  console.log('API works:', selected.length);
} catch (error) {
  console.error('API access failed:', error);
  webflow.notify.error('Extension failed to load');
}
```

---

## API Availability Problems

### Problem: "webflow is undefined"

**Cause**: Extension running in wrong context or API not injected

**Solution**:
```typescript
// Check context
if (typeof webflow === 'undefined') {
  console.error('Extension must run in Webflow Designer');
  throw new Error('API not available');
}

// Safe check with optional chaining
const selected = webflow?.getSelectedElements?.();
```

### Problem: Method doesn't exist

**Cause**: API version mismatch or method name incorrect

**Solution**:
```typescript
// Check method existence
if (typeof element.setInlineStyle === 'function') {
  element.setInlineStyle('color', 'red');
} else {
  console.warn('setInlineStyle not available');
  // Fallback: use setAttributes
  element.setAttributes({ style: 'color: red;' });
}
```

### Problem: "Permission denied" error

**Cause**: Missing permissions in manifest

**Solution - Update manifest.json**:
```json
{
  "permissions": [
    "element:read",
    "element:write",
    "component:read",
    "component:write",
    "page:read",
    "page:write",
    "variable:read",
    "variable:write",
    "asset:read",
    "asset:write",
    "event:listen"
  ]
}
```

---

## Element Selection Issues

### Problem: getSelectedElements() returns empty

**Symptoms**:
- User has elements selected but API returns []
- Selection worked once but stopped

**Causes & Solutions**:

1. **User hasn't selected anything**
```typescript
const selected = webflow.getSelectedElements();
if (selected.length === 0) {
  webflow.notify.error('Please select an element first');
  return;
}
```

2. **Different page selected**
```typescript
// Selection is page-specific
const page = webflow.getCurrentPage();
const selected = webflow.getSelectedElements(); // Returns elements from current page only
```

3. **Extension lost focus**
```typescript
// Reattach listener
webflow.on('selectedElementsChange', (elements) => {
  console.log('Selection updated:', elements.length);
});
```

### Problem: Selected element becomes null

**Cause**: Element was deleted or page changed

**Solution**:
```typescript
let selectedElement: webflow.Element | null = null;

webflow.on('selectedElementsChange', (elements) => {
  selectedElement = elements[0] || null;

  if (!selectedElement) {
    console.log('Selection cleared');
  }
});

// Always check before using
if (selectedElement) {
  selectedElement.setAttributes({ class: 'active' });
}
```

### Problem: Can't select multiple elements

**Cause**: Designer may only allow certain selections

**Solution**:
```typescript
try {
  const elements = webflow.getSelectedElements();
  webflow.selectElements([elements[0], elements[1]]); // Explicit selection
} catch (error) {
  console.warn('Multiple selection not allowed:', error);
}
```

---

## Event Handling Problems

### Problem: Events not firing

**Symptoms**:
- Event listener registered but never called
- Changes don't trigger events

**Solutions**:

1. **Check listener registration**
```typescript
// Verify listener is attached
const handler = (elements) => {
  console.log('Selection changed:', elements.length);
};

webflow.on('selectedElementsChange', handler);

// Test by selecting element in Designer
// Check browser console for log message
```

2. **Ensure extension window is focused**
```typescript
// Events may pause if Designer loses focus
window.addEventListener('focus', () => {
  console.log('Extension window focused');
});
```

3. **Check event name spelling**
```typescript
// Correct event names
webflow.on('selectedElementsChange', handler);  // ✅
webflow.on('selectionChange', handler);          // ❌

webflow.on('pageChange', handler);               // ✅
webflow.on('onPageChange', handler);             // ❌
```

### Problem: Memory leak from event listeners

**Cause**: Listeners not cleaned up

**Solution**:
```typescript
// Store reference to handler
const handleSelection = (elements) => {
  console.log('Selection:', elements.length);
};

webflow.on('selectedElementsChange', handleSelection);

// Later, cleanup
webflow.off('selectedElementsChange', handleSelection);

// Or in unload handler
window.addEventListener('beforeunload', () => {
  webflow.off('selectedElementsChange', handleSelection);
});
```

### Problem: Event fires too frequently

**Cause**: Listener called for every small change

**Solution - Use debouncing**:
```typescript
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Debounce expensive operations
const handleSelectionOptimized = debounce((elements) => {
  console.log('Selection finalized:', elements.length);
  // Expensive operation here
}, 300); // Wait 300ms after selection stops changing

webflow.on('selectedElementsChange', handleSelectionOptimized);
```

---

## Performance Issues

### Problem: Extension is slow

**Symptoms**:
- UI feels sluggish
- Designer is unresponsive
- Changes lag behind user input

**Solutions**:

1. **Batch DOM updates**
```typescript
// Bad: Multiple DOM updates
const selected = webflow.getSelectedElements();
selected.forEach(el => {
  el.setAttributes({ class: 'active' });   // Update 1
  el.setInlineStyle('color', 'red');       // Update 2
  el.setInlineStyle('padding', '10px');    // Update 3
});

// Good: Batch updates
const selected = webflow.getSelectedElements();
selected.forEach(el => {
  const attrs = el.getAttributes() || {};
  el.setAttributes({
    ...attrs,
    class: 'active',
    style: 'color: red; padding: 10px;'
  });
});
```

2. **Limit element traversal**
```typescript
// Bad: Traverses all elements
function findElement(name) {
  const page = webflow.getCurrentPage();
  const elements = page?.getElements?.() || [];

  function search(els) {
    for (const el of els) {
      if (el.getName() === name) return el;
      const result = search(el.getChildren?.() || []);
      if (result) return result;
    }
  }

  return search(elements);
}

// Good: Use built-in search or limit depth
function findElement(name, maxDepth = 3) {
  const page = webflow.getCurrentPage();
  const elements = page?.getElements?.() || [];

  function search(els, depth = 0) {
    if (depth > maxDepth) return null;

    for (const el of els) {
      if (el.getName() === name) return el;
      const result = search(el.getChildren?.() || [], depth + 1);
      if (result) return result;
    }
  }

  return search(elements);
}
```

3. **Cache computed values**
```typescript
// Bad: Recompute on every access
class ElementHelper {
  getChildren() {
    return element.getChildren(); // Called every time
  }
}

// Good: Cache result
class ElementHelper {
  private cachedChildren: webflow.Element[] | null = null;

  getChildren(refresh = false) {
    if (!this.cachedChildren || refresh) {
      this.cachedChildren = element.getChildren();
    }
    return this.cachedChildren;
  }
}
```

4. **Debounce input handling**
```typescript
// Bad: Process every keystroke
input.addEventListener('input', (e) => {
  applyStylesToSelection(e.target.value);
});

// Good: Wait until user stops typing
const debouncedApply = debounce((value) => {
  applyStylesToSelection(value);
}, 500);

input.addEventListener('input', (e) => {
  debouncedApply(e.target.value);
});
```

---

## Type Errors

### Problem: TypeScript compilation fails

**Common errors**:

```typescript
// Error: Cannot find module '@webflow/designer-api'
// Solution: npm install @webflow/designer-api

// Error: Property 'setInlineStyle' does not exist
// Solution: Check correct method name - it's setInlineStyle not setStyle
element.setInlineStyle('color', 'red'); // ✅
element.setStyle('color', 'red');       // ❌

// Error: Type 'Element' is not assignable to type 'Element'
// Solution: Check import - may have naming conflict
import { webflow } from '@webflow/designer-api';
const el: webflow.Element = selectedElements[0]; // ✅
```

### Problem: "any" type errors

**Solution - Use proper types**:
```typescript
// Bad
const attr = element.getAttributes();
console.log(attr.class); // TypeScript: Property 'class' does not exist on type 'any'

// Good
const attr = element.getAttributes() || {};
const className = attr['class'] ?? '';
console.log(className);

// Best
interface ElementAttributes {
  class?: string;
  [key: string]: any;
}

const attr = element.getAttributes() as ElementAttributes;
console.log(attr.class);
```

---

## Manifest Issues

### Problem: "Invalid manifest"

**Check manifest structure**:
```json
{
  "name": "Extension Name",
  "version": "1.0.0",
  "description": "What this does",
  "author": "Your Name",
  "permissions": ["element:read"],
  "ui": {
    "position": "right",
    "width": 400
  }
}
```

**Required fields**:
- name ✅
- version ✅
- permissions ✅

**Validate with**:
```bash
jsonlint manifest.json
```

---

## Browser Compatibility

### Problem: "API method not supported"

**Check browser support**:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Mostly supported

**Fallback patterns**:
```typescript
// Check feature availability
if (element.setInlineStyle) {
  element.setInlineStyle('color', 'red');
} else {
  // Fallback
  const attrs = element.getAttributes() || {};
  attrs.style = 'color: red;';
  element.setAttributes(attrs);
}
```

---

## Debugging Tips

### Enable verbose logging
```typescript
const DEBUG = true;

function log(message, data = null) {
  if (DEBUG) {
    console.log(`[Extension] ${message}`, data || '');
  }
}

log('Selection changed', webflow.getSelectedElements().length);
```

### Export state for debugging
```typescript
function exportState() {
  return {
    currentPage: webflow.getCurrentPage()?.getName(),
    selectedElements: webflow.getSelectedElements().map(el => ({
      id: el.getId(),
      name: el.getName(),
      tag: el.getTagName()
    })),
    components: webflow.getComponents()?.length || 0,
    timestamp: new Date().toISOString()
  };
}

// Use in console
console.log(exportState());
```

### Use Chrome DevTools
```typescript
// Set breakpoints
debugger;

// Watch values
console.watch('webflow.getSelectedElements()', (result) => {
  console.log('Selection changed:', result);
});
```

---

## When to Ask for Help

Post issues to:
- [Webflow Forum](https://discourse.webflow.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/webflow)
- [GitHub Discussions](https://github.com/webflow/)

**Include in report**:
- Extension code (snippet)
- Error message (full stack trace)
- Browser/OS version
- Webflow site URL (if possible)
- Steps to reproduce

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Status**: Complete
