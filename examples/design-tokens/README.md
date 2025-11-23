# Design Tokens Manager Example

Create and manage design tokens (colors, sizes, typography scales) for your Webflow design system.

## What This Example Shows

- ✅ Creating and managing design tokens
- ✅ Token categorization (colors, sizes, typography)
- ✅ Token search and filtering
- ✅ Token statistics and analytics
- ✅ Export tokens as JSON
- ✅ Design system organization
- ✅ Token editing and deletion

## Key Implementation

```typescript
import { TokenManager } from '../../templates/variables-tokens.ts'

const manager = new TokenManager(webflow)

// Create color token
const primaryBlue = await manager.createColorToken({
  name: 'Primary Blue',
  value: '#0066CC'
})

// Create typography token
const heading1 = await manager.createTypographyToken({
  name: 'Heading 1',
  fontSize: '32px',
  fontWeight: 700,
  lineHeight: '1.2'
})

// Create sizing token
const spacingSmall = await manager.createSizeToken({
  name: 'Spacing Small',
  value: '8px'
})

// Get all tokens
const allTokens = await manager.getAllTokens()

// Get tokens by type
const colors = await manager.getTokensByType('color')
const typography = await manager.getTokensByType('typography')

// Search tokens
const results = await manager.searchTokens('primary')

// Export design tokens
const json = await manager.exportAsJSON()
```

## Features

- Token creation with multiple types
- Type-specific inputs (color picker for colors, etc.)
- Real-time search and filtering
- Token statistics dashboard
- JSON export for design tool integration
- Edit and delete existing tokens
- Token preview with type-specific visualization
- Responsive design for all screen sizes

## Templates Used

- [variables-tokens.ts](../../templates/variables-tokens.ts)

## Example: Building a Design System

```bash
# Start the example
npm run dev

# In the extension UI:
1. Create color tokens
   - Primary: #0066CC
   - Secondary: #FF6B35
   - Success: #00AA44
   - Warning: #FFA500
   - Error: #CC0000

2. Create spacing tokens
   - Small: 8px
   - Medium: 16px
   - Large: 24px
   - XLarge: 32px

3. Create typography tokens
   - Heading 1: 32px, weight 700
   - Heading 2: 24px, weight 600
   - Body: 16px, weight 400
   - Small: 12px, weight 400

4. Export tokens as JSON for other tools
```

## File Structure

```
design-tokens/
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite bundler config
├── webflow.json          # Extension manifest
├── README.md             # This file
└── src/
    ├── index.tsx         # React entry point
    ├── App.tsx           # Main component (650+ lines)
    │                     # - TokenManager state management
    │                     # - Create/read/update/delete operations
    │                     # - Token filtering and search
    │                     # - Export functionality
    │                     # - TypeScript interfaces for tokens
    └── styles.css        # Professional styling
                          # - Dashboard layout
                          # - Token card grid
                          # - Form styling
                          # - Sidebar navigation
                          # - Color preview
```

## Component Architecture

### App Component
Main container managing token state and operations.

**State Management:**
- `tokens[]` - Array of Token objects
- `selectedToken` - Currently selected token details
- `showForm` - Form visibility toggle
- `filter` - Active filter (all, color, size, typography)
- `message` - Success/error messages

**Key Methods:**
- `createToken()` - Add new token
- `deleteToken()` - Remove token
- `updateToken()` - Modify existing token
- `exportTokens()` - Download JSON file
- `loadDefaultTokens()` - Initialize with examples

### TokenForm Component
Form for creating new tokens with type-specific inputs.

**Features:**
- Dynamic input based on token type
- Color picker for color tokens
- Text input for sizes and typography
- Description field for documentation

### TokenCard Component
Individual token display in grid.

**Features:**
- Type-specific preview (color swatch, size demo, etc.)
- Quick delete button
- Selection state highlighting
- Hover animations

### TokenDetails Component
Side panel for viewing and editing selected token.

**Modes:**
- View mode - Display token information
- Edit mode - Inline editing of token properties

## Styling Architecture

### Design System Used
- **Colors**: Blue (#0066CC), Gray (#333), Light gray (#f5f7fa)
- **Spacing**: 8px base unit
- **Typography**: System fonts, 14px base size
- **Borders**: 1px solid #e0e6ed
- **Shadows**: 0 2px 8px rgba(0,0,0,0.1)

### Key Classes
- `.app` - Main flex container
- `.header` - Gradient blue header with title
- `.container` - Sidebar + main layout
- `.sidebar` - Left navigation with filters
- `.tokens-grid` - Auto-grid layout for token cards
- `.token-details` - Right panel with animations

## Next Steps

- Add token versioning
- Create token variants (hover, active states)
- Build token documentation generator
- Add token accessibility checks
- Implement token sync with Webflow Collections
- Create design token CSS variable export
- Add team collaboration features

## Learn More

- [Variables/Tokens Template](../../templates/variables-tokens.ts)
- [API Reference Guide](../../resources/api-reference.md)
- [Performance Guide](../../resources/performance-guide.md)
