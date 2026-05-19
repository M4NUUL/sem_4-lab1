import api from './api';

const getHeaders = () => ({
  'x-user-role': localStorage.getItem('role') || 'guest',
});

export const getUsers = async () => {
  const response = await api.get('/users', { headers: getHeaders() });
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post('/users', user, { headers: getHeaders() });
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`/users/${id}`, user, { headers: getHeaders() });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`, { headers: getHeaders() });
  return response.data;
};
