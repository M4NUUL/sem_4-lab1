const db = require('../db');

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return '';
  }

  return token;
};

const authenticate = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Требуется вход в систему' });
  }

  try {
    const { rows } = await db.query(
      `SELECT users.id, users.login, users.role
       FROM user_sessions
       JOIN users ON users.id = user_sessions.user_id
       WHERE user_sessions.token = $1`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Сессия недействительна' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const allowRoles = (...roles) => async (req, res, next) => {
  await authenticate(req, res, () => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения операции' });
    }

    next();
  });
};

const adminOnly = allowRoles('admin');
const operatorOrAdmin = allowRoles('operator', 'admin');

module.exports = {
  authenticate,
  adminOnly,
  operatorOrAdmin,
};
