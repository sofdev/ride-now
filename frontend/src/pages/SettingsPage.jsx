import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Mail, Phone, Loader2, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState(currentUser?.displayName || '');
  const [phone, setPhone]       = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  // Accepte : 06XXXXXXXX, +33 6 XX XX XX XX, +33612345678, avec espaces/tirets
  const PHONE_RE = /^(?:\+33|0033|0)[1-9](?:[\s.\-]?\d{2}){4}$/;

  const validatePhone = (val) => {
    if (!val.trim()) return '';
    return PHONE_RE.test(val.trim()) ? '' : 'Numéro invalide (ex : +33 6 12 34 56 78 ou 0612345678)';
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (phoneTouched) setPhoneError(validatePhone(e.target.value));
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(phone));
  };

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    api.get(`/api/user-profiles/${currentUser.uid}`)
      .then(({ data }) => { if (data?.phone) setPhone(data.phone); })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const err = validatePhone(phone);
    if (err) { setPhoneTouched(true); setPhoneError(err); return; }
    setSaving(true);
    try {
      await Promise.all([
        updateProfile(auth.currentUser, { displayName: name.trim() }),
        api.patch(`/api/user-profiles/${currentUser.uid}`, {
          displayName: name.trim(),
          phone: phone.trim(),
        }),
      ]);
      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
    setSaving(false);
  };

  const isGoogle = currentUser.providerData?.[0]?.providerId === 'google.com';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>

        <h1 className="text-2xl font-black text-slate-900 mb-6">Paramètres</h1>

        {/* Infos personnelles */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-brand-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Informations personnelles</h2>
          </div>
          <form onSubmit={handleSave} className="space-y-4">

            {/* Nom */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Nom affiché</label>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <User size={14} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="flex-1 outline-none text-slate-800 bg-transparent text-sm"
                  placeholder="Votre nom complet" required
                />
              </div>
            </div>

            {/* Email (lecture seule) */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Adresse email</label>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-slate-50">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">{currentUser.email}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 ml-1">
                {isGoogle ? 'Compte Google — email géré par Google.' : "L'email ne peut pas être modifié ici."}
              </p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Numéro de téléphone</label>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                phoneError
                  ? 'border-red-300 ring-2 ring-red-100'
                  : 'border-gray-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100'
              }`}>
                <Phone size={14} className={`flex-shrink-0 ${phoneError ? 'text-red-400' : 'text-slate-400'}`} />
                {loadingProfile
                  ? <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                  : <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      className="flex-1 outline-none text-slate-800 bg-transparent text-sm"
                      placeholder="+33 6 12 34 56 78"
                      autoComplete="tel"
                    />
                }
              </div>
              {phoneError
                ? <p className="text-[11px] text-red-500 mt-1 ml-1">{phoneError}</p>
                : <p className="text-[11px] text-slate-400 mt-1 ml-1">
                    Utilisé par le chauffeur pour vous contacter le jour du trajet.
                  </p>
              }
            </div>

            <button type="submit" disabled={saving || loadingProfile}
              className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-brand-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Confirmation par email</p>
              <p className="text-xs text-slate-400 mt-0.5">Recevoir un email à chaque réservation</p>
            </div>
            <button
              onClick={() => setNotifEmail(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifEmail ? 'bg-brand-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifEmail ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-brand-500" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Sécurité</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">Méthode de connexion</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isGoogle ? 'Google OAuth' : 'Email / Mot de passe'}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {isGoogle ? '🔵 Google' : '📧 Email'}
              </span>
            </div>
            {!isGoogle && (
              <div className="flex items-center justify-between py-2 border-t border-gray-50">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Mot de passe</p>
                  <p className="text-xs text-slate-400 mt-0.5">Dernière modification inconnue</p>
                </div>
                <button className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Modifier
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
