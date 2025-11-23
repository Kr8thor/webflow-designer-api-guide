# Designer API Security Guide

**Status**: Complete
**Last Updated**: November 23, 2025
**Purpose**: Secure extension development

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Input Validation](#input-validation)
3. [Data Protection](#data-protection)
4. [XSS Prevention](#xss-prevention)
5. [CSRF Protection](#csrf-protection)
6. [Secrets Management](#secrets-management)
7. [Compliance](#compliance)
8. [Security Checklist](#security-checklist)

---

## Authentication & Authorization

### OAuth 2.0 Implementation

**Secure pattern**:

```typescript
interface OAuthConfig {
  clientId: string;
  clientSecret: string; // Never expose in frontend
  redirectUri: string;
  scope: string[];
}

class SecureOAuthManager {
  private clientSecret: string; // Backend only

  // Generate secure state token
  generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte =>
      ('0' + byte.toString(16)).slice(-2)
    ).join('');
  }

  // Verify state to prevent CSRF
  verifyState(state: string, storedState: string): boolean {
    // Use constant-time comparison
    return crypto.subtle.compare(
      new TextEncoder().encode(state),
      new TextEncoder().encode(storedState)
    );
  }

  // Token exchange (backend only)
  async exchangeCodeForToken(code: string): Promise<AccessToken> {
    // Secret NEVER sent to frontend
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        clientId: this.config.clientId,
        clientSecret: this.clientSecret // Backend only!
      })
    });

    return response.json();
  }
}
```

### Token Storage

**Secure approach**:

```typescript
// ❌ UNSAFE: Never store in localStorage
localStorage.setItem('accessToken', token); // Vulnerable to XSS

// ✅ SAFER: Use httpOnly cookies (server set)
// Set-Cookie: accessToken=...; httpOnly; Secure; SameSite=Strict

// ✅ SAFER: Memory storage (cleared on reload)
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    // Cleared when page unloads
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}
```

### Token Expiration

```typescript
interface TokenInfo {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

class TokenLifecycleManager {
  private expirationTimer: NodeJS.Timeout | null = null;

  setTokens(info: TokenInfo) {
    // Refresh 1 minute before expiry
    const refreshTime = (info.expiresIn - 60) * 1000;

    this.expirationTimer = setTimeout(
      () => this.refreshToken(),
      refreshTime
    );
  }

  private async refreshToken() {
    try {
      const newToken = await this.backend.refreshAccessToken();
      this.setTokens(newToken);
    } catch (error) {
      console.error('Token refresh failed, reauthenticate');
      this.logout();
    }
  }

  cleanup() {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
  }
}
```

---

## Input Validation

### Attribute Validation

```typescript
class AttributeValidator {
  // Whitelist safe attributes
  private whitelist = {
    'class': /^[a-zA-Z0-9\s\-_]+$/,
    'id': /^[a-zA-Z0-9\-_]+$/,
    'data-': /^[a-zA-Z0-9\-_:]+$/,
    'aria-': /^[a-zA-Z0-9\-_:]+$/
  };

  validateAttribute(name: string, value: any): boolean {
    // Reject null/undefined
    if (!name || !value) return false;

    // Check type
    if (typeof value !== 'string') return false;

    // Check length
    if (value.length > 1000) return false;

    // Check against whitelist
    for (const [pattern, regex] of Object.entries(this.whitelist)) {
      if (name.startsWith(pattern)) {
        return regex.test(value);
      }
    }

    return false;
  }

  sanitizeAttribute(value: string): string {
    // Remove potentially harmful characters
    return value
      .replace(/<script[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}

// Usage
const validator = new AttributeValidator();

if (validator.validateAttribute('data-item-id', userInput)) {
  const safe = validator.sanitizeAttribute(userInput);
  element.setAttributes({ 'data-item-id': safe });
} else {
  webflow.notify.error('Invalid attribute value');
}
```

### Style Validation

```typescript
class StyleValidator {
  // Blacklist dangerous CSS
  private blacklist = [
    'expression',
    'javascript:',
    'behavior',
    '-moz-binding',
    'url('
  ];

  validateStyle(property: string, value: string): boolean {
    // Check property is real CSS
    const validProperties = [
      'color', 'background-color', 'padding', 'margin',
      'font-size', 'border-radius', 'opacity'
    ];

    if (!validProperties.includes(property)) {
      return false;
    }

    // Check value doesn't contain dangerous content
    const lowerValue = value.toLowerCase();
    for (const dangerous of this.blacklist) {
      if (lowerValue.includes(dangerous)) {
        return false;
      }
    }

    return true;
  }
}

// Usage
const styleValidator = new StyleValidator();

if (styleValidator.validateStyle('color', userColor)) {
  element.setInlineStyle('color', userColor);
}
```

---

## Data Protection

### Encryption

```typescript
class DataEncryption {
  // Use built-in crypto API
  async encrypt(data: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data_bytes = encoder.encode(data);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key from password
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: iv,
        iterations: 100000,
        hash: 'SHA-256'
      },
      await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      ),
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data_bytes
    );

    // Return IV + encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...result));
  }
}
```

### Data Minimization

```typescript
// ❌ Bad: Collect unnecessary data
async function updateElement(element, {
  name, email, phone, ssn, creditCard
}) {
  element.setAttributes({
    'data-name': name,
    'data-email': email,
    'data-phone': phone,
    'data-ssn': ssn,        // NEVER store this
    'data-card': creditCard  // NEVER store this
  });
}

// ✅ Good: Only essential data
async function updateElement(element, {
  name, email
}) {
  element.setAttributes({
    'data-name': name,
    'data-email': email
    // Only what's needed
  });
}
```

---

## XSS Prevention

### Safe HTML Injection

```typescript
// ❌ DANGEROUS: Never use innerHTML with user input
element.innerHTML = userInput; // XSS vulnerability

// ✅ SAFE: Use proper DOM methods
function setElementContent(element, text) {
  // If content is text only
  element.setText(text); // Uses textContent internally

  // If HTML is needed, sanitize first
  const sanitized = sanitizeHTML(text);
  element.setAttributes({
    innerHTML: sanitized
  });
}

// Sanitization
function sanitizeHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script tags
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Remove dangerous attributes
  const dangerous = ['onclick', 'onerror', 'onload'];
  doc.querySelectorAll('*').forEach(el => {
    dangerous.forEach(attr => el.removeAttribute(attr));
  });

  return doc.body.innerHTML;
}
```

### Template Safety

```typescript
// ❌ DANGEROUS: String concatenation
const html = `<div onclick="${userCode}">Click</div>`; // XSS

// ✅ SAFE: Proper escaping
function escapeHtml(text: string): string {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m as keyof typeof map]);
}

const safe = escapeHtml(userInput);
const html = `<div title="${safe}">Click</div>`; // Safe
```

---

## CSRF Protection

### State Token Validation

```typescript
class CSRFProtection {
  // Generate token
  generateToken(): string {
    return crypto.randomUUID();
  }

  // Store in session/memory
  private storedToken: string = '';

  setToken(token: string) {
    this.storedToken = token;
  }

  // Verify on form submission
  verifyToken(submittedToken: string): boolean {
    return submittedToken === this.storedToken;
  }
}

// Usage
const csrf = new CSRFProtection();
const token = csrf.generateToken();
csrf.setToken(token);

// On form submission
form.addEventListener('submit', (e) => {
  if (!csrf.verifyToken(formData.csrfToken)) {
    e.preventDefault();
    webflow.notify.error('Invalid request');
    return;
  }

  // Proceed with submission
});
```

---

## Secrets Management

### Environment Variables

```typescript
// ❌ WRONG: Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';

// ✅ CORRECT: Use environment variables
const API_KEY = process.env.WEBFLOW_API_KEY;

// .env.example (no actual secrets)
WEBFLOW_API_BASE=https://api.webflow.com
WEBFLOW_CLIENT_ID=your_client_id_here
ENABLE_DEBUG=false

// .env (in .gitignore)
WEBFLOW_API_KEY=sk_live_xxxxxxxxxxxxx
WEBFLOW_CLIENT_SECRET=sk_live_yyyyyyyyyyyyy
```

### Config Management

```typescript
class ConfigManager {
  private config: Record<string, any> = {};

  loadConfig() {
    // Load from environment
    this.config = {
      apiBase: process.env.API_BASE,
      clientId: process.env.CLIENT_ID,
      isDev: process.env.NODE_ENV === 'development'
    };

    // Validate required values
    if (!this.config.clientId) {
      throw new Error('CLIENT_ID not configured');
    }
  }

  get(key: string, defaultValue?: any) {
    return this.config[key] ?? defaultValue;
  }

  // Never expose secrets
  sanitize() {
    return {
      apiBase: this.config.apiBase,
      isDev: this.config.isDev
      // Exclude clientSecret, apiKey, etc.
    };
  }
}
```

---

## Compliance

### GDPR

- [ ] User consent before data collection
- [ ] Right to data access documented
- [ ] Right to deletion implemented
- [ ] Data retention policy set
- [ ] Privacy policy linked
- [ ] Data processing agreement in place

### CCPA

- [ ] Privacy policy discloses data practices
- [ ] Opt-out mechanism provided
- [ ] No sale of personal data
- [ ] Deletion on request implemented

### Accessibility (WCAG 2.1 AA)

```typescript
// Proper ARIA labels
element.setAttributes({
  'role': 'button',
  'aria-label': 'Delete item',
  'aria-pressed': 'false'
});

// Keyboard support
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
});
```

---

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Environment variables for config
- [ ] Input validation on all user data
- [ ] Output escaping before display
- [ ] HTTPS only for API calls
- [ ] CORS properly configured
- [ ] No inline event handlers
- [ ] CSP headers set
- [ ] CSRF tokens used
- [ ] OAuth tokens properly managed
- [ ] Sensitive data not logged
- [ ] Dependencies regularly updated
- [ ] Security headers present
- [ ] Rate limiting implemented
- [ ] Error messages don't leak info
- [ ] Audit logging for sensitive actions
- [ ] Code reviewed for vulnerabilities
- [ ] Penetration testing completed
- [ ] Privacy policy published
- [ ] Security policy documented

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Version**: 1.0
**Last Updated**: November 23, 2025
**Status**: Complete
