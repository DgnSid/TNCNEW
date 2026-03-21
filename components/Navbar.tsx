
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Rocket } from 'lucide-react';
import Button from './Button.tsx';
import { getBroadcasts, getSiteConfig } from '../lib/adminData.ts';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [siteConfig, setSiteConfig] = useState({
    hiddenPages: [] as string[],
    isReorganized: false
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const checkStatus = async () => {
      const user = localStorage.getItem('tnc_user_name');
      setIsLoggedIn(!!user);

      const config = await getSiteConfig();
      setSiteConfig({
        hiddenPages: config.hiddenPages,
        isReorganized: config.isReorganized,
      });

      if (user) {
        const broadcasts = await getBroadcasts();
        const lastRead = localStorage.getItem('tnc_last_read_colis') || '0';
        const newItems = broadcasts.filter((b: any) => new Date(b.timestamp).getTime() > parseInt(lastRead));
        setUnreadCount(newItems.length);
      }
    };
    
    void checkStatus();
    const interval = setInterval(() => {
      void checkStatus();
    }, 2000); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  let navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Live Étapes', path: '/etapes-en-cours' },
    { name: 'Déroulement', path: '/deroulement' },
    { name: 'Vote de Préselection', path: '/vote' },
    { name: 'Vote Gagnants', path: '/vote-gagnants' },
    { name: 'Lauréats 2025', path: '/laureats-2025' },
    { name: 'Équipe 2026', path: '/equipe-2026' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Partenaires', path: '/partenaires' },
  ];

  // Application des filtres Admin
  navLinks = navLinks.filter(link => !siteConfig.hiddenPages.includes(link.path));

  if (siteConfig.isReorganized) {
    const archivesToHide = ['/laureats-2025', '/equipe-2026', '/galerie'];
    navLinks = navLinks.filter(link => !archivesToHide.includes(link.path));
    const hubLink = { name: 'Rétrospectives', path: '/archives' };
    const partnersIndex = navLinks.findIndex(l => l.path === '/partenaires');
    if (partnersIndex !== -1) {
      navLinks.splice(partnersIndex, 0, hubLink);
    } else {
      navLinks.push(hubLink);
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[500] pointer-events-none flex justify-center pt-4 md:pt-8 px-4 transition-all duration-700">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            pointer-events-auto
            flex items-center justify-between px-5 md:px-10 py-2.5 md:py-3.5
            w-full max-w-[1400px]
            ${scrolled 
              ? 'bg-white/95 backdrop-blur-2xl rounded-full border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]' 
              : 'bg-black/30 backdrop-blur-xl rounded-full border border-white/10 shadow-lg'} 
            transition-all duration-700 ease-in-out
          `}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0">
            <img 
              src="https://i.postimg.cc/pdGN9ZKD/logotncf.png" 
              alt="TNC Logo" 
              className={`h-7 md:h-9 w-auto object-contain transition-all duration-500 rounded-lg p-1 ${scrolled ? 'bg-transparent' : 'bg-white'}`}
            />
          </Link>

          {/* DESKTOP LINKS - Hidden under 1150px for safety */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-7 mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[9px] xl:text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 relative py-2 whitespace-nowrap ${
                  isActive(link.path) 
                    ? (scrolled ? 'text-nova-red' : 'text-white underline decoration-nova-violet decoration-2 underline-offset-8') 
                    : (scrolled ? 'text-nova-black hover:text-nova-red' : 'text-white/80 hover:text-white')
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS & HAMBURGER */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <AnimatePresence mode="wait">
              {isLoggedIn ? (
                <div className="relative hidden sm:block">
                  <Button 
                    key="dashboard-btn"
                    size="sm" 
                    onClick={() => navigate('/dashboard')}
                    className={`!px-5 ${!scrolled ? '!bg-nova-violet !text-white' : ''}`}
                  >
                    <LayoutDashboard size={13} className="mr-2" /> Espace
                  </Button>
                  {unreadCount > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-nova-red text-white text-[8px] md:text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Button 
                  key="login-btn"
                  size="sm" 
                  onClick={() => navigate('/connexion')}
                  className={`hidden sm:inline-flex !px-6 ${!scrolled ? '!bg-white !text-nova-black border-none' : ''}`}
                >
                  Se connecter
                </Button>
              )}
            </AnimatePresence>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 md:p-3 rounded-full transition-all duration-500 relative z-[600] shadow-xl ${
                mobileMenuOpen 
                  ? 'bg-nova-red text-white' 
                  : (scrolled ? 'bg-nova-black text-white' : 'bg-white text-nova-black')
              } lg:hidden`}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </motion.div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[450] bg-white overflow-hidden flex flex-col"
          >
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-nova-violet/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-nova-red/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex-grow flex flex-col pt-32 pb-12 px-8 overflow-y-auto">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.path} 
                    initial={{ x: -30, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link 
                      to={link.path} 
                      className={`group flex items-center justify-between py-5 border-b border-black/5 transition-all ${isActive(link.path) ? 'text-nova-red' : 'text-nova-black'}`}
                    >
                      <span className="text-3xl md:text-4xl font-black uppercase tracking-tighter group-hover:pl-2 transition-all duration-300">{link.name}</span>
                      <motion.div animate={{ x: isActive(link.path) ? 0 : -10, opacity: isActive(link.path) ? 1 : 0 }}>
                         <Rocket size={20} className="text-nova-violet" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-12 space-y-4">
                <Button 
                  size="lg" 
                  variant="accent" 
                  className="w-full !py-6 !rounded-[2rem]" 
                  onClick={() => navigate(isLoggedIn ? '/dashboard' : '/connexion')}
                >
                  {isLoggedIn ? 'Accéder à l\'Espace' : 'Se connecter'}
                </Button>
                
                {isLoggedIn ? (
                  <button 
                    onClick={() => {
                      localStorage.removeItem('tnc_user_email');
                      localStorage.removeItem('tnc_user_name');
                      localStorage.removeItem('tnc_team_name');
                      localStorage.removeItem('tnc_email');
                      localStorage.removeItem('tnc_access_code');
                      localStorage.removeItem('tnc_logged_in');
                      navigate('/');
                    }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-nova-red transition-colors"
                  >
                    Déconnexion
                  </button>
                ) : (
                   <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">
                        © 2026 Tech Nova Challenge
                      </p>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;