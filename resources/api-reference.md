# API Reference Guide

Quick reference for commonly used Webflow APIs.

## Designer API Reference

### Element Methods

#### Reading Elements
```typescript
// Get root element
const root = await webflow.getRootElement()

// Get selected element
const selected = await webflow.getSelectedElement()

// Get element by ID
const element = await webflow.getElementById(id)

// Get children
const children = await element.getChildren()

// Get parent
const parent = await element.getParent()
```

#### Element Properties
```typescript
// Get/set name
const name = element.getName()
await element.setName('New Name')

// Get/set text content
const text = element.getTextContent()
await element.setTextContent('Hello')

// Get/set class name
const className = element.getClassName()
await element.setClassName('my-class')

// Get/set ID
const id = element.getId()
await element.setId('my-id')
```

#### Styling
```typescript
// Get style property
const color = await element.getStyleProperty('color')

// Set style property
await element.setStyleProperty('color', '#FF0000')

// Update multiple styles
await element.updateStyles({
  backgroundColor: '#fff',
  padding: '16px',
  borderRadius: '8px'
})

// Get all styles
const styles = await element.getStyles()
```

#### DOM Operations
```typescript
// Append child
const child = await element.appendChild('div')

// Insert before
const sibling = await parent.insertBefore('div', element)

// Clone element
const clone = await element.clone()

// Delete element
await element.delete()

// Move element
await element.moveTo(newParent, index)
```

### Component Methods

```typescript
// Create component
const component = await webflow.createComponent({
  name: 'Button',
  description: 'Reusable button'
})

// Get component
const comp = await webflow.getComponent(componentId)

// Create instance
const instance = await component.createInstance()

// Get instances
const instances = await component.getInstances()

// Delete component
await component.delete()
```

### Variables (Design Tokens) API

```typescript
// Create color variable
const colorVar = await webflow.createColorVariable({
  name: 'Primary Color',
  value: '#0066CC'
})

// Create number variable
const sizeVar = await webflow.createNumberVariable({
  name: 'Base Size',
  value: 16,
  unit: 'px'
})

// Get variable
const variable = await webflow.getVariable(variableId)

// Update variable
await variable.setValue('#0055BB')

// List variables
const variables = await webflow.listVariables()

// Delete variable
await variable.delete()
```

### Pages API

```typescript
// Get current page
const page = await webflow.getCurrentPage()

// Get page by ID
const page = await webflow.getPage(pageId)

// List pages
const pages = await webflow.listPages()

// Create page
const newPage = await webflow.createPage({
  name: 'New Page',
  slug: 'new-page'
})

// Update page
await page.setPageSettings({
  title: 'Page Title',
  description: 'Page description'
})

// Delete page
await page.delete()
```

### Events API

```typescript
// Subscribe to element selection
webflow.on('elementSelected', (element) => {
  console.log('Selected:', element)
})

// Subscribe to page change
webflow.on('pageChanged', (page) => {
  console.log('Page changed:', page)
})

// Subscribe to breakpoint change
webflow.on('breakpointChanged', (breakpoint) => {
  console.log('Breakpoint:', breakpoint)
})

// Unsubscribe
webflow.off('elementSelected', handler)
```

## Data API Reference

### Authentication

```typescript
// Bearer token
Authorization: Bearer YOUR_API_TOKEN

// OAuth
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Common Endpoints

#### Sites
```
GET /api/v2/sites
GET /api/v2/sites/{siteId}
POST /api/v2/sites/{siteId}/publish
```

#### Collections
```
GET /api/v2/sites/{siteId}/collections
GET /api/v2/collections/{collectionId}
POST /api/v2/collections/{collectionId}/items
GET /api/v2/collections/{collectionId}/items
```

#### Items
```
GET /api/v2/collections/{collectionId}/items/{itemId}
PATCH /api/v2/collections/{collectionId}/items/{itemId}
DELETE /api/v2/collections/{collectionId}/items/{itemId}
```

#### Users
```
GET /api/v2/user
GET /api/v2/user/metadata
```

#### Domains
```
GET /api/v2/sites/{siteId}/domains
POST /api/v2/sites/{siteId}/domains
DELETE /api/v2/sites/{siteId}/domains/{domainId}
```

### Request/Response Format

#### Request
```json
{
  "fields": {
    "name": "Item Name",
    "slug": "item-slug",
    "status": "published"
  }
}
```

#### Response
```json
{
  "item": {
    "id": "item-id",
    "cmsLocaleId": "locale-id",
    "lastPublished": "2024-01-01T00:00:00Z",
    "createdOn": "2024-01-01T00:00:00Z",
    "updatedOn": "2024-01-01T00:00:00Z",
    "archived": false,
    "draft": false,
    "fields": {
      "name": "Item Name",
      "slug": "item-slug",
      "status": "published"
    }
  }
}
```

## Rate Limits

- **Designer API**: No documented rate limit (real-time)
- **Data API**: 100 requests per 10 seconds per token
- **Burst limit**: 200 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Error Handling

### Common Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Server Error`: Server error

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "name",
      "issue": "Required field missing"
    }
  }
}
```

## Pagination

```typescript
// List with pagination
const items = await webflow.listItems({
  limit: 50,
  offset: 0
})

// Next page
const nextItems = await webflow.listItems({
  limit: 50,
  offset: 50
})
```

## Filtering

```typescript
// Filter by field
const items = await webflow.listItems({
  filter: {
    status: 'published'
  }
})

// Filter by date range
const items = await webflow.listItems({
  filter: {
    createdOn: {
      $gte: '2024-01-01',
      $lte: '2024-12-31'
    }
  }
})
```

## Sorting

```typescript
// Sort by field
const items = await webflow.listItems({
  sort: 'name'
})

// Sort descending
const items = await webflow.listItems({
  sort: '-createdOn'
})

// Multiple sort fields
const items = await webflow.listItems({
  sort: 'status,-createdOn'
})
```

## See Also

- [Official Designer API Docs](https://developers.webflow.com/designer/reference/introduction)
- [Official Data API Docs](https://developers.webflow.com/data/reference/authentication)
- [API Changelog](https://developers.webflow.com/data/changelog)
