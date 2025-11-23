# Installation & Setup Guide

Quick start guide for using the Webflow Designer API documentation and creating extensions.

## Prerequisites

- **Node.js**: 16.x or higher
- **npm**: 7.x or higher (or equivalent yarn/pnpm)
- **Webflow Account**: Active workspace with admin access
- **Git**: For cloning and version control

## Quick Start

### 1. Install Webflow CLI

```bash
npm install -g @webflow/webflow-cli
```

Verify installation:
```bash
webflow --version
```

### 2. Create a New Extension

```bash
webflow extension init my-extension
cd my-extension
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Your extension will be available at `http://localhost:1337`

### 5. Build for Production

```bash
npm run build
```

This generates `bundle.zip` ready for deployment.

---

## Repository Setup

### Clone This Repository

```bash
git clone https://github.com/Kr8thor/webflow-designer-api-guide.git
cd webflow-designer-api-guide
```

### Structure Overview

```
webflow-designer-api-guide/
├── README.md                    # Main overview
├── STRUCTURE.md                 # Repository structure
├── INSTALLATION.md              # This file
├── docs/                        # Documentation
├── templates/                   # Reusable code templates
├── examples/                    # Working examples
└── resources/                   # Additional resources
```

---

## Using Templates

Templates provide ready-to-use code for common tasks:

### Extension Init Template

Copy the basic scaffold to your project:

```bash
cp templates/extension-init.ts src/index.ts
```

### Element Manipulation Template

Import element functions:

```typescript
import {
  getSelectedElement,
  createElement,
  setElementStyles,
  addElementClasses
} from './templates/element-manipulation';
```

---

## Authentication Setup

### For OAuth (Public Apps)

1. Create an app in your Webflow workspace:
   - Go to Workspace Settings → Integrations
   - Create new app
   - Note your Client ID and Client Secret

2. Configure redirect URI:
   ```
   http://localhost:3000/oauth/callback  (for local development)
   https://yourdomain.com/oauth/callback (for production)
   ```

### For Bearer Tokens (Internal Apps)

1. Generate a token in Webflow:
   - Go to Workspace Settings → Integrations
   - Create personal access token
   - Store securely (never in version control)

2. Use in your code:
   ```typescript
   const token = process.env.WEBFLOW_API_TOKEN;
   ```

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Make Changes

Edit files in `src/` and `public/`:
- `src/index.ts` - TypeScript logic
- `public/index.html` - Extension UI
- `public/styles.css` - Styling

### 3. Hot Reload

Changes are automatically reloaded in the browser.

### 4. Test Your Extension

1. Go to your Webflow workspace
2. Go to Integrations
3. Load extension from `http://localhost:1337`
4. Test functionality in the Designer

### 5. Build for Deployment

```bash
npm run build
```

Creates `bundle.zip` for uploading.

---

## Environment Variables

Create a `.env.local` file:

```
VITE_WEBFLOW_CLIENT_ID=your_client_id
VITE_WEBFLOW_CLIENT_SECRET=your_client_secret
VITE_API_BASE_URL=https://api.webflow.com
```

**Important**: Never commit this file to version control!

---

## Troubleshooting

### Port 1337 Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Webflow API Not Available

1. Ensure you're in a Webflow Designer workspace
2. Check browser console for errors
3. Verify CORS settings

### Build Size Too Large

```bash
# Check bundle size
npm run build -- --analyze

# Remove unused dependencies
npm prune --production
```

---

## Directory Structure Best Practices

```
my-extension/
├── src/
│   ├── index.ts              # Main entry point
│   ├── api/                  # API integration
│   ├── components/           # Reusable components
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript definitions
│   └── utils/                # Helper functions
├── public/
│   ├── index.html            # Main HTML
│   ├── index.js              # Compiled JS
│   └── styles.css            # Styling
├── webflow.json              # App manifest
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── .env.local                # Local environment variables
```

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run build:watch      # Watch mode build

# Testing (if configured)
npm run test             # Run tests
npm run test:watch       # Watch mode tests

# Linting (if configured)
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues

# Bundle analysis
npm run build -- --analyze  # Analyze bundle size
```

---

## IDE Setup

### VS Code

Install recommended extensions:
- TypeScript Vue Plugin
- Prettier
- ESLint
- Webflow API Intellisense (if available)

### WebStorm

- Enable TypeScript support
- Configure Prettier as code formatter
- Set up ESLint integration

---

## Deployment

### Upload to Webflow

1. Build your extension:
   ```bash
   npm run build
   ```

2. In Webflow workspace:
   - Go to Integrations
   - Click "Add app" or "Upload app"
   - Select `bundle.zip`

3. Configure permissions and settings

### Submit to Marketplace (Optional)

1. Complete testing
2. Prepare demo video (2-5 minutes)
3. Gather required assets:
   - App logo (900x900px)
   - Screenshots (1280x846px)
   - Description and feature list
4. Submit through Webflow dashboard

See `docs/02-webflow-app-development-guidelines.md` for detailed guidelines.

---

## Resources

- [Webflow Developers Portal](https://developers.webflow.com)
- [CLI Documentation](https://www.npmjs.com/package/@webflow/webflow-cli)
- [API Reference](https://developers.webflow.com/designer/reference/introduction)
- [GitHub Examples](https://github.com/webflow-examples)
- [Community Forum](https://discourse.webflow.com)

---

## Getting Help

### Check Documentation

1. Review [`docs/01-claude-desktop-sonnet4-prompt.md`](docs/01-claude-desktop-sonnet4-prompt.md)
2. Check [`resources/troubleshooting.md`](resources/troubleshooting.md)
3. See [`resources/api-reference.md`](resources/api-reference.md)

### Community Support

- [Webflow Forum - App Developers](https://discourse.webflow.com)
- [GitHub Issues](https://github.com/Kr8thor/webflow-designer-api-guide/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/webflow)

---

## Next Steps

1. ✅ Install Node.js and Webflow CLI
2. ✅ Create your first extension
3. ✅ Read [`docs/01-claude-desktop-sonnet4-prompt.md`](docs/01-claude-desktop-sonnet4-prompt.md)
4. ✅ Review templates in `templates/` directory
5. ✅ Study examples in `examples/` directory
6. ✅ Check documentation as you build

---

**Last Updated**: November 23, 2025  
**Version**: 1.0
