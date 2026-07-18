import { useState, useEffect } from 'react'
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
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (todo) => {
    setTodos([{ id: Date.now(), ...todo, completed: false }, ...todos])
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const updateTodo = (id, newTitle) => {
    setTodos(todos.map(t => t.id === id ? { ...t, title: newTitle } : t))
    setEditingId(null)
  }

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed))
  }

  const filteredTodos = todos
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const total = todos.length
  const active = todos.filter(t => !t.completed).length
  const done = todos.filter(t => t.completed).length

  return (
    <div>
      <div className="app-header">
        <h1>Todo</h1>
        <p>Sederhanakan harimu</p>
      </div>

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

      <TodoForm addTodo={addTodo} />

      <SearchBar search={search} setSearch={setSearch} />

      <Filter
        filter={filter}
        setFilter={setFilter}
        hasCompleted={done > 0}
        clearCompleted={clearCompleted}
      />

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📋</div>
            <p>{search ? 'Tidak ditemukan' : filter === 'completed' ? 'Belum ada yang selesai' : filter === 'active' ? 'Semua selesai!' : 'Tambahkan todo pertamamu'}</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              editingId={editingId}
              setEditingId={setEditingId}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TodosPage
