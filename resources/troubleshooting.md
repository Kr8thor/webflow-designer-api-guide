# Troubleshooting Guide

Solutions to common Webflow API issues and errors.

## Common Issues

### API Errors

#### "Unauthorized" (401)
**Problem**: Authentication failed

**Solutions**:
- Verify API token is valid: `echo $WEBFLOW_API_TOKEN`
- Check token hasn't expired
- Ensure token has correct scopes
- Regenerate token if unsure

```bash
# Verify token works
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.webflow.com/v2/user
```

#### "Forbidden" (403)
**Problem**: Insufficient permissions

**Solutions**:
- Check token has required scopes
- Verify workspace access
- Check team member permissions
- Request admin to grant permissions

#### "Not Found" (404)
**Problem**: Resource doesn't exist

**Solutions**:
- Verify resource ID is correct
- Check resource hasn't been deleted
- Verify you're looking in right workspace
- Use list endpoint to find correct ID

#### "Rate Limited" (429)
**Problem**: Too many API requests

**Solutions**:
- Implement exponential backoff
- Add delays between requests
- Batch operations where possible
- Use webhooks instead of polling

```typescript
// Exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.status !== 429) throw error
      const delay = Math.pow(2, i) * 1000
      await new Promise(r => setTimeout(r, delay))
    }
  }
}
```

### Designer API Issues

#### Element Not Found
**Problem**: `Cannot read property 'getChildren' of undefined`

**Solutions**:
- Check element exists before accessing
- Use try-catch for element operations
- Verify element hasn't been deleted

```typescript
const element = await webflow.getElementById(id)
if (!element) {
  console.error('Element not found')
  return
}
```

#### Scope Not Available
**Problem**: `"designer:read" scope not available`

**Solutions**:
- Check extension permissions in webflow.json
- Add required scopes to manifest
- Request user to grant permissions

```json
{
  "designExtension": {
    "allowedScopes": ["designer:write", "designer:read"]
  }
}
```

#### Stale Data
**Problem**: Element properties not updating

**Solutions**:
- Wait for async operations to complete
- Use event listeners for real-time updates
- Refresh element reference
- Check for concurrent modifications

```typescript
// Use events for real-time updates
webflow.on('elementUpdated', (element) => {
  const refreshed = await webflow.getElementById(element.id)
  console.log('Fresh data:', refreshed)
})
```

### Performance Issues

#### Slow Element Operations
**Problem**: Updating 100+ elements is slow

**Solutions**:
- Batch operations in chunks
- Use Promise.all for parallel operations
- Debounce frequent updates
- Use virtual scrolling for large lists

```typescript
// Batch processing
const chunks = chunkArray(elements, 50)
for (const chunk of chunks) {
  await Promise.all(
    chunk.map(el => el.updateStyles({color: '#000'}))
  )
}
```

#### Memory Leaks
**Problem**: App uses increasing memory

**Solutions**:
- Clean up event listeners
- Clear caches periodically
- Remove DOM elements
- Close timers

```typescript
// Cleanup
useEffect(() => {
  const handler = () => {}
  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])
```

### OAuth Issues

#### "Invalid State" Error
**Problem**: State parameter mismatch

**Solutions**:
- Verify state is generated and validated
- Check state hasn't expired (5 min timeout)
- Ensure state is URL-safe encoded
- Clear browser cache/cookies

```typescript
// Validate state
const storedState = sessionStorage.getItem('oauth_state')
if (storedState !== returnedState) {
  throw new Error('Invalid state parameter')
}
```

#### Token Refresh Fails
**Problem**: Cannot refresh expired token

**Solutions**:
- Verify refresh token exists
- Check refresh token hasn't expired
- Ensure client credentials are correct
- Test with new OAuth flow

```typescript
// Fallback to new login
if (cannotRefreshToken) {
  clearStoredToken()
  redirectToLogin()
}
```

### Data Sync Issues

#### Data Not Persisting
**Problem**: Changes aren't saved

**Solutions**:
- Verify POST/PATCH requests succeed
- Check response for errors
- Add confirmation before operations
- Implement optimistic updates with rollback

```typescript
// Verify request succeeded
const response = await updateItem(id, data)
if (!response.ok) {
  throw new Error('Update failed')
}
```

#### Collection Fields Missing
**Problem**: Field not appearing in data

**Solutions**:
- Verify field is published
- Check field permissions
- Ensure field is in correct collection
- Refresh collection schema

```typescript
// Check field exists
const collection = await getCollection(id)
const field = collection.fields.find(f => f.slug === 'field-name')
if (!field) {
  console.error('Field not found')
}
```

## Debugging Techniques

### Enable Debug Logging
```typescript
// Log all API calls
const originalFetch = fetch
window.fetch = function(...args) {
  console.log('API Call:', args[0])
  return originalFetch.apply(this, args)
}
```

### Inspect Network Requests
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by 'api'
4. Check requests/responses
5. Look for error status codes
```

### Check Token Validity
```bash
# Decode JWT
jwt decode $YOUR_TOKEN

# Verify scopes
jwt decode $YOUR_TOKEN | grep scope
```

### Test with curl
```bash
# Test API endpoint
curl -v -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.webflow.com/v2/user

# Test with data
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fields":{"name":"Test"}}' \
  https://api.webflow.com/v2/collections/COLL_ID/items
```

## Performance Optimization

### Cache API Responses
```typescript
const cache = new Map()

async function getWithCache(key, fn) {
  if (cache.has(key)) {
    return cache.get(key)
  }
  const result = await fn()
  cache.set(key, result)
  return result
}
```

### Batch Requests
```typescript
// Instead of 100 requests, make 2 batch requests
const items = await Promise.all([
  fetchItems(0, 50),
  fetchItems(50, 100)
])
```

### Use WebSocket for Real-Time
```typescript
// Instead of polling every second
const ws = new WebSocket('wss://api.webflow.com/socket')
ws.onmessage = (event) => {
  updateUI(event.data)
}
```

## Contact Support

**Issue not resolved?**

1. Check [Webflow Community Forum](https://discourse.webflow.com)
2. Review [API Changelog](https://developers.webflow.com/data/changelog)
3. Check GitHub Issues in examples repos
4. Contact Webflow Support
5. Post in Webflow Discord community

**Include when reporting**:
- API endpoint being called
- Request/response data
- Error message
- Steps to reproduce
- Webflow API version
