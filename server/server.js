import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RECIPE_SCHEMA = {
  type: "OBJECT",
  properties: {
    recipeId: { type: "STRING" },
    title: { type: "STRING" },
    prepTimeMinutes: { type: "INTEGER" },
    cookTimeMinutes: { type: "INTEGER" },
    servings: { type: "INTEGER" },
    difficulty: { type: "STRING" },
    ingredients: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          name: { type: "STRING" },
          amount: { type: "NUMBER" },
          unit: { type: "STRING" },
          isEssential: { type: "BOOLEAN" }
        },
        required: ["id", "name", "amount", "unit", "isEssential"]
      }
    },
    prepInstructions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          stepNumber: { type: "INTEGER" },
          instruction: { type: "STRING" },
          timerMinutes: { type: "INTEGER" }
        },
        required: ["stepNumber", "instruction"]
      }
    },
    cookInstructions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          stepNumber: { type: "INTEGER" },
          instruction: { type: "STRING" },
          timerMinutes: { type: "INTEGER" }
        },
        required: ["stepNumber", "instruction"]
      }
    }
  },
  required: ["recipeId", "title", "prepTimeMinutes", "cookTimeMinutes", "servings", "difficulty", "ingredients", "prepInstructions", "cookInstructions"]
};

app.post('/api/recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !ingredients.trim()) {
      return res.status(400).json({ error: "Ingredients are required" });
    }

    const prompt = `You are a culinary expert. Create a bachelor-friendly recipe using the following ingredients: ${ingredients}. You can include standard pantry staples like salt, pepper, oil, water if needed, but the core meal should rely on the provided ingredients. Return the recipe EXACTLY matching the provided JSON schema. Separate the instructions into 'prepInstructions' (like chopping, marinating, preheating) and 'cookInstructions' (the actual cooking steps). Do NOT include markdown code blocks, just raw JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: RECIPE_SCHEMA,
            temperature: 0.7,
        }
    });

    const jsonText = response.text;
    const recipeData = JSON.parse(jsonText);
    
    // Add request ID back for frontend verification
    if (req.body.requestId) {
        recipeData.requestId = req.body.requestId;
    }

    res.json(recipeData);

  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate recipe. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
