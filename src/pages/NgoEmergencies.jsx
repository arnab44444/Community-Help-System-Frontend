import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import { helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";

const NgoEmergencies = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === "ngo" && user?.ngoDetails?.isVerified) {
            loadEmergencies();
        } else if (user && user.role !== "ngo") {
            toast.error("Access denied. NGO only.");
            navigate("/dashboard");
        }
    }, [user]);

    const loadEmergencies = async () => {
        try {
            const data = await helpRequestAPI.getNgoEmergencies();
            setEmergencies(data);
        } catch (error) {
            console.error("Failed to load emergencies:", error);
            toast.error("Failed to load emergency requests");
        } finally {
            setLoading(false);
        }
    };

    const handleHelp = async (id) => {
        try {
            // Navigate to the request details page where they can offer help
            // Or we can implement direct offer here. The requirement says "ngo will help them".
            // Usually offering help requires some confirmation or message. 
            // For now, let's redirect to the detailed view which likely has the Offer button.
            navigate(`/help-requests`);
            // Ideally we would go to /help-requests/:id but we don't have a detail page route yet?
            // Wait, let's check router.
            // We have help-requests (list).
            // I'll implement a direct "Accept Emergency" button here for efficiency.

            await helpRequestAPI.offerHelp(id);
            toast.success("You have accepted this emergency request!");
            loadEmergencies(); // Reload
        } catch (error) {
            toast.error(error.message || "Failed to accept request");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-error"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-error flex items-center gap-3">
                        <span className="animate-pulse">🚨</span> Emergency Response
                    </h1>
                    <p className="text-lg text-base-content/70">
                        Priority requests requiring immediate NGO assistance
                    </p>
                </div>
                <button onClick={loadEmergencies} className="btn btn-outline btn-error btn-sm">
                    🔄 Refresh Feed
                </button>
            </div>

            {emergencies.length === 0 ? (
                <div className="card bg-base-100 shadow-xl border-2 border-base-200">
                    <div className="card-body text-center py-20">
                        <div className="text-6xl mb-4 text-success">✅</div>
                        <h2 className="text-2xl font-bold mb-2">No Active Emergencies</h2>
                        <p className="text-base-content/70">
                            There are currently no pending emergency requests in your area.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {emergencies.map((request) => (
                        <div key={request._id} className="card bg-base-100 shadow-xl border-2 border-error hover:shadow-2xl transition-all duration-300">
                            <div className="card-body relative overflow-hidden">
                                {/* Background pulse effect */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-error/10 rounded-bl-full -mr-10 -mt-10 animate-pulse"></div>

                                <h2 className="card-title text-error mb-2">
                                    {request.title}
                                    <div className="badge badge-error badge-sm text-white animate-pulse">URGENT</div>
                                </h2>

                                <p className="text-base-content/80 mb-4 line-clamp-3">
                                    {request.description}
                                </p>

                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>👤</span>
                                        <span className="font-semibold">{request.requester?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📍</span>
                                        <span>{request.location?.district}, {request.location?.thana}</span>
                                    </div>
                                    {request.location?.address && (
                                        <div className="flex items-start gap-2 text-xs opacity-70">
                                            <span>🏠</span>
                                            <span>{request.location.address}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span>⏰</span>
                                        <span>{new Date(request.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-auto">
                                    {/* Link to view on map or details if available */}
                                    <button
                                        onClick={() => handleHelp(request._id)}
                                        className="btn btn-error text-white w-full shadow-lg hover:brightness-110"
                                    >
                                        🚀 Respond Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NgoEmergencies;
