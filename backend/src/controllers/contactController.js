import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  if (process.env.SMTP_USER) {
    try {
      await transporter.sendMail({
        from: `"RideNow Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL,
        subject: `Nouveau message de ${name}`,
        html: `
          <h3>Nouveau message de contact</h3>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
          <p><strong>Message :</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (err) {
      console.error('Contact email error:', err.message);
    }
  }

  res.json({ success: true, message: 'Message envoyé avec succès' });
};
