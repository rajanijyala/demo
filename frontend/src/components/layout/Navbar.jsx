import { Link, NavLink } from 'react-router-dom';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import useAuthStore from '../../stores/authStore';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Interviews', to: '/interviews' },
  { label: 'Resume', to: '/resume' },
  { label: 'Analytics', to: '/analytics' },
];

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-wide">AI Interview Mocker</span>
        </Link>

        {isAuthenticated && (
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((item) => (
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
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <div className="flex items-center gap-2">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 text-xs font-bold text-sky-300">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </Link>
              <Button variant="ghost" onClick={logout} className="hidden md:inline-flex">
                Logout
              </Button>
              <button className="md:hidden text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
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

      {mobileOpen && isAuthenticated && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-sky-300' : 'text-slate-300'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="text-left text-sm font-medium text-slate-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
