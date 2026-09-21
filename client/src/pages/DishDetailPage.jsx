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

  const nutrition = dish.nutrition;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition mb-6"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Dish Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {dish.name}
          </h1>

          <p className="text-gray-600 text-lg">
            {dish.description}
          </p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">
              Prep Time
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {dish.prepTime} min
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">
              Difficulty
            </p>
            <p className="text-2xl font-bold text-green-600 capitalize">
              {dish.difficulty}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">
              Category
            </p>
            <p className="text-2xl font-bold text-yellow-600 capitalize">
              {dish.category}
            </p>
          </div>
        </div>

        {/* Nutrition */}
        {nutrition && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Nutrition
              </h3>

              {nutrition.isEstimated && (
                <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  Estimated
                </span>
              )}
            </div>

            {/* Calories */}
            <div className="bg-orange-50 rounded-lg p-5 mb-4">
              <p className="text-sm text-gray-600 font-semibold mb-1">
                Calories
              </p>

              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-orange-600">
                  {nutrition.calories?.estimated ?? '-'} kcal
                </p>

                {nutrition.calories?.min !== undefined &&
                  nutrition.calories?.max !== undefined && (
                    <span className="text-sm text-gray-500">
                      ({nutrition.calories.min}–{nutrition.calories.max} kcal)
                    </span>
                  )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Estimated range based on ingredient quantities and conversions
              </p>
            </div>

            {/* Macronutrients */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Protein
                </p>
                <p className="text-xl font-bold text-blue-700">
                  {nutrition.macros?.protein_g?.estimated ?? '-'} g
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {nutrition.macros?.protein_g?.min ?? '-'}–
                  {nutrition.macros?.protein_g?.max ?? '-'} g
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Carbs
                </p>
                <p className="text-xl font-bold text-orange-700">
                  {nutrition.macros?.carbs_g?.estimated ?? '-'} g
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {nutrition.macros?.carbs_g?.min ?? '-'}–
                  {nutrition.macros?.carbs_g?.max ?? '-'} g
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Fat
                </p>
                <p className="text-xl font-bold text-yellow-700">
                  {nutrition.macros?.fat_g?.estimated ?? '-'} g
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {nutrition.macros?.fat_g?.min ?? '-'}–
                  {nutrition.macros?.fat_g?.max ?? '-'} g
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Fiber
                </p>
                <p className="text-xl font-bold text-green-700">
                  {nutrition.macros?.fiber_g?.estimated ?? '-'} g
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {nutrition.macros?.fiber_g?.min ?? '-'}–
                  {nutrition.macros?.fiber_g?.max ?? '-'} g
                </p>
              </div>
            </div>

            {/* Vitamins & Minerals */}
            {nutrition.vitaminsMinerals &&
              Object.keys(nutrition.vitaminsMinerals).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    Vitamins & Minerals
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(nutrition.vitaminsMinerals).map(
                      ([name, data]) => (
                        <div
                          key={name}
                          className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">
                              {name}
                            </span>

                            <span className="font-bold text-gray-700">
                              {data.amount?.toFixed
                                ? data.amount.toFixed(1)
                                : data.amount}{' '}
                              {data.unit}
                            </span>
                          </div>

                          {data.dailyRequirement && (
                            <p className="text-xs text-gray-500 mt-1">
                              Daily requirement: {data.dailyRequirement}
                            </p>
                          )}

                          {data.notes && (
                            <p className="text-xs text-gray-400 mt-1">
                              {data.notes}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Unresolved Ingredients */}
            {nutrition.unresolvedIngredients?.length > 0 && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-800 mb-2">
                  Nutrition couldn't be calculated for:
                </h4>

                <ul className="space-y-1">
                  {nutrition.unresolvedIngredients.map(
                    (ingredient, index) => (
                      <li
                        key={index}
                        className="text-sm text-yellow-700"
                      >
                        <strong>{ingredient.name}</strong>
                        {' — '}
                        {ingredient.reason}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Ingredients + Recipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ingredients
            </h3>

            <ul className="space-y-3">
              {dish.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <span className="text-blue-500">✓</span>

                  <span>
                    {ing.name} - {ing.quantity}{' '}
                    {ing.unit && ing.unit !== 'to taste'
                      ? ing.unit
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Recipe
            </h3>

            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {dish.recipe}
            </p>
          </div>
        </div>

        {/* YouTube */}
        {dish.youtubeLink && (
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Watch Tutorial
            </h3>

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