import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { MapPin, TrendingUp, Award, ArrowLeft } from 'lucide-react';

const TIERS = [
  { name: 'Bronze',   min: 0,    max: 299,  color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200',  discount: 0,  icon: '🥉' },
  { name: 'Argent',   min: 300,  max: 799,  color: 'text-slate-500',  bg: 'bg-slate-50',   border: 'border-slate-200',  discount: 5,  icon: '🥈' },
  { name: 'Or',       min: 800,  max: 1999, color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200', discount: 10, icon: '🥇' },
  { name: 'Platinum', min: 2000, max: Infinity, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', discount: 15, icon: '💎' },
];

function getTier(pts) {
  return TIERS.find(t => pts >= t.min && pts <= t.max) || TIERS[0];
}

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    api.get(`/api/user-bookings/user/${currentUser.uid}`)
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  const totalPoints = Math.floor(bookings.reduce((s, b) => s + (b.price || 0), 0));
  const totalSpent  = bookings.reduce((s, b) => s + (b.price || 0), 0);
  const tier        = getTier(totalPoints);
  const nextTier    = TIERS[TIERS.indexOf(tier) + 1];
  const progress    = nextTier
    ? Math.min(100, ((totalPoints - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  const avatar      = currentUser?.photoURL;
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Utilisateur';
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>

        {/* Carte profil */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-4">
            {avatar
              ? <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-100" />
              : <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-black ring-4 ring-brand-100">{initials}</div>
            }
            <div>
              <h1 className="text-xl font-black text-slate-900">{displayName}</h1>
              <p className="text-sm text-slate-400">{currentUser?.email}</p>
              <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}>
                {tier.icon} Membre {tier.name}
              </span>
            </div>
          </div>
        </div>

        {/* Points */}
        <div className={`rounded-3xl border p-6 mb-4 ${tier.bg} ${tier.border}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Points fidélité</p>
              {loading
                ? <div className="h-10 w-24 bg-white/60 animate-pulse rounded-xl" />
                : <p className={`text-4xl font-black ${tier.color}`}>{totalPoints.toLocaleString()}</p>
              }
            </div>
            <span className="text-4xl">{tier.icon}</span>
          </div>
          {!loading && (
            nextTier ? (
              <>
                <div className="w-full bg-white/60 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-current transition-all duration-700"
                    style={{ width: `${progress}%`, color: tier.color.replace('text-', '') }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Encore <span className="font-semibold">{(nextTier.min - totalPoints).toLocaleString()} pts</span> pour atteindre {nextTier.icon} {nextTier.name}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500 font-semibold">Niveau maximum atteint 🎉</p>
            )
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Trajets',   value: loading ? '…' : bookings.length,           icon: MapPin },
            { label: 'Dépensé',   value: loading ? '…' : `${totalSpent.toFixed(0)} €`, icon: TrendingUp },
            { label: 'Réduction', value: `${tier.discount} %`,                       icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <Icon size={18} className="text-brand-500 mx-auto mb-1" />
              <p className="text-lg font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Tableau des niveaux */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Niveaux de fidélité</h2>
          <div className="space-y-2">
            {TIERS.map(t => {
              const active = t.name === tier.name;
              return (
                <div key={t.name}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${active ? `${t.bg} ${t.border}` : 'border-transparent hover:bg-slate-50'}`}>
                  <span className="text-xl w-7 text-center">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${active ? t.color : 'text-slate-600'}`}>{t.name}</p>
                    <p className="text-xs text-slate-400">
                      {t.min.toLocaleString()} – {t.max === Infinity ? '∞' : t.max.toLocaleString()} pts
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.discount > 0 && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        -{t.discount}%
                      </span>
                    )}
                    {active && (
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        Actuel
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
            1 euro dépensé = 1 point fidélité. La réduction s'applique automatiquement à votre prochain trajet une fois le niveau atteint.
          </p>
        </div>
      </div>
    </div>
  );
}
