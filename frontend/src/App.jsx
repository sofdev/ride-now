import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';

const Home                = lazy(() => import('./pages/Home.jsx'));
const ServicesPage        = lazy(() => import('./pages/ServicesPage.jsx'));
const BookingPage         = lazy(() => import('./pages/BookingPage.jsx'));
const ContactPage         = lazy(() => import('./pages/ContactPage.jsx'));
const EnterprisePage      = lazy(() => import('./pages/EnterprisePage.jsx'));
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard.jsx'));
const ProfilePage         = lazy(() => import('./pages/ProfilePage.jsx'));
const MyTripsPage         = lazy(() => import('./pages/MyTripsPage.jsx'));
const SettingsPage        = lazy(() => import('./pages/SettingsPage.jsx'));
const InvoicePage             = lazy(() => import('./pages/InvoicePage.jsx'));
const TransfertCDGPage        = lazy(() => import('./pages/TransfertCDGPage.jsx'));
const ChauffeurOrlyPage       = lazy(() => import('./pages/ChauffeurOrlyPage.jsx'));
const VanDisneylandPage       = lazy(() => import('./pages/VanDisneylandPage.jsx'));
const ChauffeurAffairesPage   = lazy(() => import('./pages/ChauffeurAffairesPage.jsx'));
const FAQPage                 = lazy(() => import('./pages/FAQPage.jsx'));
const MentionsPage            = lazy(() => import('./pages/MentionsPage.jsx'));
const CGVPage                 = lazy(() => import('./pages/CGVPage.jsx'));
const NotFoundPage            = lazy(() => import('./pages/NotFoundPage.jsx'));

const GOOGLE_MAPS_LIBRARIES = ['places', 'marker'];
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Pages with a full-width dark hero — header stays transparent until scroll
const HERO_PATHS = ['/', '/transfert-cdg-paris', '/chauffeur-prive-orly', '/van-disneyland', '/chauffeur-affaires-la-defense'];

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Chargement…</p>
      </div>
    </div>
  );
}

function AppInner() {
  const location = useLocation();
  const hasHero = HERO_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content" className={hasHero ? '' : 'pt-20'}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"                       element={<Home />} />
                <Route path="/services"             element={<ServicesPage />} />
                <Route path="/reservation"          element={<BookingPage />} />
                <Route path="/contact"              element={<ContactPage />} />
                <Route path="/entreprise"           element={<EnterprisePage />} />
                <Route path="/entreprise/dashboard" element={<EnterpriseDashboard />} />
                <Route path="/profil"              element={<ProfilePage />} />
                <Route path="/mes-trajets"         element={<MyTripsPage />} />
                <Route path="/parametres"          element={<SettingsPage />} />
                <Route path="/facture/:reference"              element={<InvoicePage />} />
                <Route path="/transfert-cdg-paris"            element={<TransfertCDGPage />} />
                <Route path="/chauffeur-prive-orly"           element={<ChauffeurOrlyPage />} />
                <Route path="/van-disneyland"                 element={<VanDisneylandPage />} />
                <Route path="/chauffeur-affaires-la-defense"  element={<ChauffeurAffairesPage />} />
                <Route path="/faq"                            element={<FAQPage />} />
                <Route path="/mentions"                       element={<MentionsPage />} />
                <Route path="/cgv"                            element={<CGVPage />} />
                <Route path="*"                               element={<NotFoundPage />} />
              </Routes>
            </Suspense>
      </main>
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
        <AppInner />
      </LoadScript>
    </AuthProvider>
  );
}
