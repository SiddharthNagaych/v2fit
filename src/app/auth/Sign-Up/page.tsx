"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  Trophy,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    phoneEmailReceiver: (userObj: { user_json_url: string }) => Promise<void>;
    lastVerifiedJsonUrl: string;
  }
}

export default function SignupForm() {
  // State declarations
  const [name, setName] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize Phone.Email verification

  // Update the email verification handler
  useEffect(() => {
    window.phoneEmailReceiver = async (userObj) => {
      const url = userObj.user_json_url;
      const res = await fetch(url);
      const data = await res.json();
      console.log("Verified email:", data.user_email_id);
      setVerifiedEmail(data.user_email_id);
      setEmailVerified(true);
      window.lastVerifiedJsonUrl = url;

      // Clear any existing email errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    };

    const script = document.createElement("script");
    script.src = "https://www.phone.email/verify_email_v1.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Update the validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!emailVerified) {
      newErrors.email = "Please verify your email with OTP first";
    } else if (!verifiedEmail) {
      newErrors.email = "Email verification failed - please try again";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update the submit handler to use verifiedEmail
   const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          password,
          email: verifiedEmail,
          jsonUrl: window.lastVerifiedJsonUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409) {
         toast.error('User already exists');
         return;
      } else {
        toast.error(errorData.message || 'Registration failed');
      }
      }

      // Show success toast
      toast.success('Account created successfully! Redirecting...', {
        duration: 3000,
      });

      // Set success state
      setIsSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/home');
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this success UI section before your return statement
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
            <p className="text-slate-300 mb-6">
              Your account has been created successfully. You&apos;ll be redirected shortly.
            </p>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Welcome Content */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-slate-400">
                Fitness
              </span>{" "}
              Journey
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              Join thousands of members who have transformed their lives with
              our expert-designed programs
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500/20 to-slate-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Expert Trainers</h3>
                <p className="text-slate-400 text-sm">
                  Certified professionals
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500/20 to-slate-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Personalized Plans</h3>
                <p className="text-slate-400 text-sm">Tailored to your goals</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500/20 to-slate-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Quick Results</h3>
                <p className="text-slate-400 text-sm">See changes fast</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500/20 to-slate-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">24/7 Support</h3>
                <p className="text-slate-400 text-sm">We&apos;re here to help</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center lg:justify-start space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-slate-400 text-sm">Happy Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-slate-400 text-sm">Programs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-slate-400 text-sm">Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-slate-400">
                Get started with your free account
              </p>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-900/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 ${
                      errors.name
                        ? "border-red-500/50 focus:border-red-400"
                        : "border-white/10 focus:border-rose-400/50"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div id="phone_email_container">
                <div
                  className="pe_verify_email"
                  data-client-id="13957563937383767692"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    disabled={!emailVerified}
                    className={`w-full pl-12 pr-12 py-4 bg-slate-900/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-400"
                        : "border-white/10 focus:border-rose-400/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!emailVerified}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {!emailVerified && (
                  <p className="mt-2 text-sm text-amber-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Please verify your email first to unlock password field
                    </span>
                  </p>
                )}
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
                {password && !errors.password && emailVerified && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          password.length >= 8 ? "bg-green-400" : "bg-slate-600"
                        }`}
                      />
                      <span
                        className={
                          password.length >= 8
                            ? "text-green-400"
                            : "text-slate-400"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
                            ? "bg-green-400"
                            : "bg-slate-600"
                        }`}
                      />
                      <span
                        className={
                          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
                            ? "text-green-400"
                            : "text-slate-400"
                        }
                      >
                        Uppercase, lowercase & number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!emailVerified || isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-rose-500 to-slate-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              {!emailVerified && (
                <p className="text-sm text-amber-400 text-center flex items-center justify-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Email verification required to create account</span>
                </p>
              )}

              {errors.submit && (
                <p className="text-sm text-red-400 text-center flex items-center justify-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <a
                  href="/auth/Sign-In"
                  className="text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              🔒 Your data is encrypted and secure. We never share your
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}