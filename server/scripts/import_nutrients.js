const fs = require('fs');
const path = require('path');

// This script reads server/data/NutritionalCharts.xlsx and VitaminsAndMinerals.xlsx
// and merges their rows into ingredient nutrient objects, then writes
// server/data/ingredients_with_nutrients.json (based on existing ingredients.json).

function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (e) {
    return null;
  }
}

async function main() {
  const xlsxPath = path.join(__dirname, '..', 'data', 'NutritionalCharts.xlsx');
  const vitPath = path.join(__dirname, '..', 'data', 'VitaminsAndMinerals.xlsx');
  const ingredientsPath = path.join(__dirname, '..', 'data', 'ingredients.json');
  const outPath = path.join(__dirname, '..', 'data', 'ingredients_with_nutrients.json');
  const backupPath = path.join(__dirname, '..', 'data', 'ingredients_backup.json');

  // Ensure 'xlsx' is installed
  let xlsx;
  try {
    xlsx = require('xlsx');
  } catch (err) {
    console.error("Package 'xlsx' is not installed. Run: npm install xlsx --save");
    process.exit(1);
  }

  if (!fs.existsSync(ingredientsPath)) {
    console.error('ingredients.json not found at', ingredientsPath);
    process.exit(1);
  }

  const ingredients = JSON.parse(fs.readFileSync(ingredientsPath, 'utf8'));

  function readFirstSheet(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const wb = xlsx.readFile(filePath);
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    return rows;
  }

  const rowsA = readFirstSheet(xlsxPath);
  const rowsB = readFirstSheet(vitPath);

  function normalizeName(name) {
    if (!name && name !== 0) return '';
    return String(name).trim().toLowerCase();
  }

  function findNameKey(row) {
    const keys = Object.keys(row);
    const candidates = ['ingredient', 'name', 'food', 'food item', 'item'];
    for (const c of candidates) {
      const k = keys.find(k => k.toLowerCase().trim() === c);
      if (k) return k;
    }
    // fallback: first non-empty column
    for (const k of keys) {
      if (String(row[k]).trim() !== '') return k;
    }
    return null;
  }

  const nutrientMap = {}; // name -> { nutrients... }

  function ingestRows(rows, sourceLabel) {
    for (const r of rows) {
      const nameKey = findNameKey(r);
      if (!nameKey) continue;
      const name = normalizeName(r[nameKey]);
      if (!name) continue;

      if (!nutrientMap[name]) nutrientMap[name] = { sources: [] };
      nutrientMap[name].sources.push(sourceLabel);

      Object.keys(r).forEach(k => {
        const kk = String(k).trim();
        if (kk === nameKey) return;
        const val = r[k];
        if (val === null || val === undefined || val === '') return;
        // Normalize nutrient key
        const key = kk.toLowerCase().replace(/\s+/g, '_');
        // Try to parse numeric
        const num = Number(String(val).replace(/[^0-9.-]/g, ''));
        nutrientMap[name][key] = isNaN(num) ? String(val) : num;
      });
    }
  }

  ingestRows(rowsA, 'NutritionalCharts');
  ingestRows(rowsB, 'VitaminsAndMinerals');

  // Backup original ingredients
  fs.writeFileSync(backupPath, JSON.stringify(ingredients, null, 2));

  const merged = [];
  const addedNames = new Set();

  // Merge nutrient data into existing ingredients if available
  for (const ing of ingredients) {
    const nameKey = normalizeName(ing.name || ing);
    const data = Object.assign({}, ing);
    if (nutrientMap[nameKey]) {
      data.nutrients = nutrientMap[nameKey];
      addedNames.add(nameKey);
    }
    merged.push(data);
  }

  // Add any nutrient entries not present in ingredients.json
  for (const name in nutrientMap) {
    if (addedNames.has(name)) continue;
    const parts = name.split(',');
    const displayName = parts[0];
    merged.push({
      name: displayName,
      category: 'other',
      isCustom: false,
      nutrients: nutrientMap[name]
    });
  }

  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log('Wrote', outPath);
  console.log('Backup saved to', backupPath);
  console.log('Total ingredients output:', merged.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
