const getRole = (req) => req.headers['x-user-role'] || 'guest';

const allowRoles = (...roles) => (req, res, next) => {
  const role = getRole(req);

  if (!roles.includes(role)) {
    return res.status(403).json({ error: 'Недостаточно прав для выполнения операции' });
  }

  next();
};

const adminOnly = allowRoles('admin');
const operatorOrAdmin = allowRoles('operator', 'admin');

module.exports = {
  adminOnly,
  operatorOrAdmin,
};
