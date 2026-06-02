"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("All fields are required.");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const data = await register({ name, email, password });
      if (data.id) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setMessage(data.message || "Registration failed. Try again.");
        setError(true);
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#161b22] p-8 rounded-2xl border border-[#30363d] shadow-2xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#f0f6fc] tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-[#8b949e]">
            Or{" "}
            <Link href="/login" className="font-medium text-[#58a6ff] hover:text-[#79c0ff] transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name-input" className="sr-only">
                Full Name
              </label>
              <input
                id="name-input"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#30363d] placeholder-[#8b949e] text-[#f0f6fc] bg-[#0d1117] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent sm:text-sm transition-all"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-input" className="sr-only">
                Email address
              </label>
              <input
                id="email-input"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#30363d] placeholder-[#8b949e] text-[#f0f6fc] bg-[#0d1117] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">
                Password
              </label>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#30363d] placeholder-[#8b949e] text-[#f0f6fc] bg-[#0d1117] focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent sm:text-sm transition-all"
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
                  ? "bg-[#1f6feb] opacity-70 cursor-not-allowed"
                  : "bg-[#238636] hover:bg-[#2ea043] focus:ring-2 focus:ring-[#2ea043]"
              } focus:outline-none transition-all shadow-md`}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`p-3 rounded-lg text-center text-sm font-medium border ${
              error
                ? "bg-[#f8514915] border-[#f85149] text-[#f85149]"
                : "bg-[#56d36415] border-[#347d39] text-[#56d364]"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
