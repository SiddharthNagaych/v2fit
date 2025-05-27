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
} from "lucide-react";

import { RootState} from "@/store";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
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
const ProgramsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state: RootState) => state.favorites.items);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

  

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


  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
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
      }
    };

    fetchPrograms();
  }, []);

  // Filter and search logic
  useEffect(() => {
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
  }, [programs, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const handleToggleFavorite = (programId: string) => {
    dispatch(toggleFavorite(programId));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-slate-500/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Fitness{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-slate-400">
                Programs
              </span>
            </h1>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto mb-8">
              Transform your body and mind with our expertly designed fitness
              programs
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {programs.length}+
                </div>
                <div className="text-slate-400 text-sm">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15K+</div>
                <div className="text-slate-400 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.8★</div>
                <div className="text-slate-400 text-sm">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            {/* Main Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search programs, instructors, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:border-rose-400/50 focus:outline-none text-lg"
              />
            </div>

            {/* Filter Toggle for Mobile */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters */}
            <div
              className={`grid md:grid-cols-4 gap-4 ${
                showFilters ? "block" : "hidden md:grid"
              }`}
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:border-rose-400/50 focus:outline-none"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-slate-800"
                  >
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:border-rose-400/50 focus:outline-none"
              >
                {levels.map((level) => (
                  <option key={level} value={level} className="bg-slate-800">
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:border-rose-400/50 focus:outline-none"
              >
                <option value="popular" className="bg-slate-800">
                  Most Popular
                </option>
                <option value="newest" className="bg-slate-800">
                  Newest
                </option>
                <option value="price-low" className="bg-slate-800">
                  Price: Low to High
                </option>
                <option value="price-high" className="bg-slate-800">
                  Price: High to Low
                </option>
                <option value="rating" className="bg-slate-800">
                  Highest Rated
                </option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-rose-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
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
                        ? "bg-rose-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
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
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
              <p className="text-slate-400">
                Showing{" "}
                <span className="text-white font-semibold">
                  {filteredPrograms.length}
                </span>{" "}
                of{" "}
                <span className="text-white font-semibold">
                  {programs.length}
                </span>{" "}
                programs
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-rose-400 hover:text-slate-400 text-sm transition-colors"
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
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No programs found
            </h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search criteria or filters to find more
              programs.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-slate-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
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
                className={`bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 hover:border-rose-400/30 transition-all duration-300 group overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-80 flex-shrink-0" : "aspect-video"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-slate-500/20" />
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {program.isFeatured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-slate-500 text-white text-xs font-bold rounded-full">
                        FEATURED
                      </span>
                    )}
                    {program.isPopular && (
                      <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        POPULAR
                      </span>
                    )}
                    {program.originalPrice && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(program.id)}
                    className={`absolute top-4 right-4 p-2 backdrop-blur-sm rounded-full transition-all duration-300 ${
                      favorites.includes(program.id)
                        ? "bg-red-500/80 text-white"
                        : "bg-black/50 hover:bg-black/70 text-white"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(program.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  {/* Preview Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        program.level === "Beginner"
                          ? "bg-green-500/80 text-white"
                          : program.level === "Intermediate"
                          ? "bg-yellow-500/80 text-white"
                          : "bg-red-500/80 text-white"
                      }`}
                    >
                      {program.level}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                          {program.title}
                        </h3>
                        {isInCart(program.id) && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                            IN CART
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-1">
                        by {program.instructor}
                      </p>
                      <p className="text-rose-400 text-sm font-medium">
                        {program.category}
                      </p>
                    </div>
                    <div className="text-right">
                      {program.originalPrice && (
                        <p className="text-slate-400 text-sm line-through">
                          {program.originalPrice}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-white">
                        {program.price}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">
                    {program.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-white font-medium">
                        {program.rating}
                      </span>
                      <span>({program.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
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
                            className="px-2 py-1 bg-slate-900/50 text-slate-400 text-xs rounded-lg border border-white/5"
                          >
                            {feature}
                          </span>
                        ))}
                      {program.features.length >
                        (viewMode === "list" ? 5 : 3) && (
                        <span className="px-2 py-1 bg-slate-900/50 text-slate-400 text-xs rounded-lg border border-white/5">
                          +
                          {program.features.length -
                            (viewMode === "list" ? 5 : 3)}{" "}
                          more
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
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gradient-to-r from-rose-500 to-slate-500 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {isInCart(program.id) ? "Added to Cart" : "Add to Cart"}
                      </span>
                    </button>
                    <button className="px-4 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
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
