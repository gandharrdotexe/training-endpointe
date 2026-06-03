"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const data = await login({ email, password });
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        setMessage("Success! Access granted.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setMessage(data.message || "Invalid credentials.");
        setError(true);
      }
    } catch (err) {
      setMessage(err.message || "Network error. Try again.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#0c0c0c] p-8 rounded-2xl border border-[#564d4d]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#db0000] to-[#831010]" />
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <Link href="/register" className="font-medium text-[#db0000] hover:text-white transition-colors no-underline">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address-input" className="sr-only">
                Email address
              </label>
              <input
                id="email-address-input"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#564d4d] placeholder-gray-500 text-white bg-black focus:outline-none focus:ring-1 focus:ring-[#db0000] focus:border-[#db0000] sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-input-field" className="sr-only">
                Password
              </label>
              <input
                id="password-input-field"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#564d4d] placeholder-gray-500 text-white bg-black focus:outline-none focus:ring-1 focus:ring-[#db0000] focus:border-[#db0000] sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white ${
                loading
                  ? "bg-[#db0000] opacity-70 cursor-not-allowed"
                  : "bg-[#db0000] hover:bg-[#831010] focus:ring-2 focus:ring-[#db0000]"
              } focus:outline-none transition-all shadow-md`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`p-3 rounded-lg text-center text-sm font-medium border ${
              error
                ? "bg-[#db0000]/10 border-[#db0000] text-[#db0000]"
                : "bg-green-950/20 border-green-800 text-green-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
