function Stats({ total, active, done }) {
  return (
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
  )
}

export default Stats
