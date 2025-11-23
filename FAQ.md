# ❓ Frequently Asked Questions

## Getting Started

### Q: What do I need to start building extensions?
**A:** You need:
- Node.js 16+ and npm
- Basic React/TypeScript knowledge
- Webflow account with Developer access
- Code editor (VS Code recommended)

See [QUICK_START.md](QUICK_START.md) to get running in 5 minutes.

### Q: Do I need to know React?
**A:** Yes, all examples use React. If you're new to React:
- Start with [React docs](https://react.dev)
- Review our [basic-extension](examples/basic-extension) example
- Copy patterns from other examples in `/examples`

### Q: Can I use JavaScript instead of TypeScript?
**A:** All examples use TypeScript for type safety. You can:
1. Use `.js` files instead of `.ts`
2. Add `// @ts-ignore` comments to skip type checking
3. Gradually migrate to TypeScript

We recommend TypeScript for production extensions.

### Q: What is Vite and why are we using it?
**A:** Vite is a fast build tool for modern web apps. We use it because:
- ⚡ Fast hot reload (instant updates in browser)
- 📦 Optimized production bundles
- 🎯 Modern JavaScript support
- 📝 Great for extensions

See [vite.dev](https://vite.dev) for more info.

---

## API & Features

### Q: What can I do with the Designer API?
**A:** The Designer API lets you:
- ✅ Select and read element properties
- ✅ Update element styles and attributes
- ✅ Rename elements
- ✅ Work with components
- ✅ Create and manage design tokens
- ✅ Upload and manage assets
- ✅ Handle Designer events
- ✅ Inject custom code

See [FEATURES_MATRIX.md](FEATURES_MATRIX.md) for what each example shows.

### Q: What's the difference between Designer API and Data API?
**A:**
- **Designer API**: Real-time canvas manipulation in the Webflow Designer
- **Data API**: Server-side REST API for CMS/site data (collections, items, etc.)

Use Designer API for extension UI. Combine both for hybrid apps.

### Q: Can I access real site data (collections, items)?
**A:** Yes, but you need the **Data API** (requires OAuth). See:
- [hybrid-app-setup.ts](templates/hybrid-app-setup.ts) template
- [event-driven-app](examples/event-driven-app) example
- [docs/01-claude-desktop-sonnet4-prompt.md](docs/01-claude-desktop-sonnet4-prompt.md)

### Q: What are the rate limits?
**A:** Designer API has generous limits. Data API limits:
- **Free**: 60 requests/minute
- **Paid**: 600 requests/minute per site

See [resources/api-reference.md](resources/api-reference.md) for full limits.

### Q: How do I handle errors?
**A:** All templates include error handling. Example:
```typescript
try {
  const result = await manager.updateElement(elementId)
} catch (error) {
  console.error('Update failed:', error)
  showErrorMessage('Failed to update element')
}
```

See [resources/troubleshooting.md](resources/troubleshooting.md) for common errors.

---

## Development

### Q: How do I debug my extension?
**A:** Use browser DevTools:
1. Open Webflow Designer
2. Press `F12` to open DevTools
3. Check **Console** tab for errors
4. Use `console.log()` to debug

Your dev server logs also appear in terminal.

### Q: Why does my extension sometimes not update?
**A:** Try:
1. Hard refresh: `Ctrl+Shift+R` (or Cmd+Shift+R on Mac)
2. Reinstall the extension
3. Restart dev server: `npm run dev`
4. Check browser console for errors

See [resources/troubleshooting.md](resources/troubleshooting.md) for more.

### Q: How do I test my extension?
**A:**
1. Use **basic-extension** as a testing template
2. Manually test in Webflow Designer
3. Check console for errors (F12)
4. Test with different element types

For automated testing, see [resources/performance-guide.md](resources/performance-guide.md).

### Q: Can I use external npm packages?
**A:** Yes! Just `npm install package-name` and import it. Consider:
- Bundle size impact
- Security and maintenance
- Alternative native solutions

Popular safe packages:
- `axios` - HTTP requests
- `lodash` - Utility functions
- `date-fns` - Date handling

### Q: How big can my extension bundle be?
**A:** Ideally < 500KB (gzipped). Our examples are:
- basic-extension: ~50KB
- design-tokens: ~100KB
- asset-uploader: ~120KB

See [resources/performance-guide.md](resources/performance-guide.md) for optimization.

---

## Templates & Examples

### Q: What's the difference between templates and examples?
**A:**
- **Templates**: Reusable code snippets for specific features
- **Examples**: Complete working apps demonstrating features

Use templates as starting points. Use examples as learning references.

### Q: Which example should I start with?
**A:** Start with [basic-extension](examples/basic-extension):
- Simplest to understand
- Takes 5 minutes to run
- Shows core concepts
- Good foundation for learning

See [FEATURES_MATRIX.md](FEATURES_MATRIX.md) to find others.

### Q: Can I copy code from examples?
**A:** Yes! All code is MIT licensed:
1. Copy the entire example folder
2. Rename it to your extension
3. Modify for your needs
4. Update `webflow.json` with your info

### Q: How do I use a template?
**A:** Templates show patterns. To use:
1. Find relevant template in `/templates`
2. Copy the code
3. Import into your extension
4. Adapt to your needs
5. Test thoroughly

Example:
```typescript
// In your app, import the template
import { ComponentManager } from '../templates/component-management'

// Use it in your extension
const manager = new ComponentManager(webflow)
const components = await manager.getAll()
```

---

## Building for Production

### Q: How do I prepare my extension for marketplace?
**A:** Follow this checklist:
1. ✅ Security review (see [resources/security-checklist.md](resources/security-checklist.md))
2. ✅ Test thoroughly
3. ✅ Optimize bundle size (< 500KB)
4. ✅ Write clear documentation
5. ✅ Add error handling
6. ✅ Handle edge cases
7. ✅ Get feedback from beta users
8. ✅ Follow [resources/marketplace-submission.md](resources/marketplace-submission.md)

### Q: What's the submission process?
**A:**
1. Prepare your extension (see checklist above)
2. Write comprehensive README
3. Take screenshots
4. Submit on Webflow marketplace
5. Wait for review (1-5 days)
6. Address feedback
7. Get approved and published

See [resources/marketplace-submission.md](resources/marketplace-submission.md) for details.

### Q: Can I charge for my extension?
**A:** Yes! Pricing options:
- **Free**: No payment, ad-supported, or freemium
- **One-time**: Fixed price
- **Subscription**: Monthly/yearly recurring
- **Enterprise**: Custom pricing

See [resources/marketplace-submission.md](resources/marketplace-submission.md) for revenue details.

### Q: What if my extension gets rejected?
**A:** Common rejection reasons:
- Security issues (hardcoded API keys)
- Poor performance (bundle > 1MB)
- Bad documentation
- Broken functionality
- Low code quality

Each rejection includes feedback. Address issues and resubmit.

---

## Performance & Security

### Q: How do I optimize my extension?
**A:** Tips:
- ✅ Code split large features
- ✅ Lazy load heavy components
- ✅ Optimize images
- ✅ Remove unused dependencies
- ✅ Use React.memo for expensive components
- ✅ Debounce expensive operations

See [resources/performance-guide.md](resources/performance-guide.md).

### Q: Is my extension secure?
**A:** Check these:
- ✅ No hardcoded API keys
- ✅ HTTPS for all requests
- ✅ Input validation
- ✅ Output encoding
- ✅ Secure token storage
- ✅ No eval() or dynamic code execution

See [resources/security-checklist.md](resources/security-checklist.md).

### Q: How do I handle user data safely?
**A:**
- Never store sensitive data in localStorage
- Use HTTPS for all API calls
- Validate all user input
- Encode output to prevent XSS
- Use OAuth for authentication
- Follow GDPR/CCPA requirements

See [docs/02-webflow-app-development-guidelines.md](docs/02-webflow-app-development-guidelines.md).

---

## Troubleshooting

### Q: Extension won't install
**A:** Check:
1. Dev server running: `npm run dev`
2. Correct URL: `http://localhost:3000`
3. No TypeScript errors: `npm run type-check`
4. Check browser console (F12)
5. Try different port if 3000 busy

### Q: No webflow object available
**A:** This means:
- Extension isn't loaded in Webflow
- Wrong scope permissions
- Development server not running

Make sure dev server is running and extension is installed in Designer.

### Q: My changes don't appear
**A:** Try:
1. Hard refresh: `Ctrl+Shift+R`
2. Check console for errors (F12)
3. Reinstall extension
4. Restart dev server

### Q: Port 3000 already in use
**A:** Kill the process:
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

Then restart: `npm run dev`

### Q: TypeScript errors
**A:** Run:
```bash
npm run type-check
```

This shows all type issues. Fix them or use `// @ts-ignore` to skip.

---

## Project Structure

### Q: Where should I put my code?
**A:** Standard structure:
```
my-extension/
├── src/
│   ├── App.tsx           ← Main component
│   ├── index.tsx         ← Entry point
│   ├── components/       ← Sub-components
│   ├── hooks/            ← Custom hooks
│   ├── types/            ← TypeScript types
│   ├── utils/            ← Helper functions
│   └── styles.css        ← Styling
├── webflow.json          ← Manifest
├── package.json          ← Dependencies
└── vite.config.ts        ← Build config
```

### Q: What's in webflow.json?
**A:** Extension metadata:
```json
{
  "name": "My Extension",
  "description": "Does amazing things",
  "version": "1.0.0",
  "designExtension": {
    "allowedScopes": ["designer:read"],
    "requiredScopes": ["designer:read"]
  }
}
```

### Q: What permissions do I need?
**A:**
- `designer:read` - Read element properties
- `designer:write` - Modify element properties
- Data API scopes for OAuth apps

See [docs/01-claude-desktop-sonnet4-prompt.md](docs/01-claude-desktop-sonnet4-prompt.md) for all scopes.

---

## Learning Resources

### Q: Where can I learn more?
**A:** Check:
1. [QUICK_START.md](QUICK_START.md) - Get running fast
2. [STRUCTURE.md](STRUCTURE.md) - Project navigation
3. [docs/01-claude-desktop-sonnet4-prompt.md](docs/01-claude-desktop-sonnet4-prompt.md) - Full API guide
4. [resources/api-reference.md](resources/api-reference.md) - Quick reference
5. [Official Webflow Docs](https://developers.webflow.com)

### Q: Are there video tutorials?
**A:** We don't have videos yet, but:
- Examples are well-documented
- Code has inline comments
- README files explain each feature
- See [resources/links.md](resources/links.md) for community resources

### Q: How do I contribute?
**A:** See [CONTRIBUTING.md](.github/CONTRIBUTING.md):
- Report bugs as issues
- Submit PRs for improvements
- Add new examples
- Improve documentation

---

## Still Have Questions?

- 📖 Check [STRUCTURE.md](STRUCTURE.md) for full navigation
- 🔗 See [resources/links.md](resources/links.md) for external resources
- 🐛 Report issues on [GitHub Issues](https://github.com/Kr8thor/webflow-designer-api-guide/issues)
- 💬 Ask on Webflow Forum or Discord

**Happy building! 🚀**
