import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DishDetailPage from './pages/DishDetailPage';
import WhatWeHavePage from './pages/WhatWeHavePage';
import AddDishPage from './pages/AddDishPage';
import IngredientsPage from './pages/IngredientsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dish/:id" element={<DishDetailPage />} />
        <Route path="/what-we-have" element={<WhatWeHavePage />} />
        <Route path="/add-dish" element={<AddDishPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/:category" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
