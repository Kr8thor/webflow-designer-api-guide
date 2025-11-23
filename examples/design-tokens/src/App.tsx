import React, { useState, useEffect, useCallback } from 'react'
import { useNotification } from '../../shared/context/NotificationContext'
import { useClipboard } from '../../shared/hooks/useClipboard'

type TokenType = 'color' | 'size' | 'typography'
type TokenValue = string | number

interface Token {
  id: string
  name: string
  type: TokenType
  value: TokenValue
  description: string
  createdAt: Date
}

interface TypographyToken {
  fontSize: string
  fontWeight: string | number
  lineHeight: string
  letterSpacing: string
}

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<TokenType | 'all'>('all')
  const [webflowInstance, setWebflowInstance] = useState<any>(null)
  const [message, setMessage] = useState('')

  // Initialize Webflow API
  useEffect(() => {
    const initWebflow = async () => {
      try {
        // In production, this would be: const webflow = window.webflow
        // For demo purposes, we'll simulate the API
        setWebflowInstance({ ready: true })
        setMessage('✅ Webflow API loaded')

        // Load default tokens
        loadDefaultTokens()
      } catch (error) {
        setMessage('❌ Failed to initialize Webflow API')
        console.error(error)
      }
    }

    initWebflow()
  }, [])

  const loadDefaultTokens = () => {
    const defaults: Token[] = [
      {
        id: '1',
        name: 'Primary Blue',
        type: 'color',
        value: '#0066CC',
        description: 'Primary brand color',
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Success Green',
        type: 'color',
        value: '#00AA44',
        description: 'Success state color',
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Spacing Small',
        type: 'size',
        value: '8px',
        description: 'Small spacing unit',
        createdAt: new Date()
      },
      {
        id: '4',
        name: 'Heading 1',
        type: 'typography',
        value: JSON.stringify({
          fontSize: '32px',
          fontWeight: 700,
          lineHeight: '1.2',
          letterSpacing: '-0.5px'
        }),
        description: 'Main heading style',
        createdAt: new Date()
      }
    ]
    setTokens(defaults)
  }

  const createToken = (name: string, type: TokenType, value: TokenValue, description: string) => {
    const newToken: Token = {
      id: Date.now().toString(),
      name,
      type,
      value,
      description,
      createdAt: new Date()
    }
    setTokens([...tokens, newToken])
    setMessage(`✅ Created token: ${name}`)
    setShowForm(false)
  }

  const deleteToken = (id: string) => {
    const token = tokens.find(t => t.id === id)
    setTokens(tokens.filter(t => t.id !== id))
    setSelectedToken(null)
    setMessage(`✅ Deleted token: ${token?.name}`)
  }

  const updateToken = (id: string, updates: Partial<Token>) => {
    setTokens(tokens.map(t => t.id === id ? { ...t, ...updates } : t))
    setSelectedToken({ ...selectedToken, ...updates } as Token)
    setMessage('✅ Token updated')
  }

  const exportTokens = () => {
    const formatted = tokens.reduce((acc, token) => {
      if (token.type === 'color') {
        acc.colors[token.name] = token.value
      } else if (token.type === 'size') {
        acc.sizes[token.name] = token.value
      } else if (token.type === 'typography') {
        acc.typography[token.name] = JSON.parse(token.value as string)
      }
      return acc
    }, { colors: {}, sizes: {}, typography: {} })

    const json = JSON.stringify(formatted, null, 2)
    downloadJSON(json, 'design-tokens.json')
    setMessage('✅ Tokens exported')
  }

  const downloadJSON = (content: string, filename: string) => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const filteredTokens = filter === 'all' ? tokens : tokens.filter(t => t.type === filter)

  const colorCount = tokens.filter(t => t.type === 'color').length
  const sizeCount = tokens.filter(t => t.type === 'size').length
  const typographyCount = tokens.filter(t => t.type === 'typography').length

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎨 Design Tokens Manager</h1>
          <p>Create and manage design system tokens</p>
        </div>
      </header>

      {message && (
        <div className="message">
          {message}
          <button className="close-btn" onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className="container">
        <aside className="sidebar">
          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">{colorCount}</div>
              <div className="stat-label">Colors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{sizeCount}</div>
              <div className="stat-label">Sizes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{typographyCount}</div>
              <div className="stat-label">Typography</div>
            </div>
          </div>

          <div className="filters">
            <h3>Filter by Type</h3>
            <div className="filter-buttons">
              {(['all', 'color', 'size', 'typography'] as const).map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + New Token
            </button>
            <button className="btn btn-secondary" onClick={exportTokens}>
              📥 Export JSON
            </button>
          </div>
        </aside>

        <main className="main">
          {showForm && (
            <TokenForm
              onSubmit={createToken}
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="tokens-grid">
            {filteredTokens.length === 0 ? (
              <div className="empty-state">
                <p>No tokens found</p>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  Create your first token
                </button>
              </div>
            ) : (
              filteredTokens.map(token => (
                <TokenCard
                  key={token.id}
                  token={token}
                  isSelected={selectedToken?.id === token.id}
                  onSelect={() => setSelectedToken(token)}
                  onDelete={() => deleteToken(token.id)}
                />
              ))
            )}
          </div>

          {selectedToken && (
            <TokenDetails
              token={selectedToken}
              onUpdate={(updates) => updateToken(selectedToken.id, updates)}
              onClose={() => setSelectedToken(null)}
            />
          )}
        </main>
      </div>
    </div>
  )
}

interface TokenFormProps {
  onSubmit: (name: string, type: TokenType, value: TokenValue, description: string) => void
  onCancel: () => void
}

function TokenForm({ onSubmit, onCancel }: TokenFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<TokenType>('color')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && value) {
      onSubmit(name, type, value, description)
      setName('')
      setValue('')
      setDescription('')
    }
  }

  return (
    <form className="token-form" onSubmit={handleSubmit}>
      <h3>Create New Token</h3>

      <div className="form-group">
        <label>Token Name</label>
        <input
          type="text"
          placeholder="e.g., Primary Blue"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as TokenType)}>
          <option value="color">Color</option>
          <option value="size">Size</option>
          <option value="typography">Typography</option>
        </select>
      </div>

      <div className="form-group">
        <label>Value</label>
        {type === 'color' ? (
          <div className="color-input-wrapper">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => setValue(e.target.value)}
            />
            <input
              type="text"
              placeholder="e.g., #0066CC"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        ) : (
          <input
            type="text"
            placeholder={type === 'size' ? 'e.g., 8px' : 'e.g., 32px'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Describe when to use this token"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create Token
        </button>
      </div>
    </form>
  )
}

interface TokenCardProps {
  token: Token
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function TokenCard({ token, isSelected, onSelect, onDelete }: TokenCardProps) {
  return (
    <div className={`token-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="token-preview">
        {token.type === 'color' && (
          <div
            className="color-preview"
            style={{ backgroundColor: token.value as string }}
          />
        )}
        {token.type === 'size' && (
          <div className="size-preview">{token.value}</div>
        )}
        {token.type === 'typography' && (
          <div className="typography-preview">Aa</div>
        )}
      </div>

      <div className="token-info">
        <h4>{token.name}</h4>
        <p className="token-value">{String(token.value).substring(0, 30)}</p>
        <p className="token-type">{token.type}</p>
      </div>

      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        ×
      </button>
    </div>
  )
}

interface TokenDetailsProps {
  token: Token
  onUpdate: (updates: Partial<Token>) => void
  onClose: () => void
}

function TokenDetails({ token, onUpdate, onClose }: TokenDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(token.name)
  const [editValue, setEditValue] = useState(String(token.value))
  const [editDescription, setEditDescription] = useState(token.description)

  const handleSave = () => {
    onUpdate({
      name: editName,
      value: editValue,
      description: editDescription
    })
    setIsEditing(false)
  }

  return (
    <div className="token-details">
      <div className="details-header">
        <h3>Token Details</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {!isEditing ? (
        <div className="details-content">
          <div className="detail-field">
            <label>Name</label>
            <p>{token.name}</p>
          </div>

          <div className="detail-field">
            <label>Type</label>
            <p className="badge">{token.type}</p>
          </div>

          <div className="detail-field">
            <label>Value</label>
            {token.type === 'color' ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: token.value as string,
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                <code>{token.value}</code>
              </div>
            ) : (
              <code>{token.value}</code>
            )}
          </div>

          <div className="detail-field">
            <label>Description</label>
            <p>{token.description || 'No description'}</p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Token
          </button>
        </div>
      ) : (
        <div className="details-content">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Value</label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
