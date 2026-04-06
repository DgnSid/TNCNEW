
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Bell, CheckCircle2, 
  Upload, Palette, Sparkles, LogOut,
  Package, Download, FileText, ExternalLink, AlertTriangle, Key, Copy, MessageCircle, Users
} from 'lucide-react';
import Button from '../components/Button';
import { getBroadcasts } from '../lib/adminData';

interface Broadcast {
  id: string;
  title: string;
  content: string;
  link?: string;
  fileData?: string;
  fileName?: string;
  timestamp: string;
  type: 'message' | 'file' | 'critical' | 'auth';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'missions'>('overview');
  const [teamName, setTeamName] = useState('Innovation Team');
  const [userName, setUserName] = useState('Jean Dupont');
  const [userEmail, setUserEmail] = useState('');
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const savedTeam = localStorage.getItem('tnc_team_name');
    const savedUser = localStorage.getItem('tnc_user_name');
    const savedEmail = localStorage.getItem('tnc_user_email') || localStorage.getItem('tnc_email') || '';
    
    if (savedTeam) setTeamName(savedTeam);
    if (savedUser) setUserName(savedUser);
    if (savedEmail) setUserEmail(savedEmail);
    
    let teamCode = 'NOVA-XXXX';
    if (savedEmail) {
      const recordStr = localStorage.getItem(`tnc_auth_${savedEmail.toLowerCase()}`);
      if (recordStr) {
        teamCode = JSON.parse(recordStr).code;
      }
    }

    const updateMessages = async () => {
      const adminBroadcasts: Broadcast[] = await getBroadcasts();
      const lastRead = localStorage.getItem('tnc_last_read_colis') || '0';

      const staticBroadcasts: Broadcast[] = [
        {
          id: 'auth-code',
          title: '📦 Colis de Sécurité : Votre Code Unique',
          content: `C'est votre clé d'accès exclusive. Partagez ce code uniquement avec votre binôme pour qu'il puisse se connecter à cet espace. Code : ${teamCode}`,
          timestamp: '2026-01-01T00:00:00.000Z',
          type: 'auth'
        },
        {
          id: 'welcome-file',
          title: 'Document Officiel : Fiche d\'Inscription',
          content: 'Vous trouverez ci-joint la fiche d\'inscription à remplir. Téléchargez, complétez et scannez-la pour la phase finale.',
          fileName: 'fiche-tnc-2026.pdf',
          fileData: 'https://example.com/fiche.pdf',
          timestamp: '2026-01-01T00:01:00.000Z',
          type: 'file'
        }
      ];

      const allBroadcasts = [...adminBroadcasts, ...staticBroadcasts];
      setBroadcasts(allBroadcasts);

      // Compter les nouveaux
      const newCount = adminBroadcasts.filter(b => {
        const bTime = new Date(b.timestamp).getTime();
        return bTime > parseInt(lastRead);
      }).length;
      
      setUnreadCount(newCount);
    };

    void updateMessages();
    const interval = setInterval(() => {
      void updateMessages();
    }, 3000);
    window.scrollTo(0, 0);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: 'overview' | 'instructions' | 'missions') => {
    setActiveTab(tab);
    if (tab === 'instructions') {
      // Marquer comme lu
      localStorage.setItem('tnc_last_read_colis', Date.now().toString());
      setUnreadCount(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('tnc_user_email');
    localStorage.removeItem('tnc_email');
    localStorage.removeItem('tnc_user_name');
    localStorage.removeItem('tnc_team_name');
    localStorage.removeItem('tnc_access_code');
    localStorage.removeItem('tnc_logged_in');
    navigate('/'); 
  };

  // Fix: Explicitly defining the MenuItem type to allow optional property 'badge' during mapping.
  const menuItems: { id: 'overview' | 'instructions' | 'missions'; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    // { id: 'instructions', label: 'Réception (Colis)', icon: <Package size={20} />, badge: true },
    // { id: 'missions', label: 'Mon Dossier', icon: <Upload size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-nova-violet selection:text-white flex flex-col overflow-x-hidden">
      
      <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-[80] shadow-sm">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between pt-32 md:pt-40 pb-6 md:pb-8">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-nova-violet text-white flex items-center justify-center shadow-xl shadow-nova-violet/20">
                <Sparkles size={20} />
             </div>
             <div className="flex flex-col">
                <h1 className="text-xs md:text-base font-black uppercase tracking-widest text-nova-black truncate max-w-[140px] md:max-w-[300px] leading-tight">{teamName}</h1>
                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compétiteur Officiel 2026</p>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="group flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border border-gray-100 hover:border-nova-red hover:bg-nova-red/5 transition-all"
          >
            <span className="hidden sm:inline text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-nova-red">Déconnexion</span>
            <LogOut size={16} className="text-gray-300 group-hover:text-nova-red md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12 flex-grow pt-[240px] md:pt-[320px] pb-[100px] lg:pb-24">
        
        <aside className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-2 py-3 lg:relative lg:border-none lg:bg-transparent lg:w-72 lg:p-0 flex lg:flex-col justify-around lg:justify-start gap-1 z-[90]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col lg:flex-row items-center gap-2 lg:gap-5 px-3 lg:px-7 py-3 lg:py-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 w-full lg:mb-3 relative ${
                activeTab === item.id 
                  ? 'bg-nova-violet text-white shadow-2xl shadow-nova-violet/30' 
                  : 'text-gray-400 hover:bg-white hover:shadow-lg'
              }`}
            >
              {item.icon}
              <span className="text-[8px] lg:text-[11px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
              {item.badge && unreadCount > 0 && activeTab !== 'instructions' && (
                <div className="absolute top-2 right-2 lg:relative lg:top-0 lg:right-0 lg:ml-auto w-5 h-5 bg-nova-red text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white lg:border-none shadow-lg lg:shadow-none">
                  {unreadCount}
                </div>
              )}
            </button>
          ))}
        </aside>

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 md:space-y-12"
            >
              {activeTab === 'overview' && (
                <>
                

                  <section className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-sm p-8 md:p-16">
                    <div className="flex items-center gap-4 mb-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet">Fiche Technique</span>
                      <div className="h-px flex-grow bg-gray-50" />
                    </div>

                    <div className="grid lg:grid-cols-[1.3fr,0.9fr] gap-10 lg:gap-14 items-start">
                      <div>
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-nova-violet/10 border border-nova-violet/20 mb-6">
                          <FileText size={16} className="text-nova-violet" />
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-nova-violet">Document Officiel</span>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight text-nova-black mb-6">
                          Chers candidats, le moment est arrivé !
                        </h3>

                        <div className="space-y-6 text-gray-600 text-sm md:text-lg font-medium leading-relaxed">
                          <p>
                            La fiche technique du concours Tech Nova Challenge est désormais disponible. Merci de respecter
                            scrupuleusement les règles et les critères établis. Soyez précis, clairs et bien structurés dans
                            vos rédactions afin de mettre en valeur la qualité de vos projets.
                          </p>

                          <div className="p-5 md:p-6 rounded-2xl bg-nova-violet/5 border border-nova-violet/10">
                            <div className="flex items-center gap-3 mb-3">
                              <AlertTriangle size={18} className="text-nova-violet" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-nova-violet">Date Limite</span>
                            </div>
                            <p className="text-nova-black font-bold text-base md:text-xl">
                              24/04/2026 — Soumission de la fiche technique et envoi de la vidéo.
                            </p>
                            <p className="text-xs md:text-sm text-gray-500 mt-2">
                              Votre vidéo de présentation doit être envoyée au plus tard à cette même date.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-gray-400">Consignes À Suivre</p>
                            <ul className="space-y-3 text-gray-600 text-sm md:text-base">
                              <li className="flex items-start gap-3">
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-nova-red/80" />
                                Toute double soumission entraînera une disqualification automatique.
                              </li>
                              <li className="flex items-start gap-3">
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-nova-red/80" />
                                La durée de la vidéo ne doit pas excéder 5 minutes.
                              </li>
                            </ul>
                          </div>

                          <div className="p-5 md:p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                              <ExternalLink size={16} className="text-nova-black" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Modalité De Soumission</span>
                            </div>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                              À la fin, vous trouverez un lien dans vos comptes. Utilisez le bouton ci-contre pour soumettre votre
                              fiche technique ainsi que votre vidéo directement sur la plateforme.
                            </p>
                          </div>

                          <p className="text-gray-600 text-sm md:text-base">
                            Merci de respecter strictement ces directives afin d’éviter toute sanction. Bonne préparation à tous.
                          </p>
                          <p className="text-xs md:text-sm font-bold text-nova-violet">Le Comité Tech Nova Challenge</p>
                        </div>
                      </div>

                      <div className="bg-[#F7F3FF] border border-nova-violet/20 rounded-[2rem] p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-11 h-11 rounded-2xl bg-nova-violet text-white flex items-center justify-center shadow-lg shadow-nova-violet/20">
                            <Download size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-nova-violet">Actions</p>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">Télécharger et soumettre</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <a
                            href="https://drive.google.com/uc?export=download&id=1w94-KYUcUfuvifEeVoShJEAtnS1eTzjc"
                            download
                            className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-nova-violet text-white font-black text-[10px] md:text-xs uppercase tracking-[0.25em] px-6 py-4 shadow-lg shadow-nova-violet/30 hover:shadow-nova-violet/40 transition-all"
                          >
                            <FileText size={16} />
                            Télécharger La Fiche Technique
                          </a>

                          <button
                            onClick={() => window.open('https://forms.gle/YRauKtJMGkxuGaaX6', '_blank', 'noreferrer')}
                            className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-white border border-nova-violet/20 text-nova-violet font-black text-[10px] md:text-xs uppercase tracking-[0.25em] px-6 py-4 hover:bg-nova-violet/5 transition-all"
                          >
                            <Upload size={16} />
                            Soumettre La Fiche Technique
                          </button>
                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-white/70 border border-white/70 text-xs text-gray-500 leading-relaxed">
                          Pensez à préparer la fiche et la vidéo avant de cliquer sur “Soumettre”. Un seul envoi est autorisé.
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* {activeTab === 'instructions' && (
                <div className="space-y-6 md:space-y-8">
                  {broadcasts.map((b) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={b.id} 
                      className={`bg-white p-8 md:p-12 border border-gray-100 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm relative overflow-hidden group ${b.type === 'auth' ? 'border-l-8 border-l-nova-violet bg-nova-violet/[0.01]' : b.type === 'critical' ? 'border-l-8 border-l-nova-red bg-nova-red/[0.01]' : ''}`}
                    >
                       <div className="flex items-start justify-between mb-8 md:mb-12">
                          <div className={`p-5 rounded-2xl ${b.type === 'auth' ? 'bg-nova-violet text-white' : b.type === 'critical' ? 'bg-nova-red text-white' : 'bg-nova-violet/10 text-nova-violet'}`}>
                             {b.type === 'auth' ? <Key size={24} /> : b.type === 'file' ? <FileText size={24} /> : <Package size={24} />}
                          </div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            {b.timestamp.includes('T') ? new Date(b.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : b.timestamp}
                          </span>
                       </div>
                       <h3 className="text-xl md:text-3xl font-black text-nova-black uppercase mb-6 tracking-tighter leading-tight">{b.title}</h3>
                       <p className="text-gray-500 text-sm md:text-lg font-medium leading-relaxed mb-10">{b.content}</p>
                       
                       {b.fileData && (
                         <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group-hover:border-nova-violet/30 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-nova-violet shadow-sm">
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Document joint</span>
                                  <span className="text-xs md:text-sm font-bold text-nova-black truncate max-w-[150px] md:max-w-xs">{b.fileName}</span>
                               </div>
                            </div>
                            <a href={b.fileData} download={b.fileName} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-nova-violet hover:text-nova-red transition-colors">
                               <Download size={16} /> <span className="hidden sm:inline">Télécharger</span>
                            </a>
                         </div>
                       )}

                       {b.type === 'auth' && (
                         <div className="mt-4 p-8 bg-nova-black text-white rounded-[2rem] text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-nova-violet/20 to-transparent opacity-50" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] block mb-4 relative z-10">VOTRE CODE NOVA UNIQUE</span>
                            <div className="flex items-center justify-center gap-6 relative z-10">
                              <span className="text-3xl md:text-5xl font-black tracking-[0.3em]">{b.content.split(':').pop()?.trim()}</span>
                              <button onClick={() => {
                                navigator.clipboard.writeText(b.content.split(':').pop()?.trim() || '');
                                alert("Code copié avec succès !");
                              }} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                <Copy size={20} />
                              </button>
                            </div>
                         </div>
                       )}
                    </motion.div>
                  ))}
                </div>
              )} */}

              {/* {activeTab === 'missions' && (
                <div className="bg-white rounded-[3rem] md:rounded-[4rem] p-16 md:p-24 text-center border border-gray-100 shadow-sm min-h-[500px] flex flex-col items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-12 text-nova-violet/20">
                     <Upload size={48} />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-nova-black uppercase mb-8 tracking-tighter">Mon Dossier Candidat</h3>
                  <p className="text-gray-400 font-medium text-base md:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
                    Votre candidature est en cours de traitement par le directoire technique.
                  </p>
                </div>
              )} */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="hidden lg:block py-16 text-center border-t border-black/5 bg-white">
         <p className="text-[11px] font-black tracking-[1.2em] text-nova-black/10 uppercase font-display">
            Tableau de Bord Officiel — Tech Nova Challenge.
         </p>
      </footer>
    </div>
  );
};

export default Dashboard;
