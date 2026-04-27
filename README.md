# Raichuru Belaku Static Viewer

This project now builds as a frontend-only newspaper archive.

At build time it:

- exports published newspapers and article mappings from `data/database.sqlite`
- writes a static catalog to `public/data/newspapers.json`
- copies uploaded PDFs and mapped images from `data/uploads` to `public/uploads`

The deployed site no longer needs an Express server or runtime database access.

## Local development

1. Install dependencies with `npm install`
2. Run `npm run dev`

`predev` automatically rebuilds the static archive catalog before Vite starts.

## Updating the archive

1. Change the local content in `data/database.sqlite` and `data/uploads`
2. Run `npm run prepare:static` or `npm run build`
3. Redeploy the frontend

Only newspapers marked `published` are exported into the public archive.

## Deployment

This version is suitable for static hosting such as Vercel or Netlify.

- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` is included so React Router paths such as `/read/:id` resolve to `index.html`.

## Scope

The deployed app is intentionally read-only.

- Public archive browsing works
- PDF viewing works
- Mapped article image viewing and downloading works
- Admin login, upload, mapping, and publish flows are disabled in this frontend-only build
