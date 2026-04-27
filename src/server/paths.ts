import fs from 'fs';
import path from 'path';

export const DATA_DIR = process.env.DATA_DIR?.trim() || path.join(process.cwd(), 'data');
export const UPLOAD_ROOT = path.join(DATA_DIR, 'uploads');
export const DB_PATH = path.join(DATA_DIR, 'database.sqlite');

export function ensureDataDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(UPLOAD_ROOT)) {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  }
}
