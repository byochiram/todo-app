function Filter({ filter, setFilter, hasCompleted, clearCompleted }) {
  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Semua</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Aktif</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Selesai</button>
      </div>
      {hasCompleted && (
        <button className="btn-clear" onClick={clearCompleted}>Hapus selesai</button>
      )}
    </div>
  )
}

export default Filter
