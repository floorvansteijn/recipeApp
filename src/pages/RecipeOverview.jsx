import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Users } from "lucide-react";
import { sampleRecipes } from "../lib/recipeData";
import IngredientsTab from "../components/recipe/IngredientsTab";
import StepsTab from "../components/recipe/StepsTab";
import EditIngredientSheet from "../components/recipe/EditIngredientSheet";
import AddIngredientSheet from "../components/recipe/AddIngredientSheet";

export default function RecipeOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = sampleRecipes.find((r) => r.id === id);

  const [activeTab, setActiveTab] = useState("ingredients");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modifications, setModifications] = useState([]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--page-bg)" }}>
        <p className="font-inter text-[14px]" style={{ color: "var(--text-secondary)" }}>Recipe not found</p>
      </div>
    );
  }

  const handleEditIngredient = (index) => {
    setEditingIndex(index);
    setEditSheetOpen(true);
  };

  const handleModifyIngredient = (updated) => {
    const original = ingredients[editingIndex];
    const newIngredients = [...ingredients];
    newIngredients[editingIndex] = { ...updated, modified: true };
    setIngredients(newIngredients);
    setModifications((prev) => [
      ...prev,
      {
        type: "swap",
        original: `${original.amount} ${original.name}`,
        replacement: `${updated.amount} ${updated.name}`,
      },
    ]);
    setEditSheetOpen(false);
  };

  const handleAddIngredient = (newIng) => {
    setIngredients((prev) => [...prev, newIng]);
    setModifications((prev) => [
      ...prev,
      { type: "addition", replacement: `${newIng.amount} ${newIng.name}`, amount: newIng.amount },
    ]);
  };

  const startCooking = () => {
    navigate(`/cooking/${id}`, {
      state: { ingredients, modifications },
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--page-bg)" }}>
      {/* Hero Image */}
      <div className="relative">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft size={20} style={{ color: "var(--dark)" }} />
        </button>
      </div>

      {/* Recipe Info */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-xl border p-4" style={{ borderColor: "var(--border-color)" }}>
          <h1 className="font-playfair font-semibold text-2xl" style={{ color: "var(--dark)" }}>
            {recipe.title}
          </h1>
          <p className="font-inter text-[12px] mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {recipe.description}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Clock size={14} style={{ color: "var(--text-secondary)" }} />
              <span className="font-inter text-[12px]" style={{ color: "var(--text-secondary)" }}>
                {recipe.cooking_time} min
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} style={{ color: "var(--text-secondary)" }} />
              <span className="font-inter text-[12px]" style={{ color: "var(--text-secondary)" }}>
                {recipe.portions} portions
              </span>
            </div>
            {recipe.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-inter font-medium uppercase px-2 py-0.5 rounded"
                style={{ backgroundColor: "var(--green-100)", color: "var(--green-500)", letterSpacing: "0.8px" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="px-4 mt-6">
        <div className="flex gap-0 rounded-full p-1" style={{ backgroundColor: "var(--green-100)" }}>
          {["ingredients", "steps"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-full font-inter font-semibold text-[13px] uppercase transition-all duration-200"
              style={{
                backgroundColor: activeTab === tab ? "var(--green-700)" : "transparent",
                color: activeTab === tab ? "#FFFFFF" : "var(--dark)",
                letterSpacing: "0.8px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4 pb-28">
        {activeTab === "ingredients" ? (
          <IngredientsTab
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
            onEditIngredient={handleEditIngredient}
            onAddIngredient={() => setAddSheetOpen(true)}
          />
        ) : (
          <StepsTab steps={recipe.steps} />
        )}
      </div>

      {/* Start Cooking Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--page-bg)] via-[var(--page-bg)] to-transparent">
        <button
          onClick={startCooking}
          className="w-full py-3.5 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ backgroundColor: "var(--dark)", color: "#FFFFFF", minHeight: 44 }}
        >
          Start Cooking
        </button>
      </div>

      {/* Sheets */}
      <EditIngredientSheet
        isOpen={editSheetOpen}
        onClose={() => setEditSheetOpen(false)}
        ingredient={editingIndex !== null ? ingredients[editingIndex] : null}
        onModify={handleModifyIngredient}
      />
      <AddIngredientSheet
        isOpen={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        onAdd={handleAddIngredient}
      />
    </div>
  );
}