import api from './api';

export const placeOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data.order;
};

export const fetchOrders = async () => {
  const { data } = await api.get('/orders');
  return data; // { count, orders }
};
