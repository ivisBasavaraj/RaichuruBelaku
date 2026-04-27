<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5f06db54-307a-4c01-a4bd-48666a519dc2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment Note

This app is not a frontend-only Vite site. Newspaper loading depends on:

- the Express API in [server.ts](server.ts)
- the SQLite database in `data/database.sqlite`
- uploaded PDFs and article images in `data/uploads`

If you deploy only the `dist` output, the UI will render but `/api/user/newspapers` will not work.

For deployment, use a Node host that can run `npm start` and provide persistent disk storage. A typical setup is:

1. Build command: `npm install && npm run build`
2. Start command: `npm start`
3. Set `JWT_SECRET`
4. Mount persistent storage and set `DATA_DIR` to that mounted path

This codebase is a better fit for services like Render, Railway, or any VPS/container host than a static-only Vercel deployment.
