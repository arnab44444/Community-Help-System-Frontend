import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { Link } from "react-router";

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open min-h-screen bg-base-200 font-sans">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Area */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Mobile Navigation Header */}
                <div className="lg:hidden sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-base-300 bg-base-100/80 px-4 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle drawer-button lg:hidden ring-offset-2 ring-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </label>
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="text-2xl transform group-hover:rotate-12 transition-transform">🤝</span>
                            <span className="font-black tracking-tighter text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">COMMUNITY</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/profile" className="btn btn-ghost btn-circle avatar placeholder border border-base-300">
                            <div className="w-8 rounded-full bg-primary/10 text-primary">
                                <span className="text-xs font-bold">👤</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Page Content */}
                <div className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar Drawer Side */}
            <div className="drawer-side z-[100]">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="h-full">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
