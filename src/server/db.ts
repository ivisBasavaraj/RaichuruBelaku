import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { DB_PATH, ensureDataDirectories } from './paths';

ensureDataDirectories();
export const db = new Database(DB_PATH);

export function initDb() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'user')) NOT NULL,
      name TEXT
    )
  `);

  // Newspapers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS newspapers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      publication_date TEXT NOT NULL,
      pdf_path TEXT NOT NULL,
      thumbnail_path TEXT,
      status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Articles/Regions Table
  // Stores the mapped regions for each page
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      newspaper_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      title TEXT,
      content TEXT,
      x REAL NOT NULL, -- Percentage x
      y REAL NOT NULL, -- Percentage y
      width REAL NOT NULL, -- Percentage width
      height REAL NOT NULL, -- Percentage height
      image_path TEXT, -- Path to cropped image
      FOREIGN KEY (newspaper_id) REFERENCES newspapers(id) ON DELETE CASCADE
    )
  `);

  // Backward-compatible migration for older databases that predate image_path/title/content.
  const articleColumns = db.prepare("PRAGMA table_info(articles)").all() as Array<{ name: string }>;
  const articleColumnNames = new Set(articleColumns.map((col) => col.name));

  if (!articleColumnNames.has('title')) {
    db.exec('ALTER TABLE articles ADD COLUMN title TEXT');
  }
  if (!articleColumnNames.has('content')) {
    db.exec('ALTER TABLE articles ADD COLUMN content TEXT');
  }
  if (!articleColumnNames.has('image_path')) {
    db.exec('ALTER TABLE articles ADD COLUMN image_path TEXT');
  }

  // Create default admin if not exists
  const adminExists = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (id, email, password, role, name) VALUES (?, ?, ?, ?, ?)').run(
      'admin-id',
      'admin@example.com',
      hashedPassword,
      'admin',
      'ಮುಖ್ಯ ಸಂಪಾದಕರು'
    );
    console.log('Default admin created: admin@example.com / admin123');
  }
}
