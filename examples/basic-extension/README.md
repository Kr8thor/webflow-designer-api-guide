# Basic Designer Extension

A minimal starter example for creating a Webflow Designer Extension.

## What This Example Shows

- ✅ Setting up a Designer Extension
- ✅ Accessing the Designer API
- ✅ Creating a UI panel
- ✅ Responding to element selection
- ✅ Updating element properties

## Getting Started

```bash
npm install
npm run dev
```

This will start a development server. You can then:

1. Go to Webflow Designer
2. Open DevTools Console
3. Paste the localhost URL provided by Vite
4. Your extension will load in a sidebar panel

## File Structure

```
├── package.json          # Project configuration
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
├── webflow.json          # Extension manifest
└── src/
    ├── index.tsx         # Extension entry point
    ├── App.tsx           # Main component
    └── styles.css        # Styling
```

## Key Features

### Extension Manifest (webflow.json)
Defines extension metadata and permissions:
```json
{
  "designExtension": {
    "entrypoint": "src/index.tsx",
    "allowedScopes": ["designer:read", "designer:write"]
  }
}
```

### Accessing Designer API
```typescript
import { getWebflowAPI } from '@webflow/designer'

const webflow = await getWebflowAPI()
const selected = await webflow.getSelectedElement()
```

### Listening to Events
```typescript
webflow.on('elementSelected', (element) => {
  console.log('Selected:', element.getName())
})
```

## Building for Production

```bash
npm run build
```

This creates an optimized bundle in `dist/` ready for marketplace submission.

## Next Steps

- Add more features from the templates
- Integrate with external services
- Customize the UI styling
- Add error handling
- Submit to Webflow Marketplace

## Resources

- [Designer API Reference](https://developers.webflow.com/designer/reference/introduction)
- [Component Management Template](../../templates/component-management.ts)
- [Event Subscriptions Template](../../templates/event-subscriptions.ts)
