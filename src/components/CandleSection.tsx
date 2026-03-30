import { useState, useEffect } from "react";
import { db, OperationType, handleFirestoreError } from "../firebase";
import { doc, onSnapshot, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";

const MAX_CANDLES_DISPLAY = 21;

const CandleSection = () => {
  const [candles, setCandles] = useState(0);
  const [hasLit, setHasLit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = localStorage.getItem("afn_admin") === "true";

  useEffect(() => {
    // Check if user already lit a candle in this browser
    const alreadyLit = localStorage.getItem("afn_candle_lit") === "true";
    setHasLit(alreadyLit);

    // Listen to real-time candle count
    const unsubscribe = onSnapshot(doc(db, "counters", "candles"), (docSnap) => {
      if (docSnap.exists()) {
        setCandles(docSnap.data().count || 0);
      } else {
        setCandles(0);
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "counters/candles");
    });

    return () => unsubscribe();
  }, []);

  const resetCounter = async () => {
    if (!isAdmin) return;
    if (!window.confirm("Voulez-vous vraiment réinitialiser le compteur de bougies à 0 ?")) return;

    try {
      await setDoc(doc(db, "counters", "candles"), {
        count: 0,
        lastUpdated: new Date().toISOString()
      });
      localStorage.removeItem("afn_candle_lit");
      setHasLit(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "counters/candles");
    }
  };

  const lightCandle = async () => {
    if (hasLit) return;

    try {
      const candleRef = doc(db, "counters", "candles");
      const candleSnap = await getDoc(candleRef);

      if (!candleSnap.exists()) {
        await setDoc(candleRef, {
          count: 1,
          lastUpdated: new Date().toISOString()
        });
      } else {
        await updateDoc(candleRef, {
          count: increment(1),
          lastUpdated: new Date().toISOString()
        });
      }
      
      setHasLit(true);
      localStorage.setItem("afn_candle_lit", "true");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "counters/candles");
    }
  };

  // Show a grid of candles, max 21 visually
  const displayCount = Math.min(candles, MAX_CANDLES_DISPLAY);

  return (
    <section id="bougies" className="py-20 px-6 bg-foreground relative overflow-hidden">
      {/* Warm ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 60%, hsla(38,60%,50%,0.08) 0%, transparent 60%)"
      }} />

      <div className="max-w-[760px] mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gold-light/20" />
          <span className="text-[11px] uppercase tracking-[4px] text-gold-light/60 whitespace-nowrap font-normal">
            Allumer une bougie
          </span>
          <div className="flex-1 h-px bg-gold-light/20" />
        </div>

        <p className="font-display text-lg text-warm-white/50 text-center mb-10 leading-[1.9] italic">
          Allumez une bougie virtuelle en mémoire d'André.
        </p>

        {/* Candles display */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {Array.from({ length: displayCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center candle-appear" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="relative">
                {/* Flame */}
                <div className="candle-flame mx-auto mb-0.5" />
                {/* Glow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400/20 blur-md candle-glow" />
              </div>
              {/* Candle body */}
              <div className="w-2.5 h-10 bg-gradient-to-b from-amber-100 to-amber-200 rounded-sm shadow-[0_0_8px_hsla(38,60%,50%,0.3)]" />
              <div className="w-3.5 h-1.5 bg-amber-200/80 rounded-b-sm -mt-px" />
            </div>
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-gold-light/50 text-sm tracking-[2px] mb-8">
          {isLoading ? "Chargement..." : `${candles} bougie${candles > 1 ? "s" : ""} allumée${candles > 1 ? "s" : ""}`}
        </p>

        {/* Light button */}
        <div className="text-center space-y-4">
          <button
            onClick={lightCandle}
            disabled={hasLit || isLoading}
            className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-sm font-body text-xs font-normal tracking-[2px] uppercase transition-all ${
              hasLit || isLoading
                ? "bg-gold/30 text-warm-white/40 cursor-default"
                : "bg-gold text-warm-white cursor-pointer hover:bg-gold-light active:scale-[0.98] shadow-[0_0_20px_hsla(38,60%,50%,0.3)]"
            }`}
          >
            {isLoading ? "Chargement..." : (hasLit ? "✦ Merci pour votre lumière" : "🕯 Allumer une bougie")}
          </button>

          {isAdmin && (
            <div className="pt-4">
              <button 
                onClick={resetCounter}
                className="text-[10px] text-warm-white/30 uppercase tracking-[2px] hover:text-red-400 transition-colors"
              >
                Réinitialiser le compteur (Admin)
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CandleSection;
