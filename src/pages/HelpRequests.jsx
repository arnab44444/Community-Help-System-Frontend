import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";

const HelpRequests = () => {
  const { user, loading: authLoading, loadUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    category: "",
    isEmergency: "",
    status: "pending",
    page: 1
  });

  useEffect(() => {
    if (user && !authLoading) {
      loadRequests();
    }
  }, [filters, user, authLoading]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { requests: data, pagination: pagin } = await helpRequestAPI.getAll(filters);
      setRequests(data);
      setPagination(pagin);
    } catch (error) {
      toast.error("Failed to load help requests");
    } finally {
      setLoading(false);
    }
  };

  const handleOfferHelp = async (requestId) => {
    try {
      await helpRequestAPI.offerHelp(requestId);
      toast.success("Help offered successfully!");
      await loadUser();
      loadRequests();
    } catch (error) {
      toast.error(error.message || "Failed to offer help");
    }
  };

  const handleCompleteHelp = async (requestId) => {
    try {
      await helpRequestAPI.complete(requestId);
      toast.success("Help completed! Credits updated.");
      await loadUser();
      loadRequests();
    } catch (error) {
      toast.error(error.message || "Failed to complete help");
    }
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
          <p className="text-xl mb-4">Please login to view help requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Help requests</h1>
        <p className="text-lg text-base-content/70">
          Find requests near you. When you offer help and complete it, you earn time credits. Only you or the requester can mark a request as complete.
        </p>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Category</span>
              </label>
              <select
                className="select select-bordered select-primary w-full focus:select-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="educational">Educational</option>
                <option value="medical">Medical</option>
                <option value="technical">Technical</option>
                <option value="physical">Physical</option>
                <option value="disaster">Disaster</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Type</span>
              </label>
              <select
                className="select select-bordered select-primary w-full focus:select-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={filters.isEmergency}
                onChange={(e) => setFilters({ ...filters, isEmergency: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="false">Normal</option>
                <option value="true">Emergency</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Status</span>
              </label>
              <select
                className="select select-bordered select-primary w-full focus:select-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid gap-6">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-base-content/60">No help requests found</p>
          </div>
        ) : (
          requests.map((request) => {
            const requesterId = request.requester?._id || request.requester;
            const helperId = request.helper?._id || request.helper;
            const isMyRequest = requesterId === user?.id || requesterId === user?._id;
            const amIHelper = helperId === user?.id || helperId === user?._id;
            // CORE RULE: Only the seeker (isMyRequest) can confirm completion
            const canComplete = (request.status === "assigned" || request.status === "in_progress") && isMyRequest;

            return (
              <div
                key={request._id}
                className={`card bg-base-100 shadow-xl ${request.isEmergency ? "border-2 border-error" : ""
                  }`}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                        <h2 className="card-title">
                          {request.title}
                          {request.isEmergency && (
                            <span className="badge badge-error">Emergency</span>
                          )}
                        </h2>
                      </div>
                      <p className="text-base-content/70 mb-4">{request.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="badge badge-outline">
                          {request.category}
                        </div>
                        <div className="badge badge-outline">
                          ⏰ {request.timeRequired} hours
                        </div>
                        <div className="badge badge-outline">
                          💰 {request.creditsCost} credits
                        </div>
                        <div className="badge badge-outline">
                          📍 {request.location?.district}, {request.location?.thana}
                        </div>
                        <div className={`badge ${request.status === "pending" ? "badge-warning" :
                          request.status === "completed" ? "badge-success" :
                            "badge-info"
                          }`}>
                          {request.status}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm">
                          <strong>Requester:</strong> {request.requester?.name || "Unknown"}
                          {request.requester?.trustScore != null && (
                            <span className="ml-2 badge badge-sm">
                              Trust: {request.requester.trustScore}%
                            </span>
                          )}
                        </p>
                        {request.helper && (
                          <p className="text-sm mt-1">
                            <strong>Helper:</strong> {request.helper?.name || "Unknown"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                    {request.status === "pending" && !isMyRequest && user.role !== "admin" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOfferHelp(request._id)}
                      >
                        Offer Help
                      </button>
                    )}
                    {canComplete && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleCompleteHelp(request._id)}
                        title="Confirm that help was given and received. Credits will be updated."
                      >
                        ✓ Mark as complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            className="btn btn-primary btn-outline"
            disabled={pagination.page <= 1}
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
          >
            Previous
          </button>
          <div className="flex items-center px-4 font-bold text-lg">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <button
            className="btn btn-primary btn-outline"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpRequests;
