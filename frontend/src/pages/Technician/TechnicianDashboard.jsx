import React, { useState, useEffect } from "react";
import { useTechnician } from "../../context/TechnicianContext";
import { useUser } from "../../context/UserContext"; // For logout
import { Switch } from "@headlessui/react";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Menu,
  ShieldCheck,
  ShieldAlert,
  FileText,
  TrendingUp,
  Navigation,
  Mail,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TechnicianDashboard = () => {
  const { logout, user } = useUser();
  const { technicianProfile, updateStatus, loading, subscribeToPush } = useTechnician();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (technicianProfile && !technicianProfile.pushSubscriptions?.length) {
      subscribeToPush();
    }
  }, [technicianProfile, subscribeToPush]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  const toggleStatus = (checked) => {
    updateStatus(checked);
  };

  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "My Jobs", icon: ClipboardList },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 flex flex-col h-screen`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-extrabold text-xl text-slate-900">Technician</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Profile Section */}
        <div className="px-6 py-6 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <img
                src={`http://localhost:5000/public/img/users/${technicianProfile?.profilePhoto || "default.jpg"
                  }`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) =>
                (e.target.src =
                  "https://ui-avatars.com/api/?name=" + user?.name)
                }
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 truncate">
                {user?.name}
              </h3>
              <div className="flex flex-col gap-0.5 mt-0.5">
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase tracking-wider truncate">
                  <Mail className="w-2.5 h-2.5" /> {user?.email}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase tracking-wider truncate">
                  <Phone className="w-2.5 h-2.5" /> {user?.phone || "No phone"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">
              Status
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-bold ${technicianProfile?.isOnline ? "text-green-600" : "text-slate-500"
                  }`}
              >
                {technicianProfile?.isOnline ? "Online" : "Offline"}
              </span>
              <Switch
                checked={technicianProfile?.isOnline || false}
                onChange={toggleStatus}
                className={`${technicianProfile?.isOnline ? "bg-green-500" : "bg-slate-300"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
              >
                <span
                  className={`${technicianProfile?.isOnline ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:block w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              R
            </div>
            <h1 className="font-bold text-lg text-slate-900 hidden md:block">
              Technician Dashboard
            </h1>
            {/* Verification Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${technicianProfile?.documents?.verificationStatus === "VERIFIED"
                ? "bg-green-50 text-green-600 border border-green-100"
                : technicianProfile?.documents?.verificationStatus === "REJECTED"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}
            >
              {technicianProfile?.documents?.verificationStatus === "VERIFIED" ? (
                <ShieldCheck className="w-3 h-3" />
              ) : (
                <ShieldAlert className="w-3 h-3" />
              )}
              {technicianProfile?.documents?.verificationStatus || "PENDING"}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-6 h-6 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8 pb-24 md:pb-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Responsive Grid for Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                    Today's Earnings
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 ">
                    ₹2,400
                  </h3>
                  <span className="text-xs font-bold text-green-500 flex items-center mt-2">
                    <TrendingUpIcon /> +12% from yesterday
                  </span>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                    Total Jobs
                  </p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {technicianProfile?.totalJobs || 0}
                  </h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                    Rating
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1">
                    {technicianProfile?.avgRating || 0}{" "}
                    <span className="text-yellow-400 text-lg">★</span>
                  </h3>
                </div>
                <div className="bg-blue-600 p-6 rounded-3xl md:flex flex-col justify-between hidden text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-blue-200 text-xs font-bold uppercase mb-1">
                      Status
                    </p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black">
                        {technicianProfile?.isOnline ? "Accepting Jobs" : "Offline"}
                      </h3>
                      <Switch
                        checked={technicianProfile?.isOnline || false}
                        onChange={toggleStatus}
                        className={`${technicianProfile?.isOnline ? "bg-green-400" : "bg-white/20"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                      >
                        <span
                          className={`${technicianProfile?.isOnline
                            ? "translate-x-6"
                            : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Status Card */}
              <div className="md:hidden bg-blue-600 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-blue-500/30">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase mb-1">
                      Current Status
                    </p>
                    <h3 className="text-xl font-black">
                      {technicianProfile?.isOnline
                        ? "You are Online"
                        : "You are Offline"}
                    </h3>
                    <p className="text-sm text-blue-100 mt-1">
                      {technicianProfile?.isOnline
                        ? "Waiting for new requests..."
                        : "Go online to receive jobs"}
                    </p>
                  </div>
                  <Switch
                    checked={technicianProfile?.isOnline || false}
                    onChange={toggleStatus}
                    className={`${technicianProfile?.isOnline ? "bg-green-400" : "bg-white/20"
                      } relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span
                      className={`${technicianProfile?.isOnline
                        ? "translate-x-7"
                        : "translate-x-1"
                        } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md`}
                    />
                  </Switch>
                </div>
              </div>

              {/* Job Request Placeholder */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  New Requests
                </h3>
                {technicianProfile?.isOnline ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      {technicianProfile?.skills?.some((s) =>
                        s.toLowerCase().includes("driver")
                      ) ? (
                        <Navigation className="w-8 h-8 text-blue-500" />
                      ) : (
                        <Bell className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {technicianProfile?.skills?.some((s) =>
                        s.toLowerCase().includes("driver")
                      )
                        ? "Searching for rides nearby..."
                        : "Searching for jobs nearby..."}
                    </h4>
                    <p className="text-slate-500">
                      {technicianProfile?.skills?.some((s) =>
                        s.toLowerCase().includes("driver")
                      )
                        ? "Keep the app open to receive new ride requests from customers."
                        : "We'll notify you when a customer requests a service matching your skills."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-2xl p-8 text-center">
                    <p className="font-bold text-slate-500">
                      You are offline. Go online to see requests.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="bg-white rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
              <ClipboardList className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No active jobs</h3>
              <p className="text-slate-500">
                Your accepted bookings will appear here.
              </p>
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">
                      Total Balance
                    </p>
                    <h2 className="text-4xl font-black text-slate-900">
                      ₹12,450.00
                    </h2>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">
                    Withdraw
                  </button>
                </div>

                {/* Placeholder for Earnings Chart */}
                <div className="h-64 bg-slate-50 rounded-2xl flex items-end justify-between p-6 gap-2">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500/20 rounded-t-lg relative group"
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg transition-all duration-1000"
                        style={{ height: `${h}%` }}
                      ></div>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Day {i + 1}: ₹{h * 20}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">Payout History</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Bank Transfer</p>
                          <p className="text-xs text-slate-500">
                            Oct {20 - i}, 2023
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-slate-900">+₹4,500</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={`http://localhost:5000/public/img/users/${technicianProfile?.profilePhoto || "default.jpg"
                      }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) =>
                    (e.target.src =
                      "https://ui-avatars.com/api/?name=" + user?.name)
                    }
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {user?.name}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {technicianProfile?.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(technicianProfile?.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">
                        {user?.phone || "No phone provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Verification Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["aadharCard", "panCard", "drivingLicense", "certificates"].map(
                    (doc) => {
                      const isUploaded = technicianProfile?.documents?.[doc];
                      return (
                        <div
                          key={doc}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${isUploaded
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-400"
                                }`}
                            >
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 capitalize">
                              {doc.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </div>
                          {isUploaded ? (
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">
                              Uploaded
                            </span>
                          ) : (
                            <button className="text-[10px] font-black text-blue-600 hover:underline uppercase">
                              Upload Now
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full mt-8 px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between md:hidden z-30 pb-safe">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? "text-blue-600" : "text-slate-400"
                }`}
            >
              <item.icon
                className="w-6 h-6"
                strokeWidth={activeTab === item.id ? 2.5 : 2}
              />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

const TrendingUpIcon = () => (
  <svg
    className="w-4 h-4 mr-1"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default TechnicianDashboard;
