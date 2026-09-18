import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMealStore } from "../store/mealStore";

export default function AddDishPage() {
  const navigate = useNavigate();
const { createDish, ingredients, fetchIngredients } = useMealStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    category: "meal",
    description: "",
    recipe: "",
    youtubeLink: "",
    prepTime: 30,
    difficulty: "medium",
    ingredients: [{ name: "", quantity: "" }],
  });

  useEffect(() => {
  fetchIngredients();
}, [fetchIngredients]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleIngredientChange = (idx, field, value) => {
  const newIngredients = [...formData.ingredients];

  newIngredients[idx] = {
    ...newIngredients[idx],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    ingredients: newIngredients,
  }));

  if (field === "name") {
    const search = value.trim().toLowerCase();

    if (!search) {
      setSuggestions((prev) => ({
        ...prev,
        [idx]: [],
      }));
      return;
    }

    const matches = ingredients
      .filter((ingredient) =>
        ingredient.name.toLowerCase().includes(search)
      )
      .slice(0, 8);

    setSuggestions((prev) => ({
      ...prev,
      [idx]: matches,
    }));
  }
};

const selectIngredientSuggestion = (idx, ingredientName) => {
  const newIngredients = [...formData.ingredients];

  newIngredients[idx] = {
    ...newIngredients[idx],
    name: ingredientName,
  };

  setFormData((prev) => ({
    ...prev,
    ingredients: newIngredients,
  }));

  setSuggestions((prev) => ({
    ...prev,
    [idx]: [],
  }));
};
  const addIngredientField = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }));
  };

  const removeIngredientField = (idx) => {
  setFormData((prev) => ({
    ...prev,
    ingredients: prev.ingredients.filter((_, i) => i !== idx),
  }));

  setSuggestions((prev) => {
    const updated = { ...prev };
    delete updated[idx];
    return updated;
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createDish(formData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create dish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-gray-800">Add New Dish</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Dish Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Pasta Carbonara"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="meal">Meal</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Short description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Prep Time (mins) *
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                YouTube Link
              </label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Ingredients *
            </label>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleIngredientChange(idx, "name", e.target.value)
                      }
                      required
                      autoComplete="off"
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Search ingredient..."
                    />

                    {suggestions[idx]?.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        {suggestions[idx].map((suggestion) => (
                          <button
                            key={suggestion._id}
                            type="button"
                            onClick={() =>
                              selectIngredientSuggestion(idx, suggestion.name)
                            }
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
                          >
                            <div className="font-medium text-gray-800">
                              {suggestion.name}
                            </div>

                            <div className="text-xs text-gray-500 capitalize">
                              {suggestion.category}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(idx, "quantity", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Quantity (e.g., 2 cups)"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientField(idx)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredientField}
              className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
            >
              + Add Ingredient
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Recipe Instructions *
            </label>
            <textarea
              name="recipe"
              value={formData.recipe}
              onChange={handleInputChange}
              required
              rows="6"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Step-by-step instructions"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Creating..." : "Create Dish"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
