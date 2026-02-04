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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Request Help</h1>
        <p className="text-lg text-base-content/70">
          Describe what you need. Location helps helpers near you find your request. Credits are only used when help is completed.
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Need help with form filling"
                className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered textarea-primary w-full h-32 focus:textarea-primary focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Describe your help request in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text text-sm font-semibold text-base-content">Category</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered select-primary w-full focus:select-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="educational">📚 Educational Help</option>
                  <option value="medical">🏥 Medical Support</option>
                  <option value="technical">💻 Technical Help</option>
                  <option value="physical">🏃 Physical Assistance</option>
                  <option value="disaster">🌪️ Disaster Support</option>
                  <option value="other">⚡ Other</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text text-sm font-semibold text-base-content">Time needed (hours)</span>
                </label>
                <input
                  type="number"
                  name="timeRequired"
                  className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.timeRequired}
                  onChange={handleChange}
                  min="0.25"
                  max="12"
                  step="0.25"
                  required
                />
                <label className="label pt-1">
                  <span className="label-text-alt text-xs">15 min (0.25) to 12 hours. This is the time credit cost when completed.</span>
                </label>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="cursor-pointer label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Emergency Request</span>
                <input
                  type="checkbox"
                  name="isEmergency"
                  className="toggle toggle-primary"
                  checked={formData.isEmergency}
                  onChange={handleChange}
                />
              </label>
              <label className="label pt-0">
                <span className="label-text-alt text-xs">
                  Emergency requests get priority and may be free of charge
                </span>
              </label>
            </div>

            <div className="divider my-6">Location Details</div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-control w-full">
                <label className="label pb-2">
                  <span className="label-text text-sm font-semibold text-base-content">District</span>
                </label>
                <input
                  type="text"
                  name="location.district"
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
                  className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.location.ward}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label pb-2">
                <span className="label-text text-sm font-semibold text-base-content">Detailed Address</span>
              </label>
              <input
                type="text"
                name="location.address"
                className="input input-bordered input-primary w-full focus:input-primary focus:ring-2 focus:ring-primary/50 transition-all"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Street address, building number, etc."
              />
            </div>

            <div className={`alert ${hasEnoughCredits ? "alert-info" : "alert-warning"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>
                {formData.isEmergency
                  ? "Emergency: no credits needed. May be covered by NGO pools."
                  : `When help is completed, this will use ${formData.timeRequired} time credit(s). You have ${user?.timeCredits ?? 0} credits. ${!hasEnoughCredits ? "Earn more by helping others, or mark as emergency if urgent." : ""}`}
              </span>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create help request"}
              </button>
              {!formData.isEmergency && !hasEnoughCredits && (
                <p className="text-sm text-warning mt-2">You have fewer than {creditsNeeded} credits. You can still post; earn credits by helping others before your help is completed, or mark as emergency if urgent.</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
