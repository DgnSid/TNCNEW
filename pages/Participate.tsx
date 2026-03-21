import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, User, Key, Mail, Users, Info, Copy, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';

type Step = 1 | 2 | 3 | 4;

const Participate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    teamName: '',
    m1Name: '',
    m1Email: '',
    m2Name: '',
    m2Email: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    accessCode: ''
  });

 const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Évite les caractères ambigus (I, L, O, 0, 1)
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const handleRegister = async () => {
  const code = generateCode();
  setGeneratedCode(code);
  setIsLoading(true);

  try {
    // Appel à l'API d'inscription avec le code généré
    const response = await fetch('https://backend-nova-pkno.onrender.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamName: formData.teamName,
        members: [
          { name: formData.m1Name, email: formData.m1Email.toLowerCase() },
          { name: formData.m2Name, email: formData.m2Email.toLowerCase() }
        ],
        accessCode: code // Envoyer le code généré
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Stocker les infos
      localStorage.setItem('tnc_user_name', formData.m1Name);
      localStorage.setItem('tnc_team_name', formData.teamName);
      localStorage.setItem('tnc_email', formData.m1Email);
      localStorage.setItem('tnc_user_email', formData.m1Email);
      localStorage.setItem('tnc_access_code', code);
      localStorage.setItem('tnc_logged_in', 'true');
      
      setStep(4);
    } else {
      alert(data.error || 'Erreur lors de l\'inscription');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Erreur de connexion au serveur');
  } finally {
    setIsLoading(false);
  }
};

  const handleLogin = async () => {
    if (!loginData.email || !loginData.accessCode) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.technovachallenge.com/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email.toLowerCase(),
          accessCode: loginData.accessCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder les infos
        localStorage.setItem('tnc_user_name', data.data.name);
        localStorage.setItem('tnc_team_name', data.data.teamName);
        localStorage.setItem('tnc_email', data.data.email);
        localStorage.setItem('tnc_user_email', data.data.email);
        localStorage.setItem('tnc_access_code', loginData.accessCode);
        localStorage.setItem('tnc_logged_in', 'true');
        
        // Redirection vers le dashboard
        navigate('/dashboard');
      } else {
        alert(data.error || 'Email ou code incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && loginData.email && loginData.accessCode && !isLoading) {
      handleLogin();
    }
  };

  const nextStep = () => {
    if (step === 3) {
      handleRegister();
    } else {
      setStep((s) => Math.min(s + 1, 4) as Step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopySuccess('Copié !');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const stepsInfo = [
    { id: 1, label: 'Équipe', icon: <Users size={18} /> },
    { id: 2, label: 'Membre 1', icon: <User size={18} /> },
    { id: 3, label: 'Membre 2', icon: <User size={18} /> },
    { id: 4, label: 'Code', icon: <Key size={18} /> }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-6 bg-white overflow-hidden">
      <div className="container mx-auto max-w-2xl">
        
        {/* Toggle Mode */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-gray-100 rounded-full">
            <button 
              onClick={() => { setIsLoginMode(false); setStep(1); }}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isLoginMode ? 'bg-white shadow-sm text-nova-black' : 'text-gray-400'}`}
            >
              S'inscrire
            </button>
            <button 
              onClick={() => setIsLoginMode(true)}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isLoginMode ? 'bg-white shadow-sm text-nova-black' : 'text-gray-400'}`}
            >
              Se connecter
            </button>
          </div>
        </div>

        {!isLoginMode ? (
          <>
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-16 relative px-4">
              <div className="absolute top-[20px] left-0 w-full h-[2px] bg-gray-100 -z-10" />
              {stepsInfo.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{
                      backgroundColor: step >= s.id ? (s.id === 4 ? '#9d0a00' : '#7C3AED') : '#FFFFFF',
                      color: step >= s.id ? '#FFFFFF' : '#D1D5DB',
                      borderColor: step >= s.id ? (s.id === 4 ? '#9d0a00' : '#7C3AED') : '#E5E7EB',
                      scale: step === s.id ? 1.15 : 1
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm"
                  >
                    {step > s.id && s.id < 4 ? <Check size={18} /> : s.icon}
                  </motion.div>
                  <span className={`text-[9px] font-black uppercase tracking-widest text-center ${step === s.id ? 'text-nova-black opacity-100' : 'text-gray-400 opacity-60'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {step < 4 && (
                  <div className="text-center md:text-left mb-8">
                    <h1 className="editorial-title text-4xl md:text-6xl mb-4 text-nova-black">
                      {step === 1 ? 'VOTRE ÉQUIPE' : step === 2 ? 'PREMIER MEMBRE' : 'SECOND MEMBRE'}
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">Inscription du binôme — Étape {step} sur 3</p>
                  </div>
                )}

                <div className="bg-gray-50/50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
                  {step === 1 && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black flex items-center gap-2">NOM DE L'ÉQUIPE <Info size={12} className="text-nova-violet" /></label>
                      <input 
                        value={formData.teamName}
                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                        placeholder="Ex: Nova Alpha"
                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-nova-black text-lg font-bold outline-none focus:border-nova-violet transition-all"
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black">Nom Complet (M1)</label>
                        <input 
                          value={formData.m1Name}
                          onChange={(e) => setFormData({...formData, m1Name: e.target.value})}
                          placeholder="Jean Dupont"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-nova-black text-lg font-bold outline-none focus:border-nova-violet transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black">Email (M1)</label>
                        <input 
                          type="email"
                          value={formData.m1Email}
                          onChange={(e) => setFormData({...formData, m1Email: e.target.value})}
                          placeholder="m1@exemple.bj"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-nova-black text-lg font-bold outline-none focus:border-nova-violet transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black">Nom Complet (M2)</label>
                        <input 
                          value={formData.m2Name}
                          onChange={(e) => setFormData({...formData, m2Name: e.target.value})}
                          placeholder="Marie Martin"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-nova-black text-lg font-bold outline-none focus:border-nova-violet transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black">Email (M2)</label>
                        <input 
                          type="email"
                          value={formData.m2Email}
                          onChange={(e) => setFormData({...formData, m2Email: e.target.value})}
                          placeholder="m2@exemple.bj"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-nova-black text-lg font-bold outline-none focus:border-nova-violet transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="text-center py-6">
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-20 h-20 bg-nova-red rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-xl"
                      >
                        <Check size={36} />
                      </motion.div>
                      
                      <h1 className="editorial-title text-4xl md:text-6xl mb-6 text-nova-black">FÉLICITATIONS.</h1>
                      <p className="text-gray-500 font-medium mb-10">Votre binôme est inscrit. Voici votre code d'accès unique à partager avec votre partenaire :</p>
                      
                      {/* Code d'accès en grand */}
                      <div className="mb-10">
                        <div className="inline-block bg-gray-50 rounded-2xl p-6 md:p-8 mb-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                            VOTRE CODE D'ACCÈS
                          </p>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                          >
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <div className="text-5xl md:text-6xl font-black tracking-widest text-nova-black font-mono">
                                {generatedCode}
                              </div>
                              <button
                                onClick={copyToClipboard}
                                className="p-3 bg-nova-violet text-white rounded-xl hover:bg-nova-violet/90 transition-colors"
                                title="Copier le code"
                              >
                                <Copy size={20} />
                              </button>
                            </div>
                            {copySuccess && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-green-600 text-sm font-medium"
                              >
                                {copySuccess}
                              </motion.div>
                            )}
                          </motion.div>
                        </div>

                        {/* Avertissement important */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-2xl mx-auto">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-left">
                              <h3 className="font-black text-yellow-700 mb-2">⚠️ IMPORTANT : SAUVEGARDEZ CE CODE</h3>
                              <p className="text-yellow-600 text-sm">
                                Ce code à 6 caractères est votre <strong>seul accès</strong> à la compétition.
                                Vous l'utiliserez pour :
                              </p>
                              <ul className="text-yellow-600 text-sm mt-3 space-y-1 pl-5">
                                <li className="list-disc">Accéder à votre dashboard</li>
                                <li className="list-disc">Déposer vos livrables</li>
                                <li className="list-disc">Recevoir les communications importantes</li>
                                <li className="list-disc">Participer aux différentes phases</li>
                              </ul>
                              <p className="text-yellow-700 font-bold mt-4">
                                Notez-le dans un endroit sûr ! Vous ne pourrez pas le récupérer.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        variant="accent" 
                        className="w-full mt-8" 
                        onClick={() => navigate('/dashboard')}
                      >
                        Accéder au Dashboard
                      </Button>
                    </div>
                  )}
                </div>

                {step < 4 && (
                  <div className="flex justify-between items-center pt-4">
                    {step > 1 ? (
                      <button onClick={() => setStep((s) => (s - 1) as Step)} className="text-nova-black/40 hover:text-nova-black font-black uppercase text-[10px] tracking-widest px-6 py-4">Retour</button>
                    ) : <div />}
                    <Button 
                      size="lg" 
                      onClick={nextStep}
                      disabled={
                        (step === 1 && !formData.teamName) ||
                        (step === 2 && (!formData.m1Name || !formData.m1Email)) ||
                        (step === 3 && (!formData.m2Name || !formData.m2Email)) ||
                        isLoading
                      }
                    >
                      {isLoading ? 'Inscription...' : step === 3 ? 'Finaliser' : 'Suivant'} 
                      {!isLoading && step < 3 && <ChevronRight size={18} className="ml-2" />}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <h1 className="editorial-title text-5xl md:text-7xl mb-4 text-nova-black">CONNEXION.</h1>
              <p className="text-gray-500 font-medium">Accédez à votre espace binôme</p>
            </div>

            <div className="bg-gray-50/50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black flex items-center gap-2">
                  <Mail size={14} className="text-nova-violet" /> E-mail
                </label>
                <input
                  name="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  onKeyPress={handleLoginKeyPress}
                  type="email"
                  placeholder="votre.email@exemple.com"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 text-nova-black text-lg font-bold outline-none focus:border-nova-violet focus:ring-1 focus:ring-nova-violet/20 transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black flex items-center gap-2">
                  <Key size={14} className="text-nova-violet" /> Code
                </label>
                <div className="relative">
                  <input
                    name="accessCode"
                    value={loginData.accessCode}
                    onChange={(e) => setLoginData({...loginData, accessCode: e.target.value.toUpperCase()})}
                    onKeyPress={handleLoginKeyPress}
                    type={showCode ? 'text' : 'password'}
                    placeholder="Votre code d'accès"
                    maxLength={9}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-5 pr-12 text-nova-black text-lg font-bold outline-none focus:border-nova-violet focus:ring-1 focus:ring-nova-violet/20 transition-all placeholder:text-gray-300 uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-nova-violet transition-colors"
                  >
                    {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                variant="accent"
                className="w-full"
                onClick={handleLogin}
                disabled={!loginData.email || !loginData.accessCode || isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Participate;