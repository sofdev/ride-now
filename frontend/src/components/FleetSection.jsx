import { Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VEHICLES = [
  {
    type: 'Standard',
    badge: 'Économique',
    badgeColor: 'bg-slate-100 text-slate-600',
    models: 'Peugeot 508 · Volkswagen Passat',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    passengers: 3,
    bags: 3,
    amenities: ['Climatisation', 'Eau minérale', 'Chargeur USB'],
    color: 'from-slate-500 to-slate-700',
    startPrice: 35,
    perKm: '2.00',
    perKmLong: '1.50',
  },
  {
    type: 'Premium',
    badge: 'Populaire',
    badgeColor: 'bg-brand-100 text-brand-600',
    models: 'Mercedes Classe E · BMW Série 5',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    passengers: 3,
    bags: 4,
    amenities: ['Cuir pleine fleur', 'Wi-Fi gratuit', 'Boissons offertes', 'Presse'],
    color: 'from-brand-500 to-brand-700',
    startPrice: 45,
    perKm: '2.50',
    perKmLong: '2.00',
    featured: true,
  },
  {
    type: 'Van',
    badge: 'Groupe',
    badgeColor: 'bg-gold-500/20 text-gold-600',
    models: 'Mercedes Classe V · Viano',
    image: 'https://images.pexels.com/photos/17455633/pexels-photo-17455633.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengers: 7,
    bags: 7,
    amenities: ['Grand espace', 'Wi-Fi gratuit', 'Boissons offertes', 'Porte-bagages'],
    color: 'from-gold-500 to-gold-600',
    startPrice: 60,
    perKm: '3.00',
    perKmLong: '2.50',
  },
];

export default function FleetSection() {
  return (
    <section className="py-24 bg-white" id="fleet" aria-labelledby="fleet-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <span className="badge bg-brand-100 text-brand-600 mb-4" aria-hidden="true">Notre Flotte</span>
          <h2 id="fleet-heading" className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Choisissez votre confort
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Trois catégories de véhicules pour s'adapter à chaque budget et chaque occasion.
          </p>
        </div>

        <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VEHICLES.map((v, i) => (
            <motion.li
              key={v.type}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative card overflow-hidden ${v.featured ? 'ring-2 ring-brand-500 md:scale-105' : ''}`}
            >
              {v.featured && (
                <div className="absolute top-4 right-4 z-10" aria-label="Véhicule le plus choisi">
                  <span className="badge bg-brand-500 text-white text-xs font-bold shadow-md">
                    ★ Le plus choisi
                  </span>
                </div>
              )}

              {/* Car image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={v.image}
                  alt={`Véhicule ${v.type} — ${v.models}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="480"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${v.color} opacity-60`} aria-hidden="true" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-2xl">{v.type}</h3>
                  <p className="text-white/80 text-xs mt-0.5">{v.models}</p>
                </div>
                <span className={`absolute top-4 left-4 badge text-xs font-bold ${v.badgeColor}`} aria-hidden="true">
                  {v.badge}
                </span>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Users size={16} className="text-brand-400" aria-hidden="true" />
                    <span className="font-semibold">{v.passengers} pers.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Briefcase size={16} className="text-brand-400" aria-hidden="true" />
                    <span className="font-semibold">{v.bags} bagages</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6" aria-label={`Équipements ${v.type}`}>
                  {v.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-slate-400">À partir de</p>
                    <p className="text-2xl font-black text-slate-900">{v.startPrice}€</p>
                  </div>
                  <Link
                    to={`/reservation?vehicle=${v.type.toLowerCase()}`}
                    className={v.featured ? 'btn-primary text-sm py-2.5' : 'btn-secondary text-sm py-2.5'}
                    aria-label={`Réserver avec le véhicule ${v.type}`}
                  >
                    Choisir
                  </Link>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
