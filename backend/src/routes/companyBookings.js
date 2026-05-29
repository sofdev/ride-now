import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { readDb, writeDb } from '../storage/db.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendThankYouEmail = async (booking) => {
  if (!process.env.SMTP_USER || !booking.userEmail) return;
  const reviewUrl = process.env.GOOGLE_REVIEW_URL || 'https://g.page/r/VOTRE_PLACE_ID/review';
  try {
    await transporter.sendMail({
      from: `"RideNow" <${process.env.SMTP_USER}>`,
      to: booking.userEmail,
      subject: `Merci pour votre course RideNow — Référence #${booking.reference}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#0066FF,#0044CC);padding:30px;text-align:center;">
            <h1 style="color:white;margin:0;">RideNow</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Votre chauffeur privé</p>
          </div>
          <div style="padding:30px;background:#f8fafc;">
            <h2 style="color:#1e293b;">Merci pour votre confiance !</h2>
            <p>Bonjour <strong>${booking.userName || ''}</strong>,</p>
            <p>Nous espérons que votre trajet s'est déroulé dans les meilleures conditions.</p>
            <div style="background:white;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #0066FF;">
              <p style="margin:0 0 8px;"><strong>Référence :</strong> #${booking.reference}</p>
              <p style="margin:0 0 8px;"><strong>Trajet :</strong> ${booking.pickup} → ${booking.dropoff}</p>
              <p style="margin:0;"><strong>Date :</strong> ${booking.date} à ${booking.time}</p>
            </div>
            <p>Votre avis compte énormément pour nous. En partageant votre expérience sur Google, vous aidez d'autres voyageurs à nous découvrir.</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${reviewUrl}"
                style="display:inline-block;background:#0066FF;color:white;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:15px;text-decoration:none;">
                ⭐ Laisser un avis Google
              </a>
            </div>
            <p style="color:#64748b;font-size:13px;">Merci de voyager avec RideNow — Transport VTC Premium Paris</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Thank-you email error:', err.message);
  }
};

const sendCancellationEmail = async (booking, fee) => {
  if (!process.env.SMTP_USER || !booking.userEmail) return;
  try {
    await transporter.sendMail({
      from: `"RideNow" <${process.env.SMTP_USER}>`,
      to: booking.userEmail,
      subject: `Annulation de votre réservation #${booking.reference}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#0066FF,#0044CC);padding:30px;text-align:center;">
            <h1 style="color:white;margin:0;">RideNow</h1>
          </div>
          <div style="padding:30px;background:#f8fafc;">
            <h2 style="color:#1e293b;">Réservation annulée</h2>
            <p>Bonjour <strong>${booking.userName || ''}</strong>,</p>
            <p>Votre réservation <strong>#${booking.reference}</strong> a bien été annulée.</p>
            <div style="background:white;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid ${fee > 0 ? '#f59e0b' : '#22c55e'};">
              <p><strong>Trajet :</strong> ${booking.pickup} → ${booking.dropoff}</p>
              <p><strong>Date :</strong> ${booking.date} à ${booking.time}</p>
              ${fee > 0
                ? `<p style="color:#d97706;"><strong>Frais d'annulation (20%) :</strong> ${fee}€</p>`
                : `<p style="color:#16a34a;"><strong>Annulation gratuite</strong> — aucun frais prélevé.</p>`
              }
            </div>
            <p style="color:#64748b;font-size:14px;">RideNow — Transport VTC Premium</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Cancel email error:', err.message);
  }
};

const router = express.Router();

/* Enregistrer une réservation */
router.post('/', (req, res) => {
  const {
    reference, userId, userName, userEmail, companyId,
    pickup, dropoff, date, time, vehicleType, passengers, price,
  } = req.body;

  if (!reference || !userId) return res.status(400).json({ error: 'Données manquantes' });

  const db = readDb();
  if (!db.bookings) db.bookings = {};

  db.bookings[reference] = {
    reference, userId, userName, userEmail,
    companyId: companyId || null,
    pickup, dropoff, date, time, vehicleType, passengers, price,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  writeDb(db);
  res.status(201).json({ success: true });
});

/* Routes spécifiques en premier (avant /:reference) */

router.get('/user/:userId', async (req, res) => {
  const db  = readDb();
  const now = new Date();
  let changed = false;

  const bookings = Object.values(db.bookings || {})
    .filter(b => b.userId === req.params.userId);

  for (const booking of bookings) {
    if (booking.status !== 'confirmed') continue;
    const tripEnd = new Date(`${booking.date}T${booking.time}`);
    tripEnd.setHours(tripEnd.getHours() + 1); // grace d'1h après l'heure de départ
    if (now >= tripEnd) {
      db.bookings[booking.reference] = { ...booking, status: 'completed', completedAt: now.toISOString() };
      changed = true;
      sendThankYouEmail(booking).catch(err => console.error('[thank-you email]', err.message));
    }
  }

  if (changed) writeDb(db);

  const result = Object.values(db.bookings || {})
    .filter(b => b.userId === req.params.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(result);
});

router.get('/company/:companyId', (req, res) => {
  const db = readDb();
  const bookings = Object.values(db.bookings || {})
    .filter(b => b.companyId === req.params.companyId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(bookings);
});

/* Récupérer une réservation par référence (pour la facture) */
router.get('/:reference', (req, res) => {
  const db      = readDb();
  const booking = db.bookings?.[req.params.reference.toUpperCase()];
  if (!booking) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(booking);
});

/* Annulation d'une réservation avec règle des 2h */
router.patch('/:reference/cancel', async (req, res) => {
  const db        = readDb();
  const reference = req.params.reference.toUpperCase();
  const booking   = db.bookings?.[reference];

  if (!booking) return res.status(404).json({ error: 'Réservation introuvable' });
  if (booking.status === 'cancelled') return res.status(400).json({ error: 'Réservation déjà annulée' });

  const tripDateTime   = new Date(`${booking.date}T${booking.time}`);
  const now            = new Date();
  const hoursUntilTrip = (tripDateTime - now) / (1000 * 60 * 60);

  if (hoursUntilTrip < 0) {
    return res.status(400).json({ error: 'Impossible d\'annuler un trajet passé' });
  }

  const fee = hoursUntilTrip < 2
    ? Math.round((booking.price || 0) * 0.20 * 100) / 100
    : 0;

  const updated = {
    ...booking,
    status: 'cancelled',
    cancelledAt: now.toISOString(),
    cancellationFee: fee,
  };
  db.bookings[reference] = updated;
  writeDb(db);

  res.json({ success: true, fee, freeCancellation: fee === 0 });

  sendCancellationEmail(updated, fee).catch(err => console.error('[cancel email]', err.message));
});

export default router;
