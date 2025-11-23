# Element Editor Example

Complete element manipulation example showing CRUD operations on canvas elements.

## What This Example Shows

- ✅ Getting and manipulating selected elements
- ✅ Creating new elements on canvas
- ✅ Updating element properties (name, styles, attributes)
- ✅ Deleting elements
- ✅ Element hierarchy navigation (parent, children)
- ✅ Real-time property panel

## Key Implementation

```typescript
import { ComponentManager } from '../../templates/element-manipulation.ts'

const manager = new ComponentManager(webflow)

// Create element
const element = await webflow.getRootElement()
const newDiv = await element.appendChild('div')

// Update properties
await newDiv.setName('New Element')
await newDiv.setClassName('my-class')
await newDiv.updateStyles({
  backgroundColor: '#fff',
  padding: '16px'
})

// Get children
const children = await element.getChildren()
children.forEach(child => {
  console.log(child.getName())
})
```

## Features

- Element property editor panel
- Styles inspector and editor
- Class name management
- Batch element operations
- Undo/redo support
- Real-time preview

## Templates Used

- [element-manipulation.ts](../../templates/element-manipulation.ts)
- [event-subscriptions.ts](../../templates/event-subscriptions.ts)

## Running the Example

```bash
npm install
npm run dev
```

## Next Steps

- Add copy/paste functionality
- Implement drag-and-drop reordering
- Add keyboard shortcuts
- Create custom property panels
- Build component library integration

## Learn More

- [Designer API Reference](https://developers.webflow.com/designer/reference/introduction)
- [Document 3: Designer API Research](../../docs/03-designer-api-research.md)
