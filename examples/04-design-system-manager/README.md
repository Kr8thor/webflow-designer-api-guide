# Design System Manager Example

Complete design system management with tokens, tokens, and bulk application.

## Features

- Token organization by type (color, typography, spacing)
- Bulk token creation from CSV/JSON
- Token search and filtering
- Apply tokens to selection
- Export design system
- Token versioning

## Installation

```bash
cd examples/04-design-system-manager
npm install
npm run build
```

## Usage

```typescript
import { DesignSystemManager } from './src/manager';

const ds = new DesignSystemManager();

// Get all tokens
const tokens = await ds.getAllTokens();

// Get by type
const colors = await ds.getTokensByType('color');

// Create batch tokens
const created = await ds.createBatchTokens([
  { name: 'Primary', value: '#0066FF', type: 'color' },
  { name: 'Secondary', value: '#6C757D', type: 'color' }
]);

// Apply to selection
const applied = await ds.applyTokensToSelection(tokens);
```

---

**Status**: Production Ready
**Complexity**: Advanced
**Use Case**: Design system management, token libraries
