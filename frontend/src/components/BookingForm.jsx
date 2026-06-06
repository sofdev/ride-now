import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Autocomplete, GoogleMap } from '@react-google-maps/api';

registerLocale('fr', fr);
import {
  MapPin, Flag, Calendar, Users, Plus, RotateCcw,
  Briefcase, ChevronRight, CheckCircle2, Loader2, ArrowLeft, Send, CreditCard, Banknote,
  Mail, Phone, MessageSquare, UserCircle2,
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../hooks/useCompany';
import AuthModal from './AuthModal';
import { waLink } from '../config.js';

const CARD_ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: 'Inter, sans-serif',
      color: '#1e293b',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#ef4444' },
  },
};

/* ─── Stripe card form (must be inside <Elements>) ─────────────── */
function StripePayForm({ price, onSuccess, onError, disabled }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setCardError('');
    try {
      // 1. Demander un PaymentIntent au backend
      const { data } = await api.post('/api/stripe/create-payment-intent', { amount: price });
      // 2. Confirmer le paiement avec les données de la carte
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (error) {
        setCardError(error.message);
        onError(error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch {
      onError('Erreur inattendue. Veuillez réessayer.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePay} className="space-y-3">
      <div className="rounded-2xl border border-gray-200 p-4 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
        <CardElement options={CARD_ELEMENT_STYLE} />
      </div>
      {cardError && <p className="text-xs text-red-500 px-1">{cardError}</p>}
      <button
        type="submit"
        disabled={!stripe || loading || disabled}
        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50"
      >
        {loading
          ? <><Loader2 size={18} className="animate-spin" /> Paiement en cours…</>
          : <><CreditCard size={18} /> Payer {price}€ par carte</>}
      </button>
      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        🔒 Paiement sécurisé par Stripe · Données chiffrées SSL
      </p>
    </form>
  );
}

/* ─── PayPal section avec gestion état SDK ──────────────────────── */
function PayPalSection({ loading, validateContact, createOrder, onApprove }) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isRejected) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600">
        PayPal indisponible. Choisissez un autre mode de paiement.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-5 text-sm text-slate-400">
        <Loader2 size={16} className="animate-spin" /> Chargement PayPal…
      </div>
    );
  }

  return (
    <div>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 48 }}
        disabled={loading}
        onClick={(_data, actions) => {
          if (!validateContact()) return actions.reject();
          return actions.resolve();
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={() => toast.error('Erreur PayPal. Veuillez réessayer.')}
      />
      {loading && (
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-brand-500 font-semibold">
          <Loader2 size={16} className="animate-spin" /> Finalisation en cours…
        </div>
      )}
    </div>
  );
}

/* ─── Polyline decoder (Google encoded format) ──────────────────── */
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ''}`;
  return `${m} min`;
}

/* ─── Vehicle catalogue ─────────────────────────────────────────── */
const VEHICLES = [
  {
    id: 'standard',
    name: 'Standard',
    desc: 'Toyota Corolla ou similaire',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
    passengers: 3, bags: 3,
    short: 35, r2: 2.0, r3: 1.5,
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Mercedes Classe E · BMW Série 5',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
    passengers: 3, bags: 4,
    short: 45, r2: 2.5, r3: 2.0,
    badge: 'Le plus populaire',
  },
  {
    id: 'van',
    name: 'Van',
    desc: 'Mercedes Classe V',
    image: 'https://images.pexels.com/photos/17455633/pexels-photo-17455633.jpeg?auto=compress&cs=tinysrgb&w=400',
    passengers: 7, bags: 7,
    short: 60, r2: 3.0, r3: 2.5,
  },
];

const MAP_CENTER = { lat: 48.8566, lng: 2.3522 };
const MAP_OPTIONS = {
  mapId: 'DEMO_MAP_ID',
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
};

function calcPrice(v, km) {
  let p;
  if (km < 10)      p = v.short;
  else if (km < 20) p = v.short + (km - 10) * v.r2;
  else              p = v.short + 10 * v.r2 + (km - 20) * v.r3;
  return Math.round(p * 100) / 100;
}

/* ─── Main component ────────────────────────────────────────────── */
export default function BookingForm() {
  const [params] = useSearchParams();
  const [phase, setPhase] = useState(1);
  const [loading, setLoading]           = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [bookingRef, setBookingRef]     = useState('');
  const [showAuth, setShowAuth]         = useState(false);
  const { currentUser } = useAuth();
  const { company }     = useCompany();

  const [pickup,  setPickup]  = useState(params.get('pickup')  || '');
  const [dropoff, setDropoff] = useState(params.get('dropoff') || '');
  const [pickupPlace,  setPickupPlace]  = useState(null);
  const [dropoffPlace, setDropoffPlace] = useState(null);

  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [passengers, setPassengers] = useState('2');
  const [withReturn, setWithReturn] = useState(false);
  const [selectedId, setSelectedId] = useState(params.get('vehicle') || '');

  const [polylinePath, setPolylinePath] = useState([]);
  const [distanceKm,   setDistanceKm]   = useState(null);
  const [durationTxt,  setDurationTxt]  = useState('');

  const [contact, setContact] = useState({
    firstName: '', lastName: '', email: '', phone: '', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('onboard'); // 'paypal' | 'stripe' | 'onboard'

  const pickupAutoRef    = useRef(null);
  const dropoffAutoRef   = useRef(null);
  const mapRef           = useRef(null);
  const pickupMarkerRef  = useRef(null);
  const dropoffMarkerRef = useRef(null);
  const polylineRef      = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onPickupAutoLoad  = useCallback(a => { pickupAutoRef.current  = a; }, []);
  const onDropoffAutoLoad = useCallback(a => { dropoffAutoRef.current = a; }, []);
  const onMapLoad         = useCallback(map => { mapRef.current = map; setMapLoaded(true); }, []);

  const onPickupChanged = () => {
    const place = pickupAutoRef.current?.getPlace();
    if (place?.geometry) {
      setPickup(place.formatted_address || place.name);
      setPickupPlace(place);
    }
  };

  const onDropoffChanged = () => {
    const place = dropoffAutoRef.current?.getPlace();
    if (place?.geometry) {
      setDropoff(place.formatted_address || place.name);
      setDropoffPlace(place);
    }
  };

  const onPickupInput = (e) => {
    setPickup(e.target.value);
    setPickupPlace(null);
    resetRoute();
  };
  const onDropoffInput = (e) => {
    setDropoff(e.target.value);
    setDropoffPlace(null);
    resetRoute();
  };

  const resetRoute = () => {
    setPolylinePath([]);
    setDistanceKm(null);
    setDurationTxt('');
  };

  const resetMap = () => {
    if (mapRef.current) {
      mapRef.current.setCenter(MAP_CENTER);
      mapRef.current.setZoom(11);
    }
  };

  /* ── Calcul d'itinéraire via le backend (Routes API) ── */
  useEffect(() => {
    if (!pickupPlace?.geometry || !dropoffPlace?.geometry) return;

    setRouteLoading(true);
    resetRoute();

    const originLat = pickupPlace.geometry.location.lat();
    const originLng = pickupPlace.geometry.location.lng();
    const destLat   = dropoffPlace.geometry.location.lat();
    const destLng   = dropoffPlace.geometry.location.lng();

    // Même adresse → prix test 1€
    if (originLat === destLat && originLng === destLng) {
      setDistanceKm(0.001);
      setDurationTxt('0 min');
      setRouteLoading(false);
      return;
    }

    api.post('/api/directions', { originLat, originLng, destLat, destLng })
      .then(({ data }) => {
        setPolylinePath(decodePolyline(data.encodedPolyline));
        setDistanceKm(Math.round(data.distanceMeters / 100) / 10);
        setDurationTxt(formatDuration(data.durationSeconds));
      })
      .catch(() => toast.error('Impossible de calculer cet itinéraire.'))
      .finally(() => setRouteLoading(false));
  }, [pickupPlace, dropoffPlace]);

  /* ── Tracé de l'itinéraire — géré manuellement pour éviter les fantômes ── */
  useEffect(() => {
    if (!mapLoaded) return;
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (polylinePath.length > 0) {
      polylineRef.current = new window.google.maps.Polyline({
        map:           mapRef.current,
        path:          polylinePath,
        strokeColor:   '#0066FF',
        strokeWeight:  5,
        strokeOpacity: 0.85,
      });
    }
  }, [mapLoaded, polylinePath]);

  /* ── Auto-ajustement de la carte quand le tracé est prêt ── */
  useEffect(() => {
    if (!polylinePath.length || !mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    polylinePath.forEach(p => bounds.extend(p));
    mapRef.current.fitBounds(bounds, 60);
  }, [polylinePath]);

  /* ── Marqueur départ (AdvancedMarkerElement) ── */
  useEffect(() => {
    if (!mapLoaded) return;
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.map = null;
      pickupMarkerRef.current = null;
    }
    if (pickupPlace?.geometry) {
      const dot = document.createElement('div');
      dot.style.cssText = 'width:18px;height:18px;background:#0066FF;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,102,.4)';
      pickupMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map:      mapRef.current,
        position: pickupPlace.geometry.location,
        content:  dot,
        title:    pickup,
      });
    }
  }, [mapLoaded, pickupPlace]);

  /* ── Marqueur arrivée (AdvancedMarkerElement) ── */
  useEffect(() => {
    if (!mapLoaded) return;
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.map = null;
      dropoffMarkerRef.current = null;
    }
    if (dropoffPlace?.geometry) {
      const diamond = document.createElement('div');
      diamond.style.cssText = 'width:16px;height:16px;background:#1e293b;border:2px solid #fff;transform:rotate(45deg);box-shadow:0 2px 6px rgba(0,0,0,.4)';
      dropoffMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map:      mapRef.current,
        position: dropoffPlace.geometry.location,
        content:  diamond,
        title:    dropoff,
      });
    }
  }, [mapLoaded, dropoffPlace]);

  /* ── Nettoyage au démontage ── */
  useEffect(() => {
    return () => {
      if (polylineRef.current)      polylineRef.current.setMap(null);
      if (pickupMarkerRef.current)  pickupMarkerRef.current.map = null;
      if (dropoffMarkerRef.current) dropoffMarkerRef.current.map = null;
    };
  }, []);

  /* ── Auto-sélection Van si > 4 passagers ── */
  useEffect(() => {
    const pax = parseInt(passengers);
    if (pax > 4 && selectedId !== 'van') {
      setSelectedId('van');
      toast('Van sélectionné automatiquement pour 5+ passagers', { icon: '🚐' });
    }
  }, [passengers]);

  // Dérive date (YYYY-MM-DD) et time (HH:MM) depuis le picker
  const pad = n => String(n).padStart(2, '0');
  const date = selectedDateTime
    ? `${selectedDateTime.getFullYear()}-${pad(selectedDateTime.getMonth() + 1)}-${pad(selectedDateTime.getDate())}`
    : '';
  const time = selectedDateTime
    ? `${pad(selectedDateTime.getHours())}:${pad(selectedDateTime.getMinutes())}`
    : '';

  // Bloque les créneaux passés (+ 15 min de tampon)
  const filterPassedTime = (t) =>
    new Date(t).getTime() > Date.now() + 15 * 60 * 1000;

  const selectedVehicle = VEHICLES.find(v => v.id === selectedId);
  const price      = selectedVehicle && distanceKm ? calcPrice(selectedVehicle, distanceKm) : null;
  const totalPrice = price ? (withReturn ? Math.round(price * 2 * 100) / 100 : price) : null;
  const upd        = f => e => setContact(c => ({ ...c, [f]: e.target.value }));

  /* ── Création de la réservation (partagée entre paiement à bord et PayPal) ── */
  const createBookingRecord = async ({ paypalOrderId = null, paypalCaptureId = null } = {}) => {
    const { data } = await api.post('/api/bookings', {
      ...contact,
      pickup, dropoff, date, time,
      vehicleType: selectedId,
      passengers,
      estimatedPrice: totalPrice,
      withReturn,
      paymentMethod: paypalOrderId ? 'paypal' : 'onboard',
      paypalOrderId,
      paypalCaptureId,
    });

    if (currentUser) {
      await api.post('/api/user-bookings', {
        reference:   data.reference,
        userId:      currentUser.uid,
        userName:    currentUser.displayName || `${contact.firstName} ${contact.lastName}`,
        userEmail:   currentUser.email,
        companyId:   company?.id || null,
        pickup, dropoff, date, time,
        vehicleType: selectedId,
        passengers,
        price: totalPrice,
        paymentMethod: paypalOrderId ? 'paypal' : 'onboard',
      });
    }

    return data.reference;
  };

  /* ── Submit paiement à bord ── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateContact()) return;
    setLoading(true);
    try {
      const ref = await createBookingRecord();
      setBookingRef(ref);
      setPhase(3);
      toast.success('Réservation confirmée !');
    } catch {
      toast.error('Erreur lors de la réservation. Veuillez réessayer.');
    }
    setLoading(false);
  };

  /* ── PayPal : créer la commande ── */
  const handlePayPalCreateOrder = async () => {
    const { data } = await api.post('/api/paypal/create-order', {
      amount: totalPrice,
      reference: `RN-${Date.now()}`,
    });
    return data.id;
  };

  /* ── PayPal : paiement approuvé ── */
  const handlePayPalApprove = async (data) => {
    setLoading(true);
    try {
      const capture = await api.post(`/api/paypal/capture-order/${data.orderID}`);
      const ref = await createBookingRecord({
        paypalOrderId:   data.orderID,
        paypalCaptureId: capture.data.captureId,
      });
      setBookingRef(ref);
      setPhase(3);
      toast.success('Paiement PayPal confirmé !');
    } catch {
      toast.error('Erreur lors du paiement. Contactez-nous.');
    }
    setLoading(false);
  };

  const handleSelectStripe = () => setPaymentMethod('stripe');

  /* ── Stripe : paiement confirmé par le composant StripePayForm ── */
  const handleStripeSuccess = async (paymentIntentId) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/bookings', {
        ...contact,
        pickup, dropoff, date, time,
        vehicleType: selectedId,
        passengers,
        estimatedPrice: totalPrice,
        withReturn,
        paymentMethod: 'stripe',
        stripePaymentIntentId: paymentIntentId,
      });
      if (currentUser) {
        await api.post('/api/user-bookings', {
          reference: data.reference,
          userId: currentUser.uid,
          userName: currentUser.displayName || `${contact.firstName} ${contact.lastName}`,
          userEmail: currentUser.email,
          companyId: company?.id || null,
          pickup, dropoff, date, time,
          vehicleType: selectedId,
          passengers,
          price: totalPrice,
          paymentMethod: 'stripe',
        });
      }
      setBookingRef(data.reference);
      setPhase(3);
      toast.success('Paiement Stripe confirmé !');
    } catch {
      toast.error('Paiement reçu mais erreur réservation. Contactez-nous.');
    }
    setLoading(false);
  };

  /* ── Validation du formulaire avant d'ouvrir PayPal ── */
  const validateContact = () => {
    if (!contact.firstName || !contact.lastName) {
      toast.error('Veuillez saisir votre nom et prénom');
      return false;
    }
    if (!contact.email) {
      toast.error('Veuillez saisir votre email');
      return false;
    }
    if (!contact.phone) {
      toast.error('Veuillez saisir votre téléphone');
      return false;
    }
    return true;
  };

  /* ════════════════════════════════════════════════════════════════
     Phase 3 — Confirmation
  ═══════════════════════════════════════════════════════════════════ */
  if (phase === 3) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-brand-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Réservation confirmée !</h2>
        <p className="text-slate-500 mb-2">
          Référence : <strong className="text-brand-500 text-xl">#{bookingRef}</strong>
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Un email de confirmation a été envoyé à <strong>{contact.email}</strong>.
        </p>

        {/* Badges de réassurance */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: '✓', label: 'Chauffeur confirmé',   color: 'bg-green-50 text-green-700 border-green-200' },
            { icon: '✓', label: 'Véhicule réservé',     color: 'bg-blue-50  text-blue-700  border-blue-200'  },
            { icon: '✓', label: 'Prix fixe garanti',    color: 'bg-amber-50 text-amber-700 border-amber-200' },
          ].map(({ icon, label, color }) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold ${color}`}
            >
              <span className="font-black">{icon}</span> {label}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => {
              setPhase(1); setSelectedId(''); resetRoute();
              setPickup(''); setDropoff('');
              setPickupPlace(null); setDropoffPlace(null);
              setSelectedDateTime(null);
            }}
            className="btn-secondary"
          >
            Nouvelle réservation
          </button>
          <a
            href={waLink(`Bonjour RideNow, ma référence est #${bookingRef}`)}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary" style={{ background: '#25D366' }}
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </motion.div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     Phase 2 — Coordonnées contact
  ═══════════════════════════════════════════════════════════════════ */
  if (phase === 2) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto"
      >
        <button
          onClick={() => setPhase(1)}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-500 transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Retour au choix du véhicule
        </button>

        {/* ── Récapitulatif trajet — carte hero ── */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100">
          <div className="relative h-24 overflow-hidden">
            <img src={selectedVehicle.image} alt={selectedVehicle.name}
              className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-between px-5">
              <div className="min-w-0">
                <p className="text-white font-black text-lg leading-tight">{selectedVehicle.name}</p>
                <p className="text-white/70 text-xs mt-0.5 truncate max-w-[260px]">{pickup} → {dropoff}</p>
                {durationTxt && (
                  <p className="text-white/50 text-xs mt-0.5">{distanceKm} km · {durationTxt}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-white/50 text-[10px] uppercase tracking-wider">
                  {withReturn ? 'Total A/R' : 'Total'}
                </p>
                <p className="text-white font-black text-3xl leading-none">{totalPrice}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Coordonnées ── */}
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Vos coordonnées</p>

        {/* Champs groupés — pattern Stripe/Apple Pay */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 mb-3">

          {/* Prénom + Nom côte à côte */}
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="px-4 py-3 focus-within:bg-blue-50/40 transition-colors">
              <label htmlFor="b-first" className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <UserCircle2 size={11} /> Prénom *
              </label>
              <input id="b-first" type="text" value={contact.firstName} onChange={upd('firstName')}
                placeholder="Jean" autoComplete="given-name"
                className="w-full outline-none text-slate-900 text-sm font-semibold bg-transparent placeholder:text-slate-300" />
            </div>
            <div className="px-4 py-3 focus-within:bg-blue-50/40 transition-colors">
              <label htmlFor="b-last" className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <UserCircle2 size={11} /> Nom *
              </label>
              <input id="b-last" type="text" value={contact.lastName} onChange={upd('lastName')}
                placeholder="Dupont" autoComplete="family-name"
                className="w-full outline-none text-slate-900 text-sm font-semibold bg-transparent placeholder:text-slate-300" />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 px-4 py-3 focus-within:bg-blue-50/40 transition-colors">
            <Mail size={15} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label htmlFor="b-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Email *
              </label>
              <input id="b-email" type="email" value={contact.email} onChange={upd('email')}
                placeholder="jean@example.com" autoComplete="email"
                className="w-full outline-none text-slate-900 text-sm font-semibold bg-transparent placeholder:text-slate-300" />
            </div>
          </div>

          {/* Téléphone */}
          <div className="flex items-center gap-3 px-4 py-3 focus-within:bg-blue-50/40 transition-colors">
            <Phone size={15} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label htmlFor="b-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Téléphone *
              </label>
              <input id="b-phone" type="tel" value={contact.phone} onChange={upd('phone')}
                placeholder="+33 6 12 34 56 78" autoComplete="tel"
                className="w-full outline-none text-slate-900 text-sm font-semibold bg-transparent placeholder:text-slate-300" />
            </div>
          </div>

        </div>

        {/* Notes — champ séparé */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
          <div className="flex gap-3 px-4 py-3">
            <MessageSquare size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <label htmlFor="b-notes" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Notes (optionnel)
              </label>
              <textarea id="b-notes" value={contact.notes} onChange={upd('notes')}
                placeholder="Vol à attendre, siège bébé, bagages spéciaux…"
                className="w-full outline-none text-slate-900 text-sm font-semibold bg-transparent placeholder:text-slate-300 resize-none h-16" />
            </div>
          </div>
        </div>

        {/* ── Paiement ───────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Paiement</p>

          {/* Sélecteur radio horizontal */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 mb-5">

            {/* PayPal */}
            <button type="button" onClick={() => setPaymentMethod('paypal')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 transition-colors text-left ${
                paymentMethod === 'paypal' ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                paymentMethod === 'paypal' ? 'border-brand-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'paypal' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
              </div>
              <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" aria-hidden="true">
                <path fill="#009cde" d="M20.067 8.478c.492.315.844.825.983 1.43l.001.006c.375 1.694-.878 3.344-2.82 3.795-.113.026-.233.04-.352.04H16.52c-.275 0-.508.197-.552.469l-.407 2.547-.115.719-.106.664H13.58l.678-4.297h.97c2.35 0 4.138-1.484 4.84-3.373zm-7.477-3.63c.432 0 .843.058 1.225.17.98.288 1.658.99 1.872 1.884l.001.006c.267 1.207-.315 2.47-1.525 3.14-.544.3-1.17.47-1.835.47h-1.46c-.275 0-.508.197-.552.469l-.452 2.847-.123.776H8.453L10.02 4.84H12.59z"/>
                <path fill="#012169" d="M8.453 13.61h1.288l.123-.776.452-2.847c.044-.272.277-.469.552-.469h1.46c.665 0 1.29-.17 1.835-.47 1.21-.67 1.792-1.933 1.525-3.14l-.001-.006c-.214-.893-.892-1.596-1.872-1.884A5.18 5.18 0 0 0 12.59 4H10.02L8.453 13.61zm5.127 3.03.115-.719.407-2.547c.044-.272.277-.469.552-.469h1.359c.119 0 .239-.014.352-.04 1.942-.451 3.195-2.1 2.82-3.795l-.001-.006a2.776 2.776 0 0 0-.983-1.43c-.702 1.889-2.49 3.373-4.84 3.373h-.97l-.678 4.297h1.867v-.664z"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">PayPal</p>
                <p className="text-xs text-slate-400">Compte PayPal ou carte via PayPal</p>
              </div>
              <svg viewBox="0 0 48 16" className="h-4 flex-shrink-0 opacity-60" aria-hidden="true">
                <rect x="0" y="0" width="14" height="10" rx="2" fill="#1434CB"/>
                <text x="7" y="8" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">VISA</text>
                <rect x="17" y="0" width="14" height="10" rx="2" fill="#EB001B"/>
                <circle cx="24" cy="5" r="4" fill="#F79E1B" opacity=".8"/>
                <rect x="34" y="0" width="14" height="10" rx="2" fill="#2E77BC"/>
                <text x="41" y="8" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">AMEX</text>
              </svg>
            </button>

            {/* Stripe */}
            <button type="button" onClick={handleSelectStripe}
              className={`w-full flex items-center gap-4 px-4 py-3.5 transition-colors text-left ${
                paymentMethod === 'stripe' ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                paymentMethod === 'stripe' ? 'border-brand-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'stripe' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
              </div>
              <CreditCard size={22} className={`flex-shrink-0 ${paymentMethod === 'stripe' ? 'text-brand-500' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">Carte bancaire</p>
                <p className="text-xs text-slate-400">Visa, Mastercard, American Express</p>
              </div>
              <svg viewBox="0 0 30 10" className="h-4 flex-shrink-0 opacity-60" aria-hidden="true">
                <rect x="0" y="0" width="14" height="10" rx="2" fill="#1434CB"/>
                <text x="7" y="8" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">VISA</text>
                <rect x="16" y="0" width="14" height="10" rx="2" fill="#EB001B"/>
                <circle cx="23" cy="5" r="4" fill="#F79E1B" opacity=".8"/>
              </svg>
            </button>

            {/* Payer à bord */}
            <button type="button" onClick={() => setPaymentMethod('onboard')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 transition-colors text-left ${
                paymentMethod === 'onboard' ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                paymentMethod === 'onboard' ? 'border-brand-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'onboard' && <div className="w-2 h-2 rounded-full bg-brand-500" />}
              </div>
              <Banknote size={22} className={`flex-shrink-0 ${paymentMethod === 'onboard' ? 'text-brand-500' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">Payer à bord</p>
                <p className="text-xs text-slate-400">Espèces ou carte directement au chauffeur</p>
              </div>
            </button>

          </div>

          {/* Contenu selon le mode — avec transition */}
          <AnimatePresence mode="wait">

            {paymentMethod === 'paypal' && (
              <motion.div key="paypal"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}>
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
                  <div className="flex items-center gap-2 mb-4 text-slate-500 text-xs font-semibold">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-green-500 fill-current"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.646 5.646l-4 4a.5.5 0 01-.707 0l-2-2a.5.5 0 01.707-.707L7.293 8.586l3.646-3.647a.5.5 0 01.707.707z"/></svg>
                    Paiement sécurisé · Redirection vers PayPal
                  </div>
                  <PayPalSection
                    loading={loading}
                    validateContact={validateContact}
                    createOrder={handlePayPalCreateOrder}
                    onApprove={handlePayPalApprove}
                  />
                </div>
              </motion.div>
            )}

            {paymentMethod === 'stripe' && (
              <motion.div key="stripe"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}>
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-4 text-slate-500 text-xs font-semibold">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-green-500 fill-current"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.646 5.646l-4 4a.5.5 0 01-.707 0l-2-2a.5.5 0 01.707-.707L7.293 8.586l3.646-3.647a.5.5 0 01.707.707z"/></svg>
                    Chiffrement SSL 256 bits · Propulsé par Stripe
                  </div>
                  <StripePayForm
                    price={totalPrice}
                    disabled={loading}
                    onSuccess={handleStripeSuccess}
                    onError={(msg) => toast.error(msg || 'Erreur de paiement')}
                  />
                </div>
              </motion.div>
            )}

            {paymentMethod === 'onboard' && (
              <motion.div key="onboard"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}>
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Banknote size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-0.5">Règlement en fin de course</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Votre chauffeur accepte les espèces et les cartes bancaires directement dans le véhicule. Aucun prépaiement requis.</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="btn-gold w-full justify-center py-4 text-base disabled:opacity-50"
                >
                  {loading
                    ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours…</>
                    : <><Send size={18} /> Confirmer pour {totalPrice}€</>}
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Badge sécurité global */}
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current text-slate-400"><path d="M8 1l6 2v4.5C14 11 11.5 14 8 15 4.5 14 2 11 2 7.5V3l6-2z"/></svg>
            Paiements 100% sécurisés · Données chiffrées
          </p>
        </div>
      </motion.div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     Phase 1 — Itinéraire + sélection véhicule
  ═══════════════════════════════════════════════════════════════════ */
  const canValidate = selectedId && pickup && dropoff && selectedDateTime;

  return (
    <div className="relative">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Choisissez le véhicule</h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Panneau gauche : formulaire itinéraire ── */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <p className="text-base font-bold text-slate-800 mb-4">Votre itinéraire</p>

            {/* Départ */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200
              focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 bg-white
              transition-all mb-2">
              <MapPin size={16} className="text-brand-500 flex-shrink-0" />
              <Autocomplete
                onLoad={onPickupAutoLoad}
                onPlaceChanged={onPickupChanged}
                options={{ componentRestrictions: { country: 'fr' } }}
                className="flex-1"
              >
                <input
                  type="text"
                  value={pickup}
                  onChange={onPickupInput}
                  placeholder="Adresse de départ"
                  className="w-full outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm"
                />
              </Autocomplete>
              {pickup && (
                <button onClick={() => { setPickup(''); setPickupPlace(null); resetRoute(); resetMap(); }}
                  className="text-slate-300 hover:text-slate-500 transition-colors text-lg leading-none">×</button>
              )}
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200
              focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 bg-white
              transition-all mb-3">
              <Flag size={16} className="text-slate-400 flex-shrink-0" />
              <Autocomplete
                onLoad={onDropoffAutoLoad}
                onPlaceChanged={onDropoffChanged}
                options={{ componentRestrictions: { country: 'fr' } }}
                className="flex-1"
              >
                <input
                  type="text"
                  value={dropoff}
                  onChange={onDropoffInput}
                  placeholder="Adresse de destination"
                  className="w-full outline-none text-slate-800 placeholder-slate-400 bg-transparent text-sm"
                />
              </Autocomplete>
              {dropoff && (
                <button onClick={() => { setDropoff(''); setDropoffPlace(null); resetRoute(); resetMap(); }}
                  className="text-slate-300 hover:text-slate-500 transition-colors text-lg leading-none">×</button>
              )}
            </div>

            <button className="flex items-center gap-1.5 text-brand-500 text-sm font-semibold mb-4 hover:text-brand-700 transition-colors">
              <Plus size={14} /> Ajouter une étape
            </button>

            {/* Date + heure */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Votre trajet aller</p>
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-white transition-all mb-3 ${
              selectedDateTime
                ? 'border-brand-500 ring-2 ring-brand-100'
                : 'border-gray-200'
            }`}>
              <Calendar size={16} className={`flex-shrink-0 ${selectedDateTime ? 'text-brand-500' : 'text-slate-400'}`} />
              <DatePicker
                selected={selectedDateTime}
                onChange={setSelectedDateTime}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy 'à' HH:mm"
                locale="fr"
                minDate={new Date()}
                filterTime={filterPassedTime}
                placeholderText="Date et heure de départ"
                wrapperClassName="flex-1"
                className="w-full outline-none text-slate-800 bg-transparent text-sm cursor-pointer placeholder:text-slate-400"
                calendarStartDay={1}
                autoComplete="off"
                popperPlacement="bottom-start"
              />
            </div>

            {/* Passagers */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200
              focus-within:border-brand-500 bg-white transition-all mb-4">
              <Users size={16} className="text-slate-400 flex-shrink-0" />
              <select value={passengers} onChange={e => setPassengers(e.target.value)}
                className="flex-1 outline-none text-slate-800 bg-transparent text-sm">
                {[1,2,3,4,5,6,7].map(n => (
                  <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Retour */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Votre trajet retour</p>
            <button type="button" onClick={() => setWithReturn(r => !r)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed
                text-sm font-semibold transition-all ${
                withReturn
                  ? 'border-brand-400 bg-brand-50 text-brand-600'
                  : 'border-gray-200 text-slate-400 hover:border-brand-300 hover:text-brand-500'
              }`}>
              {withReturn ? <RotateCcw size={14} /> : <Plus size={14} />}
              {withReturn ? 'Retour ajouté' : 'Ajouter un retour'}
            </button>

            {/* Distance / durée calculée */}
            <AnimatePresence>
              {routeLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 mt-4 text-sm text-brand-500 font-semibold">
                  <Loader2 size={15} className="animate-spin" /> Calcul de l'itinéraire…
                </motion.div>
              )}
              {distanceKm && !routeLoading && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between bg-brand-50 border border-brand-100
                    rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-slate-600 font-medium">📍 {distanceKm} km</span>
                  <span className="text-slate-500">⏱ {durationTxt}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Panneau droit : carte + cartes véhicule ── */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Carte Google Maps */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
            style={{ height: '260px' }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={MAP_CENTER}
              zoom={11}
              options={MAP_OPTIONS}
              onLoad={onMapLoad}
            >
              {/* Tracé et marqueurs gérés via useEffect */}
            </GoogleMap>
          </div>

          {/* Cartes véhicule */}
          <div className="space-y-3">
            {VEHICLES.map(v => {
              const p = distanceKm ? calcPrice(v, distanceKm) : null;
              const isSelected = selectedId === v.id;
              const isDisabled = parseInt(passengers) > v.passengers;

              return (
                <motion.button
                  key={v.id}
                  type="button"
                  onClick={() => !isDisabled && setSelectedId(v.id)}
                  whileTap={isDisabled ? {} : { scale: 0.99 }}
                  disabled={isDisabled}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                    isDisabled
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : isSelected
                        ? 'border-brand-500 bg-brand-50/60 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="w-24 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={v.image} alt={v.name}
                      className="w-full h-full object-cover"
                      loading="lazy" decoding="async" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-slate-900">{v.name}</span>
                      {v.badge && !isDisabled && (
                        <span className="badge bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5">
                          {v.badge}
                        </span>
                      )}
                      {isDisabled && (
                        <span className="badge bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5">
                          Capacité insuffisante
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-2 truncate">{v.desc}</p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600
                        bg-slate-100 px-2 py-0.5 rounded-md">
                        <Users size={11} /> {v.passengers}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600
                        bg-slate-100 px-2 py-0.5 rounded-md">
                        <Briefcase size={11} /> {v.bags}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 mb-0.5">Aller simple</p>
                      {routeLoading ? (
                        <Loader2 size={16} className="animate-spin text-brand-400 ml-auto" />
                      ) : p ? (
                        <motion.p
                          key={p}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xl font-black text-slate-900"
                        >
                          {p}€
                        </motion.p>
                      ) : (
                        <p className="text-sm text-slate-300 font-semibold">—</p>
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      flex-shrink-0 transition-all ${
                      isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-white text-xs font-black">✓</span>}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setPhase(2)}
      />

      {/* ── Barre sticky de validation ── */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="sticky bottom-0 left-0 right-0 mt-6 bg-slate-900 rounded-2xl p-4
              flex items-center justify-between gap-4 shadow-2xl z-10"
          >
            <div className="min-w-0">
              <p className="text-white font-bold truncate">
                {selectedVehicle?.name} sélectionné
              </p>
              {distanceKm && (
                <p className="text-slate-400 text-xs mt-0.5">
                  {distanceKm} km · {durationTxt}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                if (!pickup || !dropoff)   return toast.error('Veuillez saisir départ et destination');
                if (!selectedDateTime)     return toast.error('Veuillez choisir une date et une heure');
                if (!currentUser)          return setShowAuth(true);
                setPhase(2);
              }}
              className="btn-gold flex-shrink-0 py-2.5 text-sm"
            >
              {totalPrice ? `Valider ${withReturn ? 'A/R ' : ''}(${totalPrice}€)` : 'Valider'}
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
