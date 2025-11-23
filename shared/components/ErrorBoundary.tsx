import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component to catch and display errors gracefully
 * @example
 * <ErrorBoundary fallback={(error, retry) => (
 *   <div>
 *     <p>Error: {error.message}</p>
 *     <button onClick={retry}>Try again</button>
 *   </div>
 * )}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.handleRetry) || (
          <div
            style={{
              padding: '20px',
              margin: '10px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontFamily: 'monospace',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>Something went wrong</h3>
            <pre style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {this.state.error.message}
            </pre>
            <button onClick={this.handleRetry} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
