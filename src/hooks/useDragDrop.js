import { useState, useCallback } from 'react'

export function useDragDrop(todos, setTodos, filteredTodos) {
  const [dragIndex, setDragIndex] = useState(null)

  const handleDragStart = useCallback((index) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    const draggedItem = filteredTodos[dragIndex]
    const targetItem = filteredTodos[index]

    const newTodos = [...todos]
    const realDragIndex = newTodos.findIndex(t => t.id === draggedItem.id)
    const realTargetIndex = newTodos.findIndex(t => t.id === targetItem.id)

    if (realDragIndex === -1 || realTargetIndex === -1) return

    newTodos.splice(realDragIndex, 1)
    newTodos.splice(realTargetIndex, 0, draggedItem)
    setTodos(newTodos)
    setDragIndex(index)
  }, [dragIndex, todos, setTodos, filteredTodos])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
  }, [])

  return { dragIndex, handleDragStart, handleDragOver, handleDragEnd }
}
