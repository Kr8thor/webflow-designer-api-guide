import React, { useState } from 'react'

interface Injection {
  id: string
  name: string
  type: 'html' | 'css' | 'javascript'
  location: 'head' | 'body-start' | 'body-end'
  code: string
  enabled: boolean
  createdAt: Date
}

const DEFAULT_INJECTIONS: Injection[] = [
  {
    id: '1',
    name: 'Google Analytics',
    type: 'javascript',
    location: 'head',
    code: `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>`,
    enabled: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Custom CSS Reset',
    type: 'css',
    location: 'head',
    code: `* { box-sizing: border-box; }
body { margin: 0; padding: 0; font-family: system-ui; }`,
    enabled: true,
    createdAt: new Date()
  }
]

export default function App() {
  const [injections, setInjections] = useState<Injection[]>(DEFAULT_INJECTIONS)
  const [selectedInjection, setSelectedInjection] = useState<Injection | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const createInjection = (name: string, type: Injection['type'], location: Injection['location'], code: string) => {
    const newInjection: Injection = {
      id: Date.now().toString(),
      name,
      type,
      location,
      code,
      enabled: true,
      createdAt: new Date()
    }
    setInjections([...injections, newInjection])
    setShowForm(false)
    setMessage(`✅ Created: ${name}`)
  }

  const deleteInjection = (id: string) => {
    const injection = injections.find(i => i.id === id)
    setInjections(injections.filter(i => i.id !== id))
    setSelectedInjection(null)
    setMessage(`✅ Deleted: ${injection?.name}`)
  }

  const toggleInjection = (id: string) => {
    const updated = injections.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    )
    setInjections(updated)
    const injection = updated.find(i => i.id === id)
    if (injection) {
      setSelectedInjection(injection)
      setMessage(injection.enabled ? '✅ Enabled' : '❌ Disabled')
    }
  }

  const updateInjection = (id: string, updates: Partial<Injection>) => {
    const updated = injections.map(i => i.id === id ? { ...i, ...updates } : i)
    setInjections(updated)
    const injection = updated.find(i => i.id === id)
    if (injection) setSelectedInjection(injection)
  }

  const exportCode = () => {
    const html = injections
      .filter(i => i.enabled)
      .map(i => `<!-- ${i.name} -->\n${i.code}`)
      .join('\n\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(html))
    element.setAttribute('download', 'injections.html')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setMessage('✅ Code exported')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'html': return '#e74c3c'
      case 'css': return '#3498db'
      case 'javascript': return '#f39c12'
      default: return '#95a5a6'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>💉 Code Injector</h1>
        <p>Inject custom code into your Webflow site</p>
      </header>

      {message && <div className="message">{message}<button className="close-btn" onClick={() => setMessage('')}>×</button></div>}

      <div className="container">
        <aside className="sidebar">
          <div className="injections-list">
            <h3>Injections ({injections.length})</h3>
            {injections.map(inj => (
              <button
                key={inj.id}
                className={`injection-btn ${selectedInjection?.id === inj.id ? 'active' : ''} ${!inj.enabled ? 'disabled' : ''}`}
                onClick={() => setSelectedInjection(inj)}
              >
                <div className="btn-info">
                  <span className="type-badge" style={{ backgroundColor: getTypeColor(inj.type) }}>
                    {inj.type.toUpperCase()}
                  </span>
                  <span className="name">{inj.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={inj.enabled}
                  onChange={() => toggleInjection(inj.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </button>
            ))}
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Injection</button>
            <button className="btn btn-secondary" onClick={exportCode}>📥 Export</button>
          </div>
        </aside>

        <main className="main">
          {showForm && (
            <InjectionForm
              onSubmit={createInjection}
              onCancel={() => setShowForm(false)}
            />
          )}

          {selectedInjection ? (
            <div className="injection-detail">
              <div className="detail-header">
                <div>
                  <h2>{selectedInjection.name}</h2>
                  <p className="meta">{selectedInjection.type} • {selectedInjection.location}</p>
                </div>
                <button className="delete-btn" onClick={() => deleteInjection(selectedInjection.id)}>🗑️ Delete</button>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={selectedInjection.name}
                  onChange={(e) => updateInjection(selectedInjection.id, { name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={selectedInjection.type} disabled style={{ opacity: 0.6 }}>
                    <option>{selectedInjection.type}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <select
                    value={selectedInjection.location}
                    onChange={(e) => updateInjection(selectedInjection.id, { location: e.target.value as any })}
                  >
                    <option value="head">Head</option>
                    <option value="body-start">Body Start</option>
                    <option value="body-end">Body End</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Code</label>
                <textarea
                  value={selectedInjection.code}
                  onChange={(e) => updateInjection(selectedInjection.id, { code: e.target.value })}
                  rows={10}
                  className="code-editor"
                />
              </div>

              <div className="preview">
                <h3>Preview</h3>
                <pre><code>{selectedInjection.code}</code></pre>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Select an injection to view details</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

interface InjectionFormProps {
  onSubmit: (name: string, type: Injection['type'], location: Injection['location'], code: string) => void
  onCancel: () => void
}

function InjectionForm({ onSubmit, onCancel }: InjectionFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<Injection['type']>('html')
  const [location, setLocation] = useState<Injection['location']>('head')
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && code) {
      onSubmit(name, type, location, code)
      setName('')
      setCode('')
    }
  }

  return (
    <form className="injection-form" onSubmit={handleSubmit}>
      <h3>Create New Injection</h3>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          placeholder="e.g., Google Analytics"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value as any)}>
            <option value="head">Head</option>
            <option value="body-start">Body Start</option>
            <option value="body-end">Body End</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Code</label>
        <textarea
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8}
          className="code-editor"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Injection</button>
      </div>
    </form>
  )
}
