import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete } from '@react-google-maps/api';
import { MapPin, ArrowRightLeft, Car, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const VEHICLE_ICONS = { standard: '🚗', premium: '🚙', van: '🚐' };
const VEHICLE_LABELS = { standard: 'Standard', premium: 'Premium', van: 'Van' };

export default function PriceEstimator() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupPlace, setPickupPlace] = useState(null);
  const [dropoffPlace, setDropoffPlace] = useState(null);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('premium');
  const navigate = useNavigate();

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const onPickupLoad = useCallback((auto) => { pickupRef.current = auto; }, []);
  const onDropoffLoad = useCallback((auto) => { dropoffRef.current = auto; }, []);

  const onPickupChanged = () => {
    const place = pickupRef.current?.getPlace();
    if (place) { setPickup(place.formatted_address || place.name); setPickupPlace(place); }
  };

  const onDropoffChanged = () => {
    const place = dropoffRef.current?.getPlace();
    if (place) { setDropoff(place.formatted_address || place.name); setDropoffPlace(place); }
  };

  const swapAddresses = () => {
    setPickup(dropoff); setDropoff(pickup);
    setPickupPlace(dropoffPlace); setDropoffPlace(pickupPlace);
    setPrices(null);
  };

  const handleEstimate = async () => {
    if (!pickupPlace?.geometry || !dropoffPlace?.geometry) return;
    setLoading(true);
    try {
      const { data: route } = await api.post('/api/directions', {
        originLat: pickupPlace.geometry.location.lat(),
        originLng: pickupPlace.geometry.location.lng(),
        destLat:   dropoffPlace.geometry.location.lat(),
        destLng:   dropoffPlace.geometry.location.lng(),
      });
      const distanceKm = Math.round(route.distanceMeters / 100) / 10;
      const { data } = await api.post('/api/pricing/calculate', { distanceKm });
      setPrices({ ...data, distanceKm });
    } catch {
      const distanceKm = 30;
      const calc = (short, r2, r3) => {
        let p;
        if (distanceKm < 10)      p = short;
        else if (distanceKm < 20) p = short + (distanceKm - 10) * r2;
        else                      p = short + 10 * r2 + (distanceKm - 20) * r3;
        return Math.round(p * 100) / 100;
      };
      setPrices({
        standard: calc(35, 2.0, 1.5),
        premium:  calc(45, 2.5, 2.0),
        van:      calc(60, 3.0, 2.5),
        isFixed: false,
        distanceKm,
      });
    }
    setLoading(false);
  };

  const handleBook = () => {
    navigate(`/reservation?vehicle=${selected}&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`);
  };

  return (
    <section className="py-24 bg-white" id="estimateur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — title */}
          <div>
            <span className="badge bg-brand-100 text-brand-600 mb-4">Tarifs transparents</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Estimez votre trajet
              <span className="text-brand-500"> en 10 secondes</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Renseignez votre point de départ et d'arrivée pour obtenir une estimation instantanée.
              Prix fixés à l'avance, aucune surprise.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { emoji: '✓', label: 'Prix fixe garanti' },
                { emoji: '✓', label: 'Pas de surcharge' },
                { emoji: '✓', label: 'Paiement simple' },
              ].map(({ emoji, label }) => (
                <div key={label} className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-2xl mb-1">{emoji}</p>
                  <p className="text-xs font-semibold text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — estimator card */}
          <div className="card p-8">
            <div className="space-y-4 mb-6">

              {/* Pickup */}
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Point de départ
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none" />
                  <Autocomplete
                    onLoad={onPickupLoad}
                    onPlaceChanged={onPickupChanged}
                    options={{ componentRestrictions: { country: 'fr' } }}
                  >
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => { setPickup(e.target.value); setPrices(null); }}
                      placeholder="Adresse de départ..."
                      className="input-field pl-10"
                    />
                  </Autocomplete>
                </div>
              </div>

              {/* Swap button */}
              <div className="flex justify-center">
                <button
                  onClick={swapAddresses}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-slate-400 hover:border-brand-500 hover:text-brand-500 hover:rotate-180 transition-all duration-300 bg-white shadow-sm"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* Dropoff */}
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  Destination
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" />
                  <Autocomplete
                    onLoad={onDropoffLoad}
                    onPlaceChanged={onDropoffChanged}
                    options={{ componentRestrictions: { country: 'fr' } }}
                  >
                    <input
                      type="text"
                      value={dropoff}
                      onChange={(e) => { setDropoff(e.target.value); setPrices(null); }}
                      placeholder="Adresse d'arrivée..."
                      className="input-field pl-10"
                    />
                  </Autocomplete>
                </div>
              </div>
            </div>

            <button
              onClick={handleEstimate}
              disabled={!pickup || !dropoff || loading}
              className="btn-primary w-full justify-center py-4 text-base mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Calcul en cours...' : 'Estimer le prix'}
            </button>

            {/* Results */}
            <AnimatePresence>
              {prices && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-100 pt-6">
                    {prices.distanceKm && (
                      <p className="text-xs text-slate-400 text-center mb-4">
                        Distance estimée : ~{Math.round(prices.distanceKm)} km
                      </p>
                    )}
                    <div className="space-y-3">
                      {['standard', 'premium', 'van'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelected(type)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            selected === type
                              ? 'border-brand-500 bg-brand-50'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{VEHICLE_ICONS[type]}</span>
                            <div className="text-left">
                              <p className="font-bold text-slate-900">{VEHICLE_LABELS[type]}</p>
                              <p className="text-xs text-slate-400">
                                {type === 'van' ? '7 passagers' : '3 passagers'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-brand-500">{prices[type]}€</p>
                            <p className="text-xs text-slate-400">{prices.isFixed ? 'Prix fixe' : 'Estimé'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBook}
                      className="btn-gold w-full justify-center py-4 mt-4 text-base"
                    >
                      Réserver pour {prices[selected]}€
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
