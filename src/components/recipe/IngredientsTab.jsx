import React, { useState } from "react";
import { Check, ArrowLeftRight, X, Plus } from "lucide-react";

export default function IngredientsTab({ ingredients, onIngredientsChange, onEditIngredient, onAddIngredient }) {
  const [checkedItems, setCheckedItems] = useState({});

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
              <ArrowLeftRight size={13} style={{ color: "var(--dark)" }} />
              <span className="font-inter text-[11px] font-medium" style={{ color: "var(--dark)" }}>Sub</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add ingredient button */}
      <button
        onClick={onAddIngredient}
        className="w-full mt-4 py-3 rounded-full flex items-center justify-center gap-2 font-inter font-medium text-[14px] transition-all hover:opacity-80 active:scale-[0.97]"
        style={{ backgroundColor: "var(--green-100)", color: "var(--dark)" }}
      >
        <Plus size={16} />
        Add Ingredient
      </button>
    </div>
  );
}