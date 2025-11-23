# Security Checklist

Essential security considerations for Webflow apps.

## Before Deployment

### Code Security
- [ ] No API keys in source code
- [ ] No passwords in code
- [ ] All dependencies updated
- [ ] No console.log of sensitive data
- [ ] Error messages don't leak info
- [ ] SQL injection prevention (if using database)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### Authentication & Authorization
- [ ] OAuth properly implemented
- [ ] Tokens stored securely
- [ ] Token refresh working
- [ ] Logout clears all tokens
- [ ] Session timeout implemented
- [ ] Role-based access control working
- [ ] User permissions verified server-side
- [ ] Rate limiting on auth endpoints

### Data Security
- [ ] HTTPS enforced everywhere
- [ ] Sensitive data encrypted in transit
- [ ] Sensitive data encrypted at rest
- [ ] PII handling complies with regulations
- [ ] Data validation on all inputs
- [ ] Output encoding/escaping done
- [ ] Sensitive data purged from logs
- [ ] No sensitive data in URLs

### API Security
- [ ] API keys rotated regularly
- [ ] API rate limiting implemented
- [ ] Invalid requests rejected
- [ ] API responses validated
- [ ] CORS properly configured
- [ ] API endpoints authenticated
- [ ] Webhook signatures verified
- [ ] API versions versioned

### Infrastructure
- [ ] HTTPS certificate valid
- [ ] Security headers configured
- [ ] Firewall properly configured
- [ ] Backups encrypted
- [ ] Database credentials rotated
- [ ] Server logs monitored
- [ ] Unused ports closed
- [ ] Admin interfaces protected

## Code Review Checklist

### Input Validation
```typescript
// ✅ DO: Validate all inputs
function processInput(input: unknown): void {
  if (typeof input !== 'string') throw new Error('Invalid type')
  if (input.length > 1000) throw new Error('Too long')
  // Sanitize...
}

// ❌ DON'T: Trust user input
function processInput(input: any): void {
  eval(input) // NEVER!
}
```

### Token Handling
```typescript
// ✅ DO: Store tokens securely
const token = sessionStorage.getItem('auth_token') // Better
const token = localStorage.getItem('auth_token') // Not ideal

// ❌ DON'T: Expose tokens
console.log(token) // Never!
window.token = token // Never!
```

### API Calls
```typescript
// ✅ DO: Validate responses
const response = await fetch(url)
if (!response.ok) throw new Error('Request failed')
const data = await response.json()
if (!data.id) throw new Error('Invalid response')

// ❌ DON'T: Trust all responses
const data = await response.json()
eval(data.code) // Never!
```

### Error Handling
```typescript
// ✅ DO: Generic error messages to users
if (error.code === 'AUTH_FAILED') {
  showMessage('Login failed. Please try again.')
}

// ❌ DON'T: Expose system errors
showMessage(error.toString()) // Leaks info!
```

## Dependency Security

### Regular Updates
```bash
# Check for vulnerable packages
npm audit

# Update dependencies
npm update

# Update major versions
npm outdated
npm install package@latest
```

### Lock Files
```bash
# Always commit lock file
git add package-lock.json

# Use exact versions in production
npm ci # Instead of npm install
```

### Remove Unused Dependencies
```bash
# Identify unused packages
npm prune --production

# Remove unused package
npm uninstall unused-package
```

## Environment Variables

### Setup
```bash
# Create .env.example with template
API_KEY=xxx
SECRET_KEY=xxx

# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Use environment variables
const token = process.env.WEBFLOW_API_TOKEN
```

### Never Commit
- [ ] API keys
- [ ] Private keys
- [ ] Database credentials
- [ ] OAuth secrets
- [ ] JWTs or tokens
- [ ] Personal data
- [ ] Sensitive configs

## Data Privacy

### GDPR Compliance
- [ ] Privacy policy linked
- [ ] Consent mechanisms working
- [ ] Right to deletion implemented
- [ ] Data exports working
- [ ] Breach notification plan ready

### CCPA Compliance
- [ ] Privacy notice provided
- [ ] Opt-out mechanisms working
- [ ] Data inventory maintained
- [ ] Service agreements signed

### Data Minimization
- [ ] Only collect needed data
- [ ] Purge old data periodically
- [ ] Anonymize when possible
- [ ] Minimize PII exposure

## Monitoring & Logging

### What to Log
- API requests (non-sensitive)
- Authentication events
- Data modifications
- Error occurrences
- Security events

### What NOT to Log
- Passwords
- API keys
- Tokens
- PII
- Financial data

```typescript
// ✅ DO: Log safely
logger.info('User login attempt', { userId, timestamp })

// ❌ DON'T: Log secrets
logger.info('Login', { userId, password, token })
```

### Log Retention
- Keep logs: 30-90 days
- Encrypt log files
- Restrict log access
- Monitor suspicious activity
- Regular log reviews

## Security Headers

### Essential Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
```

### Implementation
```typescript
// Express.js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  next()
})
```

## Incident Response

### If Breach Occurs
1. **Immediately**
   - Revoke exposed tokens
   - Reset affected passwords
   - Notify affected users
   - Document incident details

2. **Within 24 Hours**
   - Complete incident analysis
   - Identify root cause
   - Determine exposure scope
   - Notify authorities if required

3. **Within 7 Days**
   - Implement fixes
   - Update security measures
   - Audit related systems
   - Review policies

4. **Within 30 Days**
   - Complete remediation
   - Security audit
   - Post-incident review
   - Update documentation

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Webflow Security Docs](https://developers.webflow.com)
- [Auth0 Security Checklist](https://auth0.com/blog/checklist)
- [CWE Top 25](https://cwe.mitre.org/top25/)

## Security Audit Checklist Template

```markdown
## Security Audit - [Date]

### Code Review
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Error handling safe
- [ ] Dependencies checked

### Authentication
- [ ] OAuth working correctly
- [ ] Tokens secured
- [ ] Refresh tokens working
- [ ] Logout clears data

### Data Protection
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted
- [ ] Data validation working
- [ ] Output sanitized

### API Security
- [ ] Rate limiting active
- [ ] Endpoints authenticated
- [ ] CORS configured
- [ ] Responses validated

### Infrastructure
- [ ] Firewall configured
- [ ] Backups encrypted
- [ ] Logs monitored
- [ ] Headers set

### Compliance
- [ ] Privacy policy ready
- [ ] GDPR compliant
- [ ] Terms of service ready
- [ ] Data handling documented

### Approved by: _______________
### Date: _______________
```
