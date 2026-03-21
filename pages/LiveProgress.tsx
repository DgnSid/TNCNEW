
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, CheckCircle2, Clock, Sparkles, Maximize2, X, ExternalLink, Trophy, Facebook, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLivePhases } from '../lib/adminData';

const Lightbox: React.FC<{ src: string | null, onClose: () => void }> = ({ src, onClose }) => {
  if (!src) return null;
  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
        onClick={onClose}
      >
        <motion.button className="absolute top-8 right-8 text-white z-[10000]" onClick={onClose}><X size={40} /></motion.button>
        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={src} className="max-w-full max-h-full object-contain rounded-lg" />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const initialPhases = [
  { number: 1, title: "Recrutement exclusif de la nouvelle équipe TNC 2026", description: "Constitution d'une équipe d'élite dédiée à l'excellence technologique et au rayonnement du génie béninois.", image: "https://i.postimg.cc/hvQ5F8q2/phase_1.jpg", status: "completed" },
  { number: 2, title: "Rencontre du nouveau bureau à Lokossa", description: "Premier séminaire stratégique pour définir les jalons opérationnels et les piliers de cette nouvelle édition mémorable.", image: "https://i.postimg.cc/L5gbdkMc/phase_2.jpg", status: "completed" },
  { number: 3, title: "Annonce officielle de l'événement", description: "Lancement de la communication institutionnelle et révélation de la vision 2026 auprès de l'écosystème tech national.", image: "https://i.postimg.cc/rsRP6GLn/phase_3.jpg", status: "completed" },
  { number: 4, title: "Appel à candidature et à la participation", description: "Ouverture du portail pour les visionnaires de toute la nation. Le moment de soumettre vos projets disruptifs est arrivé.", image: "https://i.postimg.cc/xTRdJLmb/annonce-de-tnc-candidature.jpg", status: "active" },
];

const LiveProgress: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [phases, setPhases] = useState(initialPhases);

  useEffect(() => {
    const loadPhases = async () => {
      const dynamic = await getLivePhases();
      const final = [...initialPhases, ...dynamic, { number: 0, title: "À suivre...", description: "La consécration ultime se prépare. Restez connectés.", image: "https://i.postimg.cc/kGGyhQHK/COUPE_OU_TROPHEE.jpg", status: "upcoming" }];
      setPhases(final);
    };
    void loadPhases();
    const interval = setInterval(() => {
      void loadPhases();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen pb-32">
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
      
      <section className="relative h-screen w-full flex items-center justify-center bg-black px-6">
        <img src="https://i.postimg.cc/jjpbDjSK/live.jpg" className="absolute inset-0 w-full h-full object-cover brightness-[0.5]" />
        <div className="relative z-10 text-center">
            <span className="text-nova-violet font-black tracking-[0.6em] uppercase text-[10px] block mb-8">Journal de Bord Officiel</span>
            <h1 className="editorial-title text-[clamp(2.5rem,8vw,10rem)] text-white leading-[0.85] mb-8">ÉTAPES EN <br /><span className="text-nova-violet italic font-light">DIRECT.</span></h1>
        </div>
      </section>

      <section className="py-24 md:py-48 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl space-y-32">
            {phases.map((phase, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className={`grid lg:grid-cols-12 gap-12 items-center ${phase.status === 'upcoming' ? 'opacity-50' : ''}`}>
                <div className={`lg:col-span-5 ${i % 2 === 0 ? 'lg:text-right' : 'lg:order-last'}`}>
                   <h2 className="text-3xl md:text-5xl font-black uppercase text-nova-black mb-8 leading-tight">{phase.title}</h2>
                   <p className="text-lg text-gray-500 font-light italic font-serif">{phase.description}</p>
                </div>
                <div className="hidden lg:col-span-2 lg:flex justify-center">
                   <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-black bg-white text-nova-violet">{i+1}</div>
                </div>
                <div className="lg:col-span-5 cursor-zoom-in" onClick={() => setSelectedImage(phase.image)}>
                   <img src={phase.image} className="aspect-video md:aspect-square rounded-[3rem] object-cover shadow-2xl" />
                </div>
              </motion.div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default LiveProgress;