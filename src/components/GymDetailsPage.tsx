// components/GymDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Wifi, 
  Car, 
  Coffee, 
  User, 
  Users, 
  Clock, 
  Star, 
  MapPin, 
  Camera, 
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Calendar,
  Heart,
  Share2
} from 'lucide-react';

import { AnimatedCard, GlassCard } from './shared/index';

interface Gym {
  id: number;
  name: string;
  location: string;
  amenities: string[];
  images: string[];
  rating: number;
  programs: string[];
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  description?: string;
}

interface AmenityIcons {
  [key: string]: React.ReactNode;
}

const GymDetailsPage: React.FC = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - replace with API call
  const mockGyms: Gym[] = [
    {
      id: 1,
      name: "Downtown Fitness",
      location: "123 Main St, Downtown",
      amenities: ["Modern Equipment", "Free WiFi", "Parking", "Café"],
      images: ["gym1.jpg", "gym2.jpg"],
      rating: 4.8,
      programs: ["Fat Loss", "Muscle Gain"],
      phone: "+1 (555) 123-4567",
      email: "info@downtownfitness.com",
      website: "www.downtownfitness.com",
      hours: "Mon-Fri: 5AM-11PM, Sat-Sun: 6AM-10PM",
      description: "Downtown Fitness is your premier destination for achieving your fitness goals. With state-of-the-art equipment and expert trainers, we provide a comprehensive fitness experience in the heart of the city."
    },
    {
      id: 2,
      name: "Uptown Wellness",
      location: "456 Oak Ave, Uptown", 
      amenities: ["Pool", "Sauna", "Personal Training", "Group Classes"],
      images: ["gym3.jpg", "gym4.jpg"],
      rating: 4.9,
      programs: ["Mental Fitness", "Fat Loss"],
      phone: "+1 (555) 234-5678",
      email: "hello@uptownwellness.com",
      website: "www.uptownwellness.com",  
      hours: "Mon-Sun: 5AM-12AM",
      description: "Uptown Wellness combines fitness with relaxation, offering premium facilities including pools, saunas, and wellness programs designed for your complete well-being."
    },
    {
      id: 3,
      name: "City Center Gym",
      location: "789 Pine St, City Center",
      amenities: ["24/7 Access", "Cardio Zone", "Free Weights", "Locker Rooms"],
      images: ["gym5.jpg", "gym6.jpg"],
      rating: 4.7,
      programs: ["Muscle Gain", "Mental Fitness"],
      phone: "+1 (555) 345-6789",
      email: "contact@citycentergym.com",
      website: "www.citycentergym.com",
      hours: "24/7 Access Available",
      description: "City Center Gym offers round-the-clock access to premium fitness facilities, perfect for busy professionals who need flexibility in their workout schedule."
    },
    {
      id: 4,
      name: "Elite Performance Hub",
      location: "321 Sports Ave, Athletic District",
      amenities: ["Olympic Equipment", "Recovery Zone", "Nutrition Bar", "Personal Training"],
      images: ["gym7.jpg", "gym8.jpg"],
      rating: 4.9,
      programs: ["Athletic Performance", "Strength Training", "Recovery"],
      phone: "+1 (555) 456-7890",
      email: "elite@performancehub.com",
      website: "www.eliteperformancehub.com",
      hours: "Mon-Fri: 4AM-11PM, Sat-Sun: 5AM-10PM",
      description: "Elite Performance Hub is designed for serious athletes and fitness enthusiasts who demand the highest quality equipment and training programs."
    },
    {
      id: 5,
      name: "Zen Fitness Studio",
      location: "654 Harmony Blvd, Wellness Quarter",
      amenities: ["Yoga Studio", "Meditation Room", "Juice Bar", "Spa Services"],
      images: ["gym9.jpg", "gym10.jpg"],
      rating: 4.6,
      programs: ["Mindfulness", "Flexibility", "Mental Fitness"],
      phone: "+1 (555) 567-8901",
      email: "zen@fitnessstudio.com",
      website: "www.zenfitnessstudio.com",
      hours: "Mon-Sun: 6AM-10PM",
      description: "Zen Fitness Studio focuses on holistic wellness, combining physical fitness with mental well-being through yoga, meditation, and mindfulness practices."
    },
    {
      id: 6,
      name: "PowerHouse Gym",
      location: "987 Strength St, Industrial Zone",
      amenities: ["Heavy Weights", "CrossFit Box", "Battle Ropes", "Tire Flipping Area"],
      images: ["gym11.jpg", "gym12.jpg"],  
      rating: 4.8,
      programs: ["Powerlifting", "CrossFit", "Functional Training"],
      phone: "+1 (555) 678-9012",
      email: "power@housegym.com",
      website: "www.powerhousegym.com",
      hours: "Mon-Fri: 5AM-11PM, Sat-Sun: 6AM-9PM",
      description: "PowerHouse Gym is the ultimate destination for strength training and powerlifting, featuring heavy-duty equipment and specialized training areas."
    }
  ];

  const amenityIcons: AmenityIcons = {
    "Modern Equipment": <Dumbbell className="w-6 h-6" />,
    "Free WiFi": <Wifi className="w-6 h-6" />,
    "Parking": <Car className="w-6 h-6" />,
    "Café": <Coffee className="w-6 h-6" />,
    "Pool": <div className="w-6 h-6 bg-blue-500 rounded"></div>,
    "Sauna": <div className="w-6 h-6 bg-red-500 rounded"></div>,
    "Personal Training": <User className="w-6 h-6" />,
    "Group Classes": <Users className="w-6 h-6" />,
    "24/7 Access": <Clock className="w-6 h-6" />,
    "Cardio Zone": <Star className="w-6 h-6" />,
    "Free Weights": <Dumbbell className="w-6 h-6" />,
    "Locker Rooms": <div className="w-6 h-6 bg-gray-500 rounded"></div>,
    "Olympic Equipment": <Dumbbell className="w-6 h-6" />,
    "Recovery Zone": <div className="w-6 h-6 bg-green-500 rounded"></div>,
    "Nutrition Bar": <Coffee className="w-6 h-6" />,
    "Yoga Studio": <div className="w-6 h-6 bg-purple-500 rounded"></div>,
    "Meditation Room": <div className="w-6 h-6 bg-indigo-500 rounded"></div>,
    "Juice Bar": <Coffee className="w-6 h-6" />,
    "Spa Services": <Star className="w-6 h-6" />,
    "Heavy Weights": <Dumbbell className="w-6 h-6" />,
    "CrossFit Box": <div className="w-6 h-6 bg-orange-500 rounded"></div>,
    "Battle Ropes": <div className="w-6 h-6 bg-black rounded"></div>,
    "Tire Flipping Area": <div className="w-6 h-6 bg-gray-700 rounded"></div>
  };

  useEffect(() => {
    // Simulate API call
    const fetchGymDetails = async () => {
      setLoading(true);
      
      // Replace this with actual API call
      // const response = await fetch(`/api/gyms/${gymId}`);
      // const gymData = await response.json();
      
      // Mock API simulation
      setTimeout(() => {
        const foundGym = mockGyms.find(g => g.id === parseInt(gymId || '1'));
        setGym(foundGym || null);
        setLoading(false);
      }, 1000);
    };

    if (gymId) {
      fetchGymDetails();
    }
  }, [gymId]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add API call to save favorite status
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gym?.name,
        text: `Check out ${gym?.name} - ${gym?.description}`,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C15364] mx-auto mb-4"></div>
          <p className="text-xl text-[#858B95]">Loading gym details...</p>
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Gym Not Found</h1>
          <p className="text-xl text-[#858B95] mb-8">The gym you're looking for doesn't exist.</p>
          <button 
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="flex items-center text-[#C15364] hover:text-[#858B95] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Gyms
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-[#C15364] transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <AnimatedCard>
          {/* Hero Section */}
          <div className="mb-12">
            <GlassCard className="relative overflow-hidden bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="h-96 bg-gradient-to-br from-[#C15364]/30 via-[#858B95]/20 to-[#C15364]/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
                <Camera className="w-24 h-24 text-[#858B95]" />
                
                {/* Rating Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    <span className="text-xl font-bold text-gray-800">{gym.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">{gym.name}</h1>
                <p className="text-xl text-[#858B95] mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3" />
                  {gym.location}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">{gym.description}</p>
              </div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Amenities */}
              <GlassCard className="p-8 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/20">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Premium Amenities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {gym.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-[#858B95] bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                      <span className="text-[#C15364] mr-4">{amenityIcons[amenity]}</span>
                      <span className="font-medium text-lg">{amenity}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Programs */}
              <GlassCard className="p-8 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/20">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Programs</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {gym.programs.map((program, idx) => (
                    <div key={idx} className="flex items-center text-[#858B95] bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6 mr-4 text-[#C15364]" />
                      <span className="font-medium text-lg">{program} Program</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <GlassCard className="p-6 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {gym.phone && (
                    <div className="flex items-center text-[#858B95]">
                      <Phone className="w-5 h-5 mr-3 text-[#C15364]" />
                      <a href={`tel:${gym.phone}`} className="hover:text-[#C15364] transition-colors">
                        {gym.phone}
                      </a>
                    </div>
                  )}
                  {gym.email && (
                    <div className="flex items-center text-[#858B95]">
                      <Mail className="w-5 h-5 mr-3 text-[#C15364]" />
                      <a href={`mailto:${gym.email}`} className="hover:text-[#C15364] transition-colors">
                        {gym.email}
                      </a>
                    </div>
                  )}
                  {gym.website && (
                    <div className="flex items-center text-[#858B95]">
                      <Globe className="w-5 h-5 mr-3 text-[#C15364]" />
                      <a href={`https://${gym.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C15364] transition-colors">
                        {gym.website}
                      </a>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Hours */}
              <GlassCard className="p-6 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-[#C15364]" />
                  Operating Hours
                </h3>
                <p className="text-[#858B95] leading-relaxed">{gym.hours}</p>
              </GlassCard>

              {/* Action Button */}
              <button className="w-full py-4 bg-gradient-to-r from-[#C15364] via-[#C15364] to-[#858B95] text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-lg">
                Book a Visit
              </button>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default GymDetailsPage;