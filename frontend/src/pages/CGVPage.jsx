import SEO from '../components/SEO.jsx';
import Footer from '../components/Footer.jsx';
import { PHONE_DISPLAY, PHONE_E164 } from '../config.js';

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-black text-slate-900 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function CGVPage() {
  return (
    <>
      <SEO
        title="Conditions Générales de Vente — RideNow VTC Paris"
        description="Conditions générales de vente du service de transport VTC RideNow à Paris. Tarifs, réservation, annulation et responsabilités."
        canonical="/cgv"
      />
      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Conditions Générales de Vente</h1>
          <p className="text-slate-400 text-sm mb-10">Mise à jour : mai 2026</p>

          <Section title="1. Objet">
            <p>Les présentes CGV régissent les relations contractuelles entre RideNow (ci-après « le Prestataire ») et tout client (ci-après « le Client ») ayant recours à ses services de transport privé avec chauffeur (VTC).</p>
          </Section>

          <Section title="2. Réservation">
            <p>Toute réservation est considérée comme ferme et définitive après confirmation par email. Le Client s'engage à fournir des informations exactes lors de la réservation (adresse, date, heure, nombre de passagers).</p>
            <p>En cas d'informations erronées entraînant un retard ou une impossibilité d'exécution, RideNow ne pourra être tenu responsable.</p>
          </Section>

          <Section title="3. Tarifs">
            <p>Les prix affichés sont en euros TTC. Ils sont calculés en fonction de la distance, du type de véhicule et d'un tarif de prise en charge, avec un minimum garanti par catégorie :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Berline Standard : à partir de 20€</li>
              <li>Berline Premium : à partir de 35€</li>
              <li>Van (7 places) : à partir de 45€</li>
            </ul>
            <p>Le prix affiché lors de la confirmation inclut les péages. Aucun supplément ne sera facturé sauf prestation spéciale demandée par le Client.</p>
          </Section>

          <Section title="4. Paiement">
            <p>Le règlement peut être effectué :</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>En ligne par carte bancaire via Stripe (Visa, Mastercard, American Express)</li>
              <li>En ligne via PayPal</li>
              <li>À bord en espèces ou par carte bancaire auprès du chauffeur</li>
            </ul>
          </Section>

          <Section title="5. Annulation et modification">
            <p><strong>Annulation gratuite</strong> si elle intervient plus de 2 heures avant l'heure de prise en charge.</p>
            <p><strong>Annulation tardive</strong> (moins de 2 heures avant le départ) : des frais de 20% du montant de la course seront facturés.</p>
            <p><strong>No-show</strong> (absence sans annulation préalable) : le montant total de la course peut être facturé. Le chauffeur patientera 15 minutes à l'adresse convenue.</p>
            <p>Toute modification de réservation doit être effectuée en contactant RideNow par téléphone (<a href={`tel:${PHONE_E164}`} className="text-brand-600 hover:underline">{PHONE_DISPLAY}</a>) ou depuis votre espace client.</p>
          </Section>

          <Section title="6. Obligations du Prestataire">
            <p>RideNow s'engage à fournir un véhicule propre et entretenu, conduit par un chauffeur titulaire de la carte professionnelle VTC et couvert par une assurance professionnelle transport de personnes.</p>
            <p>En cas d'impossibilité d'exécution pour raison de force majeure, RideNow s'engage à en informer le Client dans les meilleurs délais et à procéder au remboursement intégral si un remplacement n'est pas possible.</p>
          </Section>

          <Section title="7. Responsabilité">
            <p>RideNow est soumis à une obligation de moyens et non de résultat concernant les délais, en raison de l'imprévisibilité du trafic. Les temps de trajet indiqués sont des estimations et peuvent varier.</p>
            <p>La responsabilité de RideNow ne saurait être engagée en cas de retard lié à des conditions de circulation exceptionnelles, un accident ou tout événement de force majeure.</p>
          </Section>

          <Section title="8. Litiges">
            <p>En cas de litige, le Client peut contacter RideNow à <a href="mailto:contact@ridenow.fr" className="text-brand-600 hover:underline">contact@ridenow.fr</a>. À défaut de résolution amiable, les tribunaux compétents de Paris seront seuls compétents.</p>
          </Section>
        </div>
      </div>
      <Footer />
    </>
  );
}
