import React, { useState, useEffect } from 'react';
import IngredientList from './IngredientList';
import StepList from './StepList';
import { Clock, Users, Flame, ChevronUp, ChevronDown } from 'lucide-react';

export default function RecipeCard({ recipe }) {
  const [servings, setServings] = useState(recipe.servings || 1);
  
  // Reset servings if recipe changes
  useEffect(() => {
    setServings(recipe.servings || 1);
  }, [recipe]);

  const multiplier = servings / (recipe.servings || 1);

  const handleIncrease = () => setServings(prev => prev + 1);
  const handleDecrease = () => setServings(prev => Math.max(1, prev - 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Recipe Header */}
      <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-200">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{recipe.title}</h2>
        
        <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-slate-600">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <Clock size={16} className="text-orange-500" />
            <span className="font-medium">Prep: {recipe.prepTimeMinutes}m</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <Flame size={16} className="text-orange-500" />
            <span className="font-medium">Cook: {recipe.cookTimeMinutes}m</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        
        {/* Sidebar: Ingredients */}
        <div className="p-6 md:p-8 md:col-span-1 bg-slate-50/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-slate-900 flex items-center">
              <span className="bg-orange-100 text-orange-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Users size={16} />
              </span>
              Ingredients
            </h3>
            
            {/* Servings Scaler */}
            <div className="flex items-center space-x-3 bg-white rounded-lg border border-slate-200 p-1">
              <button 
                onClick={handleDecrease}
                disabled={servings <= 1}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-50"
              >
                <ChevronDown size={16} />
              </button>
              <span className="font-medium text-sm w-12 text-center">{servings} {servings === 1 ? 'svg' : 'svgs'}</span>
              <button 
                onClick={handleIncrease}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>

          <IngredientList ingredients={recipe.ingredients} multiplier={multiplier} />
        </div>

        {/* Main Content: Instructions */}
        <div className="p-6 md:p-8 md:col-span-2">
          <h3 className="font-semibold text-lg text-slate-900 mb-6 flex items-center">
            <span className="bg-orange-100 text-orange-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <Flame size={16} />
            </span>
            Instructions
          </h3>
          <StepList 
            prepInstructions={recipe.prepInstructions} 
            cookInstructions={recipe.cookInstructions} 
          />
        </div>

      </div>
    </div>
  );
}
