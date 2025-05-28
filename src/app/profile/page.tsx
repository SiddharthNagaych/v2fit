"use client";
import {   useEffect, useState } from "react";
import { User, Mail, BadgeCheck, Dumbbell, CreditCard, Calendar, Trophy, TrendingUp, Settings, Edit2, Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
  totalSpent: number;
  activePlans: number;
  purchases: {
    id: string;
    title: string;
    level: string;
    price: number;
    purchasedAt: string;
    status: string;
    expiresAt?: string;
  }[];
  payments: {
    id: string;
    paymentId: string;
    amount: number;
    createdAt: string;
    status: string;
    method: string;
  }[];
}

export default function ProfilePage() {

  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const router=useRouter();

  useEffect(() => {
    if(status === "loading") return;
    if (!session) {
      router.push("/auth/Sign-In");
      return;
    }
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C15364] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-[#C15364] to-[#868B96] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">No profile data found</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "purchases", label: "My Plans", icon: Dumbbell },
    { id: "payments", label: "Payment History", icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-[#C15364] object-cover"
                loading="lazy"
                height={200}
                width={200}
              />
              <button className="absolute bottom-0 right-0 bg-[#C15364] p-2 rounded-full hover:bg-[#C15364]/80 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeCheck className="w-4 h-4 text-green-400" />
                  <span>{profile.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button className="bg-gradient-to-r from-[#C15364] to-[#868B96] px-6 py-2 rounded-lg hover:opacity-80 transition-opacity flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-[#C15364]">₹{profile.totalSpent}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#C15364]" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Plans</p>
                <p className="text-2xl font-bold text-green-400">{profile.activePlans}</p>
              </div>
              <Dumbbell className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Math.floor((Date.now() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                </p>
              </div>
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-800">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#C15364] text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Account Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Profile Information</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Full Name:</span>
                            <span>{profile.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email:</span>
                            <span>{profile.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Membership:</span>
                            <span className="text-green-400">{profile.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Quick Stats</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Total Purchases:</span>
                            <span>{profile.purchases.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Payments:</span>
                            <span>{profile.payments.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Account Status:</span>
                            <span className="text-green-400">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "purchases" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">My Fitness Plans</h3>
                  <span className="text-sm text-gray-400">{profile.purchases.length} plans</span>
                </div>
                <div className="space-y-4">
                  {profile.purchases.map((purchase) => (
                    <div key={purchase.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div className="bg-[#C15364]/20 p-3 rounded-lg">
                            <Dumbbell className="w-6 h-6 text-[#C15364]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-lg">{purchase.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>Level: {purchase.level}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                purchase.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-600/20 text-gray-400'
                              }`}>
                                {purchase.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              <p>Purchased: {new Date(purchase.purchasedAt).toLocaleDateString()}</p>
                              {purchase.expiresAt && (
                                <p>Expires: {new Date(purchase.expiresAt).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#C15364]">₹{purchase.price.toLocaleString()}</p>
                          {purchase.status === 'Active' && (
                            <button className="mt-2 px-4 py-2 bg-gradient-to-r from-[#C15364] to-[#868B96] text-white text-sm rounded-lg hover:opacity-80 transition-opacity">
                              Manage Plan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Payment History</h3>
                  <span className="text-sm text-gray-400">{profile.payments.length} transactions</span>
                </div>
                <div className="space-y-4">
                  {profile.payments.map((payment) => (
                    <div key={payment.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-500/20 p-3 rounded-lg">
                            <CreditCard className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">Payment #{payment.paymentId}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                              <span>{payment.method}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === 'Success' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-400">₹{payment.amount.toLocaleString()}</p>
                          <button className="mt-1 text-sm text-gray-400 hover:text-white transition-colors">
                            Download Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}