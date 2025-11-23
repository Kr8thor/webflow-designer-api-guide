# Asset Uploader Example

Upload, organize, and manage your project assets with folder support and advanced search.

## What This Example Shows

- ✅ File upload with drag-and-drop
- ✅ Asset organization with folders
- ✅ Multiple asset types (images, videos, documents)
- ✅ Asset search and filtering
- ✅ Sort by name, size, or date
- ✅ Storage statistics
- ✅ Asset tagging
- ✅ Responsive design

## Key Implementation

```typescript
import { AssetManager } from '../../templates/asset-management.ts'

const manager = new AssetManager(webflow)

// Upload asset
const asset = await manager.uploadAsset({
  file: new File(['content'], 'image.jpg'),
  folder: 'images'
})

// Create folder
const folder = await manager.createFolder({
  name: 'Product Images',
  parent: 'root'
})

// Move asset to folder
await manager.moveAsset(asset.id, folder.id)

// Search assets
const results = await manager.search('product')

// Get assets by folder
const images = await manager.getAssetsByFolder('images')

// Get storage stats
const stats = await manager.getStatistics()
console.log(`Total size: ${stats.totalSize}`)
```

## Features

- Drag-and-drop file upload
- Multiple file selection
- Folder organization
- Search with instant filtering
- Sort by name, size, or upload date
- Type-specific icons (image, video, document)
- Storage statistics
- Quick preview
- Fast deletion

## Templates Used

- [asset-management.ts](../../templates/asset-management.ts)

## Example: Organizing a Project

```bash
# Start the example
npm run dev

# In the extension UI:
1. Create folder structure
   - Images
   - Videos
   - Documents

2. Upload assets
   - Drag and drop multiple files
   - See real-time size updates

3. Organize assets
   - Move assets between folders
   - Tag for categorization
   - Search for quick access

4. Monitor storage
   - View total storage used
   - See per-folder breakdown
   - Export asset manifest
```

## File Structure

```
asset-uploader/
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite bundler config
├── webflow.json          # Extension manifest
├── README.md             # This file
└── src/
    ├── index.tsx         # React entry point
    ├── App.tsx           # Main component (500+ lines)
    │                     # - Asset management state
    │                     # - Folder creation/deletion
    │                     # - File upload handler
    │                     # - Search and filter logic
    │                     # - Sort functionality
    └── styles.css        # Professional styling
                          # - Grid layouts
                          # - Drag-drop styles
                          # - Responsive design
```

## Component Architecture

### App Component
Main state management for assets and folders.

**State:**
- `assets[]` - All uploaded assets
- `folders[]` - Folder structure
- `currentFolderId` - Active folder
- `searchQuery` - Search input
- `filterType` - Type filter
- `sortBy` - Sort method

**Key Methods:**
- `handleFileUpload()` - Process uploaded files
- `createFolder()` - Create new folder
- `deleteAsset()` - Remove asset
- `deleteFolder()` - Remove folder
- `getCurrentFolderAssets()` - Filter and sort

### AssetCard Component
Individual asset display with preview.

**Features:**
- Thumbnail preview for images
- Type icons for other assets
- File size display
- Tag display
- Delete button

## Styling Architecture

### Design System
- **Colors**: Purple gradient (#667eea to #764ba2)
- **Spacing**: 8px base unit
- **Typography**: System fonts, 14px base
- **Borders**: 1px solid #e0e6ed
- **Shadows**: 0 4px 12px with opacity

### Layout Components
- `.upload-area` - Drag-drop zone
- `.assets-grid` - Responsive grid
- `.asset-card` - Individual asset
- `.folders-grid` - Folder grid
- `.toolbar` - Search and filter controls

## Next Steps

- Add batch operations
- Create folder hierarchy visualization
- Build asset preview modal
- Add image optimization
- Implement asset versioning
- Create export functionality
- Add collaboration features

## Learn More

- [Asset Management Template](../../templates/asset-management.ts)
- [API Reference Guide](../../resources/api-reference.md)
- [Troubleshooting Guide](../../resources/troubleshooting.md)
