import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import Loader from '../components/Loader';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.login.trim() || !form.password.trim()) {
      setError('Введите логин и пароль');
      return;
    }

    try {
      setLoading(true);
      const user = await login(form.login, form.password);
      localStorage.setItem('login', user.login);
      localStorage.setItem('role', user.role);
      localStorage.setItem('token', user.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page login-page">
      <div className="page-heading">
        <p className="eyebrow">Учебная авторизация</p>
        <h1>Вход в систему</h1>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Логин
          <input name="login" value={form.login} onChange={handleChange} placeholder="login" />
        </label>

        <label>
          Пароль
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="password"
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="button-primary" type="submit" disabled={loading}>Войти</button>
      </form>

      {loading && <Loader />}
    </section>
  );
}
