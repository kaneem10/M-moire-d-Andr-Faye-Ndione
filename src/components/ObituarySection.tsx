import { motion } from "motion/react";
import SectionLabel from "./SectionLabel";

const ObituarySection = () => {
  return (
    <section id="avis" className="py-20 px-6 bg-warm-white">
      <div className="max-w-[760px] mx-auto">
        <SectionLabel text="Avis de Décès" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-beige-light/20 border border-beige-dark/40 p-10 md:p-16 rounded-sm text-center relative overflow-hidden"
        >
          {/* Subtle decorative corner */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-olive/10 -mr-12 -mt-12 rotate-45" />
          
          <div className="serif text-text-dark space-y-8 relative z-10">
            <p className="text-lg uppercase tracking-[4px] text-text-mid font-sans font-semibold">Faire-part</p>
            
            <div className="space-y-4">
              <p className="text-xl md:text-2xl italic">
                La famille Faye-Ndione, parents et alliés, <br />
                ont la profonde douleur de vous faire part du rappel à Dieu de leur frère, père, ami et oncle
              </p>
              
              <h3 className="text-4xl md:text-5xl font-medium py-4">André Faye Ndione</h3>
            </div>
            
            <div className="w-12 h-px bg-olive/30 mx-auto" />
            
            <p className="text-xl md:text-2xl leading-relaxed">
              Survenu le <span className="font-semibold">Jeudi 26 Mars 2026</span> <br />
              à l'âge de 52 ans.
            </p>

            <div className="w-12 h-px bg-olive/30 mx-auto" />

            <div className="text-text-mid text-sm md:text-base space-y-4 max-w-lg mx-auto leading-relaxed">
              <p>
                Il laisse dans le deuil son épouse bien-aimée <span className="text-text-dark font-semibold">Florence</span>, 
                sa fille <span className="text-text-dark font-semibold">Marie</span>, 
                ses sœurs et frères, sa famille, ses amis fidèles, 
                ainsi que tous ceux qui ont eu le privilège de le connaître, de l'aimer et d'être touchés par la lumière de sa présence.
              </p>
              <p className="italic opacity-80">
                Il s'en est allé rejoindre son père <span className="font-semibold">Benoit Faye</span> et sa mère <span className="font-semibold">Marie Ndione</span>.
              </p>
            </div>
            
            <p className="text-text-mid italic pt-6">
              « Je suis la résurrection et la vie. Celui qui croit en moi vivra, quand même il serait mort. » <br />
              <span className="text-xs uppercase tracking-widest not-italic font-sans font-bold mt-2 block">— Jean 11:25</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ObituarySection;
