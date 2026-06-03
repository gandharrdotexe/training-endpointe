"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "./SplashScreen";

export default function SplashScreenWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authLoading } = useAuth();
  
  const [showSplash, setShowSplash] = useState(false);
  const [fadeOutStarted, setFadeOutStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [splashCompleted, setSplashCompleted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if splash has already played during this session
    const hasPlayed = sessionStorage.getItem("enflix_intro_played");
    if (!hasPlayed) {
      setShowSplash(true);
    }
  }, []);

  const handleFadeOutStart = () => {
    setFadeOutStarted(true);
  };

  const handleComplete = () => {
    sessionStorage.setItem("enflix_intro_played", "true");
    setShowSplash(false);
    setSplashCompleted(true);
  };

  // If auth state resolves after the splash completes or during the animation,
  // we perform the redirect once splash completes and auth loading is done.
  useEffect(() => {
    if (splashCompleted && !authLoading) {
      if (user) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
  }, [splashCompleted, authLoading, user, router]);

  // Prevent flash of page content during SSR hydration if the splash is supposed to play.
  if (!isMounted) {
    return <div className="fixed inset-0 bg-[#000000] z-[99999]" />;
  }

  return (
    <>
      {showSplash && (
        <SplashScreen
          onComplete={handleComplete}
          onFadeOutStart={handleFadeOutStart}
        />
      )}
      <div
        style={{
          opacity: showSplash ? (fadeOutStarted ? 1 : 0) : 1,
          transition: "opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          pointerEvents: showSplash && !fadeOutStarted ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}
