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

export default function MentionsPage() {
  return (
    <>
      <SEO
        title="Mentions légales — RideNow VTC Paris"
        description="Mentions légales du service VTC RideNow. Éditeur, hébergeur, propriété intellectuelle et données personnelles."
        canonical="/mentions"
      />
      <div className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Mentions légales</h1>
          <p className="text-slate-400 text-sm mb-10">Mise à jour : mai 2026</p>

          <Section title="Éditeur du site">
            <p><strong>Raison sociale :</strong> RideNow — Transport VTC Premium</p>
            <p><strong>Forme juridique :</strong> Auto-entrepreneur</p>
            <p><strong>Siège social :</strong> Paris, Île-de-France, France</p>
            <p><strong>Téléphone :</strong> <a href={`tel:${PHONE_E164}`} className="text-brand-600 hover:underline">{PHONE_DISPLAY}</a></p>
            <p><strong>Email :</strong> <a href="mailto:contact@ridenow.fr" className="text-brand-600 hover:underline">contact@ridenow.fr</a></p>
          </Section>

          <Section title="Hébergement">
            <p>Ce site est hébergé par un prestataire tiers. Les coordonnées de l'hébergeur sont disponibles sur demande.</p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>L'ensemble du contenu de ce site (textes, images, logos, structure) est protégé par le droit d'auteur et appartient à RideNow. Toute reproduction sans autorisation préalable est interdite.</p>
          </Section>

          <Section title="Données personnelles (RGPD)">
            <p>Les données collectées lors d'une réservation (nom, prénom, email, téléphone) sont utilisées exclusivement pour la gestion de votre course et la communication liée à celle-ci.</p>
            <p>Ces données ne sont jamais cédées à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en nous contactant à <a href="mailto:contact@ridenow.fr" className="text-brand-600 hover:underline">contact@ridenow.fr</a>.</p>
          </Section>

          <Section title="Cookies">
            <p>Ce site utilise des cookies techniques nécessaires au bon fonctionnement du service (session utilisateur, préférences). Aucun cookie publicitaire ou de tracking tiers n'est déposé.</p>
          </Section>

          <Section title="Responsabilité">
            <p>RideNow s'efforce de maintenir les informations de ce site à jour et exactes. Nous déclinons toute responsabilité pour les dommages directs ou indirects liés à l'utilisation de ce site.</p>
          </Section>
        </div>
      </div>
      <Footer />
    </>
  );
}
