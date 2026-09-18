import React, { useState } from 'react';
import { useMealStore } from '../store/mealStore';

export default function IngredientFilter() {
const {
  ingredients,
  selectedIngredients,
  addSelectedIngredient,
  removeSelectedIngredient,
} = useMealStore();  
const [expandedCategory, setExpandedCategory] = useState('vegetables');
const [searchTerm, setSearchTerm] = useState('');
  const categories = ['vegetables', 'fruits', 'grains', 'proteins', 'dairy', 'spices', 'oils', 'other'];
  
  const ingredientsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = ingredients.filter(ing => ing.category === cat);
    return acc;
  }, {});

  const filteredIngredients = ingredients.filter(ingredient =>
  ingredient.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
);

  const handleIngredientToggle = (ingredientName) => {
    if (selectedIngredients.includes(ingredientName)) {
      removeSelectedIngredient(ingredientName);
    } else {
      addSelectedIngredient(ingredientName);
    }
  };
 

  const getNutrientSummary = (ingredient) => {
    const nuts = ingredient.nutrients || {};
    const items = [];
    
    if (nuts.protein_g !== undefined) items.push(`P: ${nuts.protein_g}g`);
    if (nuts.fiber_g !== undefined) items.push(`F: ${nuts.fiber_g}g`);
    if (nuts.fat_g !== undefined) items.push(`Fat: ${nuts.fat_g}g`);
    if (nuts.calories_kcal !== undefined) items.push(`${nuts.calories_kcal} kcal`);
    
    return items.join(" | ");
  };

  const getVitaminSummary = (ingredient) => {
    const vits = ingredient.vitamins_minerals || [];
    if (vits.length === 0) return null;
    const vitaminNames = vits.map(v => v.nutrient).join(', ');
    return `${vitaminNames}`;
  };

    return (
  <div className="space-y-4">

    {/* Search Ingredients */}
    <div className="bg-white border rounded-lg p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Search Ingredients
      </label>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for an ingredient..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
      />
    </div>

    {/* Selected Ingredients */}
    {selectedIngredients.length > 0 && (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm font-semibold mb-3 text-blue-900">
          Selected Ingredients ({selectedIngredients.length})
        </p>

        <div className="flex flex-wrap gap-2">
          {selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center gap-1 bg-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {ingredient}

              <button
                type="button"
                onClick={() => removeSelectedIngredient(ingredient)}
                className="ml-1 text-blue-700 hover:text-red-600 font-bold"
                title={`Remove ${ingredient}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Ingredient List */}
    {searchTerm.trim() ? (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-3 font-semibold">
          Search Results
        </div>

        <div className="p-3 bg-white space-y-3">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
              <div
                key={ingredient._id}
                className="border-b pb-2 last:border-b-0"
              >
                <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient.name)}
                    onChange={() =>
                      handleIngredientToggle(ingredient.name)
                    }
                    className="w-4 h-4 cursor-pointer mt-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {ingredient.name}
                    </p>

                    {getNutrientSummary(ingredient) && (
                      <p className="text-xs text-gray-600 mt-1">
                        {getNutrientSummary(ingredient)}
                      </p>
                    )}

                    {getVitaminSummary(ingredient) && (
                      <p className="text-xs text-blue-600 mt-1">
                        {getVitaminSummary(ingredient)}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm py-3">
              No ingredients found.
            </p>
          )}
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedCategory(
                  expandedCategory === category ? null : category
                )
              }
              className="w-full bg-gray-100 hover:bg-gray-200 p-3 text-left font-semibold capitalize flex justify-between items-center"
            >
              {category}

              <span>
                {expandedCategory === category ? '▼' : '▶'}
              </span>
            </button>

            {expandedCategory === category && (
              <div className="p-3 bg-white space-y-3">
                {ingredientsByCategory[category].map((ingredient) => (
                  <div
                    key={ingredient._id}
                    className="border-b pb-2 last:border-b-0"
                  >
                    <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(
                          ingredient.name
                        )}
                        onChange={() =>
                          handleIngredientToggle(ingredient.name)
                        }
                        className="w-4 h-4 cursor-pointer mt-1 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {ingredient.name}
                        </p>

                        {/* Nutrients Summary */}
                        {getNutrientSummary(ingredient) && (
                          <p className="text-xs text-gray-600 mt-1">
                            {getNutrientSummary(ingredient)}
                          </p>
                        )}

                        {/* Vitamins Summary */}
                        {getVitaminSummary(ingredient) && (
                          <p className="text-xs text-blue-600 mt-1">
                            {getVitaminSummary(ingredient)}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
)}
