import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import SEO from '../components/SEO.jsx';
import Footer from '../components/Footer.jsx';
import { PHONE_DISPLAY, PHONE_E164, waLink } from '../config.js';

const CONTACT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contacter RideNow',
  url: 'https://ridenow.fr/contact',
  description: 'Contactez notre équipe par téléphone, email ou WhatsApp. Disponible 24h/24, 7j/7.',
};

const CONTACT_INFO = [
  { icon: Phone,  title: 'Téléphone',          info: PHONE_DISPLAY,        sub: 'Disponible 24h/24', href: `tel:${PHONE_E164}`,       color: 'bg-brand-500' },
  { icon: Mail,   title: 'Email',               info: 'contact@ridenow.fr', sub: 'Réponse sous 2h',   href: 'mailto:contact@ridenow.fr', color: 'bg-slate-700' },
  { icon: Clock,  title: 'Horaires',            info: '24h/24 — 7j/7',     sub: 'Même les jours fériés', href: null,                   color: 'bg-gold-500' },
  { icon: MapPin, title: "Zone d'intervention", info: 'Paris & Île-de-France', sub: 'Toute la région', href: null,                      color: 'bg-emerald-500' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/contact', form);
      setSent(true);
      toast.success('Message envoyé !');
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <>
      <SEO
        title="Contact — Chauffeur VTC Paris 24h/24"
        description="Contactez RideNow par téléphone, email ou WhatsApp. Notre équipe répond 24h/24, 7j/7 pour vos demandes de réservation et devis VTC."
        canonical="/contact"
        schema={CONTACT_SCHEMA}
      />

      {/* Page header */}
      <header className="bg-gradient-to-br from-brand-600 to-brand-800 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="badge bg-white/20 text-white mb-4" aria-hidden="true">Contactez-nous</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Nous sommes à votre écoute</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Pour toute question, devis ou réservation, notre équipe répond rapidement.
          </p>
        </div>
      </header>

      <section className="bg-slate-50 py-16" aria-label="Coordonnées et formulaire de contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact info */}
            <aside aria-label="Coordonnées RideNow">
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, title, info, sub, href, color }) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`} aria-hidden="true">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{title}</p>
                      {href ? (
                        <a href={href} className="font-bold text-slate-900 hover:text-brand-500 transition-colors block">
                          {info}
                        </a>
                      ) : (
                        <p className="font-bold text-slate-900">{info}</p>
                      )}
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                  </motion.div>
                ))}

                {/* WhatsApp card */}
                <div className="bg-green-500 rounded-2xl p-6 text-white">
                  <h2 className="font-black text-lg mb-2">WhatsApp rapide</h2>
                  <p className="text-green-100 text-sm mb-4">Pour une réponse immédiate, écrivez-nous sur WhatsApp.</p>
                  <a
                    href={waLink("Bonjour RideNow, j'ai une question.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-green-600 font-bold px-4 py-3 rounded-xl hover:bg-green-50 transition-colors justify-center text-sm min-h-[44px]"
                    aria-label="Écrire sur WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Écrire sur WhatsApp
                  </a>
                </div>
              </div>
            </aside>

            {/* Contact form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-card p-8 md:p-10">
              {sent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <CheckCircle2 size={32} className="text-brand-500" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Message envoyé !</h2>
                  <p className="text-slate-500">Nous vous répondrons dans les meilleurs délais.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                    className="btn-primary mt-6"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Envoyer un message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="label-text">Nom complet <span aria-hidden="true">*</span></label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={update('name')}
                          placeholder="Jean Dupont"
                          className="input-field"
                          required
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="label-text">Email <span aria-hidden="true">*</span></label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={update('email')}
                          placeholder="jean@example.com"
                          className="input-field"
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="label-text">Téléphone</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+33 6 12 34 56 78"
                        className="input-field"
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="label-text">Message <span aria-hidden="true">*</span></label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={update('message')}
                        placeholder="Décrivez votre besoin..."
                        className="input-field h-36 resize-none"
                        required
                      />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
                      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                      {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
