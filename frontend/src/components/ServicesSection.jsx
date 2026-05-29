import { Link } from 'react-router-dom';
import { Plane, Castle, MapPin, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    icon: Plane,
    title: 'Transferts Aéroport',
    description: 'CDG, Orly, Beauvais — VTC premium avec suivi de vol en temps réel. Prix fixe garanti depuis Paris, dès 55€.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    tag: 'Le + demandé',
    tagColor: 'bg-brand-500 text-white',
    link: '/transfert-cdg-paris',
    price: 'dès 55€',
  },
  {
    icon: Castle,
    title: 'Van Disneyland Paris',
    description: 'Van Mercedes Classe V jusqu\'à 7 passagers pour Disneyland. Départ depuis Paris ou directement depuis CDG ou Orly.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=600&q=80',
    tag: 'Famille',
    tagColor: 'bg-gold-500 text-white',
    link: '/van-disneyland',
    price: 'dès 80€',
  },
  {
    icon: MapPin,
    title: 'Lieux Touristiques',
    description: 'Tour Eiffel, Versailles, Louvre, Mont-Saint-Michel... Explorez Paris et ses trésors en VTC.',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    tag: 'Tourisme',
    tagColor: 'bg-emerald-500 text-white',
    link: '/reservation',
    price: 'sur devis',
  },
  {
    icon: Building2,
    title: 'Hôtels de Luxe',
    description: 'Service de navette depuis et vers les grands hôtels parisiens. Disponible 24h/24.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    tag: 'Prestige',
    tagColor: 'bg-purple-500 text-white',
    link: '/reservation',
    price: 'sur devis',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ServicesSection() {
  return (
    <section className="py-24 bg-slate-50" id="services" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <span className="badge bg-brand-100 text-brand-600 mb-4" aria-hidden="true">Nos Services</span>
          <h2 id="services-heading" className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Où souhaitez-vous aller ?
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Des transferts sur-mesure pour chaque occasion, avec des chauffeurs professionnels et des véhicules premium.
          </p>
        </div>

        <motion.ul
          role="list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.li key={service.title} variants={cardVariants}>
                <Link
                  to={service.link}
                  className="group card overflow-hidden flex flex-col sm:flex-row hover:-translate-y-1 transition-transform duration-300 min-h-[44px]"
                  aria-label={`${service.title} — ${service.price}`}
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/40 to-transparent" aria-hidden="true" />
                    <span className={`absolute top-3 left-3 badge text-xs font-bold ${service.tagColor}`} aria-hidden="true">
                      {service.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <Icon size={20} className="text-brand-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-brand-500 font-bold text-lg">{service.price}</span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-brand-500 group-hover:gap-2 transition-all" aria-hidden="true">
                        Réserver <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
