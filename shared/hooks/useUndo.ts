import { useState, useCallback } from 'react'

interface UseUndoReturn<T> {
  state: T
  setState: (newState: T) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  clear: () => void
}

/**
 * Hook for undo/redo functionality
 * @example
 * const { state, setState, undo, redo, canUndo, canRedo } = useUndo(initialState)
 * setState(newState) // adds to history
 * undo() // go back
 * redo() // go forward
 */
export function useUndo<T>(initialState: T): UseUndoReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const state = history[historyIndex]

  const setState = useCallback((newState: T) => {
    // Remove any redo history when setting new state
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
    }
  }, [historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
    }
  }, [historyIndex, history.length])

  const clear = useCallback(() => {
    setHistory([initialState])
    setHistoryIndex(0)
  }, [initialState])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return { state, setState, undo, redo, canUndo, canRedo, clear }
}
