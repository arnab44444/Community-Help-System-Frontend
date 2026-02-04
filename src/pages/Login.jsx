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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/20 to-secondary/20 py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border-2 border-primary/20 animate-slide-up relative z-10">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-float">🔐</div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-base-content/70">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control w-full mt-8">
              <button
                type="submit"
                className={`btn btn-primary btn-lg w-full rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Logging in..." : (
                  <>
                    <span className="text-xl mr-2">🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="divider my-6">OR</div>
          
          <div className="text-center">
            <p className="text-sm text-base-content/70 mb-2">
              Don't have an account?
            </p>
            <Link 
              to="/register" 
              className="btn btn-outline btn-primary btn-sm rounded-full hover:scale-105 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
