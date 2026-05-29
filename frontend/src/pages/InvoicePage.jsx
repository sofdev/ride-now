import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';

const VEHICLE_LABELS = {
  standard: 'Berline Standard',
  premium:  'Berline Premium',
  van:      'Van / Minivan',
  electric: 'Électrique',
};

export default function InvoicePage() {
  const { reference } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    api.get(`/api/user-bookings/${reference}`)
      .then(({ data }) => {
        if (data.userId !== currentUser.uid) { setError('Accès refusé.'); return; }
        setBooking(data);
      })
      .catch(() => setError('Réservation introuvable.'))
      .finally(() => setLoading(false));
  }, [reference, currentUser, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500 mb-4">{error}</p>
        <button onClick={() => navigate('/mes-trajets')} className="btn-secondary text-sm">Retour</button>
      </div>
    </div>
  );

  const bookingDate  = new Date(booking.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const serviceDate  = new Date(booking.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const invoiceNum   = `RN-${booking.reference}`;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 print:bg-white print:pt-0">

      {/* Barre d'actions (masquée à l'impression) */}
      <div className="max-w-2xl mx-auto px-4 mb-6 flex items-center gap-3 print:hidden">
        <button onClick={() => navigate('/mes-trajets')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex-1" />
        <button onClick={() => window.print()}
          className="btn-primary text-sm py-2 gap-2">
          <Printer size={15} /> Imprimer / PDF
        </button>
      </div>

      {/* Facture */}
      <div className="max-w-2xl mx-auto px-4 print:px-0">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-0 print:rounded-none">

          {/* En-tête */}
          <div className="bg-slate-900 px-8 py-8 print:py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-xs">RN</span>
                  </div>
                  <span className="text-white font-black text-xl">RideNow</span>
                </div>
                <p className="text-slate-400 text-xs">Chauffeur Privé · VTC</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Facture</p>
                <p className="text-white font-black text-lg">{invoiceNum}</p>
                <p className="text-slate-400 text-xs mt-1">{bookingDate}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 space-y-6">

            {/* Client */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facturé à</p>
              <p className="font-bold text-slate-900">{booking.userName}</p>
              <p className="text-sm text-slate-500">{booking.userEmail}</p>
            </div>

            <div className="border-t border-gray-100" />

            {/* Détail de la prestation */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Détail de la prestation</p>
              <div className="space-y-3">
                {[
                  ['Date du trajet',    `${serviceDate} à ${booking.time}`],
                  ['Départ',            booking.pickup],
                  ['Arrivée',           booking.dropoff],
                  ['Véhicule',          VEHICLE_LABELS[booking.vehicleType] || booking.vehicleType],
                  ['Passagers',         `${booking.passengers} passager${booking.passengers > 1 ? 's' : ''}`],
                  ['Référence',         `#${booking.reference}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-400 flex-shrink-0 w-36">{label}</span>
                    <span className="text-sm font-semibold text-slate-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Prix fixe · TVA non applicable</p>
                <p className="text-xs text-slate-300 mt-0.5">Art. 293 B du CGI</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Total TTC</p>
                <p className="text-3xl font-black text-slate-900">{booking.price?.toFixed(2)} €</p>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Statut */}
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-semibold text-green-600">Payé · Course confirmée</span>
            </div>

            {/* Pied de page */}
            <div className="bg-slate-50 rounded-2xl p-4 text-center print:bg-gray-50">
              <p className="text-xs text-slate-400 leading-relaxed">
                RideNow — Service de transport de personnes · Merci de votre confiance.<br />
                Pour toute question : <span className="text-brand-500">contact@ridenow.fr</span> · +33 6 12 34 56 78
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
