import React from 'react';
import Image from 'next/image';

const AnimatedCard = ({ children: children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function HeroSection() {
  return (
    <>
      
      
      <section className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center mt-2">
        {/* Background gradient overlay */}
       <div className="absolute inset-0">
        <Image
          src="/gym5.webp"
          alt="Fitness background"
          layout="fill"
          objectFit="cover"
          quality={75}
          priority={false} // This enables lazy loading
          className="opacity-70"
          loading='lazy'
        />
      </div>
        
       
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedCard delay={200}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Transform Your
                <span className="block bg-gradient-to-r from-[#C15364] to-[#858B95] bg-clip-text text-transparent">
                  Fitness Journey
                </span>
              </h1>
            </AnimatedCard>
                     
            <AnimatedCard delay={400}>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience comprehensive fitness programs designed for fat loss, muscle gain, and mental wellness. 
                Join our community and unlock your full potential.
              </p>
            </AnimatedCard>
                     
            <AnimatedCard delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-full hover:shadow-lg hover:shadow-[#C15364]/25 transform hover:scale-105 transition-all duration-300 text-lg font-semibold">
                  Start Your Journey
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-lg font-semibold">
                  Explore Programs
                </button>
              </div>
            </AnimatedCard>

            {/* Additional motivational elements */}
            <AnimatedCard delay={800}>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#C15364] mb-2">500+</div>
                  <div className="text-gray-400 text-sm">Success Stories</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#C15364] mb-2">24/7</div>
                  <div className="text-gray-400 text-sm">Expert Support</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#C15364] mb-2">100%</div>
                  <div className="text-gray-400 text-sm">Results Guaranteed</div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#C15364] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-[#858B95] rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-[#C15364] rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
      </section>
    </>
  );
}