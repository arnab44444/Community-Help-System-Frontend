import { useState, useEffect } from "react";
import { helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    useEffect(() => {
        setPage(1); // Reset page on filter change
    }, [filter]);

    useEffect(() => {
        fetchTransactions();
    }, [filter, page]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const filters = {
                page,
                ...(filter !== "all" ? { type: filter } : {})
            };
            const { transactions: data, pagination: pagin } = await helpRequestAPI.getTransactions(filters);
            setTransactions(data);
            setPagination(pagin);
        } catch (error) {
            toast.error(error.message || "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTransactionIcon = (direction) => {
        return direction === "earned" ? "💰" : "💸";
    };

    const getTransactionColor = (direction) => {
        return direction === "earned" ? "text-success" : "text-warning";
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
                <p className="text-lg text-base-content/70">
                    Track all your credit earnings and spending
                </p>
            </div>

            {/* Visual Analytics */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Balance Flow Area Chart */}
                <div className="card lg:col-span-2 bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-2xl text-primary">📈</span>
                            Credit Movement Flow
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={transactions.slice(0, 10).reverse().map((t, i) => ({
                                    name: formatDate(t.createdAt).split(',')[0],
                                    credits: t.credits
                                }))}>
                                    <defs>
                                        <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="credits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCredits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Distribution Pie Chart */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-2xl text-secondary">📊</span>
                            Allocation
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Earned', value: transactions.filter(t => t.direction === 'earned').length || 1 },
                                            { name: 'Spent', value: transactions.filter(t => t.direction === 'spent').length || 1 }
                                        ]}
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#10b981" />
                                        <Cell fill="#f59e0b" />
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 text-[10px] font-bold opacity-60">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> EARNED</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning"></span> SPENT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="tabs tabs-boxed mb-6 bg-base-200 p-1">
                <button
                    className={`tab ${filter === "all" ? "tab-active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All Transactions
                </button>
                <button
                    className={`tab ${filter === "earned" ? "tab-active" : ""}`}
                    onClick={() => setFilter("earned")}
                >
                    💰 Earned
                </button>
                <button
                    className={`tab ${filter === "spent" ? "tab-active" : ""}`}
                    onClick={() => setFilter("spent")}
                >
                    💸 Spent
                </button>
                <button
                    className={`tab ${filter === "emergency_grant" ? "tab-active" : ""}`}
                    onClick={() => setFilter("emergency_grant")}
                >
                    🆘 Emergency
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : transactions.length === 0 ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center py-20">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold mb-2">No Transactions Yet</h2>
                        <p className="text-base-content/70">
                            Start helping others or request help to see your transaction history
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="card-body p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="text-4xl">
                                            {getTransactionIcon(transaction.direction)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-1">
                                                {transaction.description || "Credit Transaction"}
                                            </h3>
                                            <div className="text-sm text-base-content/70 space-y-1">
                                                <p>
                                                    <span className="font-semibold">Type:</span>{" "}
                                                    <span className="badge badge-sm badge-outline">
                                                        {transaction.type === "earned"
                                                            ? "Earned"
                                                            : transaction.type === "spent"
                                                                ? "Spent"
                                                                : "Emergency Grant"}
                                                    </span>
                                                </p>
                                                {transaction.helpRequest && (
                                                    <p>
                                                        <span className="font-semibold">Request:</span>{" "}
                                                        {transaction.helpRequest.title}
                                                        {" - "}
                                                        <span className="badge badge-sm">
                                                            {transaction.helpRequest.category}
                                                        </span>
                                                    </p>
                                                )}
                                                {transaction.otherUser && (
                                                    <p>
                                                        <span className="font-semibold">
                                                            {transaction.direction === "earned"
                                                                ? "Helped:"
                                                                : "Helped by:"}
                                                        </span>{" "}
                                                        {transaction.otherUser.name}
                                                    </p>
                                                )}
                                                <p className="text-xs">
                                                    {formatDate(transaction.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={`text-3xl font-bold ${getTransactionColor(
                                                transaction.direction
                                            )}`}
                                        >
                                            {transaction.direction === "earned" ? "+" : "-"}
                                            {transaction.credits}
                                        </div>
                                        <div className="text-xs text-base-content/60 mt-1">
                                            credits
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2 mb-10">
                    <button
                        className="btn btn-primary btn-outline"
                        disabled={pagination.page <= 1}
                        onClick={() => setPage(pagination.page - 1)}
                    >
                        Previous
                    </button>
                    <div className="flex items-center px-4 font-bold text-lg">
                        Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <button
                        className="btn btn-primary btn-outline"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPage(pagination.page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Transactions;
