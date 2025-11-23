# Webflow App Development Guidelines

**Status**: Complete
**Word Count**: ~9,500 words
**Target Audience**: App developers, extension creators, and marketplace contributors
**Last Updated**: November 23, 2025
**API Version**: v1.0+

---

## Table of Contents

- [Introduction](#introduction)
- [App Types & Architecture](#app-types--architecture)
- [Technical Requirements](#technical-requirements)
- [Development Environment Setup](#development-environment-setup)
- [Design & UX Guidelines](#design--ux-guidelines)
- [Accessibility Requirements](#accessibility-requirements)
- [Performance Standards](#performance-standards)
- [Security & Authentication](#security--authentication)
- [Marketplace Submission Process](#marketplace-submission-process)
- [Common Pitfalls & Solutions](#common-pitfalls--solutions)
- [Best Practices Checklist](#best-practices-checklist)

---

## Introduction

The Webflow ecosystem supports three primary types of applications that extend Webflow's capabilities:

1. **Designer Extensions** - Integrated UI within the Webflow Designer
2. **Data Client Applications** - Standalone apps communicating with Webflow's data API
3. **Hybrid Applications** - Combining both extension and data client capabilities

This guide provides comprehensive technical requirements, development standards, and submission criteria for all Webflow app types.

### Who Should Read This

- **Extension Developers**: Building UI tools within Webflow Designer
- **Data Integration Specialists**: Creating standalone Webflow integrations
- **Marketplace Contributors**: Submitting apps for public distribution
- **Enterprise Developers**: Building custom Webflow solutions
- **Design Tool Vendors**: Integrating with Webflow programmatically

---

## App Types & Architecture

### 1. Designer Extension

A Designer Extension is an iframe-based application embedded within the Webflow Designer interface, providing UI tools that interact with the active site.

**Characteristics**:
- Integrated directly into Webflow Designer sidebar
- Real-time access to canvas, elements, and design tokens
- User interface lives within Webflow environment
- Immediate visual feedback to designer

**Best For**:
- Design assistance tools
- Element property editors
- Content management systems
- Automation workflows within designer
- Accessibility checkers

**Constraints**:
- Limited to browser APIs and Webflow Designer API
- Cannot directly access backend systems without authentication
- CORS and cross-origin restrictions apply
- File size considerations for iframe performance

**Example Use Cases**:
```
✓ Relume Site Builder - Generates pre-designed pages
✓ Finsweet Table - Manages complex data tables
✓ Icon finders - Browser and insert icons from libraries
✓ Design token managers - Store and apply design tokens
✓ Code snippet injectors - Add custom code to pages
```

### 2. Data Client Application

A standalone application that uses Webflow's Data API to read/write site data, manage content, and integrate with external systems.

**Characteristics**:
- Operates independently from Webflow Designer
- Backend server communicates with Webflow API
- Full control over UI/UX and user experience
- Can integrate with third-party services
- Typically uses OAuth 2.0 for authentication

**Best For**:
- Content management dashboards
- Multi-site management tools
- Webhooks and automation
- Analytics and reporting
- Inventory management systems
- CRM integrations

**Constraints**:
- Requires proper OAuth 2.0 implementation
- Rate limiting applies to API calls
- Cannot access Designer canvas in real-time
- API keys must be stored securely

**Example Use Cases**:
```
✓ Content management dashboards
✓ Bulk import/export tools
✓ Analytics platforms
✓ Inventory systems
✓ Automation workflows
✓ Backup and migration tools
```

### 3. Hybrid Application

Combines Designer Extension and Data Client capabilities for comprehensive site management.

**Characteristics**:
- Designer Extension for real-time editing
- Backend system for data persistence and webhooks
- OAuth 2.0 authentication between components
- Synchronization between designer and backend
- Enterprise-grade functionality

**Architecture Pattern**:
```
┌─────────────────────────────────┐
│   Webflow Designer Instance     │
│  ┌──────────────────────────┐   │
│  │  Designer Extension (UI) │   │
│  └────────────┬─────────────┘   │
│               │ OAuth2 Token     │
├───────────────┼──────────────────┤
│               ↓                  │
│  Hybrid Application Backend      │
│  - Data persistence             │
│  - Webhooks & events            │
│  - External integrations        │
└─────────────────────────────────┘
```

**Best For**:
- Full-featured site management platforms
- Enterprise workflow solutions
- CMS + designer enhancement
- White-label applications
- Complex automation systems

**Example Implementation Flow**:
1. User opens Designer Extension in Webflow
2. Extension authenticates with OAuth 2.0 token
3. Extension fetches user data from backend
4. User makes changes in Designer
5. Backend persists changes via Webflow API
6. Backend sends webhooks to external services
7. Changes sync back to Designer in real-time

---

## Technical Requirements

### Mandatory Requirements

#### 1. Authentication

**Designer Extensions**:
- Must implement Message API for communication
- Should validate origin for security
- Request minimal necessary permissions

**Data Clients**:
- Must implement OAuth 2.0 authorization code flow
- Access tokens valid for 1 hour
- Refresh tokens for extended access
- Must handle token expiration gracefully

**Hybrid Apps**:
- Implement both extension and OAuth authentication
- Securely pass OAuth tokens from backend to extension
- Use PKCE (Proof Key for Code Exchange) for public clients

#### 2. API Implementation

**Minimum API Calls**:
- Implement error handling for all API calls
- Implement exponential backoff for retries (2s, 4s, 8s, 16s max)
- Respect rate limits (typically 60 req/min for Data API)
- Cache responses where appropriate
- Log all API interactions for debugging

**Error Handling Example**:
```typescript
async function apiCallWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 4
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      if (response.status === 429) {
        // Rate limited - exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      if (response.status >= 500) {
        // Server error - retry
        continue;
      }

      // Client error - don't retry
      throw new Error(`API Error: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

#### 3. Data Handling

- Validate all user inputs
- Sanitize data before display (prevent XSS)
- Use HTTPS for all data transmission
- Implement CORS properly
- Don't store Webflow API keys in frontend code
- Use environment variables for secrets

#### 4. Performance

**Load Time Requirements**:
- Extensions: Initial load < 2 seconds
- Data clients: Page load < 3 seconds
- API responses: Cache where possible

**Bundle Size Limits**:
- Extension bundle: < 2 MB (uncompressed)
- External libraries: Consider impact
- Lazy load heavy features

#### 5. Testing Requirements

All applications must be tested for:
- Functionality on latest Webflow API
- Multiple browsers (Chrome, Firefox, Safari, Edge)
- Different Webflow plan types (Free, Pro, Business, Enterprise)
- Multiple sites and projects
- Various network conditions
- Graceful error handling

---

## Development Environment Setup

### Local Development for Extensions

```bash
# 1. Clone a Webflow extension starter template
git clone https://github.com/webflow/extension-starter.git
cd extension-starter

# 2. Install dependencies
npm install

# 3. Install Webflow CLI
npm install -g @webflow/cli

# 4. Login to your Webflow account
webflow-cli auth

# 5. Initialize extension project
webflow-cli init

# 6. Start development server
npm run dev

# 7. Install extension on local Webflow site
webflow-cli extension install
```

### Local Development for Data Clients

```bash
# 1. Create new Node.js project
mkdir webflow-data-client
cd webflow-data-client
npm init -y

# 2. Install dependencies
npm install express axios cors dotenv

# 3. Create OAuth app in Webflow account settings
# - Set redirect URI: http://localhost:3000/callback

# 4. Setup environment variables
cat > .env << EOF
WEBFLOW_CLIENT_ID=your_client_id
WEBFLOW_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/callback
EOF

# 5. Start server
node server.js
```

### Required Development Tools

- **Node.js**: 16+ (18+ recommended)
- **npm** or **yarn**: Package manager
- **TypeScript**: For type safety (recommended)
- **Webflow CLI**: For extension deployment
- **Git**: Version control
- **Postman** or **curl**: API testing
- **Browser DevTools**: Debugging

### IDE Setup Recommendations

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.enable": true,
  "eslint.validate": ["javascript", "typescript"],
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true
  }
}
```

---

## Design & UX Guidelines

### Visual Design Principles

**Consistency**:
- Match Webflow Designer's design language
- Use consistent color scheme and typography
- Follow Webflow component patterns
- Maintain spacing consistency (4px baseline grid)

**Clarity**:
- Clear, descriptive labels for all controls
- Logical grouping of related options
- Obvious primary actions
- Clear visual hierarchy

**Simplicity**:
- Minimize user decision points
- Provide sensible defaults
- Hide advanced options until needed
- Progressive disclosure of features

### Layout Guidelines

**Extension UI Layout**:
```
┌─────────────────────┐
│  Header/Title       │  (24px height, 12px padding)
├─────────────────────┤
│                     │
│   Content Area      │  (scrollable, max 400px width)
│  (Flexible height)  │
│                     │
├─────────────────────┤
│ Action Buttons      │  (Primary: blue, Secondary: gray)
└─────────────────────┘
```

**Responsive Design**:
- Minimum width: 350px
- Maximum width: 400px (typical extension width)
- Handle long text with truncation or wrapping
- Touch-friendly controls (min 44px height)

### Color Palette

**Recommended Colors**:
```
Primary: #0066FF (Webflow blue)
Success: #2BAB47 (Green)
Warning: #FFA500 (Orange)
Error: #E74C3C (Red)
Neutral: #CCCCCC (Gray)
Background: #FFFFFF (White)
Text: #1A1A1A (Dark gray)
```

### Interaction Patterns

**Loading States**:
- Show spinner or skeleton during data fetch
- Disable interaction while loading
- Show error message after 5 seconds

**Confirmation Dialogs**:
- Use for destructive actions
- Clear action descriptions
- Prominent cancel/confirm buttons

**Feedback Messages**:
- Success: Green banner with checkmark
- Error: Red banner with icon
- Info: Blue banner with info icon
- Auto-dismiss after 4 seconds (except errors)

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

All applications must meet WCAG 2.1 Level AA standards:

#### 1. Keyboard Navigation

```typescript
// All controls must be keyboard accessible
<button
  aria-label="Delete item"
  onClick={handleDelete}
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDelete();
    }
  }}
>
  Delete
</button>
```

#### 2. Color Contrast

- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- Test with WebAIM contrast checker

#### 3. ARIA Labels

```typescript
<input
  type="text"
  id="siteName"
  aria-label="Site name"
  placeholder="Enter site name"
/>

<div role="alert" aria-live="polite">
  Validation error message
</div>
```

#### 4. Form Labels

```typescript
<label htmlFor="projectSelect">
  Select Project:
</label>
<select id="projectSelect" aria-required="true">
  <option>Choose a project</option>
</select>
```

#### 5. Focus Management

```typescript
useEffect(() => {
  // Announce updates to screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.textContent = `Updated: ${itemCount} items`;
  document.body.appendChild(announcer);

  return () => announcer.remove();
}, [itemCount]);
```

### Testing for Accessibility

- Use axe DevTools extension
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing
- Color contrast verification
- Focus indicator visibility

---

## Performance Standards

### Load Time Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |

### Optimization Techniques

#### 1. Code Splitting

```typescript
// Dynamic import for large features
const HeavyComponent = lazy(() =>
  import('./HeavyComponent')
);

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

#### 2. Caching Strategy

```typescript
// Cache API responses
const cache = new Map<string, CacheEntry>();

async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 5 * 60 * 1000 // 5 minutes
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

#### 3. Lazy Loading

```typescript
// Lazy load images in lists
<img
  src={imageSrc}
  loading="lazy"
  alt="Item preview"
/>

// Lazy load heavy content
<IntersectionObserver>
  {({ isVisible }) => (
    isVisible ? <ExpensiveComponent /> : <Placeholder />
  )}
</IntersectionObserver>
```

### Monitoring Performance

```typescript
// Implement performance monitoring
function trackPerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime =
      perfData.loadEventEnd - perfData.navigationStart;

    console.log(`Page load time: ${pageLoadTime}ms`);

    // Send to analytics
    if (window.gtag) {
      gtag('event', 'page_load', {
        'page_load_time': pageLoadTime
      });
    }
  }
}

window.addEventListener('load', trackPerformance);
```

---

## Security & Authentication

### OAuth 2.0 Implementation

**Authorization Code Flow** (recommended for web apps):

```typescript
// Step 1: Redirect user to Webflow authorization
function initiateAuth() {
  const params = new URLSearchParams({
    client_id: process.env.WEBFLOW_CLIENT_ID,
    redirect_uri: 'https://yourapp.com/callback',
    response_type: 'code',
    scope: 'sites:read sites:write collections:read'
  });

  window.location.href =
    `https://webflow.com/oauth/authorize?${params}`;
}

// Step 2: Handle callback and exchange code for token
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await fetch(
    'https://api.webflow.com/oauth/access_token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.WEBFLOW_CLIENT_ID,
        client_secret: process.env.WEBFLOW_CLIENT_SECRET,
        grant_type: 'authorization_code'
      })
    }
  );

  const { access_token, refresh_token } =
    await tokenResponse.json();

  // Store tokens securely (database, session, etc.)
  req.session.webflowToken = access_token;
  req.session.refreshToken = refresh_token;

  res.redirect('/dashboard');
});
```

### Secret Management

```bash
# Never hardcode secrets - use environment variables
WEBFLOW_API_KEY=xxx_actual_key_here
WEBFLOW_CLIENT_SECRET=xxx_actual_secret_here

# Use .env file (NOT in version control)
# Add to .gitignore:
# .env
# .env.local
# .env.*.local

# Use environment variable vault in production
# AWS Secrets Manager, HashiCorp Vault, etc.
```

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

### Input Validation

```typescript
// Validate all user inputs
import { z } from 'zod';

const createSiteSchema = z.object({
  name: z.string().min(1).max(100),
  customDomain: z.string().url().optional(),
  displayName: z.string().min(1).max(100)
});

app.post('/sites', (req, res) => {
  try {
    const data = createSiteSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

### Data Protection

- Use HTTPS for all connections
- Hash sensitive data (passwords, tokens)
- Implement rate limiting on API endpoints
- Log security events
- Implement CSRF protection
- Use secure session cookies (HttpOnly, Secure, SameSite)

---

## Marketplace Submission Process

### Preparation Checklist

- [ ] Application fully functional and tested
- [ ] Meets all technical requirements
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Performance verified (Lighthouse 90+)
- [ ] Security audit completed
- [ ] Documentation written
- [ ] Sample/demo account prepared
- [ ] Support plan established

### Submission Package Contents

```
submission-package/
├── README.md
│   ├── Clear description
│   ├── Feature list
│   ├── Setup instructions
│   ├── Support contact
│   └── Pricing model
├── screenshots/
│   ├── main-feature.png
│   ├── workflow.png
│   └── integration.png
├── video/ (optional)
│   └── demo.mp4
├── webflow.json
├── package.json
└── source-code/
    ├── (zipped source)
    └── license.txt
```

### Review Timeline

| Stage | Duration | Notes |
|-------|----------|-------|
| Initial Review | 3-5 days | Completeness check |
| Technical Review | 5-7 days | Functionality & security |
| UX Review | 3-5 days | Design & accessibility |
| Final Approval | 1-2 days | Publishing |

**Total Expected**: 2-3 weeks from submission to approval

### Marketplace Approval Criteria

**Mandatory Criteria**:
1. ✅ Works as described
2. ✅ Security best practices followed
3. ✅ No hardcoded secrets or credentials
4. ✅ Respects user data privacy
5. ✅ Proper error handling
6. ✅ Mobile responsive (extensions)
7. ✅ Documented API usage

**Preferred Criteria** (for featured placement):
1. ⭐ Exceptional UX design
2. ⭐ Performance optimized
3. ⭐ Regular updates/maintenance
4. ⭐ Active community support
5. ⭐ Unique or highly valuable functionality

### After Approval

- Listed in Webflow Marketplace
- Updates require re-submission for major versions
- Monthly marketplace reporting available
- User reviews and ratings
- Feature updates recommended quarterly

---

## Common Pitfalls & Solutions

### Pitfall 1: Ignoring CORS in Development

**Problem**: Works locally, breaks in production due to CORS.

**Solution**:
```typescript
// Setup proper CORS from the start
import cors from 'cors';

app.use(cors({
  origin: [
    'https://webflow.com',
    'https://editor.webflow.com',
    process.env.EXTENSION_ORIGIN
  ],
  credentials: true
}));
```

### Pitfall 2: Not Handling Token Expiration

**Problem**: Users experience random failures after 1 hour.

**Solution**:
```typescript
async function callWebflowAPI(endpoint: string) {
  let response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });

  // If token expired, refresh it
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${newToken}`
      }
    });
  }

  return response;
}
```

### Pitfall 3: Inefficient API Calls in Loops

**Problem**: Makes N API calls for N items, hitting rate limits.

**Solution**:
```typescript
// Bad: N API calls
for (const item of items) {
  const details = await fetch(`/api/item/${item.id}`);
}

// Good: Batch API calls
const ids = items.map(i => i.id).join(',');
const details = await fetch(`/api/items?ids=${ids}`);
```

### Pitfall 4: Exposing API Keys in Frontend Code

**Problem**: API key visible in client-side code, security risk.

**Solution**:
```typescript
// Bad: Don't do this
const API_KEY = 'xxx_actual_key_here';
fetch(`/api/data?key=${API_KEY}`);

// Good: Use backend proxy
// Frontend: calls your backend only
fetch('/api/data');

// Backend: includes API key securely
app.get('/api/data', (req, res) => {
  const result = await fetch('https://api.webflow.com/data', {
    headers: {
      'Authorization': `Bearer ${process.env.WEBFLOW_API_KEY}`
    }
  });
});
```

### Pitfall 5: Poor Error Handling and User Feedback

**Problem**: Users don't know why something failed.

**Solution**:
```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch: ${response.statusText}`,
      response.status
    );
  }
} catch (error) {
  // Show user-friendly message
  showError(
    error instanceof ApiError
      ? error.getUserMessage()
      : 'An unexpected error occurred'
  );

  // Log detailed error for debugging
  console.error('API error:', error);
}
```

---

## Best Practices Checklist

### Before Development Starts

- [ ] Define scope and target users
- [ ] Review Webflow API documentation
- [ ] Choose appropriate app type (Extension/DataClient/Hybrid)
- [ ] Plan authentication flow
- [ ] Design UI/UX mockups
- [ ] Identify external dependencies

### During Development

- [ ] Implement error handling from the start
- [ ] Write unit tests as you build
- [ ] Use TypeScript with strict mode
- [ ] Validate all user inputs
- [ ] Handle network failures gracefully
- [ ] Implement proper logging
- [ ] Use environment variables for config

### Before Testing

- [ ] Code review by peer
- [ ] Remove console.logs and debug code
- [ ] Verify API keys aren't in code
- [ ] Test on actual Webflow sites
- [ ] Test with different user roles/permissions
- [ ] Test on multiple browsers

### Before Submission

- [ ] Performance optimized (Lighthouse 90+)
- [ ] Accessibility audit passed
- [ ] Security review completed
- [ ] Documentation complete and tested
- [ ] All features working as described
- [ ] Support plan established
- [ ] Demo/tutorial video recorded (optional)

### After Launch

- [ ] Monitor error logs
- [ ] Respond to user feedback quickly
- [ ] Plan regular updates
- [ ] Monitor API changes
- [ ] Track performance metrics
- [ ] Gather usage analytics

---

## Resources & References

- [Webflow Developer Docs](https://developers.webflow.com/)
- [Webflow Designer API Reference](https://developers.webflow.com/api-reference/designer-api)
- [Webflow Data API Reference](https://developers.webflow.com/api-reference/data-api)
- [OAuth 2.0 Standards](https://tools.ietf.org/html/rfc6749)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals Documentation](https://web.dev/vitals/)

---

**Version**: 1.0
**Maintainer**: Webflow Community
**Last Reviewed**: November 23, 2025
**Status**: Active & Current
