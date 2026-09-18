const mongoose = require('mongoose');

const vitaminsMineralsSchema = new mongoose.Schema({
  nutrient: { type: String },
  serving: { type: String },
  amount: { type: String },
  daily_requirement: { type: String },
  percent_fulfilled: { type: String },
  notes: { type: String }
}, { _id: false });

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'grains', 'proteins', 'dairy', 'spices', 'oils', 'other'],
    required: true,
  },
  // flexible nutrients map — keys like 'protein_g', 'calories_kcal', 'serving', 'health_tag'
  nutrients: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: undefined
  },
  // preserved detailed vitamins/minerals array when available in the source JSON
  vitamins_minerals: {
    type: [vitaminsMineralsSchema],
    default: undefined
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'Ingredients' });

module.exports = mongoose.model('Ingredient', ingredientSchema);
