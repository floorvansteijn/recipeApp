import React from "react";
import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-card rounded-xl border cursor-pointer transition-all duration-150 hover:scale-[0.98] active:scale-[0.97] overflow-hidden"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="relative w-full" style={{ height: 180 }}>
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="p-4">
        <h3
          className="font-playfair font-semibold text-[15px] leading-tight line-clamp-2"
          style={{ color: "var(--dark)" }}
        >
          {recipe.title}
        </h3>
        <p
          className="font-inter text-[11px] leading-snug mt-1.5 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {recipe.description}
        </p>
        <div className="flex items-center gap-3 mt-3">
          {recipe.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-inter font-medium uppercase px-2 py-0.5 rounded"
              style={{
                backgroundColor: "var(--green-100)",
                color: "var(--dark))",
                letterSpacing: "0.8px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-1">
            <Clock size={14} style={{ color: "var(--text-secondary)" }} />
            <span className="text-[12px] font-inter" style={{ color: "var(--text-secondary)" }}>
              {recipe.cooking_time} min
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} style={{ color: "var(--text-secondary)" }} />
            <span className="text-[12px] font-inter" style={{ color: "var(--text-secondary)" }}>
              {recipe.portions} portions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}