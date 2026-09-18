import React, { useState } from 'react';

export default function IngredientCard({ ingredient }) {
  const [expanded, setExpanded] = useState(false);

  // Emoji/icon map for categories
  const categoryIcons = {
    vegetables: '🥬',
    fruits: '🍎',
    grains: '🌾',
    proteins: '🍗',
    dairy: '🥛',
    spices: '🧂',
    oils: '🫒',
    other: '📦'
  };

  const icon = categoryIcons[ingredient.category] || '🥘';
  const nutrients = ingredient.nutrients || {};
  const vitamins = ingredient.vitamins_minerals || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header - Click to expand */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="text-5xl mb-3 text-center">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 capitalize text-center">{ingredient.name}</h3>
        <p className="text-sm text-slate-500 text-center mt-1">{ingredient.category}</p>

        {/* Quick Nutrient Summary */}
        {nutrients.calories_kcal && (
          <div className="mt-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{nutrients.calories_kcal}</p>
            <p className="text-xs text-slate-500">kcal / {nutrients.base || 'serving'}</p>
          </div>
        )}

        {/* Expand indicator */}
        <div className="text-center mt-3">
          <span className="text-sm text-slate-600">
            {expanded ? '▲ Hide details' : '▼ Show details'}
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
          {/* Macronutrients */}
          {(nutrients.protein_g || nutrients.carbs_g || nutrients.fat_g || nutrients.fiber_g) && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Macronutrients</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {nutrients.protein_g !== undefined && (
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <p className="text-slate-600">Protein</p>
                    <p className="font-bold text-slate-900">{nutrients.protein_g}g</p>
                  </div>
                )}
                {nutrients.carbs_g !== undefined && (
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <p className="text-slate-600">Carbs</p>
                    <p className="font-bold text-slate-900">{nutrients.carbs_g}g</p>
                  </div>
                )}
                {nutrients.fat_g !== undefined && (
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <p className="text-slate-600">Fat</p>
                    <p className="font-bold text-slate-900">{nutrients.fat_g}g</p>
                  </div>
                )}
                {nutrients.fiber_g !== undefined && (
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <p className="text-slate-600">Fiber</p>
                    <p className="font-bold text-slate-900">{nutrients.fiber_g}g</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Tag */}
          {nutrients.health_tag && (
            <div>
              <p className="text-sm text-slate-600">Health</p>
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                nutrients.health_tag === 'Best'
                  ? 'bg-green-100 text-green-800'
                  : nutrients.health_tag === 'Moderate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {nutrients.health_tag}
              </p>
            </div>
          )}

          {/* Vitamins & Minerals */}
          {vitamins && vitamins.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Vitamins & Minerals</h4>
              <div className="space-y-2">
                {vitamins.map((vm, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{vm.nutrient}</p>
                        <p className="text-xs text-slate-500">{vm.amount} / {vm.serving}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        vm.notes === 'Best' || vm.notes === 'Excellent'
                          ? 'bg-green-100 text-green-800'
                          : vm.notes === 'Good' || vm.notes === 'Moderate'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vm.percent_fulfilled}
                      </span>
                    </div>
                    {vm.daily_requirement && (
                      <p className="text-xs text-slate-500 mt-1">DV: {vm.daily_requirement}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
