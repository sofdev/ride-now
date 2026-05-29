import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    location: 'Paris',
    avatar: 'SM',
    rating: 5,
    text: 'Chauffeur ponctuel, véhicule impeccable. Mon transfert CDG s\'est passé parfaitement. Je recommande vivement RideNow !',
    service: 'Transfert CDG',
  },
  {
    name: 'Thomas L.',
    location: 'Versailles',
    avatar: 'TL',
    rating: 5,
    text: 'Nous avons utilisé le Van pour emmener la famille à Disneyland. Très spacieux, chauffeur sympathique. Les enfants ont adoré !',
    service: 'Van — Disneyland',
  },
  {
    name: 'Isabelle R.',
    location: 'Neuilly',
    avatar: 'IR',
    rating: 5,
    text: 'Service premium à la hauteur des attentes. Classe E très confortable pour mon déplacement professionnel à Orly.',
    service: 'Premium — Orly',
  },
  {
    name: 'Marc D.',
    location: 'Boulogne',
    avatar: 'MD',
    rating: 5,
    text: 'Réservation simple, prix transparent, chauffeur professionnel. RideNow est devenu mon prestataire de confiance.',
    service: 'Standard',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge bg-white/20 text-white mb-4">Avis clients</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-white/70 text-lg">Plus de 500 trajets effectués avec une satisfaction client de 4.9/5</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-brand-100 rounded-full flex items-center justify-center font-bold text-brand-600 text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <span className="badge bg-brand-50 text-brand-600 text-xs">{t.service}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
