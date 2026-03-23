
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowDown, Sparkles, ChevronRight, X, TrendingUp, Crown, Clock, CheckCircle2, CreditCard, Smartphone } from 'lucide-react';
import Button from '../components/Button';
import { getSiteConfig, getVotingTeams, incrementVotingTeamVotes } from '../lib/adminData.ts';

interface VotingTeam {
  id: string;
  name: string;
  members: string;
  image: string;
  votes: number;
  type: 'public' | 'winners';
}

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  return (
    <div className="flex justify-center gap-4 md:gap-10">
      {[
        { label: 'Jours', val: timeLeft.days },
        { label: 'Heures', val: timeLeft.hours },
        { label: 'Minutes', val: timeLeft.minutes },
        { label: 'Secondes', val: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="text-center group">
          <div className="text-4xl md:text-7xl font-black text-nova-black tracking-tighter tabular-nums mb-1 md:mb-2 group-hover:text-nova-violet transition-colors">
            {item.val.toString().padStart(2, '0')}
          </div>
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 group-hover:text-nova-violet/60 transition-colors">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const Voting: React.FC = () => {
  const [teams, setTeams] = useState<VotingTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<VotingTeam | null>(null);
  const [voteCount, setVoteCount] = useState(1);
  const [successVotes, setSuccessVotes] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState('');
  const LIMIT = 1000;

  // États pour KkiaPay
  const [isProcessing, setIsProcessing] = useState(false);
  const [kkiapayLoaded, setKkiapayLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<{teamName: string, voteCount: number} | null>(null);

  // Prix par vote
  const VOTE_PRICE = 50; // 50 FCFA par vote

  useEffect(() => {
    const load = async () => {
      const config = await getSiteConfig();
      setTargetDate(config.publicVoteEndDate || '');

      const parsed = await getVotingTeams();
      const filtered = parsed.filter(t => t.type === 'public');
      const sorted = filtered.sort((a, b) => b.votes - a.votes);
      setTeams(sorted);
    };
    void load();
    const interval = setInterval(() => {
      void load();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Charger KkiaPay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.kkiapay.me/k.js";
    script.async = true;
    script.onload = () => setKkiapayLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Gestionnaire de succès de paiement
  const handlePaymentSuccess = useCallback(async (paymentId: string) => {
    try {
      const paymentDataStored = JSON.parse(localStorage.getItem(paymentId) || '{}');
      if (!paymentDataStored?.teamId || !paymentDataStored?.voteCount) {
        throw new Error('Données de paiement manquantes');
      }

      // Enregistrer le vote après paiement réussi
      const ok = await incrementVotingTeamVotes(paymentDataStored.teamId, paymentDataStored.voteCount);
      if (!ok) {
        throw new Error('Erreur lors de l\'enregistrement du vote');
      }

      // Recharger immédiatement les équipes pour voir les votes mis à jour
      const parsed = await getVotingTeams();
      const filtered = parsed.filter(t => t.type === 'public');
      const sorted = filtered.sort((a, b) => b.votes - a.votes);
      setTeams(sorted);

      // Stocker les données pour le popup de remerciement
      setPaymentData({
        teamName: paymentDataStored.teamName,
        voteCount: paymentDataStored.voteCount
      });

      setPaymentSuccess(true);
      localStorage.removeItem(paymentId);

      // Fermer le modal de sélection d'équipe
      setSelectedTeam(null);

    } catch (error) {
      console.error('Erreur:', error);
      alert(`Paiement réussi mais erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }, []);

  // Vérifier les paiements au chargement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let paymentId = params.get('payment');

    if (!paymentId && window.location.hash) {
      const hashQuery = window.location.hash.split('?')[1] || '';
      paymentId = new URLSearchParams(hashQuery).get('payment');
    }

    if (paymentId) {
      const paymentData = JSON.parse(localStorage.getItem(paymentId) || '{}');

      if (paymentData) {
        handlePaymentSuccess(paymentId);
      }
    }
  }, [handlePaymentSuccess]);

  const handleVote = async () => {
    if (!selectedTeam || voteCount < 1) return;

    if (!kkiapayLoaded) {
      alert("Le système de paiement est en cours de chargement...");
      return;
    }

    setIsProcessing(true);

    const paymentId = `vote_${Date.now()}`;
    const amount = voteCount * VOTE_PRICE;

    // Stocker les données de paiement
    localStorage.setItem(paymentId, JSON.stringify({
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      voteCount,
      amount,
      date: new Date().toISOString()
    }));

    // Ouvrir le widget KkiaPay
    if (typeof window !== 'undefined' && (window as any).openKkiapayWidget) {
      (window as any).openKkiapayWidget({
        amount,
        key: "260b3f463adaac920f28acc20b34539ec90a9bec", // À remplacer par votre clé de production
        position: "center",
        sandbox: false, // Mettre à false pour la production
        callback: `${window.location.origin}/#/payment-callback?payment=${paymentId}`,
        theme: "orange",
        data: paymentId,
      });
    }

    setIsProcessing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) setVoteCount(0);
    else setVoteCount(Math.max(1, val));
  };

  const openVoteCard = (team: VotingTeam) => {
    setSelectedTeam(team);
  };

  return (
    <div className="bg-white min-h-screen selection:bg-nova-violet selection:text-white pb-32">
      <section data-vote-section className="relative h-[85vh] flex items-center justify-center bg-black overflow-hidden px-6">
        <div className="absolute inset-0">
          <img src="https://i.postimg.cc/tgyMnJq1/belle_vue_d_ensemble_des_lauréats_avec_le_dg.jpg" className="w-full h-full object-cover opacity-30 grayscale" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-nova-black via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <span className="text-nova-violet font-black tracking-[1em] uppercase text-[10px] block mb-8">Scrutin de Préselection — Phase Initiale</span>
            <h1 className="editorial-title text-[clamp(2rem,10vw,10rem)] text-white leading-[0.8]">
              VOTE DE <br /><span className="text-nova-violet italic font-light">PRÉSELECTION.</span>
            </h1>
            <p className="mt-12 text-xl md:text-3xl text-white/80 font-black uppercase tracking-[0.3em] italic">
              Votez pour l'équipe de votre choix !
            </p>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 text-white/20"><ArrowDown size={32} /></motion.div>
      </section>

      <section data-vote-section className="py-24 md:py-48 px-6 bg-[#FAFAFB]">
        <div className="container mx-auto max-w-7xl">
           <div className="mb-32 text-center space-y-16">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-nova-violet/5 border border-nova-violet/10 rounded-full text-nova-violet text-[10px] font-black uppercase tracking-widest">
                 <Clock size={14} /> Temps Restant Avant Clôture
              </div>
              <CountdownTimer targetDate={targetDate} />
              <div className="h-px w-24 bg-gray-100 mx-auto" />
              <h2 className="text-2xl md:text-5xl font-black text-nova-black uppercase tracking-tighter">
                Soutenez vos innovateurs préférés
              </h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {teams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col h-full"
                  >
                    {i === 0 && team.votes > 0 && (
                      <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-nova-violet text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-xl border border-white/10">
                        <Crown size={12} fill="white" /> LEADER ACTUEL
                      </div>
                    )}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={team.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={team.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-nova-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                         <div className="text-nova-violet font-black text-4xl mb-2 opacity-50 italic">#{i + 1}</div>
                         <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">{team.name}</h3>
                         <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest truncate">{team.members}</p>
                      </div>
                    </div>
                    <div className="p-10 flex-grow flex flex-col justify-between">
                       <div className="space-y-6 mb-10">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black uppercase text-gray-400">Progression du binôme</span>
                          </div>
                          <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (team.votes / LIMIT) * 100)}%` }} className="h-full bg-nova-violet" />
                          </div>
                          <div className="text-[11px] font-black text-nova-black text-center tracking-[0.2em] bg-gray-50 py-3 rounded-2xl border border-gray-100 uppercase">
                            {team.votes.toLocaleString()} Votes acquis
                          </div>
                       </div>
                       <Button className="w-full" variant="accent" onClick={() => openVoteCard(team)}>Voter pour ce Binôme</Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </section>

      {typeof document !== 'undefined' && createPortal(
        <>
          <AnimatePresence>
            {selectedTeam && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4" 
                onClick={() => {
                  setSelectedTeam(null);
                }}
              >
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="bg-white w-[min(92vw,42rem)] rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 relative shadow-2xl" 
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => {
                    setSelectedTeam(null);
                  }} className="absolute top-8 right-8 text-gray-300 hover:text-nova-black transition-colors"><X size={32} /></button>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 border-4 border-nova-violet shadow-xl"><img src={selectedTeam.image} className="w-full h-full object-cover" alt="Selected" /></div>
                    <h2 className="text-2xl md:text-3xl font-black text-nova-black uppercase tracking-tighter">{selectedTeam.name}</h2>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-2">Saisissez le nombre de votes à attribuer</p>
                  </div>
                  <div className="space-y-8">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
                        <button onClick={() => setVoteCount(Math.max(1, voteCount - 1))} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-100 flex items-center justify-center text-3xl font-light hover:bg-nova-violet hover:text-white transition-all">-</button>
                        <input 
                          type="number" 
                          value={voteCount} 
                          onChange={handleInputChange}
                          className="text-4xl md:text-6xl font-black text-nova-black w-32 md:w-48 text-center bg-transparent border-b-2 border-nova-violet/20 focus:border-nova-violet outline-none py-2 transition-all"
                          min="1"
                        />
                        <button onClick={() => setVoteCount(voteCount + 1)} className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-100 flex items-center justify-center text-3xl font-light hover:bg-nova-violet hover:text-white transition-all">+</button>
                      </div>
                    </div>

                    {/* Prix par vote */}
                    <div className="bg-gray-50 p-4 rounded-2xl text-center">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Prix par vote</div>
                      <span className="text-2xl font-black text-nova-black">{VOTE_PRICE.toLocaleString()} FCFA</span>
                    </div>

                    {/* Montant total */}
                    <div className="bg-nova-violet/5 p-6 md:p-8 rounded-[2rem] text-center border border-nova-violet/10">
                      <div className="text-[10px] font-black text-nova-violet uppercase tracking-widest mb-1">Montant Total</div>
                      <span className="text-3xl md:text-4xl font-black text-nova-black">{(voteCount * VOTE_PRICE).toLocaleString()} FCFA</span>
                    </div>

                    {/* Méthodes de paiement */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6">
                      <h3 className="text-lg font-black text-nova-black uppercase tracking-tighter mb-4 text-center">Méthodes de Paiement</h3>
                      <div className="flex justify-center items-center gap-8 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                            <Smartphone size={24} className="text-orange-600" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Mobile Money</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <CreditCard size={24} className="text-blue-600" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Carte Bancaire</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 text-center">
                        Paiement sécurisé via KkiaPay
                      </p>
                    </div>

                    {!kkiapayLoaded && (
                      <div className="text-center py-4 text-orange-500 text-sm">
                        Chargement du service de paiement...
                      </div>
                    )}

                    <Button 
                      className="w-full py-5 md:py-6" 
                      size="lg" 
                      onClick={handleVote}
                      disabled={isProcessing || !kkiapayLoaded}
                    >
                      {isProcessing ? 'Traitement en cours...' : `Payer ${(voteCount * VOTE_PRICE).toLocaleString()} FCFA`} 
                      <ChevronRight size={18} className="ml-2" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {paymentSuccess && paymentData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                onClick={() => {
                  setPaymentSuccess(false);
                  setPaymentData(null);
                  window.location.href = '/#/vote';
                }}
              >
                <motion.div
                  initial={{ scale: 0.92, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 border-4 border-nova-violet shadow-xl bg-nova-violet/10 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-nova-violet" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-nova-black mb-4">
                    Paiement Réussi !
                  </h3>
                  <p className="text-gray-600 font-medium mb-6">
                    Merci d'avoir soutenu <span className="font-black text-nova-black">{paymentData.teamName}</span> avec <span className="font-black text-nova-black">{paymentData.voteCount}</span> vote{paymentData.voteCount > 1 ? 's' : ''}.
                  </p>
                  <div className="bg-nova-violet/5 p-4 rounded-2xl border border-nova-violet/10 mb-8">
                    <p className="text-sm text-nova-violet font-bold">
                      Vos votes ont été ajoutés au compteur !
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={() => {
                      setPaymentSuccess(false);
                      setPaymentData(null);
                      window.location.href = '/#/vote';
                    }}
                  >
                    Continuer vers les Votes
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {successVotes !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
                onClick={() => setSuccessVotes(null)}
              >
                <motion.div
                  initial={{ scale: 0.92, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CheckCircle2 size={56} className="mx-auto mb-6 text-green-500" />
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-nova-black mb-4">
                    Vote Enregistré
                  </h3>
                  <p className="text-gray-500 font-medium mb-8">
                    Merci. Votre soutien de <span className="font-black text-nova-black">{successVotes}</span> vote(s) a bien été pris en compte.
                  </p>
                  <Button size="lg" className="w-full" onClick={() => setSuccessVotes(null)}>
                    Fermer
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
};

export default Voting;