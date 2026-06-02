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
    <div>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {/* TODO: protect this route properly in middleware */}
      <div className="bg-white border rounded p-4 mb-4">
        <p>Context User: {user ? user.email : "No user in context"}</p>
        <p>Backend Profile: {profile ? profile.email : "No profile loaded"}</p>
      </div>

      <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={signOut}>
        Logout
      </button>
    </div>
  );
}
