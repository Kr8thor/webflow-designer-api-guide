import React, { useState, useEffect, useCallback } from 'react'
import { useNotification } from '../../shared/context/NotificationContext'

interface Event {
  id: string
  type: string
  timestamp: Date
  data: any
  source: string
}

type EventType = 'elementSelected' | 'elementUpdated' | 'pageChanged' | 'breakpointChanged' | 'all'

export default function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [filter, setFilter] = useState<EventType>('all')
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (!isMonitoring) return

    // Simulate events
    const simulateEvent = () => {
      const eventTypes = [
        { type: 'elementSelected', data: { name: 'Button', id: 'btn-123' }, source: 'Designer' },
        { type: 'elementUpdated', data: { property: 'color', newValue: '#FF0000' }, source: 'Designer' },
        { type: 'pageChanged', data: { pageName: 'Home', pageId: 'page-001' }, source: 'Navigation' },
        { type: 'breakpointChanged', data: { breakpoint: 'tablet', width: 768 }, source: 'Responsive' }
      ]

      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const newEvent: Event = {
        id: Date.now().toString(),
        type: randomEvent.type,
        timestamp: new Date(),
        data: randomEvent.data,
        source: randomEvent.source
      }

      setEvents(prev => [newEvent, ...prev.slice(0, 99)])
    }

    const interval = setInterval(simulateEvent, 2000)
    return () => clearInterval(interval)
  }, [isMonitoring])

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter)

  const getEventColor = (type: string) => {
    switch (type) {
      case 'elementSelected': return '#3498db'
      case 'elementUpdated': return '#2ecc71'
      case 'pageChanged': return '#e74c3c'
      case 'breakpointChanged': return '#f39c12'
      default: return '#95a5a6'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'elementSelected': return '👇'
      case 'elementUpdated': return '✏️'
      case 'pageChanged': return '📄'
      case 'breakpointChanged': return '📱'
      default: return '⚡'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>⚡ Event-Driven App</h1>
        <p>Real-time event monitoring with Webflow Designer API</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <button
            className={`control-btn ${isMonitoring ? 'active' : ''}`}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? '⏸️ Pause' : '▶️ Resume'}
          </button>
          <button
            className="control-btn"
            onClick={() => setEvents([])}
            disabled={events.length === 0}
          >
            🗑️ Clear
          </button>
        </div>

        <div className="control-group">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            Auto-scroll
          </label>
        </div>

        <div className="filter-group">
          <select value={filter} onChange={(e) => setFilter(e.target.value as EventType)}>
            <option value="all">All Events ({events.length})</option>
            <option value="elementSelected">Element Selected ({events.filter(e => e.type === 'elementSelected').length})</option>
            <option value="elementUpdated">Element Updated ({events.filter(e => e.type === 'elementUpdated').length})</option>
            <option value="pageChanged">Page Changed ({events.filter(e => e.type === 'pageChanged').length})</option>
            <option value="breakpointChanged">Breakpoint Changed ({events.filter(e => e.type === 'breakpointChanged').length})</option>
          </select>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{events.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Updates</div>
          <div className="stat-value">{events.filter(e => e.type === 'elementUpdated').length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Selections</div>
          <div className="stat-value">{events.filter(e => e.type === 'elementSelected').length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Navigation</div>
          <div className="stat-value">{events.filter(e => e.type === 'pageChanged').length}</div>
        </div>
      </div>

      <div className="event-monitor">
        <h2>Event Stream</h2>
        {filteredEvents.length === 0 ? (
          <div className="empty">
            <p>No events captured yet</p>
            <p className="hint">{isMonitoring ? 'Events will appear here...' : 'Resume monitoring to see events'}</p>
          </div>
        ) : (
          <div className="events-list">
            {filteredEvents.map(event => (
              <div key={event.id} className="event-item" style={{ borderLeftColor: getEventColor(event.type) }}>
                <div className="event-icon">{getEventIcon(event.type)}</div>
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-type" style={{ backgroundColor: getEventColor(event.type) }}>
                      {event.type}
                    </span>
                    <span className="event-time">{formatTime(event.timestamp)}</span>
                  </div>
                  <div className="event-data">
                    <pre><code>{JSON.stringify(event.data, null, 2)}</code></pre>
                  </div>
                  <div className="event-source">{event.source}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="documentation">
        <h3>How to Subscribe to Events</h3>
        <div className="code-block">
          <pre><code>{`// Subscribe to element selection
webflow.on('elementSelected', (element) => {
  console.log('Selected:', element.name)
})

// Subscribe to element updates
webflow.on('elementUpdated', (element) => {
  console.log('Updated:', element)
})

// Subscribe to page changes
webflow.on('pageChanged', (page) => {
  console.log('Page changed:', page.name)
})

// Subscribe to breakpoint changes
webflow.on('breakpointChanged', (breakpoint) => {
  console.log('Breakpoint:', breakpoint.label)
})

// Unsubscribe
webflow.off('elementSelected', handler)`}</code></pre>
        </div>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
