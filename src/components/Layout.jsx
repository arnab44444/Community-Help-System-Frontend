import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../provider/AuthProvider";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-100 selection:bg-primary selection:text-white">
      {!isAuthPage && (
        /* Floating Modern Navbar */
        <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 pointer-events-none">
          <div className="container mx-auto max-w-7xl pointer-events-auto">
            <div className="navbar bg-base-100/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl px-4 md:px-6">
              <div className="navbar-start">
                {/* Mobile Menu Dropdown */}
                <div className="dropdown">
                  <label tabIndex={0} className="btn btn-ghost lg:hidden ring-offset-2 ring-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                  </label>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-52 border border-base-200">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li><Link to="/motivation">Our Motivation</Link></li>
                    {user ? (
                      <>
                        <li><Link to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}>Dashboard</Link></li>
                        <li><button onClick={handleLogout} className="text-error font-semibold">Logout</button></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register" className="text-secondary font-bold">Register</Link></li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Logo / Brand */}
                <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all">
                    🤝
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-black tracking-tighter leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      COMMUNITY
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">Help Exchange</span>
                  </div>
                </Link>
              </div>

              <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2 items-center font-bold text-sm tracking-wide">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-primary/5">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about-us" className="hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-primary/5">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/motivation" className="hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-primary/5 whitespace-nowrap">
                      Motivation
                    </Link>
                  </li>

                  <div className="divider divider-horizontal mx-2 h-6 my-auto opacity-10"></div>

                  {user ? (
                    <div className="flex items-center gap-3">
                      <Link
                        to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                        className="btn btn-primary btn-sm rounded-xl px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border-none"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn btn-ghost btn-sm rounded-xl hover:bg-error/10 hover:text-error transition-all"
                      >
                        Logout
                      </button>
                      <div className="avatar placeholder online">
                        <div className="bg-primary/10 text-primary rounded-xl w-8 h-8 flex items-center justify-center border border-primary/20">
                          <span className="text-xs font-black uppercase">{user.name?.charAt(0)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link to="/login" className="btn btn-ghost btn-sm rounded-xl hover:bg-primary/5">
                        Login
                      </Link>
                      <Link to="/register" className="btn btn-secondary btn-sm rounded-xl px-5 text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/40 border-none transition-all">
                        Register
                      </Link>
                    </div>
                  )}
                </ul>
              </div>

              {/* Mobile End (Avatar or Shortcut) */}
              <div className="navbar-end lg:hidden flex gap-2">
                {user && (
                  <div className="avatar placeholder online">
                    <div className="bg-primary/10 text-primary rounded-xl w-10 h-10 flex items-center justify-center">
                      <span className="text-sm font-black">{user.name?.charAt(0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={`${isAuthPage ? 'pt-0' : 'pt-24'} min-h-screen`}>
        <Outlet />
      </main>

      {!isAuthPage && (
        <footer className="bg-base-200/50 border-t border-base-200 mt-20 pt-16 pb-8">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🤝</div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">COMMUNITY HELP</h2>
                </div>
                <p className="max-w-md text-base-content/60 leading-relaxed font-medium">
                  Empowering neighbors through time-based mutual aid. We believe every individual has value,
                  and every community grows stronger when we share our time and skills.
                </p>
                <div className="flex gap-4">
                  <button className="btn btn-circle btn-sm btn-ghost bg-base-200">f</button>
                  <button className="btn btn-circle btn-sm btn-ghost bg-base-200">🐦</button>
                  <button className="btn btn-circle btn-sm btn-ghost bg-base-200">📸</button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest opacity-80">Platform</h3>
                <ul className="space-y-2 font-medium text-base-content/60">
                  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link to="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="/motivation" className="hover:text-primary transition-colors">Our Motivation</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest opacity-80">Trust & Safety</h3>
                <ul className="space-y-2 font-medium text-base-content/60">
                  <li><Link className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link className="hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold opacity-40 uppercase tracking-widest text-center md:text-left">
              <p>© 2026 Community Help Exchange Platform.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
