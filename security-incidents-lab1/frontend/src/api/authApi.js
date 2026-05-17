import api from './api';

export const login = async (loginValue, password) => {
  const response = await api.post('/auth/login', {
    login: loginValue,
    password,
  });
  return response.data;
};
