
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Zap, ArrowDown, X, Maximize2, Building, GraduationCap, 
  Trophy, Users, Globe, Rocket, Sparkles, ChevronRight, CheckCircle2,
  Lightbulb, BookOpen, Heart, Briefcase, Award, Eye, Quote
} from 'lucide-react';
import Button from '../components/Button';

// Composant de révélation de texte cinématique
const ElegantReveal: React.FC<{ text: string, delay?: number, className?: string }> = ({ text, delay = 0, className = "" }) => {
  const words = text.split(" ");
  return (
    <h1 className={`${className} flex flex-wrap justify-center text-center`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap mx-[0.1em] md:mx-[0.15em] mb-[0.1em]">
          {word.split("").map((char, charIdx) => (
            <span key={charIdx} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ 
                  duration: 0.7, 
                  delay: delay + (wordIdx * 0.08) + (charIdx * 0.02), 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
};

const MuseumBlock: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
};

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
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          src={src} 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

const ParallaxGallery: React.FC<{ onImageClick: (src: string) => void }> = ({ onImageClick }) => {
  const images = [
    { src: "https://i.postimg.cc/VNY36Mt9/formation.jpg", label: "Formation Intensive" },
    { src: "https://i.postimg.cc/wvzcHcs3/visite_scop1.jpg", label: "Immersion Sèmè City" },
    { src: "https://i.postimg.cc/rsCF2DXX/finale_pr-selection.jpg", label: "Pitchs des Finalistes" },
    { src: "https://i.postimg.cc/cLr4DPHR/wisane_a_la_finale.jpg", label: "Échange Experts" },
    { src: "https://i.postimg.cc/d1VNnfZx/les_troph-es.jpg", label: "Consécration 2025" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 h-auto md:h-[600px]">
      {images.map((img, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: i * 0.1 }}
          className="relative h-[400px] md:h-full overflow-hidden rounded-[2rem] md:rounded-[3rem] group cursor-pointer"
          onClick={() => onImageClick(img.src)}
        >
          <motion.img 
            src={img.src} 
            className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          <div className="absolute bottom-8 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white bg-nova-black/60 px-4 py-2 rounded-full backdrop-blur-md">
              {img.label}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-nova-black shadow-xl">
                <Maximize2 size={20} />
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  const partnerLogos = [
    "https://i.postimg.cc/02J6zzfD/WISSAM-INGCO.jpg",
    "https://i.postimg.cc/6qhn75My/ingco_logo_png.png"
  ];

  return (
    <div ref={mainRef} className="relative w-full bg-white selection:bg-nova-violet selection:text-white overflow-x-hidden">
      
      <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />

      {/* SECTION 1 : HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black px-6 py-32">
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://i.postimg.cc/tgyMnJq1/belle_vue_d_ensemble_des_lauréats_avec_le_dg.jpg"
            className="w-full h-full object-cover saturate-[1.1] brightness-[0.4]"
          />
        </motion.div>

        <div className="absolute inset-0 grid-blueprint z-[2]" />
        
        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="space-y-12">
            <ElegantReveal 
              text="ET C'EST REPARTI POUR TECH NOVA CHALLENGE" 
              className="text-white text-xs md:text-sm font-black tracking-[0.8em] uppercase mb-4 opacity-70"
            />
            <ElegantReveal 
              text="L'INNOVATION EN MOUVEMENT" 
              className="editorial-title"
            />
            
            <MuseumBlock delay={0.8}>
              <p className="text-xl md:text-3xl text-white font-medium tracking-tight max-w-4xl mx-auto font-serif italic px-4 leading-relaxed">
                Premier concours de référence pour l'innovation technologique des jeunes au Bénin.
              </p>
            </MuseumBlock>

            <MuseumBlock delay={1}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
                <Button size="lg" variant="accent" onClick={() => navigate('/connexion')}>Se connecter</Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/deroulement')} className="!border-white/40 !text-white hover:!bg-white hover:!text-black backdrop-blur-md">DÉROULEMENT</Button>
              </div>
            </MuseumBlock>
          </div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 text-white/20"><ArrowDown size={32} /></motion.div>
      </section>

      {/* SECTION 2 : LE NOUVEAU CHAPITRE */}
      <section className="py-32 md:py-64 px-6 bg-white relative">
        <div className="container mx-auto max-w-5xl">
          <MuseumBlock>
            <div className="flex items-center gap-6 mb-12">
              <div className="h-px w-24 bg-nova-violet" />
              <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px]">Le Nouveau Chapitre</span>
            </div>
            <p className="text-2xl md:text-5xl text-nova-black font-light leading-snug tracking-tighter mb-16">
              Pour cette édition 2026, le plus grand concours d'innovation Tech, <span className="text-nova-violet font-black uppercase">TECH NOVA CHALLENGE</span>, s'ouvre à tout le Bénin. 
            </p>
            <div className="prose prose-2xl max-w-none text-gray-500 font-light leading-relaxed font-serif italic space-y-8">
              <p>
                Ce rendez-vous incontournable de l’ingéniosité étudiante élargit son horizon et invite toutes les universités et écoles techniques du pays à participer à cette aventure collective. Mais avant tout, clarifions les concepts qui fondent cette compétition unique en son genre.
              </p>
            </div>
          </MuseumBlock>
        </div>
        
        {/* IMAGE DE TRANSITION 1 */}
        <div className="container mx-auto max-w-7xl px-6 mt-32">
           <MuseumBlock>
              <div className="relative aspect-[21/9] rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setSelectedImage("https://i.postimg.cc/BbqfDNyL/equipe_tnc_3.jpg")}>
                 <img src="https://i.postimg.cc/BbqfDNyL/equipe_tnc_3.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Equipe TNC" />
                 <div className="absolute inset-0 bg-nova-black/10 group-hover:bg-transparent transition-colors" />
                 <div className="absolute bottom-10 left-10 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-2">Coordination</span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">L'Esprit Nova en Action.</h3>
                 </div>
              </div>
           </MuseumBlock>
        </div>
      </section>

      {/* SECTION 3 : C'EST QUOI LE TNC ? */}
      <section className="py-32 bg-nova-black text-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <MuseumBlock>
                <h2 className="editorial-title text-4xl md:text-7xl !text-white leading-none mb-12">C'EST QUOI LE <br /><span className="text-nova-violet italic font-light">TECH NOVA CHALLENGE ?</span></h2>
                <div className="space-y-8 text-lg md:text-xl text-white/60 font-light leading-relaxed">
                   <p>
                      Le <span className="text-white font-black">TECH NOVA CHALLENGE</span> est une compétition innovante conçue pour promouvoir les talents, l’innovation et la créativité parmi les jeunes ayant suivi une formation technique ou professionnelle dans les domaines des sciences et techniques. 
                   </p>
                   <p>
                      Il s'agit d'une première au Bénin, offrant une plateforme inédite pour encourager et célébrer l’ingéniosité des jeunes esprits. Le nom même de l’événement résume son ambition :
                   </p>
                </div>
             </MuseumBlock>
             <div className="space-y-6">
                {[
                  { t: "TECH", d: "Pour la technologie.", c: "bg-nova-violet" },
                  { t: "NOVA", d: "Pour la nouveauté et l’éclat des idées.", c: "bg-white text-nova-black" },
                  { t: "CHALLENGE", d: "Pour l’esprit de défi et de compétition.", c: "border border-white/20" }
                ].map((item, i) => (
                  <MuseumBlock key={i} delay={i * 0.1}>
                    <div className={`p-10 rounded-[2.5rem] ${item.c} flex items-center justify-between group cursor-default hover:scale-105 transition-all duration-500`}>
                       <div>
                          <h4 className="text-3xl font-black mb-2">{item.t}</h4>
                          <p className="text-xs uppercase font-black tracking-widest opacity-60">{item.d}</p>
                       </div>
                       <ChevronRight size={32} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </MuseumBlock>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 : BUT & VISION */}
      <section className="py-32 md:py-64 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-32">
             <MuseumBlock>
                <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px] block mb-8">Vision Stratégique</span>
                <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-nova-black leading-none mb-12">
                   LE BUT DU <br /><span className="text-nova-violet italic font-light">CHALLENGE.</span>
                </h2>
                <p className="text-xl md:text-3xl text-gray-500 font-light max-w-4xl mx-auto leading-relaxed font-serif italic">
                   "Promouvoir l’esprit d’équipe, l’innovation technologique et l’excellence dans le domaine des sciences et techniques industrielles."
                </p>
             </MuseumBlock>
          </div>

          {/* IMAGE DE TRANSITION 2 */}
          <div className="container mx-auto max-w-7xl mb-32">
             <MuseumBlock>
                <div className="relative aspect-[21/9] rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setSelectedImage("https://i.postimg.cc/bwMWB6L0/travaille_équipe.png")}>
                   <img src="https://i.postimg.cc/bwMWB6L0/travaille_équipe.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Travail en équipe" />
                   <div className="absolute inset-0 bg-nova-black/10 group-hover:bg-transparent transition-colors" />
                   <div className="absolute bottom-10 right-10 text-white text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-2">Collaboration</span>
                      <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">L'Innovation Collective.</h3>
                   </div>
                </div>
             </MuseumBlock>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <MuseumBlock className="lg:col-span-1">
                <div className="p-12 bg-nova-violet text-white rounded-[3.5rem] h-full flex flex-col justify-between">
                   <Target size={48} className="mb-12" />
                   <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Nos Objectifs pour 2026</h3>
                   <p className="text-white/60 font-medium leading-relaxed">Nous envisageons de poursuivre et d’amplifier les objectifs qui ont fait le succès de la première édition.</p>
                </div>
             </MuseumBlock>
             {[
               { t: "Encourager l’innovation", d: "Stimuler la créativité des jeunes et leur offrir une tribune.", i: <Lightbulb /> },
               { t: "Apprentissage & Collaboration", d: "Créer un environnement d’échange et de formation gratuite.", i: <BookOpen /> },
               { t: "Reconnaître les talents", d: "Récompenser l’ingéniosité des meilleurs binômes.", i: <Award /> },
               { t: "Promouvoir l’entrepreneuriat", d: "Accompagner la transformation des idées en projets viables.", i: <Briefcase /> },
               { t: "Compétences Techniques", d: "Offrir des formations complémentaires pour exceller.", i: <Zap /> }
             ].map((obj, i) => (
               <MuseumBlock key={i} delay={i * 0.1}>
                  <div className="p-10 bg-white border border-gray-100 rounded-[3rem] h-full hover:shadow-2xl transition-all duration-700 group">
                     <div className="w-14 h-14 bg-nova-gray/5 rounded-2xl flex items-center justify-center text-nova-violet mb-8 group-hover:bg-nova-violet group-hover:text-white transition-colors">
                        {obj.i}
                     </div>
                     <h4 className="text-lg font-black uppercase mb-4 tracking-tighter">{obj.t}</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">{obj.d}</p>
                  </div>
               </MuseumBlock>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 : GOUVERNANCE & SOUTIEN */}
      <section className="py-32 md:py-64 bg-nova-gray/5">
        <div className="container mx-auto max-w-6xl px-6">
           <div className="text-center mb-24 max-w-4xl mx-auto">
              <MuseumBlock>
                 <span className="text-nova-red font-black tracking-[0.5em] uppercase text-[10px] block mb-8">Parrainage Institutionnel</span>
                 <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-nova-black mb-12">
                    L'APPUI DE <span className="text-nova-red italic font-light uppercase">L'ÉLITE ACADÉMIQUE.</span>
                  </h2>
                  <div className="space-y-8 text-lg md:text-xl text-gray-500 font-light leading-relaxed font-serif text-center">
                     <p>
                        TECH NOVA CHALLENGE est grandement soutenu par de très grandes écoles et universités techniques du Bénin. En effet, pour l’édition 2025 – la première édition – TECH NOVA CHALLENGE a bénéficié du parrainage officiel du <span className="text-nova-black font-black uppercase">Professeur Titulaire Gustave DJEDATIN</span>, Directeur de l’École Nationale Supérieure d’Enseignement Technique (ENSET), et de la <span className="text-nova-black font-black uppercase">Professeur Titulaire Clotilde GUIDI TOGNON</span>, Directrice de l’Institut National Supérieur de Technologie Industrielle (INSTI).
                     </p>
                     <p>
                        Leur implication institutionnelle et personnelle a donné un rayonnement exceptionnel à ce projet étudiant. De plus, le concours a reçu le soutien indéfectible de la société de vente d’équipements techniques <span className="text-nova-red font-black uppercase">WISSAM (INGCO)</span>, partenaire officiel de l’événement. Loin d’être de simples sponsors, ces acteurs ont prouvé à quel point investir dans les jeunes, c’est investir dans l’avenir ; à quel point cette compétition constitue un atout majeur pour le développement technologique, l’employabilité et l’émergence d’une culture de l’innovation chez les étudiants béninois.
                     </p>
                  </div>
              </MuseumBlock>
           </div>

           <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* DIRECTEUR ENSET */}
              <MuseumBlock delay={0.1}>
                 <div className="bg-white rounded-[4rem] overflow-hidden shadow-xl border border-black/5 flex flex-col group h-full">
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedImage("https://i.postimg.cc/d1NHf98c/le_directeur_de_l_enset_a_la_phase_finale_prise_de_parole.jpg")}>
                       <img src="https://i.postimg.cc/d1NHf98c/le_directeur_de_l_enset_a_la_phase_finale_prise_de_parole.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Professeur Gustave DJEDATIN" />
                       <div className="absolute inset-0 bg-nova-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="p-12 space-y-8 flex-grow">
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">Prof. Gustave DJEDATIN</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-nova-red">Directeur de l'ENSET Lokossa</p>
                       </div>
                       <div className="relative p-10 bg-nova-gray/5 rounded-[2.5rem] border border-black/5 italic font-serif text-lg leading-relaxed text-gray-500">
                          <Quote className="absolute top-4 left-4 text-nova-red/10 w-12 h-12" />
                          <p className="relative z-10">"Le Tech Nova Challenge est le creuset où la théorie rencontre la réalité industrielle pour transformer le destin de nos jeunes."</p>
                       </div>
                    </div>
                 </div>
              </MuseumBlock>

              {/* DIRECTRICE INSTI */}
              <MuseumBlock delay={0.2}>
                 <div className="bg-white rounded-[4rem] overflow-hidden shadow-xl border border-black/5 flex flex-col group h-full">
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedImage("https://i.postimg.cc/PJL3n842/beau_moment_de_la_finale_la_directrice_de_l_insti.jpg")}>
                       <img src="https://i.postimg.cc/PJL3n842/beau_moment_de_la_finale_la_directrice_de_l_insti.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Professeure Clotilde GUIDI TOGNON" />
                       <div className="absolute inset-0 bg-nova-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="p-12 space-y-8 flex-grow">
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">Prof. Clotilde GUIDI TOGNON</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-nova-red">Directrice de l'INSTI Lokossa</p>
                       </div>
                       <div className="relative p-10 bg-nova-gray/5 rounded-[2.5rem] border border-black/5 italic font-serif text-lg leading-relaxed text-gray-500">
                          <Quote className="absolute top-4 left-4 text-nova-red/10 w-12 h-12" />
                          <p className="relative z-10">"Investir dans l'ingéniosité de nos étudiants, c'est poser les jalons d'une souveraineté technologique durable."</p>
                       </div>
                    </div>
                 </div>
              </MuseumBlock>
           </div>

           <div className="mt-24 bg-white p-12 rounded-[4rem] shadow-xl border border-black/5 text-center">
              <MuseumBlock>
                 <div className="flex flex-wrap items-center justify-center gap-12 md:gap-32">
                    <div className="flex items-center gap-6">
                       <div className="flex gap-4 items-center">
                         {partnerLogos.map((url, i) => (
                           <img key={i} src={url} className="h-16 w-auto object-contain rounded-xl shadow-sm border border-gray-100" alt="Partenaire" />
                         ))}
                       </div>
                       <div className="h-12 w-px bg-gray-100 ml-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">WISSAM (INGCO) — Partenaire Officiel</span>
                    </div>
                    <div className="flex -space-x-4">
                       <img src="https://i.postimg.cc/tgRf7YDZ/ENSET.png" className="w-14 h-14 rounded-full border-2 border-white bg-white p-1 shadow-sm" />
                       <img src="https://i.postimg.cc/s2f81vKG/INSTI_LOKOSSA.png" className="w-14 h-14 rounded-full border-2 border-white bg-white p-1 shadow-sm" />
                       <img src="https://i.postimg.cc/W49yZTf0/SCOP.png" className="w-14 h-14 rounded-full border-2 border-white bg-white p-1 shadow-sm" />
                    </div>
                 </div>
              </MuseumBlock>
           </div>

           {/* RETROSPECTIVE 2025 */}
           <div className="mt-40">
              <div className="text-center mb-16">
                 <span className="text-nova-violet font-black tracking-[0.4em] uppercase text-[9px] mb-4 block">Rétrospective 2025</span>
                 <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Moments Forts en Couleurs</h3>
                 <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-2">Cliquez sur une image pour l'agrandir</p>
              </div>
              <ParallaxGallery onImageClick={(src) => setSelectedImage(src)} />
           </div>
        </div>
      </section>

      {/* SECTION 6 : MISSION & VISION */}
      <section className="py-32 md:py-64 bg-white px-6">
         <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12">
               <MuseumBlock>
                  <div className="p-16 bg-nova-black text-white rounded-[4rem] h-full relative overflow-hidden group">
                     <div className="absolute top-10 right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <Rocket size={120} />
                     </div>
                     <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px] block mb-8">Mission</span>
                     <h3 className="text-4xl font-black uppercase mb-10 tracking-tighter leading-none">STIMULER LE POTENTIEL.</h3>
                     <p className="text-xl text-white/50 font-light leading-relaxed">
                        Offrir une plateforme pour présenter des projets techniques innovants en facilitant l’accès à la formation et au mentorat.
                     </p>
                  </div>
               </MuseumBlock>
               <MuseumBlock delay={0.2}>
                  <div className="p-16 bg-nova-violet text-white rounded-[4rem] h-full relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-10 right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Eye size={120} />
                     </div>
                     <span className="text-white/40 font-black tracking-[0.5em] uppercase text-[10px] block mb-8">Vision</span>
                     <h3 className="text-4xl font-black uppercase mb-10 tracking-tighter leading-none">RÉFÉRENCE NATIONALE.</h3>
                     <p className="text-xl text-white/80 font-light leading-relaxed">
                        Faire du TNC le catalyseur durable de l’innovation et un accélérateur de carrières pour la jeunesse béninoise.
                     </p>
                  </div>
               </MuseumBlock>
            </div>
         </div>
      </section>

      {/* SECTION 7 : PUBLIC CIBLE */}
      <section className="py-32 md:py-64 bg-nova-gray/5 px-6">
         <div className="container mx-auto max-w-5xl">
            <MuseumBlock className="text-center">
               <div className="inline-flex items-center gap-4 px-8 py-3 bg-white border border-gray-100 rounded-full mb-12 shadow-sm">
                  <Users className="text-nova-violet" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-nova-black">Public Cible & Critères</span>
               </div>
               <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-12 leading-none">QUI PEUT <br /><span className="text-nova-violet italic font-light">CANDIDATER ?</span></h2>
               <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-xl text-left space-y-12">
                  <p className="text-xl md:text-3xl font-light leading-relaxed text-gray-500 font-serif italic">
                     "Le TECH NOVA CHALLENGE s’adresse aux jeunes talents béninois <span className="text-nova-black font-black">âgés de 15 à 25 ans</span>, inscrits en cycle de licence dans n’importe quelle filière du Bénin."
                  </p>
                  <div className="grid sm:grid-cols-2 gap-8">
                     {[
                       "Constitution obligatoire de binômes passionnés.",
                       "Ouvert à toutes les filières universitaires.",
                       "Innovation technologique et faisabilité réelle.",
                       "Impact social et création de valeur démontrés."
                     ].map((check, i) => (
                       <div key={i} className="flex items-center gap-4 text-nova-black font-black uppercase text-[10px] tracking-widest">
                          <CheckCircle2 size={20} className="text-nova-violet flex-shrink-0" />
                          <span>{check}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </MuseumBlock>
         </div>
      </section>

      <footer className="py-24 text-center border-t border-black/5 bg-white">
         <p className="text-[10px] font-black tracking-[1em] md:tracking-[1.5em] text-nova-black/10 uppercase font-display px-4">
            © 2026 Tech Nova Challenge — Excellence, Innovation, Bénin.
         </p>
      </footer>
    </div>
  );
};

export default Home;