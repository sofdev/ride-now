import express from 'express';
import { randomUUID } from 'crypto';
import { readDb, writeDb } from '../storage/db.js';

const router = express.Router();

function generateInviteCode(name) {
  const prefix = name.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 4);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

/* Créer une entreprise */
router.post('/', (req, res) => {
  const { name, siret, vatNumber, billingEmail, billingAddress, adminUid } = req.body;
  if (!name || !siret || !billingEmail || !adminUid) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  const db = readDb();

  // Vérifier si cet admin a déjà une entreprise
  const existing = Object.values(db.userProfiles).find(p => p.uid === adminUid && p.companyId);
  if (existing) return res.status(409).json({ error: 'Vous avez déjà un compte entreprise' });

  const companyId  = randomUUID();
  const inviteCode = generateInviteCode(name);

  db.companies[companyId] = {
    id: companyId, name, siret, vatNumber: vatNumber || '',
    billingEmail, billingAddress: billingAddress || '',
    adminUid, inviteCode, createdAt: new Date().toISOString(),
  };

  db.userProfiles[adminUid] = {
    uid: adminUid, companyId, role: 'admin',
    displayName: req.body.displayName || '',
    email: req.body.email || '',
    joinedAt: new Date().toISOString(),
  };

  writeDb(db);
  res.status(201).json({ company: db.companies[companyId] });
});

/* Récupérer une entreprise */
router.get('/:id', (req, res) => {
  const db = readDb();
  const company = db.companies[req.params.id];
  if (!company) return res.status(404).json({ error: 'Entreprise introuvable' });
  res.json(company);
});

/* Trouver par code d'invitation */
router.get('/invite/:code', (req, res) => {
  const db = readDb();
  const code = req.params.code.toUpperCase();
  const company = Object.values(db.companies).find(c => c.inviteCode === code);
  if (!company) return res.status(404).json({ error: 'Code invalide' });
  res.json(company);
});

/* Membres d'une entreprise */
router.get('/:id/members', (req, res) => {
  const db = readDb();
  const members = Object.values(db.userProfiles).filter(p => p.companyId === req.params.id);
  res.json(members);
});

/* Retirer un membre */
router.delete('/:companyId/members/:uid', (req, res) => {
  const db = readDb();
  const { companyId, uid } = req.params;
  const company = db.companies[companyId];
  if (!company) return res.status(404).json({ error: 'Entreprise introuvable' });
  if (uid === company.adminUid) return res.status(403).json({ error: 'Impossible de retirer l\'admin' });
  if (db.userProfiles[uid]) {
    delete db.userProfiles[uid].companyId;
    delete db.userProfiles[uid].role;
    writeDb(db);
  }
  res.json({ success: true });
});

export default router;
