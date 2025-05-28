"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  Clock,
  Users,
  Filter,
  Search,
  ShoppingCart,
  Heart,
  Play,
  Eye,
  Flame,
  Trophy,
  Target,
} from "lucide-react";

import { RootState} from "@/store";

import { useAppDispatch, useAppSelector } from "@/hooks";

import { addToCart } from "@/store/slices/cartSlice";

interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  instructor: string;
  rating: number;
  reviews: number;
  students: number;
  image: string;
  features: string[];
  tags: string[];
  isFeatured: boolean;
  isPopular: boolean;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  instructor: string;
  image: string;
  category: string;
  quantity: number;
}

// Skeleton Card Component
const SkeletonCard: React.FC<{ viewMode: "grid" | "list" }> = ({ viewMode }) => {
  return (
    <div
      className={`group relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-md rounded-2xl border border-[#868B96]/20 overflow-hidden animate-pulse ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      {/* Image Section Skeleton */}
      <div
        className={`relative overflow-hidden ${
          viewMode === "list" ? "w-80 flex-shrink-0" : "aspect-video"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 animate-pulse" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        
        {/* Placeholder badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <div className="w-16 h-6 bg-gray-700/50 rounded-full animate-pulse" />
        </div>
        
        {/* Placeholder heart */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-gray-700/50 rounded-full animate-pulse" />
        
        {/* Placeholder level badge */}
        <div className="absolute bottom-4 left-4 w-20 h-6 bg-gray-700/50 rounded-full animate-pulse" />
      </div>

      {/* Content Section Skeleton */}
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Title skeleton */}
            <div className="w-48 h-6 bg-gray-700/50 rounded animate-pulse mb-2" />
            {/* Instructor skeleton */}
            <div className="w-32 h-4 bg-gray-700/50 rounded animate-pulse mb-1" />
            {/* Category skeleton */}
            <div className="w-24 h-4 bg-gray-700/50 rounded animate-pulse" />
          </div>
          <div className="text-right">
            {/* Price skeleton */}
            <div className="w-16 h-8 bg-gray-700/50 rounded animate-pulse" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="w-full h-4 bg-gray-700/50 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-700/50 rounded animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-4 bg-gray-700/50 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-700/50 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-700/50 rounded animate-pulse" />
        </div>

        {/* Features skeleton */}
        <div className="mb-6 flex flex-wrap gap-2">
          <div className="w-20 h-6 bg-gray-700/50 rounded-lg animate-pulse" />
          <div className="w-24 h-6 bg-gray-700/50 rounded-lg animate-pulse" />
          <div className="w-16 h-6 bg-gray-700/50 rounded-lg animate-pulse" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-3">
          <div className="flex-1 h-12 bg-gray-700/50 rounded-xl animate-pulse" />
          <div className="w-12 h-12 bg-gray-700/50 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const ProgramsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state: RootState) => state.favorites.items);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddToCart = (program: Program) => {
    const cartItem: Omit<CartItem, "quantity"> = {
      id: program.id,
      title: program.title,
      price: program.price,
      originalPrice: program.originalPrice,
      duration: program.duration,
      instructor: program.instructor,
      image: program.image,
      category: program.category,
    };

    dispatch(addToCart(cartItem));
  };

  const isInCart = (programId: string) => {
    return Array.isArray(cartItems) && cartItems.some((item) => item.id === programId);
  };

  // Fetch programs with loading state
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/programs");
        if (!res.ok) {
          throw new Error("Failed to fetch programs");
        }
        const data = await res.json();
        console.log(data);
        setPrograms(data);
        setFilteredPrograms(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        // Add minimum loading time to show skeleton
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchPrograms();
  }, []);

  // Filter and search logic
  useEffect(() => {
    if (isLoading) return;

    let filtered = programs;

    if (searchTerm) {
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          program.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (program) => program.category === selectedCategory
      );
    }

    if (selectedLevel !== "All") {
      filtered = filtered.filter((program) => program.level === selectedLevel);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.students - a.students);
        break;
      case "newest":
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }

    setFilteredPrograms(filtered);
  }, [programs, searchTerm, selectedCategory, selectedLevel, sortBy, isLoading]);

  const categories = [
    "All",
    "Weight Loss",
    "Strength Training",
    "Cardio",
    "Yoga",
    "Wellness",
    "Sports Performance",
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(193, 83, 100, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(193, 83, 100, 0.5);
          }
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Header Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#C15364]/10 via-transparent to-[#868B96]/10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Fitness{" "}
              <span className="bg-gradient-to-r from-[#C15364] to-[#868B96] bg-clip-text text-transparent">
                Programs
              </span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8">
              Transform your body and mind with our expertly designed fitness programs
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-sm rounded-2xl p-4 border border-[#C15364]/20">
                <div className="text-2xl font-bold text-[#C15364]">
                  {isLoading ? (
                    <div className="w-8 h-6 bg-gray-700/50 rounded animate-pulse mx-auto" />
                  ) : (
                    `${programs.length}+`
                  )}
                </div>
                <div className="text-gray-400 text-sm">Programs</div>
              </div>
              <div className="text-center bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-sm rounded-2xl p-4 border border-[#868B96]/20">
                <div className="text-2xl font-bold text-[#868B96]">15K+</div>
                <div className="text-gray-400 text-sm">Students</div>
              </div>
              <div className="text-center bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-sm rounded-2xl p-4 border border-[#C15364]/20">
                <div className="text-2xl font-bold text-[#C15364]">4.8★</div>
                <div className="text-gray-400 text-sm">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-md rounded-2xl p-6 border border-[#C15364]/20">
            {/* Main Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C15364] w-5 h-5" />
              <input
                type="text"
                placeholder="Search programs, instructors, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/60 border border-[#868B96]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#C15364]/50 text-lg transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Filter Toggle for Mobile */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#C15364]/20 to-[#868B96]/20 border border-[#C15364]/50 rounded-lg text-white hover:from-[#C15364]/30 hover:to-[#868B96]/30 transition-all"
                disabled={isLoading}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters */}
            <div className={`grid md:grid-cols-4 gap-4 ${showFilters ? "block" : "hidden md:grid"}`}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-black/60 border border-[#868B96]/30 rounded-xl text-white focus:border-[#C15364]/50 focus:outline-none transition-colors"
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-black">
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 bg-black/60 border border-[#868B96]/30 rounded-xl text-white focus:border-[#C15364]/50 focus:outline-none transition-colors"
                disabled={isLoading}
              >
                {levels.map((level) => (
                  <option key={level} value={level} className="bg-black">
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-black/60 border border-[#868B96]/30 rounded-xl text-white focus:border-[#C15364]/50 focus:outline-none transition-colors"
                disabled={isLoading}
              >
                <option value="popular" className="bg-black">Most Popular</option>
                <option value="newest" className="bg-black">Newest</option>
                <option value="price-low" className="bg-black">Price: Low to High</option>
                <option value="price-high" className="bg-black">Price: High to Low</option>
                <option value="rating" className="bg-black">Highest Rated</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-[#C15364] to-[#868B96] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-[#C15364] to-[#868B96] text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                      <div className="h-0.5 bg-current rounded"></div>
                      <div className="h-0.5 bg-current rounded"></div>
                      <div className="h-0.5 bg-current rounded"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#868B96]/20">
              <h1 className="text-gray-300">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <span>Loading programs...</span>
                    <div className="w-4 h-4 border-2 border-[#C15364]/30 border-t-[#C15364] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    Showing{" "}
                    <span className="text-[#C15364] font-semibold">
                      {filteredPrograms.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-[#C15364] font-semibold">
                      {programs.length}
                    </span>{" "}
                    programs
                  </>
                )}
              </h1>
              {searchTerm && !isLoading && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-[#868B96] hover:text-white text-sm transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container mx-auto px-6 pb-20">
        {isLoading ? (
          // Skeleton Loading State
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} viewMode={viewMode} />
            ))}
          </div>
        ) : filteredPrograms.length === 0 ? (
          // No Programs Found State
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-[#C15364]/20 to-[#868B96]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C15364]/30">
              <Search className="w-12 h-12 text-[#C15364]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No programs found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or filters to find more programs.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#C15364] to-[#868B96] text-white rounded-xl hover:shadow-lg hover:shadow-[#C15364]/25 transform hover:scale-105 transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          // Programs Grid
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className={`group relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-md rounded-2xl border border-[#868B96]/20 hover:border-[#C15364]/40 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-[#C15364]/10 float-animation ${
                  viewMode === "list" ? "flex" : ""
                } ${program.isFeatured ? "glow-effect" : ""}`}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C15364]/5 via-transparent to-[#868B96]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image Section */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-80 flex-shrink-0" : "aspect-video"
                  }`}
                >
                  {/* Placeholder gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C15364]/30 via-gray-800 to-[#868B96]/30" />
                  
                  {/* Fitness icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#C15364]/20 to-[#868B96]/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                      {program.category === "Weight Loss" && <Flame className="w-8 h-8 text-[#C15364]" />}
                      {program.category === "Strength Training" && <Trophy className="w-8 h-8 text-[#868B96]" />}
                      {program.category === "Yoga" && <Target className="w-8 h-8 text-[#C15364]" />}
                      {!["Weight Loss", "Strength Training", "Yoga"].includes(program.category) && <Play className="w-8 h-8 text-[#868B96]" />}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    {program.isFeatured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-[#C15364] to-[#868B96] text-white text-xs font-bold rounded-full shadow-lg">
                        FEATURED
                      </span>
                    )}
                    {program.isPopular && (
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
                        POPULAR
                      </span>
                    )}
                    {program.originalPrice && (
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#C15364]/20 transition-colors z-10"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(program.id)
                          ? "text-[#C15364] fill-current"
                          : "text-white"
                      }`}
                    />
                  </button>

                  {/* Level Badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                        program.level === "Beginner"
                          ? "bg-gradient-to-r from-green-500/80 to-green-600/80 text-white"
                          : program.level === "Intermediate"
                          ? "bg-gradient-to-r from-yellow-500/80 to-yellow-600/80 text-white"
                          : "bg-gradient-to-r from-red-500/80 to-red-600/80 text-white"
                      }`}
                    >
                      {program.level}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#C15364] transition-colors">
                          {program.title}
                        </h3>
                        {isInCart(program.id) && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                            IN CART
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        by {program.instructor}
                      </p>
                      <p className="text-[#C15364] text-sm font-medium">
                        {program.category}
                      </p>
                    </div>
                    <div className="text-right">
                      {program.originalPrice && (
                        <p className="text-gray-500 text-sm line-through">
                          ${program.originalPrice}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-white">
                        ${program.price}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {program.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-white font-medium">
                        {program.rating}
                      </span>
                      <span className="text-gray-400">({program.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-[#868B96]" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-[#C15364]" />
                      <span>{program.students.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {program.features
                        .slice(0, viewMode === "list" ? 5 : 3)
                        .map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-[#C15364]/10 to-[#868B96]/10 text-gray-300 text-xs rounded-lg border border-[#868B96]/20 hover:border-[#C15364]/40 transition-colors"
                          >
                            {feature}
                          </span>
                        ))}
                      {program.features.length > (viewMode === "list" ? 5 : 3) && (
                        <span className="px-3 py-1 bg-gradient-to-r from-[#C15364]/10 to-[#868B96]/10 text-gray-400 text-xs rounded-lg border border-[#868B96]/20">
                          +{program.features.length - (viewMode === "list" ? 5 : 3)} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAddToCart(program)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isInCart(program.id)
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                          : "bg-gradient-to-r from-[#C15364] to-[#868B96] text-white hover:shadow-lg hover:shadow-[#C15364]/25 transform hover:scale-105"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {isInCart(program.id) ? "Added to Cart" : "Add to Cart"}
                      </span>
                    </button>
                    <button className="px-4 py-3 bg-gradient-to-r from-[#868B96]/20 to-[#C15364]/10 text-gray-300 rounded-xl hover:from-[#868B96]/30 hover:to-[#C15364]/20 hover:text-white transition-all border border-[#868B96]/20 hover:border-[#C15364]/40">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;