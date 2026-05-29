import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, LogOut, User, Route, Settings, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';
import { PHONE_DISPLAY, PHONE_E164 } from '../config.js';

const NAV_LINKS = [
  { to: '/',           label: 'Accueil' },
  { to: '/services',   label: 'Services' },
  { to: '/reservation', label: 'Réservation' },
  { to: '/entreprise', label: 'Entreprises' },
  { to: '/faq',        label: 'FAQ' },
  { to: '/contact',    label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [showAuth, setShowAuth]         = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const menuRef   = useRef(null);
  const { currentUser, signOut } = useAuth();

  const HERO_PATHS = ['/', '/transfert-cdg-paris', '/chauffeur-prive-orly', '/van-disneyland', '/chauffeur-affaires-la-defense'];
  const hasHero = HERO_PATHS.includes(location.pathname);
  // On inner pages (no dark hero), always show the opaque white header
  const isOpaque = !hasHero || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  // Fermer le menu utilisateur en cliquant à l'extérieur
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnecté');
    setUserMenuOpen(false);
  };

  const avatar = currentUser?.photoURL;
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Mon compte';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOpaque ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-md group-hover:bg-brand-600 transition-colors">
                <span className="text-white font-black text-sm tracking-tight">RN</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-black leading-none transition-colors ${isOpaque ? 'text-slate-900' : 'text-white'}`}>
                  Ride<span className="text-brand-400">Now</span>
                </span>
                <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors ${isOpaque ? 'text-slate-400' : 'text-white/70'}`}>
                  Chauffeur Privé
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`text-sm font-semibold transition-colors hover:text-brand-500 ${
                    location.pathname === to
                      ? 'text-brand-500'
                      : isOpaque ? 'text-slate-700' : 'text-white'
                  }`}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA + Auth */}
            <div className="hidden md:flex items-center gap-3">
              <a href={`tel:${PHONE_E164}`}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isOpaque ? 'text-slate-700' : 'text-white'}`}>
                <Phone size={16} />
                {PHONE_DISPLAY}
              </a>

              {currentUser ? (
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-xl transition-colors text-sm font-semibold min-h-[44px]">
                    {avatar
                      ? <img src={avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      : <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-[11px] font-black">{initials}</div>
                    }
                    <span className="max-w-[100px] truncate">{displayName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1">
                      {/* En-tête */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      </div>
                      {/* Actions */}
                      {[
                        { to: '/profil',      icon: User,     label: 'Mon profil' },
                        { to: '/mes-trajets', icon: Route,    label: 'Mes trajets' },
                        { to: '/parametres',  icon: Settings, label: 'Paramètres' },
                      ].map(({ to, icon: Icon, label }) => (
                        <button key={to}
                          onClick={() => { navigate(to); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          <Icon size={15} className="text-slate-400" />
                          <span className="flex-1 text-left">{label}</span>
                          <ChevronRight size={13} className="text-slate-300" />
                        </button>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => setShowAuth(true)}
                    className={`text-sm font-semibold transition-colors ${isOpaque ? 'text-slate-700 hover:text-brand-500' : 'text-white hover:text-brand-300'}`}>
                    Connexion
                  </button>
                  <Link to="/reservation" className="btn-primary text-sm py-2.5">
                    Réserver
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${isOpaque ? 'text-slate-700' : 'text-white'}`}
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-fade-in">
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === to ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-gray-50'
                  }`}>
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-2">
                <a href={`tel:${PHONE_E164}`} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700">
                  <Phone size={16} className="text-brand-500" /> {PHONE_DISPLAY}
                </a>
                {currentUser ? (
                  <>
                    {[
                      { to: '/profil',      icon: User,     label: 'Mon profil' },
                      { to: '/mes-trajets', icon: Route,    label: 'Mes trajets' },
                      { to: '/parametres',  icon: Settings, label: 'Paramètres' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <Icon size={15} className="text-brand-500" /> {label}
                      </Link>
                    ))}
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut size={15} /> Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setMenuOpen(false); setShowAuth(true); }}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 rounded-xl transition-colors">
                      <User size={15} className="text-brand-500" /> Connexion
                    </button>
                    <Link to="/reservation" className="btn-primary justify-center">
                      Réserver maintenant
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
