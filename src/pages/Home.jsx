import { Link } from "react-router";
import { useAuth } from "../provider/AuthProvider";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary via-purple-600 to-secondary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="hero-content text-center text-white relative z-10 animate-slide-up">
          <div className="max-w-5xl">
            <div className="mb-6 animate-float">
              <span className="text-8xl">🤝</span>
            </div>
            <h1 className="mb-6 text-6xl md:text-7xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Community Help Exchange
              </span>
              <br />
              <span className="text-white">Platform</span>
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              <span className="font-semibold">Time is the currency.</span> Help others, earn credits, get help when you need it.
              <br />
              <span className="text-lg">No money needed — a charity platform for community support.</span>
              <br />
              <span className="text-base opacity-90">New members receive starter credits so you can request help before earning.</span>
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/register" 
                  className="btn btn-lg btn-accent text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-accent/50 transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
                >
                  <span className="text-xl mr-2">🚀</span>
                  Get Started Free
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-lg btn-outline btn-white text-lg px-8 py-4 rounded-full border-2 hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24 bg-gradient-to-b from-base-200 to-base-100">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text">
            How It Works
          </h2>
          <p className="text-xl text-base-content/70">Simple, fast, and community-driven</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: "⏰", 
              title: "Earn Time Credits", 
              desc: "Give your time to help someone nearby. 1 hour of help = 1 time credit. Build trust and support your community.",
              color: "from-blue-500 to-cyan-500",
              delay: "0s"
            },
            { 
              icon: "🤝", 
              title: "Request Help", 
              desc: "New members get starter credits. Create a request with your location; helpers near you can offer. Credits are only used when help is completed.",
              color: "from-green-500 to-emerald-500",
              delay: "0.2s"
            },
            { 
              icon: "🚨", 
              title: "Emergency Support", 
              desc: "Mark urgent needs as emergency. They are prioritised and may be covered by NGO credit pools so no one is turned away in crisis.",
              color: "from-red-500 to-pink-500",
              delay: "0.4s"
            },
          ].map((feature, idx) => (
            <div 
              key={idx}
              className={`card bg-base-100 shadow-2xl border-2 border-transparent hover:border-primary/50 transition-all duration-500 animate-slide-up`}
              style={{ animationDelay: feature.delay }}
            >
              <div className="card-body items-center text-center p-8">
                <div className={`text-7xl mb-6 animate-float`} style={{ animationDelay: feature.delay }}>
                  {feature.icon}
                </div>
                <h3 className="card-title text-2xl mb-4 text-primary">{feature.title}</h3>
                <p className="text-base-content/80 leading-relaxed">{feature.desc}</p>
                <div className={`w-full h-1 mt-4 bg-gradient-to-r ${feature.color} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-24 bg-gradient-to-b from-base-100 to-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text">
            Help Categories
          </h2>
          <p className="text-xl text-base-content/70">Find or offer help in various areas</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "📚", title: "Educational Help", desc: "Tutoring, form filling, document assistance", color: "hover:bg-blue-50" },
            { icon: "🏥", title: "Medical Support", desc: "Medicine pickup, hospital escort, health guidance", color: "hover:bg-red-50" },
            { icon: "💻", title: "Technical Help", desc: "Mobile setup, internet, device configuration", color: "hover:bg-purple-50" },
            { icon: "🏃", title: "Physical Assistance", desc: "Errands, local tasks, physical help", color: "hover:bg-green-50" },
            { icon: "🌪️", title: "Disaster Support", desc: "Emergency relief, disaster response", color: "hover:bg-orange-50" },
            { icon: "⚡", title: "Other Services", desc: "Any other community help needed", color: "hover:bg-yellow-50" },
          ].map((cat, idx) => (
            <div 
              key={idx} 
              className={`card bg-base-100 shadow-xl border-2 border-base-200 hover:border-primary/50 transition-all duration-300 hover:scale-105 ${cat.color} group cursor-pointer`}
            >
              <div className="card-body p-6">
                <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="card-title text-xl mb-2 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-base-content/70">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
