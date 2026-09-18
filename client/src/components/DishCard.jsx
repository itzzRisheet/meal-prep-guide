import React from 'react';
import { Link } from 'react-router-dom';

export default function DishCard({ dish }) {
  return (
    <Link to={`/dish/${dish._id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer h-full">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{dish.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {dish.prepTime} min
          </span>
          <span className={`px-2 py-1 rounded text-white text-xs font-semibold
            ${dish.difficulty === 'easy' ? 'bg-green-500' : 
              dish.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
            {dish.difficulty}
          </span>
        </div>

        {dish.rating > 0 && (
          <div className="mt-2 text-yellow-500">
            {'⭐'.repeat(Math.round(dish.rating))}
          </div>
        )}
      </div>
    </Link>
  );
}
