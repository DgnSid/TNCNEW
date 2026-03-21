
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Camera, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const ArchivesHub: React.FC = () => {
  const navigate = useNavigate();

  const hubs = [
    {
      title: "Lauréats 2025",
      desc: "Découvrez le palmarès de l'édition inaugurale et les projets qui ont marqué l'histoire.",
      icon: <Trophy size={48} />,
      path: "/laureats-2025",
      img: "https://i.postimg.cc/rsmKM3fW/les_premieers_du_tnc.jpg",
      color: "bg-nova-violet"
    },
    {
      title: "Galerie Photos",
      desc: "Plongez dans les archives visuelles : formations, visites et moments de gloire.",
      icon: <Camera size={48} />,
      path: "/galerie",
      img: "https://i.postimg.cc/fLsjZj0N/visite_scop.jpg",
      color: "bg-nova-black"
    },
    {
      title: "Équipe 2026",
      desc: "Faites connaissance avec les visages qui orchestrent cette nouvelle odyssée.",
      icon: <Users size={48} />,
      path: "/equipe-2026",
      img: "https://i.postimg.cc/L6FT665y/le-promoteur.jpg",
      color: "bg-nova-red"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-24 md:mb-32">
           <span className="text-nova-violet font-black tracking-[0.6em] uppercase text-[10px] block mb-8">Médiathèque Institutionnelle</span>
           <h1 className="editorial-title text-[clamp(2.5rem,10vw,10rem)] text-nova-black leading-none uppercase">
             NOS <br /><span className="text-nova-violet italic font-light">RÉTROSPECTIVES.</span>
           </h1>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {hubs.map((h, i) => (
            <motion.div
              key={h.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer"
              onClick={() => navigate(h.path)}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img src={h.img} alt={h.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className={`absolute inset-0 ${h.color} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-nova-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="text-white mb-6 transform group-hover:scale-110 group-hover:text-nova-violet transition-all">
                      {h.icon}
                   </div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{h.title}</h2>
                   <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">{h.desc}</p>
                   <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                      Explorer <ArrowRight size={14} className="text-nova-violet" />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchivesHub;