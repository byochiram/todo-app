import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'todos'

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      console.warn('Gagal menyimpan todos ke localStorage')
    }
  }, [todos])

  const addTodo = useCallback((todo) => {
    const newTodo = { id: Date.now(), ...todo, completed: false }
    setTodos(prev => [newTodo, ...prev])
  }, [])

  const toggleComplete = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  const restoreTodos = useCallback((restored) => {
    setTodos(prev => [...prev, ...restored])
  }, [])

  return { todos, setTodos, addTodo, toggleComplete, deleteTodo, updateTodo, clearCompleted, restoreTodos }
}
