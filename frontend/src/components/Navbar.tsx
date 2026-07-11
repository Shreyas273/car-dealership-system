import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-700/60 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-900">
            CD
          </div>
          <span className="text-lg font-semibold text-white">CarDealership</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-300 transition hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className="text-slate-300 transition hover:text-white"
              >
                Search
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-slate-300 transition hover:text-white"
                >
                  Admin
                </Link>
              )}
              <span className="hidden text-slate-400 sm:inline">
                {user?.name}
                {isAdmin && (
                  <span className="ml-2 rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                    Admin
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-500 px-3 py-1.5 font-medium text-slate-900 transition hover:bg-emerald-400"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
