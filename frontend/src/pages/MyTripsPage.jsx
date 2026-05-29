import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Car, Users, ArrowLeft, FileText, X, AlertTriangle, Loader2 } from 'lucide-react';

const VEHICLE_LABELS = {
  standard: 'Berline Standard',
  premium:  'Berline Premium',
  van:      'Van / Minivan',
  electric: 'Électrique',
};

function CancelModal({ booking, onClose, onConfirm, loading }) {
  const tripDate       = new Date(`${booking.date}T${booking.time}`);
  const now            = new Date();
  const hoursUntilTrip = (tripDate - now) / (1000 * 60 * 60);
  const isFree         = hoursUntilTrip >= 2;
  const fee            = isFree ? 0 : Math.round((booking.price || 0) * 0.20 * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors">
          <X size={18} />
        </button>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          isFree ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          <AlertTriangle size={22} className={isFree ? 'text-green-500' : 'text-amber-500'} />
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-1">Annuler la réservation</h3>
        <p className="text-sm text-slate-400 mb-5">#{booking.reference}</p>

        {isFree ? (
          <div className="rounded-2xl bg-green-50 border border-green-100 p-4 mb-5">
            <p className="text-sm font-bold text-green-700 mb-1">Annulation gratuite</p>
            <p className="text-xs text-green-600">
              Le trajet est dans plus de 2h. Aucun frais ne sera prélevé.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mb-5">
            <p className="text-sm font-bold text-amber-700 mb-1">
              Frais d'annulation : {fee}€
            </p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Le trajet est dans moins de 2h. Conformément à notre politique, 20% du prix ({fee}€) vous sera facturé.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Conserver
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-2 ${
              isFree
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-amber-500 hover:bg-amber-600'
            } disabled:opacity-60`}
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Annulation…</>
              : 'Confirmer l\'annulation'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TripCard({ booking, onCancel }) {
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const tripDate    = new Date(`${booking.date}T${booking.time}`);
  const now         = new Date();
  const isPast      = tripDate < now;
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';

  const canCancel = !isPast && !isCancelled && !isCompleted;

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      const { data } = await api.patch(`/api/user-bookings/${booking.reference}/cancel`);
      setShowModal(false);
      onCancel(booking.reference, data.fee);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Erreur lors de l\'annulation');
    }
    setCancelling(false);
  };

  const statusBadge = () => {
    if (isCancelled) return (
      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-500">
        Annulé
      </span>
    );
    if (isCompleted || isPast) return (
      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
        Terminé
      </span>
    );
    return (
      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-600">
        ● Planifié
      </span>
    );
  };

  return (
    <>
      <div className={`bg-white rounded-2xl border p-4 hover:shadow-sm transition-shadow ${
        isCancelled ? 'border-red-100 opacity-70' : 'border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-3">
          {statusBadge()}
          <span className="text-xs text-slate-300 font-mono">#{booking.reference}</span>
        </div>

        {/* Trajet */}
        <div className="relative pl-5 space-y-2 mb-3">
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-200" />
          <div className="flex items-start gap-2">
            <div className="absolute left-0 w-3 h-3 rounded-full bg-brand-500 ring-2 ring-white mt-0.5" />
            <p className="text-sm text-slate-700 font-medium leading-tight">{booking.pickup}</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="absolute left-0 bottom-0 w-3 h-3 rounded-sm bg-slate-800 ring-2 ring-white" />
            <p className="text-sm text-slate-700 font-medium leading-tight">{booking.dropoff}</p>
          </div>
        </div>

        {/* Infos */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {tripDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {booking.time}
          </span>
          <span className="flex items-center gap-1">
            <Car size={11} />
            {VEHICLE_LABELS[booking.vehicleType] || booking.vehicleType}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {booking.passengers} passager{booking.passengers > 1 ? 's' : ''}
          </span>
        </div>

        {isCancelled && booking.cancellationFee > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-3">
            <AlertTriangle size={11} />
            Frais d'annulation prélevés : {booking.cancellationFee}€
          </div>
        )}

        <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-base font-black text-slate-900">{booking.price?.toFixed(2)} €</p>
            {booking.companyId && (
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">Professionnel</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <X size={12} /> Annuler
              </button>
            )}
            {(isPast || isCompleted) && !isCancelled && (
              <Link to={`/facture/${booking.reference}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors">
                <FileText size={12} /> Facture
              </Link>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <CancelModal
            booking={booking}
            loading={cancelling}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmCancel}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function MyTripsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]           = useState('planned');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    api.get(`/api/user-bookings/user/${currentUser.uid}`)
      .then(({ data }) => setBookings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  const handleCancel = (reference, fee) => {
    setBookings(prev => prev.map(b =>
      b.reference === reference
        ? { ...b, status: 'cancelled', cancellationFee: fee }
        : b
    ));
    if (fee > 0) {
      toast(`Réservation annulée — frais d'annulation : ${fee}€`, { icon: '⚠️' });
    } else {
      toast.success('Réservation annulée gratuitement');
    }
  };

  const now       = new Date();
  const planned   = bookings.filter(b => b.status !== 'cancelled' && new Date(`${b.date}T${b.time}`) >= now);
  const past      = bookings.filter(b => b.status === 'cancelled' || new Date(`${b.date}T${b.time}`) < now);
  const list      = tab === 'planned' ? planned : past;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>

        <h1 className="text-2xl font-black text-slate-900 mb-1">Mes trajets</h1>
        <p className="text-xs text-slate-400 mb-6">
          Annulation gratuite jusqu'à 2h avant le départ · 20% de frais en dessous
        </p>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-100 p-1 mb-6 shadow-sm">
          {[
            ['planned', 'Planifiés',  planned.length],
            ['past',    'Historique', past.length],
          ].map(([t, label, count]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                tab === t ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                tab === t ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {loading ? '…' : count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-slate-500 font-semibold">
              Aucun trajet {tab === 'planned' ? 'planifié' : 'dans l\'historique'}
            </p>
            {tab === 'planned' && (
              <button onClick={() => navigate('/reservation')}
                className="btn-primary mt-5 text-sm py-2.5 px-6">
                Réserver maintenant
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {list.map(b => (
              <TripCard key={b.reference} booking={b} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
