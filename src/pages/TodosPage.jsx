import { useState, useEffect, useCallback } from 'react'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'
import Filter from '../components/Filter'
import SearchBar from '../components/SearchBar'

function TodosPage() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [undoStack, setUndoStack] = useState([])
  const [undoMessage, setUndoMessage] = useState('')
  const [dragIndex, setDragIndex] = useState(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const pushUndo = useCallback((action, data) => {
    setUndoStack(prev => [...prev.slice(-9), { action, data, timestamp: Date.now() }])
  }, [])

  const addTodo = (todo) => {
    const newTodo = { id: Date.now(), ...todo, completed: false }
    setTodos([newTodo, ...todos])
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    const deleted = todos.find(t => t.id === id)
    pushUndo('delete', deleted)
    setTodos(todos.filter(t => t.id !== id))
    setUndoMessage(`"${deleted.title}" dihapus`)
    setTimeout(() => setUndoMessage(''), 4000)
  }

  const updateTodo = (id, updates) => {
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates } : t))
    setEditingId(null)
  }

  const clearCompleted = () => {
    const cleared = todos.filter(t => t.completed)
    pushUndo('clear', cleared)
    setTodos(todos.filter(t => !t.completed))
    setUndoMessage(`${cleared.length} todo dihapus`)
    setTimeout(() => setUndoMessage(''), 4000)
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const last = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))

    if (last.action === 'delete') {
      setTodos(prev => [...prev, last.data])
    } else if (last.action === 'clear') {
      setTodos(prev => [...prev, ...last.data])
    }
    setUndoMessage('')
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDragStart = (index) => {
    setDragIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return

    const filtered = getFilteredTodos()
    const draggedItem = filtered[dragIndex]
    const targetItem = filtered[index]

    const newTodos = [...todos]
    const realDragIndex = newTodos.findIndex(t => t.id === draggedItem.id)
    const realTargetIndex = newTodos.findIndex(t => t.id === targetItem.id)

    newTodos.splice(realDragIndex, 1)
    newTodos.splice(realTargetIndex, 0, draggedItem)
    setTodos(newTodos)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const getFilteredTodos = () => {
    return todos
      .filter(t => {
        if (filter === 'active') return !t.completed
        if (filter === 'completed') return t.completed
        return true
      })
      .filter(t => {
        if (categoryFilter !== 'all') return t.category === categoryFilter
        return true
      })
      .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
  }

  const filteredTodos = getFilteredTodos()
  const total = todos.length
  const active = todos.filter(t => !t.completed).length
  const done = todos.filter(t => t.completed).length

  const categories = ['all', 'kerja', 'pribadi', 'belanja', 'belajar', 'lainnya']
  const categoryLabels = { all: 'Semua', kerja: 'Kerja', pribadi: 'Pribadi', belanja: 'Belanja', belajar: 'Belajar', lainnya: 'Lainnya' }

  return (
    <div>
      <div className="app-header">
        <div className="header-top">
          <div className="header-left">
            <h1>
              <span className="logo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              Todo
            </h1>
            <p>Sederhanakan harimu, selesaikan satu per satu</p>
          </div>
          <button className="btn-export" onClick={handleExport} title="Export JSON">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      {undoMessage && (
        <div className="undo-bar">
          <span>{undoMessage}</span>
          <button className="btn-undo" onClick={handleUndo}>Undo</button>
        </div>
      )}

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number total">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-item">
          <div className="stat-number active">{active}</div>
          <div className="stat-label">Aktif</div>
        </div>
        <div className="stat-item">
          <div className="stat-number done">{done}</div>
          <div className="stat-label">Selesai</div>
        </div>
      </div>

      <TodoForm addTodo={addTodo} categories={categories.filter(c => c !== 'all')} categoryLabels={categoryLabels} />

      <SearchBar search={search} setSearch={setSearch} />

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={categoryFilter === cat ? 'active' : ''}
            onClick={() => setCategoryFilter(cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <Filter
        filter={filter}
        setFilter={setFilter}
        hasCompleted={done > 0}
        clearCompleted={clearCompleted}
      />

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <span className="emoji">📋</span>
            <h3>{search ? 'Tidak ditemukan' : filter === 'completed' ? 'Belum ada yang selesai' : filter === 'active' ? 'Semua selesai!' : 'Belum ada todo'}</h3>
            <p>{search ? 'Coba kata kunci lain' : filter === 'all' && 'Tambahkan tugasmu yang pertama'}</p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              editingId={editingId}
              setEditingId={setEditingId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              isDragging={dragIndex === index}
              categoryLabels={categoryLabels}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TodosPage
