import { useState } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '../constants'

function TodoForm({ addTodo }) {
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [deadline, setDeadline] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')
  const [category, setCategory] = useState('kerja')

  const resetForm = () => {
    setTitle('')
    setPriority('medium')
    setDeadline('')
    setDeadlineTime('')
    setCategory('kerja')
    setExpanded(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      addTodo({ title: title.trim(), priority, deadline, deadlineTime, category })
      resetForm()
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Apa yang harus dikerjakan?"
        />
        <button type="submit" className="btn-add">+ Tambah</button>
      </div>
      {expanded && (
        <div className="todo-form-row">
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">Tinggi</option>
            <option value="medium">Sedang</option>
            <option value="low">Rendah</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <input type="time" value={deadlineTime} onChange={(e) => setDeadlineTime(e.target.value)} />
        </div>
      )}
    </form>
  )
}

export default TodoForm
