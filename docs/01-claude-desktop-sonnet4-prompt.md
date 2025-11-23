# Claude Desktop Sonnet 4: End-to-End Webflow Designer API Prompt

## Executive Objective

**You are required to fully operationalize the Webflow Designer API** so that all web design and development workflows occur inside Claude Desktop, eliminating the need for native browser-based development within Webflow. You must leverage all developer tools, endpoints, and extension scaffolding to allow end-to-end site design, content management, publishing, and advanced customization via Claude's desktop interface exclusively.

---

## Implementation Guidance

### 1. Authenticate and Register

#### OAuth & Token Management
- Register a Webflow App and set up required OAuth or personal bearer token authentication based on your use case
- **For Public Apps**: Use OAuth 2.0 with client ID/secret and redirect URIs
- **For Internal Apps**: Use Bearer tokens with appropriate scopes
- Store and manage tokens securely, handling session management with JWT as per hybrid app starter logic
- Implement secure token refresh and rotation mechanisms
- Never expose sensitive tokens in client-side code

#### Session Management
- Use ID tokens for session identification in hybrid apps
- Implement JWT-based session handling for backend coordination
- Maintain secure credential storage in Claude Desktop environment
- Configure appropriate token expiration and refresh intervals

**Key References:**
- [Authentication Documentation](https://developers.webflow.com/data/reference/authentication)
- [Hybrid App Authentication Example](https://github.com/Webflow-Examples/Hybrid-App-Authentication)

---

### 2. Install & Use Development Tools

#### Webflow CLI Setup
```bash
# Install Webflow CLI globally
npm i -g @webflow/webflow-cli

# Create new extension project
webflow extension init my-extension

# Navigate to project
cd my-extension

# Serve locally (default port 1337)
npm run dev

# Build for production
npm run build
```

#### Project Structure
```
my-extension/
├── src/
│   └── index.ts                 # Main TypeScript file for Designer API calls
├── public/
│   ├── index.html               # Extension interface (body content only)
│   ├── index.js                 # Compiled JavaScript from TypeScript
│   └── styles.css               # Visual styling
├── webflow.json                 # App manifest configuration
├── package.json                 # Dependencies and scripts
└── bundle.zip                   # Generated deployment bundle
```

#### TypeScript Configuration
- Use TypeScript for type safety with Designer API typings
- Modern frameworks supported: React, Vue, Svelte (all work)
- Vite is the recommended bundler
- Enable hot module reloading (HMR) for development

**Key References:**
- [Extension CLI Guide](https://www.npmjs.com/package/@webflow/webflow-cli)
- [App Structure Documentation](https://developers.webflow.com/designer/reference/app-structure)

---

### 3. Programmatic Canvas Control

#### Element Manipulation
```typescript
// Get root and selected elements
const rootElement = await webflow.getRootElement();
const selectedElement = await webflow.getSelectedElement();

// Element CRUD operations
const newElement = await rootElement.append('div');
await newElement.setTextContent('New Element');
await newElement.setStyles({ color: '#FF0000' });

// Batch operations
const elements = [element1, element2, element3];
for (const elem of elements) {
  await elem.setClasses(['new-class']);
}
```

#### Component Management
```typescript
// List and retrieve components
const components = await webflow.listComponents();
const component = components.find(c => c.name === 'Card');

// Create component instance
const instance = await selectedElement.append(component);

// Navigate and modify instances
await webflow.enterComponentSet(instance);
// ... make modifications ...
await webflow.exitComponentSet();
```

#### Variables (Design Tokens)
```typescript
// Create and manage variables
const brandColor = await webflow.createVariable('brandColor', {
  type: 'color',
  value: '#0066FF'
});

// Update variables globally
await brandColor.update({ value: '#FF0066' });

// Reference in styles
await element.setStyles({ backgroundColor: brandColor });
```

#### Styles and Layout
```typescript
// Create and apply custom styles
const customStyle = await webflow.createStyle('custom-class');
await element.setClasses(['custom-class']);

// Manipulate layout properties
await element.setStyles({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});
```

#### Real-Time Responsive Updates
- Subscribe to media breakpoint events
- Dynamically update interfaces based on responsive states
- Provide instant visual feedback on the canvas
- Support multi-breakpoint design workflows

**Key References:**
- [Creating/Retrieving Elements](https://developers.webflow.com/designer/reference/creating-retrieving-elements)
- [Variables Overview](https://developers.webflow.com/designer/reference/variables-overview)
- [Design API Endpoints](https://developers.webflow.com/designer/new-designer-api-endpoints)

---

### 4. Project & Site Operations

#### Asset Management
```typescript
// List assets and folders
const assets = await webflow.listAssets();
const folders = await webflow.listAssetFolders();

// Create and upload assets
const newAsset = await webflow.createAsset({
  displayName: 'my-image.jpg',
  file: imageBuffer,
  folder: folderId
});

// Bulk operations
for (const asset of importedAssets) {
  await webflow.createAsset(asset);
}
```

#### Page Management
```typescript
// List all pages
const pages = await webflow.listPages();

// Fetch and modify page metadata
const page = await webflow.getPage(pageId);
await page.update({
  displayName: 'New Title',
  slug: 'new-slug'
});
```

#### SEO Configuration
```typescript
// Set SEO and meta tags
await page.setMetadata({
  title: 'Page Title',
  description: 'Page Description',
  openGraph: {
    image: 'og-image-url',
    title: 'Social Title'
  }
});
```

#### Custom Code Injection
```typescript
// Inject custom CSS
await webflow.injectCustomCode({
  location: 'page', // or 'site'
  type: 'css',
  code: customCss
});

// Inject custom JavaScript
await webflow.injectCustomCode({
  location: 'site',
  type: 'javascript',
  code: customJs
});
```

#### Publishing & Deployment
```typescript
// Publish site changes
await webflow.publishSite({
  includeAssets: true,
  includeDomain: 'yourdomain.com'
});

// Check publish status
const status = await webflow.getPublishStatus();
```

**Key References:**
- [Asset Management](https://developers.webflow.com/designer/reference/assets)
- [Pages & Site Structure](https://developers.webflow.com/designer/reference/pages)
- [Custom Code Injection](https://developers.webflow.com/designer/reference/custom-code)

---

### 5. Advanced Integration

#### Hybrid App Implementation
```typescript
// Coordinate between Designer API (frontend) and Data API (backend)
// Use Hybrid App Starter for complete implementation

// Frontend (Designer Extension)
const designerAPI = await webflow.authorize();

// Backend coordination
const backendResponse = await fetch('your-backend-endpoint', {
  headers: {
    'Authorization': `Bearer ${sessionToken}`
  }
});
```

#### Event Subscription & Handling
```typescript
// Subscribe to canvas events
webflow.on('selectedElementChanged', async (element) => {
  console.log('Selected:', element.name);
  // Update UI or perform operations
});

// Listen to page navigation
webflow.on('pageChanged', async (page) => {
  console.log('Current page:', page.name);
});

// Respond to breakpoint changes
webflow.on('breakpointChanged', async (breakpoint) => {
  console.log('Active breakpoint:', breakpoint.name);
});

// Unsubscribe when no longer needed
webflow.off('selectedElementChanged');
```

#### Secure Token Handling
- Store tokens in secure Claude Desktop storage
- Implement token refresh mechanisms
- Use HTTPS for all API calls
- Validate and sanitize all inputs
- Implement proper error handling and logging

**Key References:**
- [Hybrid App Starter](https://github.com/Webflow-Examples/hybrid-app-starter)
- [Events Documentation](https://developers.webflow.com/designer/reference/events)
- [Extension Utilities](https://developers.webflow.com/designer/reference/extension-utilities)

---

### 6. UI/UX Considerations

#### Extension Interface Design
```html
<!-- /public/index.html (body content only) -->
<div class="extension-container">
  <header class="extension-header">
    <h1>Extension Name</h1>
  </header>
  <main class="extension-content">
    <!-- Your UI here -->
  </main>
</div>
```

#### Styling Best Practices
```css
/* /public/styles.css */
:root {
  --wf-primary: #0066FF;
  --wf-background: #FFFFFF;
  --wf-border: #E5E5E5;
}

.extension-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
```

#### User Experience Features
- **Hot-Reloading**: Instant feedback during development
- **Error Logging**: Surface all error/output logs in Claude Desktop
- **Progress Indicators**: Show operation status and progress
- **Undo/Redo**: Implement reversible operations
- **Keyboard Shortcuts**: Support common shortcuts for power users
- **Context Menu**: Right-click operations on elements

#### Real-Time Feedback
- Update UI immediately on user actions
- Provide visual confirmation of successful operations
- Show clear error messages with remediation steps
- Log all operations for debugging

---

### 7. Documentation & Extensibility

#### API Abstraction
```typescript
// Create command templates for flexibility
interface APICommand {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  body?: Record<string, any>;
}

const commands = {
  createElement: (parent, type) => ({
    endpoint: 'elements/create',
    method: 'POST',
    body: { parent, type }
  }),
  updateElement: (id, properties) => ({
    endpoint: `elements/${id}`,
    method: 'PUT',
    body: properties
  })
};
```

#### Continuous Documentation
- Keep synchronized with [Official Webflow API Docs](https://developers.webflow.com/designer/reference/introduction)
- Abstract command templates for all endpoint calls
- Provide flexibility for future Designer API enhancements
- Document new scopes and features as they're released
- Maintain changelog of API modifications

#### Version Management
- Pin API versions in your code
- Test compatibility with new releases
- Implement graceful fallbacks for deprecated features
- Document breaking changes clearly

**Key References:**
- [Official API Documentation](https://developers.webflow.com/designer/reference/introduction)
- [API Changelog](https://developers.webflow.com/data/changelog/webflow-api-new-endpoints)
- [Extension Development Guide](https://developers.webflow.com/designer/reference/app-structure)

---

## Comprehensive Capabilities Matrix

| Area | Main Methods/Endpoints | Purpose & Example Uses |
|------|----------------------|----------------------|
| **Elements** | `getRootElement`, `getSelectedElement`, CRUD | Add/move elements, modify properties, live batch updates |
| **Components** | CRUD endpoints, instance navigation | Atomic design, reusable UI patterns, branded design systems |
| **Variables** | Color, typography, size, %, number API | Unified design tokens, brand consistency, global updates |
| **Assets** | List/create/delete assets/folders | Bulk asset management, programmatic uploads, media handling |
| **Pages/SEO** | List, fetch/update metadata/chunks | Site/page structure, SEO/OpenGraph automation, sitemap generation |
| **Custom Code** | Inject inline/hosted JS/CSS; metadata | Advanced interactive features, analytics, external integrations |
| **Authentication** | OAuth, Bearer, ID tokens, JWT sessions | Granular permissioning, secure external/internal workflows |
| **Events** | Element selection, page switch, breakpoints | Responsive/adaptive workflows, dynamic interface updates |
| **Extension Dev** | CLI (init, serve, build, bundle) | Scaffolding, local testing, publishing, version management |
| **Tech Stack** | TypeScript, Vite, React (optional) | Modern, type-safe, supports extensive developer toolchain |

---

## Complete Implementation Workflow

### Phase 1: Setup & Authentication (30 minutes)
1. Register Webflow App with OAuth credentials
2. Configure authentication in Claude Desktop environment
3. Test token generation and refresh flow
4. Validate secure token storage

### Phase 2: Development Tools (15 minutes)
1. Install Webflow CLI globally
2. Create new extension project with `webflow extension init`
3. Configure TypeScript and build tools
4. Set up hot-reloading for development

### Phase 3: Core API Integration (2-4 hours)
1. Implement element manipulation functions
2. Add component management capabilities
3. Create variable management system
4. Build asset upload/management system
5. Implement page and SEO operations

### Phase 4: Advanced Features (4-8 hours)
1. Add event subscriptions and handlers
2. Implement custom code injection
3. Create publishing/deployment workflows
4. Build hybrid app coordination (if needed)
5. Add batch operation capabilities

### Phase 5: UI/UX Polish (2-4 hours)
1. Design extension interface
2. Implement hot-reloading
3. Add error handling and logging
4. Create intuitive user workflows
5. Test responsive behavior

### Phase 6: Testing & Optimization (2-4 hours)
1. Test all Designer API endpoints
2. Optimize performance and memory usage
3. Implement comprehensive error handling
4. Validate security practices
5. Conduct user testing

### Phase 7: Deployment & Publishing (1-2 hours)
1. Build production bundle (`npm run build`)
2. Verify bundle size (<5MB)
3. Upload to Webflow workspace
4. Submit to marketplace (optional)
5. Monitor and maintain

---

## Expected Output

**A fully-local workflow with:**
- ✅ All web design and development occurring in Claude Desktop
- ✅ No browser required except for initial OAuth authentication handoff
- ✅ All API capabilities surfaced and accessible
- ✅ Webflow site and page edits initiated and completed through desktop
- ✅ Asset/import management automated
- ✅ Custom code additions manageable via CLI
- ✅ Content/model updates programmatic
- ✅ Publishing and deployment automated
- ✅ Real-time event handling and interface updates

---

## Security Best Practices

1. **Token Management**
   - Store tokens securely (never in plain text)
   - Implement automatic refresh
   - Use environment variables for sensitive data
   - Rotate credentials regularly

2. **API Security**
   - Use HTTPS for all requests
   - Validate and sanitize inputs
   - Implement rate limiting
   - Log security events

3. **Code Quality**
   - Avoid `eval()` statements
   - Prevent XSS vulnerabilities
   - Use Content Security Policy
   - Regular security audits

4. **Data Protection**
   - Encrypt sensitive data in transit
   - Implement proper access controls
   - Follow GDPR/privacy guidelines
   - Secure user credentials

---

## Troubleshooting & Common Issues

### Authentication Issues
- Verify OAuth credentials are correct
- Check token expiration and refresh logic
- Ensure redirect URIs match configuration
- Review scope permissions

### API Errors
- Check for rate limiting (429 errors)
- Verify API version compatibility
- Ensure proper request formatting
- Check for network connectivity

### Performance Issues
- Optimize event subscription callbacks
- Unsubscribe from events when not needed
- Batch operations where possible
- Monitor memory usage

### Build/Deployment Issues
- Ensure bundle size < 5MB
- Verify all dependencies are included
- Test in production environment
- Check browser console for errors

---

## Key References

- [Official Webflow API Documentation](https://developers.webflow.com/designer/reference/introduction)
- [Hybrid App Starter Repository](https://github.com/Webflow-Examples/hybrid-app-starter)
- [Extension CLI Package](https://www.npmjs.com/package/@webflow/webflow-cli)
- [Authentication Documentation](https://developers.webflow.com/data/reference/authentication)
- [Designer API Events](https://developers.webflow.com/designer/reference/events)
- [Webflow Developers Portal](https://developers.webflow.com)
- [GitHub Examples Repository](https://github.com/webflow-examples)

---

## Conclusion

By following this comprehensive prompt and technical specification, Claude Desktop Sonnet 4 can fully take control of your Webflow workflow, maximizing automation, reactivity, and developer productivity without leaving your desktop environment. All advanced Webflow API workflows, extension development, and site operations are surfaced and managed in a secure, tokenized, fully-local context.

**Status**: Ready for implementation  
**Last Updated**: November 2025  
**Version**: 1.0
