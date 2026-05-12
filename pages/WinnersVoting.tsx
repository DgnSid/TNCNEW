
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowDown, ChevronRight, X, Crown, Clock, CheckCircle2 } from 'lucide-react';
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
          <div className="text-4xl md:text-7xl font-black text-white tracking-tighter tabular-nums mb-1 md:mb-2 group-hover:text-nova-violet transition-colors">
            {item.val.toString().padStart(2, '0')}
          </div>
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-nova-violet/60 transition-colors">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const WinnersVoting: React.FC = () => {
  const [teams, setTeams] = useState<VotingTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<VotingTeam | null>(null);
  const [voteCount, setVoteCount] = useState(1);
  const [successVotes, setSuccessVotes] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState('');
  const LIMIT = 5000;

  const [isProcessing, setIsProcessing] = useState(false);
  const [kkiapayLoaded, setKkiapayLoaded] = useState(false);

  const VOTE_PRICE = 50;

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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let paymentId = params.get('payment');

    if (!paymentId && window.location.hash) {
      const hashQuery = window.location.hash.split('?')[1] || '';
      paymentId = new URLSearchParams(hashQuery).get('payment');
    }

    if (paymentId) {
      window.location.href = `/#/payment-callback?payment=${paymentId}`;
    }
  }, []);

  const successListenerRef = useRef<((r: any) => void) | null>(null);

  const processConfirmedPayment = async (paymentId: string): Promise<boolean> => {
    const raw = localStorage.getItem(paymentId);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.processed) return true;

    localStorage.setItem(paymentId, JSON.stringify({ ...data, paymentConfirmed: true }));

    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
      const ok = await incrementVotingTeamVotes(data.teamId, data.voteCount);
      if (ok) {
        localStorage.setItem(paymentId, JSON.stringify({ ...data, paymentConfirmed: true, processed: true }));
        return true;
      }
    }
    return false;
  };

  const handleVote = async () => {
    if (!selectedTeam || voteCount < 1) return;

    if (!kkiapayLoaded) {
      alert("Le système de paiement est en cours de chargement...");
      return;
    }

    setIsProcessing(true);

    const paymentId = `vote_${Date.now()}`;
    const amount = voteCount * VOTE_PRICE;

    localStorage.setItem(paymentId, JSON.stringify({
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      voteCount,
      amount,
      date: new Date().toISOString(),
      redirectUrl: '/#/vote-gagnants',
      paymentConfirmed: false,
      processed: false,
    }));

    if (successListenerRef.current && (window as any).removeSuccessListener) {
      (window as any).removeSuccessListener(successListenerRef.current);
    }

    const onSuccess = async (response: any) => {
      const pId: string = (response?.data as string) || paymentId;
      await processConfirmedPayment(pId);
      if ((window as any).removeSuccessListener) {
        (window as any).removeSuccessListener(onSuccess);
      }
      successListenerRef.current = null;
    };
    successListenerRef.current = onSuccess;
    if ((window as any).addSuccessListener) {
      (window as any).addSuccessListener(onSuccess);
    }

    if (typeof window !== 'undefined' && (window as any).openKkiapayWidget) {
      (window as any).openKkiapayWidget({
        amount,
        key: "260b3f463adaac920f28acc20b34539ec90a9bec",
        position: "center",
        sandbox: false,
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

  return (
    <div className="bg-nova-black min-h-screen selection:bg-nova-violet selection:text-white pb-32">
      {/* HERO */}
      <section className="relative h-[85vh] flex items-center justify-center bg-black overflow-hidden px-6">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[60vw] h-[60vw] bg-nova-violet/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-nova-red/5 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-nova-violet/10 border border-nova-violet/20 rounded-full mb-10">
              <Trophy size={16} className="text-nova-violet" />
              <span className="text-nova-violet font-black tracking-[0.6em] uppercase text-[10px]">Scrutin Final — Phase Décisive</span>
            </div>
            <h1 className="editorial-title text-[clamp(3rem,12vw,12rem)] text-white leading-[0.8]">
              VOTE <br /><span className="text-nova-violet italic font-light">finale.</span>
            </h1>
            <p className="mt-12 text-xl md:text-3xl text-white/60 font-black uppercase tracking-[0.3em] italic">
              Désignez les champions du Tech Nova Challenge !
            </p>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 text-white/20">
          <ArrowDown size={32} />
        </motion.div>
      </section>

      {/* COUNTDOWN + CARDS */}
      <section className="py-24 md:py-48 px-6 bg-nova-black">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-32 text-center space-y-16">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-nova-violet/10 border border-nova-violet/20 rounded-full text-nova-violet text-[10px] font-black uppercase tracking-widest">
              <Clock size={14} /> Temps Restant Avant Clôture
            </div>
            <CountdownTimer targetDate={targetDate} />
            <div className="h-px w-24 bg-white/10 mx-auto" />
            <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Votez pour votre équipe favorite
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
                  className="relative bg-white/[0.04] border border-white/10 rounded-[3rem] overflow-hidden hover:border-nova-violet/40 transition-all duration-700 group flex flex-col h-full backdrop-blur-sm"
                >
                  {i === 0 && team.votes > 0 && (
                    <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-nova-violet text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-xl border border-white/10">
                      <Crown size={12} fill="white" /> EN TÊTE
                    </div>
                  )}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={team.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={team.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-nova-black/90 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="text-nova-violet font-black text-4xl mb-2 opacity-40 italic">#{i + 1}</div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">{team.name}</h3>
                      <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest truncate">{team.members}</p>
                    </div>
                  </div>
                  <div className="p-10 flex-grow flex flex-col justify-between">
                    <div className="space-y-6 mb-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-white/30">Progression</span>
                        <span className="text-[10px] font-black text-white/40">{team.votes.toLocaleString()} / {LIMIT.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (team.votes / LIMIT) * 100)}%` }}
                          className="h-full bg-nova-violet shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                        />
                      </div>
                      <div className="text-[11px] font-black text-white text-center tracking-[0.2em] bg-white/5 py-3 rounded-2xl border border-white/10 uppercase">
                        {team.votes.toLocaleString()} votes sur {LIMIT.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      className="w-full !bg-nova-violet !text-white hover:!opacity-90"
                      variant="accent"
                      onClick={() => setSelectedTeam(team)}
                    >
                      Voter pour ce Binôme
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {teams.length === 0 && (
            <div className="text-center py-32 text-white/20 font-black uppercase tracking-widest text-sm">
              Les candidats seront annoncés prochainement.
            </div>
          )}
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
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
                onClick={() => setSelectedTeam(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-nova-black border border-white/10 w-[min(92vw,42rem)] rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 relative shadow-[0_0_100px_rgba(124,58,237,0.2)] overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-nova-violet/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
                  >
                    <X size={32} />
                  </button>

                  <div className="text-center mb-8 relative z-10">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 border-4 border-nova-violet shadow-[0_0_40px_rgba(124,58,237,0.4)]">
                      <img src={selectedTeam.image} className="w-full h-full object-cover" alt="Selected" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{selectedTeam.name}</h2>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">Saisissez le nombre de votes à attribuer</p>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
                      <button
                        onClick={() => setVoteCount(Math.max(1, voteCount - 1))}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-3xl font-light text-white hover:bg-nova-violet transition-all"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={voteCount}
                        onChange={handleInputChange}
                        className="text-4xl md:text-6xl font-black text-white w-32 md:w-48 text-center bg-transparent border-b-2 border-nova-violet/30 focus:border-nova-violet outline-none py-2 transition-all"
                        min="1"
                      />
                      <button
                        onClick={() => setVoteCount(voteCount + 1)}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center text-3xl font-light text-white hover:bg-nova-violet transition-all"
                      >
                        +
                      </button>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/10">
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Prix par vote</div>
                      <span className="text-2xl font-black text-white">{VOTE_PRICE.toLocaleString()} FCFA</span>
                    </div>

                    <div className="bg-nova-violet/10 p-6 md:p-8 rounded-[2rem] text-center border border-nova-violet/20">
                      <div className="text-[10px] font-black text-nova-violet uppercase tracking-widest mb-1">Montant Total</div>
                      <span className="text-3xl md:text-4xl font-black text-white">{(voteCount * VOTE_PRICE).toLocaleString()} FCFA</span>
                    </div>

                    {!kkiapayLoaded && (
                      <div className="text-center py-4 text-orange-400 text-sm font-medium">
                        Chargement du service de paiement...
                      </div>
                    )}

                    <Button
                      className="w-full py-5 md:py-6"
                      size="lg"
                      variant="accent"
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
            {successVotes !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={() => setSuccessVotes(null)}
              >
                <motion.div
                  initial={{ scale: 0.92, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-lg bg-nova-black border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CheckCircle2 size={56} className="mx-auto mb-6 text-green-400" />
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-4">
                    Vote Enregistré
                  </h3>
                  <p className="text-white/40 font-medium mb-8">
                    Merci ! Votre soutien de <span className="font-black text-white">{successVotes}</span> vote(s) a bien été pris en compte.
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

export default WinnersVoting;
