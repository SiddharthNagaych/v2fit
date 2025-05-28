import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedCard = ({ children, delay = 0 }: AnimatedCardProps) => {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CTASection = () => {
  const handleSignUp = () => {
    console.log('Sign up with Google');
  };

  const handleViewPricing = () => {
    console.log('View pricing');
  };

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(193, 83, 100, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(193, 83, 100, 0.6);
          }
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <section className="py-24 bg-black relative overflow-hidden">
        {/* Dramatic black border with gradient */}
        <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-r from-[#C15364] via-[#858B95] to-[#C15364] p-1">
          <div className="bg-black h-full w-full"></div>
        </div>

        {/* Inner gradient border */}
        <div className="absolute inset-4 border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black/80 backdrop-blur-sm"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #C15364 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #858B95 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Motivational quote overlay */}
        <div className="absolute top-8 left-8 text-[#C15364] opacity-20 text-6xl font-bold transform -rotate-12">
          &ldquo;
        </div>
        <div className="absolute bottom-8 right-8 text-[#858B95] opacity-20 text-6xl font-bold transform rotate-12">
          &rdquo;
        </div>

        <div className="container mx-auto px-8 text-center relative z-10">
          <AnimatedCard>
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#C15364]/20 to-[#858B95]/20 rounded-full border border-[#C15364]/30 mb-6">
                <span className="text-[#C15364] font-semibold text-sm tracking-wider uppercase">
                  ⚡ Your Transformation Awaits
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Ready to 
                <span className="block bg-gradient-to-r from-[#C15364] to-[#858B95] bg-clip-text text-transparent">
                  Transform Your Life?
                </span>
              </h2>
            </div>
          </AnimatedCard>

          {/* Motivational stats */}
          <AnimatedCard delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 float-animation">
                <div className="text-3xl font-bold text-[#C15364] mb-2">90%</div>
                <div className="text-gray-300 text-sm">See Results in 30 Days</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 float-animation" style={{animationDelay: '0.5s'}}>
                <div className="text-3xl font-bold text-[#C15364] mb-2">24/7</div>
                <div className="text-gray-300 text-sm">Expert Guidance</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 float-animation" style={{animationDelay: '1s'}}>
                <div className="text-3xl font-bold text-[#C15364] mb-2">1000+</div>
                <div className="text-gray-300 text-sm">Success Stories</div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={400}>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands who have already started their fitness journey with V21 Fit. 
              <span className="text-[#C15364] font-semibold"> Your strongest self is waiting</span> &ndash; 
              take the first step today and discover what you&apos;re truly capable of.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={handleSignUp}
                className="group px-10 py-5 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-full hover:shadow-2xl hover:shadow-[#C15364]/40 transform hover:scale-110 transition-all duration-500 text-lg font-bold pulse-glow relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🚀 Sign Up with Google
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <button 
                onClick={handleViewPricing}
                className="group px-10 py-5 bg-black/60 backdrop-blur-md border-2 border-[#C15364]/50 text-white rounded-full hover:bg-[#C15364]/10 hover:border-[#C15364] hover:shadow-lg hover:shadow-[#C15364]/25 transform hover:scale-105 transition-all duration-500 text-lg font-bold"
              >
                <span className="flex items-center gap-3">
                  💳 View Pricing (QR Payment)
                </span>
              </button>
            </div>
          </AnimatedCard>

          {/* Motivational call-out */}
          <AnimatedCard delay={800}>
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-[#C15364]/10 to-[#858B95]/10 backdrop-blur-sm border border-[#C15364]/30 rounded-2xl p-6">
                <p className="text-[#C15364] font-semibold text-lg mb-2">
                  &ldquo;The body achieves what the mind believes&rdquo;
                </p>
                <p className="text-gray-400 text-sm">
                  Don&apos;t wait for tomorrow. Your transformation starts with a single decision today.
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* Urgency indicator */}
          <AnimatedCard delay={1000}>
            <div className="mt-8 flex justify-center items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Limited time offer</span>
              </div>
              <div className="w-1 h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C15364] rounded-full animate-pulse"></div>
                <span>Join 50+ people this week</span>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#C15364]"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#858B95]"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#858B95]"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#C15364]"></div>
      </section>
    </>
  );
};

export default CTASection;