import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealStore } from '../store/mealStore';
import CategoryCard from '../components/CategoryCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { fetchDishes, fetchIngredients } = useMealStore();

  useEffect(() => {
    fetchDishes();
    fetchIngredients();
  }, []);

  const categories = [
    { name: 'breakfast', path: '/breakfast' },
    { name: 'meal', path: '/meal' },
    { name: 'snacks', path: '/snacks' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">What are we making today?</h2>
        <p className="text-gray-600">Browse our meal categories or search by ingredients you have</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map(category => (
          <CategoryCard
            key={category.name}
            name={category.name}
            onClick={() => navigate(category.path)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/what-we-have')}
          className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg p-8 shadow-md hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
        >
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-2xl font-bold">What do we have?</h2>
          <p className="mt-2 text-green-100">Select ingredients and find matching dishes</p>
        </div>

        <div
          onClick={() => navigate('/add-dish')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg p-8 shadow-md hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
        >
          <div className="text-5xl mb-3">➕</div>
          <h2 className="text-2xl font-bold">Add New Dish</h2>
          <p className="mt-2 text-purple-100">Create your own recipe</p>
        </div>
      </div>
    </div>
  );
}
