"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Dumbbell, Heart, Brain, Users, Calendar, MapPin, Play, Star, Menu, X, Trophy, Target, Zap, Activity, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const V21FitLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeProgram, setActiveProgram] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Trigger stats animation when scrolled to stats section
      if (window.scrollY > window.innerHeight * 0.5 && !statsAnimated) {
        setStatsAnimated(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [statsAnimated]);

  // Auto-rotate programs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProgram((prev) => (prev + 1) % programs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const programs = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Overall Health",
      time: "9-10 AM",
      description: "Comprehensive wellness sessions covering chronic illness prevention, mental health, and healthy living fundamentals.",
      color: "from-red-500 to-pink-600",
      participants: "45+",
      intensity: "Moderate"
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Weight & Fat Loss",
      time: "12-1 PM", 
      description: "High-intensity training and smart nutrition strategies to reduce body fat and increase lean muscle.",
      color: "from-blue-500 to-cyan-600",
      participants: "60+",
      intensity: "High"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Muscle Gain",
      time: "3-4 PM",
      description: "Structured resistance training with progressive overload techniques for building strength and mass.",
      color: "from-green-500 to-emerald-600",
      participants: "35+",
      intensity: "High"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Mental Fitness",
      time: "6-7 PM",
      description: "Mind-body wellness through movement, mindfulness, and community support for mental clarity.",
      color: "from-purple-500 to-indigo-600",
      participants: "25+",
      intensity: "Low-Moderate"
    }
  ];

  const stats = [
    { number: 500, label: "Active Members", icon: <Users className="w-6 h-6" /> },
    { number: 95, label: "Success Rate", suffix: "%", icon: <Trophy className="w-6 h-6" /> },
    { number: 1000, label: "Workouts Completed", suffix: "+", icon: <Activity className="w-6 h-6" /> },
    { number: 24, label: "Expert Trainers", icon: <Target className="w-6 h-6" /> }
  ];

  const features = [
    { text: "Personalized workout plans", icon: <Target className="w-5 h-5" /> },
    { text: "Expert nutrition coaching", icon: <Heart className="w-5 h-5" /> },
    { text: "Progress tracking system", icon: <Activity className="w-5 h-5" /> },
    { text: "Community support network", icon: <Users className="w-5 h-5" /> },
    { text: "Mental wellness programs", icon: <Brain className="w-5 h-5" /> },
    { text: "Flexible scheduling options", icon: <Clock className="w-5 h-5" /> }
  ];

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  delay?: number;
}

const AnimatedCounter = ({ end, duration = 2000, suffix = "", delay = 0 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!statsAnimated) return;
    
    const timer = setTimeout(() => {
      const increment = end / (duration / 16);
      let current = 0;
      const counter = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [end, duration, suffix, delay, statsAnimated]);

  return <span>{count}{suffix}</span>;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-x-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with pulsing animation */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Moving gradient lines */}
        <div className="absolute inset-0 border-r-black">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-red-500/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Animated Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <Image src="/logo1.png" alt="V21 Fit Logo" width={120} height={120}  />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Programs', 'Schedule', 'About'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="relative hover:text-red-400 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  Member Login
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </div>
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl mt-2 p-6 border border-gray-800/50">
              <div className="flex flex-col space-y-4">
                {['Programs', 'Schedule', 'About'].map((item, index) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`} 
                    className="hover:text-red-400 transition-all duration-300 py-2 border-b border-gray-800/50 last:border-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item}
                  </a>
                ))}
                <button className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full transform hover:scale-105 transition-all duration-300">
                  Member Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Video Background with enhanced overlay */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-pink-900/20"></div>
          
          {/* Animated overlay patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Enhanced Animated Title */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-500/30 backdrop-blur-sm">
                  <Zap className="w-4 h-4 mr-2 text-red-400" />
                  <span className="text-sm font-semibold text-red-300">Transform Your Life Today</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="block">
                    <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent animate-pulse">
                      Transform
                    </span>
                  </span>
                  <span className="block text-white drop-shadow-2xl">
                    Your Body &{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Mind
                    </span>
                  </span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                Empower Your Strength, Elevate Your Life with comprehensive fitness programs designed for{' '}
                <span className="text-red-400 font-semibold">your success</span>.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 flex items-center space-x-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Start Your Journey</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
              </button>
              
              <button className="group px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-500 flex items-center space-x-3 hover:scale-105 hover:-translate-y-1">
                <div className="relative">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-30"></div>
                </div>
                <span>Watch Our Story</span>
              </button>
            </div>

            {/* Animated Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.slice(0, 4).map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center mb-2 text-red-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} delay={index * 100} />
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Floating Fitness Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 animate-bounce delay-1000">
            <div className="p-3 bg-red-500/20 rounded-full backdrop-blur-sm">
              <Dumbbell className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="absolute top-1/3 right-10 animate-bounce delay-2000">
            <div className="p-3 bg-pink-500/20 rounded-full backdrop-blur-sm">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>
          <div className="absolute bottom-1/4 left-1/4 animate-bounce delay-3000">
            <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="absolute top-1/2 right-1/4 animate-bounce delay-4000">
            <div className="p-3 bg-green-500/20 rounded-full backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Programs Section */}
      <section id="programs" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-500/30 backdrop-blur-sm mb-6">
              <Target className="w-4 h-4 mr-2 text-red-400" />
              <span className="text-sm font-semibold text-red-300">Our Programs</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Comprehensive fitness programs designed to transform your body and elevate your mental wellness. 
              Each program targets specific goals with expert guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 border hover:border-gray-600/50 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${
                  activeProgram === index ? 'border-red-500/50 scale-105 -translate-y-2' : 'border-gray-700/50'
                }`}
                onMouseEnter={() => setActiveProgram(index)}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Program icon with enhanced animation */}
                <div className={`w-20 h-20 bg-gradient-to-br ${program.color} rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                  {program.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold group-hover:text-white transition-colors duration-300">{program.title}</h3>
                  
                  {/* Enhanced time and details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-red-400 font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>{program.time}</span>
                    </div>
                    <div className="text-sm text-gray-400">{program.participants} members</div>
                  </div>
                  
                  {/* Intensity indicator */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Intensity:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div 
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            (program.intensity === 'High' && level <= 3) ||
                            (program.intensity === 'Moderate' && level <= 2) ||
                            (program.intensity === 'Low-Moderate' && level <= 2)
                              ? 'bg-red-400' 
                              : 'bg-gray-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {program.description}
                  </p>
                  
                  {/* Join button */}
                  <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl font-semibold text-sm hover:from-red-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                    Join Program
                  </button>
                </div>
                
                {/* Hover effect particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Schedule Section */}
      <section id="schedule" className="py-24 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm mb-6">
              <Calendar className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Weekly Schedule</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your Fitness Journey
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Structured and organized path to your fitness goals with flexible timing options
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              {/* Enhanced Schedule Card */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500">
                <h3 className="text-3xl font-bold mb-8 flex items-center">
                  <Calendar className="w-8 h-8 mr-4 text-red-400" />
                  Monday - Friday Schedule
                </h3>
                <div className="space-y-4">
                  {programs.map((program, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center justify-between p-6 bg-gray-800/40 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center text-sm shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                          {program.icon}
                        </div>
                        <div>
                          <div className="font-bold text-lg group-hover:text-white transition-colors">{program.title}</div>
                          <div className="text-red-400 font-semibold">{program.time}</div>
                          <div className="text-sm text-gray-400">{program.participants} active members</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekend Sessions */}
              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 hover:border-red-500/50 transition-all duration-500">
                <h3 className="text-3xl font-bold mb-6 flex items-center">
                  <Users className="w-8 h-8 mr-4 text-red-400" />
                  Weekend Sessions
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-200 text-lg font-semibold">Saturday & Sunday: Personal Training Sessions</p>
                  <p className="text-gray-300 leading-relaxed">
                    Book your one-on-one sessions for personalized attention and accelerated results. 
                    Available slots from 8 AM to 8 PM.
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
                    Book Personal Session
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold mb-8 flex items-center">
                <Star className="w-8 h-8 mr-4 text-yellow-400" />
                Why Choose V21 Fit?
              </h3>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center space-x-4 p-6 bg-gray-800/40 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors text-lg">{feature.text}</span>
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
              
              {/* Enhanced CTA */}
              <div className="mt-12 p-8 bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-red-500/20">
                <h4 className="text-2xl font-bold mb-4">Ready to Start?</h4>
                <p className="text-gray-300 mb-6">Join our community of fitness enthusiasts and transform your life today.</p>
                <button className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink -600 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Join V21 Fit Today</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4 mr-2 text-green-400" />
              <span className="text-sm font-semibold text-green-300">About V21 Fit</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Empowering individuals to achieve their best physical and mental health through 
              comprehensive fitness programs and community support.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">
                  Transform Your Life with{' '}
                  <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                    V21 Fit
                  </span>
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  At V21 Fit, we believe fitness is more than just physical transformation. 
                  It's about building confidence, creating healthy habits, and fostering a 
                  supportive community that celebrates every victory, big or small.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Our expert trainers and comprehensive programs are designed to meet you 
                  where you are and guide you to where you want to be, whether that's 
                  losing weight, building muscle, improving mental health, or achieving 
                  overall wellness.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-white mb-6">Our Values</h4>
                <div className="space-y-4">
                  {[
                    { icon: <Heart className="w-5 h-5" />, title: "Holistic Wellness", desc: "Mind, body, and spirit in harmony" },
                    { icon: <Users className="w-5 h-5" />, title: "Community First", desc: "Supporting each other's journey" },
                    { icon: <Trophy className="w-5 h-5" />, title: "Excellence", desc: "Striving for your personal best" },
                    { icon: <Target className="w-5 h-5" />, title: "Results-Driven", desc: "Measurable progress every step" }
                  ].map((value, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/40 rounded-xl hover:bg-gray-800/60 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-red-400">
                        {value.icon}
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">{value.title}</h5>
                        <p className="text-gray-400 text-sm">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 text-center transform hover:scale-105"
                  >
                    <div className="flex justify-center mb-4 text-red-400">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">V21</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">V21 Fit</h3>
                  <p className="text-xs text-gray-400">Elevate Your Life</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transform your body and mind with our comprehensive fitness programs designed for lasting results.
              </p>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Programs</h4>
              <div className="space-y-3">
                {programs.map((program, index) => (
                  <a key={index} href="#" className="block text-gray-400 hover:text-red-400 transition-colors">
                    {program.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Schedule</h4>
              <div className="space-y-3 text-gray-400">
                <div>
                  <p className="font-semibold text-white">Monday - Friday</p>
                  <p>9:00 AM - 7:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Saturday - Sunday</p>
                  <p>8:00 AM - 8:00 PM</p>
                  <p className="text-sm">(Personal Training)</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>123 Fitness Street, Health City</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>info@v21fit.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 V21 Fit. All rights reserved. Elevate Your Life.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default V21FitLanding;