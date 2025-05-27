// components/sections/HeroSection.tsx
import React from 'react';
import { AnimatedCard } from './AnimatedCard';

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-[#C15364]/10 via-white to-[#858B95]/10 relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedCard delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
              Transform Your
              <span className="block bg-gradient-to-r from-[#C15364] to-[#858B95] bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
          </AnimatedCard>
          
          <AnimatedCard delay={400}>
            <p className="text-xl text-[#858B95] mb-8 max-w-2xl mx-auto">
              Experience comprehensive fitness programs designed for fat loss, muscle gain, and mental wellness. 
              Join our community and unlock your full potential.
            </p>
          </AnimatedCard>
          
          <AnimatedCard delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg font-semibold">
                Start Your Journey
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-[#858B95] rounded-full hover:bg-white/30 transition-all duration-300 text-lg font-semibold">
                Explore Programs
              </button>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};