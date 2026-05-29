import { Users, Tag, Shield, Clock, Star, MapPin } from 'lucide-react';
import { PHONE_E164 } from '../config.js';
import LandingPage from '../components/LandingPage.jsx';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Van VTC Disneyland Paris — Transfert Famille et Groupe',
      description: 'Transport en van privé vers Disneyland Paris depuis Paris ou les aéroports. Jusqu\'à 7 passagers, prix fixe, véhicule spacieux.',
      provider: {
        '@type': 'LocalBusiness',
        '@id': 'https://ridenow.fr/#business',
        name: 'RideNow — Chauffeur VTC Paris',
        telephone: PHONE_E164,
        url: 'https://ridenow.fr',
        sameAs: ['https://www.google.com/maps/search/RideNow+VTC+Paris'],
      },
      areaServed: [
        { '@type': 'TouristAttraction', name: 'Disneyland Paris' },
        { '@type': 'City',              name: 'Paris' },
        { '@type': 'Airport',           name: 'Aéroport Charles-de-Gaulle (CDG)' },
        { '@type': 'State',             name: 'Île-de-France' },
      ],
      serviceType: 'Transfert van famille',
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price: '80', description: 'À partir de 80€ pour un van Paris–Disneyland Paris (7 passagers)' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Quel est le prix d\'un van pour Disneyland Paris ?', acceptedAnswer: { '@type': 'Answer', text: 'Le transfert en van de Paris vers Disneyland Paris commence à 80€ pour jusqu\'à 7 passagers et 7 bagages. Prix fixe garanti à la réservation.' } },
        { '@type': 'Question', name: 'Combien de temps dure le trajet Paris–Disneyland ?', acceptedAnswer: { '@type': 'Answer', text: 'Le trajet entre Paris et Disneyland Paris (Marne-la-Vallée) dure environ 40 à 55 minutes selon la circulation, pour une distance de 35 à 40 km.' } },
        { '@type': 'Question', name: 'Le van peut-il transporter des poussettes et sièges bébé ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, notre van Mercedes Classe V a un grand coffre et peut accueillir poussettes, sièges bébé et valises. Précisez vos besoins dans les notes à la réservation.' } },
        { '@type': 'Question', name: 'Peut-on aller directement de l\'aéroport CDG à Disneyland ?', acceptedAnswer: { '@type': 'Answer', text: 'Oui, c\'est une de nos courses les plus populaires. CDG est à 20 km de Disneyland Paris, soit environ 30 minutes. Parfait pour les familles arrivant en avion.' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://ridenow.fr' },
        { '@type': 'ListItem', position: 2, name: 'Van Disneyland Paris', item: 'https://ridenow.fr/van-disneyland' },
      ],
    },
  ],
};

export default function VanDisneylandPage() {
  return (
    <LandingPage
      seoTitle="Van VTC Disneyland Paris — Transfert Famille 7 Places Prix Fixe"
      seoDescription="Van privé pour Disneyland Paris jusqu'à 7 passagers. Prix fixe dès 80€, départ depuis Paris, CDG ou Orly. Idéal familles et groupes. Réservez en ligne 24h/24."
      canonical="/van-disneyland"
      schema={schema}

      heroImage="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=80"
      badge="Van disponible pour groupes jusqu'à 7 personnes"
      h1="Van VTC"
      h1accent="Disneyland Paris"
      subtitle="Partez en famille ou en groupe vers Disneyland dans un van Mercedes Classe V spacieux. 7 passagers, 7 bagages, prix fixe. Depuis Paris ou directement depuis CDG et Orly."
      bookingPickup="Paris, France"
      bookingDropoff="Disneyland Paris, Chessy"
      stats={[
        { value: 'Dès 80€', label: 'prix fixe' },
        { value: '7 places', label: 'passagers' },
        { value: '~45 min', label: 'de Paris' },
        { value: 'CDG', label: 'départ direct possible' },
      ]}
      figures={[
        { value: '38 km', label: 'Distance', sub: 'Paris → Disneyland' },
        { value: '45 min', label: 'Durée', sub: 'hors circulation' },
        { value: 'Dès 80€', label: 'Tarif van', sub: 'jusqu\'à 7 pers.' },
        { value: '7+7', label: 'Passagers + bagages', sub: 'Mercedes Classe V' },
      ]}
      advantages={[
        { icon: Users,  title: 'Jusqu\'à 7 passagers',      desc: 'Notre Mercedes Classe V accueille jusqu\'à 7 passagers et 7 valises. Idéal pour les familles, groupes d\'amis ou équipes.' },
        { icon: Tag,    title: 'Prix fixe pour le groupe',   desc: 'Un seul tarif fixe pour tout le groupe. Beaucoup moins cher qu\'un taxi ou plusieurs voitures. Connu avant de partir.' },
        { icon: Shield, title: 'Siège enfant disponible',    desc: 'Siège bébé et rehausseur disponibles sur demande (précisez dans les notes). Vos enfants voyagent en sécurité.' },
        { icon: Star,   title: 'Départ depuis CDG ou Orly',  desc: 'Récupérez votre famille à CDG ou Orly et allez directement à Disneyland. La distance CDG–Disneyland est de seulement 20 km.' },
      ]}
      steps={[
        { num: '1', title: 'Réservez le van', desc: 'Sélectionnez "Van" dans le formulaire. Indiquez le nombre de passagers et vos besoins (siège bébé, etc.) dans les notes.' },
        { num: '2', title: 'Montée à bord', desc: 'Votre chauffeur vient vous chercher à domicile, à l\'hôtel ou à l\'aéroport. Il aide avec les bagages et installe les enfants.' },
        { num: '3', title: 'Arrivée à l\'entrée', desc: 'Déposé directement à l\'entrée du parc. Pas de parking, pas de navette, pas de stress. Les enfants arrivent frais et heureux.' },
      ]}
      faqs={[
        { q: 'Quel est le prix d\'un van pour Disneyland Paris ?', a: 'Le van Paris–Disneyland commence à 80€ pour jusqu\'à 7 passagers. Ce prix unique est beaucoup plus économique que plusieurs taxis ou voitures séparées.' },
        { q: 'Peut-on aller de l\'aéroport CDG directement à Disneyland ?', a: 'Oui, c\'est une de nos courses les plus demandées. CDG se trouve à seulement 20 km de Disneyland Paris. Trajet d\'environ 30 minutes, dès 70€ en van.' },
        { q: 'Le van accepte-t-il des poussettes ?', a: 'Oui, le coffre du Mercedes Classe V est très grand et peut accueillir poussettes, sièges auto et valises. Précisez vos équipements dans les notes de réservation.' },
        { q: 'Peut-on réserver un aller-retour pour Disneyland ?', a: 'Absolument. Réservez votre aller et retour en même temps. Le chauffeur du retour vous attend à l\'heure convenue à l\'entrée du parc.' },
        { q: 'Combien coûte le trajet depuis Orly vers Disneyland ?', a: 'Le trajet Orly–Disneyland en van est d\'environ 45 km. Comptez à partir de 90€ pour le groupe. Le prix fixe est confirmé à la réservation.' },
      ]}
      ctaTitle="Réservez votre van pour Disneyland"
      ctaDesc="Jusqu'à 7 passagers · Prix fixe · Siège bébé disponible"
    />
  );
}
