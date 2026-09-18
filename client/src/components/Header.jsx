import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="text-3xl">🍳</span>
            <h1 className="text-2xl font-bold">Meal Prep Guide</h1>
          </button>
          
          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition font-medium"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/ingredients')}
              className="hover:opacity-80 transition font-medium"
            >
              🥬 Ingredients
            </button>
            <button
              onClick={() => navigate('/what-we-have')}
              className="hover:opacity-80 transition font-medium"
            >
              📋 What We Have
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
