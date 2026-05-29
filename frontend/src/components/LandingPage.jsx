import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, ChevronDown, Star,
  MapPin, Clock, Tag, Phone,
} from 'lucide-react';
import SEO from './SEO.jsx';
import Footer from './Footer.jsx';
import { PHONE_DISPLAY, PHONE_E164 } from '../config.js';

/* ─── FAQ accordion ─────────────────────────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-sm sm:text-base">{q}</span>
        <ChevronDown size={18} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

/* ─── Main template ──────────────────────────────────── */
export default function LandingPage({
  /* SEO */
  seoTitle, seoDescription, canonical, schema,
  /* Hero */
  heroImage, badge, h1, h1accent, subtitle,
  bookingPickup = '', bookingDropoff = '',
  /* Stats rapides */
  stats,          // [{ label, value, icon }]
  /* Chiffres clés */
  figures,        // [{ value, label, sub }]
  /* Avantages */
  advantages,     // [{ icon: Component, title, desc }]
  /* Étapes */
  steps,          // [{ num, title, desc }]
  /* FAQ */
  faqs,           // [{ q, a }]
  /* CTA final */
  ctaTitle, ctaDesc,
}) {
  const bookingHref = `/reservation?pickup=${encodeURIComponent(bookingPickup)}&dropoff=${encodeURIComponent(bookingDropoff)}`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        schema={schema}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label={h1}>
        <div className="absolute inset-0" aria-hidden="true">
          <img src={heroImage} alt="" className="w-full h-full object-cover" fetchPriority="high" loading="eager" width="1920" height="1080" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/92 via-slate-900/70 to-slate-900/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <nav aria-label="Fil d'Ariane" className="mb-4">
                <ol className="flex items-center gap-2 text-xs text-white/50">
                  <li><Link to="/" className="hover:text-white/80 transition-colors">Accueil</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white/70">{seoTitle}</li>
                </ol>
              </nav>
              <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-5 inline-flex">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow mr-1" aria-hidden="true" />
                {badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-5"
            >
              {h1}
              {h1accent && <span className="block text-brand-400">{h1accent}</span>}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/80 mb-8 leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link to={bookingHref} className="btn-primary text-base px-8 py-4 shadow-xl justify-center sm:justify-start">
                Réserver maintenant <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={`tel:${PHONE_E164}`}
                className="btn-secondary text-base px-8 py-4 bg-white/10 border-white/40 text-white hover:bg-white/20 justify-center sm:justify-start">
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
            </motion.div>

            {/* Stats rapides */}
            {stats && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-5 sm:gap-8"
              >
                {stats.map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-400 flex-shrink-0" />
                    <span className="text-sm text-white/80"><strong className="text-white">{value}</strong> {label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ────────────────────────────────── */}
      {figures && (
        <section className="bg-slate-900 py-10" aria-label="Informations trajet">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {figures.map(({ value, label, sub }) => (
              <div key={label} className="bg-slate-900 px-6 py-5 text-center">
                <p className="text-2xl font-black text-brand-400">{value}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{label}</p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── AVANTAGES ────────────────────────────────────── */}
      {advantages && (
        <section className="py-20 bg-white" aria-labelledby="avantages-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="avantages-heading" className="text-3xl md:text-4xl font-black text-slate-900">
                Pourquoi choisir RideNow ?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={22} className="text-brand-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ÉTAPES ───────────────────────────────────────── */}
      {steps && (
        <section className="py-20 bg-slate-50" aria-labelledby="steps-heading">
          <div className="max-w-4xl mx-auto px-4">
            <h2 id="steps-heading" className="text-3xl font-black text-slate-900 text-center mb-12">
              Comment ça marche ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map(({ num, title, desc }) => (
                <div key={num} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-brand-500 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
                    {num}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────── */}
      {faqs && (
        <section className="py-20 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">FAQ</span>
            </div>
            <h2 id="faq-heading" className="text-3xl font-black text-slate-900 text-center mb-10">
              Questions fréquentes
            </h2>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 divide-y divide-gray-50">
              {faqs.map(item => <FAQItem key={item.q} {...item} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-20 bg-brand-500" aria-label="Réserver">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center gap-1 mb-4" aria-label="Note 5 étoiles">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />)}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{ctaTitle}</h2>
            <p className="text-white/80 mb-8 text-lg">{ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={bookingHref}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg text-base">
                Réserver maintenant <ArrowRight size={18} />
              </Link>
              <a href={`tel:${PHONE_E164}`}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors text-base">
                <Phone size={16} /> Appeler directement
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
