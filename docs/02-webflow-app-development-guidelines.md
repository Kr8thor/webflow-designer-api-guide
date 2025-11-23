# Document 2: Webflow App Development Guidelines

**Status**: ✅ COMPLETE - Ready for Development

A comprehensive guide to building production-ready Webflow apps with technical standards, architectural patterns, and marketplace submission requirements.

---

## Table of Contents

1. [App Types & Architecture](#app-types--architecture)
2. [Technical Requirements](#technical-requirements)
3. [Development Environment Setup](#development-environment-setup)
4. [Design & UX Guidelines](#design--ux-guidelines)
5. [Security & Performance Standards](#security--performance-standards)
6. [Testing & Quality Assurance](#testing--quality-assurance)
7. [Marketplace Submission Process](#marketplace-submission-process)
8. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)

---

## App Types & Architecture

### 1. Designer Extensions

**What They Are**: Applications that run within the Webflow Designer, providing UI panels and accessing the Designer API to manipulate designs in real-time.

**Key Characteristics**:
- Access to Designer API for canvas manipulation
- Real-time feedback to designer actions
- Custom UI panels in the designer sidebar
- Direct element, component, and style management

**Best For**:
- Design tools (icon libraries, shadow presets, etc.)
- Automation extensions (bulk operations, asset management)
- Integration tools (connecting external services)
- Productivity tools (page analyzers, design system managers)

**Advantages**:
- Direct canvas access
- Real-time updates
- Seamless designer workflow integration
- No authentication complexity for single-workspace use

**Limitations**:
- Limited to Webflow Designer environment
- No data persistence beyond design file
- Requires Webflow Designer (not available in Editor)

---

### 2. Data Client Apps

**What They Are**: Server-side applications that use Webflow's Data APIs to read/write site data, CMS collections, and user information.

**Key Characteristics**:
- OAuth 2.0 authentication required
- Access to REST APIs for data operations
- Long-lived credentials
- Can operate independently of Designer

**Best For**:
- CMS integrations (bulk imports/exports)
- Data synchronization tools
- Analytics and reporting
- Backup and migration tools
- Automation workflows

**Advantages**:
- Works across platforms (web, mobile, desktop)
- Data persistence
- Scheduled operations
- Multi-user/team support
- External integrations

**Limitations**:
- OAuth flow complexity
- No real-time canvas access
- Requires backend infrastructure
- OAuth setup for each user

---

### 3. Hybrid Apps

**What They Are**: Combination of Designer Extension and Data Client, leveraging both Designer API and Data APIs.

**Key Characteristics**:
- Runs in Designer for real-time canvas updates
- Optional backend for data operations
- Combines both API capabilities
- More complex architecture

**Best For**:
- Complex design + data workflows
- Apps requiring both canvas manipulation and data management
- Enterprise solutions with multiple components

**Advantages**:
- Maximum flexibility
- Can do real-time design and data operations
- Enterprise-grade capabilities

**Limitations**:
- Complex development and deployment
- More moving parts to maintain
- Harder to test and debug

---

## Technical Requirements

### Core Requirements (All App Types)

#### 1. TypeScript/JavaScript Stack
```
Required:
- TypeScript or modern JavaScript (ES2020+)
- Node.js 16 or higher for build process
- Vite as bundler (recommended)
- React recommended for UI (but not required)

Supported:
- Vue.js, Svelte, or vanilla JS frameworks
- Any transpiler that produces ES2020+ output
```

#### 2. Project Structure
```
your-webflow-app/
├── src/
│   ├── index.ts           # Entry point
│   ├── components/        # Reusable components
│   ├── utils/            # Helper functions
│   └── styles/           # CSS/SCSS
├── public/               # Static assets
├── webflow.json          # App manifest
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite configuration
└── README.md             # Documentation
```

#### 3. webflow.json Manifest
```json
{
  "name": "App Name",
  "version": "1.0.0",
  "description": "App description",
  "designExtension": {
    "entrypoint": "src/index.ts",
    "allowedScopes": ["designer:write"]
  }
}
```

### Designer Extension Requirements

#### 1. UI/UX Standards
- Maximum sidebar width: 400px
- Minimum sidebar width: 250px
- Follow Webflow design patterns
- Responsive to collapsed sidebar
- Support light and dark themes
- Accessible keyboard navigation (WCAG 2.1 AA)

#### 2. Performance Standards
- Initial load: < 2 seconds
- Interaction response: < 100ms
- Memory footprint: < 50MB
- Bundle size: < 1MB (gzipped)
- No memory leaks on long sessions

#### 3. API Usage Constraints
- Batch operations in chunks (max 50-100 elements)
- Use event debouncing for frequent operations
- Cache API responses where possible
- Implement rate limiting awareness

### Data Client Requirements

#### 1. Authentication
- OAuth 2.0 flow compliant
- Secure token storage
- Token refresh handling
- Session management

#### 2. API Usage
- Implement exponential backoff for retries
- Rate limit compliance (API quotas)
- Proper error handling for all endpoints
- Timeout handling for long-running operations

#### 3. Data Handling
- Validation of all user inputs
- Secure storage of sensitive data
- Encryption for data in transit
- GDPR compliance considerations

---

## Development Environment Setup

### 1. Webflow CLI Installation

```bash
# Install globally (recommended)
npm install -g @webflow/webflow-cli

# Or use with npx
npx @webflow/webflow-cli@latest

# Verify installation
webflow --version
```

### 2. Project Initialization

```bash
# Create new Designer Extension
webflow init --type=designer-extension my-extension

# Or create Data Client app
webflow init --type=data-client my-app
```

### 3. Development Server

```bash
# Start development with hot reload
webflow dev

# The CLI will provide:
# - Local dev URL (e.g., http://localhost:3000)
# - Webflow Designer preview link
# - Hot module replacement
```

### 4. Building for Production

```bash
# Build optimized bundle
webflow build

# Outputs to:
# - dist/index.js (main bundle)
# - dist/index.css (if CSS present)
```

### 5. TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### 6. Vite Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
})
```

---

## Design & UX Guidelines

### 1. Consistency with Webflow

**Design Patterns**:
- Follow Webflow's design system
- Use familiar component patterns
- Maintain Webflow's interaction model
- Support Webflow's color schemes

**Examples**:
- Use Webflow's primary blue for actions
- Match Webflow's button styles
- Use consistent spacing (8px grid)
- Follow Webflow's typography scale

### 2. UX Best Practices

#### Information Architecture
- Logical grouping of features
- Clear primary/secondary actions
- Progressive disclosure for advanced options
- Breadcrumbs for navigation paths

#### Interaction Patterns
- Consistent button placement
- Predictable form behaviors
- Clear error messages
- Confirmation for destructive actions
- Undo/redo support where applicable

#### Feedback Mechanisms
- Loading states (spinners, progress bars)
- Success notifications
- Error notifications with actionable help
- Toast notifications for non-blocking messages
- Inline validation feedback

### 3. Accessibility Standards

**WCAG 2.1 AA Compliance Required**:

#### Color & Contrast
- 4.5:1 contrast for normal text
- 3:1 contrast for large text (18pt+)
- Don't rely on color alone for meaning
- Support high contrast mode

#### Keyboard Navigation
- All interactive elements focusable with Tab
- Focus indicators visible
- No keyboard traps
- Logical tab order
- Support for common shortcuts (Esc, Enter, etc.)

#### Screen Readers
- Semantic HTML structure
- ARIA labels for unlabeled controls
- Announce dynamic content changes
- Form labels associated with inputs
- Alt text for meaningful images

#### Motion & Animation
- Respect prefers-reduced-motion
- No auto-playing videos
- Meaningful animations only
- Avoid seizure-inducing patterns (< 3 flashes/sec)

### 4. Responsive Design

**Breakpoints to Test**:
- Desktop: 1920px, 1440px, 1280px
- Tablet: 768px, 1024px
- Mobile: 375px, 414px

**Sidebar Responsive**:
- Full: 400px width
- Collapsed: 250px width
- Ensure usability at both sizes

---

## Security & Performance Standards

### Security Requirements

#### 1. Authentication & Authorization
```typescript
// OAuth token management
class TokenManager {
  private token: string
  private refreshToken: string
  private expiresAt: number

  isExpired(): boolean {
    return Date.now() > this.expiresAt
  }

  async refreshIfNeeded(): Promise<string> {
    if (this.isExpired()) {
      const newToken = await this.refresh()
      this.updateToken(newToken)
    }
    return this.token
  }
}
```

#### 2. Data Protection
- Never store sensitive data in localStorage
- Use secure cookies (HttpOnly, Secure flags)
- Encrypt data in transit (HTTPS only)
- Encrypt sensitive data at rest
- Implement access controls

#### 3. Input Validation
```typescript
// Validate all user inputs
function validateInput(input: unknown): void {
  // Type check
  if (typeof input !== 'string') {
    throw new Error('Invalid input type')
  }

  // Length check
  if (input.length > 1000) {
    throw new Error('Input exceeds maximum length')
  }

  // Content validation
  if (!isValidPattern(input)) {
    throw new Error('Invalid input format')
  }
}
```

#### 4. API Security
- Validate API responses
- Implement CORS properly
- Use security headers
- Rate limiting
- Request signing where applicable

#### 5. Code Security
- No hardcoded secrets
- Use environment variables
- Dependency scanning
- Code review before deployment
- Keep dependencies updated

### Performance Standards

#### 1. Bundle Size Optimization
```bash
# Check bundle size
npm run build

# Expected targets:
# - Designer Extension: < 1MB gzipped
# - Data Client: < 2MB gzipped
```

#### 2. Code Splitting Strategy
```typescript
// Only load code when needed
const HeavyComponent = lazy(() => import('./components/Heavy'))

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

#### 3. Memory Management
```typescript
// Clean up event listeners
useEffect(() => {
  const handler = () => {}
  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])

// Clean up timers
useEffect(() => {
  const timer = setTimeout(() => {}, 1000)
  return () => clearTimeout(timer)
}, [])
```

#### 4. API Call Optimization
```typescript
// Debounce frequent API calls
const debouncedSearch = debounce(async (query: string) => {
  const results = await searchAPI(query)
  setResults(results)
}, 300)

// Batch operations
async function batchUpdate(items: Item[]): Promise<void> {
  const chunks = chunk(items, 50)
  for (const batch of chunks) {
    await updateBatch(batch)
  }
}
```

#### 5. Caching Strategy
```typescript
// Cache API responses
class CacheManager {
  private cache = new Map<string, { data: unknown; expires: number }>()

  get(key: string): unknown | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }

  set(key: string, data: unknown, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    })
  }
}
```

---

## Testing & Quality Assurance

### 1. Unit Testing

```typescript
// Example with Vitest/Jest
describe('ElementManager', () => {
  test('should create element with correct properties', () => {
    const manager = new ElementManager()
    const element = manager.createElement({
      tag: 'div',
      className: 'test'
    })

    expect(element.tag).toBe('div')
    expect(element.className).toBe('test')
  })

  test('should handle errors gracefully', () => {
    const manager = new ElementManager()
    expect(() => {
      manager.createElement(null)
    }).toThrow('Invalid element config')
  })
})
```

### 2. Integration Testing

```typescript
// Test with Webflow API
describe('Designer Extension Integration', () => {
  test('should sync canvas changes', async () => {
    const element = await getSelectedElement()
    const updated = await updateElement(element, { text: 'New' })
    expect(updated.text).toBe('New')
  })
})
```

### 3. E2E Testing

```typescript
// Example with Playwright
test('should allow user to build a page', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('[data-testid="add-section"]')
  await page.fill('[data-testid="section-name"]', 'Hero')
  await page.click('[data-testid="save-button"]')

  const section = await page.locator('[data-testid="section-hero"]')
  expect(await section.isVisible()).toBe(true)
})
```

### 4. Performance Testing

```typescript
// Monitor performance metrics
function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const duration = performance.now() - start

  console.log(`${name}: ${duration.toFixed(2)}ms`)

  if (duration > THRESHOLD) {
    console.warn(`Performance warning: ${name} took too long`)
  }
}
```

### 5. Quality Checklist

Before shipping:
- [ ] All tests passing
- [ ] TypeScript compiling without errors
- [ ] ESLint/Prettier passing
- [ ] Bundle size within limits
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Security scan completed
- [ ] Documentation complete
- [ ] Error handling implemented
- [ ] No console errors/warnings

---

## Marketplace Submission Process

### 1. Pre-Submission Preparation

#### App Readiness Checklist
- [ ] App is fully functional and tested
- [ ] Documentation is complete and accurate
- [ ] Privacy policy available
- [ ] Terms of service (if applicable)
- [ ] No hardcoded secrets in code
- [ ] Performance meets standards
- [ ] Accessibility compliant
- [ ] Error messages user-friendly

#### Demo Account Requirement
- Create test Webflow account for reviewers
- Provide login credentials in submission
- Set up demo workspace with sample content
- Document expected behavior

#### Submission Assets Required
- **App Icon**: 512x512 PNG, transparent background
- **Screenshots**: 3-5 images showing key features
- **Demo Video**: 1-2 minute screencast (optional but recommended)
- **Description**: 200-300 words explaining value
- **Detailed Instructions**: Step-by-step usage guide
- **Support Contact**: Email for user questions

### 2. Submission Steps

#### Step 1: Create App Listing
1. Navigate to Webflow Dashboard → Apps
2. Click "Submit Your App"
3. Select app type (Designer Extension or Data Client)
4. Fill in basic information

#### Step 2: Upload Files
```bash
# Build production bundle
webflow build

# Bundle includes:
# - dist/index.js
# - dist/index.css (if applicable)
```

Upload built files to app listing.

#### Step 3: Configure Details
- App name and slug
- Category selection
- Target audience
- Pricing model (free/paid)
- Support URL
- Privacy policy URL

#### Step 4: Add Assets
- Upload icon
- Add screenshots in order
- Add video URL (optional)
- Add description

#### Step 5: Set Permissions
For Designer Extensions:
```json
{
  "designer:write": "Required for canvas manipulation",
  "designer:read": "Required to read design data"
}
```

#### Step 6: Submit for Review
- Final verification of all content
- Accept Webflow terms
- Submit for review

### 3. Review Timeline

**Designer Extensions**: 3-7 business days
**Data Client Apps**: 7-14 business days

**Review Criteria**:
- Functionality works as described
- No security vulnerabilities
- Performance acceptable
- Accessibility compliant
- User experience intuitive
- Documentation adequate

### 4. After Approval

#### Post-Approval Steps
1. App becomes available in Webflow Apps Marketplace
2. Marketing support (featured listings possible)
3. Analytics dashboard access
4. User feedback and ratings
5. Update schedule and version management

#### Ongoing Maintenance
```bash
# Release new version
webflow build --version=1.1.0

# Increment version in package.json
# Submit update through dashboard
# Goes through review again (usually 2-3 days)
```

#### User Support
- Monitor user feedback and ratings
- Respond to support inquiries
- Fix reported bugs quickly
- Regular updates (monthly minimum recommended)
- Security patches as needed

---

## Common Pitfalls to Avoid

### 1. Design & UX Mistakes

❌ **Don't**:
- Ignore Webflow design patterns
- Make sidebar too wide
- Have no loading states
- Forget about dark mode
- Ignore mobile responsiveness

✅ **Do**:
- Follow Webflow's design language
- Respect sidebar width constraints
- Show clear loading indicators
- Support light and dark themes
- Test on mobile devices

### 2. Performance Issues

❌ **Don't**:
- Manipulate hundreds of elements synchronously
- Load large dependencies unnecessarily
- Keep old event listeners active
- Cache data indefinitely
- Ignore bundle size

✅ **Do**:
- Batch element operations
- Use tree-shaking for dependencies
- Clean up event listeners
- Implement cache expiration
- Monitor bundle size

### 3. Security Mistakes

❌ **Don't**:
- Store tokens in localStorage
- Hardcode API keys
- Skip input validation
- Trust API responses blindly
- Expose secrets in error messages

✅ **Do**:
- Use secure storage for tokens
- Use environment variables
- Validate all inputs
- Validate API responses
- Generic error messages to users

### 4. API Misuse

❌ **Don't**:
- Call API in tight loops
- Ignore rate limits
- Fire API calls on every keystroke
- Assume operations complete instantly
- Ignore error responses

✅ **Do**:
- Debounce/throttle API calls
- Respect rate limits
- Debounce user input
- Implement proper error handling
- Log all API issues

### 5. Developer Experience

❌ **Don't**:
- Provide no documentation
- Make setup complicated
- Skip error messages
- Hard to debug
- No examples

✅ **Do**:
- Provide comprehensive docs
- Make setup easy (use CLI)
- Show helpful error messages
- Add debug logging
- Include code examples

### 6. Testing Gaps

❌ **Don't**:
- Test only happy path
- No error case testing
- Skip accessibility testing
- No performance testing
- Manual testing only

✅ **Do**:
- Test happy and sad paths
- Test all error cases
- Automated accessibility testing
- Performance benchmarks
- Automated + manual testing

---

## Success Patterns

### What Successful Apps Have in Common

1. **Clear Value Proposition**
   - Solves a real pain point
   - Easy to understand benefit
   - Quick time-to-value

2. **Native-Feeling Integration**
   - Follows Webflow patterns
   - Seamless workflow integration
   - Consistent UX

3. **Excellent Performance**
   - Fast load times
   - Responsive interactions
   - Efficient API usage

4. **Great Documentation**
   - Clear getting started guide
   - Helpful examples
   - Good troubleshooting

5. **Active Maintenance**
   - Bug fixes in days, not weeks
   - Regular feature updates
   - Security patches immediately
   - Responsive user support

---

## Resources & References

- [Official Webflow API Docs](https://developers.webflow.com/designer/reference/introduction)
- [Webflow CLI Guide](https://www.npmjs.com/package/@webflow/webflow-cli)
- [Designer API Playground](https://www.webflow.com/playground/webflow-api)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance Best Practices](https://web.dev/performance/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: November 23, 2025
**Status**: Ready for Development
**Next Document**: [Document 3: Designer API Research](./03-designer-api-research.md)
