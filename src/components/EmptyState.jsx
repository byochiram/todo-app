function EmptyState({ search, filter }) {
  const title = search
    ? 'Tidak ditemukan'
    : filter === 'completed'
      ? 'Belum ada yang selesai'
      : filter === 'active'
        ? 'Semua selesai!'
        : 'Belum ada todo'

  const subtitle = search
    ? 'Coba kata kunci lain'
    : filter === 'all'
      ? 'Tambahkan tugasmu yang pertama'
      : ''

  return (
    <div className="empty-state">
      <span className="emoji">📋</span>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

export default EmptyState
