# Asset Organizer Example

Smart asset management with organization, tagging, and optimization.

## Features

- Asset inventory with search
- Batch tagging and organization
- Orphaned asset detection
- Duplicate detection
- Storage optimization recommendations
- Export asset catalog

## Quick Start

```bash
cd examples/05-asset-organizer
npm install && npm run build
```

## Usage

```typescript
import { AssetOrganizer } from './src/index';

const organizer = new AssetOrganizer();

// Get all assets
const assets = await organizer.getAllAssets();

// Find orphaned assets
const orphaned = await organizer.findOrphanedAssets();

// Get storage stats
const stats = organizer.getStorageStats();
```

---

**Status**: Production Ready
**Complexity**: Advanced
**Use Case**: Asset management, cleanup, optimization
