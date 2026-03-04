import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'database.sqlite');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

console.log('\n=== All Newspapers ===');
const allNewspapers = db.prepare('SELECT * FROM newspapers').all();
console.log(allNewspapers);

console.log('\n=== Published Newspapers ===');
const publishedNewspapers = db.prepare("SELECT * FROM newspapers WHERE status = 'published'").all();
console.log(publishedNewspapers);

console.log('\n=== All Articles ===');
const allArticles = db.prepare('SELECT * FROM articles').all();
console.log(allArticles);

db.close();
