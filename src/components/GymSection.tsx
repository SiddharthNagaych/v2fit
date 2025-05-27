// components/GymSection.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  Wifi,
  Car,
  Coffee,
  User,
  Users,
  Clock,
  Star,
  MapPin,
  Camera,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";

import { AnimatedCard } from "./shared/index";
import Image from "next/image";

interface Gym {
  _id: { $oid: string };
  name: string;
  location: string;
  amenities: string[];
  images: string[];
  rating: { $numberDouble: string };
  programs: string[];
  highlight?: string;
  members: { $numberLong: string };
}

interface AmenityIcons {
  [key: string]: React.ReactNode;
}

const GymSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gym");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API Response:", data);
        setGyms(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch gyms", err);
        setError("Failed to load gyms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  const amenityIcons: AmenityIcons = {
    "Modern Equipment": <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />,
    "Free WiFi": <Wifi className="w-4 h-4 md:w-5 md:h-5" />,
    Parking: <Car className="w-4 h-4 md:w-5 md:h-5" />,
    Café: <Coffee className="w-4 h-4 md:w-5 md:h-5" />,
    Pool: <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded"></div>,
    Sauna: <div className="w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded"></div>,
    "Personal Training": <User className="w-4 h-4 md:w-5 md:h-5" />,
    "Group Classes": <Users className="w-4 h-4 md:w-5 md:h-5" />,
    "24/7 Access": <Clock className="w-4 h-4 md:w-5 md:h-5" />,
    "Cardio Zone": <Star className="w-4 h-4 md:w-5 md:h-5" />,
    "Free Weights": <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />,
    "Locker Rooms": <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-500 rounded"></div>,
    "Olympic Equipment": <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />,
    "Recovery Zone": <div className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded"></div>,
    "Nutrition Bar": <Coffee className="w-4 h-4 md:w-5 md:h-5" />,
    "Yoga Studio": <div className="w-4 h-4 md:w-5 md:h-5 bg-purple-500 rounded"></div>,
    "Meditation Room": <div className="w-4 h-4 md:w-5 md:h-5 bg-indigo-500 rounded"></div>,
    "Juice Bar": <Coffee className="w-4 h-4 md:w-5 md:h-5" />,
    "Spa Services": <Star className="w-4 h-4 md:w-5 md:h-5" />,
    "Heavy Weights": <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />,
    "CrossFit Box": <div className="w-4 h-4 md:w-5 md:h-5 bg-orange-500 rounded"></div>,
    "Battle Ropes": <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded"></div>,
    "Tire Flipping Area": <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-700 rounded"></div>,
  };

  // Mouse movement tracking for parallax effects (desktop only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && window.innerWidth > 768) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || gyms.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gyms.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, gyms.length]);

  const handleGymClick = (gymId: string): void => {
    console.log(`Navigate to gym ${gymId}`);
  };

  const nextSlide = (): void => {
    if (gyms.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % gyms.length);
    }
  };

  const prevSlide = (): void => {
    if (gyms.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + gyms.length) % gyms.length);
    }
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C15364]"></div>
            <p className="text-white mt-4">Loading gyms...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-[#C15364] text-white rounded-lg hover:bg-[#C15364]/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No gyms found
  if (gyms.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-white text-lg">No gyms found.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentGym = gyms[currentIndex];
  const nextGym = gyms[(currentIndex + 1) % gyms.length];
  const prevGym = gyms[(currentIndex - 1 + gyms.length) % gyms.length];

  return (
    <section
      id="gyms"
      className="py-12 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden relative"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C15364]/5 via-transparent to-[#858B95]/5"></div>
        <div className="absolute top-0 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-[#C15364]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#858B95]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 137.5) % 360;
          const distance = 0.5 * Math.sqrt(i + 0.5);
          const left = 50 + distance * Math.cos((angle * Math.PI) / 180);
          const top = 50 + distance * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.min(95, Math.max(5, left))}%`,
                top: `${Math.min(95, Math.max(5, top))}%`,
                animationDelay: `${(i * 0.15) % 3}s`,
                animationDuration: `${2 + ((i * 0.2) % 3)}s`,
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={containerRef}>
        {/* Header */}
        <AnimatedCard>
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 rounded-full mb-4 md:mb-6 backdrop-blur-sm border border-white/10">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#C15364] mr-2" />
              <span className="text-white/90 font-semibold text-sm md:text-base">
                Premium Fitness Destinations
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-[#C15364] to-[#858B95] bg-clip-text text-transparent">
                Premium
              </span>{" "}
              Gyms
            </h2>
            <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              State-of-the-art facilities designed for champions like you
            </p>
          </div>
        </AnimatedCard>

        {/* Main Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Current Gym Card */}
          <div className="relative">
            <div
              className="w-full transform-gpu transition-all duration-1000 ease-out"
              style={{
                transform: window.innerWidth > 768 ? `
                  rotateY(${(mousePosition.x - 0.5) * 5}deg) 
                  rotateX(${(mousePosition.y - 0.5) * -5}deg)
                  translateY(${(mousePosition.y - 0.5) * -20}px)
                ` : 'none',
              }}
            >
              <div
                className="relative group cursor-pointer"
                onClick={() => handleGymClick(currentGym._id.$oid)}
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C15364] via-[#858B95] to-[#C15364] rounded-2xl md:rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>

                {/* Main card */}
                <div className="relative bg-gradient-to-br from-[#868C96]/20 via-[#868C96]/15 to-[#868C96]/25 backdrop-blur-2xl border border-[#868C96]/30 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl">
                  {/* Highlight badge */}
                  {currentGym.highlight && (
                    <div className="absolute -top-3 md:-top-4 left-4 md:left-8 px-4 md:px-6 py-1 md:py-2 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-full text-white font-bold text-xs md:text-sm shadow-lg">
                      {currentGym.highlight}
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left side - Image and stats */}
                    <div className="space-y-4 md:space-y-6">
                      {/* Main image area */}
                      <div className="relative h-48 md:h-80 bg-gradient-to-br from-[#C15364]/20 via-[#868C96]/30 to-[#858B95]/20 rounded-xl md:rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-700">
                        {/* Actual gym image */}
                        {currentGym.images && currentGym.images.length > 0 ? (
                          <Image
                            src={currentGym.images[0]}
                            alt={currentGym.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          // Fallback placeholder
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-[#C15364]/30 rounded-full blur-xl animate-pulse"></div>
                              <Camera className="relative w-12 h-12 md:w-20 md:h-20 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          </div>
                        )}

                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>

                        {/* Rating badge */}
                        <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-[#868C96]/80 backdrop-blur-md px-3 md:px-4 py-1 md:py-2 rounded-full border border-[#868C96]/40">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mr-1 md:mr-2 fill-current" />
                            <span className="text-white font-bold text-sm md:text-lg">
                              {parseFloat(currentGym.rating.$numberDouble).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* Members count */}
                        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 bg-[#868C96]/80 backdrop-blur-md px-3 md:px-4 py-1 md:py-2 rounded-full border border-[#868C96]/40">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 md:w-4 md:h-4 text-[#C15364] mr-1 md:mr-2" />
                            <span className="text-white font-semibold text-xs md:text-sm">
                              {parseInt(currentGym.members.$numberLong).toLocaleString()}+ Members
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick stats */}
                      <div className="grid grid-cols-3 gap-2 md:gap-4">
                        <div className="text-center p-2 md:p-4 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-lg md:rounded-xl border border-[#868C96]/20">
                          <Award className="w-6 h-6 md:w-8 md:h-8 text-[#C15364] mx-auto mb-1 md:mb-2" />
                          <div className="text-lg md:text-2xl font-bold text-white">
                            {parseFloat(currentGym.rating.$numberDouble).toFixed(1)}
                          </div>
                          <div className="text-white/60 text-xs md:text-sm">Rating</div>
                        </div>
                        <div className="text-center p-2 md:p-4 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-lg md:rounded-xl border border-[#868C96]/20">
                          <Users className="w-6 h-6 md:w-8 md:h-8 text-[#868C96] mx-auto mb-1 md:mb-2" />
                          <div className="text-lg md:text-2xl font-bold text-white">
                            {(parseInt(currentGym.members.$numberLong) / 1000).toFixed(1)}K+
                          </div>
                          <div className="text-white/60 text-xs md:text-sm">Members</div>
                        </div>
                        <div className="text-center p-2 md:p-4 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-lg md:rounded-xl border border-[#868C96]/20">
                          <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#C15364] mx-auto mb-1 md:mb-2" />
                          <div className="text-lg md:text-2xl font-bold text-white">
                            {currentGym.amenities.length}
                          </div>
                          <div className="text-white/60 text-xs md:text-sm">Amenities</div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Details */}
                    <div className="space-y-6 md:space-y-8">
                      <div>
                        <h3 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#C15364] group-hover:to-[#858B95] group-hover:bg-clip-text transition-all duration-500">
                          {currentGym.name}
                        </h3>
                        <div className="flex items-center text-white/70 text-base md:text-xl mb-4 md:mb-6">
                          <MapPin className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-[#C15364]" />
                          {currentGym.location}
                        </div>
                      </div>

                      {/* Programs */}
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-white font-bold text-lg md:text-xl">
                          Specialized Programs
                        </h4>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {currentGym.programs.map((program, idx) => (
                            <div
                              key={idx}
                              className="group/program relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-full opacity-0 group-hover/program:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 border border-white/20 rounded-full text-white font-semibold backdrop-blur-sm group-hover/program:text-white transition-colors duration-300 text-sm md:text-base">
                                {program}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Amenities Grid */}
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-white font-bold text-lg md:text-xl">
                          Premium Amenities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {currentGym.amenities.map((amenity, idx) => (
                            <div
                              key={idx}
                              className="flex items-center p-3 md:p-4 bg-gradient-to-r from-[#868C96]/10 to-[#868C96]/20 rounded-lg md:rounded-xl border border-[#868C96]/20 backdrop-blur-sm group-hover:border-[#C15364]/30 transition-colors duration-300"
                            >
                              <span className="text-[#C15364] mr-3 md:mr-4 text-lg md:text-xl">
                                {amenityIcons[amenity] || <Star className="w-4 h-4 md:w-5 md:h-5" />}
                              </span>
                              <span className="text-white font-medium text-sm md:text-base">
                                {amenity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full py-4 md:py-6 bg-gradient-to-r from-[#C15364] via-[#C15364] to-[#858B95] text-white rounded-xl font-bold text-lg md:text-xl relative overflow-hidden group/btn transform hover:scale-105 transition-all duration-300 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center">
                          <span className="mr-3">Explore This Gym</span>
                          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Preview Cards (Desktop Only) */}
            {gyms.length > 1 && (
              <>
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-80 opacity-60 hover:opacity-80 transition-all duration-500 transform hover:scale-105">
                  <div
                    className="bg-gradient-to-br from-[#868C96]/30 to-[#868C96]/40 backdrop-blur-xl border border-[#868C96]/30 rounded-2xl p-6 cursor-pointer"
                    onClick={() => prevSlide()}
                  >
                    <div className="h-40 bg-gradient-to-br from-[#858B95]/20 to-[#C15364]/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {prevGym.images && prevGym.images.length > 0 ? (
                        <Image
                          src={prevGym.images[0]}
                          alt={prevGym.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-white/60" />
                      )}
                    </div>
                    <h4 className="text-white font-bold mb-2">{prevGym.name}</h4>
                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="text-white/80 text-sm">
                        {parseFloat(prevGym.rating.$numberDouble).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-[#C15364] text-sm">
                      {prevGym.highlight || "Premium Facility"}
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-80 opacity-60 hover:opacity-80 transition-all duration-500 transform hover:scale-105">
                  <div
                    className="bg-gradient-to-br from-[#868C96]/30 to-[#868C96]/40 backdrop-blur-xl border border-[#868C96]/30 rounded-2xl p-6 cursor-pointer"
                    onClick={() => nextSlide()}
                  >
                    <div className="h-40 bg-gradient-to-br from-[#C15364]/20 to-[#858B95]/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      {nextGym.images && nextGym.images.length > 0 ? (
                        <Image
                          src={nextGym.images[0]}
                          alt={nextGym.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-white/60" />
                      )}
                    </div>
                    <h4 className="text-white font-bold mb-2">{nextGym.name}</h4>
                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="text-white/80 text-sm">
                        {parseFloat(nextGym.rating.$numberDouble).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-[#858B95] text-sm">
                      {nextGym.highlight || "Premium Facility"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation Controls */}
          {gyms.length > 1 && (
            <div className="flex items-center justify-center mt-8 md:mt-12 space-x-4 md:space-x-8">
              {/* Previous button */}
              <button
                onClick={prevSlide}
                className="p-3 md:p-4 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-[#C15364]/50 transition-all duration-300 group"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-[#C15364] group-hover:scale-110 transition-all duration-300" />
              </button>

              {/* Pagination dots */}
              <div className="flex space-x-2 md:space-x-3">
                {gyms.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-gradient-to-r from-[#C15364] to-[#858B95] scale-125"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={nextSlide}
                className="p-3 md:p-4 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-[#C15364]/50 transition-all duration-300 group"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-[#C15364] group-hover:scale-110 transition-all duration-300" />
              </button>

              {/* Auto-play toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-3 md:p-4 bg-gradient-to-r from-[#858B95]/20 to-[#C15364]/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-[#858B95]/50 transition-all duration-300 group"
              >
                {isAutoPlaying ? (
                  <Pause className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-[#858B95] group-hover:scale-110 transition-all duration-300" />
                ) : (
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-[#858B95] group-hover:scale-110 transition-all duration-300" />
                )}
              </button>
            </div>
          )}

          {/* Mobile Navigation (Swipe indicators) */}
          <div className="lg:hidden mt-6 md:mt-8">
            <div className="flex justify-between items-center px-4">
              <button
                onClick={prevSlide}
                className="p-2 bg-[#868C96]/20 backdrop-blur-sm rounded-lg border border-white/10 hover:border-[#C15364]/30 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex space-x-2">
                {gyms.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-[#C15364] scale-125"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 bg-[#868C96]/20 backdrop-blur-sm rounded-lg border border-white/10 hover:border-[#C15364]/30 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-16 md:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Total Gyms */}
            <div className="text-center p-6 md:p-8 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-2xl border border-[#868C96]/20 backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {gyms.length}
              </div>
              <div className="text-white/60 text-lg md:text-xl">
                Premium Locations
              </div>
            </div>

            {/* Total Members */}
            <div className="text-center p-6 md:p-8 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-2xl border border-[#868C96]/20 backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#858B95] to-[#C15364] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {gyms.reduce((total, gym) => total + parseInt(gym.members.$numberLong), 0).toLocaleString()}+
              </div>
              <div className="text-white/60 text-lg md:text-xl">
                Active Members
              </div>
            </div>

            {/* Average Rating */}
            <div className="text-center p-6 md:p-8 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-2xl border border-[#868C96]/20 backdrop-blur-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Star className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {(gyms.reduce((total, gym) => total + parseFloat(gym.rating.$numberDouble), 0) / gyms.length).toFixed(1)}
              </div>
              <div className="text-white/60 text-lg md:text-xl">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymSection;