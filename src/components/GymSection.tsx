// components/GymSection.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  TrendingUp
} from 'lucide-react';

import { AnimatedCard } from './shared/index';

interface Gym {
  id: number;
  name: string;
  location: string;
  amenities: string[];
  images: string[];
  rating: number;
  programs: string[];
  highlight?: string;
  members?: number;
}

interface AmenityIcons {
  [key: string]: React.ReactNode;
}

const GymSection: React.FC = () => {
 const [currentIndex, setCurrentIndex] = useState(0);
const [isAutoPlaying, setIsAutoPlaying] = useState(true);
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const containerRef = useRef<HTMLDivElement>(null);
  const gyms: Gym[] = [
    {
      id: 1,
      name: "Downtown Fitness",
      location: "123 Main St, Downtown",
      amenities: ["Modern Equipment", "Free WiFi", "Parking", "Café"],
      images: ["gym1.jpg", "gym1.jpg"],
      rating: 4.8,
      programs: ["Fat Loss", "Muscle Gain"],
      highlight: "🔥 Most Popular",
      members: 1200
    },
    {
      id: 2,
      name: "Uptown Wellness",
      location: "456 Oak Ave, Uptown", 
      amenities: ["Pool", "Sauna", "Personal Training", "Group Classes"],
      images: ["gym1.jpg", "gym1.jpg"],
      rating: 4.9,
      programs: ["Mental Fitness", "Fat Loss"],
      highlight: "⭐ Premium Elite",
      members: 890
    },
    {
      id: 3,
      name: "City Center Gym",
      location: "789 Pine St, City Center",
      amenities: ["24/7 Access", "Cardio Zone", "Free Weights", "Locker Rooms"],
      images: ["gym1.jpg", "gym1.jpg"],
      rating: 4.7,
      programs: ["Muscle Gain", "Mental Fitness"],
      highlight: "⚡ 24/7 Access",
      members: 950
    },
    {
      id: 4,
      name: "Elite Performance Hub",
      location: "321 Sports Ave, Athletic District",
      amenities: ["Olympic Equipment", "Recovery Zone", "Nutrition Bar", "Personal Training"],
      images: ["gym1.jpg", "gym1.jpg"],
      rating: 4.9,
      programs: ["Athletic Performance", "Strength Training", "Recovery"],
      highlight: "🏆 Champions Choice",
      members: 650
    },
    {
      id: 5,
      name: "Zen Fitness Studio",
      location: "654 Harmony Blvd, Wellness Quarter",
      amenities: ["Yoga Studio", "Meditation Room", "Juice Bar", "Spa Services"],
      images: ["gym1.jpg", "gym1.jpg"],
      rating: 4.6,
      programs: ["Mindfulness", "Flexibility", "Mental Fitness"],
      highlight: "🧘 Wellness Focused",
      members: 420
    },
    {
      id: 6,
      name: "PowerHouse Gym",
      location: "987 Strength St, Industrial Zone",
      amenities: ["Heavy Weights", "CrossFit Box", "Battle Ropes", "Tire Flipping Area"],
      images: ["gym1.jpg", "gym1.jpg"],  
      rating: 4.8,
      programs: ["Powerlifting", "CrossFit", "Functional Training"],
      highlight: "💪 Strength Masters",
      members: 750
    }
  ];

  const amenityIcons: AmenityIcons = {
    "Modern Equipment": <Dumbbell className="w-5 h-5" />,
    "Free WiFi": <Wifi className="w-5 h-5" />,
    "Parking": <Car className="w-5 h-5" />,
    "Café": <Coffee className="w-5 h-5" />,
    "Pool": <div className="w-5 h-5 bg-blue-500 rounded"></div>,
    "Sauna": <div className="w-5 h-5 bg-red-500 rounded"></div>,
    "Personal Training": <User className="w-5 h-5" />,
    "Group Classes": <Users className="w-5 h-5" />,
    "24/7 Access": <Clock className="w-5 h-5" />,
    "Cardio Zone": <Star className="w-5 h-5" />,
    "Free Weights": <Dumbbell className="w-5 h-5" />,
    "Locker Rooms": <div className="w-5 h-5 bg-gray-500 rounded"></div>,
    "Olympic Equipment": <Dumbbell className="w-5 h-5" />,
    "Recovery Zone": <div className="w-5 h-5 bg-green-500 rounded"></div>,
    "Nutrition Bar": <Coffee className="w-5 h-5" />,
    "Yoga Studio": <div className="w-5 h-5 bg-purple-500 rounded"></div>,
    "Meditation Room": <div className="w-5 h-5 bg-indigo-500 rounded"></div>,
    "Juice Bar": <Coffee className="w-5 h-5" />,
    "Spa Services": <Star className="w-5 h-5" />,
    "Heavy Weights": <Dumbbell className="w-5 h-5" />,
    "CrossFit Box": <div className="w-5 h-5 bg-orange-500 rounded"></div>,
    "Battle Ropes": <div className="w-5 h-5 bg-black rounded"></div>,
    "Tire Flipping Area": <div className="w-5 h-5 bg-gray-700 rounded"></div>
  };

  // Mouse movement tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gyms.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, gyms.length]);

  const handleGymClick = (gymId: number): void => {
    // Navigate to gym details
    console.log(`Navigate to gym ${gymId}`);
  };

  const nextSlide = (): void => {
    setCurrentIndex((prev) => (prev + 1) % gyms.length);
  };

  const prevSlide = (): void => {
    setCurrentIndex((prev) => (prev - 1 + gyms.length) % gyms.length);
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentGym = gyms[currentIndex];
  const nextGym = gyms[(currentIndex + 1) % gyms.length];
  const prevGym = gyms[(currentIndex - 1 + gyms.length) % gyms.length];

  return (
    <section id="gyms" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C15364]/5 via-transparent to-[#858B95]/5"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#C15364]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#858B95]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        {/* Floating particles */}
       {[...Array(20)].map((_, i) => {
  // Deterministic positioning based on index
  const angle = (i * 137.5) % 360; // Golden angle
  const distance = 0.5 * Math.sqrt(i + 0.5);
  const left = 50 + distance * Math.cos(angle * Math.PI / 180);
  const top = 50 + distance * Math.sin(angle * Math.PI / 180);
  
  return (
    <div
      key={i}
      className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
      style={{
        left: `${Math.min(95, Math.max(5, left))}%`,
        top: `${Math.min(95, Math.max(5, top))}%`,
        animationDelay: `${(i * 0.15) % 3}s`,
        animationDuration: `${2 + (i * 0.2) % 3}s`
      }}
    />
  );
})}
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        {/* Header */}
        <AnimatedCard>
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 rounded-full mb-6 backdrop-blur-sm border border-white/10">
              <Zap className="w-5 h-5 text-[#C15364] mr-2" />
              <span className="text-white/90 font-semibold">Premium Fitness Destinations</span>
            </div>
            <h2 className="text-6xl font-black text-white mb-6 tracking-tight">
              Our <span className="bg-gradient-to-r from-[#C15364] to-[#858B95] bg-clip-text text-transparent">Premium</span> Gyms
            </h2>
            <p className="text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              State-of-the-art facilities designed for champions like you
            </p>
          </div>
        </AnimatedCard>

        {/* Revolutionary 3D Carousel */}
        <div className="relative max-w-7xl mx-auto perspective-1000">
          {/* Main Carousel Stage */}
          <div className="relative h-[700px] overflow-visible">
            {/* Current/Main Gym Card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-full max-w-4xl transform-gpu transition-all duration-1000 ease-out"
                style={{
                  transform: `
                    rotateY(${(mousePosition.x - 0.5) * 5}deg) 
                    rotateX(${(mousePosition.y - 0.5) * -5}deg)
                    translateY(${(mousePosition.y - 0.5) * -20}px)
                  `
                }}
                
              >
                <div className="relative group cursor-pointer" onClick={() => handleGymClick(currentGym.id)}>
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C15364] via-[#858B95] to-[#C15364] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-[#868C96]/20 via-[#868C96]/15 to-[#868C96]/25 backdrop-blur-2xl border border-[#868C96]/30 rounded-3xl p-10 shadow-2xl">
                    {/* Highlight badge */}
                    <div className="absolute -top-4 left-8 px-6 py-2 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-full text-white font-bold text-sm shadow-lg">
                      {currentGym.highlight}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Left side - Image and stats */}
                      <div className="space-y-6">
                        {/* Main image area */}
                        <div className="relative h-80 bg-gradient-to-br from-[#C15364]/20 via-[#868C96]/30 to-[#858B95]/20 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          {/* Animated gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                          
                          {/* Center icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-[#C15364]/30 rounded-full blur-xl animate-pulse"></div>
                              <Camera className="relative w-20 h-20 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          </div>

                          {/* Rating badge */}
                          <div className="absolute top-6 right-6 bg-[#868C96]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#868C96]/40">
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-400 mr-2 fill-current" />
                              <span className="text-white font-bold text-lg">{currentGym.rating}</span>
                            </div>
                          </div>

                          {/* Members count */}
                          <div className="absolute bottom-6 left-6 bg-[#868C96]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#868C96]/40">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-[#C15364] mr-2" />
                              <span className="text-white font-semibold">{currentGym.members}+ Members</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-xl border border-[#868C96]/20">
                            <Award className="w-8 h-8 text-[#C15364] mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{currentGym.rating}</div>
                            <div className="text-white/60 text-sm">Rating</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-xl border border-[#868C96]/20">
                            <Users className="w-8 h-8 text-[#868C96] mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{currentGym.members}+</div>
                            <div className="text-white/60 text-sm">Members</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-[#868C96]/20 to-[#868C96]/10 rounded-xl border border-[#868C96]/20">
                            <TrendingUp className="w-8 h-8 text-[#C15364] mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{currentGym.amenities.length}</div>
                            <div className="text-white/60 text-sm">Amenities</div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Details */}
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-5xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#C15364] group-hover:to-[#858B95] group-hover:bg-clip-text transition-all duration-500">
                            {currentGym.name}
                          </h3>
                          <div className="flex items-center text-white/70 text-xl mb-6">
                            <MapPin className="w-6 h-6 mr-3 text-[#C15364]" />
                            {currentGym.location}
                          </div>
                        </div>

                        {/* Programs */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold text-xl">Specialized Programs</h4>
                          <div className="flex flex-wrap gap-3">
                            {currentGym.programs.map((program, idx) => (
                              <div key={idx} className="group/program relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-full opacity-0 group-hover/program:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative px-6 py-3 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 border border-white/20 rounded-full text-white font-semibold backdrop-blur-sm group-hover/program:text-white transition-colors duration-300">
                                  {program}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Amenities Grid */}
                        <div className="space-y-4">
                          <h4 className="text-white font-bold text-xl">Premium Amenities</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {currentGym.amenities.map((amenity, idx) => (
                              <div key={idx} className="flex items-center p-4 bg-gradient-to-r from-[#868C96]/10 to-[#868C96]/20 rounded-xl border border-[#868C96]/20 backdrop-blur-sm group-hover:border-[#C15364]/30 transition-colors duration-300">
                                <span className="text-[#C15364] mr-4 text-xl">{amenityIcons[amenity]}</span>
                                <span className="text-white font-medium">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full py-6 bg-gradient-to-r from-[#C15364] via-[#C15364] to-[#858B95] text-white rounded-xl font-bold text-xl relative overflow-hidden group/btn transform hover:scale-105 transition-all duration-300 shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                          <div className="relative flex items-center justify-center">
                            <span className="mr-3">Explore This Gym</span>
                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Cards - Left and Right */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-80 opacity-60 hover:opacity-80 transition-all duration-500 transform hover:scale-105 rotate-y-15">
              <div className="bg-gradient-to-br from-[#868C96]/30 to-[#868C96]/40 backdrop-blur-xl border border-[#868C96]/30 rounded-2xl p-6 cursor-pointer" onClick={() => prevSlide()}>
                <div className="h-40 bg-gradient-to-br from-[#858B95]/20 to-[#C15364]/20 rounded-xl mb-4 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white/60" />
                </div>
                <h4 className="text-white font-bold mb-2">{prevGym.name}</h4>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-white/80 text-sm">{prevGym.rating}</span>
                </div>
                <div className="text-[#C15364] text-sm">{prevGym.highlight}</div>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-80 opacity-60 hover:opacity-80 transition-all duration-500 transform hover:scale-105 -rotate-y-15">
              <div className="bg-gradient-to-br from-[#868C96]/30 to-[#868C96]/40 backdrop-blur-xl border border-[#868C96]/30 rounded-2xl p-6 cursor-pointer" onClick={() => nextSlide()}>
                <div className="h-40 bg-gradient-to-br from-[#C15364]/20 to-[#858B95]/20 rounded-xl mb-4 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white/60" />
                </div>
                <h4 className="text-white font-bold mb-2">{nextGym.name}</h4>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                  <span className="text-white/80 text-sm">{nextGym.rating}</span>
                </div>
                <div className="text-[#858B95] text-sm">{nextGym.highlight}</div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-12 space-x-8">
            {/* Previous button */}
            <button 
              onClick={prevSlide}
              className="p-4 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-[#C15364]/50 transition-all duration-300 group"
            >
              <ChevronLeft className="w-8 h-8 text-white group-hover:text-[#C15364] group-hover:scale-110 transition-all duration-300" />
            </button>

            {/* Pagination dots */}
            <div className="flex space-x-3">
              {gyms.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentIndex 
                      ? 'w-12 h-4 bg-gradient-to-r from-[#C15364] to-[#858B95] shadow-lg' 
                      : 'w-4 h-4 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play toggle */}
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-4 bg-gradient-to-r from-[#858B95]/20 to-[#C15364]/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-[#858B95]/50 transition-all duration-300 group"
            >
              {isAutoPlaying ? 
                <Pause className="w-8 h-8 text-white group-hover:text-[#858B95] group-hover:scale-110 transition-all duration-300" /> :
                <Play className="w-8 h-8 text-white group-hover:text-[#858B95] group-hover:scale-110 transition-all duration-300" />
              }
            </button>

            {/* Next button */}
            <button 
              onClick={nextSlide}
              className="p-4 bg-gradient-to-r from-[#858B95]/20 to-[#C15364]/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-[#858B95]/50 transition-all duration-300 group"
            >
              <ChevronRight className="w-8 h-8 text-white group-hover:text-[#858B95] group-hover:scale-110 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymSection;