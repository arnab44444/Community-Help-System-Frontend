import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import { toast } from "react-toastify";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "user", // "user" or "ngo"
        location: {
            ward: "",
            thana: "",
            district: "",
        },
        ngoDetails: {
            organizationName: "",
            registrationNumber: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const locationField = name.split(".")[1];
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    [locationField]: value,
                },
            });
        } else if (name.startsWith("ngoDetails.")) {
            const ngoField = name.split(".")[1];
            setFormData({
                ...formData,
                ngoDetails: {
                    ...formData.ngoDetails,
                    [ngoField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        if (formData.role === "ngo") {
            if (!formData.ngoDetails.organizationName || !formData.ngoDetails.registrationNumber) {
                toast.error("Please fill in all NGO details!");
                return;
            }
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            if (registerData.role !== "ngo") {
                delete registerData.ngoDetails;
            }
            await register(registerData);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            // Handled in provider
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-5xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[720px] animate-fade-in relative z-10 border border-slate-100">

                {/* Left Side: Branding & Experience */}
                <div className="md:w-[40%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 flex flex-col justify-between text-white relative">
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-12 group transition-all">
                            <div className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-indigo-700">🤝</div>
                            <span className="font-black text-xl tracking-tight">CommunityHelp</span>
                        </Link>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-black leading-[1.1] tracking-tighter">
                                Start your <span className="text-indigo-200">impact</span> journey.
                            </h1>
                            <p className="text-indigo-100/80 text-base leading-relaxed max-w-[280px]">
                                Join a circle of helpers and earn time credits by contributing to your neighborhood.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 text-center">Identity Selection</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'user' ? 'bg-white text-indigo-700 border-white shadow-xl' : 'border-white/10 hover:border-white/20 text-white'}`}
                            >
                                <span className="text-2xl">👤</span>
                                <span className="font-bold text-[10px] uppercase tracking-wider">Helper</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'ngo' })}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'ngo' ? 'bg-white text-indigo-700 border-white shadow-xl' : 'border-white/10 hover:border-white/20 text-white'}`}
                            >
                                <span className="text-2xl">🏢</span>
                                <span className="font-bold text-[10px] uppercase tracking-wider">NGO</span>
                            </button>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Right Side: Detailed Form */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 text-sm font-medium">Fill in the details to join the community.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Full Name</span></label>
                                <input type="text" name="name" placeholder="John Doe" className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-control">
                                <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Phone Number</span></label>
                                <input type="tel" name="phone" placeholder="01XXX-XXXXXX" className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border" value={formData.phone} onChange={handleChange} required />
                            </div>

                            <div className="form-control sm:col-span-2">
                                <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Email Address</span></label>
                                <input type="email" name="email" placeholder="you@example.com" className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border" value={formData.email} onChange={handleChange} required />
                            </div>

                            {formData.role === "ngo" && (
                                <div className="sm:col-span-2 grid grid-cols-2 gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 animate-slide-up">
                                    <div className="form-control">
                                        <label className="label pt-0"><span className="label-text text-indigo-600 font-bold text-[10px] uppercase tracking-wider">Org Name</span></label>
                                        <input type="text" name="ngoDetails.organizationName" className="bg-white border-indigo-200 text-slate-900 w-full rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all border" value={formData.ngoDetails.organizationName} onChange={handleChange} required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label pt-0"><span className="label-text text-indigo-600 font-bold text-[10px] uppercase tracking-wider">Reg Number</span></label>
                                        <input type="text" name="ngoDetails.registrationNumber" className="bg-white border-indigo-200 text-slate-900 w-full rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all border" value={formData.ngoDetails.registrationNumber} onChange={handleChange} required />
                                    </div>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Password</span></label>
                                <input type="password" name="password" className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border" value={formData.password} onChange={handleChange} required minLength={6} />
                            </div>
                            <div className="form-control">
                                <label className="label pt-0"><span className="label-text text-slate-400 font-bold text-[10px] uppercase tracking-wider">Confirm</span></label>
                                <input type="password" name="confirmPassword" className="bg-slate-50 border-slate-200 text-slate-900 w-full rounded-2xl py-3 px-4 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all border" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>

                            <div className="sm:col-span-2 pt-2">
                                <div className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                    <span className="h-px flex-1 bg-slate-100"></span>
                                    <span>Primary Location</span>
                                    <span className="h-px flex-1 bg-slate-100"></span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <input type="text" name="location.district" placeholder="District" className="bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl py-3 px-3 outline-none focus:ring-1 focus:ring-indigo-500 transition-all border" value={formData.location.district} onChange={handleChange} required />
                                    <input type="text" name="location.thana" placeholder="Thana" className="bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl py-3 px-3 outline-none focus:ring-1 focus:ring-indigo-500 transition-all border" value={formData.location.thana} onChange={handleChange} required />
                                    <input type="text" name="location.ward" placeholder="Ward" className="bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl py-3 px-3 outline-none focus:ring-1 focus:ring-indigo-500 transition-all border" value={formData.location.ward} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className={`w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading && <span className="loading loading-spinner loading-sm"></span>}
                                {loading ? "SETTING UP..." : "CREATE ACCOUNT"}
                            </button>

                            <p className="mt-6 text-center text-slate-500 text-sm font-medium">
                                Joined already? <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-500 transition-colors">Sign In here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
