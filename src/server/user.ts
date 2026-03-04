import { Router, Request, Response } from 'express';
import { db } from './db';

export const userRouter = Router();

// Get published newspapers (public access)
userRouter.get('/newspapers', (req: Request, res: Response) => {
  try {
    const newspapers = db.prepare("SELECT * FROM newspapers WHERE status = 'published' ORDER BY publication_date DESC").all();
    res.json(newspapers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch newspapers' });
  }
});

// Get newspaper details (public access)
userRouter.get('/newspaper/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const newspaper = db.prepare("SELECT * FROM newspapers WHERE id = ? AND status = 'published'").get(id);
    if (!newspaper) return res.status(404).json({ error: 'Newspaper not found' });

    const articles = db.prepare('SELECT * FROM articles WHERE newspaper_id = ?').all(id);
    res.json({ newspaper, articles });
  } catch {
    res.status(500).json({ error: 'Failed to fetch newspaper details' });
  }
});
