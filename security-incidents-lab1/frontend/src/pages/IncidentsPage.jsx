import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteIncident, getIncidents, updateIncidentStatus } from '../api/incidentsApi';
import IncidentCard from '../components/IncidentCard';
import Loader from '../components/Loader';

const LIMIT = 5;
const statuses = ['', 'Открыт', 'В обработке', 'Закрыт'];
const threatLevels = ['', 'Низкий', 'Средний', 'Высокий', 'Критический'];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [threatLevel, setThreatLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const observerTarget = useRef(null);
  const role = localStorage.getItem('role') || 'guest';

  const loadIncidents = useCallback(async (append = false, offset = 0) => {
    try {
      setError('');
      append ? setLoadingMore(true) : setLoading(true);
      if (!append) {
        setHasMore(true);
      }

      const data = await getIncidents({ limit: LIMIT, offset, search, status, threatLevel });
      setIncidents((current) => (append ? [...current, ...data] : data));
      setHasMore(data.length === LIMIT);
    } catch (err) {
      setError('Не удалось загрузить инциденты');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, status, threatLevel]);

  useEffect(() => {
    loadIncidents(false, 0);
  }, [loadIncidents]);

  useEffect(() => {
    if (!observerTarget.current || !hasMore || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
        loadIncidents(true, incidents.length);
      }
    });

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, incidents.length, loadIncidents, loading, loadingMore]);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить инцидент?')) {
      return;
    }

    try {
      await deleteIncident(id, role);
      setIncidents((current) => current.filter((incident) => incident.id !== id));
    } catch (err) {
      setError('Не удалось удалить инцидент');
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    try {
      const updated = await updateIncidentStatus(id, nextStatus, role);
      setIncidents((current) => current.map((incident) => (
        incident.id === id ? updated : incident
      )));
    } catch (err) {
      setError('Не удалось изменить статус');
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">SPA / REST API / PostgreSQL</p>
        <h1>Инциденты безопасности</h1>
      </div>

      <div className="filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию, зоне или категории"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statuses.map((item) => (
            <option key={item || 'all-statuses'} value={item}>{item || 'Все статусы'}</option>
          ))}
        </select>
        <select value={threatLevel} onChange={(event) => setThreatLevel(event.target.value)}>
          {threatLevels.map((item) => (
            <option key={item || 'all-threats'} value={item}>{item || 'Все уровни угрозы'}</option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="incidents-list">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <div ref={observerTarget} className="scroll-sentinel">
        {loadingMore && <Loader />}
        {!hasMore && !loading && <span>Больше инцидентов нет</span>}
      </div>
    </section>
  );
}
