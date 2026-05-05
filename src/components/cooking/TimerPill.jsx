import React from "react";
import { Pause, Play, X } from "lucide-react";

export default function TimerPill({ label, timeLeft, isPaused, onPause, onResume, onCancel }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-full"
      style={{ backgroundColor: "var(--dark)" }}
    >
      <span className="font-inter font-medium text-[13px] text-white">
        {label}: {formatTime(timeLeft)}
      </span>
      <button
        onClick={isPaused ? onResume : onPause}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20"
      >
        {isPaused ? <Play size={12} color="#FFFFFF" /> : <Pause size={12} color="#FFFFFF" />}
      </button>
      <button
        onClick={onCancel}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20"
      >
        <X size={12} color="#FFFFFF" />
      </button>
    </div>
  );
}