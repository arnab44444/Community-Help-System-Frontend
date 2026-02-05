import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../provider/AuthProvider";
import { helpRequestAPI } from "../utils/api";
import { toast } from "react-toastify";

const CreateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    timeRequired: 1,
    isEmergency: false,
    location: {
      ward: user?.location?.ward || "",
      thana: user?.location?.thana || "",
      district: user?.location?.district || "",
      address: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await helpRequestAPI.create(formData);
      toast.success("Help request created successfully!");
      navigate("/help-requests");
    } catch (error) {
      toast.error(error.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  const creditsNeeded = formData.isEmergency ? 0 : formData.timeRequired;
  const hasEnoughCredits = (user?.timeCredits ?? 0) >= creditsNeeded;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-4 h-[calc(100vh-120px)] flex flex-col">
      {/* Integrated Header and Form Card */}
      <div className="card bg-base-100 shadow-2xl border border-base-300 flex-1 overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-primary via-purple-600 to-secondary p-4 text-primary-content flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🆘</span>
            <div>
              <h1 className="text-xl font-black leading-tight uppercase tracking-tighter">Request Help</h1>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Community Exchange Portal</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold opacity-90">Instant Visibility to Helpers</p>
            <p className="text-[10px] opacity-70">Credits transferred on completion</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto lg:overflow-visible">
          <div className="grid lg:grid-cols-2 gap-8 flex-1">
            {/* Left Column: Core Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-base-200 pb-2 mb-2 text-primary">
                <span className="font-black text-xs uppercase tracking-widest">01. Service Information</span>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Help Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Grocery shopping assistance"
                  className="input input-bordered input-sm focus:input-primary rounded-lg h-10 w-full"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Detailed Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered textarea-sm focus:textarea-primary h-24 rounded-lg resize-none"
                  placeholder="Provide essential details for the helper..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Category</span>
                  </label>
                  <select
                    name="category"
                    className="select select-bordered select-sm focus:select-primary rounded-lg h-10"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="educational">📚 Educational</option>
                    <option value="medical">🏥 Medical</option>
                    <option value="technical">💻 Technical</option>
                    <option value="physical">🏃 Physical</option>
                    <option value="disaster">🌪️ Disaster</option>
                    <option value="other">⚡ Other</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Hours Needed</span>
                  </label>
                  <input
                    type="number"
                    name="timeRequired"
                    className="input input-bordered input-sm focus:input-primary rounded-lg h-10"
                    value={formData.timeRequired}
                    onChange={handleChange}
                    min="0.25" max="12" step="0.25" required
                  />
                </div>
              </div>

              <div className="bg-error/5 p-4 rounded-xl border border-error/10 mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-error block">URGENT SITUATION?</span>
                    <p className="text-[10px] opacity-70 font-medium">Marking as emergency waives credit costs.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="isEmergency"
                    className="toggle toggle-error toggle-md"
                    checked={formData.isEmergency}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Location & Summary */}
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center gap-2 border-b border-base-200 pb-2 mb-2 text-secondary">
                <span className="font-black text-xs uppercase tracking-widest">02. Location & Validation</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">District</span>
                  </label>
                  <input
                    type="text"
                    name="location.district"
                    className="input input-bordered input-sm focus:input-secondary rounded-lg h-10"
                    value={formData.location.district}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Thana</span>
                  </label>
                  <input
                    type="text"
                    name="location.thana"
                    className="input input-bordered input-sm focus:input-secondary rounded-lg h-10"
                    value={formData.location.thana}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold text-xs">Ward</span>
                  </label>
                  <input
                    type="text"
                    name="location.ward"
                    className="input input-bordered input-sm focus:input-secondary rounded-lg h-10"
                    value={formData.location.ward}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs">Specific Address</span>
                </label>
                <input
                  type="text"
                  name="location.address"
                  className="input input-bordered input-sm focus:input-secondary rounded-lg h-10"
                  value={formData.location.address}
                  placeholder="Street, Building, Flat etc."
                  onChange={handleChange}
                />
              </div>

              {/* Summary Alert */}
              <div className={`mt-auto p-4 rounded-xl border flex items-start gap-3 transition-colors ${formData.isEmergency ? "bg-error/10 border-error/20" : hasEnoughCredits ? "bg-primary/10 border-primary/20" : "bg-warning/10 border-warning/20"}`}>
                <div className="text-2xl mt-1">
                  {formData.isEmergency ? "🚨" : hasEnoughCredits ? "✅" : "⚠️"}
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-none mb-1">
                    {formData.isEmergency ? "Emergency Service" : hasEnoughCredits ? "Credits Validated" : "Low Credits Warning"}
                  </h4>
                  <p className="text-[10px] font-medium opacity-80 leading-tight">
                    {formData.isEmergency
                      ? "NGO prioritized. No personal cost."
                      : `Cost: ${formData.timeRequired} credit(s). Current: ${user?.timeCredits ?? 0}.`
                    }
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-block btn-md border-none text-white shadow-xl shadow-primary/20 rounded-xl transition-all h-12 mt-4 ${formData.isEmergency ? "bg-error hover:bg-error-focus" : "bg-primary hover:bg-primary-focus"
                  } ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {!loading && <span className="mr-2">✨</span>}
                {loading ? "Processing..." : "Submit Request Now"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
