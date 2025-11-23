/**
 * Basic Designer Extension - Main Component
 *
 * Phase 1 Enhancements:
 * - Error boundary for graceful error handling
 * - Toast notifications instead of alerts
 * - Loading states and spinners
 * - Keyboard shortcuts (Ctrl+Z, Ctrl+S, ?)
 * - Copy-to-clipboard for element info
 *
 * Demonstrates:
 * - Accessing the Designer API
 * - Listening to element selection events
 * - Updating element properties
 * - Displaying information in the UI
 */

import { useEffect, useState, useCallback } from 'react'
import { useNotification } from '../../shared/context/NotificationContext'
import { useClipboard } from '../../shared/hooks/useClipboard'
import { useUndo } from '../../shared/hooks/useUndo'

interface SelectedElement {
  id: string
  name: string
  tag: string
  className?: string
}

interface AppState {
  status: string
  selectedElement: SelectedElement | null
}

export default function App() {
  const [status, setStatus] = useState<string>('Initializing...')
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [newName, setNewName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { showSuccess, showError, showInfo } = useNotification()
  const { copied, copy } = useClipboard()
  const { state: appState, setState: setAppState, undo, canUndo } = useUndo<AppState>({
    status: 'Initializing...',
    selectedElement: null,
  })

  useEffect(() => {
    initializeExtension()
    setupKeyboardShortcuts()
  }, [])

  /**
   * Initialize the Designer Extension
   */
  async function initializeExtension() {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStatus('✅ Extension loaded and ready')
      setAppState({ status: '✅ Extension loaded and ready', selectedElement: null })
      showSuccess('Extension initialized successfully')

      setupEventListeners()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize extension'
      setError(errorMessage)
      setStatus(`❌ Error: ${errorMessage}`)
      showError(`Initialization failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Z / Cmd+Z for undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault()
        if (canUndo) {
          undo()
          showInfo('Action undone')
        }
      }

      // Ctrl+S / Cmd+S for save (just notify)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        showSuccess('Changes would be saved')
      }

      // ? for help
      if (event.key === '?') {
        showInfo('Keyboard shortcuts: Ctrl+Z (undo), Ctrl+S (save), ? (help)')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }

  /**
   * Setup event listeners for Designer events
   */
  function setupEventListeners() {
    // In a real implementation:
    // webflow.on('elementSelected', handleElementSelected)
    // webflow.on('elementDeselected', handleElementDeselected)
    // webflow.on('elementUpdated', handleElementUpdated)

    console.log('Event listeners set up for:')
    console.log('- elementSelected')
    console.log('- elementDeselected')
    console.log('- elementUpdated')
  }

  /**
   * Handle element selection
   */
  function handleElementSelected(element: any) {
    try {
      const selected: SelectedElement = {
        id: element.id,
        name: element.getName?.() || 'Unknown',
        tag: element.tag || 'div',
        className: element.getClassName?.(),
      }
      setSelectedElement(selected)
      setAppState({ status, selectedElement: selected })
      showSuccess(`Element selected: ${selected.name}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select element'
      showError(`Selection failed: ${errorMessage}`)
    }
  }

  /**
   * Handle element deselection
   */
  function handleElementDeselected() {
    setSelectedElement(null)
    setAppState({ status, selectedElement: null })
  }

  /**
   * Copy element info to clipboard
   */
  const copyElementInfo = useCallback(async () => {
    if (!selectedElement) return

    try {
      const info = `Element: ${selectedElement.name}\nTag: ${selectedElement.tag}\nClass: ${selectedElement.className || 'None'}`
      await copy(info)
      showSuccess('Element info copied to clipboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy'
      showError(`Copy failed: ${errorMessage}`)
    }
  }, [selectedElement, copy, showSuccess, showError])

  /**
   * Validate input
   */
  function validateInput(value: string): { isValid: boolean; message: string } {
    if (!value.trim()) {
      return { isValid: false, message: 'Name cannot be empty' }
    }
    if (value.length > 50) {
      return { isValid: false, message: 'Name must be 50 characters or less' }
    }
    if (!/^[a-zA-Z0-9\-_\s]+$/.test(value)) {
      return { isValid: false, message: 'Name can only contain letters, numbers, hyphens, underscores, and spaces' }
    }
    return { isValid: true, message: '' }
  }

  /**
   * Rename selected element
   */
  async function renameElement() {
    if (!selectedElement) {
      showError('Please select an element first')
      return
    }

    const validation = validateInput(newName)
    if (!validation.isValid) {
      showError(validation.message)
      setError(validation.message)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const oldName = selectedElement.name
      const updated: SelectedElement = { ...selectedElement, name: newName }
      setSelectedElement(updated)
      setAppState({ status: `✅ Element renamed to "${newName}"`, selectedElement: updated })
      setNewName('')
      showSuccess(`Element renamed from "${oldName}" to "${newName}"`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename element'
      setError(errorMessage)
      showError(`Rename failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Change element color
   */
  async function changeColor(color: string) {
    if (!selectedElement) {
      showError('Please select an element first')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      setStatus(`✅ Color changed to ${color}`)
      showSuccess(`Color changed to ${color}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change color'
      setError(errorMessage)
      showError(`Color change failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🎨 Basic Extension</h1>
        <p>Designer API Example with Phase 1 Enhancements</p>
      </div>

      {error && (
        <div
          className="card error-card"
          style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>Error</h3>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div className="card">
        <h2>Status</h2>
        <p className="status">{status}</p>
        {loading && <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>⏳ Processing...</div>}
      </div>

      <div className="card info-card">
        <h3>Keyboard Shortcuts</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
          <li><kbd>Ctrl+Z</kbd> / <kbd>Cmd+Z</kbd> - Undo last action {!canUndo && '(disabled)'}</li>
          <li><kbd>Ctrl+S</kbd> / <kbd>Cmd+S</kbd> - Save changes</li>
          <li><kbd>?</kbd> - Show this help</li>
        </ul>
      </div>

      {selectedElement ? (
        <div className="card">
          <h2>Selected Element</h2>
          <div className="info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{selectedElement.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Tag:</span>
              <span className="value">{selectedElement.tag}</span>
            </div>
            <div className="info-row">
              <span className="label">Class:</span>
              <span className="value">{selectedElement.className || 'None'}</span>
            </div>
            <div className="info-row">
              <span className="label">ID:</span>
              <span className="value">{selectedElement.id}</span>
            </div>
          </div>

          <button
            onClick={copyElementInfo}
            className="btn btn-secondary"
            style={{ marginBottom: '20px', width: '100%' }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Element Info'}
          </button>

          <div className="actions">
            <h3>Rename Element</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="New name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    renameElement()
                  }
                }}
              />
              <button
                onClick={renameElement}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ Renaming...' : 'Rename'}
              </button>
            </div>

            <h3>Change Color</h3>
            <div className="color-buttons">
              <button
                onClick={() => changeColor('#FF0000')}
                className="btn btn-color"
                style={{ backgroundColor: '#FF0000' }}
                disabled={loading}
              >
                Red
              </button>
              <button
                onClick={() => changeColor('#00AA00')}
                className="btn btn-color"
                style={{ backgroundColor: '#00AA00' }}
                disabled={loading}
              >
                Green
              </button>
              <button
                onClick={() => changeColor('#0066FF')}
                className="btn btn-color"
                style={{ backgroundColor: '#0066FF' }}
                disabled={loading}
              >
                Blue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card empty">
          <p>👆 Select an element on the canvas to get started</p>
        </div>
      )}

      <div className="footer">
        <p>
          <strong>Phase 1 Enhancements:</strong>
        </p>
        <ul>
          <li>✅ Error handling with try-catch blocks</li>
          <li>✅ Loading states and spinner feedback</li>
          <li>✅ Toast notifications instead of alerts</li>
          <li>✅ Keyboard shortcuts (Ctrl+Z, Ctrl+S, ?)</li>
          <li>✅ Copy-to-clipboard functionality</li>
          <li>✅ Input validation with feedback</li>
          <li>✅ Disabled states for async operations</li>
        </ul>
      </div>
    </div>
  )
}
