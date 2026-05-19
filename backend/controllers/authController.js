const db = require('../db');

const login = async (req, res) => {
  const { login: loginValue, password } = req.body;

  if (!loginValue || !password) {
    return res.status(400).json({ error: 'Введите логин и пароль' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id, login, role FROM users WHERE login = $1 AND password = $2',
      [loginValue, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  login,
};
