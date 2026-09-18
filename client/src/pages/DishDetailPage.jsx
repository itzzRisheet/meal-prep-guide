import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMealStore } from '../store/mealStore';

export default function DishDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dishes, loading } = useMealStore();
  const [dish, setDish] = useState(null);

  useEffect(() => {
    const foundDish = dishes.find(d => d._id === id);
    setDish(foundDish);
  }, [id, dishes]);

  if (loading || !dish) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition mb-6"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{dish.name}</h1>
          <p className="text-gray-600 text-lg">{dish.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">Prep Time</p>
            <p className="text-2xl font-bold text-blue-600">{dish.prepTime} min</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">Difficulty</p>
            <p className="text-2xl font-bold text-green-600 capitalize">{dish.difficulty}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">Category</p>
            <p className="text-2xl font-bold text-yellow-600 capitalize">{dish.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h3>
            <ul className="space-y-3">
              {dish.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <span className="text-blue-500">✓</span>
                  <span>{ing.name} - {ing.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Recipe</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dish.recipe}</p>
          </div>
        </div>

        {dish.youtubeLink && (
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Watch Tutorial</h3>
            <a
              href={dish.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <span>▶️</span>
              Open YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
