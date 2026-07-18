import { useState, useCallback, useRef } from 'react'
import { UNDO_TIMEOUT, UNDO_STACK_LIMIT } from '../constants'

export function useUndo() {
  const [undoStack, setUndoStack] = useState([])
  const [undoMessage, setUndoMessage] = useState('')
  const timeoutRef = useRef(null)

  const clearMessageTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const pushUndo = useCallback((action, data) => {
    setUndoStack(prev => [...prev.slice(-(UNDO_STACK_LIMIT - 1)), { action, data, timestamp: Date.now() }])
  }, [])

  const showUndoMessage = useCallback((message) => {
    clearMessageTimeout()
    setUndoMessage(message)
    timeoutRef.current = setTimeout(() => setUndoMessage(''), UNDO_TIMEOUT)
  }, [clearMessageTimeout])

  const popUndo = useCallback(() => {
    if (undoStack.length === 0) return null
    const last = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setUndoMessage('')
    clearMessageTimeout()
    return last
  }, [undoStack, clearMessageTimeout])

  const dismissMessage = useCallback(() => {
    clearMessageTimeout()
    setUndoMessage('')
  }, [clearMessageTimeout])

  return { undoStack, undoMessage, pushUndo, showUndoMessage, popUndo, dismissMessage }
}
