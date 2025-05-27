"use client"
import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, Compass, Zap, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchActive, setGlitchActive] = useState(false);

  const floatingElements: FloatingElement[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 2
  }));

  const quickLinks = [
    { name: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Programs', href: '/programs', icon: <Zap className="w-5 h-5" /> },
    { name: 'Schedule', href: '/schedule', icon: <Compass className="w-5 h-5" /> },
    { name: 'Search', href: '/search', icon: <Search className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Dynamic Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-[#C15364]/20 rounded-full blur-3xl opacity-60 animate-pulse"
          style={{
            top: `${30 + mousePosition.y * 0.1}%`,
            left: `${20 + mousePosition.x * 0.05}%`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gray-300/15 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"
          style={{
            top: `${70 + mousePosition.y * 0.08}%`,
            right: `${25 + mousePosition.x * 0.03}%`,
            transform: 'translate(50%, -50%)'
          }}
        ></div>

        {/* Floating Elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute bg-[#C15364]/30 rounded-full animate-ping"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`
            }}
          ></div>
        ))}

        {/* Grid Pattern */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* 404 Number with Glitch Effect */}
          <div className="mb-8 relative">
            <h1 
              className={`text-[12rem] md:text-[16rem] font-black leading-none transition-all duration-200 ${
                glitchActive 
                  ? 'text-[#C15364] animate-pulse' 
                  : 'bg-gradient-to-r from-[#C15364] via-gray-300 to-[#C15364] bg-clip-text text-transparent'
              }`}
              style={{
                textShadow: glitchActive ? '0 0 20px #C15364' : 'none',
                filter: glitchActive ? 'hue-rotate(180deg)' : 'none'
              }}
            >
              404
            </h1>
            
            {/* Glitch Lines */}
            {glitchActive && (
              <>
                <div className="absolute inset-0 bg-[#C15364]/20 h-2 top-1/4 animate-ping"></div>
                <div className="absolute inset-0 bg-gray-300/20 h-1 top-3/4 animate-ping delay-100"></div>
              </>
            )}
          </div>

          {/* Alert Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-full border border-gray-800/50">
                <AlertTriangle className="w-16 h-16 text-[#C15364] animate-bounce" />
              </div>
              <div className="absolute inset-0 bg-[#C15364]/20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Oops! Page Not Found
            </h2>
            <p className="text-xl md:text-2xl text-gray-300/80 mb-4 max-w-2xl mx-auto">
              Looks like you&apos;ve ventured into uncharted territory. The page you&apos;re looking for 
              seems to have disappeared into the digital void.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gray-900/30 backdrop-blur-xl rounded-full px-6 py-3 border border-gray-800/50">
              <Sparkles className="w-5 h-5 text-[#C15364] animate-pulse" />
              <span className="text-gray-300">Don&apos;t worry, we&apos;ll get you back on track!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => window.location.href = '/'}
              className="group relative px-10 py-5 bg-gradient-to-r from-[#C15364] to-gray-300 text-white rounded-2xl font-bold text-xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#C15364]/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#C15364] to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Home className="w-6 h-6 group-hover:animate-bounce" />
                <span>Return Home</span>
              </div>
            </button>
            
            <button
              onClick={handleGoBack}
              className="group relative px-10 py-5 bg-gray-900/50 backdrop-blur-xl border-2 border-gray-800/50 text-gray-300 rounded-2xl font-bold text-xl hover:border-[#C15364]/50 hover:text-white transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                <span>Go Back</span>
              </div>
            </button>

            <button
              onClick={handleRetry}
              className="group relative px-10 py-5 bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 text-gray-300 rounded-2xl font-bold text-xl hover:border-[#C15364]/30 hover:text-[#C15364] transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span>Retry</span>
              </div>
            </button>
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8">Quick Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = link.href}
                  className="group relative bg-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-[#C15364]/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C15364]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative text-center">
                    <div className="flex justify-center mb-3 text-[#C15364] group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </div>
                    <div className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                      {link.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-900/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-white mb-4">Need Help?</h4>
            <p className="text-gray-300 mb-6">
              If you believe this is an error or you were expecting to find something here, 
              please contact our support team.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-3 bg-[#C15364]/20 border border-[#C15364]/50 text-[#C15364] rounded-xl hover:bg-[#C15364]/30 transition-all duration-300 font-semibold"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* CSS for additional animations */}
      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        .glitch-effect {
          animation: glitch 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}