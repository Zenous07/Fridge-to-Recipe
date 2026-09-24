import { useState, useRef } from 'react';
import axios from 'axios';
import { ChefHat, Loader2, AlertCircle } from 'lucide-react';
import RecipeCard from './components/RecipeCard';

function App() {
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredientsInput.trim()) return;

    setLoading(true);
    setError(null);
    setRecipe(null);
    
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;

    try {
      const response = await axios.post('http://localhost:3001/api/recipe', {
        ingredients: ingredientsInput,
        requestId: currentRequestId
      });

      if (currentRequestId === requestIdRef.current) {
        setRecipe(response.data);
      }
    } catch (err) {
      if (currentRequestId === requestIdRef.current) {
        setError(err.response?.data?.error || 'Failed to generate recipe. Please try again.');
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 text-orange-500">
            <ChefHat size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Fridge-to-Recipe
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Turn your random fridge ingredients into a delicious, easy-to-follow meal. No fluff, just the recipe.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-slate-700 mb-2">
                What's in your fridge?
              </label>
              <textarea
                id="ingredients"
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder="e.g. 2 eggs, some leftover rice, half an onion, soy sauce"
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-4 min-h-[120px] bg-slate-50 resize-none text-slate-800"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !ingredientsInput.trim()}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Cooking up a recipe...
                </>
              ) : (
                'Generate Recipe'
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3 text-red-700">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold">Oops! Something went wrong</h3>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={handleSubmit}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Recipe Display */}
        {recipe && <RecipeCard recipe={recipe} />}

      </div>
    </div>
  );
}

export default App;
