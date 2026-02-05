import { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import { helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const MyActivity = () => {
    const { user, loadUser } = useAuth();
    const [helpProvided, setHelpProvided] = useState([]);
    const [helpReceived, setHelpReceived] = useState([]);
    const [fullProvided, setFullProvided] = useState([]);
    const [fullReceived, setFullReceived] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("provided");
    const [providedPagination, setProvidedPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [receivedPagination, setReceivedPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    useEffect(() => {
        if (user) {
            loadStatsOnly();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadActivity();
        }
    }, [user, providedPagination.page, receivedPagination.page]);

    const loadStatsOnly = async () => {
        try {
            // Fetch Provided totals for charts (no limit or high limit)
            const { requests: providedData } = await helpRequestAPI.getAll({
                myRole: "helper",
                limit: 1000,
                status: ""
            });
            setFullProvided(providedData);

            // Fetch Received totals for charts
            const { requests: receivedData } = await helpRequestAPI.getAll({
                myRole: "requester",
                limit: 1000,
                status: ""
            });
            setFullReceived(receivedData);
        } catch (error) {
            console.error("Stats load error:", error);
        }
    };

    const loadActivity = async () => {
        setLoading(true);
        try {
            await loadUser();

            // Fetch Provided (Helper perspective)
            const { requests: providedData, pagination: pPagin } = await helpRequestAPI.getAll({
                myRole: "helper",
                status: "",
                page: providedPagination.page,
                limit: 10
            });
            setHelpProvided(providedData);
            setProvidedPagination(pPagin);

            // Fetch Received (Requester perspective)
            const { requests: receivedData, pagination: rPagin } = await helpRequestAPI.getAll({
                myRole: "requester",
                status: "",
                page: receivedPagination.page,
                limit: 10
            });
            setHelpReceived(receivedData);
            setReceivedPagination(rPagin);

        } catch (error) {
            console.error("Load activity error:", error);
            toast.error("Failed to load activity");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (requestId) => {
        try {
            await helpRequestAPI.complete(requestId);
            toast.success("Help confirmed! Credits have been transferred.");
            loadActivity();
        } catch (error) {
            toast.error(error.message || "Failed to confirm help");
        }
    };

    const refreshData = () => {
        loadActivity();
        toast.info("Activity refreshed");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Pending";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getCategoryIcon = (category) => {
        const icons = {
            educational: "📚",
            medical: "🏥",
            technical: "💻",
            physical: "🏃",
            disaster: "🌪️",
            other: "⚡",
        };
        return icons[category] || "⚡";
    };

    // Calculate credits based on role:
    // Provided (Helper): Earns 'timeRequired' (value of work), even for emergencies
    // Received (Requester): Pays 'creditsCost' (0 for emergencies, full cost for normal)
    const calculateTotalCredits = (requests, type) => {
        return requests.reduce((sum, req) => {
            const amount = type === "provided"
                ? (req.timeRequired || 0)  // Helper earns time value
                : (req.creditsCost || 0);  // Requester pays cost
            return sum + amount;
        }, 0);
    };

    const calculateTotalHours = (requests) => {
        return requests.reduce((sum, req) => sum + (req.timeRequired || 0), 0);
    };

    const renderHelpCard = (request, type) => {
        const otherUser = type === "provided" ? request.requester : request.helper;

        // Determine credit display
        const creditAmount = type === "provided" ? request.timeRequired : request.creditsCost;
        const isCompleted = request.status === "completed";

        return (
            <div
                key={request._id}
                className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border ${isCompleted ? 'border-base-300' : 'border-primary'}`}
            >
                <div className="card-body p-6">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">{getCategoryIcon(request.category)}</div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg mb-2">{request.title}</h3>
                                <span className={`badge ${isCompleted ? 'badge-success' : 'badge-info animate-pulse'}`}>
                                    {isCompleted ? 'Completed' : 'In Progress'}
                                </span>
                            </div>
                            <p className="text-sm text-base-content/70 mb-3">
                                {request.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="badge badge-outline badge-sm">
                                    {request.category}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                    ⏰ {request.timeRequired} hours
                                </span>
                                <span className={`badge badge-sm ${type === "provided" ? "badge-success" : "badge-warning"}`}>
                                    {type === "provided" ? "+" : "-"}{creditAmount} credits
                                </span>
                                {request.isEmergency && (
                                    <span className="badge badge-error badge-sm">🆘 Emergency</span>
                                )}
                            </div>

                            <div className="space-y-1 text-sm bg-base-200/50 p-3 rounded-lg border border-base-200">
                                <p>
                                    <span className="font-semibold">
                                        {type === "provided" ? "Helped:" : "Helped by:"}
                                    </span>{" "}
                                    {otherUser?.name || "Unknown"}
                                </p>
                                {otherUser && (
                                    <>
                                        <p>
                                            <span className="font-semibold">📧 Email:</span> {otherUser.email}
                                        </p>
                                        <p>
                                            <span className="font-semibold">📱 Phone:</span> {otherUser.phone}
                                        </p>
                                    </>
                                )}
                                <div className="divider my-1"></div>
                                <p>
                                    <span className="font-semibold">📍 Location:</span>{" "}
                                    {request.location?.district}, {request.location?.thana}
                                </p>
                                <p>
                                    <span className="font-semibold">📅 Completed:</span>{" "}
                                    {formatDate(request.completedAt)}
                                </p>
                            </div>

                            {/* CORE RULE implementation: Only seeker can confirm help received */}
                            {!isCompleted && type === "received" && (request.status === "assigned" || request.status === "in_progress") && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleComplete(request._id)}
                                        className="btn btn-success btn-sm w-full gap-2"
                                    >
                                        ✅ Confirm Help Received
                                    </button>
                                    <p className="text-[10px] text-center mt-2 opacity-50 italic">
                                        Clicking this will transfer {request.creditsCost} credits to {otherUser?.name}
                                    </p>
                                </div>
                            )}

                            {request.rating?.score && (
                                <div className="mt-3 p-3 bg-base-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm">Rating:</span>
                                        <div className="rating rating-sm">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <input
                                                    key={star}
                                                    type="radio"
                                                    className="mask mask-star-2 bg-orange-400"
                                                    checked={star === request.rating.score}
                                                    readOnly
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold">
                                            {request.rating.score}/5
                                        </span>
                                    </div>
                                    {request.rating.comment && (
                                        <p className="text-xs text-base-content/70 italic">
                                            "{request.rating.comment}"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && !helpProvided.length && !helpReceived.length) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const activeRequests = activeTab === "provided" ? helpProvided : helpReceived;
    const fullActiveRequests = activeTab === "provided" ? fullProvided : fullReceived;
    const totalCredits = calculateTotalCredits(fullActiveRequests, activeTab);
    const totalHours = calculateTotalHours(fullActiveRequests);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Activity</h1>
                    <p className="text-lg text-base-content/70">
                        Track all the help you've provided and received
                    </p>
                </div>
                <button onClick={refreshData} className="btn btn-outline btn-sm gap-2">
                    🔄 Refresh
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl border-2 border-green-200">
                    <div className="card-body">
                        <div className="flex items-center gap-4">
                            <div className="text-6xl">🤝</div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-green-700">
                                    Help Provided
                                </h3>
                                <div className="flex gap-4 mt-2">
                                    <div>
                                        <p className="text-3xl font-bold text-green-600">
                                            {providedPagination.total}
                                        </p>
                                        <p className="text-xs text-green-600/70">People helped</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-green-600">
                                            {calculateTotalHours(fullProvided)}
                                        </p>
                                        <p className="text-xs text-green-600/70">Total hours</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-green-600">
                                            +{calculateTotalCredits(fullProvided, "provided")}
                                        </p>
                                        <p className="text-xs text-green-600/70">Credits earned</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl border-2 border-blue-200">
                    <div className="card-body">
                        <div className="flex items-center gap-4">
                            <div className="text-6xl">🙏</div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-blue-700">
                                    Help Received
                                </h3>
                                <div className="flex gap-4 mt-2">
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {receivedPagination.total}
                                        </p>
                                        <p className="text-xs text-blue-600/70">People helped me</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {calculateTotalHours(fullReceived)}
                                        </p>
                                        <p className="text-xs text-blue-600/70">Total hours</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600">
                                            -{calculateTotalCredits(fullReceived, "received")}
                                        </p>
                                        <p className="text-xs text-blue-600/70">Credits spent</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Visual Analytics */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Category Pie Chart */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body p-6">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="text-2xl text-primary">📂</span>
                            Category Breakdown
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.values(fullActiveRequests.reduce((acc, req) => {
                                            acc[req.category] = (acc[req.category] || 0) + 1;
                                            return acc;
                                        }, {})).map((val, idx) => ({
                                            name: Object.keys(fullActiveRequests.reduce((acc, req) => {
                                                acc[req.category] = (acc[req.category] || 0) + 1;
                                                return acc;
                                            }, {}))[idx],
                                            value: val
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((col, i) => (
                                            <Cell key={i} fill={col} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Monthly Time Bar Chart */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body p-6">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <span className="text-2xl text-secondary">⏳</span>
                            Hours Invested Trend
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { month: 'Last Month', hours: Math.floor(totalHours * 0.3) },
                                    { month: 'This Month', hours: totalHours }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="hours" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                    className={`btn flex-1 transition-all duration-300 ${activeTab === "provided"
                        ? "btn-success text-gray-600 shadow-lg scale-[1.02]"
                        : "btn-outline btn-success hover:text-gray hover:text-gray-600"
                        }`}
                    onClick={() => setActiveTab("provided")}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🤝</span>
                        <div className="text-left">
                            <div className="font-bold">Help Provided</div>
                            <div className="text-xs opacity-70">Requests I accepted</div>
                        </div>
                        <div className="ml-auto badge badge-white text-success font-bold">
                            {helpProvided.length}
                        </div>
                    </div>
                </button>

                <button
                    className={`btn flex-1 transition-all duration-300 ${activeTab === "received"
                        ? "btn-info text-white shadow-lg scale-[1.02]"
                        : "btn-outline btn-info hover:btn-info hover:text-white"
                        }`}
                    onClick={() => setActiveTab("received")}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🙏</span>
                        <div className="text-left">
                            <div className="font-bold">Help Received</div>
                            <div className="text-xs opacity-70">My requests</div>
                        </div>
                        <div className="ml-auto badge badge-white text-info font-bold">
                            {helpReceived.length}
                        </div>
                    </div>
                </button>
            </div>

            {/* Activity List */}
            {activeRequests.length === 0 ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center py-20">
                        <div className="text-6xl mb-4">
                            {activeTab === "provided" ? "🤝" : "🙏"}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                            {activeTab === "provided"
                                ? "No Help Provided Yet"
                                : "No Help Received Yet"}
                        </h2>
                        <p className="text-base-content/70">
                            {activeTab === "provided"
                                ? "Start helping others to build your community impact"
                                : "Create a help request to get assistance from the community"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeRequests.map((request) =>
                        renderHelpCard(request, activeTab)
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {activeTab === "provided" && providedPagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        className="btn btn-primary btn-outline btn-sm"
                        disabled={providedPagination.page <= 1}
                        onClick={() => setProvidedPagination({ ...providedPagination, page: providedPagination.page - 1 })}
                    >
                        Previous
                    </button>
                    <div className="flex items-center px-4 font-bold text-sm">
                        Page {providedPagination.page} of {providedPagination.totalPages}
                    </div>
                    <button
                        className="btn btn-primary btn-outline btn-sm"
                        disabled={providedPagination.page >= providedPagination.totalPages}
                        onClick={() => setProvidedPagination({ ...providedPagination, page: providedPagination.page + 1 })}
                    >
                        Next
                    </button>
                </div>
            )}

            {activeTab === "received" && receivedPagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        className="btn btn-primary btn-outline btn-sm"
                        disabled={receivedPagination.page <= 1}
                        onClick={() => setReceivedPagination({ ...receivedPagination, page: receivedPagination.page - 1 })}
                    >
                        Previous
                    </button>
                    <div className="flex items-center px-4 font-bold text-sm">
                        Page {receivedPagination.page} of {receivedPagination.totalPages}
                    </div>
                    <button
                        className="btn btn-primary btn-outline btn-sm"
                        disabled={receivedPagination.page >= receivedPagination.totalPages}
                        onClick={() => setReceivedPagination({ ...receivedPagination, page: receivedPagination.page + 1 })}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Summary Footer */}
            {fullActiveRequests.length > 0 && (
                <div className="mt-8 card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h3 className="font-bold text-lg">
                                    {activeTab === "provided" ? "Total Help Provided" : "Total Help Received"}
                                </h3>
                                <p className="text-sm text-base-content/70">
                                    Summary of all completed {activeTab === "provided" ? "help sessions" : "requests"}
                                </p>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">
                                        {fullActiveRequests.length}
                                    </p>
                                    <p className="text-xs text-base-content/70">Sessions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-secondary">
                                        {totalHours}
                                    </p>
                                    <p className="text-xs text-base-content/70">Hours</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-3xl font-bold ${activeTab === "provided" ? "text-success" : "text-warning"}`}>
                                        {activeTab === "provided" ? "+" : "-"}
                                        {totalCredits}
                                    </p>
                                    <p className="text-xs text-base-content/70">Credits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyActivity;
