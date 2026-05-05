import React from "react";

export default function CuisineCard({ name, image, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[110px] transition-all duration-150 hover:scale-[0.97] active:scale-[0.95]"
    >
      <div className="w-[110px] h-[110px] rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <p
        className="font-inter font-medium text-[13px] mt-2 text-center truncate"
        style={{ color: "var(--dark)" }}
      >
        {name}
      </p>
    </button>
  );
}