
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Star, Calendar, ArrowUpRight, History } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// Un composant pour des titres qui se décalent au scroll
interface ParallaxTextProps {
  children: React.ReactNode;
  baseVelocity?: number;
}

const ParallaxText: React.FC<ParallaxTextProps> = ({ children, baseVelocity = 100 }) => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, baseVelocity]);

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.span style={{ x }} className="block text-[15vw] font-black uppercase tracking-tighter leading-none opacity-5 select-none">
        {children} {children} {children}
      </motion.span>
    </div>
  );
};

// Élément de galerie cinématique avec effet de loupe et parallaxe
const CinematicGalleryItem = ({ src, alt, year, delay }: { src: string, alt: string, year: string, delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative group overflow-hidden rounded-[2.5rem] bg-nova-black"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <motion.img
          style={{ scale }}
          src={src}
          alt={alt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
        />
      </div>
      
      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-t from-nova-black via-transparent to-transparent opacity-80" />
      
      <div className="absolute bottom-10 left-10 right-10 z-20">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-nova-violet font-black text-[10px] tracking-[0.4em] uppercase mb-2 block">{year}</span>
            <h3 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">{alt}</h3>
          </div>
          <motion.div 
            whileHover={{ rotate: 45 }}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md"
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>
      </div>

      <motion.div 
        style={{ y }}
        className="absolute top-10 right-10 text-white/10 text-8xl font-black select-none pointer-events-none"
      >
        #0{delay * 10 + 1}
      </motion.div>
    </motion.div>
  );
};

const Archive: React.FC = () => {
  // Initialize navigate for routing
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.1], [1, 0.9]);

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800", alt: "Lab d'innovation", year: "Édition 2025" },
    { src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800", alt: "Collaboration intense", year: "Édition 2025" },
    { src: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800", alt: "La Grande Finale", year: "Édition 2025" },
    { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800", alt: "Studio Pitching", year: "Édition 2025" },
    { src: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800", alt: "Network Night", year: "Édition 2025" },
    { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800", alt: "Cérémonie", year: "Édition 2025" }
  ];

  return (
    <div ref={containerRef} className="relative bg-white selection:bg-nova-violet selection:text-white">
      
      {/* 1. HERO ARCHIVE */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 w-full max-w-7xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 inline-flex items-center gap-4 px-6 py-3 rounded-full border border-nova-black/5 glass"
          >
            <History size={16} className="text-nova-violet" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-nova-black">Rétrospective Historique</span>
          </motion.div>
          
          <h1 className="editorial-title text-[clamp(3rem,16vw,18rem)] font-black text-nova-black leading-[0.75]">
            L'HÉRITAGE <br />
            <span className="text-nova-violet">NOVA.</span>
          </h1>
          
          <p className="mt-12 text-sm md:text-xl text-gray-400 font-light max-w-2xl mx-auto tracking-tight leading-relaxed">
            Revivez les moments qui ont défini l'innovation nationale. <br />
            Là où les rêves sont devenus des infrastructures.
          </p>
        </motion.div>

        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.03]">
          <div className="w-[150vw] h-[150vw] border-[1px] border-nova-black rounded-full animate-pulse" />
          <div className="absolute w-[100vw] h-[100vw] border-[1px] border-nova-black rounded-full" />
          <div className="absolute w-[50vw] h-[50vw] border-[1px] border-nova-black rounded-full" />
        </div>
      </section>

      {/* 2. TEXTE DÉFILANT */}
      <div className="py-20 border-y border-gray-50 bg-white z-20 relative">
        <ParallaxText baseVelocity={-20}>NOVA 2025 EDITION</ParallaxText>
        <ParallaxText baseVelocity={20}>LA RENAISSANCE TECHNOLOGIQUE</ParallaxText>
      </div>

      {/* 3. LE RÉCIT */}
      <section id="winners-story" className="py-64 px-6 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-5 sticky top-40">
              <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px] block mb-12">Le Chapitre I</span>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
                UNE ANNÉE <br /><span className="text-nova-violet italic font-light">MAGNÉTIQUE.</span>
              </h2>
              <p className="text-xl text-gray-500 font-light leading-relaxed mb-12">
                En 2025, nous avons posé la première pierre d'un édifice qui ne s'arrêtera jamais de croître. Plus qu'un concours, c'était un cri de ralliement pour la jeunesse tech du Bénin.
              </p>
              
              <div className="space-y-12">
                {[
                  { label: "Projets Soumis", val: "450+" },
                  { label: "Bourses Distribuées", val: "15M CFA" },
                  { label: "Impact Direct", val: "12 Villes" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-8 border-b border-gray-100 pb-8 last:border-0 group cursor-default">
                    <span className="text-nova-violet font-black text-4xl group-hover:scale-110 transition-transform">{stat.val}</span>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-32">
              <GlassCard className="bg-nova-black text-white p-20 border-0 overflow-hidden relative group">
                <Trophy size={80} className="text-nova-violet mb-12 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-4xl font-black uppercase mb-8 tracking-tighter">Le Lauréat Suprême</h3>
                <div className="space-y-6 text-gray-400 text-lg font-light">
                  <p className="text-white font-bold text-2xl italic mb-4">AgroVision AI</p>
                  <p>Une prouesse de vision par ordinateur pour la sécurité alimentaire nationale.</p>
                  <p>Développé par l'équipe Kpodékon (INSTI Lokossa), ce projet a redéfini les standards de l'innovation locale en 2025.</p>
                </div>
                <div className="mt-16 pt-16 border-t border-white/10 flex items-center justify-between">
                   <div className="flex -space-x-4">
                      <div className="w-12 h-12 rounded-full border-2 border-nova-black bg-gray-700" />
                      <div className="w-12 h-12 rounded-full border-2 border-nova-black bg-gray-600" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-nova-violet">DÉCOUVRIR LE PROJET</span>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-nova-violet/20 blur-[120px] rounded-full" />
              </GlassCard>

              <div className="grid grid-cols-2 gap-8">
                <div className="aspect-square rounded-[3rem] bg-gray-50 flex flex-col items-center justify-center p-12 text-center group hover:bg-nova-violet transition-colors duration-700">
                  <Users size={48} className="text-nova-violet group-hover:text-white mb-6 transition-colors" />
                  <span className="text-nova-black group-hover:text-white font-black text-2xl uppercase tracking-tighter">1200+</span>
                  <span className="text-gray-400 group-hover:text-white/60 text-[10px] uppercase font-bold tracking-widest mt-2">Visiteurs Finale</span>
                </div>
                <div className="aspect-square rounded-[3rem] bg-nova-black flex flex-col items-center justify-center p-12 text-center">
                  <Star size={48} className="text-nova-violet mb-6" />
                  <span className="text-white font-black text-2xl uppercase tracking-tighter">4.9/5</span>
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-2">Satisfaction Partner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LA GALERIE CINÉMATIQUE */}
      <section id="gallery" className="py-40 px-6 bg-nova-black overflow-hidden">
        <div className="container mx-auto">
          <div className="mb-32 flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl">
              <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px] block mb-8">Archives Visuelles</span>
              <h2 className="text-5xl md:text-8xl text-white font-black uppercase tracking-tighter leading-[0.85]">
                LA MÉMOIRE DU <br /><span className="text-nova-violet italic font-light">MOUVEMENT.</span>
              </h2>
            </div>
            <p className="text-gray-500 max-w-sm font-light">
              Des pixels chargés d'émotion, capturant l'instant précis où l'idée devient tangible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {galleryImages.map((img, i) => (
              <div key={i} className={i % 2 !== 0 ? 'md:mt-24' : ''}>
                <CinematicGalleryItem {...img} delay={i * 0.1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PASSAGE DE FLAMBEAU */}
      <section className="relative py-80 bg-white overflow-hidden px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="container mx-auto relative z-10"
        >
          <span className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px] block mb-12">Continuer l'histoire</span>
          <h2 className="editorial-title text-[clamp(2.5rem,10vw,12rem)] text-nova-black mb-20 leading-[0.8]">
            VOTRE TOUR<br />
            <span className="text-nova-violet italic font-light">EST VENU.</span>
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Button size="lg" onClick={() => navigate('/participate')}>Participer en 2026</Button>
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-nova-black transition-colors">
              Voir le palmarès complet
            </button>
          </div>

          <p className="mt-32 text-[10px] font-black tracking-[0.5em] text-gray-200 uppercase">
            Tech Nova Challenge — Powered by Innovation
          </p>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-nova-violet/5 blur-[150px] rounded-full -z-10" />
      </section>

    </div>
  );
};

export default Archive;