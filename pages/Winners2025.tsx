
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, CheckCircle2, ArrowDown, 
  Quote, Star, X, Maximize2
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

// Lightbox Component
const Lightbox: React.FC<{ src: string | null, onClose: () => void }> = ({ src, onClose }) => {
  if (!src) return null;
  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-10 cursor-zoom-out"
        onClick={onClose}
      >
        <motion.button 
          className="absolute top-8 right-8 text-white hover:text-nova-red transition-colors z-[10000]"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <X size={40} />
        </motion.button>
        <motion.img 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          src={src} 
          alt="Visualisation"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const Winners2025: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const stats = [
    { label: "Binômes inscrits", value: "67" },
    { label: "Projets qualifiés", value: "33" },
    { label: "Finalistes retenus", value: "10" },
    { label: "Lauréats distingués", value: "03" },
    { label: "Formation intensive", value: "3 Jours" }
  ];

  const winners = [
    {
      rank: "🥇 PREMIER PRIX — LE LAURÉAT SUPRÊME",
      amount: "150 000 FCFA",
      names: "BOKO Béoula & NTCHA Siméon",
      school: "ENSET Lokossa – Fabrication Mécanique 1ère année",
      project: "Motopompe Diesel Intelligente pour l'Irrigation Rurale",
      src: "https://i.postimg.cc/rsmKM3fW/les_premieers_du_tnc.jpg",
      desc: "Véritable prouesse d'ingénierie mécanique et de contrôle, ce projet consiste en la réinvention de la motopompe diesel classique par l'intégration d'un système intelligent de régulation automatique du débit. Conçue pour répondre aux défis critiques des zones agricoles sans accès au réseau électrique.",
      impacts: [
        "Réduction de 30% de la consommation de carburant",
        "Autonomie technologique accrue",
        "Optimisation automatisée des débits",
        "Maintenance simplifiée pour milieu rural"
      ],
      quote: "L'ingénierie n'a de sens que lorsqu'elle sert le progrès humain. Notre but était de redonner de l'autonomie à ceux qui nourrissent notre nation."
    },
    {
      rank: "🥈 DEUXIÈME PRIX",
      amount: "100 000 FCFA",
      names: "ISSAKA Awa & FOLARIN Mourchid",
      school: "INSTI LOKOSSA – Froid & Informatique",
      project: "Système de Conservation Thermique Agroalimentaire",
      src: "https://i.postimg.cc/B67YzCxK/laur-ats-2-eme.jpg",
      desc: "Une solution thermodynamique d'avant-garde exploitant des matériaux à changement de phase pour stabiliser la température de conservation des denrées périssables. Réponse éco-énergétique au fléau du gaspillage alimentaire post-récolte.",
      impacts: [
        "Prolongation de la durée de vie des denrées",
        "Maintien passif de la chaîne du froid",
        "Valorisation économique des productions",
        "Conception éco-responsable"
      ],
      quote: "Innover, c'est d'abord protéger le travail de nos agriculteurs. Nous avons voulu leur offrir le temps nécessaire pour valoriser dignement leur production."
    },
    {
      rank: "🥉 TROISIÈME PRIX",
      amount: "50 000 FCFA",
      names: "ROUFAI Aïssatou & ZANVO Prince Horeb",
      school: "ENSET Lokossa – Froid & Climatisation 1ère année",
      project: "ELEVATE — Plateforme d'Orientation Digitale",
      src: "https://i.postimg.cc/fyLJDp8c/laur-ats-3eme.jpg",
      desc: "ELEVATE est un écosystème numérique centralisant les opportunités académiques, les bourses d'études et les programmes de mentorat. Un outil de transformation sociale conçu pour briser les barrières de l'information.",
      impacts: [
        "Démocratisation de l'accès aux bourses",
        "Réduction du décrochage scolaire",
        "Mise en réseau avec des mentors industriels",
        "Centralisation des ressources éducatives"
      ],
      quote: "Chaque talent mérite d'avoir une boussole. ELEVATE est là pour s'assurer qu'aucun jeune brillant ne s'égare faute d'information."
    }
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-nova-violet selection:text-white overflow-x-hidden">
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
      
      {/* SECTION 1: HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img 
            src="https://i.postimg.cc/X7vxZvrR/vue_d_ensemble_a_scop.jpg" 
            alt="Palmarès 2025" 
            className="w-full h-full object-cover"
          />
          {/* Filtre noir de 60% pour lisibilité absolue */}
          <div className="absolute inset-0 bg-black/60 z-10" />
        </motion.div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="editorial-title text-[clamp(2.2rem,8vw,8rem)] text-white leading-[0.85] mb-8 md:mb-12">
             L'HÉRITAGE DES <br />
              <span className="text-nova-violet italic font-light uppercase">PIONNIERS 2025.</span>
            </h1>
            <p className="text-lg md:text-3xl text-white font-light max-w-4xl mx-auto leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,1)] font-serif italic">
              Célébration des talents audacieux qui ont redéfini les frontières de l'innovation lors de notre édition inaugurale.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 z-20"
        >
           <ArrowDown size={32} />
        </motion.div>
      </section>

      {/* SECTION 2: CHIFFRES CLÉS */}
      <section className="py-20 md:py-48 px-6 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-8 md:mb-12 text-nova-black leading-none">
                UNE ÉDITION <br className="hidden md:block" />INSPIRANTE, <br /><span className="text-nova-violet italic font-light uppercase">UNE VISION CONCRÈTE.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed mb-8 md:mb-12 italic font-serif">
                "Près de 70 binômes ont porté avec fierté l'innovation béninoise, prouvant que le génie technique est le moteur de notre souveraineté future."
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 p-6 md:p-10 bg-gray-50 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src="https://i.postimg.cc/02J6zzfD/WISSAM-INGCO.jpg" alt="WISSAM INGCO" className="h-12 md:h-16 w-auto object-contain rounded-lg shadow-sm" />
                  <img src="https://i.postimg.cc/6qhn75My/ingco_logo_png.png" alt="INGCO" className="h-10 md:h-14 w-auto object-contain" />
                </div>
                <div>
                   <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Partenaire Officiel 2025</div>
                   <div className="text-lg md:text-2xl font-black text-nova-black uppercase">WISANE (INGCO)</div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {stats.map((s, i) => (
                <div key={i} className="p-6 md:p-14 bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[3.5rem] hover:shadow-2xl hover:border-nova-violet/20 transition-all duration-700 group">
                   <div className="text-2xl md:text-5xl font-black text-nova-violet mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-500">{s.value}</div>
                   <div className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 leading-relaxed">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PODIUM */}
      <section className="py-20 md:py-48 px-4 md:px-6 bg-gray-50/50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <header className="text-center mb-16 md:mb-32">
            <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[9px] md:text-[10px] block mb-6 text-center">Le Panthéon de l'Innovation</span>
            <h2 className="text-3xl md:text-8xl font-black uppercase tracking-tighter text-nova-black text-center leading-none">🏆 LAURÉATS 2025</h2>
          </header>

          <div className="space-y-12 md:space-y-24">
            {winners.map((w, i) => (
              <GlassCard key={i} className={`p-4 md:p-20 relative overflow-hidden ${i === 0 ? 'ring-2 ring-nova-violet ring-offset-4 md:ring-offset-8 shadow-2xl' : ''}`}>
                
                {i === 0 && (
                  <div className="inline-block md:absolute md:top-12 md:right-12 px-6 py-2 md:px-8 md:py-3 bg-nova-violet text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full mb-6 md:mb-0 shadow-lg z-20 flex items-center gap-2">
                    <Star size={12} fill="currentColor" /> Premier Prix National
                  </div>
                )}

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-24 items-start relative z-10">
                  {/* Image part - Top on mobile */}
                  <div className="w-full lg:col-span-5 order-first lg:order-last">
                    <div 
                      className="relative aspect-video lg:aspect-square bg-white rounded-[1.5rem] md:rounded-[4rem] overflow-hidden group shadow-2xl border border-gray-100 cursor-pointer"
                      onClick={() => setSelectedImage(w.src)}
                    >
                       <img 
                        src={w.src} 
                        alt={w.names}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-nova-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-nova-black shadow-xl">
                            <Maximize2 size={18} />
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Content part */}
                  <div className="lg:col-span-7">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 mb-6 md:mb-12">
                       <span className="text-nova-violet font-black tracking-[0.3em] uppercase text-[10px] md:text-xs whitespace-nowrap">{w.rank}</span>
                       <div className="hidden sm:block h-px flex-grow bg-gray-200" />
                       <span className="text-xl md:text-4xl font-black text-nova-black">{w.amount}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-6xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-tight text-nova-black">
                      {w.project}
                    </h3>
                    <div className="flex flex-col gap-1 md:gap-2 mb-6 md:mb-12">
                       <span className="text-nova-violet font-black text-xs md:text-base uppercase tracking-widest">{w.names}</span>
                       <span className="text-gray-400 font-light text-[10px] md:text-sm italic">{w.school}</span>
                    </div>
                    
                    <p className="text-base md:text-2xl text-gray-500 font-light leading-relaxed mb-6 md:mb-12">{w.desc}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
                       {w.impacts.map((impact, idx) => (
                         <div key={idx} className="flex items-start gap-2 md:gap-3 text-[10px] md:text-sm font-bold text-gray-600 leading-relaxed">
                           <CheckCircle2 size={14} className="text-nova-violet flex-shrink-0 mt-0.5 md:w-[18px] md:h-[18px]" />
                           <span>{impact}</span>
                         </div>
                       ))}
                    </div>

                    <div className="relative p-6 md:p-14 bg-nova-violet/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-nova-violet/10">
                       <Quote className="absolute top-4 left-4 md:top-10 md:left-10 text-nova-violet/20 w-6 h-6 md:w-8 md:h-8" />
                       <p className="text-sm md:text-2xl italic font-light text-nova-black relative z-10 pl-6 md:pl-12 leading-relaxed font-serif">
                         "{w.quote}"
                       </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="py-24 md:py-64 bg-gray-50 px-6 text-center relative overflow-hidden">
         <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="editorial-title text-[clamp(2rem,10vw,8rem)] text-nova-black mb-8 md:mb-16 leading-[0.85] !drop-shadow-none">
               DÉPASSEZ VOS <br />
               <span className="text-nova-violet italic font-light uppercase">LIMITES EN 2026.</span>
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
               <Button size="lg" className="w-full md:w-auto" onClick={() => navigate('/participate')}>POSTULER MAINTENANT</Button>
               <Button variant="outline" size="lg" className="w-full md:w-auto" onClick={() => navigate('/deroulement')}>VOIR LE PROGRAMME</Button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Winners2025;