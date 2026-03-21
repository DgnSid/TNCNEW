import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Key } from 'lucide-react';
import Button from '../components/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    accessCode: ''
  });
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const user = localStorage.getItem('tnc_user_name');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'accessCode' ? value.toUpperCase() : value 
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.accessCode) {
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
          email: formData.email.toLowerCase(),
          accessCode: formData.accessCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder les infos
        localStorage.setItem('tnc_user_name', data.data.name);
        localStorage.setItem('tnc_team_name', data.data.teamName);
        localStorage.setItem('tnc_email', data.data.email);
        localStorage.setItem('tnc_user_email', data.data.email);
        localStorage.setItem('tnc_access_code', formData.accessCode);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.email && formData.accessCode && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-6 bg-white overflow-hidden">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="editorial-title text-4xl md:text-6xl mb-4 text-nova-black">
            SE CONNECTER
          </h1>
          <p className="text-gray-500 font-medium text-sm">Accédez à votre espace personnel.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50/50 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-10"
        >
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-black flex items-center gap-2">
              <Mail size={14} className="text-nova-violet" /> E-mail
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
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
                value={formData.accessCode}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                type={showCode ? 'text' : 'password'}
                placeholder="Votre code d'accès"
                maxLength={6}
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
            disabled={!formData.email || !formData.accessCode || isLoading}
          >
            {isLoading ? 'Connexion...' : 'se connecter'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;