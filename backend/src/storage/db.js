import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dirname, '../../data');
const DB_PATH   = join(DATA_DIR, 'db.json');

const DEFAULT = { companies: {}, userProfiles: {}, bookings: {} };

export function readDb() {
  if (!existsSync(DB_PATH)) return structuredClone(DEFAULT);
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf8'));
  } catch {
    return structuredClone(DEFAULT);
  }
}

export function writeDb(data) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}
