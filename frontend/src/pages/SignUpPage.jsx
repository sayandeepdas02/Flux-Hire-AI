import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../ui/components/AuthLayout";
import { FloatingInput, StandardInput } from "../ui/components/AuthInputs";
import Button from "../ui/components/Button";
import { Calendar } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        if (pwd.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsLoading(true);

        const result = await signup(email, password, name, dob || null);

        if (result.success) {
            navigate("/interviewer");
        } else {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-[32px] font-bold text-slate-900 mb-2 tracking-tight">Sign up</h1>
                <p className="text-slate-500 font-normal">Sign up to enjoy the feature of Flux Hire AI</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <FloatingInput
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <FloatingInput
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    leftIcon={<Calendar className="h-5 w-5" />}
                    disabled={isLoading}
                />

                <FloatingInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <StandardInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#ED5E29] hover:bg-[#ED5E29]/90 text-white font-bold h-12 rounded-lg text-base shadow-lg shadow-orange-500/20 mb-8 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Creating account..." : "Sign up"}
                </Button>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-slate-500">or</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-colors mb-10 disabled:opacity-50"
                    disabled={isLoading}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </button>

                <p className="text-center text-slate-500 font-medium">
                    Already have an account? <Link to="/signin" className="text-[#ED5E29] font-bold hover:underline">Sign in</Link>
                </p>

            </form>
        </AuthLayout>
    );
}
