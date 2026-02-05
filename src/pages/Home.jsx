import { Link } from "react-router";
import { useAuth } from "../provider/AuthProvider";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-24 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-violet-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
              Community-Powered Support
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-6 animate-slide-up">
              Helping each other,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                minute by minute.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              A revolutionary platform where time is the currency. Help your neighbors, earn credits, and get support when you need it most — no money required.
            </p>

            {!user && (
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-[0.98] transition-all flex items-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10 text-base uppercase tracking-wider">Start Helping</span>
                  <span className="relative z-10 text-lg group-hover:translate-x-1 transition-transform">🚀</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-base uppercase tracking-wider shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Trust / Stats Bar */}
        <div className="container mx-auto px-6 mt-12 md:mt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-8 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">1.2k+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Community Members</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">4.8k</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hours Exchanged</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">24/7</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Emergency Help</div>
            </div>
            <div className="text-center group border-l-0 lg:border-l border-slate-100">
              <div className="text-2xl md:text-3xl font-black text-indigo-600">Free</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Always for Neighbors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: The "How it Works" */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-md">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">
                Simple steps to <br /><span className="text-indigo-600">build trust.</span>
              </h2>
              <p className="text-base text-slate-500 font-medium">We've designed a system that's easy to use, secure, and focused on neighborly connection.</p>
            </div>
            <div className="flex items-center gap-4 text-slate-300 font-black text-5xl opacity-10 select-none">
              01 - 03
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Earn Time Credits",
                desc: "Help a neighbor for 1 hour and receive 1 Time Credit. Your effort is directly rewarded with currency you can spend later.",
                icon: "✨",
                theme: "bg-indigo-50 text-indigo-600"
              },
              {
                step: "02",
                title: "Request Assistance",
                desc: "Need a hand? Post a request. New members get starter credits so you can get help immediately while you find your feet.",
                icon: "🙏",
                theme: "bg-violet-50 text-violet-600"
              },
              {
                step: "03",
                title: "Trusted Network",
                desc: "Verified profiles and NGO partners ensure every exchange is safe. We prioritize emergency requests to keep everyone secure.",
                icon: "🛡️",
                theme: "bg-blue-50 text-blue-600"
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                <div className={`w-14 h-14 ${item.theme} rounded-2xl flex items-center justify-center text-2xl font-black mb-8 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Step {item.step}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-4">Popular categories.</h2>
            <p className="text-base text-slate-500 font-medium">Discover how your unique skills can help someone today.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📚", title: "Educational Help", color: "indigo" },
              { icon: "🏥", title: "Medical Support", color: "rose" },
              { icon: "💻", title: "Technical Help", color: "violet" },
              { icon: "🏃", title: "Physical Tasks", color: "emerald" },
              { icon: "🌪️", title: "Disaster Relief", color: "orange" },
              { icon: "⚡", title: "General Services", color: "amber" },
            ].map((cat, idx) => (
              <div key={idx} className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-${cat.color}-50 flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{cat.title}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Explore Needs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 md:p-20 text-center text-white overflow-hidden shadow-2xl shadow-indigo-500/20">
          {/* Abstract bg decorations */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="90" cy="10" r="30" fill="white" />
              <circle cx="10" cy="90" r="40" fill="white" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">Ready to join your community?</h2>
            <p className="text-base md:text-lg text-indigo-100 font-medium mb-10 opacity-80">
              Be the help someone needs today. Get the help you need tomorrow. Start your journey for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-white text-indigo-700 font-black rounded-2xl shadow-xl hover:bg-indigo-50 transform hover:scale-105 transition-all text-base uppercase tracking-wider">
                Create Free Account
              </Link>
              <Link to="/about" className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-base uppercase tracking-wider">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
