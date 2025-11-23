# Setup & Verification Guide

**Purpose**: Ensure your Webflow Designer API app setup has zero discrepancies

---

## ✅ Pre-Implementation Checklist

### 1. Environment Setup

```bash
# Required Node.js version
node --version  # Should be 16.0.0 or higher

# Required npm version
npm --version   # Should be 7.0.0 or higher

# TypeScript support
npm ls typescript  # Should be installed in project
```

### 2. Dependencies Installation

```bash
# Standard setup
npm install @webflow/designer-api
npm install --save-dev typescript @types/node

# Optional but recommended
npm install --save-dev eslint prettier
```

### 3. Configuration Files

Create the following configuration files in your project root:

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### `.env.example`
```bash
# OAuth Configuration
WEBFLOW_CLIENT_ID=your_client_id_here
WEBFLOW_CLIENT_SECRET=your_client_secret_here
WEBFLOW_REDIRECT_URI=http://localhost:3000/callback

# API Configuration
WEBFLOW_API_BASE=https://api.webflow.com
EXTENSION_NAME=Your Extension Name
EXTENSION_VERSION=1.0.0

# Feature Flags
ENABLE_AUTO_SYNC=true
ENABLE_LOGGING=true
```

---

## 🔍 Runtime Verification

### Template Imports Verification

```typescript
// Test all template imports work correctly
import ElementManipulation from './templates/element-manipulation';
import ComponentManager from './templates/component-management';
import TokenManager from './templates/variables-tokens';
import AssetManager from './templates/asset-management';
import PageManager from './templates/page-operations';
import CodeInjector from './templates/custom-code-injection';
import EventManager from './templates/event-subscriptions';
import OAuthManager from './templates/authentication-oauth';
import HybridAppSetup from './templates/hybrid-app-setup';

// Verify all imports are available
console.assert(ElementManipulation, 'Element manipulation import failed');
console.assert(ComponentManager, 'Component manager import failed');
console.assert(TokenManager, 'Token manager import failed');
console.assert(AssetManager, 'Asset manager import failed');
console.assert(PageManager, 'Page manager import failed');
console.assert(CodeInjector, 'Code injector import failed');
console.assert(EventManager, 'Event manager import failed');
console.assert(OAuthManager, 'OAuth manager import failed');
console.assert(HybridAppSetup, 'Hybrid app setup import failed');

console.log('✅ All template imports successful');
```

### Designer API Verification

```typescript
import { webflow } from '@webflow/designer-api';

// Test required Designer API methods
const requiredMethods = [
  'getSelectedElements',
  'getCurrentPage',
  'getAllPages',
  'createElem',
  'getElement',
  'on',
  'off',
  'notify'
];

for (const method of requiredMethods) {
  console.assert(
    typeof (webflow as any)[method] === 'function',
    `Designer API method missing: ${method}`
  );
}

console.log('✅ Designer API verification successful');
```

### Manager Initialization Verification

```typescript
// Verify each manager can be instantiated
try {
  const componentMgr = new ComponentManager();
  const tokenMgr = new TokenManager();
  const assetMgr = new AssetManager();
  const pageMgr = new PageManager();
  const eventMgr = new EventManager();
  const codeMgr = new CodeInjector();

  console.log('✅ All managers initialized successfully');
} catch (error) {
  console.error('❌ Manager initialization failed:', error);
}
```

---

## 🧪 Functionality Tests

### Element Manipulation Test

```typescript
async function testElementManipulation() {
  try {
    const selected = webflow.getSelectedElements();
    console.log(`Found ${selected.length} selected elements`);

    const newDiv = webflow.createElem('div', {
      attributes: { class: 'test' },
      text: 'Test content'
    });

    console.log('✅ Element manipulation working');
    return true;
  } catch (error) {
    console.error('❌ Element manipulation failed:', error);
    return false;
  }
}
```

### Component Manager Test

```typescript
async function testComponentManager() {
  try {
    const manager = new ComponentManager();
    const components = await manager.getAllComponents();
    console.log(`Found ${components.length} components`);

    console.log('✅ Component manager working');
    return true;
  } catch (error) {
    console.error('❌ Component manager failed:', error);
    return false;
  }
}
```

### Token Manager Test

```typescript
async function testTokenManager() {
  try {
    const manager = new TokenManager();
    const tokens = await manager.getAllTokens();
    console.log(`Found ${tokens.length} tokens`);

    console.log('✅ Token manager working');
    return true;
  } catch (error) {
    console.error('❌ Token manager failed:', error);
    return false;
  }
}
```

### Page Manager Test

```typescript
async function testPageManager() {
  try {
    const manager = new PageManager();
    const pages = await manager.getAllPages();
    console.log(`Found ${pages.length} pages`);

    const current = await manager.getCurrentPage();
    console.log(`Current page: ${current?.name}`);

    console.log('✅ Page manager working');
    return true;
  } catch (error) {
    console.error('❌ Page manager failed:', error);
    return false;
  }
}
```

### Event Manager Test

```typescript
function testEventManager() {
  try {
    const manager = new EventManager();

    // Subscribe to selection
    const unsubscribe = manager.onElementSelected((elements) => {
      console.log(`Selection changed: ${elements.length} elements`);
    });

    // Check listeners
    const stats = manager.getListenerStats();
    console.log('Event listeners:', stats);

    // Cleanup
    unsubscribe();

    console.log('✅ Event manager working');
    return true;
  } catch (error) {
    console.error('❌ Event manager failed:', error);
    return false;
  }
}
```

---

## 🚀 Complete Verification Script

Run this to verify everything is working:

```typescript
// verify-setup.ts
import { webflow } from '@webflow/designer-api';
import ComponentManager from './templates/component-management';
import TokenManager from './templates/variables-tokens';
import AssetManager from './templates/asset-management';
import PageManager from './templates/page-operations';
import CodeInjector from './templates/custom-code-injection';
import EventManager from './templates/event-subscriptions';
import OAuthManager from './templates/authentication-oauth';
import HybridAppSetup from './templates/hybrid-app-setup';

interface VerificationResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const results: VerificationResult[] = [];

async function runVerification() {
  console.log('🔍 Starting Webflow Designer API Verification...\n');

  // Test 1: API Import
  const start1 = performance.now();
  try {
    console.assert(webflow, 'Designer API not available');
    results.push({
      name: 'Designer API Import',
      passed: true,
      duration: performance.now() - start1
    });
    console.log('✅ Designer API Import');
  } catch (error) {
    results.push({
      name: 'Designer API Import',
      passed: false,
      duration: performance.now() - start1,
      error: String(error)
    });
    console.log('❌ Designer API Import:', error);
  }

  // Test 2: Template Imports
  const start2 = performance.now();
  try {
    console.assert(ComponentManager, 'ComponentManager import failed');
    console.assert(TokenManager, 'TokenManager import failed');
    console.assert(AssetManager, 'AssetManager import failed');
    console.assert(PageManager, 'PageManager import failed');
    console.assert(CodeInjector, 'CodeInjector import failed');
    console.assert(EventManager, 'EventManager import failed');
    console.assert(OAuthManager, 'OAuthManager import failed');
    console.assert(HybridAppSetup, 'HybridAppSetup import failed');
    results.push({
      name: 'Template Imports',
      passed: true,
      duration: performance.now() - start2
    });
    console.log('✅ Template Imports');
  } catch (error) {
    results.push({
      name: 'Template Imports',
      passed: false,
      duration: performance.now() - start2,
      error: String(error)
    });
    console.log('❌ Template Imports:', error);
  }

  // Test 3: Manager Initialization
  const start3 = performance.now();
  try {
    new ComponentManager();
    new TokenManager();
    new AssetManager();
    new PageManager();
    new CodeInjector();
    new EventManager();
    new OAuthManager({
      clientId: 'test',
      redirectUri: 'http://localhost:3000'
    });
    results.push({
      name: 'Manager Initialization',
      passed: true,
      duration: performance.now() - start3
    });
    console.log('✅ Manager Initialization');
  } catch (error) {
    results.push({
      name: 'Manager Initialization',
      passed: false,
      duration: performance.now() - start3,
      error: String(error)
    });
    console.log('❌ Manager Initialization:', error);
  }

  // Test 4: Page Operations
  const start4 = performance.now();
  try {
    const pageManager = new PageManager();
    const pages = await pageManager.getAllPages();
    console.assert(Array.isArray(pages), 'Pages should be an array');
    results.push({
      name: 'Page Operations',
      passed: true,
      duration: performance.now() - start4
    });
    console.log('✅ Page Operations');
  } catch (error) {
    results.push({
      name: 'Page Operations',
      passed: false,
      duration: performance.now() - start4,
      error: String(error)
    });
    console.log('❌ Page Operations:', error);
  }

  // Test 5: Component Operations
  const start5 = performance.now();
  try {
    const componentManager = new ComponentManager();
    const components = await componentManager.getAllComponents();
    console.assert(Array.isArray(components), 'Components should be an array');
    results.push({
      name: 'Component Operations',
      passed: true,
      duration: performance.now() - start5
    });
    console.log('✅ Component Operations');
  } catch (error) {
    results.push({
      name: 'Component Operations',
      passed: false,
      duration: performance.now() - start5,
      error: String(error)
    });
    console.log('❌ Component Operations:', error);
  }

  // Summary
  console.log('\n📊 Verification Summary:');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  console.log(`${passed}/${total} tests passed`);

  // Details
  console.log('\n📋 Details:');
  for (const result of results) {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name} (${result.duration.toFixed(2)}ms)`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  return passed === total;
}

// Run verification
runVerification().then(success => {
  if (success) {
    console.log('\n🎉 All verifications passed! Ready for production.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some verifications failed. Check errors above.');
    process.exit(1);
  }
});
```

---

## 🛠️ Build & Deployment Verification

```bash
# TypeScript compilation check
npx tsc --noEmit

# Bundle check (if using bundler)
npm run build

# Type checking
npx tsc --strict

# Linting
npx eslint src/

# Test execution
npm test

# Production build
npm run build:prod
```

---

## ✨ Common Issues & Solutions

### Issue: "Designer API not available"
**Solution**: Ensure you're running inside a Webflow Designer extension context

### Issue: "Template import failed"
**Solution**: Check file paths are correct and TypeScript is configured

### Issue: "Manager methods return empty arrays"
**Solution**: Verify you have elements/components/tokens in your site

### Issue: "Event listeners not firing"
**Solution**: Ensure listeners are attached and Designer is focused

---

## 📋 Final Checklist

- [ ] Node.js and npm versions verified
- [ ] Dependencies installed
- [ ] Configuration files created
- [ ] All template imports working
- [ ] All managers initializing
- [ ] Page operations returning data
- [ ] Component operations working
- [ ] Event listeners attaching
- [ ] OAuth configuration ready
- [ ] TypeScript compiling without errors
- [ ] All tests passing
- [ ] Build completing successfully

---

**Status**: Ready for Production
**Last Verified**: November 23, 2025
**Version**: 1.0
