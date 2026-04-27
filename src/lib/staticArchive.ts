export interface Article {
  id: string;
  title: string;
  content: string;
  page_number: number;
  x: number;
  y: number;
  width: number;
  height: number;
  image_path?: string | null;
}

export interface NewspaperSummary {
  id: string;
  title: string;
  publication_date: string;
  pdf_path: string;
  thumbnail_path?: string | null;
  status: string;
  created_at?: string | null;
}

export interface NewspaperRecord extends NewspaperSummary {
  articles: Article[];
}

interface ArchiveCatalog {
  generatedAt: string;
  newspapers: NewspaperRecord[];
}

let archivePromise: Promise<ArchiveCatalog> | null = null;

async function loadArchiveCatalog() {
  if (!archivePromise) {
    archivePromise = fetch('/data/newspapers.json')
      .then(async (response) => {
        const body = await response.text();

        if (!response.ok) {
          throw new Error(`Static archive request failed with ${response.status}`);
        }

        const trimmedBody = body.trim();
        if (!trimmedBody) {
          throw new Error('Static archive is empty');
        }

        try {
          return JSON.parse(trimmedBody) as ArchiveCatalog;
        } catch {
          throw new Error(`Static archive is not valid JSON: ${trimmedBody.slice(0, 80)}`);
        }
      })
      .catch((error) => {
        archivePromise = null;
        throw error;
      });
  }

  return archivePromise;
}

export async function listPublishedNewspapers() {
  const catalog = await loadArchiveCatalog();
  return catalog.newspapers.map(({ articles, ...newspaper }) => newspaper);
}

export async function getPublishedNewspaperById(id: string) {
  const catalog = await loadArchiveCatalog();
  return catalog.newspapers.find((newspaper) => newspaper.id === id) ?? null;
}
