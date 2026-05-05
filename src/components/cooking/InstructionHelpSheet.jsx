import React from "react";
import BottomSheet from "../shared/BottomSheet";

export default function InstructionHelpSheet({ isOpen, onClose, stepInstruction, timerElement, guide }) {
  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title={guide?.title || "Step Help"}
    >
      <div className="space-y-4">
        <p className="font-inter text-[14px] leading-relaxed" style={{ color: "var(--dark)" }}>
          Guidance for: <strong>"{stepInstruction}"</strong>
        </p>

        {/* 🍗 Only show the grid if a guide exists for this specific step */}
        {guide?.steps ? (
          <div className="grid grid-cols-2 gap-3">
            {guide.steps.map((step, i) => (
              <div 
                key={i} 
                className="rounded-xl overflow-hidden border flex flex-col" 
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="relative bg-muted aspect-[4/3] flex items-center justify-center overflow-hidden">
                  {/* ✅ This is the tag that loads your public/images/step1.jpg files! */}
                  <img 
                    src={step.image} 
                    alt={`Step ${i + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute top-2 left-2 font-playfair font-bold text-white text-lg drop-shadow-md">
                    {i + 1}
                  </span>
                </div>
                <div className="p-2.5 flex-1 bg-card">
                  <p className="font-inter text-[12px] leading-snug" style={{ color: "var(--dark)" }}>
                    {step.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 🌫️ Fallback for steps without a guide */
          <div 
            className="py-12 text-center border-2 border-dashed rounded-xl" 
            style={{ borderColor: "var(--border-color)" }}
          >
            <p className="font-inter text-[13px] italic" style={{ color: "var(--text-secondary)" }}>
              No visual guide is available for this step.
            </p>
          </div>
        )}

        {timerElement && (
          <div className="pt-3 flex justify-center">
            {timerElement}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-full font-inter font-medium text-[14px] border-[1.5px] transition-all hover:bg-muted active:scale-[0.97]"
          style={{ borderColor: "var(--dark)", color: "var(--dark)", minHeight: 44 }}
        >
          Close
        </button>
      </div>
    </BottomSheet>
  );
}