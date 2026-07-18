import { useState, useMemo } from 'react'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS, PRIORITY_LABELS } from '../constants'
import { EditIcon, DeleteIcon, DragIcon } from './Icons'

function TodoItem({ todo, index, toggleComplete, deleteTodo, updateTodo, editingId, setEditingId, onDragStart, onDragOver, onDragEnd, isDragging }) {
  const [editText, setEditText] = useState(todo.title)
  const [editPriority, setEditPriority] = useState(todo.priority)
  const [editCategory, setEditCategory] = useState(todo.category)
  const [editDeadline, setEditDeadline] = useState(todo.deadline || '')
  const [editDeadlineTime, setEditDeadlineTime] = useState(todo.deadlineTime || '')
  const isEditing = editingId === todo.id

  const deadlineInfo = useMemo(() => {
    if (!todo.deadline) return null
    const today = new Date(new Date().toDateString())
    const deadlineDate = new Date(todo.deadline)
    const isOverdue = !todo.completed && deadlineDate < today
    const isToday = deadlineDate.getTime() === today.getTime()
    const isUpcoming = !todo.completed && deadlineDate > today
    return { isOverdue, isToday, isUpcoming }
  }, [todo.deadline, todo.completed])

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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

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
    isDragging && 'dragging',
    isEditing && 'editing',
    todo.completed && 'completed-item',
  ].filter(Boolean).join(' ')

  if (isEditing) {
    return (
      <div className={itemClass}>
        <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} />
        <div className="todo-content">
          <input className="edit-input" type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
          <div className="edit-row">
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <div className="edit-row">
            <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
            <input type="time" value={editDeadlineTime} onChange={(e) => setEditDeadlineTime(e.target.value)} />
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
    <div className={itemClass} draggable onDragStart={() => onDragStart(index)} onDragOver={(e) => onDragOver(e, index)} onDragEnd={onDragEnd}>
      <span className="drag-handle" title="Drag untuk urutkan"><DragIcon /></span>
      <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} />
      <div className="todo-content">
        <div className={`todo-title ${todo.completed ? 'done' : ''}`}>{todo.title}</div>
        <div className="todo-meta">
          <span className={`priority-badge ${todo.priority}`}>{PRIORITY_LABELS[todo.priority]}</span>
          <span className="category-badge">{CATEGORY_ICONS[todo.category]} {CATEGORY_LABELS[todo.category]}</span>
          {todo.deadline && deadlineInfo && (
            <span className={`todo-date ${deadlineInfo.isOverdue ? 'overdue' : ''} ${deadlineInfo.isToday ? 'today' : ''} ${deadlineInfo.isUpcoming ? 'upcoming' : ''}`}>
              {deadlineInfo.isOverdue ? '⚠ Terlambat' : deadlineInfo.isToday ? '📅 Hari ini' : ''} {formatDate(todo.deadline)} {todo.deadlineTime && `• ${formatTime(todo.deadlineTime)}`}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button className="btn-edit" onClick={() => setEditingId(todo.id)} title="Edit"><EditIcon /></button>
        <button className="btn-delete" onClick={() => deleteTodo(todo.id)} title="Hapus"><DeleteIcon /></button>
      </div>
    </div>
  )
}

export default TodoItem
