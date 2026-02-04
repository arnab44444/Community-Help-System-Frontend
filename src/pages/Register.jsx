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

        // Validate NGO fields if role is NGO
        if (formData.role === "ngo") {
            if (!formData.ngoDetails.organizationName || !formData.ngoDetails.registrationNumber) {
                toast.error("Please fill in all NGO details!");
                return;
            }
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;

            // Only include ngoDetails if role is NGO
            if (registerData.role !== "ngo") {
                delete registerData.ngoDetails;
            }

            await register(registerData);
            navigate("/dashboard", { replace: true });
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

            <div className="card w-full max-w-2xl shadow-2xl bg-base-100 border-2 border-primary/20 animate-slide-up relative z-10">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4 animate-float">🤝</div>
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            Join Our Community
                        </h2>
                        <p className="text-base-content/70">Create your account to start helping and receiving help</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+880 1234567890"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label pb-2">
                                <span className="label-text text-sm font-semibold text-base-content">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Account Type Selection */}
                        <div className="form-control w-full">
                            <label className="label pb-2">
                                <span className="label-text text-sm font-semibold text-base-content">Account Type</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="cursor-pointer">
                                    <div className={formData.role === "user" ? "p-4 border-2 border-primary bg-primary/5 rounded-lg" : "p-4 border-2 border-base-300 rounded-lg hover:border-primary/50"}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="user"
                                                className="radio radio-primary"
                                                checked={formData.role === "user"}
                                                onChange={handleChange}
                                            />
                                            <div className="flex-1">
                                                <div className="font-semibold text-base">👤 Regular User</div>
                                                <div className="text-xs text-base-content/70 mt-1">Individual seeking or providing help</div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <div className={formData.role === "ngo" ? "p-4 border-2 border-primary bg-primary/5 rounded-lg" : "p-4 border-2 border-base-300 rounded-lg hover:border-primary/50"}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="role"
                                                value="ngo"
                                                className="radio radio-primary"
                                                checked={formData.role === "ngo"}
                                                onChange={handleChange}
                                            />
                                            <div className="flex-1">
                                                <div className="font-semibold text-base">🏢 NGO/Organization</div>
                                                <div className="text-xs text-base-content/70 mt-1">Registered organization</div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* NGO Details - Only show if role is NGO */}
                        {formData.role === "ngo" && (
                            <>
                                <div className="divider my-6">NGO Information</div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-control w-full">
                                        <label className="label pb-2">
                                            <span className="label-text text-sm font-semibold text-base-content">Organization Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ngoDetails.organizationName"
                                            placeholder="e.g., Red Crescent Society"
                                            className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                            value={formData.ngoDetails.organizationName}
                                            onChange={handleChange}
                                            required={formData.role === "ngo"}
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label pb-2">
                                            <span className="label-text text-sm font-semibold text-base-content">Registration Number</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ngoDetails.registrationNumber"
                                            placeholder="e.g., NGO-12345"
                                            className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                            value={formData.ngoDetails.registrationNumber}
                                            onChange={handleChange}
                                            required={formData.role === "ngo"}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Password */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Min 6 characters"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="divider my-6">Location Information</div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">District</span>
                                </label>
                                <input
                                    type="text"
                                    name="location.district"
                                    placeholder="e.g., Dhaka"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.location.district}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">Thana/Upazila</span>
                                </label>
                                <input
                                    type="text"
                                    name="location.thana"
                                    placeholder="e.g., Mirpur"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.location.thana}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label pb-2">
                                    <span className="label-text text-sm font-semibold text-base-content">Ward/Area</span>
                                </label>
                                <input
                                    type="text"
                                    name="location.ward"
                                    placeholder="e.g., Ward 10"
                                    className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={formData.location.ward}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control w-full mt-8">
                            <button
                                type="submit"
                                className={`btn btn-primary btn-lg w-full rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : (
                                    <>
                                        <span className="text-xl mr-2">🚀</span>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="divider my-6">OR</div>

                    <div className="text-center">
                        <p className="text-sm text-base-content/70 mb-2">
                            Already have an account?
                        </p>
                        <Link
                            to="/login"
                            className="btn btn-outline btn-primary btn-sm rounded-full hover:scale-105 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
