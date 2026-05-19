import { Link, useNavigate } from 'react-router-dom';

const roleNames = {
  guest: 'Гость',
  operator: 'Оператор',
  admin: 'Администратор',
};

export default function Navbar() {
  const navigate = useNavigate();
  const login = localStorage.getItem('login');
  const role = localStorage.getItem('role') || 'guest';

  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">Инциденты безопасности</Link>
      <nav>
        <span className="user-chip">
          {login ? `${login} (${roleNames[role]})` : roleNames.guest}
        </span>
        <Link to="/">Инциденты</Link>
        {role === 'admin' && (
          <>
            <Link className="nav-button" to="/add">Добавить инцидент</Link>
            <Link to="/admin/users">Пользователи</Link>
          </>
        )}
        {login ? (
          <button className="nav-link-button" type="button" onClick={handleLogout}>Выйти</button>
        ) : (
          <Link className="nav-button" to="/login">Войти</Link>
        )}
      </nav>
    </header>
  );
}
