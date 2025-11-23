# Quick Start - 2 Minutes to Your First Extension

**Goal**: Build a working Webflow Designer extension in 2 minutes.

---

## ⚡ Step 1: Create Your Project (30 seconds)

```bash
# Clone or navigate to the project directory
cd webflow-designer-api-guide

# Create a new extension
node cli/create-extension.js my-first-extension

# Navigate to your project
cd my-first-extension
```

✅ You now have a complete project structure

---

## 📦 Step 2: Install Dependencies (30 seconds)

```bash
npm install
```

This installs:
- `@webflow/designer-api` - The Designer API
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions

✅ Dependencies installed

---

## 🛠️ Step 3: Build Your Extension (30 seconds)

```bash
npm run build
```

This:
- Compiles TypeScript to JavaScript
- Creates `dist/` folder with your extension
- Shows any compilation errors

✅ Your extension is built and ready

---

## 🧪 Step 4: Test It (Optional - 30 seconds)

```bash
# Development mode - watches for changes
npm run dev

# In another terminal, check the build
ls -la dist/
```

✅ You have a working extension!

---

## 📚 What's Next?

### Option A: Learn from Examples
```bash
# Go back to main directory
cd ..

# Study the complete examples
ls -la examples/

# Read the example code
cat examples/01-basic-designer-extension/README.md
cat examples/02-element-properties-editor/README.md
```

### Option B: Use Templates
```bash
# Copy templates to your project
cp templates/*.ts my-first-extension/src/

# Now you can use advanced features
# Import: import { ComponentManager } from './templates/component-management';
```

### Option C: Read the Guides
```bash
# Full API reference
cat guides/01-api-reference.md

# Troubleshooting
cat guides/02-troubleshooting-guide.md

# Performance optimization
cat guides/03-performance-guide.md

# Security best practices
cat guides/04-security-guide.md
```

---

## 🎯 Common Next Steps

### Load into Webflow Designer

1. Build your extension: `npm run build`
2. Go to Webflow Designer
3. Install extension from your built bundle
4. Test it on your site

### Add a Feature

Edit `src/index.ts`:

```typescript
import { webflow } from '@webflow/designer-api';

webflow.on('selectedElementsChange', (elements) => {
  console.log(`${elements.length} elements selected`);
  webflow.notify.success(`Selected ${elements.length} element(s)`);
});
```

Then rebuild:
```bash
npm run build
```

### Use a Template

Copy a template and use it:

```typescript
import { ComponentManager } from './component-management';

const manager = new ComponentManager();
const components = await manager.getAllComponents();
console.log(`Found ${components.length} components`);
```

---

## 📖 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Watch mode - rebuilds on save |
| `npm run build` | Build for production |
| `npm run clean` | Remove build artifacts |

---

## 🚨 Troubleshooting

### "Module not found"
```bash
npm install
```

### "TypeScript errors"
```bash
# Check what's wrong
npm run build

# Fix the TypeScript error in src/index.ts
```

### "Extension won't load"
- Check `manifest.json` is valid JSON
- Check `src/index.ts` has no errors
- Ensure all imports resolve correctly

**More help**: `cat ../guides/02-troubleshooting-guide.md`

---

## 🎓 Learning Resources

### Quick Learning (10 minutes)
1. `COMPLETE-PROJECT-GUIDE.md` - Overview
2. `examples/01-basic-designer-extension` - Simple example
3. `guides/01-api-reference.md` - API methods

### Deep Dive (1 hour)
1. `docs/03-designer-api-research.md` - Case studies
2. `guides/03-performance-guide.md` - Optimization
3. `guides/04-security-guide.md` - Security

### Reference (On-demand)
- API methods: `guides/01-api-reference.md`
- Issues: `guides/02-troubleshooting-guide.md`
- Production: `guides/03-performance-guide.md` + `04-security-guide.md`

---

## ✅ Checklist: From Idea to Marketplace

- [ ] Create project with `node cli/create-extension.js my-extension`
- [ ] Install dependencies: `npm install`
- [ ] Build: `npm run build`
- [ ] Test locally in Webflow Designer
- [ ] Read `guides/04-security-guide.md`
- [ ] Review `guides/03-performance-guide.md`
- [ ] Test thoroughly
- [ ] Read marketplace requirements
- [ ] Submit to Webflow Marketplace

---

## 🚀 You're Done!

You now have:
- ✅ A complete, working extension
- ✅ Development environment set up
- ✅ Access to all templates and examples
- ✅ Comprehensive guides and documentation

**Next step**: Build something awesome! 🎉

---

## 📞 Need Help?

1. **API questions?** → `guides/01-api-reference.md`
2. **Something broken?** → `guides/02-troubleshooting-guide.md`
3. **Want to optimize?** → `guides/03-performance-guide.md`
4. **Security concerns?** → `guides/04-security-guide.md`
5. **See examples?** → `examples/` folder
6. **Full reference?** → `COMPLETE-PROJECT-GUIDE.md`

---

**Happy building! 🚀**
