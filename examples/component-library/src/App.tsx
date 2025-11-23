import React, { useState, useCallback } from 'react'
import { useNotification } from '../../shared/context/NotificationContext'

interface Component {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  instances: number
  createdAt: Date
}

const DEFAULT_COMPONENTS: Component[] = [
  {
    id: '1',
    name: 'Button Primary',
    description: 'Primary call-to-action button with hover states',
    category: 'Buttons',
    tags: ['ui', 'button', 'interactive', 'primary'],
    instances: 12,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Card Base',
    description: 'Base card component for content display',
    category: 'Cards',
    tags: ['ui', 'card', 'container'],
    instances: 8,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Input Field',
    description: 'Reusable text input with validation styles',
    category: 'Forms',
    tags: ['form', 'input', 'interactive'],
    instances: 15,
    createdAt: new Date()
  }
]

export default function App() {
  const [components, setComponents] = useState<Component[]>(DEFAULT_COMPONENTS)
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(components[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [message, setMessage] = useState('')

  const { showSuccess, showError, showInfo } = useNotification()

  const categories = ['all', ...new Set(components.map(c => c.category))]

  const filteredComponents = components.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const createComponent = useCallback((name: string, description: string, category: string, tags: string[]) => {
    try {
      if (!name.trim()) {
        showError('Component name cannot be empty')
        return
      }

      const newComponent: Component = {
        id: Date.now().toString(),
        name,
        description,
        category,
        tags,
        instances: 0,
        createdAt: new Date()
      }
      setComponents([...components, newComponent])
      setSelectedComponent(newComponent)
      setMessage(`✅ Created component: ${name}`)
      showSuccess(`Created component: ${name}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create component'
      showError(errorMessage)
    }
  }, [components, showSuccess, showError])

  const cloneComponent = useCallback((id: string, newName: string) => {
    try {
      if (!newName.trim()) {
        showError('Component name cannot be empty')
        return
      }

      const original = components.find(c => c.id === id)
      if (!original) {
        showError('Component not found')
        return
      }

      const cloned: Component = {
        ...original,
        id: Date.now().toString(),
        name: newName,
        instances: 0,
        createdAt: new Date()
      }
      setComponents([...components, cloned])
      setSelectedComponent(cloned)
      setMessage(`✅ Cloned: ${newName}`)
      showSuccess(`Cloned component: ${newName}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clone component'
      showError(errorMessage)
    }
  }, [components, showSuccess, showError])

  const deleteComponent = useCallback((id: string) => {
    try {
      const comp = components.find(c => c.id === id)
      if (!comp) {
        showError('Component not found')
        return
      }

      setComponents(components.filter(c => c.id !== id))
      setSelectedComponent(null)
      setMessage(`✅ Deleted: ${comp.name}`)
      showSuccess(`Deleted component: ${comp.name}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete component'
      showError(errorMessage)
    }
  }, [components, showSuccess, showError])

  const updateInstances = (id: string, count: number) => {
    const updated = components.map(c => c.id === id ? { ...c, instances: count } : c)
    setComponents(updated)
    const comp = updated.find(c => c.id === id)
    if (comp) setSelectedComponent(comp)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🧩 Component Library</h1>
        <p>Create and manage reusable components</p>
      </header>

      {message && <div className="message">{message}<button className="close-btn" onClick={() => setMessage('')}>×</button></div>}

      <div className="container">
        <aside className="sidebar">
          <div className="search-area">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <h3>Category</h3>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="components-list">
            {filteredComponents.map(comp => (
              <button
                key={comp.id}
                className={`component-btn ${selectedComponent?.id === comp.id ? 'active' : ''}`}
                onClick={() => setSelectedComponent(comp)}
              >
                <div className="comp-name">{comp.name}</div>
                <div className="comp-meta">{comp.instances} instances</div>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              const name = prompt('Component name:')
              if (name) {
                const desc = prompt('Description:') || ''
                const cat = prompt('Category:') || 'Other'
                createComponent(name, desc, cat, [])
              }
            }}
          >
            + New Component
          </button>
        </aside>

        <main className="main">
          {selectedComponent ? (
            <div className="component-detail">
              <div className="detail-header">
                <div>
                  <h2>{selectedComponent.name}</h2>
                  <p className="category-badge" style={{ backgroundColor: getCategoryColor(selectedComponent.category) }}>
                    {selectedComponent.category}
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const newName = prompt('New component name:', selectedComponent.name + ' Copy')
                      if (newName) cloneComponent(selectedComponent.id, newName)
                    }}
                  >
                    Clone
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteComponent(selectedComponent.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="description">
                <h3>Description</h3>
                <p>{selectedComponent.description}</p>
              </div>

              <div className="stats-section">
                <div className="stat-card">
                  <div className="stat-label">Active Instances</div>
                  <div className="stat-value">{selectedComponent.instances}</div>
                  <input
                    type="number"
                    min="0"
                    value={selectedComponent.instances}
                    onChange={(e) => updateInstances(selectedComponent.id, parseInt(e.target.value) || 0)}
                    className="stat-input"
                  />
                </div>

                <div className="stat-card">
                  <div className="stat-label">Created</div>
                  <div className="stat-value">{selectedComponent.createdAt.toLocaleDateString()}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Tags</div>
                  <div className="tags">
                    {selectedComponent.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="usage-guide">
                <h3>Usage Guide</h3>
                <div className="code-example">
                  <pre><code>{`// Import component
import { ${selectedComponent.name.replace(/ /g, '')} } from '@components'

// Use in your design
<${selectedComponent.name.replace(/ /g, '')}
  variant="default"
  size="md"
/>`}</code></pre>
                </div>
              </div>

              <div className="design-system">
                <h3>Design System</h3>
                <div className="ds-info">
                  <p><strong>Component Type:</strong> {selectedComponent.category}</p>
                  <p><strong>Status:</strong> <span className="badge badge-success">Production Ready</span></p>
                  <p><strong>Accessibility:</strong> <span className="badge badge-success">WCAG 2.1 AA</span></p>
                  <p><strong>Responsive:</strong> <span className="badge badge-success">Yes</span></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No component selected</p>
              <p className="hint">Select a component or create a new one</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'Buttons': '#3498db',
    'Cards': '#2ecc71',
    'Forms': '#e74c3c',
    'Navigation': '#f39c12',
    'Layout': '#9b59b6',
    'Other': '#95a5a6'
  }
  return colors[category] || colors['Other']
}
