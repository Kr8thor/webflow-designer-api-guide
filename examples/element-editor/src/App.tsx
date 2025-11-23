import React, { useState, useCallback } from 'react'
import { useNotification } from '../../shared/context/NotificationContext'
import { useClipboard } from '../../shared/hooks/useClipboard'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { showSuccess, showError, showInfo } = useNotification()
  const { copied, copy } = useClipboard()

  /**
   * Validate style input
   */
  const validateStyleInput = (key: string, value: string): { isValid: boolean; message: string } => {
    if (!key.trim()) {
      return { isValid: false, message: 'Style key cannot be empty' }
    }
    if (!value.trim()) {
      return { isValid: false, message: 'Style value cannot be empty' }
    }
    if (key.length > 50) {
      return { isValid: false, message: 'Style key must be 50 characters or less' }
    }
    return { isValid: true, message: '' }
  }

  /**
   * Validate attribute input
   */
  const validateAttributeInput = (key: string, value: string): { isValid: boolean; message: string } => {
    if (!key.trim()) {
      return { isValid: false, message: 'Attribute key cannot be empty' }
    }
    if (!value.trim() && key !== 'text') {
      return { isValid: false, message: 'Attribute value cannot be empty' }
    }
    return { isValid: true, message: '' }
  }

  const updateStyle = useCallback((key: string, value: string) => {
    try {
      const validation = validateStyleInput(key, value)
      if (!validation.isValid) {
        setError(validation.message)
        showError(validation.message)
        return
      }

      const updated = {
        ...element,
        styles: { ...element.styles, [key]: value }
      }
      setElement(updated)
      setError(null)
      showSuccess(`Updated ${key}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update style'
      setError(errorMessage)
      showError(errorMessage)
    }
  }, [element, showSuccess, showError])

  const updateAttribute = useCallback((key: string, value: string) => {
    try {
      const validation = validateAttributeInput(key, value)
      if (!validation.isValid) {
        setError(validation.message)
        showError(validation.message)
        return
      }

      const updated = {
        ...element,
        attributes: { ...element.attributes, [key]: value }
      }
      setElement(updated)
      setError(null)
      showSuccess(`Updated ${key}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update attribute'
      setError(errorMessage)
      showError(errorMessage)
    }
  }, [element, showSuccess, showError])

  const updateName = useCallback((newName: string) => {
    try {
      if (!newName.trim()) {
        setError('Element name cannot be empty')
        showError('Element name cannot be empty')
        return
      }
      setElement({ ...element, name: newName })
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update name'
      setError(errorMessage)
      showError(errorMessage)
    }
  }, [element, showSuccess, showError])

  const deleteStyle = useCallback((key: string) => {
    try {
      const updated = {
        ...element,
        styles: { ...element.styles }
      }
      delete updated.styles[key]
      setElement(updated)
      setSelectedStyleKey(null)
      setError(null)
      showSuccess(`Deleted ${key}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete style'
      setError(errorMessage)
      showError(errorMessage)
    }
  }, [element, showSuccess, showError])

  const addStyle = useCallback((key: string, value: string) => {
    if (key && value) {
      updateStyle(key, value)
    }
  }, [updateStyle])

  const copyCSS = useCallback(async () => {
    try {
      const css = Object.entries(element.styles)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')

      const text = `${element.name} {\n${css}\n}`
      await copy(text)
      setError(null)
      showSuccess('CSS copied to clipboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy CSS'
      setError(errorMessage)
      showError(errorMessage)
    }
  }, [element, copy, showSuccess, showError])

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
        <p>Edit element properties and styles with Phase 1 Enhancements</p>
      </header>

      {error && (
        <div
          className="error-card"
          style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '12px',
            margin: '10px',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span><strong>Error:</strong> {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        </div>
      )}

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

          <button className="btn btn-secondary" onClick={copyCSS}>
            {copied ? '✓ Copied!' : '📋 Copy CSS'}
          </button>
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
