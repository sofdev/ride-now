import { Briefcase, Tag, Shield, Clock, Star, PhoneCall } from 'lucide-react';
import { PHONE_E164 } from '../config.js';
import LandingPage from '../components/LandingPage.jsx';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Chauffeur d\'Affaires La Défense — VTC Premium Paris',
      description: 'Service de chauffeur privé VTC haut de gamme pour les professionnels de La Défense. Berlines premium, ponctualité garantie, facturation entreprise.',
      provider: {
        '@type': 'LocalBusiness',
        '@id': 'https://ridenow.fr/#business',
        name: 'RideNow — Chauffeur VTC Paris',
        telephone: PHONE_E164,
        url: 'https://ridenow.fr',
        sameAs: ['https://www.google.com/maps/search/RideNow+VTC+Paris'],
      },
      areaServed: [
        { '@type': 'Place',  name: 'La Défense' },
        { '@type': 'City',   name: 'Paris' },
        { '@type': 'State',  name: 'Île-de-France' },
      ],
      serviceType: 'Chauffeur d\'affaires',
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '35', description: 'À partir de 35€ pour un chauffeur d\'affaires vers La Défense' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Quel est le prix d\'un VTC pour La Défense ?', acceptedAnswer: { '@type': 'Answer', text: 'Le tarif pour un chauffeur privé vers La Défense depuis Paris commence à 35€ en berline premium. Le prix est fixe et confirmé à la réservation.' } },
        { '@type': 'Question', name: 'Peut-on obtenir une facture pour la comptabilité ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, une facture détaillée est disponible depuis votre espace client après chaque course. Compatible avec les notes de frais. Facturation entreprise disponible.' } },
        { '@type': 'Question', name: 'Combien de temps dure le trajet Paris–La Défense ?', acceptedAnswer: { '@type': 'Answer', text: 'Le trajet Paris–La Défense dure entre 20 et 35 minutes selon la circulation, pour une distance de 10 à 15 km selon le point de départ.' } },
        { '@type': 'Question', name: 'Le service est-il disponible tôt le matin pour les meetings ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, notre service est disponible 24h/24 et 7j/7, y compris très tôt le matin pour les réunions et les vols d\'affaires. Réservez à l\'avance pour garantir la disponibilité.' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ridenow.fr' },
        { '@type': 'ListItem', position: 2, name: 'Chauffeur Affaires La Défense', item: 'https://ridenow.fr/chauffeur-affaires-la-defense' },
      ],
    },
  ],
};

export default function ChauffeurAffairesPage() {
  return (
    <LandingPage
      seoTitle="VTC La Défense Paris — Chauffeur Privé Affaires Premium"
      seoDescription="Chauffeur VTC premium pour La Défense et Paris. Berline haut de gamme, ponctualité garantie, facturation entreprise pour notes de frais. Prix fixe dès 35€."
      canonical="/chauffeur-affaires-la-defense"
      schema={schema}

      heroImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
      badge="Service VTC Affaires — La Défense"
      h1="Chauffeur d'Affaires"
      h1accent="La Défense — VTC Premium"
      subtitle="Transport professionnel haut de gamme pour vos déplacements à La Défense. Berlines premium, ponctualité garantie, wifi à bord et factures pour vos notes de frais."
      bookingPickup="Paris, France"
      bookingDropoff="La Défense, Puteaux"
      stats={[
        { value: 'Dès 35€', label: 'prix fixe' },
        { value: '~25 min', label: 'de Paris centre' },
        { value: 'Facture', label: 'pour notes de frais' },
        { value: 'Wifi', label: 'à bord' },
      ]}
      figures={[
        { value: '12 km', label: 'Distance', sub: 'Paris centre → La Défense' },
        { value: '25 min', label: 'Durée', sub: 'hors circulation' },
        { value: 'Dès 35€', label: 'Tarif', sub: 'berline premium' },
        { value: '24/7', label: 'Disponibilité', sub: 'y compris weekends' },
      ]}
      advantages={[
        { icon: Briefcase, title: 'Véhicule d\'affaires',        desc: 'Mercedes Classe E, BMW Série 5 ou équivalent. Intérieur soigné, tenue discrète, discrétion garantie pour vos conversations.' },
        { icon: Tag,       title: 'Facturation entreprise',      desc: 'Facture TVA détaillée disponible immédiatement depuis votre espace client. Intégrable dans vos outils de gestion de frais.' },
        { icon: Clock,     title: 'Ponctualité absolue',         desc: 'Pour vos rendez-vous clients et réunions importantes. Votre chauffeur est présent 5 minutes avant l\'heure prévue.' },
        { icon: PhoneCall, title: 'Réservation à la demande',    desc: 'Réservez à l\'avance ou en urgence. Notre équipe est disponible 24h/24 pour les demandes de dernière minute.' },
      ]}
      steps={[
        { num: '1', title: 'Réservez en 2 min', desc: 'Entrez votre adresse de départ et La Défense en destination. Sélectionnez la berline Premium pour votre rendez-vous d\'affaires.' },
        { num: '2', title: 'Votre chauffeur arrive', desc: 'Votre chauffeur est devant votre immeuble à l\'heure convenue. Il vous accueille, prend en charge vos bagages et ouvre la portière.' },
        { num: '3', title: 'Arrivée ponctuelle', desc: 'Profitez du trajet pour préparer votre réunion ou passer des appels. Téléchargez votre facture depuis l\'espace client après la course.' },
      ]}
      faqs={[
        { q: 'Quel est le prix d\'un VTC premium pour La Défense ?', a: 'Le tarif démarre à 35€ en berline premium depuis Paris centre. Le prix est fixe et confirmé à la réservation, sans compteur ni surprise.' },
        { q: 'Peut-on obtenir une facture pour les notes de frais ?', a: 'Oui. Une facture détaillée avec TVA est disponible depuis votre espace client immédiatement après chaque course. Elle est acceptée par tous les outils de gestion de frais professionnels.' },
        { q: 'Combien de temps dure le trajet Paris–La Défense ?', a: 'Entre 20 et 35 minutes selon votre point de départ dans Paris et la circulation. Hors heures de pointe, comptez 20 minutes depuis le 8e arrondissement.' },
        { q: 'Le service est-il disponible tôt le matin ?', a: 'Oui, notre service fonctionne 24h/24 et 7j/7. Pour les réunions à 7h ou les vols d\'affaires matinaux, réservez la veille pour garantir la disponibilité.' },
        { q: 'Peut-on créer un compte entreprise pour plusieurs collaborateurs ?', a: 'Oui, notre offre entreprise permet à plusieurs collaborateurs de réserver sous le même compte avec centralisation des factures. Contactez-nous pour configurer votre compte entreprise.' },
      ]}
      ctaTitle="Réservez votre chauffeur d'affaires"
      ctaDesc="Berline premium · Facture entreprise · Ponctualité garantie"
    />
  );
}
