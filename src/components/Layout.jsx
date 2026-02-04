import { Outlet, Link, useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="navbar bg-gradient-to-r from-primary via-purple-600 to-secondary text-primary-content shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl md:text-2xl font-bold hover:bg-white/20 transition-all duration-300">
              <span className="text-3xl mr-2">🤝</span>
              <span className="hidden sm:inline">Community Help Exchange</span>
              <span className="sm:hidden">CHE Platform</span>
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 gap-1">
              <li>
                <Link to="/" className="hover:bg-white/20 rounded-lg transition-all">
                  Home
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard" className="hover:bg-white/20 rounded-lg transition-all">
                      Dashboard
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link to="/admin-dashboard" className="hover:bg-white/20 rounded-lg transition-all bg-error/20 border border-error/50">
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  {user.role === "ngo" && user.ngoDetails?.isVerified && (
                    <li>
                      <Link to="/emergencies" className="hover:bg-white/20 rounded-lg transition-all bg-error text-white animate-pulse font-bold">
                        🚨 Emergencies
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/help-requests" className="hover:bg-white/20 rounded-lg transition-all">
                      Help Requests
                    </Link>
                  </li>
                  {/* Credits Display - Hide for Admin */}
                  {user.role !== "admin" && (
                    <li>
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                        <span className="text-xl">⏱️</span>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-75">Credits</span>
                          <span className="font-bold">{user?.timeCredits ?? 0}</span>
                        </div>
                      </div>
                    </li>
                  )}
                  {/* Request Help - Hide for Admin */}
                  {user.role !== "admin" && (
                    <li>
                      <Link to="/create-request" className="btn btn-sm btn-accent rounded-full">
                        Request Help
                      </Link>
                    </li>
                  )}
                  {/* Hide My Activity for Admins */}
                  {user.role !== "admin" && (
                    <li>
                      <Link to="/my-activity" className="hover:bg-white/20 rounded-lg transition-all">
                        My Activity
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/transactions" className="hover:bg-white/20 rounded-lg transition-all">
                      Credits & Transactions
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:bg-white/20 rounded-lg transition-all">
                      Profile
                    </Link>
                  </li>
                  <li>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-ghost hover:bg-white/20 rounded-lg"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:bg-white/20 rounded-lg transition-all">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn btn-sm btn-accent rounded-full">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <main className="min-h-screen">
        <Outlet />
      </main>
      <footer className="footer footer-center p-10 bg-gradient-to-r from-base-300 to-base-200 text-base-content mt-20 border-t-2 border-primary/20">
        <div>
          <p className="font-bold text-xl mb-2">
            <span className="text-2xl mr-2">🤝</span>
            Community Help Exchange Platform
          </p>
          <p className="text-base-content/80">A charity platform: time is the currency. No money — give and receive help in your community.</p>
          <p className="text-sm text-base-content/60 mt-2">© 2026 Community Help Exchange. For community support only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
