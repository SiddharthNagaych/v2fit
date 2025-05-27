import React from 'react';
import { AnimatedCard } from './shared/index';

const CTASection: React.FC = () => {
  const handleSignUp = (): void => {
    // Handle Google sign up logic
    console.log('Sign up with Google');
  };

  const handleViewPricing = (): void => {
    // Handle view pricing/QR payment logic
    console.log('View pricing');
  };

  // Fixed SVG background URL by escaping quotes
  const svgBackground = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C15364' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={svgBackground}
      ></div>
      
      <div className="container mx-auto px-6 text-center relative">
        <AnimatedCard>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands who have already started their fitness journey with V21 Fit
          </p>
        </AnimatedCard>
        
        <AnimatedCard delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleSignUp}
              className="px-8 py-4 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg font-semibold"
            >
              Sign Up with Google
            </button>
            <button 
              onClick={handleViewPricing}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-lg font-semibold"
            >
              View Pricing (QR Payment)
            </button>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

export default CTASection;