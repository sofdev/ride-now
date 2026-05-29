import { PlaneTakeoff, Clock, Tag, Shield, MapPin, PhoneCall } from 'lucide-react';
import { PHONE_E164 } from '../config.js';
import LandingPage from '../components/LandingPage.jsx';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Transfert Aéroport CDG Paris — Chauffeur VTC',
      description: 'Service de transfert en voiture avec chauffeur entre l\'aéroport Charles-de-Gaulle et Paris. Prix fixe, suivi de vol, prise en charge dans le hall.',
      provider: {
        '@type': 'LocalBusiness',
        '@id': 'https://ridenow.fr/#business',
        name: 'RideNow — Chauffeur VTC Paris',
        telephone: PHONE_E164,
        url: 'https://ridenow.fr',
        sameAs: ['https://www.google.com/maps/search/RideNow+VTC+Paris'],
      },
      areaServed: [
        { '@type': 'Airport', name: 'Aéroport Charles-de-Gaulle (CDG)' },
        { '@type': 'City',    name: 'Paris' },
        { '@type': 'State',   name: 'Île-de-France' },
      ],
      serviceType: 'Transfert aéroport',
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '55', description: 'À partir de 55€ pour un transfert CDG–Paris en berline standard' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Quel est le prix d\'un transfert CDG Paris ?', acceptedAnswer: { '@type': 'Answer', text: 'Le prix d\'un transfert entre l\'aéroport CDG et Paris commence à 55€ en berline standard. Le tarif est fixe et confirmé à la réservation, sans surprises.' } },
        { '@type': 'Question', name: 'Combien de temps dure le trajet CDG Paris ?', acceptedAnswer: { '@type': 'Answer', text: 'Le trajet entre l\'aéroport Charles-de-Gaulle et le centre de Paris dure entre 40 et 60 minutes selon la circulation. Environ 35 km.' } },
        { '@type': 'Question', name: 'Le chauffeur attend-il en cas de retard de vol ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, nous suivons votre vol en temps réel. En cas de retard, votre chauffeur adapte son heure d\'arrivée automatiquement, sans frais supplémentaires.' } },
        { '@type': 'Question', name: 'Où est-ce que le chauffeur m\'attend à CDG ?', acceptedAnswer: { '@type': 'Answer', text: 'Votre chauffeur vous attend dans le hall des arrivées avec une pancarte à votre nom. Il sera présent 20 minutes avant l\'atterrissage de votre vol.' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ridenow.fr' },
        { '@type': 'ListItem', position: 2, name: 'Transfert CDG Paris', item: 'https://ridenow.fr/transfert-cdg-paris' },
      ],
    },
  ],
};

export default function TransfertCDGPage() {
  return (
    <LandingPage
      seoTitle="VTC Aéroport CDG Paris — Chauffeur Privé Prix Fixe dès 55€"
      seoDescription="Transfert aéroport Charles-de-Gaulle (CDG) vers Paris en VTC. Chauffeur privé professionnel, prix fixe dès 55€, suivi de vol, accueil dans le hall. Disponible 24h/24."
      canonical="/transfert-cdg-paris"
      schema={schema}

      heroImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
      badge="Transfert CDG disponible 24h/24"
      h1="Transfert Aéroport CDG"
      h1accent="vers Paris — Prix Fixe"
      subtitle="Chauffeur VTC professionnel vous attend dans le hall des arrivées. Suivi de vol en temps réel, prise en charge garantie même en cas de retard."
      bookingPickup="Aéroport Charles-de-Gaulle, Roissy-en-France"
      bookingDropoff="Paris, France"
      stats={[
        { value: 'Dès 55€', label: 'prix fixe' },
        { value: '~45 min', label: 'durée moyenne' },
        { value: 'Gratuit', label: 'attente si retard vol' },
        { value: '24h/24', label: 'disponible' },
      ]}
      figures={[
        { value: '35 km', label: 'Distance', sub: 'CDG → Paris centre' },
        { value: '45 min', label: 'Durée', sub: 'hors circulation' },
        { value: 'Dès 55€', label: 'Tarif', sub: 'berline standard' },
        { value: '4.9 ★', label: 'Note clients', sub: 'sur 300+ avis' },
      ]}
      advantages={[
        { icon: PlaneTakeoff, title: 'Suivi de vol en temps réel', desc: 'Votre chauffeur surveille l\'état de votre vol et ajuste l\'heure d\'arrivée automatiquement si votre avion est retardé.' },
        { icon: Tag,         title: 'Prix fixe garanti',          desc: 'Le tarif est confirmé à la réservation. Aucune majoration pour les heures de pointe, la nuit ou le week-end.' },
        { icon: MapPin,      title: 'Accueil dans le hall',       desc: 'Votre chauffeur vous accueille dans le hall des arrivées avec une pancarte à votre nom, 20 min avant l\'atterrissage.' },
        { icon: Shield,      title: 'Chauffeur VTC certifié',     desc: 'Tous nos chauffeurs sont titulaires de la carte professionnelle VTC et formés à l\'accueil des passagers.' },
      ]}
      steps={[
        { num: '1', title: 'Réservez en 2 minutes', desc: 'Indiquez votre numéro de vol, votre adresse de destination et choisissez votre véhicule. Confirmation immédiate par email.' },
        { num: '2', title: 'Accueil personnalisé', desc: 'Votre chauffeur arrive avant vous dans le hall des arrivées et patiente gratuitement jusqu\'à 60 minutes après l\'atterrissage.' },
        { num: '3', title: 'Arrivée sans stress', desc: 'Montez dans un véhicule confortable et profitez du trajet. Le chauffeur prend en charge vos bagages.' },
      ]}
      faqs={[
        { q: 'Quel est le prix d\'un transfert CDG Paris ?', a: 'Le transfert entre CDG et Paris centre débute à 55€ en berline standard. Le prix est fixe, confirmé à la réservation. Pas de majoration nuit, week-end ou jours fériés.' },
        { q: 'Combien de temps dure le trajet ?', a: 'Le trajet CDG–Paris dure en moyenne 40 à 60 minutes selon la circulation. La distance est d\'environ 35 km. En dehors des heures de pointe, comptez 35 minutes.' },
        { q: 'Le chauffeur attend-il en cas de retard de vol ?', a: 'Oui. Nous suivons votre vol en temps réel via FlightAware. Si votre avion est retardé, votre chauffeur adapte son heure d\'arrivée automatiquement, sans frais supplémentaires.' },
        { q: 'Où le chauffeur m\'attend-il à CDG ?', a: 'Votre chauffeur vous attend dans le hall des arrivées de votre terminal (T1, T2 ou T3) avec une pancarte à votre nom. Les coordonnées exactes vous sont envoyées par SMS avant l\'arrivée.' },
        { q: 'Peut-on transporter de grands bagages ?', a: 'Oui. Nos berlines acceptent 3 valises standard. Pour plus de bagages ou un groupe, choisissez le Van qui accepte 7 bagages et 7 passagers.' },
      ]}
      ctaTitle="Réservez votre transfert CDG maintenant"
      ctaDesc="Prix fixe · Suivi de vol inclus · Annulation gratuite jusqu'à 1h avant"
    />
  );
}
