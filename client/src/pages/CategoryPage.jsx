import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMealStore } from '../store/mealStore';
import DishCard from '../components/DishCard';

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { dishes, loading, fetchDishesByCategory } = useMealStore();

  useEffect(() => {
    if (category) {
      fetchDishesByCategory(category);
    }
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-gray-800 capitalize">{category}</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading dishes...</p>
        </div>
      ) : (
        <>
          {dishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map(dish => (
                <DishCard key={dish._id} dish={dish} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No dishes found in this category</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
