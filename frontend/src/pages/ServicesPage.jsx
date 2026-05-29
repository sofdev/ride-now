import { Link } from 'react-router-dom';
import { PHONE_E164 } from '../config.js';
import { Plane, Castle, MapPin, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import Footer from '../components/Footer.jsx';

const DETAILED_SERVICES = [
  {
    icon: Plane,
    title: 'Transferts Aéroport',
    subtitle: 'CDG · Orly · Beauvais',
    description: 'Nous assurons vos transferts vers tous les aéroports parisiens. Suivi de vol en temps réel, accueil avec panneau nominatif, aide aux bagages. Pas de frais en cas de retard de vol.',
    features: ['Suivi de vol temps réel', 'Accueil avec panneau', 'Aide aux bagages', 'Attente gratuite 30 min', 'Prix fixe garanti'],
    points: ['CDG (dès 65€)', 'Orly (dès 55€)', 'Beauvais (dès 120€)'],
    pointsLabel: 'Aéroports',
    color: 'from-blue-500 to-brand-600',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    prices: { standard: 55, premium: 80, van: 105 },
  },
  {
    icon: Castle,
    title: 'Disneyland Paris',
    subtitle: 'Marne-la-Vallée',
    description: 'Partez à la magie sans stress ! Nous vous emmenons directement aux portes du parc Disneyland depuis n\'importe où en Île-de-France. Idéal pour les familles avec enfants.',
    features: ['Dépose aux portes du parc', 'Siège bébé disponible', 'Aller / Aller-retour', 'Horaires flexibles', 'Van pour groupes'],
    points: ['Départ de Paris', 'Depuis tous les aéroports', 'Retour inclus possible'],
    pointsLabel: 'Options',
    color: 'from-yellow-400 to-gold-600',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=800&q=80',
    prices: { standard: 75, premium: 110, van: 140 },
  },
  {
    icon: MapPin,
    title: 'Lieux Touristiques',
    subtitle: 'Paris & Île-de-France',
    description: 'Explorez les plus beaux monuments de Paris et d\'Île-de-France avec votre chauffeur privé. Tour Eiffel, Versailles, Louvre, Montmartre, Mont-Saint-Michel... Créez votre itinéraire.',
    features: ['Itinéraire personnalisé', 'Chauffeur guide disponible', 'Mise à disposition à l\'heure', 'Multi-étapes', 'Groupes acceptés'],
    points: ['Tour Eiffel', 'Château de Versailles', 'Musée du Louvre', 'Mont-Saint-Michel', 'Étretat'],
    pointsLabel: 'Destinations',
    color: 'from-emerald-400 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    prices: null,
  },
  {
    icon: Building2,
    title: 'Hôtels de Prestige',
    subtitle: 'Service navette & mise à disposition',
    description: 'Service dédié pour les clients des grands hôtels parisiens. Navette depuis/vers l\'aéroport ou la gare, avec accueil personnalisé dans le hall. Service de conciergerie VTC.',
    features: ['Accueil en lobby', 'Service de conciergerie', 'Disponible 24h/24', 'Facturation hôtel', 'Chauffeur bilingue'],
    points: ['Four Seasons George V', 'Ritz Paris', 'Le Meurice', 'Hôtel de Crillon', 'Bristol Paris'],
    pointsLabel: 'Partenaires',
    color: 'from-purple-500 to-purple-700',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    prices: null,
  },
];

const SERVICES_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Services VTC RideNow',
  itemListElement: DETAILED_SERVICES.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      provider: { '@type': 'LocalBusiness', name: 'RideNow' },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <SEO
        title="Nos Services VTC — Aéroport, Disneyland, Tourisme"
        description="Découvrez tous nos services VTC : transferts aéroport CDG/Orly/Beauvais, Disneyland Paris, lieux touristiques et hôtels de luxe. Chauffeurs professionnels, prix fixe."
        canonical="/services"
        schema={SERVICES_SCHEMA}
      />

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 to-brand-900 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-white/20 text-white mb-4" aria-hidden="true">Nos services VTC</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Des transferts pour chaque occasion
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Que ce soit pour un vol, une journée à Disneyland ou une visite touristique, RideNow s'adapte à vos besoins avec des chauffeurs professionnels.
          </p>
        </div>
      </header>

      {/* Services detail */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {DETAILED_SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                aria-label={service.title}
                className={`bg-white rounded-3xl overflow-hidden shadow-card flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Image */}
                <div className="relative w-full lg:w-80 xl:w-96 h-64 lg:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={service.image}
                    alt={`Service ${service.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-70`} aria-hidden="true" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Icon size={48} className="mb-3 opacity-90" aria-hidden="true" />
                    <p className="font-black text-2xl text-center px-4">{service.title}</p>
                    <p className="text-white/80 text-sm mt-1">{service.subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3">{service.title}</h2>
                    <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Inclus</h3>
                        <ul className="space-y-2">
                          {service.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0" aria-hidden="true" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          {service.pointsLabel}
                        </h3>
                        <ul className="space-y-2">
                          {service.points.map(a => (
                            <li key={a} className="text-sm text-slate-600 flex items-center gap-2">
                              <span className="text-gold-500" aria-hidden="true">★</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                    {service.prices ? (
                      <div className="flex gap-4" aria-label="Tarifs">
                        {Object.entries(service.prices).map(([type, price]) => (
                          <div key={type} className="text-center">
                            <p className="text-xs text-slate-400 capitalize">{type}</p>
                            <p className="font-black text-brand-500 text-lg">{price}€</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">Prix sur devis selon l'itinéraire</p>
                    )}
                    <Link to="/reservation" className="btn-primary">
                      Réserver ce service <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 bg-white" aria-label="Service personnalisé">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Votre service n'est pas listé ?</h2>
          <p className="text-slate-500 mb-8">Nous proposons aussi des services sur-mesure : événements d'entreprise, mariages, mise à disposition journalière. Contactez-nous pour un devis personnalisé.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary justify-center">Demander un devis</Link>
            <a href={`tel:${PHONE_E164}`} className="btn-secondary justify-center">Appeler maintenant</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
