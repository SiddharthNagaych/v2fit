import React, { useState } from 'react';
import { Calendar, Clock, Users, Dumbbell, Brain, Star, ChevronLeft, ChevronRight, CheckCircle, User, Plus, MapPin, Video, Phone } from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  endTime: string;
  session: string;
  icon: React.ReactNode;
  trainer?: string;
  capacity?: number;
  booked?: number;
  type: 'in-person' | 'virtual' | 'hybrid';
  location?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
}

export const ScheduleSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const currentDate = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const scheduleData: ScheduleItem[] = [
    { 
      id: '1',
      time: "09:00",
      endTime: "10:00",
      session: "Overall Health Session", 
      icon: <Star className="w-4 h-4" />,
      trainer: "Dr. Sarah Johnson",
      capacity: 15,
      booked: 8,
      type: 'in-person',
      location: 'Studio A'
    },
    { 
      id: '2',
      time: "12:00",
      endTime: "13:00",
      session: "Weight & Fat Loss", 
      icon: <Dumbbell className="w-4 h-4" />,
      trainer: "Mike Peterson",
      capacity: 10,
      booked: 6,
      type: 'hybrid',
      location: 'Studio B'
    },
    { 
      id: '3',
      time: "15:00",
      endTime: "16:00",
      session: "Weight & Muscle Gain", 
      icon: <Users className="w-4 h-4" />,
      trainer: "Alex Rodriguez",
      capacity: 8,
      booked: 8,
      type: 'in-person',
      location: 'Gym Floor'
    },
    { 
      id: '4',
      time: "18:00",
      endTime: "19:00",
      session: "Mental Fitness", 
      icon: <Brain className="w-4 h-4" />,
      trainer: "Lisa Chen",
      capacity: 12,
      booked: 4,
      type: 'virtual',
      location: 'Online'
    }
  ];

  const generateCalendarDays = (): CalendarDay[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
  
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        date: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === currentDate.toDateString(),
        hasEvents: date.getMonth() === month && Math.random() > 0.6
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual': return <Video className="w-4 h-4" />;
      case 'hybrid': return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const ratio = booked / capacity;
    if (ratio >= 1) return 'text-red-500';
    if (ratio >= 0.8) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#C15364]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C15364]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-[#C15364] to-gray-300 bg-clip-text text-transparent mb-6">
            Your Fitness Calendar
          </h2>
          <p className="text-2xl text-gray-300/80 max-w-3xl mx-auto">
            Book personalized sessions that fit your schedule perfectly
          </p>
        </div>

        {/* Main Calendar Container */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 overflow-hidden shadow-2xl">
                
                {/* Calendar Header */}
                <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-[#C15364]/10 to-gray-300/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-2xl font-bold text-white">
                        {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewMode('calendar')}
                          className={`px-4 py-2 rounded-xl transition-all ${
                            viewMode === 'calendar' 
                              ? 'bg-[#C15364] text-white' 
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-4 py-2 rounded-xl transition-all ${
                            viewMode === 'list' 
                              ? 'bg-[#C15364] text-white' 
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-[#C15364] hover:text-white transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-[#C15364] hover:text-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                {viewMode === 'calendar' && (
                  <div className="p-6">
                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {daysOfWeek.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, index) => (
                        <button
                          key={index}
                          className={`
                            relative p-3 h-16 rounded-xl transition-all duration-200 text-sm font-medium
                            ${day.isCurrentMonth 
                              ? day.isToday
                                ? 'bg-[#C15364] text-white shadow-lg'
                                : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50'
                              : 'text-gray-600 hover:bg-gray-800/20'
                            }
                            ${day.hasEvents ? 'ring-2 ring-[#C15364]/30' : ''}
                          `}
                        >
                          <span>{day.date}</span>
                          {day.hasEvents && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#C15364] rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="p-6 space-y-4">
                    {scheduleData.map((session) => (
                      <div
                        key={session.id}
                        className={`
                          p-4 rounded-xl border transition-all cursor-pointer
                          ${selectedSession === session.id
                            ? 'border-[#C15364] bg-[#C15364]/10'
                            : 'border-gray-800/50 bg-gray-800/20 hover:border-gray-700/50'
                          }
                        `}
                        onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-[#C15364] to-gray-300 rounded-xl">
                              {session.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{session.session}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{formatTime(session.time)} - {formatTime(session.endTime)}</span>
                                <span>•</span>
                                <span>{session.trainer}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm">
                              {getTypeIcon(session.type)}
                              <span className="text-gray-400">{session.location}</span>
                            </div>
                            <div className={`text-sm font-medium ${getAvailabilityColor(session.booked || 0, session.capacity || 0)}`}>
                              {session.booked}/{session.capacity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-gradient-to-r from-[#C15364] to-gray-300 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 font-semibold">
                    <Plus className="w-5 h-5" />
                    <span>Book New Session</span>
                  </button>
                  
                  <button className="w-full p-4 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>View All Bookings</span>
                  </button>
                </div>
              </div>

              {/* Today's Sessions */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Today&apos;s Schedule</h3>
                <div className="space-y-4">
                  {scheduleData.slice(0, 2).map((session) => (
                    <div key={session.id} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-[#C15364]/20 rounded-lg">
                          {session.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm">{session.session}</h4>
                          <p className="text-xs text-gray-400">{formatTime(session.time)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{session.trainer}</span>
                        <span className={getAvailabilityColor(session.booked || 0, session.capacity || 0)}>
                          {session.booked}/{session.capacity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Stats */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">This Week</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sessions Booked</span>
                    <span className="text-[#C15364] font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hours Trained</span>
                    <span className="text-[#C15364] font-bold">8.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Streak Days</span>
                    <span className="text-[#C15364] font-bold">5</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Selected Session Details */}
          {selectedSession && (
            <div className="mt-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
              {scheduleData.filter(s => s.id === selectedSession).map((session) => (
                <div key={session.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-6">{session.session}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Clock className="w-5 h-5 text-[#C15364]" />
                        <span>{formatTime(session.time)} - {formatTime(session.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <User className="w-5 h-5 text-[#C15364]" />
                        <span>{session.trainer}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        {getTypeIcon(session.type)}
                        <span className="text-[#C15364]">{session.location}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Users className="w-5 h-5 text-[#C15364]" />
                        <span>{session.booked}/{session.capacity} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h4 className="text-xl font-bold text-white mb-4">Ready to Join?</h4>
                    <p className="text-gray-300 mb-6">
                      Secure your spot in this high-energy session. Limited spaces available!
                    </p>
                    <button 
                      className={`
                        w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300
                        ${(session.booked || 0) >= (session.capacity || 0)
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#C15364] to-gray-300 text-white hover:shadow-2xl hover:scale-105'
                        }
                      `}
                      disabled={(session.booked || 0) >= (session.capacity || 0)}
                    >
                      <CheckCircle className="w-6 h-6" />
                      <span>
                        {(session.booked || 0) >= (session.capacity || 0) ? 'Session Full' : 'Book Now'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};