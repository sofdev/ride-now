import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { originLat, originLng, destLat, destLng } = req.body;

  if (!originLat || !originLng || !destLat || !destLng) {
    return res.status(400).json({ error: 'Coordonnées manquantes' });
  }

  try {
    const { data } = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        origin:      { location: { latLng: { latitude: originLat, longitude: originLng } } },
        destination: { location: { latLng: { latitude: destLat,   longitude: destLng   } } },
        travelMode:  'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        languageCode: 'fr-FR',
        units: 'METRIC',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
      }
    );

    const route = data.routes?.[0];
    if (!route) return res.status(404).json({ error: 'Aucun itinéraire trouvé' });

    res.json({
      distanceMeters:   route.distanceMeters,
      durationSeconds:  parseInt(route.duration),
      encodedPolyline:  route.polyline.encodedPolyline,
    });
  } catch (err) {
    const details = err.response?.data;
    const status  = err.response?.status;
    console.error(`Routes API ${status}:`, JSON.stringify(details, null, 2) || err.message);
    res.status(502).json({ error: 'Impossible de calculer l\'itinéraire', googleStatus: status, details });
  }
});

export default router;
