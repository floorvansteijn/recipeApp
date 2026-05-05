import React from "react";

export default function HorizontalScroll({ title, children }) {
  return (
    <div>
      <p
        className="font-inter font-semibold text-[13px] uppercase mb-3"
        style={{ color: "var(--green-500)", letterSpacing: "0.8px" }}
      >
        {title}
      </p>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {children}
      </div>
    </div>
  );
}