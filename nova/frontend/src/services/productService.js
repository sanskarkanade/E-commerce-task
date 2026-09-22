import api from './api';

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data; // { count, products }
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
};

export const createProduct = async (payload) => {
  const { data } = await api.post('/products', payload);
  return data.product;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.product;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
