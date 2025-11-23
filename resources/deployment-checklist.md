# Deployment Checklist

Pre-deployment and post-deployment verification.

## Pre-Deployment (1-2 Days Before)

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compiling (`npm run typecheck`)
- [ ] No console errors/warnings
- [ ] Code reviewed by team
- [ ] No commented-out code
- [ ] Documentation updated

### Build Verification
- [ ] Production build successful (`npm run build`)
- [ ] Bundle size acceptable
- [ ] No missing dependencies
- [ ] Assets optimized
- [ ] Source maps generated
- [ ] Build time reasonable

### Security
- [ ] No API keys in code
- [ ] No passwords committed
- [ ] Dependencies audited (`npm audit`)
- [ ] Security scan passed
- [ ] All secrets in environment variables
- [ ] HTTPS certificates valid
- [ ] Security headers configured

### Testing
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Cross-browser tested
- [ ] Mobile tested
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Performance tested

### Performance
- [ ] Bundle < 1MB gzipped
- [ ] First paint < 2s
- [ ] API response < 200ms
- [ ] No memory leaks
- [ ] Database queries optimized

## Pre-Deployment Day

### Deployment Planning
- [ ] Deployment window scheduled
- [ ] Stakeholders notified
- [ ] Rollback plan documented
- [ ] Support team on standby
- [ ] Change log prepared
- [ ] Release notes written

### Environment Setup
- [ ] Staging environment ready
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Cache invalidation plan
- [ ] DNS changes ready
- [ ] CDN configured

### Final Checks
- [ ] Code reviewed once more
- [ ] All PR comments resolved
- [ ] Feature flags in place
- [ ] Error tracking configured
- [ ] Monitoring alerts configured
- [ ] Analytics events verified

## Deployment

### Execution
- [ ] Backup database
- [ ] Run database migrations
- [ ] Deploy code
- [ ] Run post-deployment scripts
- [ ] Verify deployment successful
- [ ] Clear cache
- [ ] Verify all services running

### Verification
- [ ] Application loads
- [ ] No 500 errors
- [ ] Core features working
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] External integrations working
- [ ] Email notifications sending

### Monitoring
- [ ] Error logs normal
- [ ] Performance metrics good
- [ ] No increased error rate
- [ ] Database performance normal
- [ ] API response times normal
- [ ] User reports addressed

## Post-Deployment (4 Hours)

### Immediate Checks
- [ ] No spike in errors
- [ ] Performance normal
- [ ] Users can login
- [ ] Core workflows working
- [ ] No database issues
- [ ] Logs look healthy

### Extended Monitoring (24 Hours)
- [ ] Error rate normal
- [ ] Performance stable
- [ ] No memory leaks
- [ ] API healthy
- [ ] Scheduled jobs running
- [ ] Backups completed

### Notify Stakeholders
- [ ] Deployment successful
- [ ] Release notes published
- [ ] Team informed
- [ ] Users notified (if needed)
- [ ] Status page updated

## Rollback Plan

### If Issues Occur
1. **Assess Impact**
   - [ ] Error rate
   - [ ] User impact
   - [ ] Data integrity
   - [ ] System stability

2. **Decide on Rollback**
   - [ ] Immediate rollback if critical
   - [ ] Hotfix if minor
   - [ ] Monitor if acceptable

3. **Execute Rollback**
   - [ ] Stop current deployment
   - [ ] Restore previous version
   - [ ] Run migrations rollback
   - [ ] Clear cache
   - [ ] Verify system

4. **Post-Rollback**
   - [ ] Notify stakeholders
   - [ ] Document issue
   - [ ] Root cause analysis
   - [ ] Fix and test thoroughly

## Monitoring Setup

### Essential Metrics
- [ ] Error rate (target: < 0.1%)
- [ ] API response time (target: < 200ms P95)
- [ ] Database response time (target: < 50ms P95)
- [ ] Memory usage (target: < 80%)
- [ ] CPU usage (target: < 70%)
- [ ] Disk usage (target: < 80%)

### Alerting
- [ ] Error rate > 1%
- [ ] API response > 1s
- [ ] Database down
- [ ] Memory > 90%
- [ ] CPU > 85%
- [ ] Disk > 90%

```typescript
// Example error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
})
```

### Health Checks
- [ ] Endpoint up and responding
- [ ] Database connected
- [ ] External services reachable
- [ ] Cache working
- [ ] Email service working

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    cache: await checkCache(),
    api: await checkExternalAPI()
  }

  const healthy = Object.values(checks).every(c => c)
  res.status(healthy ? 200 : 503).json(checks)
})
```

## Documentation

### What to Document
- [ ] Release notes (what changed)
- [ ] Migration guide (if needed)
- [ ] Breaking changes (if any)
- [ ] Known issues
- [ ] Support contacts
- [ ] Rollback procedures

### Release Notes Template
```markdown
# Release v1.2.0 - [Date]

## New Features
- Feature 1 description
- Feature 2 description

## Improvements
- Improvement 1
- Improvement 2

## Bug Fixes
- Bug 1 fix
- Bug 2 fix

## Breaking Changes
- Change 1 (migration guide)

## Migration Guide
1. Step 1
2. Step 2
3. Step 3

## Known Issues
- Issue 1 (workaround)

## Support
- Issue with deployment? Contact: support@example.com
```

## Infrastructure

### Server Readiness
- [ ] Sufficient disk space
- [ ] Sufficient RAM
- [ ] CPU resources available
- [ ] Network bandwidth available
- [ ] Load balancer configured
- [ ] DNS configured
- [ ] SSL certificate valid

### Database
- [ ] Migrations tested
- [ ] Backup strategy in place
- [ ] Backup tested
- [ ] Connection pooling configured
- [ ] Indexes optimized
- [ ] Disk space monitored

### Integrations
- [ ] Third-party APIs accessible
- [ ] API keys valid
- [ ] Rate limits understood
- [ ] Fallback strategies in place
- [ ] Error handling tested

## Team Communication

### Before Deployment
- [ ] Announce deployment window
- [ ] Share expected impact
- [ ] Provide runbook to support
- [ ] List who to contact if issues
- [ ] Schedule sync/standup

### During Deployment
- [ ] Post status updates
- [ ] Share progress
- [ ] Report any issues immediately
- [ ] Keep channels open

### After Deployment
- [ ] Celebrate success!
- [ ] Share release notes
- [ ] Gather feedback
- [ ] Document lessons learned
- [ ] Schedule retrospective

## Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Engineering Lead | | | |
| DevOps | | | |
| On-Call | | | |
| Manager | | | |

## Rollback Contact Tree

1. If no response from person A (5 min wait)
2. Call person B
3. If no response (5 min wait)
4. Page on-call team
5. Executive escalation

## Success Criteria

### Deployment Successful When:
- [ ] Zero critical errors (24h)
- [ ] Error rate < 0.1%
- [ ] Performance metrics normal
- [ ] All core features working
- [ ] No user complaints (24h)
- [ ] No data corruption
- [ ] Monitoring healthy

### Deployment Failed If:
- [ ] Critical error within 1h
- [ ] Data corruption detected
- [ ] More than 1% error rate
- [ ] Core feature down
- [ ] Unable to rollback
- [ ] Customer impact immediate
