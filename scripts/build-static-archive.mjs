import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dataDir = path.join(rootDir, 'data');
const uploadsSourceDir = path.join(dataDir, 'uploads');
const dbPath = path.join(dataDir, 'database.sqlite');

const publicDir = path.join(rootDir, 'public');
const publicDataDir = path.join(publicDir, 'data');
const publicUploadsDir = path.join(publicDir, 'uploads');
const outputJsonPath = path.join(publicDataDir, 'newspapers.json');

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeArchivePayload(payload) {
  ensureDirectory(publicDataDir);
  fs.writeFileSync(outputJsonPath, JSON.stringify(payload, null, 2));
}

function copyUploads() {
  fs.rmSync(publicUploadsDir, { recursive: true, force: true });
  ensureDirectory(publicUploadsDir);

  if (!fs.existsSync(uploadsSourceDir)) {
    return;
  }

  fs.cpSync(uploadsSourceDir, publicUploadsDir, { recursive: true });
}

function exportPublishedArchive() {
  if (!fs.existsSync(dbPath)) {
    writeArchivePayload({
      generatedAt: new Date().toISOString(),
      newspapers: [],
    });
    return;
  }

  const db = new Database(dbPath, { readonly: true });
  const newspaperRows = db
    .prepare(`
      SELECT id, title, publication_date, pdf_path, thumbnail_path, status, created_at
      FROM newspapers
      WHERE status = 'published'
      ORDER BY publication_date DESC, created_at DESC
    `)
    .all();
  const articleStmt = db.prepare(`
    SELECT id, title, content, page_number, x, y, width, height, image_path
    FROM articles
    WHERE newspaper_id = ?
    ORDER BY page_number ASC, y ASC, x ASC
  `);

  const newspapers = newspaperRows.map((newspaper) => ({
    ...newspaper,
    articles: articleStmt.all(newspaper.id),
  }));

  db.close();

  writeArchivePayload({
    generatedAt: new Date().toISOString(),
    newspapers,
  });
}

ensureDirectory(publicDir);
copyUploads();
exportPublishedArchive();

console.log(`Static archive prepared at ${outputJsonPath}`);
