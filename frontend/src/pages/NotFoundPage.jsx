import { Link } from 'react-router-dom';
import { Home, Phone } from 'lucide-react';
import { PHONE_E164, PHONE_DISPLAY } from '../config.js';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-brand-100 mb-2">404</p>
        <h1 className="text-2xl font-black text-slate-900 mb-3">Page introuvable</h1>
        <p className="text-slate-500 mb-8">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary py-3 px-6">
            <Home size={16} /> Retour à l'accueil
          </Link>
          <a href={`tel:${PHONE_E164}`} className="btn-secondary py-3 px-6">
            <Phone size={16} /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}
