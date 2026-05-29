import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bookingRoutes from './routes/bookings.js';
import pricingRoutes from './routes/pricing.js';
import contactRoutes from './routes/contact.js';
import directionsRoutes from './routes/directions.js';
import companiesRoutes from './routes/companies.js';
import userProfilesRoutes from './routes/userProfiles.js';
import companyBookingsRoutes from './routes/companyBookings.js';
import paypalRoutes from './routes/paypal.js';
import stripeRoutes from './routes/stripe.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/directions', directionsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/user-profiles', userProfilesRoutes);
app.use('/api/user-bookings', companyBookingsRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/stripe', stripeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`RideNow API running on http://localhost:${PORT}`);
});
