"use client";
import React from 'react';

import {HeroSection} from '../components/HeroSection';
import {ScheduleSection} from '../components/ScheduleSection';
import ProgramsSection from '../components/ProgramsSection';
import GymSection from '../components/GymSection';

import CTASection from '../components/CTASection';



const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
    
      <HeroSection />
      <ScheduleSection />
      <ProgramsSection />
      <GymSection />
      
      <CTASection />
  
      
      
    </div>
  );
};

export default HomePage;