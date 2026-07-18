import { useState, useMemo, useCallback } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '../constants'
import { useTodos } from '../hooks/useTodos'
import { useUndo } from '../hooks/useUndo'
import { useDragDrop } from '../hooks/useDragDrop'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'
import Filter from '../components/Filter'
import SearchBar from '../components/SearchBar'
import Stats from '../components/Stats'
import EmptyState from '../components/EmptyState'
import { CheckIcon, DownloadIcon } from '../components/Icons'

function TodosPage() {
  const { todos, setTodos, addTodo, toggleComplete, deleteTodo, updateTodo, clearCompleted, restoreTodos } = useTodos()
  const { undoMessage, pushUndo, showUndoMessage, popUndo } = useUndo()

  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)

  const filteredTodos = useMemo(() => {
    return todos
      .filter(t => {
        if (filter === 'active') return !t.completed
        if (filter === 'completed') return t.completed
        return true
      })
      .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
      .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
  }, [todos, filter, categoryFilter, search])

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    done: todos.filter(t => t.completed).length,
  }), [todos])

  const { dragIndex, handleDragStart, handleDragOver, handleDragEnd } = useDragDrop(todos, setTodos, filteredTodos)

  const handleDelete = useCallback((id) => {
    const deleted = todos.find(t => t.id === id)
    if (deleted) {
      pushUndo('delete', deleted)
      deleteTodo(id)
      showUndoMessage(`"${deleted.title}" dihapus`)
    }
  }, [todos, pushUndo, deleteTodo, showUndoMessage])

  const handleClearCompleted = useCallback(() => {
    const cleared = todos.filter(t => t.completed)
    if (cleared.length > 0) {
      pushUndo('clear', cleared)
      clearCompleted()
      showUndoMessage(`${cleared.length} todo dihapus`)
    }
  }, [todos, pushUndo, clearCompleted, showUndoMessage])

  const handleUpdate = useCallback((id, updates) => {
    updateTodo(id, updates)
    setEditingId(null)
  }, [updateTodo])

  const handleUndo = useCallback(() => {
    const last = popUndo()
    if (!last) return
    if (last.action === 'delete') {
      restoreTodos([last.data])
    } else if (last.action === 'clear') {
      restoreTodos(last.data)
    }
  }, [popUndo, restoreTodos])

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [todos])

  return (
    <div>
      <div className="app-header">
        <div className="header-top">
          <div className="header-left">
            <h1><span className="logo-icon"><CheckIcon /></span> Todo</h1>
            <p>Sederhanakan harimu, selesaikan satu per satu</p>
          </div>
          <button className="btn-export" onClick={handleExport} title="Export JSON"><DownloadIcon /> Export</button>
        </div>
      </div>

      {undoMessage && (
        <div className="undo-bar">
          <span>{undoMessage}</span>
          <button className="btn-undo" onClick={handleUndo}>Undo</button>
        </div>
      )}

      <Stats total={stats.total} active={stats.active} done={stats.done} />

      <TodoForm addTodo={addTodo} />

      <SearchBar search={search} setSearch={setSearch} />

      <div className="category-tabs">
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} className={categoryFilter === cat ? 'active' : ''} onClick={() => setCategoryFilter(cat)}>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <Filter filter={filter} setFilter={setFilter} hasCompleted={stats.done > 0} clearCompleted={handleClearCompleted} />

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <EmptyState search={search} filter={filter} />
        ) : (
          filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              toggleComplete={toggleComplete}
              deleteTodo={handleDelete}
              updateTodo={handleUpdate}
              editingId={editingId}
              setEditingId={setEditingId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              isDragging={dragIndex === index}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TodosPage
