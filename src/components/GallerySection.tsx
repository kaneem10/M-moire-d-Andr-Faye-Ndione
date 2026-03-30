import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Video, Plus, X, Upload, Sparkles, User, Trash2 } from "lucide-react";
import { db, OperationType, handleFirestoreError } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
  authorName: string;
  date: string;
  uid: string;
  creatorId?: string; // Used for local deletion rights
}

const GallerySection = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Local storage for tracking own posts
  const [myPostIds, setMyPostIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("afn_my_posts");
    if (stored) setMyPostIds(JSON.parse(stored));
    
    const adminStatus = localStorage.getItem("afn_admin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // Form state
  const [type, setType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const q = query(collection(db, "gallery_items"), orderBy("date", "desc"));
    const unsubscribeGallery = onSnapshot(q, (snapshot) => {
      const galleryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setItems(galleryData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "gallery_items");
    });

    return () => {
      unsubscribeGallery();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 1MB for Firestore storage (base64)
    if (file.size > 1024 * 1024) {
      alert("Le fichier est trop volumineux. Veuillez choisir un fichier de moins de 1 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileBase64 || !authorName.trim()) return;

    setIsUploading(true);
    try {
      const creatorId = Math.random().toString(36).substring(2, 15);
      const newItem = {
        type,
        url: fileBase64,
        caption,
        authorName: authorName.trim(),
        date: new Date().toISOString(),
        uid: "anonymous",
        creatorId
      };

      const docRef = await addDoc(collection(db, "gallery_items"), newItem);
      
      // Save creator rights locally
      const updatedIds = [...myPostIds, docRef.id];
      setMyPostIds(updatedIds);
      localStorage.setItem("afn_my_posts", JSON.stringify(updatedIds));
      
      // Reset form
      setIsModalOpen(false);
      setCaption("");
      setAuthorName("");
      setFileBase64(null);
      setType("image");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "gallery_items");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "gallery_items", id));
      setConfirmDeleteId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "gallery_items");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="max-w-xl">
          <h2 className="serif text-4xl md:text-5xl font-medium mb-4 text-text-dark">Souvenirs partagés</h2>
          <p className="text-text-mid">
            Contribuez à cet espace de mémoire en partageant vos photos et vidéos d'André. 
            Chaque souvenir est une lumière qui continue de briller.
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-3 px-8 py-4 bg-olive text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-olive/90 transition-all shadow-lg shadow-olive/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Ajouter un souvenir
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-beige-light/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-beige-dark/30"
              >
                <div className="relative aspect-square overflow-hidden bg-beige-light">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.caption || "Souvenir"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  
                  {/* Creator/Admin Delete Button */}
                  {(myPostIds.includes(item.id) || isAdmin) && (
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                      <AnimatePresence mode="wait">
                        {confirmDeleteId === item.id ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-2"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(null);
                              }}
                              className="px-3 py-1 bg-white/90 backdrop-blur-md text-text-dark text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:bg-white transition-all"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              disabled={deletingId === item.id}
                              className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                              {deletingId === item.id ? "..." : "Confirmer"}
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="trash"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(item.id);
                            }}
                            className="w-10 h-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                            title="Supprimer mon souvenir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-sm">
                    {item.type === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  {item.caption ? (
                    <p className="text-sm italic text-text-dark mb-4 line-clamp-3 serif leading-relaxed">
                      "{item.caption}"
                    </p>
                  ) : (
                    <div className="flex-grow" />
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-beige-dark/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-text-mid">
                      <User className="w-3 h-3" />
                      <span>Par {item.authorName}</span>
                    </div>
                    <span className="text-[9px] text-text-mid/60 font-medium">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-beige-dark/50 rounded-3xl">
              <Sparkles className="w-12 h-12 text-olive/20 mx-auto mb-4" />
              <p className="text-text-mid serif italic">Aucun souvenir partagé pour le moment. Soyez le premier à contribuer.</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-warm-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-beige-dark/30 flex items-center justify-between shrink-0">
                <h3 className="serif text-2xl font-medium text-text-dark">Partager un souvenir</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-mid hover:text-text-dark transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setType("image")}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest ${
                      type === "image" ? "border-olive bg-olive/5 text-olive" : "border-beige-dark text-text-mid hover:border-text-mid"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("video")}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest ${
                      type === "video" ? "border-olive bg-olive/5 text-olive" : "border-beige-dark text-text-mid hover:border-text-mid"
                    }`}
                  >
                    <Video className="w-4 h-4" /> Vidéo
                  </button>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    fileBase64 ? "border-olive bg-olive/5" : "border-beige-dark hover:border-olive/50 hover:bg-beige-light/30"
                  }`}
                >
                  {fileBase64 ? (
                    type === "image" ? (
                      <img src={fileBase64} className="w-full h-full object-contain p-2" alt="Preview" />
                    ) : (
                      <video src={fileBase64} className="w-full h-full object-contain p-2" />
                    )
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-olive/30 mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest text-text-mid">Cliquez pour choisir un fichier</p>
                      <p className="text-[10px] text-text-mid/60 mt-2">Max 1 Mo</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept={type === "image" ? "image/*" : "video/*"} 
                    className="hidden" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-mid mb-2">Votre Nom</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-white border border-beige-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all text-sm"
                    placeholder="Votre nom ou pseudonyme"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-mid mb-2">Légende (Optionnel)</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-beige-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all resize-none text-sm"
                    placeholder="Un petit mot sur ce souvenir..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!fileBase64 || isUploading}
                  className="w-full bg-olive text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-olive/90 transition-all shadow-lg shadow-olive/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Envoi en cours..." : "Publier le souvenir"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
