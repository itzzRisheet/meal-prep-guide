import React from 'react';

export default function CategoryCard({ name, icon, onClick }) {
  const categoryIcons = {
    breakfast: '🍳',
    meal: '🍽️',
    snacks: '🥨',
    what: '🔍'
  };

  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-6 shadow-md hover:shadow-lg transition transform hover:scale-105"
    >
      <div className="text-4xl mb-3">{categoryIcons[name] || icon}</div>
      <h2 className="text-xl font-bold capitalize">{name}</h2>
    </button>
  );
}
