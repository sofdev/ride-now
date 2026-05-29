import { Link } from 'react-router-dom';
import { PHONE_E164 } from '../config.js';
import { Shield, Clock, Award, PhoneCall, Tag, PlaneTakeoff, Car, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import PriceEstimator from '../components/PriceEstimator.jsx';
import FleetSection from '../components/FleetSection.jsx';
import TestimonialsSection from '../components/TestimonialsSection.jsx';
import Footer from '../components/Footer.jsx';

const WHY_US = [
  { icon: Shield,       title: 'Chauffeurs VTC certifiés',   desc: 'Carte professionnelle VTC obligatoire. Chauffeurs formés, vérifiés et évalués après chaque course.' },
  { icon: Tag,          title: 'Prix fixes garantis',        desc: 'Le prix affiché est le prix payé. Zéro surprise, zéro surcharge, même en heure de pointe.' },
  { icon: Clock,        title: 'Annulation gratuite',        desc: 'Annulez sans frais jusqu\'à 1h avant le départ. Votre flexibilité, notre priorité.' },
  { icon: PhoneCall,    title: 'Support 24/7',               desc: 'Notre équipe est joignable à toute heure par téléphone ou WhatsApp pour toute demande urgente.' },
  { icon: PlaneTakeoff, title: 'Suivi des vols',             desc: 'Surveillance en temps réel de votre vol. Le chauffeur s\'adapte automatiquement aux retards.' },
  { icon: Car,          title: 'Véhicules récents',          desc: 'Flotte entretenue et renouvelée régulièrement : Mercedes, BMW, Volkswagen — moins de 3 ans.' },
  { icon: Umbrella,     title: 'Assurance professionnelle',  desc: 'Tous nos véhicules sont couverts par une assurance professionnelle transport de personnes.' },
];

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://ridenow.fr/#business',
      name: 'RideNow — Chauffeur VTC Premium Paris',
      url: 'https://ridenow.fr/',
      telephone: '+33683109314',
      priceRange: '€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Carte de crédit, Espèces, PayPal',
      openingHours: 'Mo-Su 00:00-24:00',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Paris',
        addressRegion: 'Île-de-France',
        postalCode: '75000',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.8566,
        longitude: 2.3522,
      },
      areaServed: [
        { '@type': 'State',              name: 'Île-de-France' },
        { '@type': 'City',               name: 'Paris' },
        { '@type': 'Airport',            name: 'Aéroport Charles-de-Gaulle (CDG)' },
        { '@type': 'Airport',            name: 'Aéroport de Paris-Orly' },
        { '@type': 'TouristAttraction',  name: 'Disneyland Paris' },
        { '@type': 'Place',              name: 'La Défense' },
        { '@type': 'City',               name: 'Versailles' },
        { '@type': 'City',               name: 'Roissy-en-France' },
      ],
      sameAs: [
        'https://ridenow.fr',
      ],
      image: 'https://ridenow.fr/og-image.jpg',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services VTC',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Transfert CDG Paris',              url: 'https://ridenow.fr/transfert-cdg-paris' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Chauffeur Privé Orly',             url: 'https://ridenow.fr/chauffeur-prive-orly' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Van Disneyland Paris',             url: 'https://ridenow.fr/van-disneyland' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Chauffeur d'Affaires La Défense",  url: 'https://ridenow.fr/chauffeur-affaires-la-defense' } },
        ],
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://ridenow.fr/#webpage',
      name: 'VTC Paris Aéroport CDG Orly Disneyland — Chauffeur Privé RideNow',
      url: 'https://ridenow.fr/',
      about: { '@id': 'https://ridenow.fr/#business' },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2'] },
    },
  ],
};

export default function Home() {
  return (
    <>
      <SEO
        title="VTC Paris Aéroport CDG Orly Disneyland — Chauffeur Privé"
        description="RideNow, chauffeur VTC premium Paris. Transfert aéroport CDG dès 55€, Orly dès 40€, van Disneyland 7 places, chauffeur d'affaires La Défense. Prix fixe garanti, disponible 24h/24."
        canonical="/"
        schema={HOME_SCHEMA}
      />

      {/* Hero is outside <main> because it spans full viewport and is landmark */}
      <Hero />

      <FleetSection />

      <ServicesSection />

      {/* Why us */}
      <section className="py-24 bg-white" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge bg-brand-100 text-brand-600 mb-4" aria-hidden="true">Pourquoi RideNow ?</span>
            <h2 id="why-heading" className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              L'excellence à chaque trajet
            </h2>
          </div>
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <Icon size={26} className="text-brand-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>


      <PriceEstimator />
      <TestimonialsSection />

      {/* CTA Banner */}
      <section className="py-20 bg-slate-50" aria-label="Appel à l'action">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Prêt à voyager avec
              <span className="text-brand-500"> style ?</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8">
              Réservez maintenant et profitez d'un trajet premium à prix fixe, sans surprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reservation" className="btn-primary text-base px-10 py-4 justify-center">
                Réserver maintenant
              </Link>
              <a href={`tel:${PHONE_E164}`} className="btn-secondary text-base px-10 py-4 justify-center">
                Appeler directement
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
