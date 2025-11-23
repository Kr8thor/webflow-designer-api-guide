import { useState, useCallback, useEffect } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: () => Promise<void>
  reset: () => void
}

/**
 * Hook for handling async operations with loading and error states
 * @example
 * const { data, loading, error, execute } = useAsync(async () => {
 *   return await fetchData()
 * })
 * // Call execute() to run the async function
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await asyncFunction()
      setState({ data: response, loading: false, error: null })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setState({ data: null, loading: false, error })
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, execute, reset }
}
