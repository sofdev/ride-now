import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_E164 } from '../config.js';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">RN</span>
              </div>
              <span className="text-xl font-black">Ride<span className="text-brand-400">Now</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Votre chauffeur VTC premium à Paris et en Île-de-France. Disponible 24h/24, 7j/7.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {[
                ['Transfert CDG Paris', '/transfert-cdg-paris'],
                ['Chauffeur Privé Orly', '/chauffeur-prive-orly'],
                ['Van Disneyland Paris', '/van-disneyland'],
                ['Chauffeur d\'Affaires', '/chauffeur-affaires-la-defense'],
                ['Lieux touristiques', '/services'],
                ['Mise à disposition', '/contact'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors hover:pl-1 block transition-all">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                ['Accueil', '/'],
                ['Nos services', '/services'],
                ['Réservation', '/reservation'],
                ['FAQ', '/faq'],
                ['Contact', '/contact'],
                ['Mentions légales', '/mentions'],
                ['CGV', '/cgv'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${PHONE_E164}`} className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-slate-800 group-hover:bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Téléphone</p>
                    <p className="text-sm font-semibold">{PHONE_DISPLAY}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:contact@ridenow.fr" className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-slate-800 group-hover:bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="text-sm font-semibold">contact@ridenow.fr</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Disponibilité</p>
                  <p className="text-sm font-semibold">24h/24 — 7j/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Zone</p>
                  <p className="text-sm font-semibold">Paris & Île-de-France</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">© 2024 RideNow. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">Paiements sécurisés</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'CB'].map(card => (
                <span key={card} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 font-mono">{card}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
