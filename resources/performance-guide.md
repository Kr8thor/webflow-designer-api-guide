# Performance Optimization Guide

Strategies for optimizing Webflow app performance.

## Bundle Size

### Measure
```bash
# Check bundle size
npm run build
ls -lh dist/

# Analyze bundle
npx webpack-bundle-analyzer dist/stats.json

# Expected: < 1MB gzipped
```

### Optimize

#### Remove Unused Code
```typescript
// Use tree-shaking
import { usefulFunction } from 'lib' // Good
import * as lib from 'lib' // Exports everything

// Use modern imports
import Button from 'components/Button' // Good
import { Button } from 'components/index' // Might include everything
```

#### Lazy Loading
```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./Heavy'))

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

#### Code Splitting
```typescript
// Split by route
const routes = [
  { path: '/', component: lazy(() => import('./Home')) },
  { path: '/about', component: lazy(() => import('./About')) },
  { path: '/contact', component: lazy(() => import('./Contact')) }
]
```

#### Minification
```bash
# Enable in build
{
  "build": "vite build --minify terser"
}
```

### Popular Libraries Size
- React: 42 KB
- Redux: 6 KB
- React Router: 7 KB
- Lodash: 70 KB (use lodash-es instead: 20 KB)
- Moment.js: 70 KB (use date-fns: 13 KB)

## Runtime Performance

### Memory Usage

#### Avoid Memory Leaks
```typescript
// ✅ DO: Clean up
useEffect(() => {
  const handler = () => {}
  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])

// ❌ DON'T: Leave listeners
useEffect(() => {
  window.addEventListener('resize', () => {})
  // Never removes!
}, [])
```

#### Cache Efficiently
```typescript
// ✅ DO: Limit cache size
class Cache {
  private map = new Map()
  private maxSize = 100

  set(key, value) {
    if (this.map.size >= this.maxSize) {
      const firstKey = this.map.keys().next().value
      this.map.delete(firstKey)
    }
    this.map.set(key, value)
  }
}

// ❌ DON'T: Unlimited cache
const cache = new Map()
```

### CPU Usage

#### Debounce & Throttle
```typescript
// Debounce for search
const debouncedSearch = debounce((query) => {
  searchAPI(query)
}, 300)

// Throttle for scroll
const throttledScroll = throttle(() => {
  updateView()
}, 100)
```

#### Use requestAnimationFrame
```typescript
// ✅ DO: Sync with browser
let frame
function update() {
  // Do work
  frame = requestAnimationFrame(update)
}

// ❌ DON'T: Constantly update
setInterval(() => {
  // Might block render
}, 16)
```

#### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const Item = memo(({ id, data }) => (
  <div>{data.name}</div>
), (prev, next) => prev.id === next.id)

// Memoize value
const expensive = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// Memoize callback
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

## API Performance

### Batch Requests
```typescript
// ✅ DO: Batch operations
const results = await Promise.all([
  fetchItems(0, 50),
  fetchItems(50, 100),
  fetchItems(100, 150)
])

// ❌ DON'T: Sequential requests
const items = []
for (let i = 0; i < 300; i++) {
  items.push(await fetchItem(i))
}
```

### Pagination
```typescript
// ✅ DO: Use pagination
async function* getAll(collectionId) {
  let offset = 0
  while (true) {
    const items = await fetchItems(collectionId, offset, 50)
    if (items.length === 0) break
    yield items
    offset += items.length
  }
}

// ❌ DON'T: Fetch all at once
const items = await fetchAll(collectionId) // Might be huge!
```

### Caching
```typescript
// ✅ DO: Cache responses
const cache = new Map()
const TTL = 5 * 60 * 1000 // 5 minutes

async function getCached(key, fn) {
  const cached = cache.get(key)
  if (cached && Date.now() < cached.expires) {
    return cached.data
  }

  const data = await fn()
  cache.set(key, { data, expires: Date.now() + TTL })
  return data
}
```

### Connection Pooling
```typescript
// Use HTTP/2 keep-alive
fetch(url, {
  headers: {
    'Connection': 'keep-alive'
  }
})

// Or configure in Node.js
const agent = new http.Agent({
  maxSockets: 50,
  keepAlive: true
})
```

## DOM Performance

### Virtual Scrolling
```typescript
import { FixedSizeList } from 'react-window'

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  )
}
```

### Batch DOM Updates
```typescript
// ✅ DO: Batch updates
const fragment = document.createDocumentFragment()
for (const item of items) {
  const el = document.createElement('div')
  el.textContent = item.name
  fragment.appendChild(el)
}
document.body.appendChild(fragment)

// ❌ DON'T: Update DOM in loop
for (const item of items) {
  const el = document.createElement('div')
  document.body.appendChild(el) // Reflow each time!
}
```

### Reduce Reflows
```typescript
// ✅ DO: Read then write
const height = element.offsetHeight // Read
element.style.width = '100px' // Write
element.style.height = height + 10 + 'px' // Write

// ❌ DON'T: Interleave reads/writes
element.style.width = '100px' // Write (reflow)
const height = element.offsetHeight // Read (reflow!)
```

## Asset Optimization

### Images
```typescript
// Use modern formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="" />
</picture>

// Use responsive images
<img
  srcSet="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 800px"
  src="medium.jpg"
  alt=""
/>

// Lazy load images
<img loading="lazy" src="image.jpg" alt="" />
```

### Fonts
```css
/* Load only needed weights */
@font-face {
  font-family: 'Inter';
  src: url('inter-400.woff2') format('woff2');
  font-weight: 400;
}

@font-face {
  font-family: 'Inter';
  src: url('inter-700.woff2') format('woff2');
  font-weight: 700;
}

/* Swap displays while loading */
font-display: swap;
```

## Monitoring

### Core Web Vitals
```typescript
// Largest Contentful Paint
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.renderTime || entry.loadTime)
  }
}).observe({ entryTypes: ['largest-contentful-paint'] })

// First Input Delay
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('FID:', entry.processingDuration)
  }
}).observe({ entryTypes: ['first-input'] })

// Cumulative Layout Shift
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('CLS:', entry.value)
  }
}).observe({ entryTypes: ['layout-shift'] })
```

### Performance Monitoring
```typescript
// Simple performance tracking
function measure(name, fn) {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  console.log(`${name}: ${duration.toFixed(2)}ms`)
  return result
}

// Usage
const data = await measure('Load data', () => {
  return fetchData()
})
```

### Real User Monitoring
```typescript
// Send metrics to analytics
function sendMetrics() {
  const metrics = {
    lcp: getLCP(),
    fid: getFID(),
    cls: getCLS()
  }

  navigator.sendBeacon('/api/metrics', JSON.stringify(metrics))
}

window.addEventListener('visibilitychange', sendMetrics)
```

## Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s
- **Bundle Size**: < 1MB (gzipped)
- **API Response**: < 200ms (P95)

## Tools

- [Google Lighthouse](https://chrome.google.com/webstore)
- [WebPageTest](https://webpagetest.org)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [SpeedCurve](https://www.speedcurve.com)
