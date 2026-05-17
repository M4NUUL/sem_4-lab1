import { useEffect, useState } from 'react';
import { createUser, deleteUser, getUsers, updateUser } from '../api/usersApi';
import Loader from '../components/Loader';

const roles = ['guest', 'operator', 'admin'];

const roleNames = {
  guest: 'Гость',
  operator: 'Оператор',
  admin: 'Администратор',
};

const initialForm = {
  login: '',
  password: '',
  role: 'operator',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ login: user.login, password: '', role: user.role });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.login.trim() || !form.role || (!editingId && !form.password.trim())) {
      setError('Введите логин, пароль и роль');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось сохранить пользователя');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить пользователя?')) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (err) {
      setError('Не удалось удалить пользователя');
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Меню администратора</p>
        <h1>Управление пользователями</h1>
      </div>

      <form className="form compact-form" onSubmit={handleSubmit}>
        <label>
          Логин
          <input name="login" value={form.login} onChange={handleChange} />
        </label>
        <label>
          Пароль
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={editingId ? 'Оставьте пустым, чтобы не менять' : ''}
          />
        </label>
        <label>
          Роль
          <select name="role" value={form.role} onChange={handleChange}>
            {roles.map((role) => <option key={role} value={role}>{roleNames[role]}</option>)}
          </select>
        </label>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button className="button-primary" type="submit" disabled={saving}>
            {editingId ? 'Сохранить пользователя' : 'Создать пользователя'}
          </button>
          {editingId && (
            <button className="button-secondary" type="button" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="users-table">
          {users.map((user) => (
            <div className="user-row" key={user.id}>
              <span>#{user.id}</span>
              <strong>{user.login}</strong>
              <span>{roleNames[user.role]}</span>
              <div className="card-actions">
                <button type="button" onClick={() => startEdit(user)}>Редактировать</button>
                <button type="button" onClick={() => handleDelete(user.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
