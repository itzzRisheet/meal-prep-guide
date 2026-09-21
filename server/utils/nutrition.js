function normalizeUnit(unit) {
  if (!unit) return null;

  const value = String(unit).toLowerCase().trim();

  const aliases = {
    grams: "g",
    gram: "g",
    g: "g",

    kilograms: "kg",
    kilogram: "kg",
    kg: "kg",

    milliliters: "ml",
    milliliter: "ml",
    ml: "ml",

    liters: "l",
    liter: "l",
    l: "l",

    tablespoon: "tbsp",
    tablespoons: "tbsp",
    tbsp: "tbsp",

    teaspoon: "tsp",
    teaspoons: "tsp",
    tsp: "tsp",

    cups: "cup",
    cup: "cup",

    pieces: "piece",
    piece: "piece",
    pcs: "piece",

    slices: "slice",
    slice: "slice",
  };

  return aliases[value] || value;
}

// Approximate kitchen conversions.
const conversionTable = {
  oats: {
    cup: 80,
  },

  bread: {
    slice: 25,
  },

  rice: {
    cup: 195,
  },

  berries: {
    cup: 145,
  },

  milk: {
    cup: 240,
  },

  yogurt: {
    cup: 245,
  },

  chickpeas: {
    cup: 165,
  },

  vegetables: {
    cup: 150,
  },

  butter: {
    tbsp: 14,
  },

  tahini: {
    tbsp: 15,
  },

  honey: {
    tbsp: 21,
  },

  oil: {
    tbsp: 14,
  },

  "olive oil": {
    tbsp: 14,
  },

  "lemon juice": {
    tsp: 5,
    tbsp: 15,
  },

  "soy sauce": {
    tsp: 5,
    tbsp: 15,
  },

  garlic: {
    piece: 3,
  },

  avocado: {
    piece: 150,
  },

  banana: {
    piece: 118,
  },

  tomato: {
    piece: 100,
  },

  onion: {
    piece: 110,
  },

  eggs: {
    piece: 1,
  },
};

// --------------------------------------------------
// Nutrition state helpers
// --------------------------------------------------

function normalizeState(state) {
  if (!state) return "raw";

  const value = String(state).toLowerCase().trim();

  const aliases = {
    cooked: "cooked",
    boiled: "cooked",
    steamed: "cooked",
    prepared: "cooked",

    raw: "raw",
    uncooked: "raw",

    dry: "dry",
    dried: "dry",

    roasted: "roasted",
    baked: "baked",
    fried: "fried",
    grilled: "grilled",
  };

  return aliases[value] || value;
}

function getNutritionData(ingredient, state) {
  const nutrients = ingredient?.nutrients;

  if (!nutrients) {
    return null;
  }

  // New state-based structure
  if (
    typeof nutrients === "object" &&
    nutrients[state] &&
    typeof nutrients[state] === "object"
  ) {
    return nutrients[state];
  }

  // Backward-compatible structure
  if (nutrients.base) {
    return nutrients;
  }

  // Fallback to raw state
  if (state !== "raw" && nutrients.raw && typeof nutrients.raw === "object") {
    return nutrients.raw;
  }

  return null;
}

function getBase(nutrients) {
  if (!nutrients || !nutrients.base) {
    return null;
  }

  const base = nutrients.base;

  if (typeof base === "object" && base.quantity !== undefined && base.unit) {
    return {
      quantity: Number(base.quantity),
      unit: normalizeUnit(base.unit),
    };
  }

  return null;
}

function getIngredientKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

// --------------------------------------------------
// Convert ingredient quantity to a target unit
// --------------------------------------------------

function convertToBaseQuantity(ingredient, quantity, unit, baseUnit, state) {
  const name = getIngredientKey(ingredient.name);
  const normalizedUnit = normalizeUnit(unit);

  if (normalizedUnit === baseUnit) {
    return quantity;
  }

  // kg → g
  if (normalizedUnit === "kg" && baseUnit === "g") {
    return quantity * 1000;
  }

  // g → kg
  if (normalizedUnit === "g" && baseUnit === "kg") {
    return quantity / 1000;
  }

  // l → ml
  if (normalizedUnit === "l" && baseUnit === "ml") {
    return quantity * 1000;
  }

  // ml → l
  if (normalizedUnit === "ml" && baseUnit === "l") {
    return quantity / 1000;
  }

  // Ingredient-specific conversions
  const conversions = conversionTable[name];

  if (conversions && conversions[normalizedUnit]) {
    const convertedQuantity = quantity * conversions[normalizedUnit];

    // Target nutrition base is grams
    if (baseUnit === "g") {
      return convertedQuantity;
    }

    // Target nutrition base is milliliters
    if (baseUnit === "ml") {
      return convertedQuantity;
    }

    // Target nutrition base is liters
    if (baseUnit === "l") {
      return convertedQuantity / 1000;
    }

    // Target nutrition base is kilograms
    if (baseUnit === "kg") {
      return convertedQuantity / 1000;
    }
  }

  return null;
}

function getNumericNutrient(nutrients, key) {
  const value = Number(nutrients?.[key]);

  return Number.isFinite(value) ? value : 0;
}

// --------------------------------------------------
// Parse amount strings such as:
// "3.60 mg"
// "110 mcg"
// --------------------------------------------------

function parseAmount(amountString) {
  const text = String(amountString || "").trim();

  const match = text.match(/([\d.]+)\s*([a-zA-Zµμ]+)?/);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return {
    amount,
    unit: match[2] || null,
  };
}

// --------------------------------------------------
// Calculate vitamin/mineral multiplier
// --------------------------------------------------

function calculateVitaminMultiplier(
  dishQuantity,
  dishUnit,
  ingredient,
  vitaminServing,
) {
  if (
    !vitaminServing ||
    vitaminServing.quantity === undefined ||
    !vitaminServing.unit
  ) {
    return null;
  }

  const servingQuantity = Number(vitaminServing.quantity);

  if (!Number.isFinite(servingQuantity) || servingQuantity <= 0) {
    return null;
  }

  const servingUnit = normalizeUnit(vitaminServing.unit);

  if (!servingUnit) {
    return null;
  }

  /*
   * Convert the dish quantity into the vitamin/mineral
   * serving unit.
   *
   * Example:
   *
   * Dish:
   * 2 slices bread
   *
   * Vitamin serving:
   * 100 g
   *
   * conversionTable:
   * 1 slice bread = 25 g
   *
   * 2 slices = 50 g
   *
   * multiplier = 50 / 100 = 0.5
   */

  const convertedQuantity = convertToBaseQuantity(
    ingredient,
    dishQuantity,
    dishUnit,
    servingUnit,
  );

  if (convertedQuantity === null) {
    return null;
  }

  return convertedQuantity / servingQuantity;
}

function parseDailyRequirement(value) {
  const text = String(value || "").trim();

  const match = text.match(/([\d.]+)/);

  if (!match) {
    return null;
  }

  const requirement = Number(match[1]);

  return Number.isFinite(requirement) ? requirement : null;
}

function classifyVitaminMineralPercentage(percentage) {
  if (percentage < 10) {
    return "Low";
  }

  if (percentage < 20) {
    return "Moderate";
  }

  if (percentage < 50) {
    return "Good";
  }

  if (percentage < 100) {
    return "High";
  }

  return "Very high";
}

// --------------------------------------------------
// Main nutrition calculation
// --------------------------------------------------

function calculateDishNutrition(dish, ingredientsByName) {
  const totals = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
  };

  const vitaminsMinerals = {};
  const unresolvedIngredients = [];

  let estimatedIngredients = 0;

  for (const dishIngredient of dish.ingredients || []) {
    const ingredientName = getIngredientKey(dishIngredient.name);

    const ingredient = ingredientsByName.get(ingredientName);

    console.log("=================================");
    console.log("DISH INGREDIENT:", dishIngredient);
    console.log("INGREDIENT FROM DB:", ingredient);
    console.log("NUTRIENTS:", ingredient?.nutrients);
    console.log("=================================");

    // --------------------------------------------------
    // Ignore "to taste"
    // --------------------------------------------------

    const unit = normalizeUnit(dishIngredient.unit);

    if (unit === "to taste") {
      continue;
    }

    // --------------------------------------------------
    // Find ingredient
    // --------------------------------------------------

    if (!ingredient) {
      unresolvedIngredients.push({
        name: dishIngredient.name,
        reason: "Ingredient not found in ingredient library",
      });

      continue;
    }

    // --------------------------------------------------
    // Determine state
    // --------------------------------------------------

    const state = normalizeState(dishIngredient.state);

    const nutrients = getNutritionData(ingredient, state);

    console.log("STATE:", state);

    console.log("NUTRITION DATA USED:", nutrients);

    if (!nutrients) {
      unresolvedIngredients.push({
        name: dishIngredient.name,
        reason: `No nutrition data available for state "${state}"`,
      });

      continue;
    }

    // --------------------------------------------------
    // Get nutrition base
    // --------------------------------------------------

    const base = getBase(nutrients);

    if (!base) {
      unresolvedIngredients.push({
        name: dishIngredient.name,
        reason: "Ingredient has no valid nutrition base",
      });

      continue;
    }

    // --------------------------------------------------
    // Validate quantity
    // --------------------------------------------------

    const quantity = Number(dishIngredient.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0 || !unit) {
      unresolvedIngredients.push({
        name: dishIngredient.name,
        reason: "Quantity or unit is missing",
      });

      continue;
    }

    // --------------------------------------------------
    // Convert dish quantity → nutrition base
    // --------------------------------------------------

    const convertedQuantity = convertToBaseQuantity(
      ingredient,
      quantity,
      unit,
      base.unit,
      state,
    );

    if (convertedQuantity === null) {
      unresolvedIngredients.push({
        name: dishIngredient.name,
        reason: `Cannot convert ${unit} to ${base.unit}`,
      });

      continue;
    }

    // --------------------------------------------------
    // Macro multiplier
    // --------------------------------------------------

    const multiplier = convertedQuantity / base.quantity;

    // --------------------------------------------------
    // Macros
    // --------------------------------------------------

    totals.calories +=
      getNumericNutrient(nutrients, "calories_kcal") * multiplier;

    totals.protein_g += getNumericNutrient(nutrients, "protein_g") * multiplier;

    totals.carbs_g += getNumericNutrient(nutrients, "carbs_g") * multiplier;

    totals.fat_g += getNumericNutrient(nutrients, "fat_g") * multiplier;

    totals.fiber_g += getNumericNutrient(nutrients, "fiber_g") * multiplier;

    estimatedIngredients++;

    // --------------------------------------------------
    // Vitamins and minerals
    // --------------------------------------------------

    for (const vitamin of ingredient.vitamins_minerals || []) {
      const nutrientName = vitamin.nutrient;

      if (!nutrientName) {
        continue;
      }

      // Parse amount, e.g. "3.60 mg"
      const parsedAmount = parseAmount(vitamin.amount);

      if (!parsedAmount) {
        continue;
      }

      // Calculate multiplier using THIS
      // vitamin's own serving.
      const vitaminMultiplier = calculateVitaminMultiplier(
        quantity,
        unit,
        ingredient,
        vitamin.serving,
      );

      if (vitaminMultiplier === null) {
        console.log(
          `Could not calculate vitamin/mineral "${nutrientName}" for ${dishIngredient.name}`,
        );

        continue;
      }

      const calculatedAmount = parsedAmount.amount * vitaminMultiplier;

      if (!vitaminsMinerals[nutrientName]) {
        vitaminsMinerals[nutrientName] = {
          amount: 0,
          unit: parsedAmount.unit,
          dailyRequirement: vitamin.daily_requirement || null,
          notes: null,
          percentage: null,
        };
      }

      vitaminsMinerals[nutrientName].amount += calculatedAmount;

      console.log("VITAMIN/MINERAL CALCULATION:", {
        ingredient: dishIngredient.name,
        nutrient: nutrientName,
        dishQuantity: quantity,
        dishUnit: unit,
        serving: vitamin.serving,
        originalAmount: vitamin.amount,
        multiplier: vitaminMultiplier,
        calculatedAmount,
      });
    }
  }

  // --------------------------------------------------
// Calculate final vitamin/mineral percentages
// and classifications after aggregation
// --------------------------------------------------

for (const nutrientName of Object.keys(vitaminsMinerals)) {
  const nutrient = vitaminsMinerals[nutrientName];

  const dailyRequirement =
    parseDailyRequirement(
      nutrient.dailyRequirement
    );

  if (
    dailyRequirement === null ||
    dailyRequirement <= 0
  ) {
    nutrient.percentage = null;
    nutrient.notes = null;
    continue;
  }

  // Use the actual final calculated amount.
  const percentage =
    (nutrient.amount / dailyRequirement) * 100;

  nutrient.percentage =
    Math.round(percentage * 100) / 100;

  nutrient.notes =
    classifyVitaminMineralPercentage(
      percentage
    );

  // Avoid floating-point artifacts.
  nutrient.amount =
    Math.round(nutrient.amount * 100) / 100;
}

  const round = (value) => Math.round(value * 10) / 10;

  console.log("========================================");

  console.log("FINAL DISH NUTRITION:", {
    calories: totals.calories,
    protein_g: totals.protein_g,
    carbs_g: totals.carbs_g,
    fat_g: totals.fat_g,
    fiber_g: totals.fiber_g,
    vitaminsMinerals,
  });

  console.log("UNRESOLVED:", unresolvedIngredients);

  console.log("========================================");

  return {
    isEstimated: unresolvedIngredients.length > 0,

    isComplete: unresolvedIngredients.length === 0,

    estimatedIngredients,

    totalIngredients: (dish.ingredients || []).length,

    unresolvedIngredients,

    calories: {
      min: round(totals.calories * 0.95),
      max: round(totals.calories * 1.05),
      estimated: round(totals.calories),
    },

    macros: {
      protein_g: {
        min: round(totals.protein_g * 0.95),
        max: round(totals.protein_g * 1.05),
        estimated: round(totals.protein_g),
      },

      carbs_g: {
        min: round(totals.carbs_g * 0.95),
        max: round(totals.carbs_g * 1.05),
        estimated: round(totals.carbs_g),
      },

      fat_g: {
        min: round(totals.fat_g * 0.95),
        max: round(totals.fat_g * 1.05),
        estimated: round(totals.fat_g),
      },

      fiber_g: {
        min: round(totals.fiber_g * 0.95),
        max: round(totals.fiber_g * 1.05),
        estimated: round(totals.fiber_g),
      },
    },

    vitaminsMinerals,
  };
}

module.exports = {
  calculateDishNutrition,
};
