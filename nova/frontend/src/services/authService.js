import api from './api';

export const adminLogin = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { token, user }
};

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};
