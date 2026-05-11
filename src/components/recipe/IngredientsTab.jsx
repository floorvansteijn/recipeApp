import React, { useState } from "react";
import { Check, ArrowLeftRight, X, Plus, BookOpen } from "lucide-react";

export default function IngredientsTab({ ingredients, onIngredientsChange, onEditIngredient, onAddIngredient }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [showGuide, setShowGuide] = useState(false);

  const toggleCheck = (index) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDelete = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(updated);
  };

  return (
    <div>
      <div className="space-y-1">
        {ingredients.map((ing, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-3 px-3 rounded-lg"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleCheck(index)}
              className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center border-[1.5px] transition-all"
              style={{
                borderColor: checkedItems[index] ? "var(--green-500)" : "var(--border-color)",
                backgroundColor: checkedItems[index] ? "var(--green-500)" : "transparent",
              }}
            >
              {checkedItems[index] && <Check size={14} color="#FFFFFF" />}
            </button>

            {/* Ingredient info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {ing.modified && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--green-500)" }} />
                )}
                <span
                  className="font-inter text-[14px]"
                  style={{ color: "var(--dark)", textDecoration: checkedItems[index] ? "line-through" : "none" }}
                >
                  {ing.amount} {ing.name}
                </span>
              </div>
              {ing.notes && (
                <span className="font-inter text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  {ing.notes}
                </span>
              )}
            </div>

            {/* Substitute button — always visible */}
            <button
              onClick={() => onEditIngredient(index)}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-[0.95]"
              style={{ backgroundColor: "var(--green-100)" }}
              title="Substitute ingredient"
            >
              <ArrowLeftRight size={13} style={{ color: "#000000" }} />
              <span className="font-inter text-[11px] font-medium" style={{ color: "#000000" }}>Sub</span>
            </button>

            {/* Guide button for chicken thighs */}
            {ing.name.toLowerCase().includes("chicken thigh") && (
              <button
                onClick={() => setShowGuide(true)}
                className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-[0.95]"
                style={{ backgroundColor: "var(--green-100)" }}
                title="Deboning guide"
              >
                <BookOpen size={13} style={{ color: "#000000" }} />
                <span className="font-inter text-[11px] font-medium" style={{ color: "#000000" }}>Guide</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add ingredient button */}
      <button
        onClick={onAddIngredient}
        className="w-full mt-4 py-3 rounded-full flex items-center justify-center gap-2 font-inter font-medium text-[14px] transition-all hover:opacity-80 active:scale-[0.97]"
        style={{ backgroundColor: "var(--green-700)", color: "#FFFFFF" }}
      >
        <Plus size={16} />
        Add Ingredient
      </button>

      {/* Deboning Guide Modal */}
      {showGuide && (
        <>
          <div className="fixed inset-0 z-50" style={{ backgroundColor: "rgba(0,0,0,0.30)", backdropFilter: "blur(2px)" }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-xl p-6 max-w-sm w-full text-center border" style={{ borderColor: "var(--border-color)", backgroundColor: "#FFFFFF" }}>
              <h2 className="font-playfair font-semibold text-[18px] mb-4" style={{ color: "var(--dark)" }}>
                How to Debone Chicken Thighs
              </h2>
              <div className="text-left space-y-3 mb-6">
                <p className="font-inter text-[14px]" style={{ color: "var(--dark)" }}>
                  <strong>Step 1:</strong> Place the thigh skin-side down on a cutting board.
                </p>
                <p className="font-inter text-[14px]" style={{ color: "var(--dark)" }}>
                  <strong>Step 2:</strong> Use a sharp knife to cut along both sides of the bone.
                </p>
                <p className="font-inter text-[14px]" style={{ color: "var(--dark)" }}>
                  <strong>Step 3:</strong> Pull the bone away from the meat, cutting any remaining connective tissue.
                </p>
                <p className="font-inter text-[14px]" style={{ color: "var(--dark)" }}>
                  <strong>Step 4:</strong> Remove the bone completely and trim any excess fat if desired.
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-3 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90"
                style={{ backgroundColor: "#4E6E1E", color: "#FFFFFF" }}
              >
                Got it!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}