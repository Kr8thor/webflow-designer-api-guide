# Marketplace Submission Guide

Complete guide for submitting your Webflow app to the official marketplace.

## Overview

The Webflow App Marketplace allows developers to distribute and monetize their extensions. This guide covers the submission process, requirements, and best practices.

## Before You Submit

### Code Quality Checklist

- [ ] All code follows TypeScript strict mode
- [ ] No console.log statements in production
- [ ] All dependencies are up-to-date
- [ ] No hardcoded API keys or secrets
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Proper TypeScript types defined
- [ ] ESLint passes without warnings
- [ ] Code is minified in production build

### Security Requirements

- [ ] No XSS vulnerabilities
- [ ] Input validation on all user inputs
- [ ] Output encoding for user-generated content
- [ ] No eval() or dynamic code execution
- [ ] Secure token handling (no localStorage for secrets)
- [ ] HTTPS-only API calls
- [ ] CORS properly configured
- [ ] Rate limiting implemented

### Performance Standards

- [ ] Bundle size < 500KB (gzipped)
- [ ] Initial load time < 2 seconds
- [ ] No memory leaks
- [ ] Event listeners cleaned up
- [ ] Lazy loading implemented for heavy features
- [ ] Debouncing on expensive operations
- [ ] Canvas interactions perform smoothly

### Documentation Requirements

- [ ] README.md with feature overview
- [ ] Installation instructions
- [ ] Usage examples with code snippets
- [ ] API reference if applicable
- [ ] Screenshots or demo video
- [ ] Troubleshooting section
- [ ] FAQ section
- [ ] Support contact information

## Submission Process

### Step 1: Prepare Your App

```bash
# Build your app
npm run build

# Test thoroughly
npm test

# Check bundle size
ls -lh dist/

# Verify no console logs
grep -r "console.log" src/
```

### Step 2: Create Listing

1. Go to https://developers.webflow.com/marketplace
2. Click "Submit App"
3. Fill in the following information:

**Basic Information:**
- App name (3-50 characters)
- Tagline (1-120 characters)
- Description (500-5000 characters)
- Category (Designer Extension, Data Client, Hybrid, etc.)
- Pricing model (Free, One-time, Monthly subscription)

**Visual Assets:**
- App icon (512×512px, PNG/JPG)
- Hero image (1440×810px, PNG/JPG)
- Screenshots (1440×810px, up to 5 images)
- Demo video (optional, MP4, up to 30 seconds)

**Support Information:**
- Support email
- Documentation URL
- Support portal URL (optional)
- Privacy policy URL
- Terms of service URL

### Step 3: Configure Permissions

Document all required scopes:

```json
{
  "designExtension": {
    "requiredScopes": [
      "designer:read",
      "designer:write"
    ]
  }
}
```

List what each scope is used for:
- `designer:read`: Reading element properties
- `designer:write`: Modifying element styles

### Step 4: Version Management

Use semantic versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes

```json
{
  "version": "1.2.3"
}
```

### Step 5: Changelog

Maintain a comprehensive changelog:

```markdown
## Version 1.2.3 (2024-01-15)

### Added
- New feature: Batch operations
- Improved performance for large designs

### Fixed
- Bug: Element selection sometimes fails
- Issue: Memory leak on rapid updates

### Changed
- Updated API to match latest Webflow spec
- Improved error messages

### Deprecated
- Old API methods (use new methods)

### Security
- Fixed XSS vulnerability in preview
```

## Review Process

### Automatic Checks
- Code quality scan
- Security vulnerability check
- Bundle size analysis
- Performance testing

### Manual Review
1. **Functionality** (1-2 days)
   - Does it work as described?
   - Are all features functional?
   - Is the UI intuitive?

2. **Security** (1-2 days)
   - No hardcoded secrets
   - Proper API key handling
   - Input validation present
   - XSS protection implemented

3. **Performance** (1 day)
   - Bundle size acceptable
   - Smooth interactions
   - No memory leaks
   - Fast initialization

4. **Documentation** (1 day)
   - Clear instructions
   - Code examples provided
   - Troubleshooting helpful
   - Support contact available

### Typical Timeline
- Submission: Immediate
- Automatic checks: 1-2 hours
- Review queue: 1-3 days
- Approval/Feedback: 2-5 days
- Resubmission: As needed
- Publication: 1-2 hours after approval

## Marketing Your App

### Launch Strategy

**Pre-Launch:**
- Create demo video
- Write blog post
- Prepare social media content
- Reach out to beta testers

**Launch Day:**
- Announce on Webflow forums
- Share on Twitter/LinkedIn
- Submit to Webflow blog
- Email beta testers
- Post on Webflow Discord

**Post-Launch:**
- Monitor feedback
- Respond to user issues quickly
- Collect testimonials
- Update documentation based on feedback

### Ratings & Reviews

Best practices:
- Respond to all reviews promptly
- Thank positive reviewers
- Address negative feedback constructively
- Fix issues quickly after negative reviews
- Ask satisfied users for reviews

Sample response template:

> Thank you for using [App Name]! We appreciate your feedback.
>
> For your issue: [address specific concern]
>
> Please reach out to support@example.com if you need further assistance.

## After Approval

### Ongoing Maintenance

**Security:**
- Monitor for vulnerabilities
- Update dependencies monthly
- Perform security audits quarterly
- Report security issues immediately

**Performance:**
- Monitor bundle size growth
- Track performance metrics
- Optimize based on usage patterns
- Update when performance degrades

**Compatibility:**
- Test with new Webflow releases
- Update for API changes
- Maintain backwards compatibility
- Communicate breaking changes

### Update Schedule

Recommended update frequency:
- **Critical fixes**: Within 24 hours
- **Security updates**: Within 48 hours
- **Bug fixes**: Within 1-2 weeks
- **New features**: Monthly or as completed
- **Minor updates**: Every 2-3 weeks

### Versioning in Marketplace

Each update is a new version:
- Submit updates through marketplace dashboard
- Provide changelog for each version
- Users get automatic notifications
- Can rollback to previous versions (for paid apps)

## Monetization

### Pricing Models

1. **Free**
   - No payment required
   - Good for building user base
   - Can monetize separately (premium features, sponsorship)

2. **One-Time Purchase**
   - Fixed price (typically $29-$299)
   - Users pay once, own forever
   - Updates included

3. **Monthly Subscription**
   - Recurring revenue ($9-$99/month typical)
   - Marketplace handles billing
   - You receive 70-80% of revenue

4. **Freemium**
   - Free basic features
   - Premium features paid
   - Use feature flags to gate functionality

### Revenue Optimization

- Start with reasonable pricing
- Offer annual discounts for subscriptions
- Bundle related apps
- Monitor competitor pricing
- Gradually increase prices as value increases
- Offer enterprise licensing

Example pricing:
```
Free Tier:
- 5 tokens/month
- Basic features

Pro ($29/month):
- 1000 tokens/month
- Advanced features
- Priority support

Enterprise (Custom):
- Unlimited tokens
- Custom integrations
- Dedicated support
```

## Common Rejection Reasons

### Code Quality
- Missing error handling
- Unoptimized bundle size
- No TypeScript support
- Hardcoded values

**Fix:**
```typescript
// ❌ Bad
const API_KEY = 'sk-1234567890'
fetch('https://api.example.com')

// ✅ Good
const API_KEY = process.env.API_KEY
if (!API_KEY) {
  throw new Error('API_KEY not configured')
}
try {
  const response = await fetch('https://api.example.com')
  if (!response.ok) throw new Error(response.statusText)
} catch (error) {
  console.error('API call failed:', error)
  // Proper error handling
}
```

### Security
- XSS vulnerabilities
- Missing input validation
- Exposed sensitive data
- No HTTPS enforcement

**Fix:**
```typescript
// ❌ Bad
element.innerHTML = userInput

// ✅ Good
element.textContent = userInput
// or
element.innerHTML = sanitize(userInput)
```

### Documentation
- Unclear descriptions
- Missing screenshots
- No code examples
- No support contact

**Fix:** Include comprehensive README with:
- Feature overview
- Installation steps
- Usage examples
- API reference
- Screenshots
- Troubleshooting
- Support contact

### Performance
- Bundle > 1MB
- Slow initialization
- Memory leaks
- Janky interactions

**Fix:**
- Code split large features
- Lazy load components
- Optimize images
- Use requestAnimationFrame

## Support & Maintenance

### Support Channels

Recommended setup:
- **Email**: support@example.com
- **Discord**: Community channel
- **GitHub Issues**: Bug reporting
- **Documentation**: Self-service help

### SLA (Service Level Agreement)

Example commitment:
- Critical issues: Response < 2 hours, fix < 24 hours
- High priority: Response < 4 hours, fix < 48 hours
- Normal issues: Response < 24 hours, fix < 1 week
- Feature requests: Response < 1 week, implement if approved

### Handling User Feedback

Process for user requests:
1. Acknowledge receipt within 24 hours
2. Provide timeline for response
3. Explain decision (approved/rejected/investigating)
4. Update user on progress
5. Implement or explain why not feasible

Example response:

> Hi [User],
>
> Thank you for your feature request. We've reviewed it and think it's a great idea.
>
> **Timeline:** We plan to implement this in version 2.1, targeting release by [date]
>
> **Impact:** This will help users with [specific use case]
>
> We'll update you when this launches. Please let us know if you have other feedback!
>
> Best regards,
> [Your Name]

## Resources

- [Official Webflow Developer Docs](https://developers.webflow.com)
- [Marketplace Guidelines](https://developers.webflow.com/marketplace)
- [Designer API Reference](https://developers.webflow.com/designer/reference)
- [Data API Reference](https://developers.webflow.com/data/reference)
- [Developer Community Forum](https://discourse.webflow.com)
- [Webflow Discord Server](https://discord.gg/webflow)
