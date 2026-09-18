import React, { useEffect, useState } from 'react';
import { useMealStore } from '../store/mealStore';
import IngredientCard from '../components/IngredientCard';

export default function IngredientsPage() {
  const { ingredients, fetchIngredients, loading } = useMealStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const categories = [
    'all',
    'vegetables',
    'fruits',
    'grains',
    'proteins',
    'dairy',
    'spices',
    'oils',
    'other'
  ];

  const filtered = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ing.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Ingredients Library</h1>
          <p className="text-slate-600">Browse all ingredients with detailed nutritional information</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-slate-600">Loading ingredients...</div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((ingredient) => (
              <IngredientCard key={ingredient._id || ingredient.name} ingredient={ingredient} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-slate-600 text-lg">No ingredients found</div>
          </div>
        )}
      </div>
    </div>
  );
}
