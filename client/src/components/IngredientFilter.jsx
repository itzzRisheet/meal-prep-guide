import React, { useState } from 'react';
import { useMealStore } from '../store/mealStore';

export default function IngredientFilter() {
  const { ingredients, selectedIngredients, addSelectedIngredient, removeSelectedIngredient, searchByIngredients } = useMealStore();
  const [expandedCategory, setExpandedCategory] = useState('vegetables');

  const categories = ['vegetables', 'fruits', 'grains', 'proteins', 'dairy', 'spices', 'oils', 'other'];
  
  const ingredientsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = ingredients.filter(ing => ing.category === cat);
    return acc;
  }, {});

  const handleIngredientToggle = (ingredientName) => {
    if (selectedIngredients.includes(ingredientName)) {
      removeSelectedIngredient(ingredientName);
    } else {
      addSelectedIngredient(ingredientName);
    }
  };

  const handleSearch = () => {
    if (selectedIngredients.length > 0) {
      searchByIngredients(selectedIngredients);
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
      {categories.map(category => (
        <div key={category} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            className="w-full bg-gray-100 hover:bg-gray-200 p-3 text-left font-semibold capitalize flex justify-between items-center"
          >
            {category}
            <span>{expandedCategory === category ? '▼' : '▶'}</span>
          </button>
          
          {expandedCategory === category && (
            <div className="p-3 bg-white space-y-3">
              {ingredientsByCategory[category].map(ingredient => (
                <div key={ingredient._id} className="border-b pb-2 last:border-b-0">
                  <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient.name)}
                      onChange={() => handleIngredientToggle(ingredient.name)}
                      className="w-4 h-4 cursor-pointer mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{ingredient.name}</p>
                      
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

      <button
        onClick={handleSearch}
        disabled={selectedIngredients.length === 0}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        Find Dishes ({selectedIngredients.length})
      </button>

      {selectedIngredients.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-semibold mb-2">Selected Ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ing => (
              <span key={ing} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
