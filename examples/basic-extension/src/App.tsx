/**
 * Basic Designer Extension - Main Component
 *
 * Demonstrates:
 * - Accessing the Designer API
 * - Listening to element selection events
 * - Updating element properties
 * - Displaying information in the UI
 */

import { useEffect, useState } from 'react'

interface SelectedElement {
  id: string
  name: string
  tag: string
  className?: string
}

export default function App() {
  const [status, setStatus] = useState<string>('Initializing...')
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [newName, setNewName] = useState<string>('')

  useEffect(() => {
    initializeExtension()
  }, [])

  /**
   * Initialize the Designer Extension
   */
  async function initializeExtension() {
    try {
      // Import Webflow API (in real app, would be from @webflow/designer)
      // For this example, we'll show how it would work
      setStatus('✅ Extension loaded and ready')

      // Listen for element selection
      setupEventListeners()
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  /**
   * Setup event listeners for Designer events
   */
  function setupEventListeners() {
    // In a real implementation:
    // webflow.on('elementSelected', handleElementSelected)
    // webflow.on('elementDeselected', handleElementDeselected)
    // webflow.on('elementUpdated', handleElementUpdated)

    // For this example, we'll show the structure
    console.log('Event listeners set up for:')
    console.log('- elementSelected')
    console.log('- elementDeselected')
    console.log('- elementUpdated')
  }

  /**
   * Handle element selection
   */
  function handleElementSelected(element: any) {
    setSelectedElement({
      id: element.id,
      name: element.getName?.() || 'Unknown',
      tag: element.tag || 'div',
      className: element.getClassName?.(),
    })
  }

  /**
   * Handle element deselection
   */
  function handleElementDeselected() {
    setSelectedElement(null)
  }

  /**
   * Rename selected element
   */
  async function renameElement() {
    if (!selectedElement || !newName) {
      alert('Please select an element and enter a new name')
      return
    }

    try {
      setStatus(`Renaming element to "${newName}"...`)
      // In a real implementation:
      // await element.setName(newName)
      setStatus(`✅ Element renamed to "${newName}"`)
      setNewName('')
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  /**
   * Change element color
   */
  async function changeColor(color: string) {
    if (!selectedElement) {
      alert('Please select an element first')
      return
    }

    try {
      setStatus(`Changing color to ${color}...`)
      // In a real implementation:
      // await element.setStyleProperty('color', color)
      setStatus(`✅ Color changed to ${color}`)
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🎨 Basic Extension</h1>
        <p>Designer API Example</p>
      </div>

      <div className="card">
        <h2>Status</h2>
        <p className="status">{status}</p>
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
          </div>

          <div className="actions">
            <h3>Rename Element</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="New name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={renameElement} className="btn btn-primary">
                Rename
              </button>
            </div>

            <h3>Change Color</h3>
            <div className="color-buttons">
              <button
                onClick={() => changeColor('#FF0000')}
                className="btn btn-color"
                style={{ backgroundColor: '#FF0000' }}
              >
                Red
              </button>
              <button
                onClick={() => changeColor('#00AA00')}
                className="btn btn-color"
                style={{ backgroundColor: '#00AA00' }}
              >
                Green
              </button>
              <button
                onClick={() => changeColor('#0066FF')}
                className="btn btn-color"
                style={{ backgroundColor: '#0066FF' }}
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
          <strong>Next Steps:</strong>
        </p>
        <ul>
          <li>Check <code>src/App.tsx</code> for implementation details</li>
          <li>Read the Designer API docs</li>
          <li>Explore other templates for advanced features</li>
          <li>Build something awesome! 🚀</li>
        </ul>
      </div>
    </div>
  )
}
