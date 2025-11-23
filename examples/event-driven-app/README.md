# Event-Driven App Example

Build real-time event monitoring and handling with the Webflow Designer API.

## What This Example Shows

- ✅ Event subscription and handling
- ✅ Real-time event monitoring
- ✅ Event filtering and categorization
- ✅ Event statistics and metrics
- ✅ Debugging event stream
- ✅ Event debouncing patterns

## Key Implementation

```typescript
import { EventSubscriber } from '../../templates/event-subscriptions.ts'

const subscriber = new EventSubscriber(webflow)

// Subscribe to element selection
subscriber.on('elementSelected', (element) => {
  console.log('Selected:', element.name)
})

// Subscribe to element updates
subscriber.on('elementUpdated', (element) => {
  console.log('Updated:', element)
})

// Subscribe to page changes
subscriber.on('pageChanged', (page) => {
  console.log('Page:', page.name)
})

// Subscribe to breakpoint changes
subscriber.on('breakpointChanged', (breakpoint) => {
  console.log('Breakpoint:', breakpoint)
})

// Unsubscribe when done
subscriber.off('elementSelected', handler)
```

## Features

- Real-time event stream visualization
- Event type filtering
- Statistical tracking
- Pause/resume monitoring
- Auto-scrolling event log
- Code documentation
- TypeScript event types

## Learn More

- [Event Subscriptions Template](../../templates/event-subscriptions.ts)
- [API Reference Guide](../../resources/api-reference.md)
