import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { waLink } from '../config.js';

const STATS = [
  { icon: Star,   value: '4.9/5', label: 'Note clients' },
  { icon: Shield, value: '100%',  label: 'Assurés' },
  { icon: Clock,  value: '24/7',  label: 'Disponible' },
];

export default function Hero() {
  return (
    <section
      aria-label="Bienvenue chez RideNow"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Hero background — img tag for fetchpriority + proper alt */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
      </div>

      {/* Decorative glows */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-400/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-6 inline-flex">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" aria-hidden="true" />
              Service disponible 24h/24 — 7j/7
            </span>
          </motion.div>

          {/* h1 — unique on the page */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6"
          >
            Votre chauffeur
            <span className="block text-brand-400">privé premium</span>
            <span className="block text-4xl md:text-5xl font-light text-white/80 mt-2">
              à Paris &amp; Île-de-France
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl"
          >
            Transferts aéroport, Disneyland, hôtels de luxe et lieux touristiques.
            Voyagez avec élégance et ponctualité dans nos véhicules haut de gamme.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <Link to="/reservation" className="btn-primary text-base px-8 py-4 shadow-xl justify-center sm:justify-start">
              Réserver maintenant
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href={waLink('Bonjour, je souhaite réserver un trajet avec RideNow.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base px-8 py-4 bg-white/10 border-white/40 text-white hover:bg-white/20 justify-center sm:justify-start"
              aria-label="Réserver via WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-green-400" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Réserver via WhatsApp
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-5 sm:gap-8"
            aria-label="Chiffres clés"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20" aria-hidden="true">
                  <Icon size={18} className="text-brand-300" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-none">{value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" aria-hidden="true">
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
      </div>
    </section>
  );
}
