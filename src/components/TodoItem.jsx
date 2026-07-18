import { useState } from 'react'

const categoryIcons = {
  kerja: '💼',
  pribadi: '👤',
  belanja: '🛒',
  belajar: '📚',
  lainnya: '📌',
}

function TodoItem({ todo, index, toggleComplete, deleteTodo, updateTodo, editingId, setEditingId, onDragStart, onDragOver, onDragEnd, isDragging, categoryLabels }) {
  const [editText, setEditText] = useState(todo.title)
  const [editPriority, setEditPriority] = useState(todo.priority)
  const [editCategory, setEditCategory] = useState(todo.category)
  const [editDeadline, setEditDeadline] = useState(todo.deadline || '')
  const [editDeadlineTime, setEditDeadlineTime] = useState(todo.deadlineTime || '')
  const isEditing = editingId === todo.id

  const today = new Date(new Date().toDateString())
  const deadlineDate = todo.deadline ? new Date(todo.deadline) : null
  const isOverdue = deadlineDate && !todo.completed && deadlineDate < today
  const isToday = deadlineDate && deadlineDate.getTime() === today.getTime()
  const isUpcoming = deadlineDate && !todo.completed && deadlineDate > today

  const priorityLabels = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }
  const categories = ['kerja', 'pribadi', 'belanja', 'belajar', 'lainnya']

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(todo.id, {
        title: editText.trim(),
        priority: editPriority,
        category: editCategory,
        deadline: editDeadline,
        deadlineTime: editDeadlineTime,
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  const handleCancel = () => {
    setEditText(todo.title)
    setEditPriority(todo.priority)
    setEditCategory(todo.category)
    setEditDeadline(todo.deadline || '')
    setEditDeadlineTime(todo.deadlineTime || '')
    setEditingId(null)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}.${m} ${ampm}`
  }

  const itemClass = [
    'todo-item',
    isDragging ? 'dragging' : '',
    isEditing ? 'editing' : '',
    todo.completed ? 'completed-item' : ''
  ].filter(Boolean).join(' ')

  if (isEditing) {
    return (
      <div className={itemClass}>
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
          <div className="edit-row">
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </select>
          </div>
          <div className="edit-row">
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
            />
            <input
              type="time"
              value={editDeadlineTime}
              onChange={(e) => setEditDeadlineTime(e.target.value)}
            />
          </div>
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave}>Simpan</button>
            <button className="btn-cancel" onClick={handleCancel}>Batal</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={itemClass}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
    >
      <span className="drag-handle" title="Drag untuk urutkan">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5"/>
          <circle cx="11" cy="3" r="1.5"/>
          <circle cx="5" cy="8" r="1.5"/>
          <circle cx="11" cy="8" r="1.5"/>
          <circle cx="5" cy="13" r="1.5"/>
          <circle cx="11" cy="13" r="1.5"/>
        </svg>
      </span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />
      <div className="todo-content">
        <div className={`todo-title ${todo.completed ? 'done' : ''}`}>{todo.title}</div>
        <div className="todo-meta">
          <span className={`priority-badge ${todo.priority}`}>{priorityLabels[todo.priority]}</span>
          <span className="category-badge">{categoryIcons[todo.category]} {categoryLabels[todo.category]}</span>
          {todo.deadline && (
            <span className={`todo-date ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
              {isOverdue ? '⚠ Terlambat' : isToday ? '📅 Hari ini' : ''} {formatDate(todo.deadline)} {todo.deadlineTime && `• ${formatTime(todo.deadlineTime)}`}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button className="btn-edit" onClick={() => setEditingId(todo.id)} title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="btn-delete" onClick={() => deleteTodo(todo.id)} title="Hapus">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TodoItem
