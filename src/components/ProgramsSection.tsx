// components/sections/ProgramsSection.tsx
import React, { useState } from 'react';
import { X, Clock, Award, MapPin, CheckCircle, ShoppingCart } from 'lucide-react';
import { AnimatedCard } from './shared/index';
import { GlassCard } from './shared/index';


export const ProgramsSection: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const programs: Program[] = [
    {
      id: 1,
      title: "Fat Loss Program",
      description: "Train Smarter. Burn Fat. Transform Your Body.",
      features: ["Personalized workout plans", "High-intensity training", "Nutritional guidance", "Progress tracking"],
      price: "$49/month",
      mentor: "Sarah Johnson",
      mentorBio: "Certified personal trainer with 8+ years experience",
      duration: "12 weeks",
      gyms: ["Downtown Fitness", "Uptown Wellness", "City Center Gym"]
    },
    {
      id: 2,
      title: "Muscle Gain Program",  
      description: "Build Strength. Gain Mass. Reach Your Peak.",
      features: ["Customized strength training", "Expert guidance", "Nutritional coaching", "Recovery strategies"],
      price: "$59/month",
      mentor: "Mike Rodriguez",
      mentorBio: "Professional bodybuilder and nutrition specialist",
      duration: "16 weeks",
      gyms: ["Power House Gym", "Iron Paradise", "Strength Zone"]
    },
    {
      id: 3,
      title: "Mental Fitness",
      description: "Strong Mind. Strong Body. Balanced Life.",
      features: ["Mood enhancement workouts", "Mindfulness techniques", "Group training support", "Educational resources"],
      price: "$39/month",
      mentor: "Dr. Lisa Chen",
      mentorBio: "Sports psychologist and wellness coach",
      duration: "8 weeks",
      gyms: ["Zen Fitness", "Mindful Movement", "Harmony Health"]
    }
  ];

  const handleProgramClick = (program: Program): void => {
    setSelectedProgram(program);
  };

  const closeProgramModal = (): void => {
    setSelectedProgram(null);
  };

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-[#858B95]/5 to-[#C15364]/5">
      <div className="container mx-auto px-6">
        <AnimatedCard>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Programs</h2>
            <p className="text-xl text-[#858B95]">Comprehensive fitness solutions tailored to your goals</p>
          </div>
        </AnimatedCard>

        {/* Program Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {programs.map((program, index) => (
            <AnimatedCard key={program.id} delay={index * 150}>
              <GlassCard 
                className="p-6 bg-white/80 group cursor-pointer" 
                onClick={() => handleProgramClick(program)}
              >
                <div className="h-2 bg-gradient-to-r from-[#C15364] to-[#858B95] rounded-t-xl mb-4 group-hover:h-4 transition-all duration-300"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{program.title}</h3>
                <p className="text-[#C15364] font-semibold mb-4">{program.description}</p>
                <div className="text-3xl font-bold text-[#858B95] mb-4">{program.price}</div>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[#858B95]">
                      <CheckCircle className="w-4 h-4 text-[#C15364] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    View Details
                  </button>
                  <button className="px-4 py-3 bg-white/50 border border-[#C15364]/30 text-[#C15364] rounded-lg hover:bg-[#C15364]/10 transition-all duration-300">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>

        {/* Program Details Modal */}
        {selectedProgram && (
          <AnimatedCard>
            <GlassCard className="max-w-4xl mx-auto p-8 bg-white/90">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedProgram.title}</h3>
                  <p className="text-[#C15364] text-lg">{selectedProgram.description}</p>
                </div>
                <button 
                  onClick={closeProgramModal}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-xl mb-4 text-gray-800">Program Details</h4>
                  <div className="space-y-3 mb-6">
                    <p className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-[#C15364]" /> 
                      Duration: {selectedProgram.duration}
                    </p>
                    <p className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#C15364]" /> 
                      Mentor: {selectedProgram.mentor}
                    </p>
                    <p className="text-[#858B95]">{selectedProgram.mentorBio}</p>
                  </div>
                  
                  <h4 className="font-bold text-xl mb-4 text-gray-800">Available Gyms</h4>
                  <ul className="space-y-2">
                    {selectedProgram.gyms.map((gym, idx) => (
                      <li key={idx} className="flex items-center text-[#858B95]">
                        <MapPin className="w-4 h-4 mr-2 text-[#C15364]" />
                        {gym}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="bg-gradient-to-br from-[#C15364]/10 to-[#858B95]/10 p-6 rounded-xl">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-[#C15364] mb-2">{selectedProgram.price}</div>
                      <p className="text-[#858B95]">Start your transformation today</p>
                    </div>
                    <button className="w-full py-4 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold text-lg">
                      Purchase Program
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>
        )}
      </div>
    </section>
  );
};