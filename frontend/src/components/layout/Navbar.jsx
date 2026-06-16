import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, ShieldCheck } from 'lucide-react';
import { APP_NAME, NAV_LINKS } from '../../constants/app';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const visibleLinks = NAV_LINKS.filter((item) => !item.protected || isAuthenticated);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-wide">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {visibleLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-sky-300' : 'text-slate-300 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="secondary">Dashboard</Button>
              </Link>
              <Link to="/notifications" aria-label="Notifications">
                <Button variant="ghost"><Bell className="h-4 w-4" /></Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
