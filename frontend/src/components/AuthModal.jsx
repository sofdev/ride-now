import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, Loader2, Building2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const FIREBASE_ERRORS = {
  'auth/user-not-found':      'Aucun compte avec cet email.',
  'auth/wrong-password':      'Mot de passe incorrect.',
  'auth/invalid-credential':  'Email ou mot de passe incorrect.',
  'auth/email-already-in-use':'Cet email est déjà utilisé.',
  'auth/weak-password':       'Mot de passe trop court (6 caractères min).',
  'auth/invalid-email':       'Adresse email invalide.',
  'auth/popup-closed-by-user':'Fenêtre fermée avant la connexion.',
  'auth/cancelled-popup-request': 'Connexion annulée.',
};

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [tab, setTab]       = useState('login');
  const [form, setForm]     = useState({ name: '', email: '', password: '', inviteCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const switchTab = t => { setTab(t); setError(''); };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      toast.success('Connexion réussie !');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Google auth error:', err.code, err.message);
      setError(FIREBASE_ERRORS[err.code] || `Erreur : ${err.code}`);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        await signIn(form.email, form.password);
        toast.success('Connexion réussie !');
      } else {
        const user = await signUp(form.email, form.password, form.name);

        // Rejoindre une entreprise via code d'invitation
        if (form.inviteCode.trim()) {
          try {
            await api.post(`/api/user-profiles/${user.uid}`, {
              inviteCode:  form.inviteCode.trim(),
              displayName: form.name,
              email:       form.email,
            });
            toast.success('Compte créé et entreprise rejointe !');
          } catch {
            toast('Code d\'invitation invalide — compte créé sans entreprise.', { icon: '⚠️' });
          }
        } else {
          toast.success('Compte créé avec succès !');
        }
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Une erreur est survenue.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto"
            >
              {/* En-tête */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <p className="text-xs text-brand-500 font-bold uppercase tracking-wider mb-1">RideNow</p>
                  <h2 className="text-2xl font-black text-slate-900">
                    {tab === 'login' ? 'Connexion' : 'Créer un compte'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {tab === 'login'
                      ? 'Connectez-vous pour finaliser votre réservation.'
                      : 'Un compte gratuit pour réserver en quelques secondes.'}
                  </p>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 flex-shrink-0 mt-1">
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50 min-h-[44px]"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-slate-400 font-medium">ou par email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 rounded-xl p-1">
                  {[['login', 'Connexion'], ['register', 'Créer un compte']].map(([t, label]) => (
                    <button key={t} onClick={() => switchTab(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        tab === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Erreur */}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <AnimatePresence initial={false}>
                    {tab === 'register' && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                          <User size={15} className="text-slate-400 flex-shrink-0" />
                          <input type="text" placeholder="Prénom et nom" value={form.name}
                            onChange={upd('name')}
                            className="flex-1 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm"
                            required autoComplete="name" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                    <Mail size={15} className="text-slate-400 flex-shrink-0" />
                    <input type="email" placeholder="Email" value={form.email}
                      onChange={upd('email')}
                      className="flex-1 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm"
                      required autoComplete="email" />
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                    <Lock size={15} className="text-slate-400 flex-shrink-0" />
                    <input type="password" placeholder="Mot de passe"
                      value={form.password} onChange={upd('password')}
                      className="flex-1 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm"
                      required minLength={6}
                      autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
                  </div>

                  <AnimatePresence initial={false}>
                    {tab === 'register' && (
                      <motion.div key="invite-field"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                          <Building2 size={15} className="text-slate-400 flex-shrink-0" />
                          <input type="text" placeholder="Code entreprise (optionnel)"
                            value={form.inviteCode} onChange={upd('inviteCode')}
                            className="flex-1 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm uppercase tracking-widest"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 ml-1">Laissez vide si vous n'avez pas de code.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50">
                    {loading
                      ? <Loader2 size={16} className="animate-spin" />
                      : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
