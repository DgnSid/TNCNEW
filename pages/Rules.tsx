
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Calendar, Scale, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Rules: React.FC = () => {
  return (
    <div className="pt-40 pb-32 bg-white selection:bg-nova-violet selection:text-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-40">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-nova-violet font-black tracking-[0.5em] uppercase text-[10px] block mb-8"
          >
            Le Cadre Légal
          </motion.span>
          <h1 className="editorial-title text-[clamp(2.5rem,9vw,9rem)] leading-none text-nova-black uppercase mb-12">
            Règlement <br />
            <span className="text-nova-violet italic font-light">Interne.</span>
          </h1>
          <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-3xl">
            L'équité est au cœur de notre démarche. Voici les règles qui régissent la participation au Tech Nova Challenge 2025.
          </p>
        </header>

        <div className="space-y-12">
          
          <GlassCard className="p-12 md:p-16 border-nova-black/5">
             <div className="flex items-center gap-6 mb-12">
                <div className="w-14 h-14 bg-nova-violet/5 rounded-2xl flex items-center justify-center text-nova-violet">
                   <Users size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Conditions d'éligibilité</h2>
             </div>
             <div className="grid md:grid-cols-2 gap-12 text-gray-500 font-light text-lg">
                <ul className="space-y-6">
                   <li className="flex gap-4">
                      <CheckCircle2 size={24} className="text-nova-violet flex-shrink-0" />
                      <span>Ouvert aux étudiants des écoles et instituts techniques du Bénin.</span>
                   </li>
                   <li className="flex gap-4">
                      <CheckCircle2 size={24} className="text-nova-violet flex-shrink-0" />
                      <span>Jeunes diplômés (moins de 2 ans après l'obtention du diplôme).</span>
                   </li>
                </ul>
                <ul className="space-y-6">
                   <li className="flex gap-4">
                      <CheckCircle2 size={24} className="text-nova-violet flex-shrink-0" />
                      <span>Participation obligatoire en **binôme** (Équipe de 2).</span>
                   </li>
                   <li className="flex gap-4">
                      <CheckCircle2 size={24} className="text-nova-violet flex-shrink-0" />
                      <span>Projet inédit ou présentant une amélioration majeure.</span>
                   </li>
                </ul>
             </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 gap-8">
             <GlassCard className="bg-nova-black text-white border-0">
                <div className="flex items-center gap-6 mb-8">
                   <Scale size={32} className="text-nova-violet" />
                   <h3 className="text-xl font-black uppercase tracking-widest">Évaluation</h3>
                </div>
                <ul className="space-y-4 text-gray-400 font-light">
                   <li>• Originalité et créativité (25%)</li>
                   <li>• Faisabilité technique (30%)</li>
                   <li>• Impact socio-économique (25%)</li>
                   <li>• Qualité du pitch et démo (20%)</li>
                </ul>
             </GlassCard>
             
             <GlassCard>
                <div className="flex items-center gap-6 mb-8 text-nova-black">
                   <Calendar size={32} className="text-nova-violet" />
                   <h3 className="text-xl font-black uppercase tracking-widest">Calendrier</h3>
                </div>
                <ul className="space-y-4 text-gray-500 font-light">
                   <li>• Clôture : 15 Octobre 2025</li>
                   <li>• Annonce Finalistes : 30 Octobre</li>
                   <li>• Grand Demo Day : 20 Novembre</li>
                </ul>
             </GlassCard>
          </div>

          <div className="py-20 text-center border-y border-gray-50">
             <ShieldAlert className="text-nova-violet mx-auto mb-8" size={48} />
             <p className="text-gray-400 font-light italic max-w-2xl mx-auto">
               "Le comité d'organisation se réserve le droit de disqualifier toute équipe ne respectant pas les principes d'éthique et de propriété intellectuelle."
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Rules;