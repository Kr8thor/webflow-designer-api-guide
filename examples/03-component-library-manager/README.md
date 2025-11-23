# Component Library Manager Example

Advanced example for managing component libraries at scale.

## What This Extension Does

- **Component Inventory** - View all components with statistics
- **Variant Management** - Create and manage component variants
- **Instance Operations** - Batch operations on component instances
- **Component Sync** - Keep components up-to-date across pages
- **Export/Import** - Backup and share components

## Key Features

- Component search and filtering
- Bulk instance updates
- Variant comparison
- Instance statistics
- Component dependencies tracking
- Export to JSON for backup

## Installation

```bash
cd examples/03-component-library-manager
npm install
npm run build
```

## Usage

```typescript
import { ComponentLibraryManager } from './src/manager';

const library = new ComponentLibraryManager();

// Get all components
const components = await library.getAllComponents();

// Bulk update instances
const updated = await library.updateAllInstances(componentId, {
  class: 'updated'
});

// Get component stats
const stats = library.getComponentStats();

// Export components
const backup = library.exportComponentLibrary();
```

## Architecture

```
03-component-library-manager/
├── src/
│   ├── index.ts
│   ├── manager.ts
│   ├── ui.ts
│   ├── operations.ts
│   └── utils.ts
├── manifest.json
├── tsconfig.json
└── package.json
```

---

**Status**: Production Ready
**Complexity**: Advanced
**Use Case**: Team libraries, component management at scale
