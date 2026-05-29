import { Phone } from 'lucide-react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SEO from '../components/SEO.jsx';
import BookingForm from '../components/BookingForm.jsx';
import Footer from '../components/Footer.jsx';
import { PHONE_DISPLAY, PHONE_E164, waLink } from '../config.js';

const PAYPAL_OPTIONS = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'EUR',
  intent: 'capture',
  locale: 'fr_FR',
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');


const BOOKING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Réservation VTC RideNow',
  url: 'https://ridenow.fr/reservation',
  description: 'Réservez votre chauffeur VTC premium en ligne. Confirmation immédiate par email.',
};

export default function BookingPage() {
  return (
    <>
      <SEO
        title="Réservation en ligne — Chauffeur VTC Paris"
        description="Réservez votre chauffeur VTC en quelques clics. Choisissez votre véhicule, saisissez votre itinéraire et obtenez un prix immédiat. Disponible 24h/24."
        canonical="/reservation"
        schema={BOOKING_SCHEMA}
      />

      {/* Main content */}
      <PayPalScriptProvider options={PAYPAL_OPTIONS}>
      <Elements stripe={stripePromise}>
      <section className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

          {/* Booking form — full width */}
          <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <BookingForm />
          </div>

          {/* Bottom cards — guarantees, help, whatsapp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch" aria-label="Garanties RideNow">

            {/* Nos garanties — 2×3 grid of items */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-bold text-slate-900 mb-4 text-base">Nos garanties</h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  ['✅', 'Prix fixe garanti'],
                  ['✅', 'Annulation gratuite'],
                  ['✅', 'Chauffeur certifié VTC'],
                  ['✅', 'Véhicule récent climatisé'],
                  ['✅', 'Espèces ou carte'],
                  ['✅', 'Facturation disponible'],
                ].map(([icon, text]) => (
                  <li key={text} className="flex items-center gap-2 text-sm text-slate-600">
                    <span>{icon}</span> {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aide + WhatsApp empilés */}
            <div className="flex flex-col gap-4">
              <div className="bg-brand-500 rounded-2xl p-6 text-white flex items-center justify-between gap-4 flex-1">
                <div>
                  <h2 className="font-bold text-base mb-0.5">Besoin d'aide ?</h2>
                  <p className="text-white/70 text-sm">Disponible 24h/24 · 7j/7</p>
                </div>
                <a href={`tel:${PHONE_E164}`}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap min-h-[44px] flex-shrink-0">
                  <Phone size={15} /> {PHONE_DISPLAY}
                </a>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center justify-between gap-4 flex-1">
                <div>
                  <h2 className="font-bold text-slate-900 text-base mb-0.5">Réservation rapide</h2>
                  <p className="text-slate-500 text-sm">Réponse en moins de 2 min</p>
                </div>
                <a
                  href={waLink('Bonjour, je souhaite réserver un VTC.')}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap min-h-[44px] flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
      </Elements>
      </PayPalScriptProvider>

      <Footer />
    </>
  );
}
