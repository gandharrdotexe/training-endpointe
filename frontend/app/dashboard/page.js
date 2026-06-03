"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, token, signOut } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [token]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">User Dashboard</h1>
      <p className="text-gray-400 text-sm">Review your ENFLIX active membership and session profile details.</p>

      {/* Profile Details Card */}
      <div className="bg-[#0c0c0c] border border-[#564d4d]/40 rounded-xl p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#db0000]" />
        
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Credentials</h2>
          <p className="text-sm font-medium text-white mt-1">
            Active Email: <strong className="text-gray-200">{user ? user.email : "No user in context"}</strong>
          </p>
        </div>

        <div className="pt-4 border-t border-[#564d4d]/20">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Database Synchronized Profile</h2>
          <p className="text-sm font-medium text-white mt-1">
            Backend Verified: <strong className="text-gray-200">{profile ? profile.email : "No profile loaded"}</strong>
          </p>
        </div>
      </div>

      <button 
        className="bg-[#db0000] hover:bg-[#831010] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-300 transform active:scale-95 shadow-md shadow-[#db0000]/10"
        onClick={signOut}
      >
        Sign Out
      </button>
    </div>
  );
}
