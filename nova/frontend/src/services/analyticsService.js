import api from './api';

export const fetchOverview = async () => {
  const { data } = await api.get('/analytics/overview');
  return data;
};

export const fetchSales = async (days = 30) => {
  const { data } = await api.get('/analytics/sales', { params: { days } });
  return data;
};
