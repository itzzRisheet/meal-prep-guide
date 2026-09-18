# Daily Meal Prep Guide App

A MERN stack application to help you decide what to cook based on available ingredients.

## Features

✅ Browse meals by category (Breakfast, Meal, Snacks)
✅ View detailed recipes with ingredients and YouTube links
✅ Filter dishes by available ingredients ("What do we have?")
✅ Add custom dishes and ingredients
✅ Prep time and difficulty indicators
✅ Rating system for dishes

## Tech Stack

- **Frontend:** React, Tailwind CSS, Zustand, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **State Management:** Zustand

## Project Structure

```
meal-prep-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand store
│   │   ├── services/       # API services
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── server/                 # Express backend
    ├── models/             # MongoDB schemas
    ├── routes/             # API routes
    ├── controllers/        # Route controllers
    ├── server.js
    ├── seedData.js
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```
MONGODB_URI=mongodb://localhost:27017/meal-prep-db
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

App opens on `http://localhost:3000`

## Seeding Sample Data

To populate the database with sample meals and ingredients:

```bash
cd server
node -e "const mongoose = require('mongoose'); const Dish = require('./models/Dish'); const Ingredient = require('./models/Ingredient'); const {sampleDishes, sampleIngredients} = require('./seedData'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meal-prep-db').then(() => { Dish.insertMany(sampleDishes); Ingredient.insertMany(sampleIngredients); console.log('Data seeded'); process.exit(); });"
```

## API Endpoints

### Dishes
- `GET /api/dishes` - Get all dishes
- `GET /api/dishes/category/:category` - Get dishes by category
- `GET /api/dishes/:id` - Get single dish
- `POST /api/dishes` - Create new dish
- `PUT /api/dishes/:id` - Update dish
- `DELETE /api/dishes/:id` - Delete dish
- `POST /api/dishes/search/ingredients` - Search by ingredients

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/category/:category` - Get ingredients by category
- `POST /api/ingredients` - Create new ingredient
- `PUT /api/ingredients/:id` - Update ingredient
- `DELETE /api/ingredients/:id` - Delete ingredient

## Usage

1. **Browse Meals:** Click on Breakfast, Meal, or Snacks cards to see available dishes
2. **View Recipe:** Click on any dish card to see full recipe, ingredients, and YouTube tutorial
3. **Search by Ingredients:** Go to "What do we have?" and select available ingredients to find matching dishes
4. **Add Custom Dish:** Click "Add New Dish" to create your own recipe

## Features Overview

### Home Page
- 5 main navigation cards
- Quick access to categories and special features

### Category Pages
- Browse all dishes in a category
- Dish cards showing prep time and difficulty

### Dish Detail
- Full recipe with ingredients list
- Cooking instructions
- YouTube tutorial link
- Prep time and difficulty badges

### "What do we have?" Page
- Collapsible ingredient categories
- Multi-select ingredient filter
- Shows matching dishes based on selection
- Sorts by number of matching ingredients

### Add Dish Page
- Form to create new dishes
- Dynamic ingredient input fields
- Support for YouTube links
- Difficulty and prep time selection

## Future Enhancements

- [ ] User authentication and personal recipe collections
- [ ] Shopping list generation
- [ ] Meal planning for the week
- [ ] Favorite dishes tracking
- [ ] Image uploads for dishes
- [ ] Dietary preferences/restrictions
- [ ] Recipe ratings and reviews

## License

MIT
