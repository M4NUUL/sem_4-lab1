const db = require('../db');

const mapIncident = (incident) => ({
  id: incident.id,
  title: incident.title,
  category: incident.category,
  zone: incident.zone,
  threatLevel: incident.threat_level,
  status: incident.status,
  operator: incident.operator_name,
  description: incident.description,
  createdAt: incident.created_at,
});

const getIncidents = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const offset = Number(req.query.offset) || 0;
  const search = req.query.search || '';
  const status = req.query.status || '';
  const threatLevel = req.query.threatLevel || '';

  const values = [];
  const conditions = [];

  if (search) {
    values.push(`%${search}%`);
    values.push(`%${search}%`);
    values.push(`%${search}%`);
    conditions.push(`(title ILIKE $${values.length - 2} OR zone ILIKE $${values.length - 1} OR category ILIKE $${values.length})`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (threatLevel) {
    values.push(threatLevel);
    conditions.push(`threat_level = $${values.length}`);
  }

  let sql = 'SELECT * FROM incidents';
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  values.push(limit, offset);
  sql += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

  try {
    const { rows } = await db.query(sql, values);
    res.json(rows.map(mapIncident));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM incidents WHERE id = $1', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Инцидент не найден' });
    }

    res.json(mapIncident(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const createIncident = async (req, res) => {
  const { title, category, zone, threatLevel, status, operator, description } = req.body;

  if (!title || !category || !zone || !threatLevel || !status || !operator || !description) {
    return res.status(400).json({ error: 'Заполните все поля инцидента' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO incidents (title, category, zone, threat_level, status, operator_name, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, category, zone, threatLevel, status, operator, description]
    );

    res.status(201).json(mapIncident(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateIncident = async (req, res) => {
  const { title, category, zone, threatLevel, status, operator, description } = req.body;

  if (!title || !category || !zone || !threatLevel || !status || !operator || !description) {
    return res.status(400).json({ error: 'Заполните все поля инцидента' });
  }

  try {
    const { rows } = await db.query(
      `UPDATE incidents
       SET title = $1,
           category = $2,
           zone = $3,
           threat_level = $4,
           status = $5,
           operator_name = $6,
           description = $7
       WHERE id = $8
       RETURNING *`,
      [title, category, zone, threatLevel, status, operator, description, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Инцидент не найден' });
    }

    res.json(mapIncident(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateIncidentStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Выберите статус' });
  }

  try {
    const { rows } = await db.query(
      'UPDATE incidents SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Инцидент не найден' });
    }

    res.json(mapIncident(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM incidents WHERE id = $1', [req.params.id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Инцидент не найден' });
    }

    res.json({ message: 'Инцидент удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  updateIncidentStatus,
  deleteIncident,
};
