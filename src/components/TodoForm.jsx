import { useState } from 'react'

function TodoForm({ addTodo }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      addTodo({ title: title.trim(), priority, deadline })
      setTitle('')
      setPriority('medium')
      setDeadline('')
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Apa yang harus dikerjakan?"
        />
        <button type="submit" className="btn-add">Tambah</button>
      </div>
      <div className="todo-form-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">🔴 Tinggi</option>
          <option value="medium">🟡 Sedang</option>
          <option value="low">🔵 Rendah</option>
        </select>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
    </form>
  )
}

export default TodoForm
