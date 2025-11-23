# Document 4: New Pages Enhancement & Building Strategies

**Status**: ✅ COMPLETE - Production-Ready Page Development Guide

A comprehensive guide to building rich, interactive pages for Webflow Designer extensions and data client apps, with strategies for demo modes, mock data, and professional polish.

---

## Table of Contents

1. [Overview & Philosophy](#overview--philosophy)
2. [Demo Mode Implementation](#demo-mode-implementation)
3. [Mock Data Patterns](#mock-data-patterns)
4. [Page Components & Layouts](#page-components--layouts)
5. [Interactive Features](#interactive-features)
6. [Professional Polish](#professional-polish)
7. [Testing & Quality](#testing--quality)
8. [Performance Optimization](#performance-optimization)

---

## Overview & Philosophy

### Why Pages Matter

Pages are the primary interface users interact with. A well-designed page can:
- Reduce cognitive load
- Guide users to success
- Demonstrate value quickly
- Build confidence in the app
- Enable advanced workflows

### Page Design Principles

1. **Progressive Disclosure**: Show what's needed now, hide complexity
2. **Clear Hierarchy**: Primary actions prominent, secondary tucked away
3. **Responsive**: Works at all breakpoints and sidebar widths
4. **Accessible**: WCAG 2.1 AA compliant
5. **Performant**: Fast interactions, smooth animations
6. **Intuitive**: Familiar patterns, clear workflows
7. **Delightful**: Smooth transitions, helpful feedback

### Example Pages for Different App Types

**Designer Extensions**:
- Dashboard (metrics, status)
- Element Manager (tree view)
- Style Editor (properties)
- Asset Browser (library)
- Settings (configuration)

**Data Client Apps**:
- Dashboard (analytics)
- Collections Manager (CMS)
- Asset Library (media)
- User Management (team)
- Integration Settings (config)

---

## Demo Mode Implementation

### Why Demo Mode?

Demo mode allows:
- Immediate value demonstration
- Testing without account setup
- Onboarding without friction
- Feature exploration risk-free

### Basic Implementation

```typescript
// Demo mode detection
const isDemoMode = localStorage.getItem('demo-mode') === 'true'

// Feature flag
function useDemo(feature: string, demoValue: any, realValue: any) {
  return isDemoMode ? demoValue : realValue
}

// Example
const projects = useDemo(
  'projects',
  MOCK_PROJECTS,
  await fetchUserProjects()
)
```

### Entry Point Pattern

```typescript
// App.tsx
interface AppProps {
  mode: 'demo' | 'live'
}

export function App({ mode }: AppProps) {
  const [authToken, setAuthToken] = useState<string | null>(null)

  // Skip auth in demo mode
  if (mode === 'demo') {
    return <DemoAppShell />
  }

  if (!authToken) {
    return <LoginFlow onSuccess={setAuthToken} />
  }

  return <MainApp token={authToken} />
}
```

### Demo Data Loading

```typescript
// Load mock data on init
async function initializeDemo(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Load all demo data
  const [projects, assets, users] = await Promise.all([
    loadDemoProjects(),
    loadDemoAssets(),
    loadDemoUsers()
  ])

  // Store in state/cache
  setDemoData({ projects, assets, users })

  // Show ready state
  showNotification('Demo loaded! Explore features...')
}
```

### Demo Limitations

Communicate what's not available in demo:

```typescript
// Disable save in demo
<Button
  onClick={handleSave}
  disabled={isDemoMode}
  title={isDemoMode ? "Saving disabled in demo mode" : ""}
>
  Save
</Button>

// Show helpful message
{isDemoMode && (
  <Alert type="info">
    <p>You're in <strong>demo mode</strong>. Create an account to save your changes.</p>
  </Alert>
)}
```

### Switching from Demo to Live

```typescript
// Smooth transition
async function transitionToLiveMode(authToken: string) {
  // Save any demo data user wants to keep
  const savedData = await exportDemoData()

  // Switch mode
  localStorage.removeItem('demo-mode')
  setAuthToken(authToken)

  // Import saved data
  if (savedData.length > 0) {
    await importData(savedData)
    showNotification('Your demo data has been imported!')
  }

  // Refresh UI
  window.location.reload()
}
```

---

## Mock Data Patterns

### Data Structure Philosophy

Mock data should:
- Match production schema exactly
- Include realistic variations
- Handle edge cases
- Be easy to extend

### Basic Mock Generator

```typescript
// Generate realistic IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Generate timestamps
function generateDate(daysAgo: number = 0): Date {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
}

// Realistic variation
function generateVariation<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
```

### Project Mock Data

```typescript
interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'archived' | 'draft'
  owner: User
  collaborators: User[]
  assets: Asset[]
  pages: number
  visibility: 'private' | 'shared' | 'public'
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'E-commerce Platform',
    description: 'Complete redesign for modern marketplace',
    createdAt: generateDate(30),
    updatedAt: generateDate(2),
    status: 'active',
    owner: MOCK_USERS[0],
    collaborators: [MOCK_USERS[1], MOCK_USERS[2]],
    assets: MOCK_ASSETS.slice(0, 5),
    pages: 12,
    visibility: 'shared'
  },
  {
    id: 'proj-002',
    name: 'SaaS Dashboard',
    description: 'Admin interface for analytics platform',
    createdAt: generateDate(60),
    updatedAt: generateDate(5),
    status: 'active',
    owner: MOCK_USERS[1],
    collaborators: [MOCK_USERS[0]],
    assets: MOCK_ASSETS.slice(5, 10),
    pages: 8,
    visibility: 'private'
  }
  // ... more projects
]
```

### User Mock Data

```typescript
interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
  lastActive: Date
}

const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    role: 'owner',
    joinedAt: generateDate(90),
    lastActive: generateDate(0)
  },
  {
    id: 'user-002',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    role: 'editor',
    joinedAt: generateDate(45),
    lastActive: generateDate(1)
  }
  // ... more users
]
```

### Asset Mock Data

```typescript
interface Asset {
  id: string
  name: string
  type: 'image' | 'icon' | 'video' | 'document'
  url: string
  size: number
  createdAt: Date
  tags: string[]
  folder: string
}

const MOCK_ASSETS: Asset[] = [
  {
    id: 'asset-001',
    name: 'hero-image.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
    size: 2048000,
    createdAt: generateDate(15),
    tags: ['hero', 'homepage', 'banner'],
    folder: '/images'
  },
  {
    id: 'asset-002',
    name: 'icon-check.svg',
    type: 'icon',
    url: 'https://cdn.example.com/icons/check.svg',
    size: 1024,
    createdAt: generateDate(30),
    tags: ['icon', 'checkmark', 'ui'],
    folder: '/icons'
  }
  // ... more assets
]
```

### Activity/History Data

```typescript
interface Activity {
  id: string
  type: 'created' | 'updated' | 'deleted' | 'shared' | 'commented'
  user: User
  target: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    type: 'updated',
    user: MOCK_USERS[0],
    target: 'proj-001',
    description: 'Updated homepage hero section',
    timestamp: generateDate(0),
    metadata: { section: 'hero', changes: 3 }
  },
  {
    id: 'act-002',
    type: 'shared',
    user: MOCK_USERS[0],
    target: 'proj-001',
    description: 'Shared project with Bob Smith',
    timestamp: generateDate(1),
    metadata: { sharedWith: 'user-002', permissions: 'edit' }
  }
  // ... more activities
]
```

---

## Page Components & Layouts

### Dashboard Page

```typescript
// Dashboard.tsx
interface DashboardProps {
  stats: {
    projectsTotal: number
    assetsTotal: number
    collaborators: number
    lastUpdate: Date
  }
  recentActivity: Activity[]
}

export function Dashboard({ stats, recentActivity }: DashboardProps) {
  return (
    <Page title="Dashboard">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <StatsSection stats={stats} />

        {/* Activity Feed */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Button primary>Create New Project</Button>
            <Button>Browse Templates</Button>
          </div>
        </div>
      </div>
    </Page>
  )
}

// Stats Card Component
interface StatsCardProps {
  label: string
  value: number | string
  icon: ReactNode
  trend?: 'up' | 'down'
  percentage?: number
}

function StatsCard({ label, value, icon, trend, percentage }: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <p className="stats-value">{value}</p>
        {percentage && (
          <p className={`stats-trend trend-${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {percentage}% from last month
          </p>
        )}
      </div>
    </div>
  )
}
```

### Element Manager (Tree View)

```typescript
// ElementManager.tsx
interface ElementManagerProps {
  elements: Element[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ElementManager({
  elements,
  selectedId,
  onSelect,
  onDelete
}: ElementManagerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded)
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
    setExpanded(newExpanded)
  }

  return (
    <Page title="Elements">
      <div className="element-tree">
        {elements.map(el => (
          <ElementNode
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            isExpanded={expanded.has(el.id)}
            onSelect={onSelect}
            onToggleExpand={toggleExpand}
            onDelete={onDelete}
          />
        ))}
      </div>
    </Page>
  )
}

// Element Node Component
interface ElementNodeProps {
  element: Element
  isSelected: boolean
  isExpanded: boolean
  onSelect: (id: string) => void
  onToggleExpand: (id: string) => void
  onDelete: (id: string) => void
}

function ElementNode({
  element,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onDelete
}: ElementNodeProps) {
  const hasChildren = element.children && element.children.length > 0

  return (
    <div className="element-node">
      <div
        className={`element-header ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(element.id)}
      >
        {hasChildren && (
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(element.id)
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <span className="element-icon">{getElementIcon(element.tag)}</span>
        <span className="element-name">{element.name || element.tag}</span>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(element.id)
          }}
        >
          ×
        </button>
      </div>

      {isExpanded && hasChildren && (
        <div className="element-children">
          {element.children!.map(child => (
            <ElementNode
              key={child.id}
              element={child}
              isSelected={selectedId === child.id}
              isExpanded={expanded.has(child.id)}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Asset Browser

```typescript
// AssetBrowser.tsx
interface AssetBrowserProps {
  assets: Asset[]
  folders: string[]
  selectedFolder: string
  onSelectFolder: (folder: string) => void
  onSelectAsset: (asset: Asset) => void
  onUpload: (file: File) => void
}

export function AssetBrowser({
  assets,
  folders,
  selectedFolder,
  onSelectFolder,
  onSelectAsset,
  onUpload
}: AssetBrowserProps) {
  const filteredAssets = assets.filter(a => a.folder === selectedFolder)

  return (
    <Page title="Assets">
      <div className="asset-browser">
        {/* Sidebar - Folders */}
        <aside className="asset-sidebar">
          <h3>Folders</h3>
          <nav className="folder-tree">
            {folders.map(folder => (
              <button
                key={folder}
                className={`folder-btn ${selectedFolder === folder ? 'active' : ''}`}
                onClick={() => onSelectFolder(folder)}
              >
                📁 {folder}
              </button>
            ))}
          </nav>

          {/* Upload Button */}
          <UploadDropzone onUpload={onUpload} />
        </aside>

        {/* Main - Grid */}
        <main className="asset-grid">
          {filteredAssets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onClick={() => onSelectAsset(asset)}
            />
          ))}
        </main>
      </div>
    </Page>
  )
}

// Asset Card Component
function AssetCard({ asset, onClick }: { asset: Asset; onClick: () => void }) {
  return (
    <div className="asset-card" onClick={onClick}>
      <div className="asset-thumbnail">
        {asset.type === 'image' && (
          <img src={asset.url} alt={asset.name} />
        )}
        {asset.type === 'icon' && (
          <div className="icon-preview">
            <img src={asset.url} alt={asset.name} />
          </div>
        )}
        {asset.type === 'video' && (
          <div className="video-placeholder">▶️</div>
        )}
      </div>
      <div className="asset-info">
        <p className="asset-name">{asset.name}</p>
        <p className="asset-meta">{formatFileSize(asset.size)}</p>
      </div>
    </div>
  )
}
```

---

## Interactive Features

### Search & Filter

```typescript
// SearchableList.tsx
interface SearchableListProps<T> {
  items: T[]
  searchFields: (keyof T)[]
  filterOptions: FilterOption[]
  onSearch: (query: string) => void
  renderItem: (item: T) => ReactNode
}

export function SearchableList<T>({
  items,
  searchFields,
  filterOptions,
  onSearch,
  renderItem
}: SearchableListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = searchFields.some(field => {
      const value = String(item[field]).toLowerCase()
      return value.includes(searchQuery.toLowerCase())
    })

    // Tag filter
    const matchesFilters = activeFilters.size === 0 ||
      filterOptions.some(opt =>
        activeFilters.has(opt.id) &&
        opt.predicate(item)
      )

    return matchesSearch && matchesFilters
  })

  return (
    <div className="searchable-list">
      <div className="search-header">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            onSearch(e.target.value)
          }}
          className="search-input"
        />

        <div className="filter-tags">
          {filterOptions.map(option => (
            <button
              key={option.id}
              className={`filter-tag ${activeFilters.has(option.id) ? 'active' : ''}`}
              onClick={() => {
                const newFilters = new Set(activeFilters)
                newFilters.has(option.id)
                  ? newFilters.delete(option.id)
                  : newFilters.add(option.id)
                setActiveFilters(newFilters)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="list-content">
        {filteredItems.length === 0 ? (
          <EmptyState message="No items match your search" />
        ) : (
          filteredItems.map(item => renderItem(item))
        )}
      </div>
    </div>
  )
}
```

### Drag & Drop

```typescript
// DraggableList.tsx
interface DraggableListProps<T> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
}

export function DraggableList<T>({
  items,
  onReorder,
  renderItem
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [orderedItems, setOrderedItems] = useState(items)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      const newItems = [...orderedItems]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(index, 0, draggedItem)
      setOrderedItems(newItems)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    onReorder(orderedItems)
    setDraggedIndex(null)
  }

  return (
    <div className="draggable-list">
      {orderedItems.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`draggable-item ${draggedIndex === index ? 'dragging' : ''}`}
        >
          <span className="drag-handle">⋮⋮</span>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}
```

### Pagination

```typescript
// Paginated.tsx
interface PaginatedProps<T> {
  items: T[]
  itemsPerPage: number
  renderItem: (item: T) => ReactNode
}

export function Paginated<T>({
  items,
  itemsPerPage,
  renderItem
}: PaginatedProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="paginated">
      <div className="items">
        {paginatedItems.map((item, index) => (
          <div key={startIndex + index}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

---

## Professional Polish

### Loading States

```typescript
// LoadingPlaceholder.tsx - Skeleton loaders
function ProjectCardSkeleton() {
  return (
    <div className="project-card skeleton">
      <div className="skeleton-thumbnail"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
      </div>
    </div>
  )
}

// Usage
{isLoading ? (
  <div className="projects-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
) : (
  <ProjectList projects={projects} />
)}
```

### Empty States

```typescript
// EmptyState.tsx
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <button onClick={action.onClick} className="empty-action">
          {action.label}
        </button>
      )}
    </div>
  )
}

// Usage
{items.length === 0 ? (
  <EmptyState
    icon="📁"
    title="No projects yet"
    description="Create your first project to get started"
    action={{
      label: 'Create Project',
      onClick: handleCreate
    }}
  />
) : (
  <ProjectList projects={items} />
)}
```

### Error States

```typescript
// ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Success Notifications

```typescript
// Toast notifications
interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

function Toast({ message, type, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
        {type === 'warning' && '⚠'}
        <span>{message}</span>
      </div>
    </div>
  )
}

// Global toast manager
const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const show = (props: ToastProps) => {
    const id = Math.random()
    setToasts(prev => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, props.duration || 3000)
  }

  return { show, toasts }
}
```

### Animations & Transitions

```typescript
// Smooth animations
const pageTransitionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

// Fade in cards
function ProjectCard({ project }) {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.2 }}
    >
      <div className="project-card">
        {/* Card content */}
      </div>
    </motion.div>
  )
}

// Loading spinner
function Spinner({ size = 'md' }) {
  return (
    <motion.div
      className={`spinner spinner-${size}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}
```

---

## Testing & Quality

### Component Testing

```typescript
// ProjectCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'Test description',
    status: 'active' as const
  }

  it('renders project information', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const onSelect = jest.fn()
    render(<ProjectCard project={mockProject} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(mockProject.id)
  })

  it('shows active status badge', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Active')).toHaveClass('badge-active')
  })
})
```

### Accessibility Testing

```typescript
// Keyboard navigation
function AccessibleList({ items }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setSelectedIndex(i => Math.max(0, i - 1))
        break
      case 'ArrowDown':
        setSelectedIndex(i => Math.min(items.length - 1, i + 1))
        break
      case 'Enter':
        handleSelect(items[selectedIndex])
        break
    }
  }

  return (
    <ul
      role="listbox"
      onKeyDown={handleKeyDown}
      aria-label="Items"
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === selectedIndex}
          tabIndex={index === selectedIndex ? 0 : -1}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

### Visual Regression Testing

```bash
# Playwright visual testing
npx playwright test --headed

# Update baselines when design intentionally changes
npx playwright test --update-snapshots
```

---

## Performance Optimization

### Virtual Scrolling (Large Lists)

```typescript
// VirtualList.tsx
import { FixedSizeList } from 'react-window'

interface VirtualListProps<T> {
  items: T[]
  itemSize: number
  renderItem: (item: T, index: number) => ReactNode
}

export function VirtualList<T>({
  items,
  itemSize,
  renderItem
}: VirtualListProps<T>) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={itemSize}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {renderItem(items[index], index)}
        </div>
      )}
    </FixedSizeList>
  )
}
```

### Code Splitting

```typescript
// Load components only when needed
const Dashboard = lazy(() => import('./Dashboard'))
const AssetBrowser = lazy(() => import('./AssetBrowser'))
const Settings = lazy(() => import('./Settings'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assets" element={<AssetBrowser />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
```

### Memoization

```typescript
// Prevent unnecessary re-renders
const ProjectCard = memo(
  ({ project, onSelect }: ProjectCardProps) => (
    <div onClick={() => onSelect(project.id)}>
      {project.name}
    </div>
  ),
  (prev, next) => prev.project.id === next.project.id
)

const ProjectList = memo(({ projects }: ProjectListProps) => (
  <div>
    {projects.map(p => (
      <ProjectCard key={p.id} project={p} />
    ))}
  </div>
))
```

### Data Fetching

```typescript
// SWR for efficient data fetching
import useSWR from 'swr'

function ProjectList() {
  const { data: projects, isLoading, error } = useSWR(
    '/api/projects',
    fetcher,
    { revalidateOnFocus: false }
  )

  if (error) return <div>Error loading projects</div>
  if (isLoading) return <Spinner />

  return (
    <div>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  )
}
```

---

## Best Practices Summary

✅ **Do**:
- Use progressive disclosure
- Show loading/empty states
- Provide clear feedback
- Test with real data
- Optimize performance
- Support keyboard navigation
- Handle errors gracefully
- Make it beautiful

❌ **Don't**:
- Ignore loading states
- Show errors without help
- Use tiny fonts
- Block user input
- Have memory leaks
- Rely on mouse only
- Deploy untested code
- Neglect performance

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance Metrics](https://web.dev/performance/)
- [Testing Library Docs](https://testing-library.com/)

---

**Last Updated**: November 23, 2025
**Status**: Ready for Production
**Next Step**: Implement additional templates and examples
