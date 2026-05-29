import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { readDb, writeDb } from '../storage/db.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

console.log('[bookingController] SMTP_USER:', process.env.SMTP_USER || 'NOT SET');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const VEHICLE_LABELS = {
  standard: 'Berline Standard',
  premium:  'Berline Premium',
  van:      'Van / Minivan',
  electric: 'Électrique',
};

const sendConfirmationEmail = async (booking) => {
  if (!process.env.SMTP_USER) {
    console.warn('[email] SMTP_USER not set — skipping confirmation email');
    return;
  }
  const ref = booking.reference || booking.id.slice(0, 8).toUpperCase();
  const vehicleLabel = VEHICLE_LABELS[booking.vehicleType] || booking.vehicleType;
  console.log(`[email] Sending confirmation to ${booking.email} (ref: ${ref})`);

  // 1. Email de confirmation au client
  await transporter.sendMail({
    from: `"RideNow" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `Confirmation de réservation #${ref}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#0066FF,#0044CC);padding:30px;text-align:center;">
          <h1 style="color:white;margin:0;">RideNow</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;">Votre chauffeur privé</p>
        </div>
        <div style="padding:30px;background:#f8fafc;">
          <h2 style="color:#1e293b;">Réservation confirmée ✓</h2>
          <p>Bonjour <strong>${booking.firstName} ${booking.lastName}</strong>,</p>
          <p>Votre réservation a bien été enregistrée. Notre équipe vous contactera sous peu pour confirmer les détails.</p>
          <div style="background:white;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #0066FF;">
            <p style="margin:0 0 8px;"><strong>Référence :</strong> #${ref}</p>
            <p style="margin:0 0 8px;"><strong>Date :</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time}</p>
            <p style="margin:0 0 8px;"><strong>Départ :</strong> ${booking.pickup}</p>
            <p style="margin:0 0 8px;"><strong>Destination :</strong> ${booking.dropoff}</p>
            <p style="margin:0 0 8px;"><strong>Véhicule :</strong> ${vehicleLabel}</p>
            <p style="margin:0 0 8px;"><strong>Passagers :</strong> ${booking.passengers}</p>
            <p style="margin:0;"><strong>Prix estimé :</strong> ${booking.estimatedPrice}€</p>
          </div>
          <p style="color:#64748b;font-size:13px;">RideNow — Transport VTC Premium Paris</p>
        </div>
      </div>
    `,
  });

  console.log(`[email] Confirmation sent to ${booking.email}`);

  // 2. Notification au gérant
  if (!process.env.CONTACT_EMAIL) return;
  await transporter.sendMail({
    from: `"RideNow" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `🚗 Nouvelle réservation #${ref} — ${booking.firstName} ${booking.lastName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1e293b;padding:20px 30px;">
          <h2 style="color:white;margin:0;">Nouvelle réservation</h2>
        </div>
        <div style="padding:24px;background:#f8fafc;">
          <div style="background:white;border-radius:8px;padding:20px;border-left:4px solid #0066FF;">
            <p style="margin:0 0 8px;"><strong>Référence :</strong> #${ref}</p>
            <p style="margin:0 0 8px;"><strong>Client :</strong> ${booking.firstName} ${booking.lastName}</p>
            <p style="margin:0 0 8px;"><strong>Email :</strong> ${booking.email}</p>
            <p style="margin:0 0 8px;"><strong>Téléphone :</strong> ${booking.phone}</p>
            <p style="margin:0 0 8px;"><strong>Date :</strong> ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time}</p>
            <p style="margin:0 0 8px;"><strong>Départ :</strong> ${booking.pickup}</p>
            <p style="margin:0 0 8px;"><strong>Destination :</strong> ${booking.dropoff}</p>
            <p style="margin:0 0 8px;"><strong>Véhicule :</strong> ${vehicleLabel}</p>
            <p style="margin:0 0 8px;"><strong>Passagers :</strong> ${booking.passengers}</p>
            <p style="margin:0 0 8px;"><strong>Prix :</strong> ${booking.estimatedPrice}€</p>
            ${booking.notes ? `<p style="margin:0;"><strong>Notes :</strong> ${booking.notes}</p>` : ''}
          </div>
        </div>
      </div>
    `,
  });
  console.log(`[email] Admin notification sent to ${process.env.CONTACT_EMAIL}`);
};

export const createBooking = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      pickup, dropoff, date, time,
      vehicleType, passengers, estimatedPrice, notes,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !pickup || !dropoff || !date || !time) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const bookingDateTime = new Date(`${date}T${time}`);
    if (isNaN(bookingDateTime.getTime()) || bookingDateTime <= new Date()) {
      return res.status(400).json({ error: 'La date de réservation doit être dans le futur' });
    }

    const booking = {
      id: uuidv4(),
      firstName, lastName, email, phone,
      pickup, dropoff, date, time,
      vehicleType: vehicleType || 'standard',
      passengers: passengers || 1,
      estimatedPrice: estimatedPrice || 0,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const reference = booking.id.slice(0, 8).toUpperCase();
    booking.reference = reference;

    const db = readDb();
    if (!db.allBookings) db.allBookings = {};
    db.allBookings[reference] = booking;
    writeDb(db);

    // Respond immediately so SMTP latency never blocks the client
    res.status(201).json({
      success: true,
      bookingId: booking.id,
      reference,
      message: 'Réservation créée avec succès',
    });

    sendConfirmationEmail(booking).catch(err =>
      console.error('[createBooking] email error:', err.message),
    );
  } catch (err) {
    console.error('[createBooking] Error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const getBooking = (req, res) => {
  const db = readDb();
  const booking = db.allBookings?.[req.params.id.toUpperCase()];
  if (!booking) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(booking);
};

export const getAllBookings = (req, res) => {
  const db = readDb();
  res.json(Object.values(db.allBookings || {}));
};
