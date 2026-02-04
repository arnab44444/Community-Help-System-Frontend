import { useState, useEffect } from "react";
import { helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const filters = filter !== "all" ? { type: filter } : {};
            const data = await helpRequestAPI.getTransactions(filters);
            setTransactions(data);
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
        </div>
    );
};

export default Transactions;
