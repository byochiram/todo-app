import { useState } from 'react'

function TodoItem({ todo, toggleComplete, deleteTodo, updateTodo, editingId, setEditingId }) {
  const [editText, setEditText] = useState(todo.title)
  const isEditing = editingId === todo.id

  const isOverdue = todo.deadline && !todo.completed && new Date(todo.deadline) < new Date(new Date().toDateString())

  const priorityLabels = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(todo.id, editText.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setEditText(todo.title)
      setEditingId(null)
    }
  }

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
        <div className="todo-content">
          <input
            className="edit-input"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave}>Simpan</button>
            <button className="btn-cancel" onClick={() => { setEditText(todo.title); setEditingId(null) }}>Batal</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />
      <div className="todo-content">
        <div className={`todo-title ${todo.completed ? 'done' : ''}`}>{todo.title}</div>
        <div className="todo-meta">
          <span className={`priority-badge ${todo.priority}`}>{priorityLabels[todo.priority]}</span>
          {todo.deadline && (
            <span className={`todo-date ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? '⚠️ Terlambat' : ''} {new Date(todo.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button className="btn-edit" onClick={() => setEditingId(todo.id)}>✏️</button>
        <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>🗑️</button>
      </div>
    </div>
  )
}

export default TodoItem
