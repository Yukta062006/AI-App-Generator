"use client";

import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Loader2, ShieldCheck, Mail, Lock, ArrowRight,
  RefreshCcw, CheckCircle2, Eye, EyeOff, UserPlus, LogIn,
} from "lucide-react";

type Mode = "login" | "signup";
type Step = "credentials" | "otp";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const reset = (newMode: Mode) => {
    setMode(newMode);
    setStep("credentials");
    setError("");
    setSuccess("");
    setOtp(["", "", "", "", "", ""]);
  };

  // ── Stage 1 ───────────────────────────────────────────────────────────────
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (password !== confirm) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) { setError(json.error); return; }
    } else {
      // Login — send OTP only after verifying credentials
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) { setError(json.error); return; }
    }

    setSuccess(`OTP sent to ${email}. Check your inbox!`);
    setStep("otp");
  };

  // ── Stage 2 ───────────────────────────────────────────────────────────────
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const code = otp.join("");

    // Verify OTP (mark verified=true for signup)
    const verifyRes = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, markVerified: mode === "signup" }),
    });
    const verifyJson = await verifyRes.json();

    if (!verifyRes.ok) {
      setError(verifyJson.error || "Invalid or expired OTP.");
      setLoading(false);
      return;
    }

    // Sign in with NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setError("Verification passed but sign-in failed. Please log in.");
      setLoading(false);
      setMode("login");
      setStep("credentials");
      return;
    }

    window.location.href = callbackUrl;
  };

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "radial-gradient(ellipse at top, #1d4ed820 0%, #0f172a 60%)" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600/10 text-blue-500 mb-4 border border-blue-500/20 shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI App Generator</h1>
          <p className="text-sm text-slate-400 mt-1">Secure access to your dynamic platform</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">

          {/* Mode tabs — only show on step 1 */}
          {step === "credentials" && (
            <div className="flex border-b border-slate-800">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => reset(m)}
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    mode === m
                      ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {m === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {/* Step indicator — only on step 2 */}
          {step === "otp" && (
            <div className="flex border-b border-slate-800 text-xs font-semibold">
              <div className="flex-1 py-3 text-center text-slate-500">
                1. {mode === "signup" ? "Sign Up" : "Login"}
              </div>
              <div className="flex-1 py-3 text-center text-blue-400 border-b-2 border-blue-500">
                2. Email OTP
              </div>
            </div>
          )}

          <div className="p-8">
            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Yukta Thakur"
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300" htmlFor="email">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300" htmlFor="password">
                    {mode === "signup" ? "Create Password" : "Password"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300" htmlFor="confirm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signup" ? "Create Account & Send OTP" : "Verify & Send OTP"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center space-y-1">
                  {success && (
                    <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-white">Enter 6-digit OTP</h2>
                  <p className="text-sm text-slate-400">
                    Sent to <span className="text-slate-200 font-medium">{email}</span>
                  </p>
                </div>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-11 h-12 text-center text-xl font-bold rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-center">{error}</p>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || otp.some((d) => !d)}
                    className="w-full h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Sign In"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep("credentials"); setError(""); setOtp(["","","","","",""]); }}
                    className="w-full text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCcw className="h-3 w-3" /> Go back / Resend
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-slate-800/40 p-3 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              🔒 Protected by Enterprise Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
