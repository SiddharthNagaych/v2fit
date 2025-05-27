// components/sections/ScheduleSection.tsx
import React, { useState } from 'react';
import { Calendar, Clock, Users, Dumbbell, Brain, Star, ChevronLeft, ChevronRight, CheckCircle, User } from 'lucide-react';
import { AnimatedCard, GlassCard } from './shared/index';

interface ScheduleItem {
  time: string;
  session: string;
  icon: React.ReactNode;
  trainer?: string;
  capacity?: number;
}

export const ScheduleSection: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0 = Monday
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const scheduleData: ScheduleItem[] = [
    { 
      time: "9:00 - 10:00 AM", 
      session: "Overall Health Session", 
      icon: <Star className="w-5 h-5 text-white" />,
      trainer: "Dr. Sarah Johnson",
      capacity: 15
    },
    { 
      time: "12:00 - 1:00 PM", 
      session: "Weight & Fat Loss", 
      icon: <Dumbbell className="w-5 h-5 text-white" />,
      trainer: "Mike Peterson",
      capacity: 10
    },
    { 
      time: "3:00 - 4:00 PM", 
      session: "Weight & Muscle Gain", 
      icon: <Users className="w-5 h-5 text-white" />,
      trainer: "Alex Rodriguez",
      capacity: 8
    },
    { 
      time: "6:00 - 7:00 PM", 
      session: "Mental Fitness", 
      icon: <Brain className="w-5 h-5 text-white" />,
      trainer: "Lisa Chen",
      capacity: 12
    }
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time === selectedTime ? null : time);
  };

  const handleDayChange = (direction: 'prev' | 'next') => {
    setSelectedDay(prev => {
      if (direction === 'prev') return prev === 0 ? 6 : prev - 1;
      return prev === 6 ? 0 : prev + 1;
    });
    setSelectedTime(null);
  };

  return (
    <section id="schedule" className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
      <div className="container mx-auto px-6">
        <AnimatedCard>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Personalized Schedule</h2>
            <p className="text-xl text-[#858B95]">Book sessions at your convenience</p>
          </div>
        </AnimatedCard>

        {/* Calendar Navigation */}
        <AnimatedCard delay={100}>
          <GlassCard className="p-6 mb-8 bg-gradient-to-br from-white/90 to-white/70">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => handleDayChange('prev')}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-[#C15364]" />
              </button>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">{daysOfWeek[selectedDay]}</h3>
                <p className="text-[#858B95] flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {selectedDay < 5 ? "Weekday Session" : "Weekend Session"}
                </p>
              </div>
              
              <button 
                onClick={() => handleDayChange('next')}
                className="p-2 rounded-full hover:bg-white/50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-[#C15364]" />
              </button>
            </div>

            {/* Time Slot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scheduleData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(item.time)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    selectedTime === item.time
                      ? 'bg-gradient-to-br from-[#C15364] to-[#858B95] text-white'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#C15364] to-[#858B95] rounded-lg mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{item.time}</p>
                      <p className="text-sm">{item.session}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </AnimatedCard>

        {/* Selected Session Details */}
        {selectedTime && (
          <AnimatedCard delay={200}>
            <GlassCard className="p-8 bg-gradient-to-br from-white/90 to-white/70">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Session Details</h3>
                  {scheduleData.filter(item => item.time === selectedTime).map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center mb-4">
                        <Clock className="w-5 h-5 text-[#C15364] mr-3" />
                        <span className="font-medium">{item.time}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <Dumbbell className="w-5 h-5 text-[#C15364] mr-3" />
                        <span className="font-medium">{item.session}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-[#C15364] mr-3" />
                        <span className="font-medium">Trainer: {item.trainer}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-[#C15364] mr-3" />
                        <span className="font-medium">Capacity: {item.capacity} people</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Book Your Spot</h3>
                  <p className="text-[#858B95] mb-6">
                    Select this time slot to reserve your spot for the session. 
                    You'll receive a confirmation email with all the details.
                  </p>
                  <button className="w-full py-4 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Confirm Booking
                  </button>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* Weekend Notice */}
        <AnimatedCard delay={300}>
          <div className="text-center mt-12">
            <GlassCard className="inline-block bg-gradient-to-r from-[#C15364]/10 to-[#858B95]/10 px-8 py-4 rounded-xl">
              <p className="text-lg text-[#858B95]">
                <Calendar className="w-5 h-5 inline mr-2" />
                <span className="font-medium">Weekend Special:</span> Custom personal training sessions available
              </p>
            </GlassCard>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};