import api from './api';

export const getIncidents = async (params) => {
  const response = await api.get('/incidents', { params });
  return response.data;
};

export const getIncident = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const createIncident = async (incident) => {
  const response = await api.post('/incidents', incident);
  return response.data;
};

export const updateIncident = async (id, incident) => {
  const response = await api.put(`/incidents/${id}`, incident);
  return response.data;
};

export const updateIncidentStatus = async (id, status) => {
  const response = await api.patch(`/incidents/${id}/status`, { status });
  return response.data;
};

export const deleteIncident = async (id) => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data;
};
