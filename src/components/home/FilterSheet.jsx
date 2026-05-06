import React, { useState } from "react";
import BottomSheet from "../shared/BottomSheet";
import { Minus, Plus } from "lucide-react";

const PROTEINS = ["Chicken", "Fish", "Beef", "Vegetarian"];
const TIMES = [15, 30, 45, 60, 90, 120];

export default function FilterSheet({ isOpen, onClose, onApply, initialFilters }) {
  const [selectedProtein, setSelectedProtein] = useState(initialFilters?.protein || null);
  const [portions, setPortions] = useState(initialFilters?.portions || 2);
  const [selectedTime, setSelectedTime] = useState(initialFilters?.time || null);

  const handleApply = () => {
    onApply({
      protein: selectedProtein,
      portions,
      time: selectedTime,
    });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Recipes">
      <div className="space-y-6">
        {/* Protein Type */}
        <div>
          <p
            className="font-inter font-semibold text-[13px] uppercase mb-3"
            style={{ color: "var(--green-500)", letterSpacing: "0.8px" }}
          >
            Type of Protein
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PROTEINS.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProtein(selectedProtein === p ? null : p)}
                className="py-2.5 px-4 rounded-full text-[13px] font-inter font-medium transition-all duration-150"
                style={
                  selectedProtein === p
                    ? { backgroundColor: "#4E6E1E", color: "#FFFFFF" }
                    : { backgroundColor: "var(--yellow-100)", color: "var(--dark)", border: "1px solid var(--yellow-300)" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Portions */}
        <div>
          <p
            className="font-inter font-semibold text-[13px] uppercase mb-3"
            style={{ color: "var(--green-500)", letterSpacing: "0.8px" }}
          >
            Portions
          </p>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setPortions(Math.max(1, portions - 1))}
              className="w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-150 hover:scale-[0.95] active:scale-[0.90]"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Minus size={20} style={{ color: "var(--dark)" }} />
            </button>
            <span className="font-playfair font-bold text-3xl w-12 text-center" style={{ color: "var(--dark)" }}>
              {portions}
            </span>
            <button
              onClick={() => setPortions(portions + 1)}
              className="w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-150 hover:scale-[0.95] active:scale-[0.90]"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Plus size={20} style={{ color: "var(--dark)" }} />
            </button>
          </div>
        </div>

        {/* Time */}
        <div>
          <p
            className="font-inter font-semibold text-[13px] uppercase mb-3"
            style={{ color: "var(--green-500)", letterSpacing: "0.8px" }}
          >
            Time
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(selectedTime === t ? null : t)}
                className="py-2.5 px-3 rounded-full text-[13px] font-inter font-medium transition-all duration-150"
                style={
                  selectedTime === t
                    ? { backgroundColor: "#4E6E1E", color: "#FFFFFF" }
                    : { backgroundColor: "var(--yellow-100)", color: "var(--dark)", border: "1px solid var(--yellow-300)" }
                }
              >
                {t} min
              </button>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full py-3 rounded-full font-inter font-medium text-[14px] transition-all duration-150 hover:opacity-90 active:scale-[0.97] mt-4"
          style={{ backgroundColor: "#4E6E1E", color: "#FFFFFF", minHeight: 44 }}
        >
          Apply Filters
        </button>
      </div>
    </BottomSheet>
  );
}