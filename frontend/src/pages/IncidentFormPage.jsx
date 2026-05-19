import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createIncident, getIncident, updateIncident } from '../api/incidentsApi';
import Loader from '../components/Loader';

const categories = [
  'Контроль доступа',
  'Подозрительная активность',
  'Нарушение порядка',
  'Техническая неисправность',
  'Переполнение зоны',
  'Экстренная ситуация',
];

const threatLevels = ['Низкий', 'Средний', 'Высокий', 'Критический'];
const statuses = ['Открыт', 'В обработке', 'Закрыт'];

const initialForm = {
  title: '',
  category: '',
  zone: '',
  threatLevel: '',
  status: '',
  operator: '',
  description: '',
};

export default function IncidentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const loadIncident = async () => {
      try {
        const data = await getIncident(id);
        setForm({
          title: data.title,
          category: data.category,
          zone: data.zone,
          threatLevel: data.threatLevel,
          status: data.status,
          operator: data.operator,
          description: data.description,
        });
      } catch (err) {
        setError('Не удалось загрузить инцидент');
      } finally {
        setLoading(false);
      }
    };

    loadIncident();
  }, [id, isEdit]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.title.trim()) return 'Введите название инцидента';
    if (!form.category) return 'Выберите категорию';
    if (!form.zone.trim()) return 'Введите зону';
    if (!form.threatLevel) return 'Выберите уровень угрозы';
    if (!form.status) return 'Выберите статус';
    if (!form.operator.trim()) return 'Введите оператора';
    if (!form.description.trim()) return 'Введите описание';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await updateIncident(id, form);
      } else {
        await createIncident(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось сохранить инцидент');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="page form-page">
      <div className="page-heading">
        <p className="eyebrow">{isEdit ? 'Редактирование' : 'Создание'}</p>
        <h1>{isEdit ? 'Редактировать инцидент' : 'Добавить инцидент'}</h1>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Название
          <input name="title" value={form.title} onChange={handleChange} />
        </label>

        <label>
          Категория
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Выберите категорию</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <label>
          Зона
          <input name="zone" value={form.zone} onChange={handleChange} />
        </label>

        <label>
          Уровень угрозы
          <select name="threatLevel" value={form.threatLevel} onChange={handleChange}>
            <option value="">Выберите уровень</option>
            {threatLevels.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>

        <label>
          Статус
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">Выберите статус</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          Оператор
          <input name="operator" value={form.operator} onChange={handleChange} />
        </label>

        <label>
          Описание
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button className="button-primary" type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button className="button-secondary" type="button" onClick={() => navigate('/')}>
            Отмена
          </button>
        </div>
      </form>
    </section>
  );
}
