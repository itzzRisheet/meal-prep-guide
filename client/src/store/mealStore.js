import create from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const useMealStore = create((set, get) => ({
  dishes: [],
  ingredients: [],
  filteredDishes: [],
  selectedIngredients: [],
  selectedCategory: 'breakfast',
  loading: false,
  error: null,

  // Fetch all dishes
  fetchDishes: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_BASE}/dishes`);
      set({ dishes: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch dishes by category
  fetchDishesByCategory: async (category) => {
    set({ loading: true, selectedCategory: category });
    try {
      const response = await axios.get(`${API_BASE}/dishes/category/${category}`);
      set({ dishes: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch all ingredients
  fetchIngredients: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_BASE}/ingredients`);
      set({ ingredients: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Search dishes by ingredients
  searchByIngredients: async (ingredientNames) => {
    set({ loading: true, selectedIngredients: ingredientNames });
    try {
      const response = await axios.post(`${API_BASE}/dishes/search/ingredients`, {
        ingredients: ingredientNames
      });
      set({ filteredDishes: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add selected ingredient
  addSelectedIngredient: (ingredient) => {
    const current = get().selectedIngredients;
    if (!current.includes(ingredient)) {
      set({ selectedIngredients: [...current, ingredient] });
    }
  },

  // Remove selected ingredient
  removeSelectedIngredient: (ingredient) => {
    const current = get().selectedIngredients;
    set({ selectedIngredients: current.filter(i => i !== ingredient) });
  },

  // Clear selected ingredients
  clearSelectedIngredients: () => {
    set({ selectedIngredients: [], filteredDishes: [] });
  },

  // Create new dish
  createDish: async (dishData) => {
    try {
      const response = await axios.post(`${API_BASE}/dishes`, dishData);
      set({ dishes: [...get().dishes, response.data] });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update dish
  updateDish: async (id, dishData) => {
    try {
      const response = await axios.put(`${API_BASE}/dishes/${id}`, dishData);
      const updated = get().dishes.map(d => d._id === id ? response.data : d);
      set({ dishes: updated });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete dish
  deleteDish: async (id) => {
    try {
      await axios.delete(`${API_BASE}/dishes/${id}`);
      set({ dishes: get().dishes.filter(d => d._id !== id) });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Create new ingredient
 createIngredient: async (ingredientData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/ingredients`,
      ingredientData
    );

    set({
      ingredients: [...get().ingredients, response.data],
      error: null
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to create ingredient';

    set({ error: message });
    throw new Error(message);
  }
},

  // Clear error
  clearError: () => set({ error: null })
}));
