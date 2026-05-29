import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import Footer from '../components/Footer.jsx';
import { PHONE_DISPLAY, PHONE_E164, waLink } from '../config.js';

const CATEGORIES = [
  {
    id: 'reservation',
    label: 'Réservation',
    questions: [
      {
        q: 'Comment réserver un VTC RideNow ?',
        a: 'Rendez-vous sur la page Réservation, saisissez votre adresse de départ et de destination, choisissez votre véhicule, puis renseignez vos coordonnées. La confirmation est immédiate par email. Vous pouvez aussi réserver par téléphone ou WhatsApp 24h/24.',
      },
      {
        q: 'Peut-on réserver à la dernière minute ?',
        a: 'Oui, nous acceptons les réservations immédiates sous réserve de disponibilité. Pour les transferts aéroport ou les événements importants, nous recommandons de réserver à l\'avance afin de garantir un chauffeur.',
      },
      {
        q: 'Comment reçoit-on la confirmation de réservation ?',
        a: 'Un email de confirmation est envoyé immédiatement après la réservation avec votre référence, les détails du trajet et les coordonnées du chauffeur. Vous pouvez aussi retrouver vos réservations dans votre espace client.',
      },
      {
        q: 'Peut-on modifier une réservation après confirmation ?',
        a: 'Oui, contactez-nous par téléphone ou WhatsApp pour modifier l\'heure, la date ou l\'adresse. Les modifications sont possibles jusqu\'à 2 heures avant le départ sous réserve de disponibilité.',
      },
      {
        q: 'Le service est-il disponible la nuit et les jours fériés ?',
        a: 'Oui, RideNow est disponible 24h/24, 7j/7, y compris les nuits, week-ends et jours fériés. Aucun supplément de nuit ou de week-end n\'est appliqué — le prix est identique à toute heure.',
      },
    ],
  },
  {
    id: 'prix',
    label: 'Prix & paiement',
    questions: [
      {
        q: 'Comment sont calculés les prix ?',
        a: 'Le prix est calculé en fonction de la distance, du type de véhicule et d\'un tarif de prise en charge. Il est affiché avant confirmation et garanti : vous payez exactement ce qui est annoncé, sans compteur ni surprises.',
      },
      {
        q: 'Y a-t-il des frais supplémentaires (autoroute, nuit, bagage) ?',
        a: 'Non. Le prix affiché est le prix final, péages inclus, quelle que soit l\'heure ou le nombre de bagages standard. Seules des prestations spéciales (siège bébé sur demande) peuvent donner lieu à un devis sur mesure.',
      },
      {
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Vous pouvez payer en ligne par carte bancaire (Visa, Mastercard) via Stripe, par PayPal, ou directement à bord en espèces ou par carte auprès du chauffeur.',
      },
      {
        q: 'Peut-on obtenir une facture pour les notes de frais ?',
        a: 'Oui, une facture est disponible depuis votre espace client après chaque trajet terminé. Elle est compatible avec les notes de frais professionnelles. Une facturation entreprise est aussi disponible sur demande.',
      },
      {
        q: 'Les prix sont-ils les mêmes depuis et vers les aéroports ?',
        a: 'Oui, le tarif est identique dans les deux sens. Un transfert Paris–CDG coûte le même prix qu\'un CDG–Paris pour la même distance et le même véhicule.',
      },
    ],
  },
  {
    id: 'vehicules',
    label: 'Véhicules & confort',
    questions: [
      {
        q: 'Quels véhicules sont disponibles ?',
        a: 'Trois catégories : Berline Standard (Toyota Corolla, 4 passagers), Berline Premium (Mercedes Classe E, BMW Série 5 — 4 passagers), et Van (Mercedes Classe V — jusqu\'à 7 passagers et 7 bagages).',
      },
      {
        q: 'Combien de passagers peut-on être dans un van ?',
        a: 'Le Van Mercedes Classe V accueille jusqu\'à 7 passagers avec 7 bagages. C\'est le véhicule idéal pour les familles, groupes ou transferts depuis/vers Disneyland Paris.',
      },
      {
        q: 'Les véhicules sont-ils climatisés ?',
        a: 'Oui, tous nos véhicules sont climatisés et entretenus régulièrement. Ils ont moins de 3 ans. De l\'eau est proposée à bord sur les berlines premium et vans.',
      },
      {
        q: 'Les animaux de compagnie sont-ils acceptés ?',
        a: 'Les petits animaux dans une caisse de transport sont acceptés. Merci de le préciser dans les notes lors de la réservation afin que le chauffeur soit prévenu.',
      },
      {
        q: 'Proposez-vous des sièges bébé ou rehausseurs ?',
        a: 'Oui, sur demande lors de la réservation (champ notes). Précisez l\'âge et le poids de l\'enfant. Ce service est proposé sans frais supplémentaires dans la limite des disponibilités.',
      },
    ],
  },
  {
    id: 'aeroports',
    label: 'Aéroports',
    questions: [
      {
        q: 'Où le chauffeur attend-il à l\'aéroport CDG ?',
        a: 'Le chauffeur vous attend dans le hall des arrivées de votre terminal (T1, T2A–T2G ou T3) avec une pancarte à votre nom, 20 minutes avant l\'atterrissage de votre vol.',
      },
      {
        q: 'Où le chauffeur attend-il à l\'aéroport d\'Orly ?',
        a: 'Le chauffeur vous attend dans le hall des arrivées de votre terminal (Orly 1, 2, 3 ou 4) avec une pancarte à votre nom. Précisez votre numéro de vol lors de la réservation.',
      },
      {
        q: 'Mon vol est retardé, que se passe-t-il ?',
        a: 'Nous suivons votre vol en temps réel. En cas de retard, votre chauffeur adapte automatiquement son heure d\'arrivée. Aucun supplément n\'est appliqué pour un retard de vol.',
      },
      {
        q: 'Peut-on réserver un aller-retour aéroport ?',
        a: 'Oui, lors de la réservation cochez l\'option "Ajouter un retour". Vous pouvez aussi effectuer deux réservations séparées si les dates sont différentes.',
      },
    ],
  },
  {
    id: 'annulation',
    label: 'Annulation',
    questions: [
      {
        q: 'Peut-on annuler une réservation gratuitement ?',
        a: 'Oui, l\'annulation est gratuite jusqu\'à 2 heures avant l\'heure de prise en charge. Annulez depuis votre espace client (Mes trajets) ou en nous contactant directement.',
      },
      {
        q: 'Quels sont les frais en cas d\'annulation tardive ?',
        a: 'Si vous annulez moins de 2 heures avant le départ, des frais d\'annulation de 20% du prix de la course sont appliqués. Au-delà de 2 heures, aucun frais.',
      },
      {
        q: 'Que se passe-t-il si je ne me présente pas (no-show) ?',
        a: 'En cas d\'absence sans annulation préalable, le montant total de la course peut être facturé. Le chauffeur attend 15 minutes à l\'adresse de prise en charge avant de considérer la course comme un no-show.',
      },
    ],
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CATEGORIES.flatMap(cat =>
    cat.questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    }))
  ),
};

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-colors ${isOpen ? 'bg-blue-50/30' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold leading-snug transition-colors ${
          isOpen ? 'text-brand-600' : 'text-slate-800'
        }`}>
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-500' : 'text-slate-400'
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('reservation');
  const [openIndex, setOpenIndex] = useState(null);

  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  return (
    <>
      <SEO
        title="FAQ — Questions fréquentes sur notre service VTC Paris"
        description="Toutes les réponses sur la réservation, les prix, les véhicules, les transferts aéroport CDG et Orly, et la politique d'annulation de RideNow VTC Paris."
        canonical="/faq"
        schema={FAQ_SCHEMA}
      />

      <div className="min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-slate-900 pt-32 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Centre d'aide</p>
            <h1 className="text-4xl font-black text-white mb-4">Questions fréquentes</h1>
            <p className="text-slate-400 text-base">
              Tout ce que vous devez savoir sur notre service VTC à Paris et en Île-de-France.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-gray-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-10"
            >
              {currentCat.questions.map(({ q, a }, i) => (
                <AccordionItem
                  key={i}
                  question={q}
                  answer={a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* CTA bloc */}
          <div className="bg-slate-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-black text-lg mb-1">Vous n'avez pas trouvé votre réponse ?</p>
              <p className="text-slate-400 text-sm">Notre équipe répond en moins de 2 minutes.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href={`tel:${PHONE_E164}`}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
              <a
                href={waLink('Bonjour, j\'ai une question sur votre service VTC.')}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {[
              ['Réserver un VTC', '/reservation'],
              ['Nos véhicules', '/services'],
              ['Transfert CDG', '/transfert-cdg-paris'],
              ['Transfert Orly', '/chauffeur-prive-orly'],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-full transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
