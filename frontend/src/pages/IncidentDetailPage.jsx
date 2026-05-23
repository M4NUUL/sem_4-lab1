import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getIncident, updateIncidentStatus } from '../api/incidentsApi';
import Loader from '../components/Loader';

const statuses = ['Открыт', 'В обработке', 'Закрыт'];

export default function IncidentDetailPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role') || 'guest';

  useEffect(() => {
    const loadIncident = async () => {
      try {
        const data = await getIncident(id);
        setIncident(data);
      } catch (err) {
        setError('Не удалось загрузить инцидент');
      } finally {
        setLoading(false);
      }
    };

    loadIncident();
  }, [id]);

  const handleStatusChange = async (event) => {
    try {
      const updated = await updateIncidentStatus(id, event.target.value);
      setIncident(updated);
    } catch (err) {
      setError('Не удалось изменить статус');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="page detail-page">
      <p className="eyebrow">ИНЦИДЕНТ #{incident.id}</p>
      <h1>{incident.title}</h1>

      <div className="detail-grid">
        <p><strong>Категория:</strong> {incident.category}</p>
        <p><strong>Зона:</strong> {incident.zone}</p>
        <p><strong>Уровень угрозы:</strong> {incident.threatLevel}</p>
        <p><strong>Статус:</strong> {incident.status}</p>
        <p><strong>Оператор:</strong> {incident.operator}</p>
        <p><strong>Создан:</strong> {new Date(incident.createdAt).toLocaleString()}</p>
      </div>

      {role === 'operator' && (
        <label className="status-control">
          Изменить статус
          <select value={incident.status} onChange={handleStatusChange}>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      )}

      <p className="detail-description">{incident.description}</p>

      <div className="form-actions">
        <Link className="button-secondary" to="/">Назад</Link>
        {role === 'admin' && <Link className="button-primary" to={`/edit/${incident.id}`}>Редактировать</Link>}
      </div>
    </section>
  );
}
