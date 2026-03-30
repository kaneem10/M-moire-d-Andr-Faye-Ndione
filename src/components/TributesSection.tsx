import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, User, Sparkles } from "lucide-react";
import { db, OperationType, handleFirestoreError } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

interface Tribute {
  id: string;
  name: string;
  message: string;
  date: string;
  uid: string;
}

const TributesSection = () => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "tributes"), orderBy("date", "desc"));
    const unsubscribeTributes = onSnapshot(q, (snapshot) => {
      const tributesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tribute[];
      setTributes(tributesData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tributes");
    });

    return () => {
      unsubscribeTributes();
    };
  }, []);

  const addTribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const tribute = {
        name: newName.trim(),
        message: newMessage.trim(),
        date: new Date().toISOString(),
        uid: "anonymous"
      };

      await addDoc(collection(db, "tributes"), tribute);
      setNewMessage("");
      setNewName("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "tributes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="tributes" className="bg-beige-light/50 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="serif text-4xl md:text-5xl font-medium text-text-dark">Laissez un hommage</h2>
            <p className="text-text-mid text-lg">
              Partagez un souvenir, une pensée ou un message de sympathie en l'honneur d'André Faye Ndione.
            </p>
            
            <form onSubmit={addTribute} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-text-mid mb-2">Votre Nom</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-beige-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all text-sm"
                  placeholder="Ex: Famille Faye"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-text-mid mb-2">Votre Message</label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-beige-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all resize-none text-sm"
                  placeholder="Écrivez votre hommage ici..."
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-olive text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-olive/90 transition-all shadow-lg shadow-olive/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Publication..." : "Publier l'hommage"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="serif text-2xl font-medium text-text-dark">Messages récents</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-mid bg-white px-3 py-1 rounded-full border border-beige-dark/50">
                {tributes.length} hommages
              </span>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {isLoading ? (
                [1, 2].map(i => (
                  <div key={i} className="bg-white/50 h-32 rounded-2xl animate-pulse border border-beige-dark/30" />
                ))
              ) : (
                <AnimatePresence initial={false}>
                  {tributes.map((tribute) => (
                    <motion.div 
                      key={tribute.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-8 rounded-2xl border border-beige-dark/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-beige-light rounded-full flex items-center justify-center text-olive">
                            <Heart className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                            <h4 className="font-bold text-text-dark">{tribute.name}</h4>
                            <span className="text-[10px] text-text-mid uppercase tracking-widest font-bold">
                              {new Date(tribute.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-text-dark/80 leading-relaxed italic serif">
                        "{tribute.message}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {!isLoading && tributes.length === 0 && (
                <div className="py-20 text-center">
                  <Sparkles className="w-10 h-10 text-olive/20 mx-auto mb-4" />
                  <p className="text-text-mid serif italic">Aucun hommage pour le moment. Partagez le premier.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TributesSection;
