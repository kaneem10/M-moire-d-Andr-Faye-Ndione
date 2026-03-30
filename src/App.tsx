/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Quote, 
  ImageIcon, 
  MessageSquare, 
  ChevronDown,
  Flower2,
  Sparkles,
  Menu,
  X as CloseIcon
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Local assets for slideshow
import photo1 from "./assets/photo1.jpg";
import photo2 from "./assets/photo2.jpg";
import photo3 from "./assets/photo3.jpg";
import photo4 from "./assets/photo4.jpg";
import photo5 from "./assets/photo5.jpg";

// Components
import BiographySection from "./components/BiographySection";
import CandleSection from "./components/CandleSection";
import PrayerSection from "./components/PrayerSection";
import ObituarySection from "./components/ObituarySection";
import FuneralSection from "./components/FuneralSection";
import GallerySection from "./components/GallerySection";
import TributesSection from "./components/TributesSection";
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsAppShare from "./components/WhatsAppShare";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = [
    { src: photo2, position: "center 15%" },
    { src: photo1, position: "center 20%" },
    { src: photo3, position: "center 10%" },
    { src: photo4, position: "center 15%" },
    { src: photo5, position: "center 20%" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-warm-white selection:bg-beige-dark">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-white/90 backdrop-blur-md border-b border-beige-dark/20">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between relative">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-text-dark p-2 -ml-2"
              aria-label="Menu"
            >
              {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo - Centered on mobile, left on desktop */}
            <span 
              role="button"
              tabIndex={0}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const now = Date.now();
                const clicks = (window as any)._adminClicks || [];
                const recentClicks = clicks.filter((t: number) => now - t < 2000);
                recentClicks.push(now);
                (window as any)._adminClicks = recentClicks;
                if (recentClicks.length >= 5) {
                  localStorage.setItem("afn_admin", "true");
                  alert("Mode administrateur activé. Vous pouvez maintenant supprimer n'importe quel souvenir.");
                  window.location.reload();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="serif text-2xl font-medium tracking-[0.2em] text-text-dark absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 cursor-pointer select-none outline-none"
            >
              AFN
            </span>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <div className="flex gap-10 text-[11px] uppercase tracking-[0.25em] font-semibold text-text-mid">
                <a href="#avis" className="hover:text-olive transition-colors">Avis</a>
                <a href="#biographie" className="hover:text-olive transition-colors">Biographie</a>
                <a href="#funerailles" className="hover:text-olive transition-colors">Obsèques</a>
                <a href="#gallery" className="hover:text-olive transition-colors">Galerie</a>
                <a href="#tributes" className="hover:text-olive transition-colors">Hommages</a>
                <a href="#priere" className="hover:text-olive transition-colors">Prière</a>
                <a href="#bougies" className="hover:text-olive transition-colors">Bougies</a>
              </div>
            </div>

            {/* Placeholder for desktop alignment */}
            <div className="md:hidden w-6 h-6" />
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden bg-warm-white border-b border-beige-dark/20 overflow-hidden"
              >
                <div className="flex flex-col items-center py-8 gap-6 text-[12px] uppercase tracking-[0.3em] font-bold text-text-mid">
                  <a href="#avis" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Avis</a>
                  <a href="#biographie" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Biographie</a>
                  <a href="#funerailles" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Obsèques</a>
                  <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Galerie</a>
                  <a href="#tributes" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Hommages</a>
                  <a href="#priere" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Prière</a>
                  <a href="#bougies" onClick={() => setIsMenuOpen(false)} className="hover:text-olive transition-colors">Bougies</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-foreground">
          {/* Background Slideshow */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhotoIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.4, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={photos[currentPhotoIndex].src} 
                  alt="André Faye Ndione" 
                  className="w-full h-full object-cover"
                  style={{ objectPosition: photos[currentPhotoIndex].position }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-transparent to-foreground/60" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="z-10 text-warm-white"
          >
            <span className="inline-block mb-4 text-warm-white/60 uppercase tracking-[0.3em] text-xs font-semibold">En mémoire de</span>
            <h1 className="serif text-6xl md:text-8xl lg:text-9xl font-light mb-6 tracking-tight leading-none text-warm-white">
              André Faye Ndione
            </h1>
            <div className="flex items-center justify-center gap-4 text-warm-white/60 serif italic text-xl md:text-2xl">
              <span>23 Décembre 1973</span>
              <span className="w-8 h-px bg-warm-white/30"></span>
              <span>26 Mars 2026</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          >
            <ChevronDown className="w-6 h-6 text-warm-white/60 animate-bounce" />
          </motion.div>
        </section>

        {/* Obituary Notice */}
        <ObituarySection />

        {/* Biography Section */}
        <BiographySection />

        {/* Funeral Section */}
        <FuneralSection />

        {/* Gallery Section - Interactive */}
        <GallerySection />

        {/* Tributes Section - Interactive */}
        <TributesSection />

        {/* Quote Section */}
        <section className="bg-foreground text-warm-white py-24 md:py-32 overflow-hidden relative">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Quote className="w-12 h-12 mx-auto mb-12 text-olive opacity-50" />
            <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="serif text-3xl md:text-5xl font-light italic leading-snug mb-12"
            >
              "La mort n'est pas l'obscurité, c'est seulement la lampe qui s'éteint parce que le jour se lève."
            </motion.p>
            <span className="text-text-mid uppercase tracking-[0.4em] text-xs font-semibold">— Pensée de recueillement</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-olive rounded-full blur-[150px]"></div>
          </div>
        </section>

        {/* Prayer Section */}
        <PrayerSection />

        {/* Candle Section */}
        <CandleSection />

        {/* WhatsApp Share Button */}
        <WhatsAppShare />

        {/* Footer */}
        <footer className="bg-warm-white border-t border-beige-dark py-16 text-center">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="serif text-3xl font-medium mb-8">André Faye Ndione</h2>
            <div className="flex justify-center gap-8 mb-12">
              <a href="#" className="text-text-mid hover:text-olive transition-colors"><Heart className="w-5 h-5" /></a>
              <a href="#" className="text-text-mid hover:text-olive transition-colors"><ImageIcon className="w-5 h-5" /></a>
              <a href="#" className="text-text-mid hover:text-olive transition-colors"><MessageSquare className="w-5 h-5" /></a>
            </div>
            <p className="text-text-mid text-sm uppercase tracking-widest">
              &copy; {new Date().getFullYear()} — Mémorial dédié avec amour
            </p>
            <div className="mt-6 flex flex-col items-center gap-1">
              <p className="text-text-mid/40 text-[9px] uppercase tracking-[0.2em] font-medium">
                Réalisé par
              </p>
              <p className="font-signature text-5xl text-olive/80 mt-2 -rotate-[4deg] -skew-x-3 drop-shadow-[1px_1px_1px_rgba(90,90,64,0.15)] select-none signature-ink">
                Moustapha
              </p>
            </div>
          </div>
        </footer>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e6e2d3;
            border-radius: 10px;
          }
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
