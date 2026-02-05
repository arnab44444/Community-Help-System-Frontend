import { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import { adminAPI, helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [ngos, setNgos] = useState([]);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState(null);
    const [activeTab, setActiveTab] = useState("ngos"); // 'ngos' or 'users'
    const [ngoPagination, setNgoPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [requestsTotal, setRequestsTotal] = useState(0);

    useEffect(() => {
        if (user?.role === "admin") {
            loadStats();
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === "admin") {
            if (activeTab === 'ngos') loadNgos();
            else loadUsers();
        }
    }, [activeTab, ngoPagination.page, userPagination.page, user]);

    const loadStats = async () => {
        try {
            const [emergenciesData, requestsData] = await Promise.all([
                adminAPI.getEmergencies(),
                helpRequestAPI.getAll({ limit: 1000 }) // Load enough for charts
            ]);
            setEmergencies(emergenciesData);
            setRequests(requestsData.requests);
            setRequestsTotal(requestsData.pagination.total);
        } catch (error) {
            console.error("Failed to load stats:", error);
        }
    };

    const loadNgos = async () => {
        try {
            const data = await adminAPI.getAllNgos({ page: ngoPagination.page });
            setNgos(data.ngos);
            setNgoPagination(data.pagination);
        } catch (error) {
            toast.error("Failed to load NGOs");
        }
    };

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getAllUsers({ page: userPagination.page });
            setUsers(data.users);
            setUserPagination(data.pagination);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([loadStats(), loadNgos(), loadUsers()]);
        setLoading(false);
    };

    // ... handlers ... (keep existing)
    const handleApproveClick = (id) => {
        setConfirmModal({
            id,
            action: 'approve',
            title: 'Approve NGO License',
            message: 'Are you sure you want to approve this NGO? They will gain access to offer help immediately.'
        });
    };

    const handleRemoveClick = (id) => {
        setConfirmModal({
            id,
            action: 'remove',
            title: 'Revoke License & Remove',
            message: 'Are you sure you want to remove this account? This action cannot be undone.'
        });
    };

    const confirmAction = async () => {
        if (!confirmModal) return;

        try {
            if (confirmModal.action === 'approve') {
                await adminAPI.approveNgo(confirmModal.id);
                toast.success("NGO approved successfully");
            } else if (confirmModal.action === 'remove') {
                await adminAPI.rejectNgo(confirmModal.id);
                toast.success("Account removed successfully");
            }
            loadData();
        } catch (error) {
            toast.error(`Failed to ${confirmModal.action} account`);
        } finally {
            setConfirmModal(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // ... access denied check ... (keep existing)
    if (user?.role !== "admin") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-error mb-4">Access Denied</h1>
                    <p className="text-xl">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-base-content/70">
                        Manage system users, licenses, and monitor emergencies
                    </p>
                </div>
                <button onClick={loadData} className="btn btn-outline btn-sm">
                    🔄 Refresh
                </button>
            </div>

            {/* Emergency Monitor Section */}
            {emergencies.length > 0 && (
                <div className="mb-10 animate-slide-up">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-3xl animate-pulse">🚨</span>
                        <h2 className="text-2xl font-bold text-error">Active Emergencies Monitor</h2>
                        <span className="badge badge-error text-white animate-pulse">{emergencies.length} Active</span>
                    </div>
                    {/* ... emergency grid (keep existing) ... */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {emergencies.map((alert) => (
                            <div key={alert._id} className="card bg-base-100 border-2 border-error/50 shadow-xl opacity-90 grayscale-[0.2]">
                                <div className="card-body">
                                    <h3 className="card-title text-error/80 text-lg">
                                        {alert.title}
                                    </h3>
                                    <p className="text-base-content/70 text-sm line-clamp-2">{alert.description}</p>
                                    <div className="mt-4 flex flex-col gap-1 text-xs opacity-70">
                                        <div className="font-semibold">User: {alert.requester?.name}</div>
                                        <div>📍 {alert.location?.district}</div>
                                        <div>📅 {new Date(alert.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="mt-2 text-xs text-center text-base-content/50 italic border-t pt-2">
                                        Monitor Only - Assign to NGO
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Admin visual Analytics */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {/* Platform Demographics */}
                <div className="card bg-base-100 shadow-2xl border border-base-200">
                    <div className="card-body p-6">
                        <h2 className="card-title text-xl mb-4 font-black flex items-center justify-between">
                            <span className="flex items-center gap-2 text-primary">
                                <span className="text-2xl">🌍</span> Platform Demographics
                            </span>
                        </h2>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Regular Users', value: userPagination.total || 0 },
                                            { name: 'NGO Entities', value: ngoPagination.total || 0 }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#6366f1" />
                                        <Cell fill="#10b981" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="text-center p-2 rounded-xl bg-primary/5">
                                <div className="text-2xl font-black text-primary">{userPagination.total}</div>
                                <div className="text-[10px] font-bold uppercase opacity-50">Total Users</div>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-success/5">
                                <div className="text-2xl font-black text-success">{ngoPagination.total}</div>
                                <div className="text-[10px] font-bold uppercase opacity-50">Total NGOs</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Health Monitor */}
                <div className="card bg-base-100 shadow-2xl border border-base-200">
                    <div className="card-body p-6">
                        <h2 className="card-title text-xl mb-4 font-black flex items-center gap-2">
                            <span className="text-secondary text-2xl">🩺</span>
                            Request Ecosystem Health
                        </h2>
                        <div className="h-[280px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: '#94a3b8' },
                                        { name: 'Assigned', count: requests.filter(r => r.status === 'assigned').length, color: '#f59e0b' },
                                        { name: 'Active', count: requests.filter(r => r.status === 'in_progress').length, color: '#3b82f6' },
                                        { name: 'Done', count: requests.filter(r => r.status === 'completed').length, color: '#10b981' }
                                    ]}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none' }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        radius={[0, 10, 10, 0]}
                                        barSize={20}
                                    >
                                        {[0, 1, 2, 3].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : index === 1 ? '#f59e0b' : index === 2 ? '#3b82f6' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-base-content/50 mt-4 italic">Real-time breakdown of help tickets and their progression within the cluster.</p>
                    </div>
                </div>
            </div>

            {/* Management Tabs */}
            <div className="tabs tabs-boxed bg-base-200 mb-6 p-1">
                <a
                    className={`tab tab-lg ${activeTab === 'ngos' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('ngos')}
                >
                    🏢 NGO Management
                </a>
                <a
                    className={`tab tab-lg ${activeTab === 'users' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👤 User Management
                </a>
                <a
                    className={`tab tab-lg ${activeTab === 'requests' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    📋 Help Requests
                </a>
            </div>

            <div className="card bg-base-100 shadow-xl overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 bg-base-200 border-b border-base-300">
                    <h2 className="font-bold text-lg">
                        {activeTab === 'ngos' && 'Registered Organizations'}
                        {activeTab === 'users' && 'Registered Users'}
                        {activeTab === 'requests' && 'All Help Requests'}
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {activeTab === 'ngos' ? (
                            /* NGO Table */
                            <>
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>Organization</th>
                                        <th>Registration No.</th>
                                        <th>Contact Info</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ngos.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-8">No NGOs found.</td></tr>
                                    ) : (
                                        ngos.map((ngo) => (
                                            <tr key={ngo._id} className="hover">
                                                <td>
                                                    <div>
                                                        <div className="font-bold">{ngo.ngoDetails?.organizationName || ngo.name}</div>
                                                        <div className="text-sm opacity-50">Joined: {new Date(ngo.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </td>
                                                <td><span className="font-mono bg-base-200 px-2 py-1 rounded">{ngo.ngoDetails?.registrationNumber || "N/A"}</span></td>
                                                <td><div className="text-sm"><div>📧 {ngo.email}</div><div>📱 {ngo.phone}</div></div></td>
                                                <td>{ngo.location?.district ? <div className="badge badge-ghost">{ngo.location.district}</div> : <span className="opacity-50">N/A</span>}</td>
                                                <td>
                                                    {ngo.ngoDetails?.isVerified ?
                                                        <div className="badge badge-success gap-2">Verified</div> :
                                                        <div className="badge badge-warning gap-2 animate-pulse">Pending</div>
                                                    }
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        {!ngo.ngoDetails?.isVerified && (
                                                            <button className="btn btn-sm btn-success text-white" onClick={() => handleApproveClick(ngo._id)}>✓</button>
                                                        )}
                                                        <button className="btn btn-sm btn-error text-white" onClick={() => handleRemoveClick(ngo._id)}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </>
                        ) : (
                            /* Users Table */
                            <>
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>User</th>
                                        <th>Contact Info</th>
                                        <th>Location</th>
                                        <th>Reputation</th>
                                        <th>Credits</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-8">No users found.</td></tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u._id} className="hover">
                                                <td>
                                                    <div>
                                                        <div className="font-bold">{u.name}</div>
                                                        <div className="text-sm opacity-50">Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </td>
                                                <td><div className="text-sm"><div>📧 {u.email}</div><div>📱 {u.phone}</div></div></td>
                                                <td>{u.location?.district ? <div className="badge badge-ghost">{u.location.district}</div> : <span className="opacity-50">N/A</span>}</td>
                                                <td>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="badge badge-sm badge-outline">Trust: {u.trustScore}%</span>
                                                        <span className="text-xs">⭐ {u.averageRating?.toFixed(1) || "N/A"}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="font-bold">{u.timeCredits}</div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-error text-white"
                                                        onClick={() => handleRemoveClick(u._id)}
                                                        title="Remove User"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </>
                        )}

                        {activeTab === 'requests' && (
                            /* Help Requests Table */
                            <>
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>Title</th>
                                        <th>Requester</th>
                                        <th>Helper</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-8">No requests found.</td></tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req._id} className="hover">
                                                <td>
                                                    <div className="font-bold">{req.title}</div>
                                                    <div className="text-xs opacity-50 badge badge-ghost badge-sm">{req.category}</div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="font-bold">{req.requester?.name || 'Unknown'}</div>
                                                        <div className="text-xs opacity-50">{req.requester?.email}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {req.helper ? (
                                                        <div>
                                                            <div className="font-bold">{req.helper.name}</div>
                                                            <div className="text-xs opacity-50">{req.helper.email}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs opacity-50 italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={`badge ${req.status === 'completed' ? 'badge-success text-white' :
                                                        req.status === 'in_progress' ? 'badge-info text-white' :
                                                            req.status === 'assigned' ? 'badge-warning' :
                                                                'badge-ghost'
                                                        } gap-2 capitalize`}>
                                                        {req.status.replace('_', ' ')}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-sm">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-xs">
                                                        {req.isEmergency && <span className="text-error font-bold">EMERGENCY</span>}
                                                        {!req.isEmergency && <span>Credits: {req.creditsCost}</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </>
                        )}
                    </table>
                </div>

                {/* NGO Pagination */}
                {activeTab === 'ngos' && ngoPagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2 pb-6">
                        <button
                            className="btn btn-primary btn-outline btn-sm"
                            disabled={ngoPagination.page <= 1}
                            onClick={() => setNgoPagination({ ...ngoPagination, page: ngoPagination.page - 1 })}
                        >
                            Previous
                        </button>
                        <div className="flex items-center px-4 font-bold text-sm">
                            Page {ngoPagination.page} of {ngoPagination.totalPages}
                        </div>
                        <button
                            className="btn btn-primary btn-outline btn-sm"
                            disabled={ngoPagination.page >= ngoPagination.totalPages}
                            onClick={() => setNgoPagination({ ...ngoPagination, page: ngoPagination.page + 1 })}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* User Pagination */}
                {activeTab === 'users' && userPagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2 pb-6">
                        <button
                            className="btn btn-primary btn-outline btn-sm"
                            disabled={userPagination.page <= 1}
                            onClick={() => setUserPagination({ ...userPagination, page: userPagination.page - 1 })}
                        >
                            Previous
                        </button>
                        <div className="flex items-center px-4 font-bold text-sm">
                            Page {userPagination.page} of {userPagination.totalPages}
                        </div>
                        <button
                            className="btn btn-primary btn-outline btn-sm"
                            disabled={userPagination.page >= userPagination.totalPages}
                            onClick={() => setUserPagination({ ...userPagination, page: userPagination.page + 1 })}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-base-100 border-2 border-base-300 shadow-2xl p-8 rounded-2xl max-w-md w-full mx-4 relative animate-slide-up">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setConfirmModal(null)}
                        >
                            ✕
                        </button>

                        <h3 className={`font-bold text-xl mb-4 ${confirmModal.action === 'remove' ? 'text-error' : 'text-success'}`}>
                            {confirmModal.title}
                        </h3>

                        <p className="mb-8 text-base-content/80 text-lg">
                            {confirmModal.message}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="btn btn-outline"
                                onClick={() => setConfirmModal(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn ${confirmModal.action === 'remove' ? 'btn-error' : 'btn-success'} text-white px-8`}
                                onClick={confirmAction}
                            >
                                {confirmModal.action === 'remove' ? 'Yes, Remove' : 'Yes, Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
