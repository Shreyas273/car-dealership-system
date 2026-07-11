import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-emerald-400">404</h1>
      <p className="mt-4 text-xl text-white">Page not found</p>
      <p className="mt-2 text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-emerald-400"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};
