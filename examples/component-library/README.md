# Component Library Example

Managing component creation, organization, and instance management.

## What This Example Shows

- ✅ Creating reusable components
- ✅ Component organization and searching
- ✅ Creating component instances
- ✅ Component cloning and templates
- ✅ Component usage statistics
- ✅ Design system integration

## Key Implementation

```typescript
import { ComponentManager } from '../../templates/component-management.ts'

const manager = new ComponentManager(webflow)

// Create component
const buttonComponent = await manager.createComponent({
  name: 'Button',
  description: 'Primary action button',
  tags: ['ui', 'button', 'interactive']
})

// Create instances
const instance1 = await manager.createInstance(buttonComponent.id)
const instance2 = await manager.createInstance(buttonComponent.id)

// Search components
const uiComponents = await manager.getComponentsByTag('ui')
console.log(`Found ${uiComponents.length} UI components`)

// Clone with variations
const secondaryButton = await manager.cloneComponent(
  buttonComponent.id,
  'Button Secondary'
)

// Get statistics
const stats = await manager.getStatistics()
console.log(`Total: ${stats.totalComponents} components`)
console.log(`Instances: ${stats.totalInstances}`)
```

## Features

- Component browser with search
- Create/edit/delete components
- Component tagging system
- Instance management
- Component statistics
- Design system builder
- Component versioning
- Documentation generation

## Templates Used

- [component-management.ts](../../templates/component-management.ts)
- [variables-tokens.ts](../../templates/variables-tokens.ts)

## Example: Creating a Design System

```bash
# Initialize design system
npm run dev

# In the extension UI:
1. Create "Typography" group
   - Heading 1, Heading 2, Body, Label
2. Create "Buttons" group
   - Primary, Secondary, Tertiary
3. Create "Forms" group
   - Input, Textarea, Select
4. Organize by tags for easy discovery
```

## Next Steps

- Add component versioning
- Create variant management
- Build documentation generator
- Add component preview
- Implement component marketplace

## Learn More

- [Component Management Template](../../templates/component-management.ts)
- [Design Tokens Template](../../templates/variables-tokens.ts)
- [Document 2: App Guidelines](../../docs/02-webflow-app-development-guidelines.md)
