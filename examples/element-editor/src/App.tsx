import React, { useState } from 'react'

interface Element {
  id: string
  name: string
  type: string
  parent?: string
  children?: string[]
  styles: { [key: string]: string }
  attributes: { [key: string]: string }
}

const DEFAULT_ELEMENT: Element = {
  id: 'el-001',
  name: 'Hero Button',
  type: 'button',
  styles: {
    'background-color': '#0066CC',
    'color': '#FFFFFF',
    'padding': '12px 24px',
    'border-radius': '6px',
    'font-size': '16px',
    'font-weight': '600',
    'border': 'none',
    'cursor': 'pointer'
  },
  attributes: {
    'text': 'Click Me',
    'href': '#',
    'target': '_self',
    'class': 'btn btn-primary'
  }
}

export default function App() {
  const [element, setElement] = useState<Element>(DEFAULT_ELEMENT)
  const [selectedStyleKey, setSelectedStyleKey] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const updateStyle = (key: string, value: string) => {
    const updated = {
      ...element,
      styles: { ...element.styles, [key]: value }
    }
    setElement(updated)
    setMessage(`✅ Updated ${key}`)
  }

  const updateAttribute = (key: string, value: string) => {
    const updated = {
      ...element,
      attributes: { ...element.attributes, [key]: value }
    }
    setElement(updated)
    setMessage(`✅ Updated ${key}`)
  }

  const updateName = (newName: string) => {
    setElement({ ...element, name: newName })
  }

  const deleteStyle = (key: string) => {
    const updated = {
      ...element,
      styles: { ...element.styles }
    }
    delete updated.styles[key]
    setElement(updated)
    setSelectedStyleKey(null)
    setMessage(`✅ Deleted ${key}`)
  }

  const addStyle = (key: string, value: string) => {
    if (key && value) {
      updateStyle(key, value)
    }
  }

  const copyCSS = () => {
    const css = Object.entries(element.styles)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')

    const text = `${element.name} {\n${css}\n}`
    navigator.clipboard.writeText(text)
    setMessage('✅ CSS copied to clipboard')
  }

  const getStyleCategory = (key: string): string => {
    if (['background-color', 'color', 'border-color'].includes(key)) return 'Colors'
    if (['width', 'height', 'padding', 'margin', 'border-radius'].includes(key)) return 'Spacing & Size'
    if (['font-size', 'font-weight', 'line-height', 'letter-spacing'].includes(key)) return 'Typography'
    if (['display', 'flex', 'grid', 'position'].includes(key)) return 'Layout'
    return 'Other'
  }

  const stylesByCategory = Object.entries(element.styles).reduce((acc, [k, v]) => {
    const cat = getStyleCategory(k)
    if (!acc[cat]) acc[cat] = []
    acc[cat].push([k, v])
    return acc
  }, {} as { [key: string]: [string, string][] })

  return (
    <div className="app">
      <header className="header">
        <h1>✏️ Element Editor</h1>
        <p>Edit element properties and styles</p>
      </header>

      {message && <div className="message">{message}<button className="close-btn" onClick={() => setMessage('')}>×</button></div>}

      <div className="container">
        <aside className="sidebar">
          <div className="element-info">
            <h3>Element</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={element.name}
                onChange={(e) => updateName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <div className="readonly">{element.type}</div>
            </div>
            <div className="form-group">
              <label>ID</label>
              <div className="readonly">{element.id}</div>
            </div>
          </div>

          <div className="preview">
            <h3>Preview</h3>
            <div className="preview-box">
              <button style={element.styles}>{element.attributes.text}</button>
            </div>
          </div>

          <button className="btn btn-secondary" onClick={copyCSS}>📋 Copy CSS</button>
        </aside>

        <main className="main">
          <div className="editor">
            <div className="editor-section">
              <h2>Styles</h2>
              {Object.entries(stylesByCategory).map(([category, styles]) => (
                <div key={category} className="style-category">
                  <h3>{category}</h3>
                  <div className="styles-list">
                    {styles.map(([key, value]) => (
                      <div
                        key={key}
                        className={`style-item ${selectedStyleKey === key ? 'selected' : ''}`}
                        onClick={() => setSelectedStyleKey(key)}
                      >
                        <div className="style-key">{key}</div>
                        <div className="style-value">{value}</div>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteStyle(key)
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedStyleKey && (
                <div className="style-editor">
                  <h3>Edit Style: {selectedStyleKey}</h3>
                  <div className="form-group">
                    <label>Value</label>
                    <input
                      type="text"
                      value={element.styles[selectedStyleKey] || ''}
                      onChange={(e) => updateStyle(selectedStyleKey, e.target.value)}
                    />
                  </div>
                  <button className="btn btn-secondary" onClick={() => setSelectedStyleKey(null)}>Close</button>
                </div>
              )}
            </div>

            <div className="editor-section">
              <h2>Attributes</h2>
              <div className="attributes-list">
                {Object.entries(element.attributes).map(([key, value]) => (
                  <div key={key} className="attribute-item">
                    <label>{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateAttribute(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="editor-section">
              <h2>HTML Output</h2>
              <div className="code-preview">
                <pre><code>{`<${element.type} ${Object.entries(element.attributes)
                  .map(([k, v]) => `${k}="${v}"`)
                  .join(' ')} style="${Object.entries(element.styles)
                  .map(([k, v]) => `${k}:${v}`)
                  .join(';')}">${element.attributes.text}</${element.type}>`}</code></pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
