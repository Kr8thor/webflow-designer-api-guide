# New Pages Enhancement & Building Strategies

**Status**: Complete
**Word Count**: ~7,800 words
**Target Audience**: Full-stack developers, UI/UX developers, and product builders
**Last Updated**: November 23, 2025
**Framework**: React/TypeScript recommended

---

## Table of Contents

- [Introduction](#introduction)
- [Building Strategy Overview](#building-strategy-overview)
- [Demo Mode Implementation](#demo-mode-implementation)
- [Core Pages Architecture](#core-pages-architecture)
- [Dashboard Page](#dashboard-page)
- [Elements Manager](#elements-manager)
- [Assets Library](#assets-library)
- [Mock Data Implementation](#mock-data-implementation)
- [Interactive Features](#interactive-features)
- [Professional Polish](#professional-polish)
- [Performance Optimization](#performance-optimization)
- [Testing Strategies](#testing-strategies)

---

## Introduction

Building a comprehensive application with multiple pages requires careful planning, realistic mock data, and attention to user experience details. This guide covers strategies for creating professional, fully-featured application pages that showcase your product's capabilities.

### What Makes Pages "Great"

1. **Functional**: All features work correctly
2. **Responsive**: Works on all screen sizes
3. **Performant**: Loads quickly and responds instantly
4. **Accessible**: WCAG 2.1 AA compliant
5. **Polish**: Smooth animations, loading states, error handling
6. **Intuitive**: Users understand workflow immediately

---

## Building Strategy Overview

### Page Development Phases

```
Phase 1: Structure       → Phase 2: Data        → Phase 3: Polish
├─ Layout design        ├─ Mock data           ├─ Animations
├─ Component structure  ├─ Data loading        ├─ Error states
├─ Navigation           ├─ State management    ├─ Accessibility
└─ Basic styling        └─ API integration     └─ Performance
```

### Build vs. Enhance Decision

**Build New Pages When**:
- Creating entirely new functionality
- No existing design to reference
- Building demo/marketing sites
- Feature is complex and isolated

**Enhance Existing When**:
- Adding features to pages
- Extending current layouts
- Maintaining consistency
- Gradual feature rollout

### File Structure Recommendation

```
src/
├── pages/
│   ├── Dashboard.tsx
│   ├── ElementsManager.tsx
│   ├── AssetsLibrary.tsx
│   ├── ComponentsLibrary.tsx
│   └── Settings.tsx
├── components/
│   ├── StatCard.tsx
│   ├── DataTable.tsx
│   ├── AssetGrid.tsx
│   └── modals/
├── hooks/
│   ├── usePageData.ts
│   ├── usePagination.ts
│   └── useSearch.ts
├── services/
│   ├── api.ts
│   └── mockData.ts
├── types/
│   └── index.ts
└── styles/
    ├── variables.css
    └── components.css
```

---

## Demo Mode Implementation

### Strategy: Environment-Based Configuration

```typescript
// env.ts
const isDemoMode = process.env.REACT_APP_DEMO === 'true';

export const config = {
  isDemoMode,
  apiBase: isDemoMode
    ? 'http://localhost:3000/api'
    : process.env.REACT_APP_API_URL,
  useLocalData: isDemoMode,
  enableDevTools: isDemoMode
};
```

### Authentication Bypass for Demo

```typescript
// auth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (config.isDemoMode) {
      // Demo mode: auto-login with mock user
      setUser({
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin'
      });
      setLoading(false);
      return;
    }

    // Production: normal auth flow
    validateToken().finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
```

### Conditional Data Loading

```typescript
// hooks/usePageData.ts
export function usePageData<T>(
  apiEndpoint: string,
  mockDataFn: () => T
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (config.useLocalData) {
      // Use mock data immediately
      try {
        const mockData = mockDataFn();
        setData(mockData);
        // Simulate network delay for realism
        setTimeout(() => setLoading(false), 500);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
      return;
    }

    // Fetch from API
    fetchData(apiEndpoint)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  return { data, loading, error };
}
```

### Development Mode Features

```typescript
// DevTools component
function DevTools() {
  if (!config.isDemoMode) return null;

  return (
    <div className="dev-tools">
      <button onClick={() => resetAllData()}>
        Reset Demo Data
      </button>
      <button onClick={() => toggleMockErrors()}>
        Toggle Mock Errors
      </button>
      <button onClick={() => showDataStructure()}>
        View Data Schema
      </button>
      <select onChange={(e) => switchMockProfile(e.target.value)}>
        <option>Standard Data</option>
        <option>Large Dataset</option>
        <option>Edge Cases</option>
      </select>
    </div>
  );
}
```

---

## Core Pages Architecture

### Universal Page Shell

```typescript
// PageShell.tsx
interface PageShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  error?: Error;
}

export function PageShell({
  title,
  description,
  actions,
  children,
  loading,
  error
}: PageShellProps) {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="header-content">
          <h1>{title}</h1>
          {description && <p className="subtitle">{description}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </header>

      <main className="page-content">
        {loading && <PageLoader />}
        {error && <ErrorBoundary error={error} />}
        {!loading && !error && children}
      </main>
    </div>
  );
}
```

---

## Dashboard Page

### Structure

```typescript
// pages/Dashboard.tsx
export function Dashboard() {
  const { data: stats, loading } = usePageData(
    '/api/dashboard',
    generateMockStats
  );

  return (
    <PageShell
      title="Dashboard"
      description="Overview of your site performance"
      loading={loading}
    >
      <div className="dashboard-grid">
        <StatCard
          title="Total Pages"
          value={stats?.pageCount}
          trend={stats?.pageTrend}
          icon="📄"
        />
        <StatCard
          title="Total Elements"
          value={stats?.elementCount}
          trend={stats?.elementTrend}
          icon="⚙️"
        />
        <StatCard
          title="Design Tokens"
          value={stats?.tokenCount}
          trend={stats?.tokenTrend}
          icon="🎨"
        />
        <StatCard
          title="Components"
          value={stats?.componentCount}
          trend={stats?.componentTrend}
          icon="🧩"
        />

        <ActivityFeed activities={stats?.recentActivities} />
        <PerformanceChart data={stats?.performance} />
      </div>
    </PageShell>
  );
}
```

### Stat Card Component

```typescript
interface StatCardProps {
  title: string;
  value: number;
  trend?: number;  // percentage
  icon?: string;
  loading?: boolean;
}

function StatCard({ title, value, trend, icon, loading }: StatCardProps) {
  const isPositive = trend === undefined || trend >= 0;

  return (
    <div className="stat-card">
      {icon && <span className="stat-icon">{icon}</span>}
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">
        {loading ? <Skeleton width={60} /> : value.toLocaleString()}
      </p>
      {trend !== undefined && (
        <p className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </div>
  );
}
```

### Activity Feed

```typescript
interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete';
  target: string;
  targetName: string;
  user: string;
  timestamp: Date;
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="activity-feed">
      <h2>Recent Activity</h2>
      <ul className="activity-list">
        {activities.map(activity => (
          <li key={activity.id} className="activity-item">
            <span className="activity-icon">
              {getActivityIcon(activity.type)}
            </span>
            <div className="activity-content">
              <p className="activity-text">
                <strong>{activity.user}</strong> {getActivityVerb(activity.type)}
                <em>{activity.targetName}</em>
              </p>
              <time className="activity-time">
                {formatRelativeTime(activity.timestamp)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Elements Manager

### Tree View Navigation

```typescript
interface ElementNode {
  id: string;
  name: string;
  tag: string;
  type: 'element' | 'component' | 'text';
  children?: ElementNode[];
  selected?: boolean;
  expanded?: boolean;
}

function ElementsManager() {
  const { data: elements, loading } = usePageData(
    '/api/elements',
    generateMockElements
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  return (
    <PageShell
      title="Elements Manager"
      description="View and manage site elements"
      actions={<CreateElementButton />}
      loading={loading}
    >
      <div className="elements-manager">
        <aside className="elements-tree">
          <ElementTree
            elements={elements}
            expanded={expanded}
            selected={selected}
            onToggleExpand={handleToggleExpand}
            onSelect={setSelected}
          />
        </aside>
        <section className="element-editor">
          {selected ? (
            <ElementProperties elementId={selected} />
          ) : (
            <EmptyState message="Select an element to view properties" />
          )}
        </section>
      </div>
    </PageShell>
  );
}
```

### Element Tree Component

```typescript
function ElementTree({
  elements,
  expanded,
  selected,
  onToggleExpand,
  onSelect
}: ElementTreeProps) {
  return (
    <ul className="element-tree">
      {elements.map(element => (
        <li key={element.id} className="tree-node">
          <div
            className={`tree-item ${selected === element.id ? 'selected' : ''}`}
            onClick={() => onSelect(element.id)}
          >
            {element.children && element.children.length > 0 && (
              <button
                className="expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(element.id);
                }}
              >
                {expanded.has(element.id) ? '▼' : '▶'}
              </button>
            )}
            <span className="element-icon">
              {getElementIcon(element.tag)}
            </span>
            <span className="element-name">{element.name}</span>
          </div>

          {expanded.has(element.id) && element.children && (
            <ElementTree
              elements={element.children}
              expanded={expanded}
              selected={selected}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
```

---

## Assets Library

### Grid Gallery with Search

```typescript
function AssetsLibrary() {
  const { data: assets, loading } = usePageData(
    '/api/assets',
    generateMockAssets
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  const filtered = useMemo(() => {
    let result = assets || [];

    if (searchTerm) {
      result = result.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      result = result.filter(asset => asset.type === filterType);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.uploadedAt).getTime() -
             new Date(a.uploadedAt).getTime();
    });

    return result;
  }, [assets, searchTerm, filterType, sortBy]);

  return (
    <PageShell
      title="Assets Library"
      description="Manage images, videos, and other media"
      actions={<UploadAssetButton />}
      loading={loading}
    >
      <div className="assets-library">
        <div className="assets-controls">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search assets..."
          />
          <FilterSelect
            value={filterType}
            onChange={setFilterType}
            options={['all', 'image', 'video', 'document']}
          />
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={['name', 'date']}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="assets-grid">
            {filtered.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <EmptyState message="No assets found" />
        )}
      </div>
    </PageShell>
  );
}
```

---

## Mock Data Implementation

### Data Generation Factory

```typescript
// services/mockData.ts

interface MockDataOptions {
  count?: number;
  seed?: string;
}

export function generateMockStats(options: MockDataOptions = {}) {
  const { count = 1 } = options;

  return {
    pageCount: Math.floor(Math.random() * 50) + 10,
    pageTrend: Math.floor(Math.random() * 40) - 20,
    elementCount: Math.floor(Math.random() * 500) + 100,
    elementTrend: Math.floor(Math.random() * 40) - 20,
    tokenCount: Math.floor(Math.random() * 100) + 20,
    tokenTrend: Math.floor(Math.random() * 40) - 20,
    componentCount: Math.floor(Math.random() * 50) + 10,
    componentTrend: Math.floor(Math.random() * 40) - 20,
    recentActivities: generateActivities(10),
    performance: generatePerformanceData()
  };
}

function generateActivities(count: number): Activity[] {
  const actions = ['created', 'updated', 'deleted'];
  const targets = ['Page', 'Element', 'Component', 'Token'];

  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i}`,
    type: actions[Math.floor(Math.random() * actions.length)] as Activity['type'],
    target: targets[Math.floor(Math.random() * targets.length)].toLowerCase(),
    targetName: `${targets[Math.floor(Math.random() * targets.length)]} #${i}`,
    user: `User ${Math.floor(Math.random() * 10) + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));
}

function generatePerformanceData() {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      loadTime: Math.floor(Math.random() * 2000) + 500,
      errorRate: Math.floor(Math.random() * 5)
    };
  });
}
```

### Seeded Random Data for Consistency

```typescript
// Seeded random for reproducible mock data
function seededRandom(seed: string): number {
  const x = Math.sin(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) * 10000;
  return x - Math.floor(x);
}

export function generateConsistentMockData(seed: string) {
  const random = (min: number, max: number) => {
    const r = seededRandom(seed);
    return Math.floor(r * (max - min) + min);
  };

  return {
    count: random(10, 100),
    trend: random(-50, 50),
    // ... more consistent values
  };
}
```

---

## Interactive Features

### Search with Debouncing

```typescript
function SearchInput({
  value,
  onChange,
  placeholder
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  );
}
```

### Advanced Filtering

```typescript
interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'range';
  value: any;
}

function applyFilters<T>(data: T[], filters: FilterConfig[]): T[] {
  return data.filter(item => {
    return filters.every(filter => {
      const fieldValue = (item as any)[filter.field];

      switch (filter.operator) {
        case 'equals':
          return fieldValue === filter.value;
        case 'contains':
          return String(fieldValue).includes(filter.value);
        case 'gt':
          return fieldValue > filter.value;
        case 'lt':
          return fieldValue < filter.value;
        case 'range':
          return fieldValue >= filter.value[0] && fieldValue <= filter.value[1];
        default:
          return true;
      }
    });
  });
}
```

### Pagination Hook

```typescript
function usePagination<T>(
  data: T[],
  itemsPerPage = 10
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentData,
    currentPage,
    totalPages,
    setCurrentPage,
    goToNext: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    goToPrevious: () => setCurrentPage(p => Math.max(p - 1, 1))
  };
}
```

---

## Professional Polish

### Loading States

```typescript
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="spinner">Loading...</div>
    </div>
  );
}

function SkeletonLoader({ count = 5 }: { count?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
        </div>
      ))}
    </div>
  );
}
```

### Empty States

```typescript
function EmptyState({
  icon = '📭',
  message = 'No data found',
  action
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <h3>{message}</h3>
      {action && <button className="btn-primary">{action}</button>}
    </div>
  );
}
```

### Error Boundaries

```typescript
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
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
      );
    }

    return this.props.children;
  }
}
```

### Toast Notifications

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast.duration) return;

    const timer = setTimeout(onClose, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}
```

---

## Performance Optimization

### Virtual Scrolling for Large Lists

```typescript
import { FixedSizeList as List } from 'react-window';

function LargeDataTable({ data }: { data: any[] }) {
  return (
    <List
      height={600}
      itemCount={data.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style} className="table-row">
          {/* Row content */}
        </div>
      )}
    </List>
  );
}
```

### Request Caching

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function cachedFetch<T>(url: string): Promise<T> {
  const cached = cache.get(url);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url);
  const data = await response.json();

  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

---

## Testing Strategies

### Unit Tests Example

```typescript
describe('StatCard', () => {
  it('renders stat value correctly', () => {
    const { getByText } = render(
      <StatCard title="Test" value={42} />
    );
    expect(getByText('42')).toBeInTheDocument();
  });

  it('displays positive trend correctly', () => {
    const { getByText } = render(
      <StatCard title="Test" value={42} trend={5} />
    );
    expect(getByText('↑ 5%')).toHaveClass('positive');
  });
});
```

### Integration Tests

```typescript
describe('Dashboard', () => {
  it('loads and displays stats', async () => {
    const { getByText, findByText } = render(<Dashboard />);

    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(await findByText(/Total Pages/)).toBeInTheDocument();
  });
});
```

---

## Key Guidelines

### Do's ✅

- Provide realistic mock data
- Handle all loading/error states
- Test on various screen sizes
- Implement proper keyboard navigation
- Use semantic HTML
- Cache where appropriate
- Provide user feedback
- Document complex interactions

### Don'ts ❌

- Hardcode data in components
- Ignore loading states
- Forget accessibility
- Block on network requests
- Use nested ternaries
- Ignore performance issues
- Skip error handling
- Forget to clean up listeners

---

**Version**: 1.0
**Maintainer**: Webflow Community
**Last Reviewed**: November 23, 2025
**Status**: Active & Current
