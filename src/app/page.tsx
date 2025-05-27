"use client";
import React from 'react';
import Header from '../components/Header';
import {HeroSection} from '../components/HeroSection';
import {ScheduleSection} from '../components/ScheduleSection';
import {ProgramsSection} from '../components/ProgramsSection';
import GymSection from '../components/GymSection';

import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import Profile from '@/components/profile/Profile';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ScheduleSection />
      <ProgramsSection />
      <GymSection />
      
      <CTASection />
      <Footer />
      <Profile />
      
    </div>
  );
};

export default HomePage;