"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("enflix_token");
      const savedUser = localStorage.getItem("enflix_user");
      if (savedToken) {
        setToken(savedToken);
      }
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }
      }
      setAuthLoading(false);
    }
  }, []);

  const handleSetUser = (newUser) => {
    setUser(newUser);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("enflix_user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("enflix_user");
      }
    }
  };

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("enflix_token", newToken);
      } else {
        localStorage.removeItem("enflix_token");
      }
    }
  };

  const signOut = () => {
    handleSetUser(null);
    handleSetToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        token,
        setToken: handleSetToken,
        authLoading,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
