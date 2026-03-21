
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Youtube, MessageCircle, Facebook, Linkedin } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Participate from './pages/Participate';
import Edition2026 from './pages/Edition2026';
import Winners2025 from './pages/Winners2025';
import Gallery from './pages/Gallery';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Team2026 from './pages/Team2026';
import LiveProgress from './pages/LiveProgress';
import ArchivesHub from './pages/ArchivesHub';
import Voting from './pages/Voting';
import WinnersVoting from './pages/WinnersVoting';
import Login from './pages/Login';
import PaymentCallback from './pages/PaymentCallback';
import { getSiteConfig } from './lib/adminData';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const location = useLocation();
  const [siteConfig, setSiteConfig] = useState({
    hiddenPages: [] as string[],
    isReorganized: false
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const checkConfig = async () => {
      const config = await getSiteConfig();
      setSiteConfig({
        hiddenPages: config.hiddenPages,
        isReorganized: config.isReorganized,
      });
    };
    void checkConfig();
    const interval = setInterval(() => {
      void checkConfig();
    }, 2000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const isHidden = (path: string) => siteConfig.hiddenPages.includes(path);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-nova-red selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            
            {!isHidden('/deroulement') && <Route path="/deroulement" element={<PageWrapper><Edition2026 /></PageWrapper>} />}
            {!isHidden('/etapes-en-cours') && <Route path="/etapes-en-cours" element={<PageWrapper><LiveProgress /></PageWrapper>} />}
            {!isHidden('/laureats-2025') && <Route path="/laureats-2025" element={<PageWrapper><Winners2025 /></PageWrapper>} />}
            {!isHidden('/equipe-2026') && <Route path="/equipe-2026" element={<PageWrapper><Team2026 /></PageWrapper>} />}
            {!isHidden('/galerie') && <Route path="/galerie" element={<PageWrapper><Gallery /></PageWrapper>} />}
            {!isHidden('/partenaires') && <Route path="/partenaires" element={<PageWrapper><Partners /></PageWrapper>} />}
            {!isHidden('/contact') && <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />}
            {!isHidden('/connexion') && <Route path="/connexion" element={<PageWrapper><Login /></PageWrapper>} />}
            
            <Route path="/archives" element={<PageWrapper><ArchivesHub /></PageWrapper>} />
            {!isHidden('/vote') && <Route path="/vote" element={<PageWrapper><Voting /></PageWrapper>} />}
            {!isHidden('/vote-gagnants') && <Route path="/vote-gagnants" element={<PageWrapper><WinnersVoting /></PageWrapper>} />}
            <Route path="/payment-callback" element={<PageWrapper><PaymentCallback /></PageWrapper>} />

            <Route path="/participate" element={<PageWrapper><Participate /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <footer className="py-32 md:py-40 bg-nova-black text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-nova-violet/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 md:gap-20 mb-24">
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-white font-black tracking-tighter text-3xl md:text-4xl mb-8"
              >
                TECH NOVA <span className="text-nova-violet italic font-light">CHALLENGE</span>
              </motion.div>
              <p className="text-gray-500 max-w-sm font-light leading-relaxed text-base md:text-lg">
                Le premier concours d'innovation technologique au Bénin. Nous bâtissons l'infrastructure du futur avec les talents d'aujourd'hui.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet mb-10">Exploration</h4>
              <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-gray-400">
                <li><Link to="/" className="hover:text-white transition-all duration-300">Accueil</Link></li>
                {!isHidden('/etapes-en-cours') && <li><Link to="/etapes-en-cours" className="hover:text-nova-red transition-all duration-300">Live Étapes</Link></li>}
                {siteConfig.isReorganized ? (
                   <li><Link to="/archives" className="hover:text-white transition-all duration-300">Rétrospectives</Link></li>
                ) : (
                   <>
                    {!isHidden('/laureats-2025') && <li><Link to="/laureats-2025" className="hover:text-white transition-all duration-300">Lauréats 2025</Link></li>}
                   </>
                )}
                {!isHidden('/partenaires') && <li><Link to="/partenaires" className="hover:text-white transition-all duration-300">Partenaires</Link></li>}
              </ul>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet mb-10">Soutien</h4>
              <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-gray-400">
                {!isHidden('/contact') && <li><Link to="/contact" className="hover:text-white transition-all duration-300">Contact</Link></li>}
                <li><Link to="/connexion" className="hover:text-white transition-all duration-300 text-nova-red">Se Connecter</Link></li>
                {!isHidden('/vote') && <li><Link to="/vote" className="hover:text-nova-violet transition-all duration-300">Voter</Link></li>}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-violet mb-10">Réseaux</h4>
              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/2290196313068" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-green-500 transition-colors"><MessageCircle size={22} /></a>
                <a href="https://www.facebook.com/share/1Ei8G8HHvC/" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"><Facebook size={22} /></a>
                <a href="https://www.linkedin.com/in/tech-nova-challenge-44b10b359" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-blue-700 transition-colors"><Linkedin size={22} /></a>
                <a href="https://www.youtube.com/@TechNovaChallenge" target="_blank" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"><Youtube size={22} /></a>
              </div>
            </div>
          </div>
          <div className="pt-20 border-t border-white/5 text-gray-600 text-[10px] uppercase font-bold tracking-[0.4em] text-center">
            © 2025-2026 Tech Nova Benin. Excellence is our only standard.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;