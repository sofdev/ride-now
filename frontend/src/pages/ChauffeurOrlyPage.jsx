import { PlaneTakeoff, Clock, Tag, Shield, MapPin, Star } from 'lucide-react';
import { PHONE_E164 } from '../config.js';
import LandingPage from '../components/LandingPage.jsx';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Chauffeur Privé Aéroport d\'Orly — VTC Paris',
      description: 'Transfert en chauffeur privé VTC depuis et vers l\'aéroport d\'Orly. Prix fixe, ponctualité garantie, véhicule haut de gamme.',
      provider: {
        '@type': 'LocalBusiness',
        '@id': 'https://ridenow.fr/#business',
        name: 'RideNow — Chauffeur VTC Paris',
        telephone: PHONE_E164,
        url: 'https://ridenow.fr',
        sameAs: ['https://www.google.com/maps/search/RideNow+VTC+Paris'],
      },
      areaServed: [
        { '@type': 'Airport', name: 'Aéroport de Paris-Orly' },
        { '@type': 'City',    name: 'Paris' },
        { '@type': 'State',   name: 'Île-de-France' },
      ],
      serviceType: 'Chauffeur privé aéroport',
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '40', description: 'À partir de 40€ pour un transfert Orly–Paris' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Quel est le prix d\'un VTC pour l\'aéroport d\'Orly ?', acceptedAnswer: { '@type': 'Answer', text: 'Le prix d\'un chauffeur privé depuis ou vers l\'aéroport d\'Orly commence à 40€ en berline standard. Tarif fixe garanti à la réservation.' } },
        { '@type': 'Question', name: 'Combien de temps met-on de Orly à Paris ?', acceptedAnswer: { '@type': 'Answer', text: 'Le trajet entre l\'aéroport d\'Orly et le centre de Paris dure entre 25 et 40 minutes selon la circulation, pour une distance d\'environ 15 km.' } },
        { '@type': 'Question', name: 'VTC ou taxi pour Orly, quelle différence ?', acceptedAnswer: { '@type': 'Answer', text: 'Avec RideNow, le prix est fixe et connu à l\'avance contrairement au taxi qui tourne au compteur. Vous réservez à l\'avance et votre chauffeur vous attend même en cas de retard.' } },
        { '@type': 'Question', name: 'Le chauffeur peut-il aller chercher quelqu\'un à Orly ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, nous prenons en charge vos proches ou collègues. Le chauffeur attend dans le hall des arrivées avec une pancarte, quel que soit le terminal (Orly 1, 2, 3 ou 4).' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ridenow.fr' },
        { '@type': 'ListItem', position: 2, name: 'Chauffeur Privé Orly', item: 'https://ridenow.fr/chauffeur-prive-orly' },
      ],
    },
  ],
};

export default function ChauffeurOrlyPage() {
  return (
    <LandingPage
      seoTitle="VTC Aéroport Orly Paris — Chauffeur Privé Prix Fixe dès 40€"
      seoDescription="Chauffeur VTC pour l'aéroport d'Orly. Transfert Paris–Orly dès 40€, prix fixe garanti, suivi de vol en temps réel, accueil dans le hall. Réservez en ligne 24h/24."
      canonical="/chauffeur-prive-orly"
      schema={schema}

      heroImage="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80"
      badge="Service Orly disponible 24h/24 · 7j/7"
      h1="Chauffeur Privé"
      h1accent="Aéroport d'Orly"
      subtitle="Votre chauffeur VTC professionnel vous attend à Orly. Suivi de vol, prix fixe et véhicule de qualité pour un départ ou une arrivée sans stress."
      bookingPickup="Aéroport d'Orly, Orly"
      bookingDropoff="Paris, France"
      stats={[
        { value: 'Dès 40€', label: 'prix fixe' },
        { value: '~30 min', label: 'durée moyenne' },
        { value: 'Inclus', label: 'suivi de vol' },
        { value: '4.9/5', label: 'note clients' },
      ]}
      figures={[
        { value: '15 km', label: 'Distance', sub: 'Orly → Paris centre' },
        { value: '30 min', label: 'Durée', sub: 'hors circulation' },
        { value: 'Dès 40€', label: 'Tarif', sub: 'berline standard' },
        { value: '100%', label: 'Ponctualité', sub: 'garantie' },
      ]}
      advantages={[
        { icon: PlaneTakeoff, title: 'Suivi de vol inclus',        desc: 'Votre chauffeur suit l\'état de votre vol en temps réel. Retard, avance, changement de terminal : il s\'adapte sans surcoût.' },
        { icon: Tag,         title: 'Prix fixe, zéro surprise',    desc: 'Contrairement aux taxis, votre prix est confirmé à la réservation. Pas de compteur, pas de majoration selon l\'itinéraire.' },
        { icon: MapPin,      title: 'Accueil tous terminaux',      desc: 'Orly 1, 2, 3 ou 4 : votre chauffeur vous accueille dans le bon hall avec une pancarte, quels que soient vos terminaux.' },
        { icon: Star,        title: 'Véhicules premium récents',   desc: 'Berlines Mercedes, BMW, Volkswagen de moins de 3 ans. Eau minérale, chargeur et wifi disponibles à bord.' },
      ]}
      steps={[
        { num: '1', title: 'Réservez à l\'avance', desc: 'Entrez votre numéro de vol et votre adresse. Recevez immédiatement une confirmation avec les coordonnées de votre chauffeur.' },
        { num: '2', title: 'Atterrissez sereinement', desc: 'Votre chauffeur est déjà sur place avant même que vous récupériez vos bagages. Il suit votre vol en temps réel.' },
        { num: '3', title: 'Trajet confortable', desc: 'Montez dans un véhicule propre et climatisé. Détendez-vous pendant que votre chauffeur gère la circulation.' },
      ]}
      faqs={[
        { q: 'Quel est le prix d\'un VTC pour l\'aéroport d\'Orly ?', a: 'Le tarif commence à 40€ en berline standard pour un trajet Orly–Paris. Le prix est fixe, annoncé avant la réservation. Pas de différence selon l\'heure ou le jour.' },
        { q: 'Combien de temps dure le trajet Orly–Paris ?', a: 'Entre 25 et 40 minutes selon la circulation, pour environ 15 km. En dehors des heures de pointe, comptez 20 à 25 minutes.' },
        { q: 'VTC ou taxi pour Orly ?', a: 'Le VTC RideNow offre un prix fixe (le taxi facture au compteur), un chauffeur nominatif qui vous attend, et un véhicule récent haut de gamme. Vous savez exactement combien vous allez payer avant de partir.' },
        { q: 'Peut-on réserver un aller-retour Orly ?', a: 'Oui, vous pouvez réserver le trajet aller et retour en une seule fois depuis notre formulaire. Une réduction s\'applique sur le trajet retour pour les membres fidélité.' },
        { q: 'Le chauffeur aide-t-il avec les bagages ?', a: 'Absolument. Votre chauffeur prend en charge vos valises à l\'arrivée et les installe dans le coffre. Pour les groupes avec beaucoup de bagages, le Van est recommandé.' },
      ]}
      ctaTitle="Réservez votre chauffeur pour Orly"
      ctaDesc="Prix fixe · Suivi de vol · Annulation gratuite"
    />
  );
}
