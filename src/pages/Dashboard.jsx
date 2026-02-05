import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import { helpRequestAPI } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, loadUser } = useAuth();
  const [stats, setStats] = useState({
    myRequests: 0,
    myHelps: 0,
    availableRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  useEffect(() => {
    if (user && !authLoading) {
      // Redirect Admin to Admin Dashboard
      if (user.role === "admin") {
        navigate("/admin-dashboard");
        return;
      }

      // Check if unverified NGO
      if (user.role === "ngo" && !user.ngoDetails?.isVerified) {
        setLoading(false);
        return;
      }

      loadStats();
      if (user.role === "ngo" && user.ngoDetails?.isVerified) {
        loadEmergencyAlerts();
      }
    }
  }, [user, authLoading]);

  const refreshData = () => {
    // Check if unverified NGO
    if (user.role === "ngo" && !user.ngoDetails?.isVerified) {
      toast.info("Account is pending approval");
      return;
    }

    setLoading(true);
    const promises = [loadStats()];
    if (user.role === "ngo" && user.ngoDetails?.isVerified) {
      promises.push(loadEmergencyAlerts());
    }
    Promise.all(promises)
      .then(() => loadUser()) // Refresh user credits too
      .finally(() => setLoading(false));
  };

  const loadEmergencyAlerts = async () => {
    try {
      const alerts = await helpRequestAPI.getNgoEmergencies();
      setEmergencyAlerts(alerts);
    } catch (error) {
      console.error("Failed to load emergency alerts:", error);
    }
  };

  const loadStats = async () => {
    try {
      const requests = await helpRequestAPI.getAll();
      setStats({
        myRequests: requests.filter((r) => r.requester?._id === user?.id || r.requester === user?.id).length,
        myHelps: requests.filter((r) => r.helper?._id === user?.id || r.helper === user?.id).length,
        availableRequests: requests.filter((r) => r.status === "pending").length,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }

  // Pending Approval State for NGOs
  if (user.role === "ngo" && !user.ngoDetails?.isVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10 animate-slide-up flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-float">👋</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome, {user?.name}!
              </h1>
              <p className="text-xl text-base-content/70">
                {user.ngoDetails?.organizationName}
              </p>
            </div>
          </div>
          <button onClick={loadUser} className="btn btn-outline btn-sm">
            Check Status
          </button>
        </div>

        <div className="card bg-base-100 shadow-xl border-l-8 border-warning animate-slide-up">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="text-5xl">⏳</div>
              <div>
                <h2 className="card-title text-2xl mb-2">Account Pending Approval</h2>
                <p className="text-lg opacity-80 mb-4">
                  Thank you for registering your organization. Your account is currently under review by our administrators.
                </p>
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>You cannot browse requests, offer help, or create requests until your organization is verified.</span>
                </div>
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Registration Details Submitted:</h3>
                  <ul className="list-disc list-inside opacity-70">
                    <li>Registration Number: {user.ngoDetails?.registrationNumber}</li>
                    <li>Email: {user.email}</li>
                    <li>Phone: {user.phone}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 animate-slide-up flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-6xl animate-float">👋</div>
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xl text-base-content/70">
              Manage your help requests and find opportunities to help others
            </p>
          </div>
        </div>
        <button type="button" onClick={refreshData} className="btn btn-outline btn-sm">
          🔄 Refresh
        </button>
      </div>

      {/* NGO Emergency Alerts Section */}
      {user.role === "ngo" && emergencyAlerts.length > 0 && (
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl animate-pulse">🚨</span>
              <h2 className="text-2xl font-bold text-error">Priority Emergency Alerts</h2>
              <span className="badge badge-error text-white animate-pulse">{emergencyAlerts.length} New</span>
            </div>
            <Link to="/emergencies" className="btn btn-error btn-outline btn-sm">
              View All Emergencies
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyAlerts.slice(0, 3).map((alert) => (
              <div key={alert._id} className="card bg-base-100 border-2 border-error shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <h3 className="card-title text-error">
                    {alert.title}
                    <div className="badge badge-error badge-sm text-white">URGENT</div>
                  </h3>
                  <p className="text-base-content/70 line-clamp-2">{alert.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs font-semibold">
                      📍 {alert.location?.district}
                    </div>
                    <Link to="/emergencies" className="btn btn-sm btn-error text-white">
                      Respond
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          {
            icon: "⏰",
            title: "Time Credits",
            value: user?.timeCredits || 0,
            desc: "Available credits",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
            textColor: "text-blue-600"
          },
          {
            icon: "📋",
            title: "My Requests",
            value: stats.myRequests,
            desc: "Help requests created",
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
            textColor: "text-green-600"
          },
          {
            icon: "🤝",
            title: "Helped Others",
            value: stats.myHelps,
            desc: "Times you helped",
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
            textColor: "text-orange-600"
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`stat ${stat.bgColor} shadow-2xl rounded-2xl border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-up`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`stat-figure ${stat.textColor} text-6xl animate-float`} style={{ animationDelay: `${idx * 0.2}s` }}>
              {stat.icon}
            </div>
            <div className="stat-title font-semibold text-base-content/70">{stat.title}</div>
            <div className={`stat-value ${stat.textColor} text-4xl font-extrabold`}>{stat.value}</div>
            <div className="stat-desc text-sm">{stat.desc}</div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl`}></div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        {/* Activity Distribution Chart */}
        <div className="card bg-base-100 shadow-2xl border border-base-200">
          <div className="card-body p-6">
            <h2 className="card-title text-xl mb-4 font-black flex items-center gap-2">
              <span className="text-primary text-2xl">📊</span>
              Community Participation
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Requests', count: stats.myRequests, color: '#3b82f6' },
                    { name: 'Helps', count: stats.myHelps, color: '#10b981' },
                    { name: 'Total Pub', count: stats.availableRequests, color: '#f59e0b' }
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', shadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[10, 10, 0, 0]}
                    barSize={45}
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-base-content/50 mt-4 italic">Comparison of your personal requests vs helps provided to neighbors.</p>
          </div>
        </div>

        {/* Impact Breakdown (Pie Chart) */}
        <div className="card bg-base-100 shadow-2xl border border-base-200">
          <div className="card-body p-6">
            <h2 className="card-title text-xl mb-4 font-black flex items-center gap-2">
              <span className="text-secondary text-2xl">🥧</span>
              Help Impact Share
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Requests', value: stats.myRequests || 1 },
                      { name: 'Helps', value: stats.myHelps || 1 },
                      { name: 'Other', value: 2 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#a855f7" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-base-content/50 mt-4 italic">Visual breakdown of your engagement footprint in the platform.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="card bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-primary-content shadow-2xl border-0 hover:scale-105 transition-all duration-300 animate-slide-up">
          <div className="card-body p-8">
            <div className="text-6xl mb-4 animate-float">🆘</div>
            <h2 className="card-title text-3xl mb-4">Need Help?</h2>
            <p className="text-lg mb-6 opacity-90">Create a new help request and connect with helpers in your community</p>
            <div className="card-actions justify-end">
              <Link to="/create-request" className="btn btn-lg btn-accent rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all">
                <span className="text-xl mr-2">➕</span>
                Request Help
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-secondary via-emerald-500 to-teal-600 text-secondary-content shadow-2xl border-0 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-8">
            <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '0.2s' }}>🤝</div>
            <h2 className="card-title text-3xl mb-4">Help Others</h2>
            <p className="text-lg mb-6 opacity-90">Browse available help requests and earn time credits</p>
            <div className="card-actions justify-end">
              <Link to="/help-requests" className="btn btn-lg btn-primary rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all">
                <span className="text-xl mr-2">🔍</span>
                Browse Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 via-pink-500 to-rose-600 text-primary-content shadow-2xl border-0 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body p-8">
            <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '0.3s' }}>📊</div>
            <h2 className="card-title text-3xl mb-4">My Activity</h2>
            <p className="text-lg mb-6 opacity-90">View detailed history of help provided and received</p>
            <div className="card-actions justify-end">
              <Link to="/my-activity" className="btn btn-lg btn-accent rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all">
                <span className="text-xl mr-2">📈</span>
                View Activity
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Score */}
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border-2 border-primary/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="card-body p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-4xl">⭐</span>
            <h2 className="card-title text-3xl">Trust Score</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="radial-progress text-primary text-6xl font-bold" style={{ "--value": user?.trustScore || 0, "--size": "12rem", "--thickness": "1rem" }} role="progressbar">
                {user?.trustScore || 0}%
              </div>
              <div className="absolute inset-0 radial-progress text-primary/20" style={{ "--value": 100, "--size": "12rem", "--thickness": "1rem" }}></div>
            </div>
            <div className="flex-1">
              <p className="text-lg mb-4 text-base-content/80">
                Your trust score is based on completed helps, ratings, and response time.
              </p>
              <div className="stats stats-vertical md:stats-horizontal shadow-lg">
                <div className="stat py-4">
                  <div className="stat-title text-xs">Completed Helps</div>
                  <div className="stat-value text-2xl text-primary">{user?.completedHelps || 0}</div>
                </div>
                <div className="stat py-4">
                  <div className="stat-title text-xs">Average Rating</div>
                  <div className="stat-value text-2xl text-secondary">{user?.averageRating?.toFixed(1) || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
