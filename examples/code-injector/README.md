# Code Injector Example

Inject custom HTML, CSS, and JavaScript code into your Webflow site at specific locations.

## What This Example Shows

- ✅ Code injection at multiple locations (head, body-start, body-end)
- ✅ Support for HTML, CSS, and JavaScript
- ✅ Toggle injections on/off
- ✅ Edit and manage injections
- ✅ Export injections as HTML
- ✅ Code preview with syntax highlighting
- ✅ Injection management interface

## Key Implementation

```typescript
import { CodeInjector } from '../../templates/custom-code-injection.ts'

const injector = new CodeInjector(webflow)

// Add Google Analytics
await injector.injectScript({
  location: 'head',
  code: '<!-- GA --><script>...</script>'
})

// Add custom CSS
await injector.injectCSS({
  location: 'head',
  code: 'body { font-family: sans-serif; }'
})

// Add custom HTML
await injector.injectHTML({
  location: 'body-end',
  code: '<div id="custom">Content</div>'
})

// Get all injections
const all = await injector.getAllInjections()
```

## Features

- Inject at head, body-start, or body-end
- Support for HTML, CSS, and JavaScript
- Enable/disable injections without removal
- Code editor with syntax highlighting
- Built-in templates for Google Analytics, Facebook Pixel
- Export all active injections
- Real-time preview

## Templates Used

- [custom-code-injection.ts](../../templates/custom-code-injection.ts)

## Learn More

- [API Reference Guide](../../resources/api-reference.md)
- [Security Checklist](../../resources/security-checklist.md)
