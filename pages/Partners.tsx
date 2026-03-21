
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Radio, ArrowDown, ExternalLink, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPartners } from '../lib/adminData';

interface Partner {
  id: string;
  name: string;
  logo: string;
  secondLogo?: string;
  category: 'enterprise' | 'institution' | 'media';
}

const STATIC_PARTNERS: Partner[] = [
  // Entreprises
  { id: 'st1', name: "WISSAM (INGCO)", logo: "https://i.postimg.cc/02J6zzfD/WISSAM-INGCO.jpg", secondLogo: "https://i.postimg.cc/6qhn75My/ingco_logo_png.png", category: 'enterprise' },
  { id: 'st2', name: "NSIA BANQUE", logo: "https://i.postimg.cc/d0QXDLnj/NSIA_BANQUE.jpg", category: 'enterprise' },
  { id: 'st3', name: "PRO TECHNOLOGIE PLUS", logo: "https://i.postimg.cc/25HtWrXx/PRO_TECHNOLOGIE_PLUS.jpg", category: 'enterprise' },
  { id: 'st4', name: "AMBITION CONCEPT", logo: "https://i.postimg.cc/R0C8qNGV/AMBITION_CONCEPT.jpg", category: 'enterprise' },
  { id: 'st5', name: "BENINEDU", logo: "https://i.postimg.cc/yNfGRsrv/BENINEDU.jpg", category: 'enterprise' },
  { id: 'st6', name: "CERME", logo: "https://i.postimg.cc/QMNPVHSq/CERME.jpg", category: 'enterprise' },
  { id: 'st7', name: "ONG ESPOIR PLURIEL", logo: "https://i.postimg.cc/SKQ5jJVz/ONG_PLURIEL.png", category: 'enterprise' },
  // Institutions
  { id: 'st8', name: "ENSET LOKOSSA", logo: "https://i.postimg.cc/tgRf7YDZ/ENSET.png", category: 'institution' },
  { id: 'st9', name: "INSTI LOKOSSA", logo: "https://i.postimg.cc/s2f81vKG/INSTI_LOKOSSA.png", category: 'institution' },
  { id: 'st10', name: "SÈMÈ CITY (SCOP)", logo: "https://i.postimg.cc/W49yZTf0/SCOP.png", category: 'institution' },
  { id: 'st11', name: "BENIN EXCELLENCE", logo: "https://i.postimg.cc/5t9Gj6p3/BENIN_EXCELLENCE.png", category: 'institution' },
  // Médias
  { id: 'st12', name: "VDN", logo: "https://i.postimg.cc/XvNhXpxN/VDN.jpg", category: 'media' },
  { id: 'st13', name: "RFI FEUNSTIM", logo: "https://i.postimg.cc/q7mFK4Zw/RFI_FEUNSTIM.jpg", category: 'media' },
  { id: 'st14', name: "FEUA", logo: "https://i.postimg.cc/HLWKjV3Y/FEUA.jpg", category: 'media' },
  { id: 'st15', name: "COUVERTURE MÉDIATIQUE", logo: "https://i.postimg.cc/VN9vkxwg/presse.jpg", category: 'media' }
];

const Partners: React.FC = () => {
  const navigate = useNavigate();
  const [dynamicPartners, setDynamicPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const load = async () => {
      const saved = await getPartners();
      setDynamicPartners(saved);
    };
    void load();
    const interval = setInterval(() => {
      void load();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allPartners = [...STATIC_PARTNERS, ...dynamicPartners];

  const sections = [
    { 
      title: "Les Entreprises", 
      icon: <Building2 size={24} />, 
      partners: allPartners.filter(p => p.category === 'enterprise') 
    },
    { 
      title: "Les Écoles & Institutions", 
      icon: <GraduationCap size={24} />, 
      partners: allPartners.filter(p => p.category === 'institution') 
    },
    { 
      title: "La Presse & Médias", 
      icon: <Radio size={24} />, 
      partners: allPartners.filter(p => p.category === 'media') 
    }
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-nova-violet selection:text-white">
      
      {/* HEADER CINÉMATIQUE */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img 
            src="https://i.postimg.cc/7Z2R6LcL/les-laureats-a-ingco-pour-des-bons.jpg" 
            alt="Collaboration Institutionnelle" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="editorial-title text-[clamp(2.5rem,7vw,7rem)] text-white leading-none mb-12">
              L'ALLIANCE DE <br />
              <span className="text-nova-violet italic font-light">L'EXCELLENCE.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white font-light max-w-3xl mx-auto leading-relaxed drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
              Nous fédérons les forces vives de la nation pour bâtir l'infrastructure technologique de demain.
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

      {/* SECTIONS DE PARTENAIRES */}
      <section className="py-24 md:py-48 px-6 bg-[#FAFAFB]">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-32 md:space-y-64">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-16 md:mb-24 border-b border-gray-200 pb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-nova-violet shadow-sm border border-gray-100">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-nova-black">
                      {section.title}
                    </h2>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-black/30">
                    {section.partners.length} Partenaires actifs
                  </span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                  {section.partners.map((partner) => (
                    <motion.div 
                      key={partner.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group relative bg-white rounded-[2.5rem] p-10 md:p-14 flex flex-col items-center justify-center border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700"
                    >
                      <div className="w-full h-32 md:h-40 flex items-center justify-center mb-8 gap-4">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className={`${partner.secondLogo ? 'max-w-[45%]' : 'max-w-[90%]'} max-h-full object-contain transition-all duration-1000 group-hover:scale-110`}
                        />
                        {partner.secondLogo && (
                           <img 
                            src={partner.secondLogo} 
                            alt={`${partner.name} secondary`}
                            className="max-w-[45%] max-h-full object-contain transition-all duration-1000 group-hover:scale-110"
                           />
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-nova-black mb-2">
                          {partner.name}
                        </h4>
                        <div className="flex items-center justify-center gap-2 text-nova-violet opacity-0 group-hover:opacity-100 transition-all duration-500">
                           <span className="text-[8px] font-black uppercase tracking-widest">Partenaire Officiel</span>
                           <ExternalLink size={10} />
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-50 rounded-full group-hover:bg-nova-violet transition-colors" />
                    </motion.div>
                  ))}
                  
                  <div 
                    onClick={() => navigate('/contact')}
                    className="border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer group hover:bg-nova-violet/5 hover:border-nova-violet/30 transition-all p-10 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg group-hover:bg-nova-violet group-hover:text-white transition-all">
                      <ExternalLink size={20} className="text-nova-violet group-hover:text-white" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 group-hover:text-nova-violet transition-colors tracking-widest">
                      Devenir Partenaire
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-24 text-center border-t border-black/5 bg-white">
         <p className="text-[10px] md:text-[12px] font-black tracking-[1em] md:tracking-[1.5em] text-nova-black/10 uppercase font-display px-4">
            Tech Nova Challenge — Un Collectif Visionnaire.
         </p>
      </footer>
    </div>
  );
};

export default Partners;