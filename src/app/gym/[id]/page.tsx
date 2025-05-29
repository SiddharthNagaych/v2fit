"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Users, Dumbbell, Wifi, Car, ShowerHead, Clock } from 'lucide-react';
import Image from 'next/image';

// Define TypeScript interfaces for the gym data
interface GymData {
  _id: string;
  name: string;
  location: string;
  amenities: string[];
  images: string[];
  rating: number;
  programs: string[];
  highlight?: string;
  members: number;
}

interface AmenityIcons {
  [key: string]: React.ReactNode;
}

export default function Gym() {
  const { id } = useParams();
  const [gymData, setGymData] = useState<GymData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/gymId/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch gym: ${res.status}`);
        }
        
        const data: GymData = await res.json();
        setGymData(data);
      } catch (error) {
        console.error('Error fetching gym data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGym();
  }, [id]);

  const amenityIcons: AmenityIcons = {
    "WiFi": <Wifi className="w-5 h-5" />,
    "Parking": <Car className="w-5 h-5" />,
    "Showers": <ShowerHead className="w-5 h-5" />,
    "24/7 Access": <Clock className="w-5 h-5" />,
    "Modern Equipment": <Dumbbell className="w-5 h-5" />,
    "Personal Training": <Users className="w-5 h-5" />,
    "Group Classes": <Users className="w-5 h-5" />,
    "Cardio Zone": <Dumbbell className="w-5 h-5" />,
    "Free Weights": <Dumbbell className="w-5 h-5" />,
    "Olympic Equipment": <Dumbbell className="w-5 h-5" />,
    "Recovery Zone": <Dumbbell className="w-5 h-5" />,
    "Yoga Studio": <Dumbbell className="w-5 h-5" />,
    "Meditation Room": <Dumbbell className="w-5 h-5" />,
    "Spa Services": <Dumbbell className="w-5 h-5" />,
    "Heavy Weights": <Dumbbell className="w-5 h-5" />,
    "CrossFit Box": <Dumbbell className="w-5 h-5" />,
    "Battle Ropes": <Dumbbell className="w-5 h-5" />,
    "Tire Flipping Area": <Dumbbell className="w-5 h-5" />
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gradient-to-r from-[#C15364] to-[#868B96]"></div>
      </div>
    );
  }

  if (!gymData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-xl">Gym not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10"></div>
        <Image
          src={gymData.images[selectedImage]} 
          alt={gymData.name}
          className="w-full h-full object-cover transition-all duration-500"
          loading="lazy"
          height={400}
          width={300}
        />
        
        {/* Highlight Badge */}
        {gymData.highlight && (
          <div className="absolute top-6 left-6 z-20">
            <span className="bg-gradient-to-r from-[#C15364] to-[#868B96] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {gymData.highlight}
            </span>
          </div>
        )}

        {/* Main Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {gymData.name}
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-5 h-5 text-[#C15364]" />
              <span className="text-gray-300">{gymData.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">{gymData.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-5 h-5 text-[#868B96]" />
              <span className="text-gray-300">{gymData.members.toLocaleString()} members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Thumbnails */}
      <div className="px-6 py-4 bg-gray-900/50">
        <div className="flex space-x-3 overflow-x-auto">
          {gymData.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === index 
                  ? 'border-[#C15364] shadow-lg shadow-[#C15364]/30' 
                  : 'border-gray-600 hover:border-[#868B96]'
              }`}
            >
              <Image
                src={image} 
                alt={`View ${index + 1}`} 
                className="w-full h-full object-cover" 
                loading="lazy"
                height={400}  
                width={300}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Programs Section */}
        <div className="bg-gray-900/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Dumbbell className="w-6 h-6 mr-3 text-[#C15364]" />
            Programs & Training
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gymData.programs.map((program, index) => (
              <div key={index} className="bg-gradient-to-r from-[#C15364]/20 to-[#868B96]/20 rounded-xl p-4 border border-gray-700 hover:border-[#C15364]/50 transition-all duration-300">
                <h3 className="font-semibold text-lg text-white mb-2">{program}</h3>
                <p className="text-gray-400 text-sm">Professional training program designed for all fitness levels</p>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="bg-gray-900/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Amenities & Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gymData.amenities.map((amenity, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl hover:from-[#C15364]/20 hover:to-[#868B96]/20 transition-all duration-300 border border-gray-700 hover:border-[#C15364]/30">
                <div className="text-[#C15364] mb-2">
                  {amenityIcons[amenity] || <Dumbbell className="w-5 h-5" />}
                </div>
                <span className="text-sm text-center font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#C15364]/20 to-[#C15364]/10 rounded-2xl p-6 text-center border border-[#C15364]/30">
            <div className="text-3xl font-bold text-[#C15364] mb-2">{gymData.rating}</div>
            <div className="text-gray-300">Average Rating</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(gymData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#868B96]/20 to-[#868B96]/10 rounded-2xl p-6 text-center border border-[#868B96]/30">
            <div className="text-3xl font-bold text-[#868B96] mb-2">{gymData.members.toLocaleString()}</div>
            <div className="text-gray-300">Active Members</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl p-6 text-center border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400 mb-2">{gymData.programs.length}</div>
            <div className="text-gray-300">Training Programs</div>
          </div>
        </div>

      </div>
    </div>
  );
}