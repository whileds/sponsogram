import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
        You don&apos;t have access to this page
      </h1>
      <p className="text-slate-500 mb-8 max-w-md">
        Your account role doesn&apos;t have permission to view this section. If you think this is a
        mistake, contact your Sponsogram program manager.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
      >
        Back to home
      </Link>
    </div>
  );
}
