# 🚀 Quick Start Guide

Get your first Webflow Designer extension running in **5 minutes**.

## Prerequisites

- Node.js 16+ and npm
- Basic knowledge of React/TypeScript
- Webflow account with developer access
- Code editor (VS Code recommended)

## Step 1: Clone & Setup (1 minute)

```bash
# Clone the repository
git clone https://github.com/Kr8thor/webflow-designer-api-guide.git
cd webflow-designer-api-guide

# Navigate to the basic example
cd examples/basic-extension

# Install dependencies
npm install
```

## Step 2: Start Development Server (1 minute)

```bash
npm run dev
```

You'll see:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Press h to show help
```

## Step 3: Open in Webflow (1 minute)

1. Go to **Webflow Designer** → Open any project
2. Go to **Designer Extensions** panel (left sidebar)
3. Click **+ Install Extension**
4. Enter: `http://localhost:3000`
5. Click **Install**

Your extension is now live in the Designer! 🎉

## Step 4: Try It Out (1 minute)

1. **Select an element** in the canvas
2. **Look at the right panel** - your extension shows the element details
3. **Change the color** input to modify the element's color
4. **Change the name** input to rename the element

## Step 5: Make Your First Change (1 minute)

Open `src/App.tsx` and modify the header:

```typescript
// Find this line (around line 40):
<h1>🔧 Basic Extension</h1>

// Change to:
<h1>🔧 My First Extension</h1>
```

Save the file → Your change appears **instantly** in Webflow! (Hot reload)

---

## What's Next?

### 🎓 Learn More
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup guide
- **[docs/01-claude-desktop-sonnet4-prompt.md](docs/01-claude-desktop-sonnet4-prompt.md)** - Comprehensive API guide
- **[resources/api-reference.md](resources/api-reference.md)** - API quick reference

### 📁 Explore Other Examples
Each example demonstrates different features:
- **element-editor** - Edit element properties
- **component-library** - Manage components
- **design-tokens** - Create design systems
- **asset-uploader** - Upload and manage files
- **seo-automator** - Automate SEO metadata
- **code-injector** - Inject custom code
- **event-driven-app** - Handle Designer events

### 💡 Copy a Template
Use production-ready templates from `/templates`:
- `component-management.ts` - Component operations
- `variables-tokens.ts` - Design tokens
- `asset-management.ts` - File management
- `custom-code-injection.ts` - Code injection
- `event-subscriptions.ts` - Event handling
- And more...

### 🚀 Build Your Own Extension

1. Copy the `basic-extension` folder
2. Rename it to your extension name
3. Update `webflow.json` with your info
4. Modify `src/App.tsx` for your features
5. Use templates from `/templates` as needed
6. Test with `npm run dev`
7. Build with `npm run build`
8. Submit to marketplace (see [resources/marketplace-submission.md](resources/marketplace-submission.md))

---

## Common Issues

### 🔴 "Cannot connect to localhost:3000"

**Solution:** Make sure dev server is running with `npm run dev`

### 🔴 "Extension not showing changes"

**Solution:**
1. Hard refresh Webflow (Ctrl+Shift+R)
2. Reinstall the extension if hot reload fails
3. Check browser console for errors (F12)

### 🔴 "TypeScript errors"

**Solution:** Run `npm run type-check` to see all type issues

### 🔴 "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Then restart: npm run dev
```

---

## Useful Commands

```bash
# Start development server
npm run dev

# Check TypeScript errors
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Key Files to Know

```
basic-extension/
├── src/
│   ├── App.tsx          ← Main extension component
│   ├── index.tsx        ← React entry point
│   └── styles.css       ← Styling
├── webflow.json         ← Extension manifest (name, permissions)
├── package.json         ← Dependencies
└── vite.config.ts       ← Build configuration
```

---

## API Basics (What You Can Do)

```typescript
// These objects are available globally in your extension:

// Designer API - Real-time canvas manipulation
window.webflow.elementSelected  // When user selects element
window.webflow.updateElement()  // Modify selected element
window.webflow.selectedElement  // Get selected element properties

// See docs/01-claude-desktop-sonnet4-prompt.md for full API
```

---

## Next: Interactive Features

Once you're comfortable, explore:
1. **Event handling** - React to Designer events
2. **Multiple elements** - Work with selected elements
3. **Asset management** - Upload and manage files
4. **Collections** - Integrate with Webflow Collections
5. **OAuth** - Add user authentication

See [FEATURES_MATRIX.md](FEATURES_MATRIX.md) to see which examples show which features.

---

## Get Help

- 📖 **Documentation**: Check [STRUCTURE.md](STRUCTURE.md) for full navigation
- ❓ **Questions**: See [FAQ.md](FAQ.md)
- 🐛 **Issues**: Report on [GitHub Issues](https://github.com/Kr8thor/webflow-designer-api-guide/issues)
- 💬 **Community**: Webflow Forum or Discord

---

**You're all set! Happy building! 🎉**
