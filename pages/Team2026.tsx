
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Star } from 'lucide-react';

interface TeamMember {
  id: number;
  lastName: string;
  firstName: string;
  role: string;
  university: string;
  field: string;
  image: string;
  priority: number;
  bio: string; 
}

const team: TeamMember[] = [
  {
    id: 1,
    lastName: "OGOUGNON",
    firstName: "Samuel Jawu",
    role: "Promoteur",
    university: "Promoteur Tech Nova Challenge",
    field: "",
    image: "https://i.postimg.cc/L6FT665y/le-promoteur.jpg",
    priority: 10,
    bio: "Promoteur visionnaire, il insuffle l'élan technologique et la direction stratégique de la compétition."
  },
  {
    id: 2,
    lastName: "AKONDE",
    firstName: "S. Bienvenu",
    role: "Coordonnateur",
    university: "Direction Générale",
    field: "Management des Systèmes",
    image: "https://i.postimg.cc/Z5Cd0Hb1/AKONDE_S_Bienvenu.jpg",
    priority: 20,
    bio: "Coordonnateur Général issu de la Direction Générale, il orchestre la synergie opérationnelle et assure la cohérence globale du projet."
  },
  {
    id: 4,
    lastName: "AKOTCHAYE",
    firstName: "Raouf",
    role: "Superviseur",
    university: "Haut Conseil TNC",
    field: "Surveillance Stratégique",
    image: "https://i.postimg.cc/g2nZrsz1/AKOTCHAYE_Raouf_Superviseur.jpg",
    priority: 21,
    bio: "Superviseur au sein du Haut Conseil TNC, il veille à la surveillance stratégique et au respect des standards d'excellence du challenge."
  },
  {
    id: 3,
    lastName: "DAKOSSI",
    firstName: "Johannes Ornel",
    role: "Coordonnateur Adjoint",
    university: "FAST/UAC",
    field: "Énergies Renouvelables et Systèmes Énergétiques",
    image: "https://i.postimg.cc/g2Mr5nR1/Johannes_Ornel.jpg",
    priority: 22,
    bio: "Il seconde la coordination avec une expertise technique pointue en systèmes énergétiques et énergies renouvelables."
  },
  {
    id: 21,
    lastName: "AKOTCHAYE",
    firstName: "Vicentia",
    role: "Ambassadrice",
    university: "ENSET/UNSTIM (Lokossa)",
    field: "Mécanique Automobile",
    image: "https://i.postimg.cc/VksdDjrQ/M_Vicentia.jpg",
    priority: 23,
    bio: "Elle représente fièrement les valeurs d'innovation et d'audace du challenge auprès de la jeunesse béninoise."
  },
  {
    id: 22,
    lastName: "DOSSA",
    firstName: "Mahugnon Delphin",
    role: "Ambassadeur",
    university: "INSTI/UNSTIM (Lokossa)",
    field: "BTP - Construction Durable",
    image: "https://i.postimg.cc/qRDPHHQg/Mahugnon_Delphin.jpg",
    priority: 24,
    bio: "Il porte les couleurs du Tech Nova Challenge avec passion, promouvant l'excellence dans le secteur du bâtiment."
  },
  {
    id: 5,
    lastName: "JAKO",
    firstName: "Abigail F'olukè Dègnon",
    role: "Secrétaire Générale (SG)",
    university: "ENSET/UNSTIM (Lokossa)",
    field: "Secrétariat et Assistanat de gestion",
    image: "https://i.postimg.cc/VksdDjSx/Abigaïl_F_olukè_Dègnon.jpg",
    priority: 50,
    bio: "Elle assure la rigueur administrative et le suivi méticuleux de tous les dossiers officiels de l'organisation."
  },
  {
    id: 6,
    lastName: "HOUDJI",
    firstName: "Esther Géraldine",
    role: "Secrétaire Adjointe (SGA)",
    university: "UCAO",
    field: "Informatique Industrielle et Maintenance",
    image: "https://i.postimg.cc/rwztq18F/Mondoukpè_Esther_Géraldine.jpg",
    priority: 60,
    bio: "Elle appuie le secrétariat général avec dynamisme et une précision opérationnelle indispensable au bon fonctionnement du projet."
  },
  {
    id: 7,
    lastName: "BOKO",
    firstName: "A. Martine",
    role: "Trésorière Générale (TG)",
    university: "ENSET/UNSTIM (Lokossa)",
    field: "Métiers Mode - vêtements",
    image: "https://i.postimg.cc/W19tKhrW/Amour_Marie.jpg",
    priority: 70,
    bio: "Elle veille avec intégrité à la saine gestion et à la transparence absolue des ressources financières de la compétition."
  },
  {
    id: 8,
    lastName: "ADEKOUNLE",
    firstName: "Adéwalé Joyce Rockia",
    role: "Trésorière Adjointe (TGA)",
    university: "ESM BENIN",
    field: "Science juridique",
    image: "https://i.postimg.cc/QdVWjQXN/Adéwalé_Joyce_Rockia.jpg",
    priority: 80,
    bio: "Elle apporte sa rigueur juridique et ses compétences analytiques à la gestion comptable du Tech Nova Challenge."
  },
  {
    id: 9,
    lastName: "LENGHAM",
    firstName: "C. Abioud Wicham",
    role: "Service Technique",
    university: "ENSGEP/UNSTIM (Abomey)",
    field: "Génie énergétique et procédés",
    image: "https://i.postimg.cc/GmM9NHGb/Charone_Abioud_Wicham.jpg",
    priority: 90,
    bio: "Expert en systèmes énergétiques, il assure la faisabilité technique et la fiabilité des prototypes industriels du challenge."
  },
  {
    id: 10,
    lastName: "TOGNON",
    firstName: "Eméric R. S.",
    role: "Service Technique",
    university: "INSTI/UNSTIM (Lokossa)",
    field: "Génie Électrique et Informatique",
    image: "https://i.postimg.cc/sgn18vSN/Emeric_Rolland_S.jpg",
    priority: 91,
    bio: "Il déploie son savoir-faire en électricité et informatique pour garantir la performance technique de l'événement."
  },
  {
    id: 13,
    lastName: "DJOSSA",
    firstName: "Herman",
    role: "Organisateur Général (OG)",
    university: "INSTI/UNSTIM (Lokossa)",
    field: "Froid et Climatisation",
    image: "https://i.postimg.cc/xCpwVVgN/Jesumimon_Herman.jpg",
    priority: 100,
    bio: "Il orchestre la logistique globale et l'organisation pratique du challenge sur le terrain avec une efficacité reconnue."
  },
  {
    id: 14,
    lastName: "ABDOU RAMANE",
    firstName: "Mouïsou",
    role: "Organisateur Adjoint (OGA)",
    university: "ENSET/UNSTIM (Lokossa)",
    field: "Électrotechnique",
    image: "https://i.postimg.cc/wjW3P7L8/ABDOU_RAMANE.jpg",
    priority: 110,
    bio: "Il soutient l'organisation logistique et technique avec une réactivité et un engagement exemplaires."
  },
  {
    id: 17,
    lastName: "ASSOGBA",
    firstName: "Houéfa Doriane M. C.",
    role: "Service Communication",
    university: "INSTI/UNSTIM (Lokossa)",
    field: "Informatique et Télécommunications",
    image: "https://i.postimg.cc/kgBbDsJ0/ASSOGBA_Houéfa_Doriane_Marie_Christnelle.jpg",
    priority: 119,
    bio: "Elle orchestre le rayonnement médiatique et sublime l'image institutionnelle du Tech Nova Challenge."
  },
  {
    id: 18,
    lastName: "AHIZIGBE",
    firstName: "Sidoine",
    role: "Service de Communication",
    university: "ENSGEP/UNSTIM (Abomey)",
    field: "Froid et Climatisation",
    image: "https://i.postimg.cc/Qt7ywK9X/SIDOINE.jpg",
    priority: 120,
    bio: "Il assure le rayonnement médiatique et porte la voix du challenge auprès du public et des partenaires."
  },
  {
    id: 19,
    lastName: "AÏMASSE",
    firstName: "Fabrice",
    role: "Service de Communication",
    university: "ENSET/UNSTIM (Lokossa)",
    field: "Économie-Gestion",
    image: "https://i.postimg.cc/zG3RqCJv/Jésugnon_Calixte_Fabrice.jpg",
    priority: 121,
    bio: "Il déploie les stratégies de communication digitales pour maximiser la visibilité de la compétition nationale."
  },
  {
    id: 20,
    lastName: "DJOHON",
    firstName: "Marius",
    role: "Service de Communication",
    university: "ENSGEP/UNSTIM (Lokossa)",
    field: "Énergétique et procédés",
    image: "https://i.postimg.cc/0QXT11Zw/DJOHON.jpg",
    priority: 122,
    bio: "Il contribue activement à la production de contenus et à l'animation des réseaux sociaux officiels du projet."
  },
  {
    id: 23,
    lastName: "GNANSOUNOU",
    firstName: "Afi Isabelle",
    role: "Service de Communication",
    university: "INSTI/UNSTIM (Lokossa)",
    field: "BTP - Construction Durable",
    image: "https://i.postimg.cc/qvBzj8hf/GNANSOUNOU_Afi_Isabelle_Joyce.jpg",
    priority: 123,
    bio: "Elle renforce l'équipe de communication par son dynamisme et son expertise terrain en infrastructures."
  },
  {
    id: 15,
    lastName: "TOMETIN",
    firstName: "Codjo Henri Primaël",
    role: "Graphiste Designer (GRA)",
    university: "ENSET-LOKOSSA",
    field: "Énergie Renouvelable",
    image: "https://i.postimg.cc/52PjG6LV/Codjo_Henri_Primaël.jpg",
    priority: 150,
    bio: "Il sculpte l'identité visuelle de la compétition avec une créativité sans limites et une précision esthétique."
  },
  {
    id: 16,
    lastName: "SEGBEDJI",
    firstName: "Anolde Elstine",
    role: "Graphiste Designer (GRA)",
    university: "UAC",
    field: "Mathématiques Informatiques",
    image: "https://i.postimg.cc/L8yh7nfr/Anolde_Elstine.jpg",
    priority: 151,
    bio: "Il allie design et rigueur logique pour sublimer les supports visuels et l'image de marque du challenge."
  }
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const isHighLevel = ["Promoteur", "Coordonnateur", "Superviseur"].includes(member.role);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col md:flex-row bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 mb-12 md:mb-32"
    >
      <div className="w-full md:w-[42%] aspect-[4/4.5] overflow-hidden bg-gray-50 relative">
        <motion.img
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={member.image}
          alt={`${member.firstName} ${member.lastName}`}
          className="w-full h-full object-cover object-top transition-transform duration-[2000ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
      </div>

      <div className="w-full md:w-[58%] p-8 md:p-16 flex flex-col justify-center bg-white">
        <div className="space-y-8 md:space-y-10">
          <div className="pb-6 md:pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet">Identité Digitale</span>
              {member.priority === 10 && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-nova-black text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                  <Star size={10} fill="currentColor" /> Promoteur
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-nova-black uppercase tracking-tighter leading-none mb-4">
              {member.lastName}
            </h2>
            <p className="text-lg md:text-2xl font-bold text-gray-400 uppercase tracking-tight">
              {member.firstName}
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet mb-3 block opacity-60">Profil & Mission</span>
            <p className="text-base md:text-xl font-medium text-gray-500 italic leading-relaxed font-serif">
              {member.bio}
            </p>
          </div>

          {!isHighLevel && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet mb-3 block opacity-60">Établissement</span>
                <p className="text-sm md:text-base font-black text-nova-black uppercase leading-tight tracking-tight">
                  {member.university}
                </p>
              </div>
              
              {member.field && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet mb-3 block opacity-60">Filière / Spécialité</span>
                  <p className="text-sm md:text-base font-bold text-gray-500 italic leading-snug">
                    {member.field}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 md:pt-6">
            <div className="inline-block px-0 py-0 border-l-4 border-nova-violet pl-6">
              <p className="text-xl md:text-2xl font-black text-nova-violet uppercase tracking-wider leading-none">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Team2026: React.FC = () => {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-white selection:bg-nova-violet selection:text-white pb-32">
      
      <section className="relative h-[80vh] md:h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://i.postimg.cc/wBHGRMq1/les_finalistes_et_l_equipe_tnc.jpg" 
            alt="Team Vision Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75 z-10" />
          <div className="absolute inset-0 grid-blueprint z-20 opacity-10" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-7xl relative z-30 text-center px-6"
        >
          <h1 className="editorial-title !text-white !text-[clamp(2.5rem,10vw,11rem)] !tracking-[-0.08em] !leading-[0.8] !text-shadow-none uppercase mb-8 md:mb-12">
            UNE ÉQUIPE, <br />
            <span className="text-nova-violet italic font-light lowercase tracking-tighter">UNE VISION.</span>
          </h1>
          
          <div className="w-16 md:w-24 h-px bg-nova-violet mx-auto mb-8 md:mb-12" />
          
          <p className="text-lg md:text-3xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed italic font-serif">
            Un collectif d'esprits visionnaires unis par l'audace et l'excellence pour façonner l'infrastructure technologique du Bénin.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 z-30 flex flex-col items-center gap-4"
        >
          <ArrowDown size={28} />
        </motion.div>
      </section>

      <section className="py-20 md:py-48 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          {team.sort((a, b) => a.priority - b.priority).map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 md:mt-48 py-20 md:py-32 border-t border-gray-50 text-center"
          >
            <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-nova-black mb-8 leading-none">
              DÉPASSER LES <br /><span className="text-nova-violet italic font-light uppercase">FRONTIÈRES.</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[11px]">
              L'Elite Technologique au Service de la Nation
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-16 md:py-24 text-center border-t border-black/5 bg-white">
         <p className="text-[9px] md:text-[11px] font-black tracking-[1em] md:tracking-[1.5em] text-nova-black/10 uppercase font-display px-4">
            Tech Nova Challenge — Un Collectif Visionnaire.
         </p>
      </footer>
    </div>
  );
};

export default Team2026;