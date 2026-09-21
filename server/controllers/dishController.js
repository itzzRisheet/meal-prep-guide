const Dish = require('../models/Dish');
const Ingredient = require('../models/Ingredient');
const { calculateDishNutrition } = require('../utils/nutrition');

// Add calculated nutrition to a dish
async function enrichDishWithNutrition(dish) {
  const ingredients = await Ingredient.find().lean();

  const ingredientsByName = new Map(
    ingredients.map(ingredient => [
      String(ingredient.name).trim().toLowerCase(),
      ingredient
    ])
  );

  return {
    ...dish,
    nutrition: calculateDishNutrition(dish, ingredientsByName)
  };
}

// Add calculated nutrition to multiple dishes
async function enrichDishesWithNutrition(dishes) {
  const ingredients = await Ingredient.find().lean();

  const ingredientsByName = new Map(
    ingredients.map(ingredient => [
      String(ingredient.name).trim().toLowerCase(),
      ingredient
    ])
  );

  return dishes.map(dish => ({
    ...dish,
    nutrition: calculateDishNutrition(dish, ingredientsByName)
  }));
}


// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().lean();
    const enrichedDishes = await enrichDishesWithNutrition(dishes);

    res.json(enrichedDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get dishes by category
exports.getDishesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const dishes = await Dish.find({ category }).lean();
    const enrichedDishes = await enrichDishesWithNutrition(dishes);

    res.json(enrichedDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get single dish
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).lean();

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    const enrichedDish = await enrichDishWithNutrition(dish);

    res.json(enrichedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create dish
exports.createDish = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      ingredients,
      recipe,
      youtubeLink,
      prepTime,
      difficulty
    } = req.body;

    const dish = new Dish({
      name,
      category,
      description,
      ingredients,
      recipe,
      youtubeLink,
      prepTime,
      difficulty,
      isCustom: true
    });

    const newDish = await dish.save();

    const enrichedDish = await enrichDishWithNutrition(
      newDish.toObject()
    );

    res.status(201).json(enrichedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update dish
exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    Object.assign(dish, req.body);

    const updatedDish = await dish.save();

    const enrichedDish = await enrichDishWithNutrition(
      updatedDish.toObject()
    );

    res.json(enrichedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete dish
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    res.json({ message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Search dishes by ingredients
exports.searchByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({
        message: 'ingredients must be an array'
      });
    }

    const dishes = await Dish.find({
      'ingredients.name': { $in: ingredients }
    }).lean();

    const sorted = dishes
      .map(dish => {
        const matches = dish.ingredients.filter(ing =>
          ingredients.includes(ing.name)
        ).length;

        return {
          ...dish,
          matchCount: matches
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount);

    const enrichedDishes = await enrichDishesWithNutrition(sorted);

    res.json(enrichedDishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};