import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  X,
  Clock,
  Award,
  CheckCircle,
  Zap,
  Star,
  Users,
  Trophy,
  AlertCircle,
  
} from "lucide-react";
import Image from "next/image";

const AnimatedCard = memo(
  ({
    children,
    delay = 0,
    className = "",
  }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
  }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div
        className={`transform transition-all duration-500 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        } ${className}`}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

const GlassCard = memo(
  ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-2xl shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

GlassCard.displayName = "GlassCard";

interface Program {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
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
  createdAt: string;
  updatedAt: string;
}

const ProgramSkeleton = memo(() => (
  <div className="animate-pulse">
    <GlassCard className="p-6">
      <div className="h-2 bg-gray-700 rounded mb-4"></div>
      <div className="h-6 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
      <div className="h-8 bg-gray-700 rounded mb-4 w-1/2"></div>
      <div className="space-y-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-700 rounded"></div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-700 rounded-lg"></div>
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
      </div>
    </GlassCard>
  </div>
));

ProgramSkeleton.displayName = "ProgramSkeleton";

const getProgramIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "weight loss":
      return <Zap className="w-8 h-8 text-[#C15364]" />;
    case "muscle gain":
    case "strength":
      return <Trophy className="w-8 h-8 text-[#EBBAA9]" />;
    case "mental fitness":
    case "wellness":
      return <Star className="w-8 h-8 text-[#C15364]" />;
    default:
      return <Users className="w-8 h-8 text-[#EBBAA9]" />;
  }
};

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/programs");
      if (!res.ok) throw new Error("Failed to fetch programs");
      const data = await res.json();
      setPrograms(data);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err instanceof Error ? err.message : "Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleProgramClick = useCallback((program: Program): void => {
    setSelectedProgram(program);
  }, []);

  const closeProgramModal = useCallback((): void => {
    setSelectedProgram(null);
  }, []);

  const handlePurchase = useCallback(async (program: Program) => {
    try {
      const response = await fetch("/api/programs/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId: program._id }),
      });

      if (response.ok) {
        alert("Program purchased successfully!");
      } else {
        throw new Error("Purchase failed");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Purchase failed. Please try again.");
    }
  }, []);

  const renderProgramCards = useMemo(() => {
    if (loading || error) return null;
    return programs.map((program, index) => (
      <AnimatedCard key={`${program._id}-${index}`} delay={index * 150}>
        <ProgramCard
          program={program}
        
          onClick={handleProgramClick}
          onPurchase={handlePurchase}
        />
      </AnimatedCard>
    ));
  }, [programs, loading, error, handleProgramClick, handlePurchase]);

  return (
    <section id="programs" className="relative min-h-screen bg-black">
      <div className="relative container mx-auto px-6 py-20">
        <AnimatedCard>
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <h2 className="text-6xl md:text-7xl font-black text-white mb-4 leading-tight">
                Elite Programs
              </h2>
              <div className="h-1 bg-gradient-to-r from-[#EBBAA9] to-[#C15364]"></div>
            </div>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Scientifically designed transformations that deliver extraordinary results
            </p>
          </div>
        </AnimatedCard>

        {error && (
          <AnimatedCard className="max-w-2xl mx-auto mb-12">
            <GlassCard className="p-8 bg-red-900 border-red-700">
              <div className="flex items-center justify-center text-red-400 mb-4">
                <AlertCircle className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold">Error Loading Programs</h3>
              </div>
              <p className="text-red-300 text-center mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gradient-to-r from-[#EBBAA9] to-[#C15364] hover:from-[#C15364] hover:to-[#EBBAA9] text-white rounded-lg transition-all duration-300"
              >
                
                Retry
              </button>
            </GlassCard>
          </AnimatedCard>
        )}

        {loading && (
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {[1, 2].map((i) => (
              <AnimatedCard key={i} delay={i * 150}>
                <ProgramSkeleton />
              </AnimatedCard>
            ))}
          </div>
        )}

        {!loading && !error && programs.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {renderProgramCards}
          </div>
        )}

        {!loading && !error && programs.length === 0 && (
          <AnimatedCard className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto mb-4 text-[#EBBAA9]" />
              <h3 className="text-2xl font-semibold">No Programs Available</h3>
              <p className="text-lg">Check back soon for new programs!</p>
            </div>
          </AnimatedCard>
        )}

        {selectedProgram && (
          <ProgramModal
            program={selectedProgram}
            onClose={closeProgramModal}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </section>
  );
};

const ProgramCard = memo(
  ({
    program,
    onClick,
  }: {
    program: Program;
    onClick: (program: Program) => void;
    onPurchase: (program: Program) => void;
  }) => {
    return (
      <GlassCard
        className="p-8 cursor-pointer relative border-2 border-gray-700 hover:border-gray-600"
        onClick={() => onClick(program)}
      >
        {(program.isFeatured || program.isPopular) && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-gradient-to-r from-[#EBBAA9] to-[#C15364] text-white px-3 py-1 rounded-full text-xs font-bold">
              {program.isFeatured ? "FEATURED" : "POPULAR"}
            </div>
          </div>
        )}

        <div className="relative mb-6 rounded-xl overflow-hidden">
          <Image
            src={program.image}
            alt={program.title}
            className="w-full h-48 object-cover"
            loading="lazy"
            height={200}
            width={400}
          />
          <div className="absolute top-4 left-4 text-white">
            {getProgramIcon(program.category)}
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-[#EBBAA9] to-[#C15364] rounded mb-6"></div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
          <p className="text-gray-400 mb-4">{program.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-[#EBBAA9]">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">{program.rating}</span>
              <span className="text-gray-400 text-sm ml-1">({program.reviews})</span>
            </div>
            <span className="text-gray-400 text-sm">{program.students} students</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>{program.duration}</span>
            <span>{program.level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white">${program.price}</span>
            {program.originalPrice > program.price && (
              <span className="text-lg text-gray-400 line-through ml-2">
                ${program.originalPrice}
              </span>
            )}
          </div>
          <button 
            className="px-6 py-2 bg-gradient-to-r from-[#EBBAA9] to-[#C15364] hover:from-[#C15364] hover:to-[#EBBAA9] text-white rounded-lg transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onClick(program);
            }}
          >
            View Details
          </button>
        </div>
      </GlassCard>
    );
  }
);

ProgramCard.displayName = "ProgramCard";

const ProgramModal = memo(
  ({
    program,
    onClose,
    onPurchase,
  }: {
    program: Program;
    onClose: () => void;
    onPurchase: (program: Program) => void;
  }) => {
    // Add useEffect to handle escape key and prevent body scroll
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }, [onClose]);

    // Handle backdrop click with proper event handling
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
      // Only close if clicking the backdrop, not the modal content
      if (e.target === e.currentTarget) {
        onClose();
      }
    }, [onClose]);

    // Handle close button click with event prevention
    const handleCloseClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }, [onClose]);

    return (
      <div 
        className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        <AnimatedCard className="w-full max-w-6xl max-h-[90vh] overflow-auto">
          <GlassCard className="bg-gray-900 border-gray-700">
            <div className="relative">
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                <Image
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  height={200}
                  width={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <button
                  onClick={handleCloseClick}
                  className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-colors duration-200 z-10"
                  style={{ 
                    minWidth: '48px', 
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {program.title}
                  </h3>
                  <p className="text-xl text-gray-300">{program.description}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-6">
                        Program Overview
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-800 p-4 rounded-xl">
                          <Clock className="w-6 h-6 text-[#EBBAA9] mb-2" />
                          <p className="text-gray-400 text-sm">Duration</p>
                          <p className="text-white font-semibold">
                            {program.duration}
                          </p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl">
                          <Award className="w-6 h-6 text-[#EBBAA9] mb-2" />
                          <p className="text-gray-400 text-sm">Level</p>
                          <p className="text-white font-semibold">
                            {program.level}
                          </p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl">
                          <Users className="w-6 h-6 text-[#EBBAA9] mb-2" />
                          <p className="text-gray-400 text-sm">Students</p>
                          <p className="text-white font-semibold">
                            {program.students.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl">
                          <Star className="w-6 h-6 text-[#EBBAA9] mb-2" />
                          <p className="text-gray-400 text-sm">Rating</p>
                          <p className="text-white font-semibold">
                            {program.rating}/5
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white mb-4">
                        Instructor
                      </h4>
                      <div className="bg-gray-800 p-6 rounded-xl">
                        <p className="text-white font-semibold text-lg mb-2">
                          {program.instructor}
                        </p>
                        <p className="text-gray-300">
                          Professional fitness instructor specializing in{" "}
                          {program.category.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white mb-4">
                        What You Will Get
                      </h4>
                      <div className="grid gap-3">
                        {program.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center bg-gray-800 p-3 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-[#EBBAA9] mr-3 flex-shrink-0" />
                            <span className="text-white">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white mb-4">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-[#EBBAA9] to-[#C15364] text-white rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:sticky lg:top-8">
                    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <span className="text-5xl font-bold text-white">
                            ${program.price}
                          </span>
                          {program.originalPrice > program.price && (
                            <span className="text-2xl text-gray-400 line-through">
                              ${program.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400">per month</p>
                        <p className="text-[#EBBAA9] font-semibold mt-2">
                          Start your transformation today
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-300">
                          <span>Program Access</span>
                          <span>Lifetime</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Support</span>
                          <span>24/7</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Money-back Guarantee</span>
                          <span>30 days</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onPurchase(program)}
                        className="w-full py-4 bg-gradient-to-r from-[#EBBAA9] to-[#C15364] hover:from-[#C15364] hover:to-[#EBBAA9] text-white rounded-xl font-semibold text-lg mb-4 transition-all duration-300"
                      >
                        Purchase Program
                      </button>

                      <p className="text-center text-gray-400 text-sm">
                        Secure payment • Cancel anytime • 30-day guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedCard>
      </div>
    );
  }
);

ProgramModal.displayName = "ProgramModal";

export default ProgramsSection;