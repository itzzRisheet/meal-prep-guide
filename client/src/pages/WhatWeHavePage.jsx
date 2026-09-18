import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealStore } from '../store/mealStore';
import IngredientFilter from '../components/IngredientFilter';
import DishCard from '../components/DishCard';

export default function WhatWeHavePage() {
  const navigate = useNavigate();
  const { filteredDishes, loading, clearSelectedIngredients, fetchIngredients, fetchDishes } = useMealStore();

  useEffect(() => {
    fetchIngredients();
    fetchDishes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            clearSelectedIngredients();
            navigate('/');
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-gray-800">What do we have?</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Ingredients</h3>
            <IngredientFilter />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-4 bg-white rounded-lg shadow-md p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Searching dishes...</p>
              </div>
            ) : (
              <>
                {filteredDishes.length > 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Found {filteredDishes.length} dish{filteredDishes.length !== 1 ? 'es' : ''}
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {filteredDishes.map(dish => (
                        <DishCard key={dish._id} dish={dish} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">Select ingredients to find dishes</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
