import React, { useState } from "react";
import BottomSheet from "../shared/BottomSheet";

// 👇 Added `currentMods = []` to the props!
export default function StepModifySheet({ isOpen, onClose, onModify, currentMods = [] }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleModify = () => {
    if (!name.trim()) return;
    onModify({ name: name.trim(), amount: amount.trim(), notes: notes.trim() });
    setName("");
    setAmount("");
    setNotes("");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Custom Modification">
      <div className="space-y-5">
        
        {/* ✨ NEW SECTION: Shows the persistent feedback list if items exist */}
        {currentMods.length > 0 && (
          <div 
            className="p-4 rounded-xl border-[1.5px]" 
            style={{ backgroundColor: "var(--green-100)", borderColor: "var(--green-500)" }}
          >
            <h4 className="font-inter text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--green-500)" }}>
              Added to this step
            </h4>
            <ul className="space-y-2.5">
              {currentMods.map((mod, index) => (
                <li key={index} className="flex items-start gap-2.5 font-inter text-[14px] leading-snug" style={{ color: "var(--dark)" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "var(--green-500)" }} />
                  {/* Shows exactly what was captured by voice or text */}
                  <span>{mod.replacement || `${mod.amount} ${mod.name}`}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 border-t" style={{ borderColor: "var(--border-color)", display: currentMods.length > 0 ? "block" : "none" }} />

        {/* --- EXISTING FORM --- */}
        <div className="space-y-4">
          <div>
            <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Ingredient Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ginger"
              className="w-full py-2.5 px-4 rounded-full border-[1.5px] font-inter text-[14px] bg-card focus:outline-none transition-colors"
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
              placeholder="e.g. 1 inch"
              className="w-full py-2.5 px-4 rounded-full border-[1.5px] font-inter text-[14px] bg-card focus:outline-none transition-colors"
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
              className="w-full py-2.5 px-4 rounded-xl border-[1.5px] font-inter text-[14px] bg-card resize-none focus:outline-none transition-colors"
              style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>
          
          <button
            onClick={handleModify}
            disabled={!name.trim()}
            className="w-full py-3 mt-2 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: name.trim() ? "var(--dark)" : "var(--border-color)",
              color: name.trim() ? "#FFFFFF" : "var(--text-secondary)",
              minHeight: 44,
              opacity: name.trim() ? 1 : 0.4,
            }}
          >
            Add Modification
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}