# SEO Automator Example

Automate SEO metadata optimization with scoring, validation, and templates.

## What This Example Shows

- ✅ SEO metadata management (title, description, keywords)
- ✅ Open Graph (social) metadata
- ✅ Real-time SEO scoring
- ✅ Validation rules and issue detection
- ✅ Helpful suggestions and auto-filling
- ✅ SEO templates by page type
- ✅ Search preview
- ✅ Character count validation

## Key Implementation

```typescript
// Check SEO for page
const issues = checkSEO(page)
const score = calculateScore(page)

// Apply template
applySEOTemplate(pageId, 'product')

// Update metadata
updatePage(pageId, {
  title: 'New Title',
  description: 'New description',
  keywords: ['keyword1', 'keyword2']
})

// Generate suggestions
const suggestion = generateSuggestion(page, 'title')
```

## Features

- Automated SEO scoring
- Issue detection and severity levels
- Built-in SEO templates
- Character count validation
- Google search preview
- Open Graph optimization
- Bulk editing
- Export SEO report

## Templates Used

- [page-operations.ts](../../templates/page-operations.ts)

## Learn More

- [API Reference Guide](../../resources/api-reference.md)
- [Security Checklist](../../resources/security-checklist.md)
