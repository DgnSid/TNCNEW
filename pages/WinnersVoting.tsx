
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Trophy, Activity, Crown, X, ChevronRight, ArrowDown, Clock, ShieldCheck, Zap, Star, Share2 } from 'lucide-react';
import Button from '../components/Button';
import { getSiteConfig, getVotingTeams, incrementVotingTeamVotes } from '../lib/adminData';

interface VotingTeam {
  id: string;
  name: string;
  members: string;
  image: string;
  votes: number;
  type: 'public' | 'winners';
}

const CountdownItem = ({ label, value }: { label: string, value: number }) => (
  <div className="flex flex-col items-center">
    <motion.div 
      key={value}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-5xl md:text-8xl font-black text-white tracking-tighter tabular-nums mb-2"
    >
      {value.toString().padStart(2, '0')}
    </motion.div>
    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-nova-violet/60">
      {label}
    </div>
  </div>
);

const Ticker = () => (
  <div className="fixed top-[120px] left-0 w-full overflow-hidden bg-nova-violet/5 border-y border-white/5 py-3 z-[100] backdrop-blur-md">
    <motion.div 
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="flex whitespace-nowrap gap-20 items-center"
    >
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Activity size={12} className="text-nova-violet" /> NOUVEAU VOTE ENREGISTRÉ POUR L'ÉQUIPE ALPHA
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Zap size={12} className="text-nova-red" /> SCRUTIN SÉCURISÉ PAR PROTOCOLE NOVA-V3
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" /> VÉRIFICATION DE L'INTÉGRITÉ EN COURS
          </span>
        </div>
      ))}
    </motion.div>
  </div>
);

const WinnersVoting: React.FC = () => {
  const [teams, setTeams] = useState<VotingTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<VotingTeam | null>(null);
  const [voteCount, setVoteCount] = useState(1);
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const LIMIT = 2000;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const load = async () => {
      const config = await getSiteConfig();
      setTargetDate(config.winnersVoteEndDate || '');

      const parsed = await getVotingTeams();
      const filtered = parsed.filter(t => t.type === 'winners');
      const sorted = filtered.sort((a, b) => b.votes - a.votes);
      setTeams(sorted);
    };
    void load();
    const interval = setInterval(() => {
      void load();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleVote = async () => {
    if (!selectedTeam) return;
    const ok = await incrementVotingTeamVotes(selectedTeam.id, voteCount);
    if (!ok) {
      alert("Impossible d'enregistrer le vote pour le moment.");
      return;
    }
    setSelectedTeam(null);
    setVoteCount(1);
  };

  return (
    <div ref={containerRef} className="bg-black min-h-screen pt-48 pb-32 px-6 overflow-hidden relative selection:bg-nova-violet selection:text-white">
      
      {/* BACKGROUND ELEMENTS */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[60vw] h-[60vw] bg-nova-violet/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-nova-red/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 grid-blueprint opacity-10" />
      </motion.div>

      <Ticker />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* HERO SECTION */}
        <header className="text-center mb-40">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block p-10 bg-nova-violet/10 border border-white/10 rounded-[4rem] mb-16 shadow-[0_0_100px_rgba(124,58,237,0.2)]"
          >
            <Trophy size={80} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          </motion.div>
          
          <h1 className="editorial-title !text-white !text-[clamp(3rem,14vw,14rem)] !leading-[0.75] !tracking-[-0.08em] uppercase mb-12">
            LE CONCLAVE <br />
            <span className="text-nova-violet italic font-light lowercase tracking-tighter">des maîtres.</span>
          </h1>

          <div className="max-w-4xl mx-auto mt-24">
             <div className="flex flex-wrap justify-center gap-8 md:gap-20">
                <CountdownItem label="Jours" value={timeLeft.days} />
                <CountdownItem label="Heures" value={timeLeft.hours} />
                <CountdownItem label="Minutes" value={timeLeft.minutes} />
                <CountdownItem label="Secondes" value={timeLeft.seconds} />
             </div>
             <p className="mt-16 text-[10px] font-black uppercase tracking-[0.8em] text-white/30">
                Fin du vote final dans le compte à rebours ci-dessus
             </p>
          </div>
        </header>

        {/* CANDIDATES LIST */}
        <div className="space-y-16 md:space-y-32">
          {teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Leader Glow */}
              {i === 0 && (
                <div className="absolute inset-0 bg-nova-violet/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}

              <div className="bg-white/[0.03] border border-white/5 backdrop-blur-3xl rounded-[4rem] md:rounded-[6rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 hover:border-white/20 transition-all duration-1000 relative z-10 overflow-hidden">
                
                {/* Visual Rank Background */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 text-[25vw] font-black text-white/[0.02] pointer-events-none italic select-none">
                  0{i + 1}
                </div>

                {/* Team Image Monolith */}
                <div className="w-full lg:w-[450px] aspect-[4/5] rounded-[3rem] md:rounded-[5rem] overflow-hidden border-2 border-white/10 relative group-hover:border-nova-violet transition-colors duration-1000 shadow-2xl shrink-0">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 2 }}
                    src={team.image} 
                    className="w-full h-full object-cover" 
                    alt={team.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  {i === 0 && (
                    <div className="absolute top-10 left-10 flex items-center gap-3 bg-nova-violet text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                      <Crown size={14} fill="white" /> Champion
                    </div>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-grow flex flex-col justify-center text-center lg:text-left space-y-10">
                  <div>
                    <span className="text-nova-violet font-black uppercase tracking-[0.6em] text-[10px] mb-4 block">Binôme Finaliste</span>
                    <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                      {team.name}
                    </h2>
                    <p className="text-xl md:text-3xl text-white/40 font-light italic font-serif leading-relaxed">
                      {team.members}
                    </p>
                  </div>

                  <div className="space-y-8">
                     <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/20">
                        <span>Intensité du Vote</span>
                        <span className="text-white">{Math.round((team.votes / LIMIT) * 100)}% de l'objectif</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(100, (team.votes / LIMIT) * 100)}%` }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className={`h-full relative ${i === 0 ? 'bg-nova-violet shadow-[0_0_30px_#7C3AED]' : 'bg-white'}`}
                        />
                     </div>
                     <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums">
                          {team.votes.toLocaleString()} <span className="text-sm font-black text-white/20 tracking-widest">VOIX</span>
                        </div>
                        <Button 
                          variant={i === 0 ? 'accent' : 'outline'} 
                          size="lg" 
                          className={`w-full sm:w-auto !py-6 !px-12 ${i !== 0 ? '!border-white/20 !text-white hover:!bg-white hover:!text-black' : ''}`}
                          onClick={() => setSelectedTeam(team)}
                        >
                          DÉPOSER MON VOTE <ChevronRight size={18} className="ml-2" />
                        </Button>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QUANTUM VOTING MODAL */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-[100px] p-4 md:p-10"
            onClick={() => setSelectedTeam(null)}
          >
             <motion.div 
               initial={{ scale: 0.8, y: 100, opacity: 0 }} 
               animate={{ scale: 1, y: 0, opacity: 1 }} 
               exit={{ scale: 0.8, y: 100, opacity: 0 }}
               className="bg-nova-black border border-white/10 w-full max-w-2xl rounded-[4rem] md:rounded-[6rem] p-10 md:p-20 relative shadow-[0_0_150px_rgba(124,58,237,0.3)] overflow-hidden" 
               onClick={e => e.stopPropagation()}
             >
                {/* Modal Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-nova-violet/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <button 
                  onClick={() => setSelectedTeam(null)} 
                  className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors p-4 hover:bg-white/5 rounded-full"
                >
                  <X size={40} />
                </button>

                <div className="text-center relative z-10 mb-16">
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden mx-auto mb-10 border-4 border-nova-violet shadow-[0_0_60px_rgba(124,58,237,0.5)]">
                      <img src={selectedTeam.image} className="w-full h-full object-cover" alt="Focus" />
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                     {selectedTeam.name}
                   </h2>
                   <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em]">Attribution de la puissance finale</p>
                </div>

                <div className="space-y-16 relative z-10">
                   <div className="flex items-center justify-center gap-6 md:gap-12">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setVoteCount(Math.max(1, voteCount - 1))} 
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 flex items-center justify-center text-4xl font-light text-white hover:bg-nova-violet transition-all"
                      >
                        -
                      </motion.button>
                      <input 
                        type="number" 
                        value={voteCount} 
                        onChange={e => setVoteCount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="text-7xl md:text-[10rem] font-black text-white w-32 md:w-64 text-center bg-transparent border-none focus:outline-none tracking-tighter tabular-nums"
                      />
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setVoteCount(voteCount + 1)} 
                        className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 flex items-center justify-center text-4xl font-light text-white hover:bg-nova-violet transition-all"
                      >
                        +
                      </motion.button>
                   </div>

                   <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center backdrop-blur-md">
                      <div className="text-[10px] font-black text-nova-violet uppercase tracking-[0.5em] mb-4">Validation de l'Engagement</div>
                      <div className="text-4xl md:text-6xl font-black text-white">{(voteCount * 500).toLocaleString()} <span className="text-xl opacity-30">FCFA</span></div>
                   </div>

                   <div className="flex flex-col gap-6">
                      <Button className="w-full !py-8 !rounded-[2.5rem] !text-base" size="lg" variant="accent" onClick={handleVote}>
                        CONFIRMER LA SOUVERAINETÉ <Zap size={20} className="ml-3" />
                      </Button>
                      <button 
                        onClick={() => setSelectedTeam(null)}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
                      >
                        Annuler la procédure
                      </button>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center">
         <div className="flex justify-center gap-10 mb-12">
            <Share2 className="text-white/20 hover:text-nova-violet cursor-pointer transition-colors" />
            <Star className="text-white/20 hover:text-nova-violet cursor-pointer transition-colors" />
            <Activity className="text-white/20 hover:text-nova-violet cursor-pointer transition-colors" />
         </div>
         <p className="text-[10px] font-black tracking-[1.5em] text-white/10 uppercase font-display">
            TECH NOVA CHALLENGE — L'ULTIME ÉLITE.
         </p>
      </footer>
    </div>
  );
};

export default WinnersVoting;