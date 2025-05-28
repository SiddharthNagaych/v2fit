"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/Sign-In");
      return;
    }

    const fetchPurchaseStatus = async () => {
      try {
        const res = await fetch("/api/user/purchase-status");
        const data = await res.json();
        setHasPurchased(data.hasPurchased);
      } catch (err) {
        console.error("Failed to fetch purchase status", err);
      }
    };

    fetchPurchaseStatus();
  }, [session, status, router]);

  // Enhanced Loading State
  if (hasPurchased === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C15364] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  // No Purchase State - Enhanced Design
  if (!hasPurchased) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-[#C15364] to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your Journey Awaits
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your life with structured programs designed for your success
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-[#C15364]/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#C15364]/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#C15364]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Schedule</h3>
              <p className="text-gray-400">Get a custom schedule tailored to your goals and lifestyle</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-[#C15364]/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Progress Tracking</h3>
              <p className="text-gray-400">Monitor your achievements and stay motivated with detailed insights</p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-[#C15364]/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Flexible Timing</h3>
              <p className="text-gray-400">Adapt your schedule to fit your busy life and commitments</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-gray-600/50">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Transformation?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Purchase a program to unlock your personalized schedule and begin your journey to success
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#C15364] to-[#a84454] hover:from-[#a84454] hover:to-[#C15364] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              <span>Browse Programs</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Motivational Quote */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C15364]/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-800/20 backdrop-blur-sm rounded-2xl p-8 border border-[#C15364]/20">
              <blockquote className="text-xl md:text-2xl font-medium text-white mb-4">
                &apos;Success is the sum of small efforts repeated day in and day out.&apos;
              </blockquote>
              <cite className="text-[#C15364] font-semibold">- Robert Collier</cite>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Purchased State - Enhanced Schedule View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Schedule
              </h1>
              <p className="text-gray-400 mt-2">Welcome back! Here&apos;s your personalized program schedule.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-[#C15364]/20 border border-[#C15364]/50 rounded-lg hover:bg-[#C15364]/30 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">5 Sessions</p>
              </div>
              <div className="w-12 h-12 bg-[#C15364]/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C15364]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">12/15</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Streak</p>
                <p className="text-2xl font-bold text-white">7 Days</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Next Session</p>
                <p className="text-2xl font-bold text-white">Today</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Today&apos;s Schedule</h2>
              
              {/* Placeholder for today's sessions */}
              <div className="space-y-4">
                {[
                  { time: "9:00 AM", title: "Morning Workout", type: "Fitness", status: "upcoming" },
                  { time: "2:00 PM", title: "Mindfulness Session", type: "Wellness", status: "completed" },
                  { time: "6:00 PM", title: "Evening Review", type: "Planning", status: "upcoming" }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${session.status === 'completed' ? 'bg-green-400' : 'bg-[#C15364]'}`}></div>
                      <div>
                        <h3 className="font-semibold text-white">{session.title}</h3>
                        <p className="text-sm text-gray-400">{session.time} • {session.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.status === 'completed' ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Completed</span>
                      ) : (
                        <button className="px-4 py-2 bg-[#C15364] hover:bg-[#a84454] rounded-lg text-sm font-medium transition-colors">
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Chart */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Weekly Progress</h3>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm w-8">{day}</span>
                    <div className="flex-1 mx-3 bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#C15364] to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-8 text-right">{Math.floor(Math.random() * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Upcoming</h3>
              <div className="space-y-3">
                {[
                  { day: "Tomorrow", session: "Core Strength", time: "9:00 AM" },
                  { day: "Friday", session: "Meditation", time: "7:00 PM" },
                  { day: "Saturday", session: "Full Body", time: "10:00 AM" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/20 rounded-lg">
                    <div className="w-2 h-2 bg-[#C15364] rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.session}</p>
                      <p className="text-gray-400 text-xs">{item.day} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}