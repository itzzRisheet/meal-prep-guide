import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const dishService = {
  getAllDishes: () => api.get('/dishes'),
  getDishesByCategory: (category) => api.get(`/dishes/category/${category}`),
  getDishById: (id) => api.get(`/dishes/${id}`),
  createDish: (data) => api.post('/dishes', data),
  updateDish: (id, data) => api.put(`/dishes/${id}`, data),
  deleteDish: (id) => api.delete(`/dishes/${id}`),
  searchByIngredients: (ingredients) => api.post('/dishes/search/ingredients', { ingredients }),
};

export const ingredientService = {
  getAllIngredients: () => api.get('/ingredients'),
  getIngredientsByCategory: (category) => api.get(`/ingredients/category/${category}`),
  createIngredient: (data) => api.post('/ingredients', data),
  updateIngredient: (id, data) => api.put(`/ingredients/${id}`, data),
  deleteIngredient: (id) => api.delete(`/ingredients/${id}`),
};

export default api;
