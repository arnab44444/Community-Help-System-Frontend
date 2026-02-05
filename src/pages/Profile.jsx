import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { authAPI } from "../utils/api";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: {
      district: "",
      thana: "",
      ward: "",
    },
    ngoDetails: {
      organizationName: "",
      registrationNumber: "",
    },
  });

  useEffect(() => {
    loadUser().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: {
          district: user.location?.district || "",
          thana: user.location?.thana || "",
          ward: user.location?.ward || "",
        },
        ngoDetails: {
          organizationName: user.ngoDetails?.organizationName || "",
          registrationNumber: user.ngoDetails?.registrationNumber || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else if (name.includes("ngoDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        ngoDetails: { ...prev.ngoDetails, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await authAPI.updateProfile(formData);
      await loadUser();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-secondary p-8 md:p-12 text-primary-content shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="avatar placeholder">
            <div className="bg-white/20 backdrop-blur-md text-white rounded-full w-24 md:w-32 ring-4 ring-white/30">
              <span className="text-4xl md:text-5xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {user?.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="badge badge-lg bg-white/20 border-0 text-white gap-2 py-4">
                <span className="opacity-70">Role:</span> {user?.role?.toUpperCase()}
              </span>
              <span className="badge badge-lg bg-white/20 border-0 text-white gap-2 py-4">
                <span className="opacity-70 text-xl text-yellow-500">⭐</span> {user?.trustScore}% Trust
              </span>
            </div>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Security */}
        <div className="lg:col-span-1 space-y-8">
          {/* Stats Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                📊 Activity Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl">
                  <span className="text-sm font-medium opacity-70">Time Credits</span>
                  <span className="text-xl font-bold text-primary">{user?.timeCredits ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl">
                  <span className="text-sm font-medium opacity-70">Helps Provided</span>
                  <span className="text-xl font-bold text-secondary">{user?.completedHelps ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-xl">
                  <span className="text-sm font-medium opacity-70">Helps Received</span>
                  <span className="text-xl font-bold text-accent">{user?.receivedHelps ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                🛡️ Trust & Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm opacity-70">Phone Status</span>
                  {user?.verification?.phoneVerified ? (
                    <span className="badge badge-success badge-sm text-white">Verified</span>
                  ) : (
                    <span className="badge badge-warning badge-sm">Pending</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm opacity-70">Identity Status</span>
                  {user?.verification?.identityVerified ? (
                    <span className="badge badge-success badge-sm text-white">Verified</span>
                  ) : (
                    <span className="badge badge-warning badge-sm">Pending</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Edit Profile</h3>
                <span className="text-xs opacity-50 italic">Updates help neighbors find you</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input input-bordered focus:input-primary transition-all rounded-xl"
                      required
                    />
                  </div>

                  {/* Email (Read Only) */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Email Address (Fixed)</span>
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      readOnly
                      className="input input-bordered bg-base-200 cursor-not-allowed opacity-70 rounded-xl"
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Phone Number</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input input-bordered focus:input-primary transition-all rounded-xl"
                      required
                    />
                  </div>

                  {/* District */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">District</span>
                    </label>
                    <input
                      type="text"
                      name="location.district"
                      value={formData.location.district}
                      onChange={handleChange}
                      className="input input-bordered focus:input-primary transition-all rounded-xl"
                    />
                  </div>

                  {/* Thana/Upazila */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Thana / Upazila</span>
                    </label>
                    <input
                      type="text"
                      name="location.thana"
                      value={formData.location.thana}
                      onChange={handleChange}
                      className="input input-bordered focus:input-primary transition-all rounded-xl"
                    />
                  </div>

                  {/* Ward */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Ward / Area</span>
                    </label>
                    <input
                      type="text"
                      name="location.ward"
                      value={formData.location.ward}
                      onChange={handleChange}
                      className="input input-bordered focus:input-primary transition-all rounded-xl"
                    />
                  </div>
                </div>

                {/* NGO Specific Fields */}
                {user?.role === "ngo" && (
                  <div className="space-y-6 pt-6 border-t border-base-200">
                    <h4 className="font-bold text-lg text-primary">NGO Information</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-bold">Organization Name</span>
                        </label>
                        <input
                          type="text"
                          name="ngoDetails.organizationName"
                          value={formData.ngoDetails.organizationName}
                          onChange={handleChange}
                          className="input input-bordered focus:input-primary transition-all rounded-xl"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-bold">Registration Number</span>
                        </label>
                        <input
                          type="text"
                          name="ngoDetails.registrationNumber"
                          value={formData.ngoDetails.registrationNumber}
                          onChange={handleChange}
                          className="input input-bordered focus:input-primary transition-all rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-8">
                  <button
                    type="submit"
                    className={`btn btn-primary px-8 rounded-full shadow-lg shadow-primary/20 ${updating ? 'loading' : ''}`}
                    disabled={updating}
                  >
                    {updating ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
