# Glossary of Terms

Common terms used in Webflow app development.

## Core Concepts

### Designer API
The set of JavaScript APIs that allow programmatic access to the Webflow Designer. Enables real-time manipulation of elements, components, styles, and properties.

### Data API
REST API for reading and writing site data, CMS collections, users, and workspace information. Used for server-to-server communication.

### Designer Extension
An application that runs inside the Webflow Designer UI, providing custom panels and real-time canvas manipulation.

### Data Client App
A server-side application that uses OAuth to authenticate users and access their Webflow data via the Data API.

### Hybrid App
An application combining both Designer Extension and Data Client functionality for maximum capabilities.

## Authentication & Authorization

### OAuth 2.0
Industry standard authentication protocol. Used to securely authorize Webflow apps on behalf of users.

**Grant Types:**
- **Authorization Code Flow**: Most common, used for web apps
- **Client Credentials**: Server-to-server authentication
- **Refresh Token**: Getting new access tokens without user interaction

### Access Token
Short-lived credential proving authorization. Included in API requests via `Authorization: Bearer <token>` header.

### Refresh Token
Long-lived credential used to obtain new access tokens. Should be stored securely and never exposed to client.

### Scope
Permission level for an access token. Examples: `read:sites`, `write:collections`

### Bearer Token
Authentication method using access tokens in the `Authorization: Bearer <token>` header.

## Entities

### Site
A Webflow website. Contains pages, collections, assets, and design settings.

### Page
Individual web page in a site. Has URL slug, SEO metadata, and design content.

### Element
Individual component in the DOM tree. Examples: div, button, image, section.

### Component
Reusable element template. Instances of components share base design but can be customized.

### Collection
Database table in Webflow CMS. Contains multiple items with custom fields.

### Item
Single record in a collection. Contains field values matching collection structure.

### Field
Column in a CMS collection. Has type (text, image, reference, etc.) and configuration.

### Asset
File uploaded to Webflow. Types: image, video, document, icon, audio.

### Workspace
Grouping of team members and sites. Manage billing, team access, and settings at workspace level.

## API Concepts

### RESTful API
Architectural style using HTTP methods (GET, POST, PATCH, DELETE) to manipulate resources via URLs.

### Endpoint
Specific URL path for API operation. Example: `/api/v2/sites/{siteId}/collections`

### Request
HTTP message sent to API containing method, headers, URL, and optionally body.

### Response
HTTP message returned by API containing status code, headers, and body with data or error.

### Webhook
HTTP callback triggered by Webflow events. Your app receives POST request when event occurs.

### Rate Limiting
API policy limiting requests per time period to prevent abuse. Webflow: 100 req/10s.

### Rate Limit Reset
Time when your rate limit counter resets. Returned in `X-RateLimit-Reset` header.

### Pagination
Dividing large result sets into pages. Use `limit` and `offset` parameters.

### Filtering
Narrowing results based on field values. Example: `?filter[status]=published`

### Sorting
Ordering results by field. Prefix with `-` for descending. Example: `?sort=-createdOn`

## Technical Terms

### TypeScript
Superset of JavaScript adding static type checking. Recommended for Webflow apps.

### React
JavaScript library for building user interfaces with components and state management.

### Vite
Modern JavaScript bundler. Used by `webflow init` for app scaffolding.

### DOM (Document Object Model)
Programming interface for HTML/XML documents. JavaScript accesses and modifies via DOM.

### Virtual DOM
In-memory representation of DOM. Frameworks like React use to optimize updates.

### Event Listener
Function triggered when specific event occurs (click, change, scroll, etc.).

### Promise
JavaScript object representing eventual completion/failure of async operation.

### Async/Await
Modern syntax for handling Promises. `await` pauses execution until Promise resolves.

### Callback
Function passed as argument to be called at later time, often in response to event.

### Debounce
Technique delaying function execution until after specified time without triggering. Used for search, resize handlers.

### Throttle
Technique limiting function execution frequency. Called at most once per interval.

### Memoization
Caching function results to avoid recomputation with same inputs.

## CMS Terms

### CMS (Content Management System)
System for managing website content. Webflow CMS stores data in collections.

### Collection Schema
Structure defining fields and their types in a collection.

### Custom Field
User-defined field in collection. Types: text, number, email, URL, image, etc.

### Reference Field
Field linking to items in another collection. Creates relationships between data.

### Slug
URL-friendly text identifier for pages and items. Examples: "about-us", "blog-post-1"

### Draft
Content not yet published. Only accessible to editors, not public.

### Published
Content visible to site visitors. Live on published site.

### Localization
Content in multiple languages. CMS supports locale-specific content.

## Security Terms

### Authentication
Verifying user identity. "Are you who you say you are?"

### Authorization
Granting permission for authenticated user. "What are you allowed to do?"

### HTTPS
Secure HTTP protocol encrypting data in transit.

### SSL Certificate
Cryptographic certificate enabling HTTPS. Proves domain ownership.

### CORS (Cross-Origin Resource Sharing)
Security policy controlling cross-domain requests. Configured on backend.

### CSRF (Cross-Site Request Forgery)
Attack forcing user to unwanted actions. Prevented with CSRF tokens.

### XSS (Cross-Site Scripting)
Injection of malicious scripts into website. Prevented via input sanitization.

### SQL Injection
Injecting SQL into database queries via unsanitized input.

### Rate Limit
Restricting API access to prevent abuse and ensure fair use.

### Encryption
Converting data to unreadable format using key, reversible only with key.

## Performance Terms

### TTL (Time To Live)
Duration cached data remains valid before refresh needed.

### Cache Hit
Retrieving data from cache instead of computing/fetching.

### Cache Miss
Data not in cache, requiring computation/fetch.

### Bundle Size
Total size of compiled JavaScript/CSS/assets. Affects download and parse time.

### Minification
Removing unnecessary characters from code without changing functionality.

### Tree Shaking
Removing unused code during bundling to reduce size.

### Code Splitting
Dividing code into chunks loaded on-demand rather than all upfront.

### Lazy Loading
Deferring load of resource until actually needed.

### Content Delivery Network (CDN)
Network of servers distributing content geographically for faster delivery.

### Time to First Byte (TTFB)
Time until first response data received after request sent.

### First Contentful Paint (FCP)
Time when first content becomes visible on page.

### Largest Contentful Paint (LCP)
Time when largest visual element becomes visible.

## Development Terms

### Git
Version control system for tracking code changes.

### Commit
Save point for code changes with description.

### Branch
Isolated copy of code for developing features without affecting main.

### Pull Request (PR)
Request to merge changes from one branch to another.

### CI/CD (Continuous Integration/Continuous Deployment)
Automated testing and deployment of code changes.

### Environment Variable
Configuration value loaded at runtime, not hardcoded.

### Environment
Separate instance of application. Common: development, staging, production.

### localhost
Local machine during development. Accessed via 127.0.0.1 or `localhost`.

### Port
Network endpoint on computer. Express default: 3000, API: 443 (HTTPS).

### Logging
Writing events/errors to log file or service for debugging and monitoring.

### Debugging
Identifying and fixing code defects using debugger tools.

### Hot Reload
Automatically refreshing application when code changes.

## Deployment Terms

### Deployment
Moving application from development to production.

### Staging
Environment mirroring production for testing before deployment.

### Production
Live environment accessible to end users.

### Rollback
Reverting to previous version if deployment fails.

### Downtime
Period when service unavailable for maintenance or issues.

### Zero-Downtime Deployment
Deployment without interrupting service.

### Blue-Green Deployment
Running two identical production environments, switching traffic for zero-downtime updates.

### Database Migration
Script modifying database schema (adding tables, columns, etc.).

### Backup
Copy of data for recovery if original is lost/corrupted.

### Monitoring
Continuous observation of system health and performance.

### Alert
Notification triggered when metric exceeds threshold.

### SLA (Service Level Agreement)
Commitment of uptime/performance to users. Example: 99.9% uptime.

## Glossary by Category

### HTTP Methods
- **GET**: Retrieve resource
- **POST**: Create resource
- **PATCH**: Partially update resource
- **PUT**: Replace entire resource
- **DELETE**: Remove resource

### HTTP Status Codes
- **2xx**: Success (200 OK, 201 Created)
- **3xx**: Redirect (301 Moved)
- **4xx**: Client error (400 Bad Request, 404 Not Found)
- **5xx**: Server error (500 Internal Error)

### Common Abbreviations
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **JSON**: JavaScript Object Notation
- **URL**: Uniform Resource Locator
- **HTTP**: HyperText Transfer Protocol
- **DOM**: Document Object Model
- **CSS**: Cascading Style Sheets
- **HTML**: HyperText Markup Language
- **JS**: JavaScript
- **TS**: TypeScript
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **OAuth**: Open Authorization
- **CORS**: Cross-Origin Resource Sharing
- **HTTPS**: HTTP Secure
- **SSL/TLS**: Secure Sockets Layer/Transport Layer Security
