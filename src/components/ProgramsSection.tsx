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

// Memoized FloatingParticles component to prevent unnecessary re-renders
const FloatingParticles = memo(() => {
 const particles = useMemo(
  () =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    })),
  []
);


  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(({ id, left, top, duration, delay }) => (
        <div
          key={id}
          className="absolute w-2 h-2 bg-gradient-to-r from-[#BA5E6C] to-[#838C95] rounded-full opacity-20"
          style={{
            left,
            top,
            animation: `float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
});

FloatingParticles.displayName = "FloatingParticles";

// Memoized AnimatedCard with optimized animation handling
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
        className={`transform transition-all duration-1000 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        } ${className}`}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

// Optimized GlassCard with memoization
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
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:shadow-[#BA5E6C]/20 transition-all duration-500 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);


GlassCard.displayName = "GlassCard";

// Program interface
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

// Memoized ProgramSkeleton to prevent unnecessary re-renders
const ProgramSkeleton = memo(() => (
  <div className="animate-pulse">
    <GlassCard className="p-6 bg-white/5">
      <div className="h-2 bg-gradient-to-r from-[#BA5E6C]/30 to-[#838C95]/30 rounded-t-xl mb-4"></div>
      <div className="h-6 bg-white/10 rounded mb-2"></div>
      <div className="h-4 bg-white/10 rounded mb-4 w-3/4"></div>
      <div className="h-8 bg-white/10 rounded mb-4 w-1/2"></div>
      <div className="space-y-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-white/10 rounded"></div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-white/10 rounded-lg"></div>
        <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
      </div>
    </GlassCard>
  </div>
));

ProgramSkeleton.displayName = "ProgramSkeleton";

// Helper functions
const getProgramIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "weight loss":
      return <Zap className="w-8 h-8" />;
    case "muscle gain":
    case "strength":
      return <Trophy className="w-8 h-8" />;
    case "mental fitness":
    case "wellness":
      return <Star className="w-8 h-8" />;
    default:
      return <Users className="w-8 h-8" />;
  }
};

const programGradients = [
  "from-[#BA5E6C] via-[#BA5E6C]/80 to-[#838C95]",
  "from-[#838C95] via-[#838C95]/80 to-[#BA5E6C]",
  "from-[#BA5E6C]/80 via-[#838C95] to-[#BA5E6C]/60",
];

const getProgramGradient = (index: number) => {
  return programGradients[index % programGradients.length];
};

// Main component
const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/programs");
      if (!res.ok) {
        throw new Error("Failed to fetch programs");
      }
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

  // Memoized event handlers
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

  // Memoized program cards to prevent re-renders
  const renderProgramCards = useMemo(() => {
    if (loading || error) return null;

    return programs.map((program, index) => (
      <AnimatedCard key={`${program._id}-${index}`} delay={index * 150}>
        <ProgramCard
          program={program}
          index={index}
          onClick={handleProgramClick}
          onPurchase={handlePurchase}
        
        
        />
      </AnimatedCard>
    ));
  }, [
    programs,
    loading,
    error,
    handleProgramClick,
    handlePurchase,
 
  ]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          willChange: "transform, opacity"
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(186, 94, 108, 0.3); }
            50% { box-shadow: 0 0 40px rgba(186, 94, 108, 0.6); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `,
        }}
      />

      <section
        id="programs"
        className="relative min-h-screen bg-gradient-to-br from-[#BA5E6C]/10 via-black to-[#838C95]/10 overflow-hidden"
      >
        <FloatingParticles />

        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#BA5E6C]/20 via-transparent to-[#838C95]/20"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,#BA5E6C10,transparent)]"></div>

        <div className="relative container mx-auto px-6 py-20">
          <AnimatedCard>
            <div className="text-center mb-20">
              <div className="inline-block mb-6">
                <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#BA5E6C] via-white to-[#838C95] bg-clip-text text-transparent mb-4 leading-tight">
                  Elite Programs
                </h2>
                <div className="h-1 bg-gradient-to-r from-transparent via-[#BA5E6C] to-transparent"></div>
              </div>
              <p className="text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Scientifically designed transformations that deliver
                extraordinary results
              </p>
            </div>
          </AnimatedCard>

          {/* Error State */}
          {error && (
            <AnimatedCard className="max-w-2xl mx-auto mb-12">
              <GlassCard className="p-8 bg-red-500/10 border-red-500/30">
                <div className="flex items-center justify-center text-red-400 mb-4">
                  <AlertCircle className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-semibold">
                    Error Loading Programs
                  </h3>
                </div>
                <p className="text-red-300 text-center mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </GlassCard>
            </AnimatedCard>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {[1, 2].map((i) => (
                <AnimatedCard key={i} delay={i * 150}>
                  <ProgramSkeleton />
                </AnimatedCard>
              ))}
            </div>
          )}

          {/* Program Cards Grid */}
          {!loading && !error && programs.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {renderProgramCards}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && programs.length === 0 && (
            <AnimatedCard className="text-center py-20">
              <div className="text-white/60 mb-4">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold">
                  No Programs Available
                </h3>
                <p className="text-lg">Check back soon for new programs!</p>
              </div>
            </AnimatedCard>
          )}

          {/* Program Details Modal */}
          {selectedProgram && (
            <ProgramModal
              program={selectedProgram}
              onClose={closeProgramModal}
              onPurchase={handlePurchase}
            />
          )}
        </div>
      </section>
    </>
  );
};

// Extracted ProgramCard component for better performance
// ProgramCard component
const ProgramCard = memo(
  ({
    program,
    index,
    onClick,
  
    
    
  }: {
    program: Program;
    index: number;
    onClick: (program: Program) => void;
    onPurchase: (program: Program) => void;
   
   
  }) => {
    const gradient = useMemo(() => getProgramGradient(index), [index]);

 

    return (
      <GlassCard
        className="p-8 bg-white/5 group cursor-pointer overflow-hidden relative border-2 border-transparent hover:border-[#BA5E6C]/50 transform hover:scale-105 hover:-translate-y-2"
        onClick={() => onClick(program)}
       
      >
     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer will-change-transform will-change-opacity"></div>
</div>


        {/* Featured/Popular Badge */}
        {(program.isFeatured || program.isPopular) && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-gradient-to-r from-[#BA5E6C] to-[#838C95] text-white px-3 py-1 rounded-full text-xs font-bold">
              {program.isFeatured ? "FEATURED" : "POPULAR"}
            </div>
          </div>
        )}

        {/* Program Image */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <Image
            src={program.image}
            alt={program.title}
            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            height={200}
            width={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute top-4 left-4 text-white">
            {getProgramIcon(program.category)}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={`h-2 bg-gradient-to-r ${gradient} rounded-t-xl mb-6 group-hover:h-4 transition-all duration-300`}
        ></div>

        {/* Rest of the component... */}
      </GlassCard>
    );
  }
);

ProgramCard.displayName = "ProgramCard";

// Extracted ProgramModal component for better performance
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
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <AnimatedCard className="w-full max-w-6xl max-h-[90vh] overflow-auto">
          <GlassCard className="bg-white/10 border border-white/20">
            <div className="relative">
              {/* Header Image */}
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
                  onClick={onClose}
                  className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {program.title}
                  </h3>
                  <p className="text-xl text-white/80">{program.description}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Left Column - Program Details */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-6">
                        Program Overview
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 p-4 rounded-xl">
                          <Clock className="w-6 h-6 text-[#BA5E6C] mb-2" />
                          <p className="text-white/60 text-sm">Duration</p>
                          <p className="text-white font-semibold">
                            {program.duration}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <Award className="w-6 h-6 text-[#BA5E6C] mb-2" />
                          <p className="text-white/60 text-sm">Level</p>
                          <p className="text-white font-semibold">
                            {program.level}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <Users className="w-6 h-6 text-[#BA5E6C] mb-2" />
                          <p className="text-white/60 text-sm">Students</p>
                          <p className="text-white font-semibold">
                            {program.students.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                          <Star className="w-6 h-6 text-[#BA5E6C] mb-2" />
                          <p className="text-white/60 text-sm">Rating</p>
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
                      <div className="bg-white/5 p-6 rounded-xl">
                        <p className="text-white font-semibold text-lg mb-2">
                          {program.instructor}
                        </p>
                        <p className="text-white/70">
                          Professional fitness instructor specializing in{" "}
                          {program.category.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white mb-4">
                        What You&apos;ll Get
                      </h4>
                      <div className="grid gap-3">
                        {program.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center bg-white/5 p-3 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-[#BA5E6C] mr-3 flex-shrink-0" />
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
                            className="px-3 py-1 bg-[#BA5E6C]/20 text-[#BA5E6C] rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Purchase */}
                  <div className="lg:sticky lg:top-8">
                    <div className="bg-gradient-to-br from-[#BA5E6C]/20 to-[#838C95]/20 p-8 rounded-2xl border border-white/10">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <span className="text-5xl font-bold text-white">
                            ${program.price}
                          </span>
                          {program.originalPrice > program.price && (
                            <span className="text-2xl text-white/50 line-through">
                              ${program.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-white/70">per month</p>
                        <p className="text-[#BA5E6C] font-semibold mt-2">
                          Start your transformation today
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-white/80">
                          <span>Program Access</span>
                          <span>Lifetime</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Support</span>
                          <span>24/7</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Money-back Guarantee</span>
                          <span>30 days</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onPurchase(program)}
                        className="w-full py-4 bg-gradient-to-r from-[#BA5E6C] to-[#838C95] text-white rounded-xl hover:shadow-2xl hover:shadow-[#BA5E6C]/30 transform hover:scale-105 transition-all duration-300 font-semibold text-lg mb-4"
                      >
                        Purchase Program
                      </button>

                      <p className="text-center text-white/60 text-sm">
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
