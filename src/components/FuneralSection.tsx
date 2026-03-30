import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Info } from "lucide-react";
import SectionLabel from "./SectionLabel";

const FuneralSection = () => {
  const ceremonies = [
    {
      title: "Messe de Requiem",
      date: "À déterminer",
      time: "--:--",
      location: "Thiès",
      details: "Une messe sera célébrée pour le repos de son âme à Thiès."
    },
    {
      title: "Enterrement",
      date: "À déterminer",
      time: "--:--",
      location: "Thiès",
      details: "L'inhumation aura lieu à Thiès. La date sera communiquée ultérieurement."
    }
  ];

  return (
    <section id="funerailles" className="py-24 px-6 bg-beige-light/10 border-y border-beige-dark/20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel text="Obsèques & Funérailles" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
          {ceremonies.map((ceremony, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="bg-warm-white p-8 rounded-2xl shadow-sm border border-beige-dark/30 flex flex-col h-full relative group hover:border-olive/40 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-olive/20 rounded-t-2xl group-hover:bg-olive/40 transition-colors" />
              
              <h3 className="serif text-2xl font-medium mb-6 text-text-dark">{ceremony.title}</h3>
              
              <div className="space-y-4 flex-grow">
                <div className="flex items-start gap-3 text-text-mid">
                  <Calendar className="w-5 h-5 mt-0.5 text-olive" />
                  <span className="text-sm font-semibold tracking-wide uppercase">{ceremony.date}</span>
                </div>
                
                <div className="flex items-start gap-3 text-text-mid">
                  <Clock className="w-5 h-5 mt-0.5 text-olive" />
                  <span className="text-sm font-medium">{ceremony.time}</span>
                </div>
                
                <div className="flex items-start gap-3 text-text-dark">
                  <MapPin className="w-5 h-5 mt-0.5 text-olive" />
                  <span className="text-sm font-medium leading-relaxed">{ceremony.location}</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-beige-dark/20 flex items-start gap-3 text-text-mid italic">
                  <Info className="w-4 h-4 mt-1 opacity-60" />
                  <p className="text-xs leading-relaxed">{ceremony.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 p-8 bg-foreground text-warm-white rounded-2xl text-center"
        >
          <p className="serif italic text-lg md:text-xl opacity-90">
            "Ceux que nous avons aimés et que nous avons perdus ne sont plus où ils étaient, mais ils sont partout où nous sommes."
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">— Saint Augustin</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FuneralSection;
