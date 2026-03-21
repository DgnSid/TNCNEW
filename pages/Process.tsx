
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Code2, Users2, Rocket } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const steps = [
  {
    icon: <ClipboardCheck className="w-8 h-8 text-nova-violet" />,
    title: "1. Inscription & Idéation",
    desc: "Soumettez votre concept en quelques lignes. Nous ne cherchons pas encore de code, juste une vision claire d'un problème et de sa solution tech.",
    status: "Bientôt ouvert"
  },
  {
    icon: <Code2 className="w-8 h-8 text-nova-violet" />,
    title: "2. Développement Prototype",
    desc: "Les projets retenus entrent dans la phase de réalisation. Vous aurez 8 semaines pour construire une version MVP de votre application.",
    status: "Phase 2"
  },
  {
    icon: <Users2 className="w-8 h-8 text-nova-violet" />,
    title: "3. Mentorat & Coaching",
    desc: "Travaillez main dans la main avec des experts de Google, Microsoft et des entrepreneurs locaux pour affiner votre produit et votre pitch.",
    status: "Phase 3"
  },
  {
    icon: <Rocket className="w-8 h-8 text-nova-violet" />,
    title: "4. Demo Day",
    desc: "Le moment de vérité. Présentez votre solution en direct. Le gagnant repart avec le Grand Prix Nova et une bourse de pré-incubation.",
    status: "L'apogée"
  }
];

const Process: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-nova-violet font-bold tracking-widest uppercase text-sm mb-6 block">Le Parcours</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">De l'idée à la <span className="text-nova-violet">réalité.</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Une structure rigoureuse conçue pour transformer des passionnés en fondateurs.</p>
        </motion.div>

        <div className="grid gap-8 md:gap-12 relative">
          {/* Central Line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-20`}>
              <div className="md:w-1/2">
                <GlassCard delay={idx * 0.1}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-nova-violet/5 rounded-xl">
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase tracking-tighter">
                      {step.status}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </GlassCard>
              </div>
              <div className="hidden md:flex md:w-1/2 justify-center">
                <div className="w-12 h-12 rounded-full glass border border-nova-violet/30 flex items-center justify-center font-bold text-nova-violet">
                  {idx + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;