import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTechnician } from "../../context/TechnicianContext";
import { MapPin, Upload, X, Check, Loader } from "lucide-react";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const SKILL_OPTIONS = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "AC Repair",
  "Painter",
  "Cleaner",
  "Pest Control",
  "Appliance Repair",
  "Cab Service Driver",
  "3-Wheeler Driver",
  "Box Truck Driver",
];

const TechnicianOnboardingPage = () => {
  const { createProfile, technicianProfile, loading } = useTechnician();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState({ coordinates: [0, 0], address: "" });
  const [locationStatus, setLocationStatus] = useState("idle");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    drivingLicense: null,
    certificates: null,
  });

  useEffect(() => {
    if (technicianProfile) {
      navigate("/technician/dashboard");
    }
  }, [technicianProfile, navigate]);

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length >= 2) {
        toast.error("You can select up to 2 categories");
        return;
      }
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "profile") {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setDocuments({ ...documents, [type]: file });
    }
  };

  const handleGetLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          ...location,
          coordinates: [longitude, latitude],
          address: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
        });
        setLocationStatus("success");
      },
      (error) => {
        toast.error("Unable to retrieve your location");
        setLocationStatus("error");
      }
    );
  };

  const handleSubmit = async () => {
    if (!profilePhoto || selectedSkills.length === 0 || !bio) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("skills", JSON.stringify(selectedSkills));
    formData.append("location", JSON.stringify(location));
    formData.append("profilePhoto", profilePhoto);

    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        formData.append(key, documents[key]);
      }
    });

    const result = await createProfile(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success("Profile created successfully!");
      navigate("/technician/dashboard");
    } else {
      toast.error(result.message || "Failed to create profile");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 flex">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-500 ${step >= s ? "bg-blue-600" : "bg-transparent"
                }`}
            />
          ))}
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                  Complete Your Profile
                </h1>
                <p className="text-slate-500">
                  Tell us more about yourself and your professional skills.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profile")}
                    />
                  </label>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Profile Photo (Required)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Short Professional Bio
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 min-h-[100px]"
                  placeholder="e.g. Expert plumber with 5 years of experience in residential and commercial repairs..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Select Your Categories (Max 2)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedSkills.includes(skill)
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full py-4 text-lg bg-blue-600 shadow-xl shadow-blue-500/20"
                onClick={() => setStep(2)}
                disabled={!bio || !profilePhoto || selectedSkills.length === 0}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                  Service Location
                </h1>
                <p className="text-slate-500 text-sm">
                  We'll show you jobs within 10-15km of this location.
                </p>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${locationStatus === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                    }`}
                >
                  <MapPin className="w-8 h-8" />
                </div>

                {locationStatus === "success" ? (
                  <div className="space-y-2">
                    <p className="font-bold text-slate-900">
                      Location Detected!
                    </p>
                    <p className="text-xs text-slate-500">{location.address}</p>
                    <button
                      onClick={handleGetLocation}
                      className="text-xs font-bold text-blue-600 hover:underline mt-2"
                    >
                      Detect Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-500 text-sm">
                      We need your location to show you nearby work.
                    </p>
                    <Button
                      className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                      onClick={handleGetLocation}
                      disabled={locationStatus === "loading"}
                    >
                      {locationStatus === "loading"
                        ? "Locating..."
                        : "Detect Current Location"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-slate-100 text-slate-600"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-[2] bg-blue-600 shadow-xl shadow-blue-500/20"
                  onClick={() => setStep(3)}
                  disabled={locationStatus !== "success"}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                  Verification
                </h1>
                <p className="text-slate-500">
                  Upload these documents to get verified and start receiving
                  jobs.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { id: "aadharCard", label: "Aadhar Card (Front & Back)" },
                  { id: "panCard", label: "PAN Card" },
                  {
                    id: "drivingLicense",
                    label: "Driving License (For Drivers)",
                  },
                  { id: "certificates", label: "Professional Certificate" },
                ].map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      {doc.label}
                    </span>
                    <label className="cursor-pointer">
                      {documents[doc.id] ? (
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                          <Check className="w-4 h-4" /> Uploaded
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                          Upload
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, doc.id)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  className="flex-1 bg-slate-100 text-slate-600"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  className="flex-[2] bg-blue-600 shadow-xl shadow-blue-500/20"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Start Earning"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianOnboardingPage;
