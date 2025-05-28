"use client";
import React, { useEffect, useState } from 'react';
import { MapPin, Star, Users, Dumbbell, Wifi, Car, Waves, Heart } from 'lucide-react';
import Image from 'next/image';

interface Gym {
  id: string;
  name: string;
  location: string;
  amenities: string[];
  images: string[];
  rating: number;
  programs: string[];
  highlight: string;
  members: number;
}

const amenityIcons = {
  "Swimming Pool": Waves,
  "Wi-Fi": Wifi,
  "Parking": Car,
  "Free Parking": Car,
  "Personal Training": Dumbbell,
  "Sauna": Heart,
  "Steam Room": Heart,
  "24/7 Access": Heart,
  "Group Classes": Users,
  "Heavy Lifting Area": Dumbbell,
  "Yoga Studio": Heart,
  "Sports Courts": Dumbbell
};

export default function GymSectionPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/gym');
        if (!res.ok) throw new Error('Failed to fetch gyms');
        const data = await res.json();
        
        setGyms(data);
      } catch (err) {
        console.error('Failed to fetch gyms', err);
        setError(err instanceof Error ? err.message : 'Failed to load gyms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C15364] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading gyms...</p>
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  const GymCard = ({ gym }: { gym: Gym }) => {
    const IconComponent = amenityIcons[gym.amenities[0] as keyof typeof amenityIcons] || Dumbbell;
    
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-[#C15364]/50 transition-all duration-300 group">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={gym.images[0]} 
            alt={gym.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            height={400}
            width={300}
          />
          <div className="absolute top-4 right-4 bg-black/70 px-2 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">{gym.rating}</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-[#C15364] to-[#868B96] px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{gym.members} Members</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-[#C15364] transition-colors">
              {gym.name}
            </h3>
            <IconComponent className="w-6 h-6 text-[#C15364] flex-shrink-0" />
          </div>

          <div className="flex items-center text-gray-400 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{gym.location}</span>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {gym.highlight}
          </p>

          {/* Programs */}
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">Programs</h4>
            <div className="flex flex-wrap gap-2">
              {gym.programs.slice(0, 3).map((program, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                >
                  {program}
                </span>
              ))}
              {gym.programs.length > 3 && (
                <span className="text-xs bg-[#C15364]/20 text-[#C15364] px-2 py-1 rounded-full">
                  +{gym.programs.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Top Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {gym.amenities.slice(0, 3).map((amenity, index) => (
                <div key={index} className="flex items-center text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-[#C15364] rounded-full mr-2"></div>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={() => setSelectedGym(gym)}
              className="flex-1 bg-gradient-to-r from-[#C15364] to-[#868B96] text-white py-2 px-4 rounded-lg hover:opacity-80 transition-opacity font-medium"
            >
              View Details
            </button>
            <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:border-[#C15364] hover:text-[#C15364] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Gym</h1>
          <p className="text-gray-400">Discover the best fitness centers in New Delhi</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[#C15364] mb-1">{gyms.length}</div>
            <div className="text-gray-400">Premium Gyms</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[#C15364] mb-1">
              {gyms.reduce((acc, gym) => acc + gym.members, 0).toLocaleString()}
            </div>
            <div className="text-gray-400">Active Members</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[#C15364] mb-1">
              {(gyms.reduce((acc, gym) => acc + gym.rating, 0) / gyms.length).toFixed(1)}
            </div>
            <div className="text-gray-400">Average Rating</div>
          </div>
        </div>

        {/* Gym Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      </div>

      {/* Modal for Selected Gym */}
      {selectedGym && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedGym.name}</h2>
                <button 
                  onClick={() => setSelectedGym(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedGym.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image} 
                    alt={`${selectedGym.name} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    loading="lazy"
                    height={400}
                    width={300}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">About</h3>
                  <p className="text-gray-300">{selectedGym.highlight}</p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">All Programs</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGym.programs.map((program, index) => (
                      <span 
                        key={index}
                        className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">All Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedGym.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-400">
                        <div className="w-2 h-2 bg-[#C15364] rounded-full mr-3"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-white font-medium">{selectedGym.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-[#C15364] mr-1" />
                      <span className="text-white">{selectedGym.members} members</span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-[#C15364] to-[#868B96] text-white px-6 py-2 rounded-lg hover:opacity-80 transition-opacity">
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}