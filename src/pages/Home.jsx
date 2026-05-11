import React, { useState, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/home/SearchBar";
import FilterSheet from "../components/home/FilterSheet";
import HorizontalScroll from "../components/home/HorizontalScroll";
import CuisineCard from "../components/shared/CuisineCard";
import RecipeCard from "../components/shared/RecipeCard";
import { cuisineTypes, dailyInspiration, sampleRecipes } from "../lib/recipeData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const showResults = searchQuery.trim().length > 0 || Object.values(filters).some(v => v !== null && v !== undefined);

  const filteredRecipes = useMemo(() => {
    let results = [...sampleRecipes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.ingredients?.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    if (filters.protein) {
      results = results.filter(
        (r) => r.protein_type?.toLowerCase() === filters.protein.toLowerCase()
      );
    }
    if (filters.time) {
      results = results.filter((r) => r.cooking_time <= filters.time);
    }
    return results;
  }, [searchQuery, filters]);

  const handleCuisineClick = (cuisine) => {
    setSearchQuery(cuisine);
  };

  const handleInspirationClick = (dish) => {
    setSearchQuery(dish);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--page-bg)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h1 className="font-playfair font-bold text-2xl" style={{ color: "var(--dark)" }}>
          CookMate
        </h1>
        <Link
          to="/my-recipes"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-inter font-medium text-[13px] transition-all duration-150 hover:opacity-80 active:scale-[0.97]"
          style={{ backgroundColor: "var(--green-100)", color: "#000000" }}
        >
          <BookOpen size={16} />
          My Recipe Book
        </Link>
      </div>

      <div className="px-4 space-y-6 pb-8">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onFilterClick={() => setFilterOpen(true)}
        />

        {showResults ? (
          /* Search Results */
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-inter font-semibold text-[13px] uppercase" style={{ color: "var(--dark)", letterSpacing: "0.8px" }}>
                {filteredRecipes.length} {filteredRecipes.length === 1 ? "Recipe" : "Recipes"} Found
              </p>
              <button
                onClick={() => { setSearchQuery(""); setFilters({}); }}
                className="font-inter text-[13px] font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Clear all
              </button>
            </div>
            {filteredRecipes.length > 0 ? (
              <div className="grid gap-4">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-playfair font-semibold text-lg" style={{ color: "var(--dark)" }}>
                  No recipes found
                </p>
                <p className="font-inter text-[14px] mt-2" style={{ color: "var(--text-secondary)" }}>
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Discovery */
          <>
            <HorizontalScroll title="Cuisine Type">
              {cuisineTypes.map((c) => (
                <CuisineCard
                  key={c.name}
                  name={c.name}
                  image={c.image}
                  onClick={() => handleCuisineClick(c.name)}
                />
              ))}
            </HorizontalScroll>

            <HorizontalScroll title="Daily Inspiration">
              {dailyInspiration.map((d) => (
                <CuisineCard
                  key={d.name}
                  name={d.name}
                  image={d.image}
                  onClick={() => handleInspirationClick(d.name)}
                />
              ))}
            </HorizontalScroll>
          </>
        )}
      </div>

      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
        initialFilters={filters}
      />
    </div>
  );
}