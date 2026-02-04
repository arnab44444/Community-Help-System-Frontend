import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My profile</h1>
        <p className="text-lg text-base-content/70">
          Your community help stats. Trust score grows when you give and receive help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Phone</span>
                </label>
                <p className="text-lg">{user?.phone}</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Role</span>
                </label>
                <span className={`badge badge-lg ${
                  user?.role === "admin" ? "badge-error" :
                  user?.role === "ngo" ? "badge-warning" :
                  "badge-info"
                }`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Community stats</h2>
            <p className="text-sm text-base-content/60 mb-4">1 hour of help = 1 time credit. Credits are used only when help is completed.</p>
            <div className="space-y-4">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Time credits</div>
                <div className="stat-value text-primary">{user?.timeCredits ?? 0}</div>
                <div className="stat-desc text-xs">Earn by helping; use when you request help</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Times you helped</div>
                <div className="stat-value text-secondary">{user?.completedHelps ?? 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Received Helps</div>
                <div className="stat-value text-accent">{user?.receivedHelps || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Trust score</div>
                <div className="stat-value">{user?.trustScore ?? 0}%</div>
                <div className="stat-desc text-xs">Increases when you give and receive help</div>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        {user?.location && (
          <div className="card bg-base-100 shadow-xl md:col-span-2">
            <div className="card-body">
              <h2 className="card-title">Location</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">District</span>
                  </label>
                  <p>{user.location.district || "Not set"}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Thana/Upazila</span>
                  </label>
                  <p>{user.location.thana || "Not set"}</p>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Ward/Area</span>
                  </label>
                  <p>{user.location.ward || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className="card bg-base-100 shadow-xl md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Verification Status</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Phone Verification</span>
                {user?.verification?.phoneVerified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Not Verified</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Identity Verification</span>
                {user?.verification?.identityVerified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Not Verified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
