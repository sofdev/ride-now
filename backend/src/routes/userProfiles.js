import express from 'express';
import { readDb, writeDb } from '../storage/db.js';

const router = express.Router();

/* Récupérer le profil d'un utilisateur */
router.get('/:uid', (req, res) => {
  const db = readDb();
  const profile = db.userProfiles[req.params.uid] || null;
  res.json(profile);
});

/* Créer ou mettre à jour un profil (rejoindre via code d'invitation) */
router.post('/:uid', (req, res) => {
  const { uid } = req.params;
  const { inviteCode, displayName, email } = req.body;
  const db = readDb();

  if (inviteCode) {
    const code    = inviteCode.toUpperCase();
    const company = Object.values(db.companies).find(c => c.inviteCode === code);
    if (!company) return res.status(404).json({ error: 'Code d\'invitation invalide' });

    db.userProfiles[uid] = {
      uid, companyId: company.id, role: 'employee',
      displayName: displayName || '', email: email || '',
      joinedAt: new Date().toISOString(),
    };
    writeDb(db);
    return res.json({ profile: db.userProfiles[uid], company });
  }

  res.status(400).json({ error: 'Code d\'invitation requis' });
});

/* Mettre à jour les champs libres d'un profil (téléphone, etc.) */
router.patch('/:uid', (req, res) => {
  const { uid } = req.params;
  const { phone, displayName } = req.body;
  const db = readDb();

  const existing = db.userProfiles[uid] || { uid };
  db.userProfiles[uid] = {
    ...existing,
    ...(displayName !== undefined && { displayName }),
    ...(phone       !== undefined && { phone }),
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  res.json({ profile: db.userProfiles[uid] });
});

export default router;
