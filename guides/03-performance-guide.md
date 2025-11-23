# Designer API Performance Guide

**Status**: Complete
**Last Updated**: November 23, 2025
**Purpose**: Optimize extension performance

---

## Table of Contents

1. [Performance Metrics](#performance-metrics)
2. [DOM Operations](#dom-operations)
3. [Event Handling](#event-handling)
4. [Memory Management](#memory-management)
5. [Network Optimization](#network-optimization)
6. [Benchmarking](#benchmarking)
7. [Best Practices](#best-practices)

---

## Performance Metrics

### Target Metrics

For a responsive extension:
- **Initial Load**: < 500ms
- **UI Response**: < 100ms
- **Element Update**: < 50ms
- **Memory Usage**: < 50MB
- **FPS Stability**: 60fps during interactions

### Measuring Performance

```typescript
// Basic timing
const start = performance.now();
// ... operation ...
const duration = performance.now() - start;
console.log(`Operation took ${duration.toFixed(2)}ms`);

// Using PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

---

## DOM Operations

### Batch Updates

**Problem**: Multiple sequential updates

```typescript
// ❌ Bad: 10 separate updates
const selected = webflow.getSelectedElements();
for (const el of selected) {
  el.setInlineStyle('color', 'red');      // Call 1
  el.setInlineStyle('padding', '10px');   // Call 2
  el.setInlineStyle('border', '1px solid #000'); // Call 3
}
```

**Solution**: Batch updates

```typescript
// ✅ Good: Single update per element
const selected = webflow.getSelectedElements();
for (const el of selected) {
  const attrs = el.getAttributes() || {};
  el.setAttributes({
    ...attrs,
    style: 'color: red; padding: 10px; border: 1px solid #000;'
  });
}
```

### Minimize Getters

**Problem**: Repeated property access

```typescript
// ❌ Bad: Calls getAttributes 3 times
const className = element.getAttributes()?.class;
const dataId = element.getAttributes()?.['data-id'];
const style = element.getAttributes()?.style;

if (element.getAttributes()?.disabled) {
  // ...
}
```

**Solution**: Cache the result

```typescript
// ✅ Good: Single call, multiple accesses
const attrs = element.getAttributes() || {};
const className = attrs.class;
const dataId = attrs['data-id'];
const style = attrs.style;

if (attrs.disabled) {
  // ...
}
```

### Element Traversal Optimization

**Problem**: Deep DOM traversal

```typescript
// ❌ Bad: Traverses entire tree
function findByName(page, name, depth = 0) {
  const elements = page.getElements?.() || [];

  for (const el of elements) {
    if (el.getName() === name) return el;

    // Recursive call on all children
    const result = findByName(el, name, depth + 1);
    if (result) return result;
  }
}

// Could search 1000s of elements
const found = findByName(webflow.getCurrentPage(), 'myElement');
```

**Solution**: Limit search scope

```typescript
// ✅ Good: Limit to reasonable depth
function findByName(element, name, maxDepth = 3, currentDepth = 0) {
  if (currentDepth > maxDepth) return null;

  if (element.getName() === name) return element;

  const children = element.getChildren?.() || [];
  for (const child of children) {
    const result = findByName(child, name, maxDepth, currentDepth + 1);
    if (result) return result;
  }

  return null;
}

// Or use indexed lookup if possible
const byId = webflow.getElement('element-id'); // O(1) vs O(n)
```

---

## Event Handling

### Debouncing

**Problem**: Event handler fires too frequently

```typescript
// ❌ Bad: Called on every keystroke (100+ times/sec)
input.addEventListener('input', (e) => {
  const selected = webflow.getSelectedElements();
  selected.forEach(el => el.setAttributes({ 'data-search': e.target.value }));
});
```

**Solution**: Debounce handler

```typescript
// ✅ Good: Called once after user stops typing
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const debouncedUpdate = debounce((value) => {
  const selected = webflow.getSelectedElements();
  selected.forEach(el => el.setAttributes({ 'data-search': value }));
}, 300);

input.addEventListener('input', (e) => {
  debouncedUpdate(e.target.value);
});
```

### Throttling

**Problem**: High-frequency events (scroll, resize)

```typescript
// ✅ Good: Limit to X calls per second
function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

const throttledScroll = throttle(() => {
  updateUI();
}, 100); // Max once per 100ms

window.addEventListener('scroll', throttledScroll);
```

### Event Listener Cleanup

**Problem**: Memory leaks from orphaned listeners

```typescript
// ❌ Bad: Listener never removed
webflow.on('selectedElementsChange', (elements) => {
  console.log(elements.length);
});

// ✅ Good: Cleanup on unload
const handler = (elements) => {
  console.log(elements.length);
};

webflow.on('selectedElementsChange', handler);

// Cleanup
window.addEventListener('beforeunload', () => {
  webflow.off('selectedElementsChange', handler);
});

// Or with AbortController (if supported)
const controller = new AbortController();
// webflow.on(..., handler, { signal: controller.signal });
// Later: controller.abort();
```

---

## Memory Management

### Object Pooling

**Problem**: Creating many temporary objects

```typescript
// ❌ Bad: Creates new array for each call
function updateElements(elements) {
  elements.forEach(el => {
    const attrs = el.getAttributes() || {}; // New object each time
    // ...
  });
}
```

**Solution**: Reuse objects

```typescript
// ✅ Good: Reuse temporary object
const tempAttrs = {};

function updateElements(elements) {
  elements.forEach(el => {
    const attrs = el.getAttributes();
    if (!attrs) return;

    // Clear and reuse
    Object.keys(tempAttrs).forEach(k => delete tempAttrs[k]);
    Object.assign(tempAttrs, attrs);
    // ... use tempAttrs ...
  });
}
```

### Lazy Loading

**Problem**: Loading everything upfront

```typescript
// ❌ Bad: Loads all components immediately
const components = webflow.getComponents(); // Could be 1000s
const stats = components.map(c => ({
  name: c.getName(),
  instances: c.getInstances().length, // Expensive
  variants: c.getVariants?.() || []     // Expensive
}));
```

**Solution**: Load on demand

```typescript
// ✅ Good: Load only when needed
class ComponentInfo {
  constructor(component) {
    this.component = component;
    this._instances = null;
  }

  get name() {
    return this.component.getName();
  }

  get instances() {
    if (!this._instances) {
      this._instances = this.component.getInstances();
    }
    return this._instances;
  }
}

const components = webflow.getComponents().map(c => new ComponentInfo(c));
// Expensive properties loaded only when accessed
```

### Circular Reference Management

```typescript
// ❌ Bad: Can cause circular references
class Manager {
  constructor() {
    this.elements = webflow.getSelectedElements();
    // If elements keep reference to Manager, memory leak
  }
}

// ✅ Good: Use WeakMap
const elementCache = new WeakMap();

function cacheElement(element, data) {
  elementCache.set(element, data);
  // Automatically cleaned up when element is deleted
}
```

---

## Network Optimization

### API Call Batching

**Problem**: Multiple API calls

```typescript
// ❌ Bad: 3 separate API calls
const auth = await authenticateUser();
const sites = await fetchUserSites();
const data = await loadProjectData();
```

**Solution**: Batch requests

```typescript
// ✅ Good: Single API call
const [auth, sites, data] = await Promise.all([
  authenticateUser(),
  fetchUserSites(),
  loadProjectData()
]);
```

### Caching

**Problem**: Repeated API calls for same data

```typescript
// ❌ Bad: Fetches every time
async function getComponentInfo(id) {
  return await api.getComponent(id);
}

// ✅ Good: Cache results
const componentCache = new Map();

async function getComponentInfo(id) {
  if (componentCache.has(id)) {
    return componentCache.get(id);
  }

  const info = await api.getComponent(id);
  componentCache.set(id, info);
  return info;
}

// Clear cache when appropriate
webflow.on('componentDelete', (id) => {
  componentCache.delete(id);
});
```

### Progressive Loading

```typescript
// ✅ Good: Load data progressively
async function loadElements() {
  const page = webflow.getCurrentPage();
  const elements = page?.getElements?.() || [];

  for (let i = 0; i < elements.length; i += 50) {
    const batch = elements.slice(i, i + 50);
    // Process batch
    await processBatch(batch);

    // Yield control to browser
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

---

## Benchmarking

### Performance Audit

```typescript
class PerformanceAudit {
  private marks = new Map();

  start(label) {
    this.marks.set(label, performance.now());
  }

  end(label) {
    const start = this.marks.get(label);
    if (!start) return;

    const duration = performance.now() - start;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  report() {
    const entries = Array.from(this.marks.entries());
    console.table(
      entries.map(([label, time]) => ({
        label,
        relativeTime: `${time.toFixed(2)}ms`
      }))
    );
  }
}

// Usage
const audit = new PerformanceAudit();
audit.start('elementSelection');
const selected = webflow.getSelectedElements();
audit.end('elementSelection');

audit.start('elementUpdate');
selected.forEach(el => el.setAttributes({ class: 'active' }));
audit.end('elementUpdate');

audit.report();
```

---

## Best Practices

### 1. Profile Before Optimizing

```typescript
// Use Chrome DevTools > Performance tab
// Record execution and analyze
// Focus on actual bottlenecks, not guesses
```

### 2. Lazy Load UI Components

```typescript
// Only create UI when needed
let panelContent = null;

function getPanel() {
  if (!panelContent) {
    panelContent = createComplexUI(); // Expensive
  }
  return panelContent;
}
```

### 3. Use RequestIdleCallback

```typescript
// Do non-urgent work when browser is idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Non-critical initialization
    precacheAssets();
    warmupCache();
  });
}
```

### 4. Monitor Memory Usage

```typescript
// In Chrome DevTools
if (performance.memory) {
  console.log(`Memory: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
}
```

### 5. Avoid Inline Styles

```typescript
// ❌ Bad: Inline styles
element.setAttributes({ style: 'color: red; padding: 10px; ...' });

// ✅ Good: Use CSS classes
element.setAttributes({ class: 'active' });
```

---

## Performance Checklist

- [ ] Load time < 500ms
- [ ] UI responses < 100ms
- [ ] Memory < 50MB
- [ ] No console errors
- [ ] Event listeners properly cleaned up
- [ ] DOM operations batched
- [ ] Expensive computations debounced
- [ ] API calls cached
- [ ] No circular references
- [ ] Images optimized
- [ ] Code minified for production
- [ ] Large dependencies lazy loaded

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Status**: Complete
