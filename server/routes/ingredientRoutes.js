const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

// Get all ingredients
router.get('/', ingredientController.getAllIngredients);

// Get ingredients by category
router.get('/category/:category', ingredientController.getIngredientsByCategory);

// Create ingredient
router.post('/', ingredientController.createIngredient);

// Update ingredient
router.put('/:id', ingredientController.updateIngredient);

// Delete ingredient
router.delete('/:id', ingredientController.deleteIngredient);

module.exports = router;
