import React, { useState } from "react";
import BottomSheet from "../shared/BottomSheet";

export default function AddIngredientSheet({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), amount: amount.trim(), notes: notes.trim(), modified: true });
    setName("");
    setAmount("");
    setNotes("");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Ingredient">
      <div className="space-y-4">
        <div>
          <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Ingredient Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chili flakes"
            className="w-full py-2.5 px-4 rounded-full border-[1.5px] font-inter text-[14px] bg-card focus:outline-none"
            style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>
        <div>
          <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Amount
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1 tsp"
            className="w-full py-2.5 px-4 rounded-full border-[1.5px] font-inter text-[14px] bg-card focus:outline-none"
            style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>
        <div>
          <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            rows={3}
            className="w-full py-2.5 px-4 rounded-xl border-[1.5px] font-inter text-[14px] bg-card resize-none focus:outline-none"
            style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="w-full py-3 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
          style={{
            backgroundColor: name.trim() ? "var(--dark)" : "var(--border-color)",
            color: name.trim() ? "#FFFFFF" : "var(--text-secondary)",
            minHeight: 44,
            opacity: name.trim() ? 1 : 0.4,
          }}
        >
          Add Ingredient
        </button>
      </div>
    </BottomSheet>
  );
}