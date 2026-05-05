import React from "react";

export default function StepsTab({ steps }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 rounded-xl border"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span
            className="font-playfair font-bold text-2xl flex-shrink-0 w-8"
            style={{ color: "var(--green-500)" }}
          >
            {index + 1}
          </span>
          <div className="flex-1">
            <p className="font-inter text-[14px] leading-relaxed" style={{ color: "var(--dark)" }}>
              {step.instruction}
            </p>
            {step.duration_minutes > 0 && (
              <span
                className="font-inter text-[12px] mt-2 inline-block"
                style={{ color: "var(--text-secondary)" }}
              >
                ~{step.duration_minutes} min
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}