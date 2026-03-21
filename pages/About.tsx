import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Globe, Target, Building2, ShieldCheck, 
  ArrowDown, Lightbulb, 
  Users, Zap, BarChart3, Rocket
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const About: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="bg-white selection:bg-nova-violet selection:text-white overflow-hidden">
      
      {/* 1. HEADER CINÉMATIQUE */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden px-4">
        <motion.div style={{ y: heroY, opacity: opacityHero }} className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
            alt="Horizon Technologique" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-nova-black/80 backdrop-blur-[2px]" />
        </motion.div>
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="editorial-title text-[clamp(2.5rem,10vw,144px)] text-white leading-[0.8] mb-12">
              CLARIFIONS LE <br />
              <span className="text-nova-violet italic font-light">CONCOURS.</span>
            </h1>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20"
        >
           <ArrowDown size={32} />
        </motion.div>
      </section>

      {/* 2. PRÉSENTATION GÉNÉRALE */}
      <section className="py-48 px-6 bg-white relative">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-16"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="h-px w-24 bg-nova-violet" />
              <span className="text-nova-violet font-black tracking-widest uppercase text-xs">Présentation Générale</span>
            </div>
            
            <h2 className="editorial-title text-4xl md:text-7xl font-black text-nova-black leading-none mb-10">
              DANS LES LIGNES QUI SUIVENT <br />
              <span className="text-nova-violet italic font-light">NOUS VOUS EXPLIQUONS LE CONTEXTE MEME DU CONCOURS TNC</span>
            </h2>
            
            <div className="prose prose-2xl max-w-none text-gray-500 font-light leading-[1.8] space-y-10">
              <p>
                Le Tech Nova Challenge (TNC) se positionne comme une plateforme structurée d’expression, de formation et de valorisation des talents, principalement issus des filières techniques, scientifiques, littéraires et numériques du Bénin. 
              </p>
              <p>
                Le concours offre un cadre organisé permettant aux étudiants d’identifier des problématiques concrètes de leur environnement — notamment dans les domaines de l’emploi, de l’éducation, de la sécurité, du cadre de vie ou des services numériques — et de proposer des solutions technologiques adaptées. 
              </p>
              <p className="border-l-4 border-nova-violet pl-10 italic text-nova-black font-medium font-serif">
                Ces solutions font l’objet d’un processus de conception, de prototypage et de présentation devant un jury et un public, conformément à des critères professionnels définis.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reste de la page inchangé mais avec editorial-title mis à jour globalement */}
      {/* ... */}
      <section className="py-64 bg-nova-black text-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="w-20 h-20 bg-nova-violet rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(124,58,237,0.4)]">
                <Zap size={32} />
              </div>
              <h2 className="editorial-title text-5xl font-black text-white">Notre <br /><span className="text-nova-violet italic font-light">Vision.</span></h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                Devenir une référence nationale et sous-régionale en matière d’innovation technologique portée par les jeunes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-12"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-10">
                <Rocket size={32} className="text-nova-violet" />
              </div>
              <h2 className="editorial-title text-5xl font-black text-white">Notre <br /><span className="text-nova-violet italic font-light">Mission.</span></h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                Identifier, révéler et accompagner les talents par le renforcement de capacités et la mise en relation avec l'industrie.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ... suite du code standard ... */}
    </div>
  );
};

export default About;