import { ArrowLeft, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-sm border border-zinc-100">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center">
            <Newspaper size={26} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">Read-Only Archive</h1>
          <p className="text-zinc-500 leading-7">
            This deployment is a frontend-only newspaper viewer. Admin login, uploads, mapping, and publishing
            require the full-stack version and are intentionally disabled here.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm text-zinc-600 leading-7">
          <p>
            Published editions are exported from the local SQLite archive into static JSON and static files at build
            time.
          </p>
          <p className="mt-3">
            To update the live site, change the local archive contents and redeploy the frontend build.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to archive
          </Link>
        </div>
      </div>
    </div>
  );
}
