import React, { useState } from "react";
import BottomSheet from "../shared/BottomSheet";
import { ChevronLeft } from "lucide-react";

export default function EditIngredientSheet({
  isOpen,
  onClose,
  ingredient,
  onModify,
  onFindSubstitute,
}) {
  const [view, setView] = useState("main"); // main | substitute | custom
  const [customName, setCustomName] = useState(ingredient?.name || "");
  const [customAmount, setCustomAmount] = useState(ingredient?.amount || "");
  const [customNotes, setCustomNotes] = useState(ingredient?.notes || "");
  const [selectedSub, setSelectedSub] = useState(null);

  // AI-suggested substitutes (mock)
  const substitutes = [
    "Red onion",
    "Shallots",
    "Leek",
    "Green onion",
    "Chives",
  ];

  React.useEffect(() => {
    if (ingredient) {
      setCustomName(ingredient.name);
      setCustomAmount(ingredient.amount);
      setCustomNotes(ingredient.notes || "");
    }
    setView("main");
    setSelectedSub(null);
  }, [ingredient, isOpen]);

  const handleModify = () => {
    onModify({ name: customName, amount: customAmount, notes: customNotes });
    onClose();
  };

  const handleSubstitute = () => {
    if (selectedSub) {
      onModify({ name: selectedSub, amount: ingredient.amount, notes: ingredient.notes });
      onClose();
    }
  };

  if (view === "substitute") {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title="Find Substitute" showClose={true}>
        <div>
          <button
            onClick={() => setView("main")}
            className="flex items-center gap-1 mb-4 font-inter text-[13px] font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <p className="font-inter text-[12px] mb-3" style={{ color: "var(--text-secondary)" }}>
            Suggested alternatives for <strong>{ingredient?.name}</strong>:
          </p>
          <div className="space-y-2">
            {substitutes.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className="w-full text-left py-3 px-4 rounded-xl border font-inter text-[14px] transition-all"
                style={{
                  borderColor: selectedSub === sub ? "var(--green-700)" : "var(--border-color)",
                  backgroundColor: selectedSub === sub ? "var(--green-100)" : "var(--card-bg)",
                  color: "var(--dark)",
                }}
              >
                {sub}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubstitute}
            disabled={!selectedSub}
            className="w-full mt-6 py-3 rounded-full font-inter font-medium text-[14px] transition-all"
            style={{
              backgroundColor: selectedSub ? "var(--dark)" : "var(--border-color)",
              color: selectedSub ? "#FFFFFF" : "var(--text-secondary)",
              minHeight: 44,
              opacity: selectedSub ? 1 : 0.4,
            }}
          >
            Change to Substitute
          </button>
        </div>
      </BottomSheet>
    );
  }

  if (view === "custom") {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title="Custom Modification" showClose={true}>
        <div className="space-y-4">
          <button
            onClick={() => setView("main")}
            className="flex items-center gap-1 font-inter text-[13px] font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <div>
            <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Ingredient Name
            </label>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full py-2.5 px-4 rounded-full border-[1.5px] font-inter text-[14px] bg-card focus:outline-none"
              style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green-700)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>
          <div>
            <label className="font-inter text-[12px] font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Amount
            </label>
            <input
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
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
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={3}
              className="w-full py-2.5 px-4 rounded-xl border-[1.5px] font-inter text-[14px] bg-card resize-none focus:outline-none"
              style={{ borderColor: "var(--border-color)", color: "var(--dark)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>
          <button
            onClick={handleModify}
            className="w-full py-3 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ backgroundColor: "var(--dark)", color: "#FFFFFF", minHeight: 44 }}
          >
            Modify
          </button>
        </div>
      </BottomSheet>
    );
  }

  // Main view — choose action
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`Edit: ${ingredient?.name || ""}`} showClose={true}>
      <div className="space-y-3">
        <button
          onClick={() => setView("substitute")}
          className="w-full py-4 px-4 rounded-xl border text-left font-inter transition-all hover:border-[var(--green-500)]"
          style={{ borderColor: "var(--border-color)" }}
        >
          <p className="font-medium text-[14px]" style={{ color: "var(--dark)" }}>Find Substitute</p>
        </button>
        <button
          onClick={() => setView("custom")}
          className="w-full py-4 px-4 rounded-xl border text-left font-inter transition-all hover:border-[var(--green-500)]"
          style={{ borderColor: "var(--border-color)" }}
        >
          <p className="font-medium text-[14px]" style={{ color: "var(--dark)" }}>Custom Modification</p>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Change name, amount, or make notes
          </p>
        </button>
      </div>
    </BottomSheet>
  );
}