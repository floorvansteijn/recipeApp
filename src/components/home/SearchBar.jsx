import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ value, onChange, onFilterClick }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-secondary)" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search recipes, ingredients..."
        className="w-full py-2.5 pl-9 pr-11 rounded-full font-inter text-[14px] border-[1.5px] bg-card transition-colors duration-150 focus:outline-none"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--dark)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
      />
      <button
        onClick={onFilterClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
      >
        <SlidersHorizontal size={16} style={{ color: "var(--text-secondary)" }} />
      </button>
    </div>
  );
}