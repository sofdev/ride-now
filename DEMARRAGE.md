# RideNow — Guide de démarrage

## Prérequis
- Node.js 18+
- Une clé API Google Maps (Places + Maps JavaScript API)

## Installation

```bash
# Installer toutes les dépendances
cd frontend && npm install
cd ../backend && npm install
```

## Configuration

### Frontend
Créer `frontend/.env` :
```
VITE_GOOGLE_MAPS_API_KEY=votre-clé-google-maps
```

### Backend
Créer `backend/.env` à partir de `backend/.env.example` :
```
PORT=3001
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
CONTACT_EMAIL=contact@ridenow.fr
WHATSAPP_NUMBER=33612345678
```

## Démarrage (deux terminaux)

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
# → http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

## Obtenir une clé Google Maps

1. Aller sur https://console.cloud.google.com
2. Créer un projet
3. Activer "Maps JavaScript API" et "Places API"
4. Créer une clé API et la restreindre à votre domaine

## Structure du projet

```
vtc/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/   # Header, Hero, Services, Fleet, PriceEstimator...
│   │   └── pages/        # Home, ServicesPage, BookingPage, ContactPage
├── backend/           # Node.js + Express
│   └── src/
│       ├── controllers/  # bookingController, pricingController, contactController
│       └── routes/       # bookings, pricing, contact
```

## Personnalisation

- **Numéro de téléphone** : rechercher `06 12 34 56 78` et `33612345678` partout
- **Email** : rechercher `contact@ridenow.fr`
- **Prix** : modifier `backend/src/controllers/pricingController.js`
- **Couleurs** : modifier `frontend/tailwind.config.js`
