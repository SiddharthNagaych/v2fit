import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,

  Activity,
  Target,
  Award,
  TrendingUp,
  Dumbbell,
  BarChart2,
} from "lucide-react";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
}

export default function ScheduleSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  const currentDate = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const fitnessProgressMessages = [
    {
      title: "Track Your Transformation",
      content:
        "Are you seeing the results you want? Consistent tracking is key to measuring your real progress.",
      icon: <TrendingUp className="w-6 h-6 text-[#C15364]" />,
    },
    {
      title: "Programs That Deliver Results",
      content:
        "Are you following the right program for your goals? The best routines are tailored to your specific needs.",
      icon: <Dumbbell className="w-6 h-6 text-[#C15364]" />,
    },
    {
      title: "Progress Over Perfection",
      content:
        "Are you celebrating small wins? Every workout brings you closer to your ultimate fitness vision.",
      icon: <BarChart2 className="w-6 h-6 text-[#C15364]" />,
    },
  ];

  const resultsChecklist = [
    "Are you stronger than last month?",
    "Can you do more reps than before?",
    "Is your endurance improving?",
    "Are you recovering faster?",
    "Do you feel more energetic?",
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        hasEvents: date.getMonth() === month && Math.random() > 0.7,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <section className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Your Calendar</h2>
          <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
            Are you getting the best schedule for your fitness journey?
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content Grid - Adjusted gap */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* Calendar Section */}
            <div
              className={`transition-all duration-1000 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
            >
              <div className="bg-gray-900 rounded-2xl lg:rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
                {/* Calendar Header */}
                <div className="p-4 lg:p-6 border-b border-gray-800 bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl lg:text-2xl font-bold text-white">
                        {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                      </h3>
                      <Calendar className="w-5 lg:w-6 h-5 lg:h-6 text-[#C15364]" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth("prev")}
                        className="p-2 lg:p-3 rounded-lg bg-[#C15364] text-white hover:bg-[#a04352] transition-all"
                      >
                        <ChevronLeft className="w-4 lg:w-5 h-4 lg:h-5" />
                      </button>
                      <button
                        onClick={() => navigateMonth("next")}
                        className="p-2 lg:p-3 rounded-lg bg-[#C15364] text-white hover:bg-[#a04352] transition-all"
                      >
                        <ChevronRight className="w-4 lg:w-5 h-4 lg:h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4 lg:p-6">
                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-xs lg:text-sm font-medium text-gray-400"
                      >
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
                          relative p-2 h-12 lg:h-14 rounded-lg transition-all duration-200 text-xs lg:text-sm font-medium
                          ${
                            day.isCurrentMonth
                              ? day.isToday
                                ? "bg-[#C15364] text-white shadow-lg"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              : "text-gray-600 hover:bg-gray-800"
                          }
                          ${day.hasEvents ? "ring-1 lg:ring-2 ring-[#C15364]" : ""}
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
              </div>
            </div>

            {/* Sidebar Content - Adjusted spacing */}
            <div
              className={`transition-all duration-1000 delay-300 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
            >
              <div className="space-y-4 sticky top-4">
                {/* Progress Tracking Section */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-[#C15364]" />
                    <h3 className="text-lg font-bold text-white">Are You Getting Results?</h3>
                  </div>

                  <div className="space-y-3">
                    {fitnessProgressMessages.map((message, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">{message.icon}</div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{message.title}</h4>
                          <p className="text-gray-300 text-xs">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results Checklist */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-[#C15364]" />
                    <h3 className="text-lg font-bold text-white">Measure Your Progress</h3>
                  </div>

                  <ul className="space-y-2">
                    {resultsChecklist.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#C15364]"></div>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Program Effectiveness */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-6 h-6 text-[#C15364]" />
                    <h3 className="text-lg font-bold text-white">Is Your Program Working?</h3>
                  </div>

                  <p className="text-gray-300 mb-3 text-sm">
                    The right program should challenge you while matching your goals. Are you:
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                      Getting stronger
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                      Building endurance
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                      Losing fat
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                      Gaining muscle
                    </span>
                  </div>

                  <p className="text-xs text-[#C15364] font-medium">
                    Track your metrics monthly to ensure your program is delivering your desired results!
                  </p>
                </div>
              </div>
            </div>
          </div>

       
        </div>
      </div>
    </section>
  );
}