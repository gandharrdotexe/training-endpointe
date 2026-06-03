"use client";

import { useEffect, useRef, useState } from "react";

export default function SplashScreen({ onComplete, onFadeOutStart }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [phase, setPhase] = useState(1); // 1: build, 2: convergence, 3: reveal, 4: sweep, 5: transition
  const [logoStyle, setLogoStyle] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(1.2)",
    filter: "blur(12px)",
  });
  const [isSweeping, setIsSweeping] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let cx = width / 2;
    let cy = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic Film Grain Pattern (Created once and repeated)
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const nCtx = noiseCanvas.getContext("2d");
    const nData = nCtx.createImageData(128, 128);
    const nBuf = new Uint32Array(nData.data.buffer);
    for (let i = 0; i < nBuf.length; i++) {
      const val = Math.floor(Math.random() * 35); // subtle noise
      nBuf[i] = (val << 16) | (val << 8) | val | (18 << 24); // Low opacity (18/255)
    }
    nCtx.putImageData(nData, 0, 0);
    const noisePattern = ctx.createPattern(noiseCanvas, "repeat");

    // 1. Floating dust particles
    const dustParticles = [];
    const dustCount = 65;
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.3,
        alpha: 0.05 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    // 2. Collision Sparks
    const sparks = [];
    const createSparks = (x, y) => {
      const sparkCount = 45;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1, // slight upward bias
          size: 1 + Math.random() * 2.5,
          color: Math.random() > 0.4 ? "#FF2D55" : Math.random() > 0.5 ? "#E50914" : "#FFFFFF",
          life: 0.6 + Math.random() * 0.6, // seconds
          maxLife: 0.6 + Math.random() * 0.6,
        });
      }
    };

    // 3. Ribbon Paths Definition
    // 4 ribbons: 2 starting from left edge, 2 starting from right edge
    const ribbons = [
      {
        side: "left",
        yStart: height * 0.25,
        color: "#E50914",
        width: 4,
        pulseOffset: 0,
      },
      {
        side: "left",
        yStart: height * 0.75,
        color: "#B20710",
        width: 3.5,
        pulseOffset: Math.PI / 2,
      },
      {
        side: "right",
        yStart: height * 0.35,
        color: "#FF2D55",
        width: 3.8,
        pulseOffset: Math.PI,
      },
      {
        side: "right",
        yStart: height * 0.65,
        color: "#E50914",
        width: 4.2,
        pulseOffset: Math.PI * 1.5,
      },
    ];

    // Easing helpers
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const easeInCubic = (t) => t * t * t;

    // Timeline tracker
    const startTime = performance.now();
    let collisionTriggered = false;

    const tick = (now) => {
      const elapsed = (now - startTime) / 1000; // time in seconds

      // Cap at 2.5 seconds
      if (elapsed >= 2.5) {
        onComplete();
        return;
      }

      // Clear with slight alpha to create motion trails for ribbons
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, width, height);

      // --- 1. Draw Vignette ---
      const vignette = ctx.createRadialGradient(cx, cy, Math.min(width, height) * 0.25, cx, cy, Math.max(width, height) * 0.85);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.98)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // --- 2. Draw Tiled Dynamic Film Grain ---
      ctx.save();
      ctx.translate(Math.random() * 128, Math.random() * 128);
      ctx.fillStyle = noisePattern;
      ctx.fillRect(-128, -128, width + 128, height + 128);
      ctx.restore();

      // --- 3. Draw and Update Subtle Floating Dust ---
      ctx.fillStyle = "#ffffff";
      dustParticles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.phase) * 0.15;
        p.phase += p.speed;

        // Wrap around boundaries
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.globalAlpha = p.alpha * (0.3 + Math.sin(p.phase) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // Reset alpha

      // --- 4. Draw and Update Ribbons (0s to 1.3s) ---
      // Additive blending for gorgeous light streak integration
      ctx.globalCompositeOperation = "screen";

      if (elapsed < 1.3) {
        // Emerging: 0s - 0.4s (head progresses from 0 to 0.3)
        // Convergence: 0.4s - 1.3s (head accelerates from 0.3 to 1.0)
        let headProgress = 0;
        if (elapsed < 0.4) {
          // Slow build phase
          headProgress = (elapsed / 0.4) * 0.18;
        } else {
          // Rapid acceleration phase
          const convergenceProgress = (elapsed - 0.4) / 0.9; // 0 to 1
          headProgress = 0.18 + easeInCubic(convergenceProgress) * 0.82;
        }

        // Tail follows slightly behind
        const tailProgress = Math.max(0, headProgress - 0.32);

        ribbons.forEach((ribbon) => {
          const startX = ribbon.side === "left" ? 0 : width;
          const endX = cx;

          // Define bezier control points with time-based sine wave oscillation for organic movement
          const wave = Math.sin(elapsed * 12 + ribbon.pulseOffset) * 60;
          const cp1x = startX + (endX - startX) * 0.35;
          const cp1y = ribbon.yStart + wave;
          const cp2x = startX + (endX - startX) * 0.75;
          const cp2y = cy - wave * 0.6;

          // Draw ribbon path from tailProgress to headProgress
          ctx.beginPath();
          let first = true;

          // Render ribbon trail
          const steps = 30;
          for (let s = 0; s <= steps; s++) {
            const u = tailProgress + (headProgress - tailProgress) * (s / steps);
            
            // Cubic bezier formula
            const oneMinusU = 1 - u;
            const x =
              Math.pow(oneMinusU, 3) * startX +
              3 * Math.pow(oneMinusU, 2) * u * cp1x +
              3 * oneMinusU * Math.pow(u, 2) * cp2x +
              Math.pow(u, 3) * endX;
            const y =
              Math.pow(oneMinusU, 3) * ribbon.yStart +
              3 * Math.pow(oneMinusU, 2) * u * cp1y +
              3 * oneMinusU * Math.pow(u, 2) * cp2y +
              Math.pow(u, 3) * cy;

            if (first) {
              ctx.moveTo(x, y);
              first = false;
            } else {
              ctx.lineTo(x, y);
            }
          }

          // Glow effect on ribbon line
          ctx.strokeStyle = ribbon.color;
          ctx.lineWidth = ribbon.width;
          ctx.shadowBlur = 15;
          ctx.shadowColor = ribbon.color;
          ctx.lineCap = "round";
          ctx.stroke();

          // Core bright white center for ribbon
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = ribbon.width * 0.25;
          ctx.shadowBlur = 4;
          ctx.stroke();

          // Reset shadow fields for performance
          ctx.shadowBlur = 0;
        });
      }

      // --- 5. Collision Explosion & Sparks (1.3s onwards) ---
      if (elapsed >= 1.3 && !collisionTriggered) {
        collisionTriggered = true;
        createSparks(cx, cy);
        setPhase(3);
      }

      if (collisionTriggered) {
        // Red radial flash centered at (cx, cy) that expands and fades
        const collisionAge = elapsed - 1.3; // time since collision
        if (collisionAge < 0.3) {
          const flashProgress = collisionAge / 0.3; // 0 to 1
          const flashRadius = Math.max(width, height) * 0.45 * flashProgress;
          const flashGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashRadius);
          flashGlow.addColorStop(0, `rgba(255, 45, 85, ${0.95 * (1 - flashProgress)})`);
          flashGlow.addColorStop(0.3, `rgba(229, 9, 20, ${0.5 * (1 - flashProgress)})`);
          flashGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = flashGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, flashRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw and Update Sparks
        sparks.forEach((sp) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.08; // subtle gravity
          sp.vx *= 0.97; // friction
          sp.vy *= 0.97; // friction

          const spAge = collisionAge;
          const remainingLifeRatio = Math.max(0, 1 - spAge / sp.life);

          if (remainingLifeRatio > 0) {
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = remainingLifeRatio;
            ctx.shadowBlur = 10;
            ctx.shadowColor = sp.color;

            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size * remainingLifeRatio, 0, Math.PI * 2);
            ctx.fill();

            // Reset sparks shadow
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
          }
        });
      }

      // Reset blend mode
      ctx.globalCompositeOperation = "source-over";

      // --- 6. Handle ENFLIX Text Reveal Timing ---
      // Phase 3: 1.3s - 1.9s
      if (elapsed >= 1.3 && elapsed < 1.9) {
        const textProgress = (elapsed - 1.3) / 0.6; // 0 to 1
        const eased = easeOutExpo(textProgress);

        const op = eased;
        const scale = 1.25 - 0.25 * eased;
        const blur = 12 * (1 - eased);

        setLogoStyle({
          opacity: op,
          transform: `translate(-50%, -50%) scale(${scale})`,
          filter: `blur(${blur}px)`,
        });
      } else if (elapsed >= 1.9 && elapsed < 2.2) {
        // Phase 4: Signature Sweep (1.9s - 2.2s)
        if (!isSweeping) {
          setIsSweeping(true);
          setPhase(4);
          setLogoStyle({
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
            filter: "blur(0px)",
          });
        }
      } else if (elapsed >= 2.2) {
        // Phase 5: Transition to website (2.2s - 2.5s)
        if (!isFadingOut) {
          setIsFadingOut(true);
          setPhase(5);
          if (onFadeOutStart) onFadeOutStart();
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [onComplete, isSweeping, isFadingOut]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000",
        zIndex: 99999,
        overflow: "hidden",
        pointerEvents: "auto",
        transition: "opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        opacity: isFadingOut ? 0 : 1,
      }}
    >
      {/* 2D Canvas for volumetric background and light ribbons */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Cinematic Logo Element Layered on Top */}
      <div
        className={`enflix-logo-container`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          pointerEvents: "none",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          ...logoStyle,
          transition: "filter 0.15s ease-out, transform 0.15s ease-out",
        }}
      >
        <h1
          className={`enflix-logo ${isSweeping ? "sweeping" : ""}`}
          style={{
            margin: 0,
            padding: 0,
            textTransform: "uppercase",
          }}
        >
          ENFLIX
        </h1>
      </div>

      <style jsx global>{`
        .enflix-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.5rem, 12vw, 9.5rem);
          font-weight: 900;
          letter-spacing: 0.18em;
          line-height: 1;
          position: relative;
          display: inline-block;
          color: #db0000;

          /* Cinematic pure red drop shadows */
          filter: drop-shadow(0 0 10px rgba(219, 0, 0, 0.7))
            drop-shadow(0 0 30px rgba(219, 0, 0, 0.5))
            drop-shadow(0 0 60px rgba(219, 0, 0, 0.3));

          /* Gorgeous reflection below logo */
          -webkit-box-reflect: below -32px linear-gradient(transparent 35%, rgba(219, 0, 0, 0.15));
        }

        /* Diagonal sweeping sheen layer */
        .enflix-logo::after {
          content: "ENFLIX";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 900;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
          background: linear-gradient(
            115deg,
            transparent 35%,
            #ff1f1f 50%,
            transparent 65%
          );
          background-size: 250% 100%;
          background-position: 180% 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
          opacity: 0;
        }

        /* Active sweep phase animations */
        .enflix-logo.sweeping::after {
          animation: logo-sweep-animation 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .enflix-logo.sweeping {
          animation: logo-glow-boost-animation 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes logo-sweep-animation {
          0% {
            background-position: 180% 0;
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            background-position: -80% 0;
            opacity: 0;
          }
        }

        @keyframes logo-glow-boost-animation {
          0% {
            filter: drop-shadow(0 0 10px rgba(219, 0, 0, 0.7))
              drop-shadow(0 0 30px rgba(219, 0, 0, 0.5))
              drop-shadow(0 0 60px rgba(219, 0, 0, 0.3));
            transform: scale(1);
          }
          40% {
            /* Dynamic brightness burst & bloom */
            filter: drop-shadow(0 0 15px rgba(219, 0, 0, 0.85))
              drop-shadow(0 0 45px rgba(219, 0, 0, 0.75))
              drop-shadow(0 0 90px rgba(219, 0, 0, 0.6))
              brightness(1.2);
            transform: scale(1.03);
          }
          100% {
            filter: drop-shadow(0 0 10px rgba(219, 0, 0, 0.7))
              drop-shadow(0 0 30px rgba(219, 0, 0, 0.5))
              drop-shadow(0 0 60px rgba(219, 0, 0, 0.3));
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
