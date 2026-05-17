import api from './api';

export const getIncidents = async (params) => {
  const response = await api.get('/incidents', { params });
  return response.data;
};

export const getIncident = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const createIncident = async (incident, role) => {
  const response = await api.post('/incidents', incident, {
    headers: { 'x-user-role': role },
  });
  return response.data;
};

export const updateIncident = async (id, incident, role) => {
  const response = await api.put(`/incidents/${id}`, incident, {
    headers: { 'x-user-role': role },
  });
  return response.data;
};

export const updateIncidentStatus = async (id, status, role) => {
  const response = await api.patch(`/incidents/${id}/status`, { status }, {
    headers: { 'x-user-role': role },
  });
  return response.data;
};

export const deleteIncident = async (id, role) => {
  const response = await api.delete(`/incidents/${id}`, {
    headers: { 'x-user-role': role },
  });
  return response.data;
};
