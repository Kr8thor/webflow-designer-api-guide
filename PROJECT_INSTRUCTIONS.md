# Project Instructions & Workflow Guide

## 🎯 Project Overview

**Project Name**: Webflow Designer API Comprehensive Guide & Implementation Framework  
**Repository**: https://github.com/Kr8thor/webflow-designer-api-guide  
**Maintainer**: Kr8thor  
**Purpose**: Provide complete reference documentation, implementation guides, code templates, and working examples for building Webflow Designer Extensions and integrating with Claude Desktop.

---

## 📊 Project Structure & Organization

### Core Hierarchy
```
webflow-designer-api-guide/
├── Documentation (docs/)           - Main reference documents
├── Code Templates (templates/)     - Reusable code scaffolding
├── Working Examples (examples/)    - Complete implementation examples
├── Resources (resources/)          - Supporting guides and references
└── Configuration Files             - Setup and project metadata
```

### File Organization Rules

1. **Documentation Files** (`docs/`)
   - Markdown format only (.md)
   - Numbered sequentially: `01-name.md`, `02-name.md`, etc.
   - Each document should be self-contained
   - Max 15,000 words per document (split if larger)
   - Include table of contents for documents >3,000 words

2. **Template Files** (`templates/`)
   - TypeScript/JavaScript files (.ts/.js)
   - Follow naming convention: `feature-name.ts`
   - Include JSDoc comments for all functions
   - Add usage examples in comments
   - Keep under 500 lines per file

3. **Example Projects** (`examples/`)
   - Each example in its own directory
   - Include: src/, public/, webflow.json, package.json
   - README.md in each example directory
   - Include both working code and explanatory comments

4. **Resource Files** (`resources/`)
   - Supporting guides and quick references
   - Markdown format (.md)
   - Focused, narrow scope (single topic per file)
   - Keep under 5,000 words

---

## 🚀 Getting Started as a Contributor

### Prerequisites
- Git knowledge (clone, pull, push, branches)
- Markdown writing ability
- Understanding of Webflow Designer API (for technical content)
- Node.js 16+ (for testing code examples)

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/Kr8thor/webflow-designer-api-guide.git
cd webflow-designer-api-guide

# Create your working branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: description of what was added"

# Push to remote
git push origin feature/your-feature-name
```

---

## 📝 Working with Documents

### Adding a New Document

#### 1. Plan the Document
- Define scope and target audience
- Identify if it fits in pending Document 2, 3, or 4
- Or create new document (05+) if needed
- Estimate word count
- Outline main sections

#### 2. Create the Document File
```bash
# For new document in sequence
touch docs/05-new-topic.md

# Or update existing placeholder
# docs/02-webflow-app-development-guidelines.md
```

#### 3. Follow Document Template
```markdown
# Document Title

**Status**: [Draft | In Review | Complete]  
**Word Count**: ~X words  
**Target Audience**: Developers/Users/Both  
**Last Updated**: [Date]

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Introduction
Clear overview of document purpose.

## Section 1
Content...

## References
- [Link](url)
- [Link](url)

---
**Version**: 1.0  
**Maintainer**: Your Name
```

#### 4. Structure Guidelines

**Optimal Section Structure**:
- Introduction/Overview (100-300 words)
- 3-5 Main Sections (500-2000 words each)
- Subsections with code examples
- Summary/Conclusion
- References and links

**Code Examples in Docs**:
```markdown
\`\`\`typescript
// TypeScript example
const example = await webflow.getSelectedElement();
\`\`\`
```

**Callout Boxes**:
```markdown
> ⚠️ **Important**: This is critical information.

> ℹ️ **Note**: This is supplementary information.

> ✅ **Tip**: This is a helpful best practice.
```

#### 5. Validation Checklist

Before committing documentation:
- [ ] Spell check completed
- [ ] Links verified (test all URLs)
- [ ] Code examples tested (if applicable)
- [ ] Formatting consistent with other documents
- [ ] Table of contents accurate
- [ ] Word count appropriate for topic
- [ ] At least 2 sources cited (if external claims)
- [ ] No sensitive information exposed
- [ ] Images/diagrams included (if complex)

#### 6. Commit Message Format

```bash
git commit -m "Docs: Add/Update topic - brief description

- Added/Modified section
- Added/Modified section
- References: link1, link2"
```

---

## 🛠️ Working with Templates

### Adding a New Template

#### 1. Choose Template Type
- **Core Template**: Fundamental functionality (API initialization, auth)
- **Feature Template**: Specific capability (elements, components, variables)
- **Integration Template**: External service integration
- **Pattern Template**: Common design patterns

#### 2. Create Template File
```bash
touch templates/feature-name.ts
```

#### 3. Template Structure
```typescript
/**
 * Template Name - Short description
 * 
 * Purpose: Clear explanation of what this template does
 * Use Cases: When to use this template
 * Dependencies: What's needed before using this
 * 
 * @example
 * import { functionName } from './templates/feature-name';
 * const result = await functionName(params);
 */

// Type definitions
interface TemplateInterface {
  // Properties
}

// Main exports
export async function mainFunction(param: Type): Promise<Result> {
  // Implementation
}

// Helper functions
export function helperFunction(): void {
  // Implementation
}

// Error handling
export async function safeCall<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  // Implementation
}
```

#### 4. Documentation Requirements

**Header Comments**:
```typescript
/**
 * Get the currently selected element
 * 
 * @returns {Promise<Element | null>} Selected element or null
 * @throws {Error} If Webflow API unavailable
 * 
 * @example
 * const selected = await getSelectedElement();
 * if (selected) {
 *   console.log('Selected:', selected.name);
 * }
 */
```

**Inline Comments**:
```typescript
// ✅ DO: Explain WHY, not WHAT
// Check if element has children before iterating
if (element.children?.length > 0) {
  // ...
}

// ❌ DON'T: State obvious facts
// Loop through elements
for (const el of elements) {
  // ...
}
```

#### 5. Testing Templates

Before submitting:
```bash
# Install dependencies
npm install

# Run TypeScript check
npx tsc --noEmit templates/feature-name.ts

# Verify no syntax errors
node -c templates/feature-name.ts
```

#### 6. Validation Checklist

- [ ] Functions have JSDoc comments
- [ ] Type definitions included
- [ ] Error handling implemented
- [ ] Usage examples provided
- [ ] No external dependencies (or documented)
- [ ] Follows naming conventions
- [ ] Tested for syntax errors
- [ ] Consistent with other templates
- [ ] Under 500 lines

#### 7. Commit Message Format

```bash
git commit -m "Template: Add feature-name.ts

- Added primary function(s)
- Included error handling
- Added comprehensive examples
- Updated for API version X.X"
```

---

## 💻 Working with Examples

### Adding a New Example Project

#### 1. Determine Example Type
- **Beginner**: Basic functionality demo
- **Intermediate**: Multiple features combined
- **Advanced**: Complex integration with external services
- **Use Case**: Real-world workflow example

#### 2. Create Example Directory
```bash
mkdir -p examples/example-name
cd examples/example-name
```

#### 3. Example Project Structure
```
examples/example-name/
├── README.md                 # Setup & feature explanation
├── src/
│   ├── index.ts             # Main entry point
│   ├── api/                 # API integration
│   ├── components/          # Reusable components (if React)
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Helper functions
├── public/
│   ├── index.html           # Extension UI
│   ├── styles.css           # Styling
│   └── assets/              # Images, icons, etc.
├── webflow.json             # App manifest
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Build config (if applicable)
└── .env.example             # Environment variables template
```

#### 4. README Template for Examples
```markdown
# [Example Name]

**Difficulty**: [Beginner | Intermediate | Advanced]  
**Time to Complete**: X minutes  
**Key Features**: Feature list  
**Target Users**: Developer type  

## Overview
Brief description of what this example does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Prerequisites
- Webflow account
- Node.js 16+
- API token

## Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Key Code Sections
Explanation of important parts.

## How It Works
Step-by-step walkthrough.

## Common Customizations
How to modify for different use cases.

## Troubleshooting
Common issues and solutions.
```

#### 5. Code Quality Standards

**For All Example Code**:
- [ ] TypeScript with strict mode enabled
- [ ] Comprehensive error handling
- [ ] JSDoc comments on all exports
- [ ] Environment variables for sensitive data
- [ ] No hardcoded API keys or tokens
- [ ] Follows Webflow best practices
- [ ] Tested on latest Webflow API version
- [ ] Includes comments explaining key sections
- [ ] README includes setup instructions
- [ ] .env.example provided

#### 6. Validation Checklist

Before committing example:
- [ ] All dependencies listed in package.json
- [ ] Code runs without errors (`npm install && npm run dev`)
- [ ] No console errors or warnings
- [ ] README is comprehensive
- [ ] Setup instructions work as written
- [ ] Code follows naming conventions
- [ ] TypeScript compiles without errors
- [ ] Security best practices followed
- [ ] Performance optimized
- [ ] Accessible (keyboard nav, ARIA labels, etc.)

#### 7. Commit Message Format

```bash
git commit -m "Example: Add example-name project

- Created example for [feature]
- Includes [feature list]
- Uses [technology stack]
- Includes full README and setup guide"
```

---

## 📚 Working with Resources

### Adding a New Resource Guide

#### 1. Determine Resource Type
- **Quick Reference**: Cheat sheets, quick lookups
- **Guide**: Step-by-step instructions
- **Checklist**: Validation/preparation lists
- **Glossary**: Term definitions
- **Links**: Curated resource collections

#### 2. Create Resource File
```bash
touch resources/resource-name.md
```

#### 3. Resource Structure

**Quick Reference**:
```markdown
# API Quick Reference

| Method | Purpose | Parameters | Returns |
|--------|---------|------------|---------|
| method1 | What it does | param1, param2 | result |
| method2 | What it does | param1 | result |
```

**Guide Format**:
```markdown
# How to [Accomplish Task]

## Prerequisites
- Item 1
- Item 2

## Steps
1. First step
2. Second step
3. Final step

## Verification
How to confirm success.

## Troubleshooting
Common issues.
```

**Checklist Format**:
```markdown
# [Process Name] Checklist

## Phase 1: Preparation
- [ ] Item 1
- [ ] Item 2

## Phase 2: Implementation
- [ ] Item 1
- [ ] Item 2

## Phase 3: Validation
- [ ] Item 1
- [ ] Item 2
```

#### 4. Validation Checklist

- [ ] Single topic focus
- [ ] Under 5,000 words
- [ ] Clear, actionable content
- [ ] All links tested
- [ ] Code examples (if any) tested
- [ ] Consistent formatting
- [ ] No redundancy with other resources

#### 5. Commit Message Format

```bash
git commit -m "Resource: Add resource-name.md

- Created [type] for [topic]
- Covers [scope]
- Includes [X] items/sections"
```

---

## 🔄 Maintenance & Updates

### Monthly Maintenance Tasks

**First Monday of Month**:
- [ ] Review all links for dead links
- [ ] Check Webflow API changelog for updates
- [ ] Update API version references if changed
- [ ] Review open issues and PRs
- [ ] Archive outdated content if needed

**Code Examples Validation**:
```bash
# Check all TypeScript templates
npx tsc --noEmit templates/*.ts

# Verify no broken imports
npm audit

# Update dependencies
npm outdated
```

### Updating for New API Versions

When Webflow releases new API features:

1. **Create Update Branch**
   ```bash
   git checkout -b update/api-version-x.x
   ```

2. **Update Affected Documents**
   - Search for version references
   - Test code examples
   - Update capabilities matrix
   - Document breaking changes

3. **Update Timestamp**
   ```markdown
   **Last Updated**: [New Date]
   **API Version**: X.X
   ```

4. **Commit with Clear Message**
   ```bash
   git commit -m "Update: API v1.2 compatibility

   - Updated [document] for new endpoints
   - Added [new feature] examples
   - Verified code examples work with v1.2"
   ```

### Handling Bug Reports

**When Issue Reported**:
1. Create issue with bug label
2. Verify the issue
3. Create fix branch: `bugfix/issue-name`
4. Test thoroughly
5. Submit PR with detailed explanation
6. Update affected documentation

**Commit Format**:
```bash
git commit -m "Fix: Brief description of bug fix

- Root cause: explanation
- Solution: what was changed
- Tested: confirmation of fix
- Affects: which components"
```

---

## 🎓 Content Quality Standards

### Documentation Quality

**Readability**:
- Flesch Reading Ease: 50-70 (clear but technical)
- Use short paragraphs (2-3 sentences max)
- Front-load important information
- Use active voice

**Accuracy**:
- All code examples must be tested
- All links must be verified
- All claims must be cited or verifiable
- Specify API versions referenced

**Completeness**:
- Include setup instructions
- Provide working examples
- Explain the "why" not just "how"
- Document error cases

### Code Quality

**Standards**:
- TypeScript strict mode enabled
- No `any` types without justification
- Comprehensive error handling
- JSDoc comments on all exports
- Performance optimized
- Security best practices followed

**Testing**:
- Code compiles without errors
- No runtime errors on valid input
- Error handling tested
- Works with current Webflow API version

---

## 🚀 Workflow for Adding New Content

### Typical Workflow for Adding a Document

```
1. Plan Phase (1-2 hours)
   ├─ Define scope and target audience
   ├─ Create outline with sections
   ├─ Identify required code examples
   └─ Plan research/sources needed

2. Development Phase (4-8 hours)
   ├─ Write initial draft
   ├─ Add code examples and test them
   ├─ Create diagrams/tables if needed
   └─ Add references and citations

3. Review Phase (1-2 hours)
   ├─ Self review against checklist
   ├─ Verify all links
   ├─ Spell check and grammar
   ├─ Validate formatting consistency
   └─ Final read-through

4. Submission Phase (30 mins)
   ├─ Create feature branch
   ├─ Commit with descriptive message
   ├─ Push to remote
   └─ Create PR if applicable

5. Integration Phase
   ├─ Receive feedback if needed
   ├─ Make revisions
   ├─ Final approval
   └─ Merge to main
```

---

## 📋 Pre-Commit Checklist

Before committing ANY changes:

### Documentation
- [ ] Spell checked
- [ ] Grammar reviewed
- [ ] Links tested (all functional)
- [ ] Code examples tested
- [ ] Formatting consistent
- [ ] No sensitive information
- [ ] Proper citations included
- [ ] Table of contents accurate (if doc >3K words)
- [ ] Headers use proper markdown (#, ##, ###)
- [ ] Images have alt text (if applicable)

### Code (Templates & Examples)
- [ ] TypeScript compiles without errors
- [ ] No `any` types without comment
- [ ] Error handling present
- [ ] JSDoc comments complete
- [ ] No console.log left in production code
- [ ] No hardcoded secrets/tokens
- [ ] Works with current Webflow API
- [ ] Performance optimized
- [ ] Security best practices followed
- [ ] Tested for runtime errors

### File Organization
- [ ] File in correct directory
- [ ] Proper naming convention followed
- [ ] Not duplicating existing content
- [ ] Consistent with repository style
- [ ] README updated if applicable
- [ ] .gitignore includes any generated files

### Commit Message
- [ ] Clear, descriptive message
- [ ] Follows commit convention
- [ ] References issues if applicable
- [ ] Body explains "why" if needed
- [ ] No personal notes or debug info

---

## 🔐 Security Guidelines

### For All Content

**Never Include**:
- API keys or tokens
- Client secrets
- Personal access tokens
- Database credentials
- Private URLs or endpoints
- Sensitive business information

**Security Best Practices**:
- Always use `.env` files for secrets (shown as .env.example)
- Recommend secure token storage
- Document authentication properly
- Warn about XSS/CSRF risks
- Emphasize HTTPS usage
- Include rate limiting guidance

### Code Review for Security

Before committing code:
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Error messages don't leak info
- [ ] CORS properly configured
- [ ] Authentication enforced
- [ ] Authorization checked
- [ ] SQL injection protection (if applicable)
- [ ] No eval() or dynamic code execution

---

## 📞 Communication & Collaboration

### For Contributors

**Opening an Issue**:
- Use clear, descriptive title
- Include: what, why, and affected area
- Provide code snippets if applicable
- Link to related issues
- Label appropriately (bug, enhancement, docs, etc.)

**Creating a Pull Request**:
- Reference the issue being addressed
- Describe changes clearly
- Include before/after if applicable
- Run checklist before submitting
- Request review from maintainer

**Feedback & Discussions**:
- Be respectful and constructive
- Focus on ideas, not people
- Provide specific suggestions
- Acknowledge good points
- Use threads to keep organized

### Commit Message Conventions

```
Type: Brief description (50 chars max)

More detailed explanation if needed.
Keep lines to 72 characters.

- Bullet point for specific change
- Another specific change
- Optional: "Fixes #123" for issue references
```

**Types**:
- `Docs`: Documentation changes
- `Template`: Template additions/updates
- `Example`: Example project changes
- `Resource`: Resource guide changes
- `Fix`: Bug fixes
- `Update`: API updates, version bumps
- `Refactor`: Code reorganization
- `Config`: Configuration changes

---

## 🎯 Success Metrics

### Content Quality
- All code examples tested and working: ✅ 100%
- Links verified and functional: ✅ 100%
- Spell checked and grammar reviewed: ✅ 100%
- Follows style guide: ✅ 95%+

### Code Quality
- TypeScript compilation errors: ✅ 0
- Runtime errors: ✅ 0
- Security issues: ✅ 0
- Performance issues: ✅ 0

### Community Engagement
- Issue response time: ✅ <48 hours
- PR response time: ✅ <72 hours
- Community contributions: ✅ Encouraged

---

## 📞 Getting Help

### For Questions About

**Project Structure**: See [STRUCTURE.md](STRUCTURE.md)  
**Setup & Installation**: See [INSTALLATION.md](INSTALLATION.md)  
**Current Status**: See [PROJECT_STATUS.md](PROJECT_STATUS.md)  
**General Overview**: See [README.md](README.md)

### Resources

- [Webflow Developers](https://developers.webflow.com)
- [GitHub Issues](https://github.com/Kr8thor/webflow-designer-api-guide/issues)
- [Discussion Forum](https://discourse.webflow.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/webflow)

---

## 📅 Release Schedule

### Planned Releases

**Phase 1** ✅ (Complete Nov 23, 2025)
- Core documentation setup
- Document 1: Claude Desktop Sonnet 4 Prompt
- Basic templates

**Phase 2** (Pending)
- Document 2: Webflow App Development Guidelines
- Document 3: Designer API Research & Case Studies
- Document 4: New Pages Enhancement

**Phase 3** (Future)
- Additional templates (8 planned)
- Example projects (8 planned)
- Resource guides (8 planned)
- Community contributions

---

## 🎓 Final Checklist for Completion

Before considering content "complete":

**Planning Phase**:
- [ ] Scope clearly defined
- [ ] Target audience identified
- [ ] Research completed
- [ ] Outline created

**Development Phase**:
- [ ] Content written
- [ ] Code examples created and tested
- [ ] Visual aids prepared (if needed)
- [ ] Citations and references added

**Quality Assurance Phase**:
- [ ] Spell check complete
- [ ] Grammar review done
- [ ] Links tested
- [ ] Code tested
- [ ] Formatting consistent
- [ ] No sensitive information
- [ ] Compliance checked

**Integration Phase**:
- [ ] Properly organized in repository
- [ ] Named correctly
- [ ] Committed with good message
- [ ] Documentation updated (README, STRUCTURE)
- [ ] Tracked in PROJECT_STATUS

---

## 🚀 Ready to Contribute

This repository is open to contributions following these guidelines. Whether you're:

- **Adding Documentation**: Follow document structure and validation checklist
- **Creating Templates**: Follow template guidelines and code standards
- **Building Examples**: Follow example structure and quality standards
- **Writing Guides**: Follow resource guidelines and commit conventions

**Every contribution should**:
1. Follow the appropriate guidelines above
2. Pass the validation checklist
3. Include proper commit message
4. Be focused on single topic/feature
5. Be thoroughly tested
6. Include explanations and examples

---

**Last Updated**: November 23, 2025  
**Version**: 1.0  
**Status**: Active & Ready for Contributions  
**Maintainer**: Kr8thor
