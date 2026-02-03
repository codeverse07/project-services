import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Briefcase, CheckCircle, TrendingUp, Shield } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";

const TechnicianRegisterPage = () => {
    const { register } = useUser();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const name = `${firstName} ${lastName}`.trim();

        // Register with role 'TECHNICIAN'
        const result = await register(
            name,
            email,
            password,
            password,
            phone,
            "TECHNICIAN"
        );

        if (result.success) {
            toast.success("Account created! Let's set up your profile.");
            navigate("/technician/onboarding"); // Redirect to profile creation
        } else {
            toast.error(result.message || "Registration failed");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Left: Branding & Benefits */}
            <div className="hidden lg:flex lg:w-1/2 p-8 lg:p-12 bg-indigo-600 flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-2xl font-black tracking-tight">
                            Reservice Technician
                        </span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Turn your skills <br />
                        into a business.
                    </h1>
                    <p className="text-indigo-100 text-lg mb-12 max-w-md">
                        Join our network of verified professionals and get access to
                        thousands of high-value jobs in your area.
                    </p>

                    <div className="space-y-6">
                        {[
                            {
                                icon: TrendingUp,
                                title: "Higher Earnings",
                                desc: "Partners earn 30% more on average",
                            },
                            {
                                icon: CheckCircle,
                                title: "Verified Jobs",
                                desc: "No haggling, verified customers only",
                            },
                            {
                                icon: Shield,
                                title: "Instant Payouts",
                                desc: "Get paid directly to your bank account",
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-indigo-100/80 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Right: Register Form */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            Create Technician Account
                        </h2>
                        <p className="text-slate-500">
                            Fill in your details to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                id="firstName"
                                label="First Name"
                                placeholder="Rajesh"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <Input
                                id="lastName"
                                label="Last Name"
                                placeholder="Kumar"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <Input
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            id="phone"
                            label="Mobile Number"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <Input
                            id="password"
                            label="Create Password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="pt-2">
                            <Button
                                className="w-full py-4 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Continue"}
                            </Button>
                        </div>

                        <div className="text-center space-y-4">
                            <p className="text-sm text-slate-500">
                                Already registered?{" "}
                                <Link
                                    to="/technician/login"
                                    className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                                >
                                    Log in
                                </Link>
                            </p>
                            <p className="text-xs text-slate-400">
                                Are you a customer?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    User Signup
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TechnicianRegisterPage;
