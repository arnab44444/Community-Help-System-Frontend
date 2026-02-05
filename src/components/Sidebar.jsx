import { NavLink, useNavigate, Link } from "react-router";
import { useAuth } from "../provider/AuthProvider";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Define navigation links based on roles
    const getLinks = () => {
        if (!user) return [];

        if (user.role === 'admin') {
            return [
                { path: "/admin-dashboard", label: "Admin Dashboard", icon: "📊" },
                { path: "/profile", label: "My Profile", icon: "🛡️" },
               
                { path: "/help-requests", label: "Requests", icon: "📋" },
                
            ];
        }

        if (user.role === 'ngo') {
            return [
                { path: "/dashboard", label: "Dashboard", icon: "🏠" },
                { path: "/emergencies", label: "Emergencies", icon: "🚨" },
                { path: "/profile", label: "Organization Profile", icon: "🏢" },
                { path: "/transactions", label: "Credit History", icon: "📜" },
                { path: "/help-requests", label: "Requests", icon: "📋" },
                { path: "/my-activity", label: "My Activity", icon: "📋" },
            ];
        }

        // Regular User
        return [
            { path: "/dashboard", label: "Dashboard", icon: "🏠" },
            { path: "/help-requests", label: "Browse Requests", icon: "🔍" },
            { path: "/create-request", label: "Ask for Help", icon: "👋" },
            { path: "/my-activity", label: "My Activity", icon: "📋" },
            { path: "/transactions", label: "Wallet & History", icon: "💳" },
            { path: "/profile", label: "My Profile", icon: "👤" },
        ];
    };

    const links = getLinks();

    return (
        <aside className="w-64 bg-base-100 border-r border-base-300 flex flex-col h-screen sticky top-0 shadow-xl transition-all duration-300 z-50">
            {/* Header */}
            <div className="p-6 border-b border-base-300">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-xl">🤝</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Community Help</h1>
                        <p className="text-xs text-base-content/60 font-medium tracking-wide uppercase">
                            {user?.role === 'ngo' ? 'NGO Portal' : user?.role === 'admin' ? 'Admin Portal' : 'Member Portal'}
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${isActive
                                ? "bg-primary text-primary-content shadow-lg shadow-primary/30 translate-x-1"
                                : "hover:bg-base-200 text-base-content/70 hover:text-base-content hover:translate-x-1"
                            }`
                        }
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info & Footer */}
            <div className="p-4 border-t border-base-300 bg-base-200/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span>{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-error btn-sm w-full gap-2 hover:shadow-red-500/20"
                >
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
