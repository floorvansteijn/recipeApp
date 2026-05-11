import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Pencil, Clock, Mic, HelpCircle } from "lucide-react";
import { sampleRecipes } from "../lib/recipeData";
import TimerPill from "../components/cooking/TimerPill";
import InstructionHelpSheet from "../components/cooking/InstructionHelpSheet";
import StepModifySheet from "../components/cooking/StepModifySheet";

export default function LiveCooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = sampleRecipes.find((r) => r.id === id);
  const steps = recipe?.steps || [];

  const [currentStep, setCurrentStep] = useState(
    location.state?.startAtLastStep ? Math.max(0, (recipe?.steps?.length || 1) - 1) : 0
  );
  const [timer, setTimer] = useState(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [cookingMods, setCookingMods] = useState(location.state?.modifications || []);
  const [showComplete, setShowComplete] = useState(false);
  const timerRef = useRef(null);
  const stepSpokenRef = useRef(false);

  // Timer logic
  useEffect(() => {
    if (timer && !timer.paused && timer.left > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (!prev || prev.paused) return prev;
          if (prev.left <= 1) {
            clearInterval(timerRef.current);
            return null;
          }
          return { ...prev, left: prev.left - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer?.paused, timer?.left]);

  // Text-to-Speech for current step - speaks once per step
  useEffect(() => {
    // Reset the flag when step changes
    stepSpokenRef.current = false;
  }, [currentStep]);

  useEffect(() => {
    // Only speak if the step hasn't been spoken yet
    if (!stepSpokenRef.current && steps[currentStep]) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(steps[currentStep].instruction);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Get English voice if available
      const voices = synth.getVoices();
      const englishVoice = voices.find((voice) => voice.lang.startsWith("en-US")) || 
                          voices.find((voice) => voice.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      synth.speak(utterance);
      stepSpokenRef.current = true;
    }
  }, [currentStep, steps]);

  const startTimer = () => {
    const step = steps[currentStep];
    const mins = step.duration_minutes || 5;
    setTimer({ label: step.instruction.substring(0, 20), total: mins * 60, left: mins * 60, paused: false });
  };

  const repeatInstructions = () => {
    if (steps[currentStep]) {
      const synth = window.speechSynthesis;
      synth.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(steps[currentStep].instruction);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Get English voice if available
      const voices = synth.getVoices();
      const englishVoice = voices.find((voice) => voice.lang.startsWith("en-US")) || 
                          voices.find((voice) => voice.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      synth.speak(utterance);
    }
  };

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowComplete(true);
    }
  }, [currentStep, steps.length]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const handleSaveDecision = useCallback((save) => {
    if (save) {
      navigate(`/save-recipe/${id}`, {
        state: { modifications: cookingMods, ingredients: location.state?.ingredients },
      });
    } else {
      navigate("/");
    }
  }, [navigate, id, cookingMods, location.state]);

  const handleStepModify = useCallback((mod) => {
    setCookingMods((prev) => [...prev, { type: "addition", replacement: `${mod.amount} ${mod.name}`, amount: mod.amount }]);
  }, []);

  // Always-on voice recognition — use refs so callbacks always see latest state
  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  const startTimerRef = useRef(startTimer);
  const navigateRef = useRef(navigate);
  const handleSaveDecisionRef = useRef(handleSaveDecision);
  const handleStepModifyRef = useRef(handleStepModify); // Added ref for adding ingredients via speech
  const repeatInstructionsRef = useRef(repeatInstructions);

  useEffect(() => { goNextRef.current = goNext; }, [goNext]);
  useEffect(() => { goPrevRef.current = goPrev; }, [goPrev]);
  useEffect(() => { startTimerRef.current = startTimer; });
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  useEffect(() => { handleSaveDecisionRef.current = handleSaveDecision; }, [handleSaveDecision]);
  useEffect(() => { handleStepModifyRef.current = handleStepModify; }, [handleStepModify]);
  useEffect(() => { repeatInstructionsRef.current = repeatInstructions; }, []);

  // --- VOICE RECOGNITION LOGIC ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceActive(false);
      return;
    }

    let active = true;
    let recognitionInstance = null;
    let lastCommandTime = 0; 

    const startListening = () => {
      if (!active) return;
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US"; 

      recognitionInstance.onresult = (event) => {
        const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("Microphone heard:", text);

        if (Date.now() - lastCommandTime < 1500) {
          return; 
        }

        let executed = false;

        // --- COMMANDS ---
        
        // 1. Navigation Commands
        if (text.includes("next") || text.includes("finish") || text.includes("done") || text.includes("forward")) {
          goNextRef.current(); 
          executed = true;
        } 
        else if (text.includes("back") || text.includes("previous") || text.includes("last") || text.includes("return")) {
          goPrevRef.current();
          executed = true;
        } 
        else if (text.includes("home")) {
          navigateRef.current("/");
          executed = true;
        }
        else if (text.includes("recipe")) {
          navigateRef.current(`/recipe/${id}`);
          executed = true;
        }

        // 2. Completion Dialog Commands
        else if (text.includes("yes")) {
          handleSaveDecisionRef.current(true);
          executed = true;
        }
        else if (text.includes("no") && !text.includes("now")) {
          handleSaveDecisionRef.current(false);
          executed = true;
        }

        // 3. Tool & UI Commands
        else if (text.includes("start timer") || (text.includes("timer") && !text.includes("stop") && !text.includes("pause"))) {
          startTimerRef.current();
          executed = true;
        }
        else if (text.includes("pause timer")) {
          setTimer((t) => t ? { ...t, paused: true } : null);
          executed = true;
        }
        else if (text.includes("stop timer")) {
          setTimer(null);
          executed = true;
        }
        else if (text.includes("instructions again") || text.includes("repeat instructions") || text.includes("repeat that")) {
          repeatInstructionsRef.current();
          executed = true;
        }
        else if (text.includes("help") || text.includes("explain") || text.includes("show pictures")) {
          setHelpOpen(true);
          executed = true;
        }
        else if (text.includes("modify") || text.includes("change") || text.includes("edit")) {
          setModifyOpen(true);
          executed = true;
        }
        else if (text.includes("close") || text.includes("exit") || text.includes("stop") || text.includes("cancel") || text.includes("hide")) {
          setHelpOpen(false);
          setModifyOpen(false);
          executed = true;
        }
        
        // 4. ADD INGREDIENT BY SPEECH ("Add 1 cup of sugar")
        else if (text.startsWith("add ")) {
          let amount = "";
          let name = text.replace("add ", "").trim();

          // Parser for "1 cup OF sugar"
          if (name.includes(" of ")) {
            const parts = name.split(" of ");
            amount = parts[0].trim();
            name = parts.slice(1).join(" of ").trim();
          } else {
            // Parser for "2 carrots" or "some salt"
            const words = name.split(" ");
            if (words.length > 1 && (/^\d/.test(words[0]) || ["a", "some", "one", "two", "half"].includes(words[0]))) {
              amount = words[0];
              name = words.slice(1).join(" ");
            } else {
              amount = "some"; // default if no amount is spoken
            }
          }
          
          handleStepModifyRef.current({ amount, name });
          executed = true;
        }

        if (executed) {
          lastCommandTime = Date.now();
        }
      };

      recognitionInstance.onstart = () => setVoiceActive(true);

      recognitionInstance.onerror = (e) => {
        setVoiceActive(false);
        if (e.error !== "not-allowed" && active) {
          setTimeout(startListening, 1500);
        }
      };

      recognitionInstance.onend = () => {
        setVoiceActive(false);
        if (active) setTimeout(startListening, 300);
      };

      try { recognitionInstance.start(); } catch {}
    };

    startListening();

    return () => {
      active = false;
      try { recognitionInstance?.stop(); } catch {}
    };
  }, [id]); 

  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--page-bg)" }}>
        <p className="font-inter">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--page-bg)" }}>
      {/* Top Nav */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Home size={20} style={{ color: "var(--dark)" }} />
          </button>
          <button
            onClick={() => navigate(`/recipe/${id}`)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <BookOpen size={20} style={{ color: "var(--dark)" }} />
          </button>
        </div>
        <div className="font-inter font-semibold text-[13px]" style={{ color: "#4E6E1E", letterSpacing: "0.8px" }}>
          STEP {currentStep + 1} OF {steps.length}
        </div>
        <div className="w-20" />
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="h-1 rounded-full" style={{ backgroundColor: "var(--green-100)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ backgroundColor: "var(--green-500)", width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <span className="font-playfair font-bold text-[28px] mb-6" style={{ color: "var(--dark)" }}>
          {currentStep + 1}
        </span>
        <p className="font-inter text-[16px] leading-relaxed max-w-sm" style={{ color: "var(--dark)" }}>
          {steps[currentStep]?.instruction}
        </p>
        {steps[currentStep]?.duration_minutes > 0 && (
          <span className="font-inter text-[12px] mt-4" style={{ color: "var(--text-secondary)" }}>
            ~{steps[currentStep].duration_minutes} min
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 py-4">
        <button
          onClick={() => setModifyOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-[0.95] active:scale-[0.90]"
          style={{ backgroundColor: "var(--green-100)" }}
        >
          <Pencil size={20} style={{ color: "var(--dark)" }} />
        </button>
        <button
          onClick={startTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-[0.95] active:scale-[0.90]"
          style={{ backgroundColor: "var(--green-100)" }}
        >
          <Clock size={20} style={{ color: "var(--dark)" }} />
        </button>
        <button
          onClick={() => setHelpOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-[0.95] active:scale-[0.90]"
          style={{ backgroundColor: "var(--green-100)" }}
        >
          <HelpCircle size={20} style={{ color: "var(--dark)" }} />
        </button>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center relative"
          style={{ backgroundColor: voiceActive ? "var(--green-500)" : "var(--green-100)" }}
          title="Voice control active"
        >
          <Mic size={20} color={voiceActive ? "#FFFFFF" : "var(--green-500)"} />
          {voiceActive && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: "var(--green-500)" }} />
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 px-4 pb-4">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex-1 py-3 rounded-full font-inter font-medium text-[14px] border-[1.5px] transition-all"
          style={{
            borderColor: "#4E6E1E",
            color: "#4E6E1E",
            minHeight: 44,
            opacity: currentStep === 0 ? 0.4 : 1,
          }}
        >
          Previous
        </button>
        <button
          onClick={goNext}
          className="flex-1 py-3 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ backgroundColor: "#4E6E1E", color: "#FFFFFF", minHeight: 44 }}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>

      {/* Timer Pill */}
      {timer && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <TimerPill
            label={timer.label}
            timeLeft={timer.left}
            isPaused={timer.paused}
            onPause={() => setTimer((t) => ({ ...t, paused: true }))}
            onResume={() => setTimer((t) => ({ ...t, paused: false }))}
            onCancel={() => setTimer(null)}
          />
        </div>
      )}

      {/* Completion Dialog */}
      {showComplete && (
        <>
          <div className="fixed inset-0 z-50" style={{ backgroundColor: "rgba(0,0,0,0.30)", backdropFilter: "blur(2px)" }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-xl p-6 max-w-sm w-full text-center border" style={{ borderColor: "var(--border-color)", backgroundColor: "#FFFFFF" }}>
              
              <p className="font-inter text-[14px] mt-2 mb-6" style={{ color: "var(--text-secondary)" }}>
                Do you want to save this recipe to 'My Recipe Book'?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveDecision(false)}
                  className="flex-1 py-3 rounded-full font-inter font-medium text-[14px] border-[1.5px] transition-all hover:opacity-80"
                  style={{ borderColor: "#4E6E1E", color: "#4E6E1E" }}
                >
                  No, I don't
                </button>
                <button
                  onClick={() => handleSaveDecision(true)}
                  className="flex-1 py-3 rounded-full font-inter font-medium text-[14px] transition-all hover:opacity-90"
                  style={{ backgroundColor: "#4E6E1E", color: "#FFFFFF" }}
                >
                  Yes, I want
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sheets */}
      <InstructionHelpSheet
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        stepInstruction={steps[currentStep]?.instruction || ""}
        guide={steps[currentStep]?.guide} 
        timerElement={timer ? (
          <TimerPill
            label={timer.label}
            timeLeft={timer.left}
            isPaused={timer.paused}
            onPause={() => setTimer((t) => ({ ...t, paused: true }))}
            onResume={() => setTimer((t) => ({ ...t, paused: false }))}
            onCancel={() => setTimer(null)}
          />
        ) : null}
      />
      <StepModifySheet
        isOpen={modifyOpen}
        onClose={() => setModifyOpen(false)}
        onModify={handleStepModify}
        currentMods={cookingMods}
      />
    </div>
  );
}