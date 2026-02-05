import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../provider/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled in AuthProvider
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-5xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in relative z-10 border border-slate-100">

        {/* Left Side: Branding & Welcome */}
        <div className="md:w-[40%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 flex flex-col justify-between text-white relative">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12 group transition-all">
              <div className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-indigo-700">🤝</div>
              <span className="font-black text-xl tracking-tight">CommunityHelp</span>
            </Link>

            <div className="space-y-4">
              <h1 className="text-3xl font-black leading-[1.1] tracking-tighter">
                Welcome back,<br /> <span className="text-indigo-200">neighbor!</span>
              </h1>
              <p className="text-indigo-100/80 text-base leading-relaxed max-w-[280px]">
                Your community missed you. Sign in to continue your ripple of impact.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-sm font-medium text-indigo-50">"Helping one person might not change the world, but it could change the world for one person."</p>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">Sign In</h2>
            <p className="text-slate-500 text-sm font-medium">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Email Address</span></label>
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3.5 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <div className="flex justify-between items-center mb-1">
                <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Password</span></label>
                <Link to="#" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 uppercase tracking-wider">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3.5 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className={`w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {loading ? "AUTHENTICATING..." : "SIGN IN"}
              </button>

              <p className="mt-8 text-center text-slate-500 font-medium">
                New here? <Link to="/register" className="text-indigo-600 font-black hover:text-indigo-500 transition-colors">Create account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
