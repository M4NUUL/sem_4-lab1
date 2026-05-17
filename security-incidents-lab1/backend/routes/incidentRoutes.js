const express = require('express');
const {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  updateIncidentStatus,
  deleteIncident,
} = require('../controllers/incidentController');
const { adminOnly, operatorOrAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/', adminOnly, createIncident);
router.put('/:id', adminOnly, updateIncident);
router.patch('/:id/status', operatorOrAdmin, updateIncidentStatus);
router.delete('/:id', adminOnly, deleteIncident);

module.exports = router;
