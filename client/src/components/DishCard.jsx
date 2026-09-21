import React from 'react';
import { Link } from 'react-router-dom';

export default function DishCard({ dish }) {
  const nutrition = dish.nutrition;

  return (
    <Link to={`/dish/${dish._id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer h-full">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {dish.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {dish.description}
        </p>

        {/* Nutrition */}
        {nutrition && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800">
                🔥 {nutrition.calories?.estimated ?? '-'} kcal
              </span>

              {nutrition.isEstimated && (
                <span className="text-xs text-gray-500">
                  Estimated
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="bg-blue-50 rounded p-1.5">
                <div className="text-xs font-semibold text-blue-700">
                  {nutrition.macros?.protein_g?.estimated ?? '-'}g
                </div>
                <div className="text-[10px] text-gray-500">
                  Protein
                </div>
              </div>

              <div className="bg-orange-50 rounded p-1.5">
                <div className="text-xs font-semibold text-orange-700">
                  {nutrition.macros?.carbs_g?.estimated ?? '-'}g
                </div>
                <div className="text-[10px] text-gray-500">
                  Carbs
                </div>
              </div>

              <div className="bg-yellow-50 rounded p-1.5">
                <div className="text-xs font-semibold text-yellow-700">
                  {nutrition.macros?.fat_g?.estimated ?? '-'}g
                </div>
                <div className="text-[10px] text-gray-500">
                  Fat
                </div>
              </div>

              <div className="bg-green-50 rounded p-1.5">
                <div className="text-xs font-semibold text-green-700">
                  {nutrition.macros?.fiber_g?.estimated ?? '-'}g
                </div>
                <div className="text-[10px] text-gray-500">
                  Fiber
                </div>
              </div>
            </div>

            {nutrition.unresolvedIngredients?.length > 0 && (
              <p className="text-[10px] text-gray-400 mt-2">
                Nutrition incomplete for some ingredients
              </p>
            )}
          </div>
        )}

        {/* Prep time + difficulty */}
        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {dish.prepTime} min
          </span>

          <span
            className={`px-2 py-1 rounded text-white text-xs font-semibold
              ${
                dish.difficulty === 'easy'
                  ? 'bg-green-500'
                  : dish.difficulty === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
          >
            {dish.difficulty}
          </span>
        </div>

        {dish.rating > 0 && (
          <div className="mt-2 text-yellow-500">
            {'⭐'.repeat(Math.round(dish.rating))}
          </div>
        )}
      </div>
    </Link>
  );
}