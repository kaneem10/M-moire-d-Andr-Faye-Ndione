import { motion } from "motion/react";
import { Cross } from "lucide-react";

const PrayerSection = () => {
  return (
    <section id="priere" className="py-24 md:py-32 bg-beige-light/30 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-10">
            <div className="w-12 h-12 rounded-full border border-olive/30 flex items-center justify-center text-olive/60">
              <Cross className="w-6 h-6" />
            </div>
          </div>
          
          <h2 className="serif text-3xl md:text-4xl font-medium mb-12 text-text-dark">Prière pour le repos de son âme</h2>
          
          <div className="serif text-xl md:text-2xl font-light italic leading-relaxed text-text-dark/80 space-y-6 max-w-2xl mx-auto">
            <p>
              Seigneur Jésus, <br />
              nous te confions ton serviteur. <br />
              Accueille-le dans ta lumière et dans ta paix. <br />
              Pardonne ses fautes <br />
              et donne-lui le repos éternel auprès de toi. <br />
              Console sa famille, <br />
              soutiens ceux qui pleurent son départ, <br />
              et fais grandir en nous l’espérance de la résurrection. <br />
              Que ton amour l’enveloppe pour toujours, <br />
              et que brille sur lui la lumière sans fin.
            </p>
            <p className="text-lg md:text-xl not-italic font-sans uppercase tracking-[0.2em] text-text-mid pt-4">
              Amen
            </p>
          </div>
          
          <div className="mt-16 flex justify-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-olive/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-olive/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-olive/20" />
          </div>
        </motion.div>
      </div>
      
      {/* Subtle background cross or texture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Cross className="w-[400px] h-[400px] text-olive" />
      </div>
    </section>
  );
};

export default PrayerSection;
