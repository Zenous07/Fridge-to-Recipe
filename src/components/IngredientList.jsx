import React, { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function IngredientList({ ingredients, multiplier }) {
  const [activeSubId, setActiveSubId] = useState(null);

  const toggleSub = (id) => {
    setActiveSubId(prev => prev === id ? null : id);
  };

  return (
    <ul className="space-y-3">
      {ingredients.map((ing) => {
        const scaledAmount = (ing.amount * multiplier).toFixed(1).replace(/\.0$/, '');
        const isMissing = !ing.isEssential; // the prompt implies essential flagging for items missing. 
        // Let's assume isEssential means it's a core ingredient. If they don't have it, we should flag it? 
        // The PRD says "Highlights critical non-provided items missing from the prompt." 
        // So maybe the LLM returns isEssential: true for things we need but aren't in the prompt? 
        // Let's just style it based on isEssential for now.

        return (
          <li key={ing.id} className="relative group">
            <div 
              className={`p-3 rounded-xl border ${ing.isEssential ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-slate-200'} flex items-start justify-between cursor-pointer hover:border-orange-300 transition-colors`}
              onClick={() => toggleSub(ing.id)}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-semibold text-slate-800 w-16 shrink-0 text-right mr-3">
                    {scaledAmount} {ing.unit}
                  </span>
                  <span className={`text-slate-700 capitalize ${ing.isEssential ? 'font-medium' : ''}`}>
                    {ing.name}
                  </span>
                </div>
                {ing.isEssential && (
                  <div className="flex items-center text-xs text-orange-600 mt-1 ml-19">
                    <AlertTriangle size={12} className="mr-1" />
                    Core ingredient
                  </div>
                )}
              </div>
              <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Info size={16} />
              </button>
            </div>
            
            {/* Substitutions View */}
            {activeSubId === ing.id && (
              <div className="mt-2 mb-3 ml-4 p-3 bg-slate-100 rounded-lg text-sm text-slate-600 border border-slate-200 border-l-4 border-l-orange-400 animate-in fade-in slide-in-from-top-2">
                <p><strong>Substitutions:</strong> No exact substitution data available. Try similar items if you're out!</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
