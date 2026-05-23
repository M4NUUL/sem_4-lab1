const db = require('../db');

const mapUser = (user) => ({
  id: user.id,
  login: user.login,
  role: user.role,
});

const getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, login, role FROM users ORDER BY id ASC');
    res.json(rows.map(mapUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const createUser = async (req, res) => {
  const { login, password, role } = req.body;

  if (!login || !password || !role) {
    return res.status(400).json({ error: 'Введите логин, пароль и роль' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO users (login, password, role) VALUES ($1, $2, $3) RETURNING id, login, role',
      [login, password, role]
    );
    res.status(201).json(mapUser(rows[0]));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Пользователь с таким логином уже существует' });
    }
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateUser = async (req, res) => {
  const { login, password, role } = req.body;

  if (!login || !role) {
    return res.status(400).json({ error: 'Введите логин и роль' });
  }

  try {
    const { rows: currentRows } = await db.query('SELECT id, role FROM users WHERE id = $1', [req.params.id]);

    if (currentRows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (currentRows[0].role === 'admin' && role !== 'admin') {
      const { rows: adminRows } = await db.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
      const adminCount = Number(adminRows[0].count);

      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Нельзя снять роль с единственного администратора' });
      }
    }

    const values = password
      ? [login, password, role, req.params.id]
      : [login, role, req.params.id];
    const sql = password
      ? 'UPDATE users SET login = $1, password = $2, role = $3 WHERE id = $4 RETURNING id, login, role'
      : 'UPDATE users SET login = $1, role = $2 WHERE id = $3 RETURNING id, login, role';

    const { rows } = await db.query(sql, values);

    res.json(mapUser(rows[0]));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Пользователь с таким логином уже существует' });
    }
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, role FROM users WHERE id = $1', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (rows[0].role === 'admin') {
      const { rows: adminRows } = await db.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
      const adminCount = Number(adminRows[0].count);

      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Нельзя удалить единственного администратора' });
      }
    }

    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
