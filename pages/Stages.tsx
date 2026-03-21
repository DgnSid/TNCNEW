
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Filter, Search, Users, Presentation, Rocket, Award } from 'lucide-react';
import GlassCard from '../components/GlassCard';

// Fix: Use React.FC to define the component, which correctly handles React-specific props like 'key' and resolves the type assignment error on line 94.
const StageItem: React.FC<{ icon: React.ReactNode, title: string, desc: string, delay?: number, index: number }> = ({ icon, title, desc, delay = 0, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="relative pl-12 md:pl-0"
  >
    <div className="grid md:grid-cols-12 gap-12 items-center">
       <div className={`md:col-span-5 ${index % 2 === 0 ? 'md:text-right' : 'md:order-last'}`}>
          <div className={`hidden md:flex items-center gap-6 mb-4 ${index % 2 === 0 ? 'justify-end' : ''}`}>
             <div className="p-3 bg-nova-violet/5 rounded-2xl text-nova-violet">{icon}</div>
             <span className="text-nova-violet font-black text-xs uppercase tracking-widest">Étape 0{index + 1}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-nova-black mb-6">{title}</h3>
          <p className="text-gray-500 font-light text-lg leading-relaxed">{desc}</p>
       </div>
       
       <div className="md:col-span-2 flex justify-center relative">
          <div className="w-px h-full bg-gray-100 absolute top-0 left-1/2 -translate-x-1/2 hidden md:block" />
          <div className="w-12 h-12 rounded-full glass border border-nova-violet/30 flex items-center justify-center font-bold text-nova-violet z-10 bg-white">
            {index + 1}
          </div>
       </div>
       
       <div className="md:col-span-5">
          <div className="aspect-video bg-gray-50 rounded-[2.5rem] overflow-hidden group">
             <div className="w-full h-full bg-gradient-to-br from-nova-violet/5 to-transparent group-hover:scale-105 transition-transform duration-700" />
          </div>
       </div>
    </div>
  </motion.div>
);

const Stages: React.FC = () => {
  const steps = [
    {
      icon: <ClipboardList />,
      title: "Appel à candidatures",
      desc: "Ouverture officielle de la plateforme. Les porteurs de projets soumettent leur concept initial, l'identification du problème et leur vision technologique."
    },
    {
      icon: <Search />,
      title: "Pré-sélection Rigoureuse",
      desc: "Analyse des dossiers par un comité d'experts. Nous évaluons la pertinence, la faisabilité technique et l'impact potentiel sur le développement local."
    },
    {
      icon: <Users />,
      title: "Immersion & Coaching",
      desc: "Les équipes retenues bénéficient d'un encadrement intensif. Ateliers sur le prototypage, le business model et l'art du pitch."
    },
    {
      icon: <Presentation />,
      title: "La Grande Finale",
      desc: "Pitch devant un jury d'experts et un public diversifié. Présentation des prototypes fonctionnels et démonstrations en direct."
    },
    {
      icon: <Award />,
      title: "Distinction & Prix",
      desc: "Remise des bourses de pré-incubation et des trophées Nova pour couronner l'excellence technique et l'innovation."
    },
    {
      icon: <Rocket />,
      title: "Insertion & Suivi",
      desc: "Mise en relation des lauréats avec l'écosystème entrepreneurial et les partenaires stratégiques pour la concrétisation des projets."
    }
  ];

  return (
    <div className="pt-40 pb-32 bg-white overflow-hidden selection:bg-nova-violet selection:text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-40 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-nova-violet font-black tracking-[0.6em] uppercase text-[10px] block mb-8"
          >
            Le Processus Nova
          </motion.span>
          <h1 className="editorial-title text-[clamp(2.5rem,8vw,10rem)] leading-none text-nova-black uppercase">
            UN VOYAGE <br />
            <span className="text-nova-violet">STRUCTURÉ.</span>
          </h1>
        </header>

        <div className="space-y-40 relative">
          {steps.map((step, i) => (
            <StageItem key={i} index={i} {...step} delay={i * 0.1} />
          ))}
        </div>

        <section className="mt-64 py-32 border-t border-gray-100 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tighter">Prêt pour le <span className="text-nova-violet italic font-light">Décollage ?</span></h2>
          <div className="relative inline-block">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-nova-violet blur-2xl -z-10"
            />
            <button 
              onClick={() => window.location.hash = '/participate'}
              className="bg-nova-violet text-white font-black uppercase tracking-[0.4em] px-12 py-6 rounded-full shadow-2xl hover:translate-y-[-4px] transition-transform"
            >
              Candidater Maintenant
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Stages;