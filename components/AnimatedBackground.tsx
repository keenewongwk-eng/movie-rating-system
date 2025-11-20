"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* 漸變背景層 - 視差滾動效果 */}
        <div
          className="absolute inset-0 opacity-30 transition-transform duration-100 ease-out"
          style={{
            background: `radial-gradient(circle at 50% ${
              50 + scrollY * 0.1
            }%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% ${
                          30 + scrollY * 0.15
                        }%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 20% ${
                          70 + scrollY * 0.12
                        }%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />

        {/* 動態光暈效果 */}
        <div
          className="absolute inset-0 opacity-20 transition-transform duration-100 ease-out"
          style={{
            background: `radial-gradient(ellipse at ${50 + scrollY * 0.05}% ${
              50 + scrollY * 0.08
            }%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)`,
            transform: `scale(${1 + scrollY * 0.0001})`,
          }}
        />

        {/* 網格背景 - 視差移動 */}
        <div
          className="absolute inset-0 opacity-5 transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)`,
          }}
        />

        {/* 浮動光點 */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-xl opacity-20"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `radial-gradient(circle, rgba(${
                59 + i * 20
              }, 130, 246, 0.3) 0%, transparent 70%)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              transform: `translate(${scrollY * (0.05 + i * 0.01)}px, ${
                scrollY * (0.08 + i * 0.01)
              }px)`,
              animation: `float ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
