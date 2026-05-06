import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { sampleRecipes } from "../lib/recipeData";

export default function SaveRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = sampleRecipes.find((r) => r.id === id);

  const modifications = location.state?.modifications || [];
  const ingredients = location.state?.ingredients || recipe?.ingredients || [];

  const [recipeName, setRecipeName] = useState(recipe?.title || "");
  const [notes, setNotes] = useState("");
  const [removedMods, setRemovedMods] = useState({});
  const [saving, setSaving] = useState(false);

  const toggleRemoveMod = (index) => {
    setRemovedMods((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    // 📝 THE FIX: Save the custom name to the browser's "sticky note"
    // This allows the My Recipes page to show the name you actually typed!
    localStorage.setItem("customRecipeName", recipeName);

    // Pretend to save for 1 second to show the "Saving..." animation
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSaving(false);
    
    // Move to the next screen
    navigate("/my-recipes", { state: { justSaved: true } });
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--page-bg)" }}>
        <p className="font-inter">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--page-bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(`/cooking/${id}`, { state: { modifications, ingredients, startAtLastStep: true } })}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft size={24} style={{ color: "var(--dark)" }} />
        </button>
        <h1 className="font-playfair font-semibold text-lg" style={{ color: "var(--dark)" }}>
          Save Recipe
        </h1>
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Home size={20} style={{ color: "var(--dark)" }} />
        </button>
      </div>

      <div className="px-4 pb-8 space-y-6">
        {/* Recipe Photo */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Recipe Name
          </label>
          <input
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Name your recipe..."
            className="w-full py-2.5 px-4 rounded-full border-[1.5px] font-inter text-[14px] bg-card focus:outline-none"
            style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>

        {/* Modifications List */}
        {modifications.length > 0 && (
          <div>
            <p
              className="font-inter font-semibold text-[13px] uppercase mb-3"
              style={{ color: "var(--dark)", letterSpacing: "0.8px" }}
            >
              Modifications
            </p>
            <div className="space-y-2">
              {modifications.map((mod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-4 rounded-xl border bg-card"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <span
                    className="font-inter text-[14px] flex-1"
                    style={{
                      color: removedMods[index] ? "var(--border-color)" : "var(--dark)",
                      textDecoration: removedMods[index] ? "line-through" : "none",
                    }}
                  >
                    {mod.type === "swap" && `${mod.original} → ${mod.replacement}`}
                    {mod.type === "addition" && `Added: ${mod.replacement}`}
                    {mod.type === "removal" && `Removed: ${mod.original}`}
                  </span>
                  <button
                    onClick={() => toggleRemoveMod(index)}
                    className="font-inter text-[12px] font-medium ml-3 px-3 py-1 rounded-full transition-colors"
                    style={{
                      backgroundColor: removedMods[index] ? "var(--green-100)" : "var(--error-bg, #FFEBEE)",
                      color: removedMods[index] ? "var(--green-500)" : "var(--error, #E53935)",
                    }}
                  >
                    {removedMods[index] ? "Undo" : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Your Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it turn out? Do you want to write down changes for next time?"
            rows={4}
            className="w-full py-3 px-4 rounded-xl border-[1.5px] font-inter text-[14px] bg-card resize-none focus:outline-none"
            style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !recipeName.trim()}
          className="w-full py-3.5 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
          style={{
            backgroundColor: recipeName.trim() ? "#4E6E1E" : "var(--border-color)",
            color: recipeName.trim() ? "#FFFFFF" : "var(--text-secondary)",
            minHeight: 44,
            opacity: recipeName.trim() && !saving ? 1 : 0.4,
          }}
        >
          {saving ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}