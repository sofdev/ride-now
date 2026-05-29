import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Users, FileText, CheckCircle2,
  Loader2, ChevronRight, Receipt, BarChart3, Shield,
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const PERKS = [
  { icon: Receipt,   title: 'Facturation mensuelle',  desc: 'Une seule facture groupée par mois, prête pour la comptabilité.' },
  { icon: Users,     title: 'Multi-collaborateurs',   desc: 'Chaque employé réserve sous le compte entreprise.' },
  { icon: BarChart3, title: 'Tableau de bord',        desc: 'Suivi des dépenses en temps réel, par employé ou par période.' },
  { icon: Shield,    title: 'Code invitation privé',  desc: 'Maîtrisez qui peut réserver sous votre compte.' },
];

export default function EnterprisePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showAuth,    setShowAuth]    = useState(false);
  const [step,        setStep]        = useState('form');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [inviteCode,  setInviteCode]  = useState('');

  const [form, setForm] = useState({
    name: '', siret: '', vatNumber: '', billingEmail: '', billingAddress: '',
  });
  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!currentUser) { setShowAuth(true); return; }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/companies', {
        ...form,
        adminUid:    currentUser.uid,
        displayName: currentUser.displayName || '',
        email:       currentUser.email,
      });
      setInviteCode(data.company.inviteCode);
      setStep('success');
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === 'Vous avez déjà un compte entreprise') {
        navigate('/entreprise/dashboard');
      } else {
        setError(msg || 'Erreur lors de la création.');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <SEO
        title="Compte Entreprise — RideNow VTC"
        description="Gérez les trajets de vos équipes. Facturation mensuelle, tableau de bord, multi-collaborateurs."
        canonical="/entreprise"
      />

      <section className="bg-slate-900 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge bg-brand-500/20 text-brand-400 mb-4">Compte Entreprise</span>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Simplifiez les trajets<br />
                <span className="text-brand-400">de vos équipes</span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Un seul compte pour toute l'entreprise. Vos collaborateurs réservent en autonomie,
                vous gardez le contrôle et la visibilité.
              </p>
              <ul className="space-y-3">
                {['Facturation mensuelle groupée', 'Invitez vos collaborateurs', 'Tableau de bord complet', 'Aucun engagement'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle2 size={16} className="text-brand-400 flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              {step === 'success' ? (
                <div className="bg-white rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-brand-500" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Compte créé !</h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Partagez ce code à vos collaborateurs pour rejoindre votre compte.
                  </p>
                  <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-4 mb-6">
                    <p className="text-xs text-brand-500 font-bold uppercase tracking-wider mb-1">Code d'invitation</p>
                    <p className="text-3xl font-black text-brand-600 tracking-widest">{inviteCode}</p>
                  </div>
                  <button onClick={() => navigate('/entreprise/dashboard')} className="btn-primary w-full justify-center">
                    Accéder au tableau de bord <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <Building2 size={20} className="text-brand-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Créer votre compte</h2>
                      <p className="text-xs text-slate-400">Gratuit, sans engagement</p>
                    </div>
                  </div>

                  {error && (
                    <p className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">{error}</p>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                      { f: 'name',           label: "Nom de l'entreprise *",          placeholder: 'ACME Corporation',           required: true },
                      { f: 'siret',          label: 'SIRET *',                        placeholder: '123 456 789 00012',          required: true },
                      { f: 'vatNumber',      label: 'N° TVA intracommunautaire',      placeholder: 'FR12345678901',              required: false },
                      { f: 'billingEmail',   label: 'Email de facturation *',         placeholder: 'compta@entreprise.fr',       required: true, type: 'email' },
                      { f: 'billingAddress', label: 'Adresse de facturation *',       placeholder: '12 rue de Paris, 75001 Paris', required: true },
                    ].map(({ f, label, placeholder, required, type }) => (
                      <div key={f}>
                        <label className="label-text">{label}</label>
                        <input type={type || 'text'} value={form[f]} onChange={upd(f)}
                          placeholder={placeholder} required={required} className="input-field" />
                      </div>
                    ))}
                    <button type="submit" disabled={loading}
                      className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50">
                      {loading
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><Building2 size={16} /> Créer le compte entreprise</>}
                    </button>
                    {!currentUser && (
                      <p className="text-xs text-slate-400 text-center">
                        Vous devrez vous connecter pour finaliser la création.
                      </p>
                    )}
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Tout ce dont votre entreprise a besoin</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-brand-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleSubmit} />
    </>
  );
}
