import { Link } from 'react-router-dom';

const statuses = ['Открыт', 'В обработке', 'Закрыт'];

export default function IncidentCard({ incident, onDelete, onStatusChange }) {
  const role = localStorage.getItem('role') || 'guest';

  return (
    <article className="incident-card">
      <div className="incident-main">
        <div className="incident-card-header">
          <p className="item-id">ИНЦИДЕНТ #{incident.id}</p>
          <span className="status">{incident.status}</span>
        </div>
        <h3>{incident.title}</h3>
        <div className="incident-meta">
          <span>{incident.category}</span>
          <span>{incident.zone}</span>
          <span>{incident.threatLevel}</span>
          <span>{incident.operator}</span>
        </div>
        <p>{incident.description}</p>
      </div>

      <div className="card-actions">
        <Link to={`/detail/${incident.id}`}>Подробнее</Link>
        {role === 'operator' && (
          <select value={incident.status} onChange={(event) => onStatusChange(incident.id, event.target.value)}>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        )}
        {role === 'admin' && (
          <>
            <Link to={`/edit/${incident.id}`}>Редактировать</Link>
            <button type="button" onClick={() => onDelete(incident.id)}>Удалить</button>
          </>
        )}
      </div>
    </article>
  );
}
