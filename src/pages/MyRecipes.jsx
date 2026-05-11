import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Home, ChevronRight, Info, X, Trash2 } from "lucide-react";
// import { base44 } from "@/api/base44Client"; // We can ignore this for the prototype!
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { sampleRecipes } from "../lib/recipeData"; 

export default function MyRecipes() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [showToast, setShowToast] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // --- PROTOTYPE FIX ---
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["my-recipes"],
    queryFn: async () => {
      // 1. Wait half a second so your cool loading animation plays
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. Grab the first recipe from your sample data
      const baseRecipe = sampleRecipes[0] || {};

      // 🔍 THE FIX: Check if there's a custom name written on our "sticky note"
      const customName = localStorage.getItem("customRecipeName");

      // 3. Return a fake list with your recipe in it!
      return [
        {
          id: "fake-saved-1",
          original_recipe_id: baseRecipe.id || "recipe-1",
          // Use the custom name if we found one, otherwise use the original title
          title: customName || baseRecipe.title || "Lebanese Spicy Chicken",
          image_url: baseRecipe.image_url || "",
          cuisine: baseRecipe.cuisine || "Dinner",
          cooking_time: baseRecipe.cooking_time || 45
        }
      ];
    },
    initialData: [],
  });

  const handleDelete = async (e, recipeId) => {
    e.stopPropagation();
    setDeletingId(recipeId);
    
    // --- PROTOTYPE FIX ---
    // Prevent the app from crashing by faking the delete action
    // await base44.entities.Recipe.delete(recipeId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Optional: Clear the local storage when deleting so it resets for the next test
    localStorage.removeItem("customRecipeName");
    
    queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
    setDeletingId(null);
  };

  useEffect(() => {
    if (location.state?.justSaved) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 4000);
      window.history.replaceState({}, "");
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--page-bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft size={24} style={{ color: "#000000" }} />
        </button>
        <h1 className="font-playfair font-semibold text-lg" style={{ color: "#000000" }}>
          My Recipe Book
        </h1>
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Home size={20} style={{ color: "var(--dark)" }} />
        </button>
      </div>

      <div className="px-4 pb-8">
        {isLoading ? (
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl animate-pulse"
                style={{ backgroundColor: "var(--border-color)" }}
              />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-4xl block mb-3">📖</span>
            <p className="font-playfair font-semibold text-lg" style={{ color: "var(--dark)" }}>
              No saved recipes yet
            </p>
            <p className="font-inter text-[14px] mt-2" style={{ color: "var(--text-secondary)" }}>
              Cook a recipe and save your custom version here
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2.5 rounded-full font-inter font-medium text-[14px]"
              style={{ backgroundColor: "var(--green-100)", color: "var(--dark)" }}
            >
              Browse Recipes
            </button>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.original_recipe_id || recipe.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border bg-card text-left transition-all hover:border-[var(--green-500)] active:scale-[0.98]"
                style={{ borderColor: "var(--border-color)" }}
              >
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-playfair font-semibold text-[15px] truncate"
                    style={{ color: "var(--dark)" }}
                  >
                    {recipe.title}
                  </p>
                  <p className="font-inter text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {recipe.cuisine} · {recipe.cooking_time} min
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(e, recipe.id)}
                    disabled={deletingId === recipe.id}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-[0.95] active:scale-[0.90]"
                    style={{ backgroundColor: "var(--error-bg, #FFEBEE)" }}
                  >
                    {deletingId === recipe.id
                      ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      : <Trash2 size={15} style={{ color: "var(--error, #E53935)" }} />
                    }
                  </button>
                  <ChevronRight size={18} style={{ color: "var(--text-secondary)" }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-50"
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
              style={{ backgroundColor: "#E8F5E9", border: "1px solid #2E7D32" }}
            >
              <Info size={18} style={{ color: "#2E7D32" }} />
              <span className="font-inter text-[14px] font-medium flex-1" style={{ color: "#2E7D32" }}>
                Recipe saved successfully!
              </span>
              <button onClick={() => setShowToast(false)}>
                <X size={16} style={{ color: "#2E7D32" }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}