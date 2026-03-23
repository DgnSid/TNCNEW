
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Package, ShieldCheck, Trash2, Plus, History, AlertCircle, FileUp, X, Download, FileText, Activity, Image as ImageIcon, Settings, Eye, EyeOff, Layers, Users, Trophy, BarChart3, TrendingUp, Clock, ListTodo, Building2 } from 'lucide-react';
import Button from '../components/Button';
import {
  addBroadcast,
  addLivePhase,
  addPartner,
  addVotingTeam,
  deleteBroadcast,
  deleteLivePhase,
  deletePartner,
  deleteVotingTeam,
  getBroadcasts,
  getLivePhases,
  getPartners,
  getSiteConfig,
  getVotingTeams,
  saveSiteConfig,
} from '../lib/adminData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface Broadcast {
  id: string;
  title: string;
  content: string;
  link?: string;
  fileData?: string;
  fileName?: string;
  timestamp: string;
  type: 'message' | 'file' | 'critical';
}

interface VotingTeam {
  id: string;
  name: string;
  members: string;
  image: string;
  votes: number;
  type: 'public' | 'winners';
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  category: 'enterprise' | 'institution' | 'media';
}

interface LivePhase {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'completed' | 'active' | 'upcoming';
}

const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'tnc-media';
const IMAGE_FOLDERS = {
  partners: 'partners',
  voting: 'voting-teams',
  live: 'live-phases',
} as const;

const Admin: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'colis' | 'partners' | 'votes' | 'stats' | 'live' | 'site'>('colis');
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');

  // Config du site
  const [hiddenPages, setHiddenPages] = useState<string[]>([]);
  const [isReorganized, setIsReorganized] = useState(false);
  const [publicVoteEndDate, setPublicVoteEndDate] = useState('');
  const [winnersVoteEndDate, setWinnersVoteEndDate] = useState('');

  // States Gestion
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [votingTeams, setVotingTeams] = useState<VotingTeam[]>([]);
  const [livePhases, setLivePhases] = useState<LivePhase[]>([]);

  // Form States
  const [cTitle, setCTitle] = useState('');
  const [cContent, setCContent] = useState('');
  const [cFile, setCFile] = useState<{ name: string, data: string } | null>(null);
  const [cType, setCType] = useState<'message' | 'file' | 'critical'>('message');
  
  const [pName, setPName] = useState('');
  const [pLogo, setPLogo] = useState<string | null>(null);
  const [pCat, setPCat] = useState<'enterprise' | 'institution' | 'media'>('enterprise');
  
  const [vtName, setVtName] = useState('');
  const [vtMembers, setVtMembers] = useState('');
  const [vtImage, setVtImage] = useState<string | null>(null);
  const [vtType, setVtType] = useState<'public' | 'winners' | null>(null);

  // Live Phase Form States
  const [lpTitle, setLpTitle] = useState('');
  const [lpDesc, setLpDesc] = useState('');
  const [lpStatus, setLpStatus] = useState<'completed' | 'active' | 'upcoming'>('upcoming');
  const [lpImage, setLpImage] = useState<string | null>(null);

  const [pLogoPreview, setPLogoPreview] = useState<string | null>(null);
  const [vtImagePreview, setVtImagePreview] = useState<string | null>(null);
  const [lpImagePreview, setLpImagePreview] = useState<string | null>(null);

  const [isUploadingPartner, setIsUploadingPartner] = useState(false);
  const [isUploadingVoting, setIsUploadingVoting] = useState(false);
  const [isUploadingLive, setIsUploadingLive] = useState(false);

  const loadAdminData = async () => {
    const config = await getSiteConfig();
    setHiddenPages(config.hiddenPages || ['/vote', '/vote-gagnants']);
    setIsReorganized(config.isReorganized || false);
    setPublicVoteEndDate(config.publicVoteEndDate || '');
    setWinnersVoteEndDate(config.winnersVoteEndDate || '');

    const [loadedBroadcasts, loadedPartners, loadedTeams, loadedPhases] = await Promise.all([
      getBroadcasts(),
      getPartners(),
      getVotingTeams(),
      getLivePhases(),
    ]);

    setBroadcasts(loadedBroadcasts as any);
    setPartners(loadedPartners as any);
    setVotingTeams(loadedTeams as any);
    setLivePhases(loadedPhases as any);
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const updateConfig = async (newHidden: string[], newReorg: boolean, pubEnd: string, winEnd: string) => {
    const config = { hiddenPages: newHidden, isReorganized: newReorg, publicVoteEndDate: pubEnd, winnersVoteEndDate: winEnd };
    setHiddenPages(newHidden);
    setIsReorganized(newReorg);
    setPublicVoteEndDate(pubEnd);
    setWinnersVoteEndDate(winEnd);
    const ok = await saveSiteConfig(config);
    if (!ok) alert("Échec d'enregistrement Supabase. Vérifie les clés env et les policies RLS.");
  };

  const getSafeFileExt = (file: File) => {
    const nameExt = file.name.split('.').pop()?.toLowerCase();
    if (nameExt && /^[a-z0-9]+$/.test(nameExt)) return nameExt;
    if (file.type.startsWith('image/')) return file.type.split('/')[1];
    return 'jpg';
  };

  const uploadImageToStorage = async (file: File, folder: string): Promise<string | null> => {
    if (!isSupabaseConfigured || !supabase) {
      alert("Supabase n'est pas configuré. Vérifie VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.");
      return null;
    }

    const ext = getSafeFileExt(file);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

    if (error) {
      console.error('[storage:upload]', error);
      alert(`Upload image échoué: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    opts: {
      folder: string;
      setValue: (val: string | null) => void;
      setPreview: (val: string | null) => void;
      setUploading: (val: boolean) => void;
    }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    opts.setPreview(previewUrl);
    opts.setUploading(true);

    const url = await uploadImageToStorage(file, opts.folder);

    opts.setUploading(false);
    if (url) {
      opts.setValue(url);
      opts.setPreview(url);
    } else {
      opts.setValue(null);
      opts.setPreview(null);
    }
    URL.revokeObjectURL(previewUrl);
  };

  const handleSendColis = async () => {
    if (!cTitle || !cContent) return;
    const ok = await addBroadcast({
      title: cTitle,
      content: cContent,
      type: cFile ? 'file' : cType,
      fileData: cFile?.data,
      fileName: cFile?.name,
      link: undefined,
    });
    if (!ok) {
      alert("Échec d'enregistrement Supabase. Vérifie les clés env et les policies RLS.");
      return;
    }
    const refreshed = await getBroadcasts();
    setBroadcasts(refreshed as any);
    setCTitle(''); setCContent(''); setCFile(null);
    alert("Colis expédié avec succès !");
  };

  const handleAddPartner = async () => {
    if (!pName || !pLogo) return;
    const ok = await addPartner({ name: pName, logo: pLogo, category: pCat });
    if (!ok) {
      alert("Échec d'enregistrement Supabase. Vérifie les clés env et les policies RLS.");
      return;
    }
    const refreshed = await getPartners();
    setPartners(refreshed as any);
    setPName(''); setPLogo(null); setPLogoPreview(null);
    alert("Partenaire ajouté avec succès !");
  };

  const handleAddVotingTeam = async () => {
    if (!vtName || !vtImage || !vtType) return;
    const ok = await addVotingTeam({ name: vtName, members: vtMembers, image: vtImage, votes: 0, type: vtType });
    if (!ok) {
      alert("Échec d'enregistrement Supabase. Vérifie les clés env et les policies RLS.");
      return;
    }
    const refreshed = await getVotingTeams();
    setVotingTeams(refreshed as any);
    setVtName(''); setVtMembers(''); setVtImage(null); setVtImagePreview(null);
    alert(`Binôme ajouté au ${vtType === 'public' ? 'Vote de Préselection' : 'Vote des Gagnants'} !`);
  };

  const handleAddLivePhase = async () => {
    if (!lpTitle || !lpDesc || !lpImage) return;
    const ok = await addLivePhase({ title: lpTitle, description: lpDesc, status: lpStatus, image: lpImage });
    if (!ok) {
      alert("Échec d'enregistrement Supabase. Vérifie les clés env et les policies RLS.");
      return;
    }
    const refreshed = await getLivePhases();
    setLivePhases(refreshed as any);
    setLpTitle(''); setLpDesc(''); setLpImage(null); setLpImagePreview(null);
    alert("Phase ajoutée au direct !");
  };

  const deleteItem = async (id: string, key: string, stateSetter: any) => {
    if (window.confirm("Supprimer cet élément ?")) {
      if (key === 'tnc_broadcasts') {
        const ok = await deleteBroadcast(id);
        if (!ok) return alert("Suppression refusée par Supabase/RLS.");
        stateSetter(await getBroadcasts());
      } else if (key === 'tnc_partners') {
        const ok = await deletePartner(id);
        if (!ok) return alert("Suppression refusée par Supabase/RLS.");
        stateSetter(await getPartners());
      } else if (key === 'tnc_voting_teams') {
        const ok = await deleteVotingTeam(id);
        if (!ok) return alert("Suppression refusée par Supabase/RLS.");
        stateSetter(await getVotingTeams());
      } else if (key === 'tnc_live_phases') {
        const ok = await deleteLivePhase(id);
        if (!ok) return alert("Suppression refusée par Supabase/RLS.");
        stateSetter(await getLivePhases());
      }
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-nova-black flex items-center justify-center p-6">
        <div className="max-w-md w-full p-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-center backdrop-blur-xl">
          <ShieldCheck size={48} className="text-nova-violet mx-auto mb-8" />
          <h1 className="text-2xl font-black text-white uppercase mb-8">Maître Admin</h1>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Clé d'administration" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white mb-6 outline-none focus:border-nova-violet font-bold text-center" />
          <Button className="w-full" onClick={() => pass === 'YACCEDER12.' && setIsLogged(true)}>Déverrouiller</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 md:px-6 bg-[#0B0F19] text-white">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16 flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div>
            <span className="text-nova-violet font-black tracking-widest uppercase text-[10px] block mb-4 tracking-[0.6em]">Système de Gestion Master</span>
            <h1 className="editorial-title text-4xl md:text-7xl">CONTRÔLE <br /><span className="text-nova-violet italic font-light">STRATÉGIQUE.</span></h1>
          </div>
          <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-3xl border border-white/10">
            {[
              { id: 'colis', label: 'Colis', icon: <Package size={14}/> },
              { id: 'partners', label: 'Partenaires', icon: <Building2 size={14}/> },
              { id: 'live', label: 'Live Phases', icon: <ListTodo size={14}/> },
              { id: 'votes', label: 'Scrutins', icon: <Trophy size={14}/> },
              { id: 'stats', label: 'Stats', icon: <BarChart3 size={14}/> },
              { id: 'site', label: 'Site', icon: <Settings size={14}/> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveAdminTab(tab.id as any)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeAdminTab === tab.id ? 'bg-nova-violet text-white shadow-xl shadow-nova-violet/20' : 'text-gray-500 hover:text-white'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeAdminTab === 'partners' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 h-fit space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-nova-violet flex items-center gap-2"><Plus size={16} /> Nouveau Partenaire</h3>
                  <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Nom du partenaire" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold" />
                  <select value={pCat} onChange={e => setPCat(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold text-white">
                    <option value="enterprise" className="bg-nova-black">Entreprise</option>
                    <option value="institution" className="bg-nova-black">Institution</option>
                    <option value="media" className="bg-nova-black">Média</option>
                  </select>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all overflow-hidden">
                    {(pLogoPreview || pLogo) ? <img src={pLogoPreview || pLogo} className="h-24 w-auto object-contain" /> : <div className="text-center"><ImageIcon className="mx-auto mb-2 text-gray-500" /> <span className="text-[10px] uppercase font-black text-gray-500">Logo du partenaire</span></div>}
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, { folder: IMAGE_FOLDERS.partners, setValue: setPLogo, setPreview: setPLogoPreview, setUploading: setIsUploadingPartner })} />
                  </label>
                  <Button className="w-full" onClick={handleAddPartner} disabled={!pName || !pLogo || isUploadingPartner}>{isUploadingPartner ? 'Upload en cours...' : 'Ajouter Partenaire'}</Button>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Liste des Partenaires</h3>
                  {partners.map(p => (
                    <div key={p.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/10 group">
                       <div className="flex items-center gap-4">
                          <img src={p.logo} className="h-10 w-auto object-contain" />
                          <div className="flex flex-col">
                             <span className="text-xs font-black uppercase">{p.name}</span>
                             <span className="text-[8px] font-black uppercase text-gray-500">{p.category}</span>
                          </div>
                       </div>
                       <button onClick={() => deleteItem(p.id, 'tnc_partners', setPartners)} className="p-3 text-gray-600 hover:text-nova-red opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeAdminTab === 'votes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 h-fit space-y-10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-nova-violet">Nouveau Binôme de Vote</h3>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">1. Sélectionner la phase de vote</label>
                     <div className="flex gap-4">
                        <button onClick={() => setVtType('public')} className={`flex-1 py-4 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${vtType === 'public' ? 'bg-nova-violet border-nova-violet text-white shadow-xl shadow-nova-violet/30' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                           Vote de Préselection
                        </button>
                        <button onClick={() => setVtType('winners')} className={`flex-1 py-4 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${vtType === 'winners' ? 'bg-nova-red border-nova-red text-white shadow-xl shadow-nova-red/30' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                           Vote des Gagnants
                        </button>
                     </div>
                  </div>
                  <AnimatePresence>
                    {vtType && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">2. Détails du binôme</label>
                         <input value={vtName} onChange={e => setVtName(e.target.value)} placeholder="Nom de l'équipe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold" />
                         <input value={vtMembers} onChange={e => setVtMembers(e.target.value)} placeholder="Membres (ex: Jean & Marc)" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold" />
                         <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all overflow-hidden">
                            {(vtImagePreview || vtImage) ? <img src={vtImagePreview || vtImage} className="w-full h-full object-cover" /> : <div className="text-center"><ImageIcon className="mx-auto mb-2 text-gray-500" /> <span className="text-[10px] uppercase font-black text-gray-500">Photo du Binôme</span></div>}
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, { folder: IMAGE_FOLDERS.voting, setValue: setVtImage, setPreview: setVtImagePreview, setUploading: setIsUploadingVoting })} />
                         </label>
                         <Button className="w-full" onClick={handleAddVotingTeam} disabled={!vtName || !vtImage || isUploadingVoting}>{isUploadingVoting ? 'Upload en cours...' : `Publier au Scrutin ${vtType === 'public' ? 'Public' : 'Gagnants'}`}</Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <div className="space-y-12">
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-nova-violet flex items-center gap-2"><Users size={16}/> Binômes Publics</h3>
                     <div className="space-y-2">
                        {votingTeams.filter(t => t.type === 'public').map(v => (
                          <div key={v.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/10 group">
                             <div className="flex items-center gap-4">
                                <img src={v.image} className="w-12 h-12 object-cover rounded-lg" />
                                <span className="text-xs font-black uppercase">{v.name} <span className="text-[8px] text-gray-600 ml-2">({v.votes} pts)</span></span>
                             </div>
                             <button onClick={() => deleteItem(v.id, 'tnc_voting_teams', setVotingTeams)} className="p-3 text-gray-600 hover:text-nova-red opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-nova-red flex items-center gap-2"><Trophy size={16}/> Binômes Gagnants</h3>
                     <div className="space-y-2">
                        {votingTeams.filter(t => t.type === 'winners').map(v => (
                          <div key={v.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/10 group">
                             <div className="flex items-center gap-4">
                                <img src={v.image} className="w-12 h-12 object-cover rounded-lg" />
                                <span className="text-xs font-black uppercase">{v.name} <span className="text-[8px] text-gray-600 ml-2">({v.votes} pts)</span></span>
                             </div>
                             <button onClick={() => deleteItem(v.id, 'tnc_voting_teams', setVotingTeams)} className="p-3 text-gray-600 hover:text-nova-red opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeAdminTab === 'live' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 h-fit space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-nova-violet flex items-center gap-2"><ListTodo size={16} /> Étape Live</h3>
                  <input value={lpTitle} onChange={e => setLpTitle(e.target.value)} placeholder="Titre de l'étape" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold" />
                  <textarea value={lpDesc} onChange={e => setLpDesc(e.target.value)} placeholder="Description..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm h-24" />
                  <select value={lpStatus} onChange={e => setLpStatus(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold text-white">
                    <option value="upcoming" className="bg-nova-black">À venir</option>
                    <option value="active" className="bg-nova-black">En cours</option>
                    <option value="completed" className="bg-nova-black">Terminé</option>
                  </select>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                    {(lpImagePreview || lpImage) ? <img src={lpImagePreview || lpImage} className="h-24 w-full object-cover rounded-xl" /> : <div className="text-center"><ImageIcon className="mx-auto mb-2 text-gray-500" /> <span className="text-[10px] uppercase font-black text-gray-500">Image de la phase</span></div>}
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, { folder: IMAGE_FOLDERS.live, setValue: setLpImage, setPreview: setLpImagePreview, setUploading: setIsUploadingLive })} />
                  </label>
                  <Button className="w-full" onClick={handleAddLivePhase} disabled={!lpTitle || !lpImage || isUploadingLive}>{isUploadingLive ? 'Upload en cours...' : 'Publier Phase Live'}</Button>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Phases Actives</h3>
                  {livePhases.map(lp => (
                    <div key={lp.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/10 group">
                       <div className="flex items-center gap-4">
                          <img src={lp.image} className="w-16 h-12 object-cover rounded-lg" />
                          <div className="flex flex-col">
                             <span className="text-xs font-black uppercase">{lp.title}</span>
                             <span className={`text-[8px] font-black uppercase ${lp.status === 'active' ? 'text-nova-violet' : lp.status === 'completed' ? 'text-green-500' : 'text-gray-500'}`}>{lp.status}</span>
                          </div>
                       </div>
                       <button onClick={() => deleteItem(lp.id, 'tnc_live_phases', setLivePhases)} className="p-3 text-gray-600 hover:text-nova-red opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeAdminTab === 'stats' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10">
                     <span className="text-[10px] font-black text-nova-violet uppercase tracking-[0.4em] block mb-8">Pondération Public (30%) — Seuil 1000</span>
                     <div className="space-y-10">
                        {votingTeams.filter(t => t.type === 'public').map(t => (
                          <div key={t.id} className="space-y-3">
                             <div className="flex justify-between items-end">
                                <span className="text-xs font-black uppercase">{t.name}</span>
                                <span className="text-nova-violet font-black text-xs">{(t.votes / 1000 * 30).toFixed(1)}%</span>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (t.votes / 1000) * 100)}%` }} className="h-full bg-nova-violet" />
                             </div>
                             <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>{t.votes} / 1000 Votes</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white/5 p-10 rounded-[3.5rem] border border-white/10">
                     <span className="text-[10px] font-black text-nova-red uppercase tracking-[0.4em] block mb-8">Pondération Gagnants (40%) — Seuil 2000</span>
                     <div className="space-y-10">
                        {votingTeams.filter(t => t.type === 'winners').map(t => (
                          <div key={t.id} className="space-y-3">
                             <div className="flex justify-between items-end">
                                <span className="text-xs font-black uppercase">{t.name}</span>
                                <span className="text-nova-red font-black text-xs">{(t.votes / 2000 * 40).toFixed(1)}%</span>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (t.votes / 2000) * 100)}%` }} className="h-full bg-nova-red" />
                             </div>
                             <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                <span>{t.votes} / 2000 Votes</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeAdminTab === 'colis' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 h-fit space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-nova-violet mb-8 flex items-center gap-2"><Send size={16} /> Expédier un Colis</h3>
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                    {(['message', 'critical'] as const).map(t => (
                      <button key={t} onClick={() => setCType(t)} className={`flex-1 py-3 rounded-lg text-[8px] font-black uppercase transition-all ${cType === t ? 'bg-nova-violet text-white shadow-lg' : 'text-gray-500'}`}>
                        {t === 'critical' ? 'Urgent' : 'Message'}
                      </button>
                    ))}
                  </div>
                  <input value={cTitle} onChange={e => setCTitle(e.target.value)} placeholder="Objet" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm font-bold" />
                  <textarea value={cContent} onChange={e => setCContent(e.target.value)} placeholder="Message..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-nova-violet text-sm h-32" />
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
                    {cFile ? <div className="text-nova-violet text-xs font-bold">{cFile.name}</div> : <div className="text-center"><FileUp className="mx-auto mb-2 text-gray-500" /> <span className="text-[10px] uppercase font-black text-gray-500">Joindre Fichier</span></div>}
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setCFile({ name: file.name, data: ev.target?.result as string });
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  <Button className="w-full" onClick={handleSendColis}>Expédier</Button>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Historique</h3>
                  {broadcasts.map(b => (
                    <div key={b.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between group">
                       <div className="flex flex-col">
                          <span className="text-xs font-black uppercase">{b.title}</span>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest">{new Date(b.timestamp).toLocaleDateString()}</span>
                       </div>
                       <button onClick={() => deleteItem(b.id, 'tnc_broadcasts', setBroadcasts)} className="p-3 text-gray-600 hover:text-nova-red opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeAdminTab === 'site' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-12">
               <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-10">
                  <h3 className="text-xl font-black uppercase flex items-center gap-3"><Clock size={20} className="text-nova-violet" /> Échéances</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Fin Vote de Préselection</label>
                      <input type="datetime-local" value={publicVoteEndDate} onChange={(e) => updateConfig(hiddenPages, isReorganized, e.target.value, winnersVoteEndDate)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-nova-violet" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Fin Vote Gagnants</label>
                      <input type="datetime-local" value={winnersVoteEndDate} onChange={(e) => updateConfig(hiddenPages, isReorganized, publicVoteEndDate, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-nova-violet" />
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest">Réorganiser le Site</span>
                            <span className="text-[8px] text-gray-500 uppercase">Archive les pages 2025 vers Hub</span>
                         </div>
                         <button 
                            onClick={() => updateConfig(hiddenPages, !isReorganized, publicVoteEndDate, winnersVoteEndDate)} 
                            className={`w-12 h-6 rounded-full relative transition-colors ${isReorganized ? 'bg-nova-violet' : 'bg-white/10'}`}
                         >
                            <motion.div 
                               animate={{ x: isReorganized ? 24 : 4 }} 
                               className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                            />
                         </button>
                      </div>
                    </div>
                  </div>
               </div>
               <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
                  <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-3"><Eye size={20} /> Visibilité</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Vote de Préselection', path: '/vote' },
                      { name: 'Vote des Gagnants', path: '/vote-gagnants' },
                      { name: 'Déroulement 2026', path: '/deroulement' },
                      { name: 'Live Étapes', path: '/etapes-en-cours' },
                    ].map(page => (
                      <div key={page.path} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                         <span className="text-[10px] font-black uppercase tracking-widest">{page.name}</span>
                         <button onClick={() => {
                            const newHidden = hiddenPages.includes(page.path) ? hiddenPages.filter(p => p !== page.path) : [...hiddenPages, page.path];
                            updateConfig(newHidden, isReorganized, publicVoteEndDate, winnersVoteEndDate);
                         }} className={`p-2 rounded-xl transition-all ${hiddenPages.includes(page.path) ? 'bg-nova-red text-white' : 'bg-green-500/20 text-green-500'}`}>
                            {hiddenPages.includes(page.path) ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;