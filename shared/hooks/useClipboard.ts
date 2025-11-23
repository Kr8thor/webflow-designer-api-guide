import { useState, useCallback } from 'react'

interface UseClipboardOptions {
  timeout?: number
}

interface UseClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<void>
  error: Error | null
}

/**
 * Hook for copying text to clipboard with feedback
 * @example
 * const { copied, copy } = useClipboard()
 * await copy('text to copy')
 * if (copied) showNotification('Copied!')
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(null)

      // Reset copied state after timeout
      setTimeout(() => setCopied(false), timeout)
    } catch (err) {
      const clipboardError = err instanceof Error ? err : new Error('Failed to copy')
      setError(clipboardError)
      setCopied(false)
    }
  }, [timeout])

  return { copied, copy, error }
}
