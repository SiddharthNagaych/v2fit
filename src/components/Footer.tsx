// components/Footer.tsx
import React from 'react';
import { AnimatedCard } from './shared/index';

interface FooterLink {
  text: string;
  href?: string;
  onClick?: () => void;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const footerSections: FooterSection[] = [
    {
      title: "Programs",
      links: [
        { text: "Fat Loss", href: "#programs" },
        { text: "Muscle Gain", href: "#programs" },
        { text: "Mental Fitness", href: "#programs" },
        { text: "Health Talks", href: "#programs" }
      ]
    },
    {
      title: "Schedule",
      links: [
        { text: "Weekday Programs", href: "schedule" },
        { text: "Personal Training", href: "schedule" },
        { text: "Group Sessions", href: "schedule" }
      ]
    },
    {
      title: "Contact",
      links: [
        { text: "Find Locations", href: "#gyms" },
        { text: "Support", onClick: () => window.location.href="mailto:sidnagaych4321@gmail.com" },
      
      ]
    }
  ];

  const handleLinkClick = (link: FooterLink): void => {
    if (link.onClick) {
      link.onClick();
    }
  };

  return (
    <footer className="bg-black text-white py-12 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <AnimatedCard>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C15364] to-[#858B95] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V21</span>
                </div>
                <span className="font-bold text-xl">V21 Fit</span>
              </div>
              <p className="text-gray-400">Empower Your Strength, Elevate Your Life</p>
            </div>
          </AnimatedCard>
          
          {footerSections.map((section, index) => (
            <AnimatedCard key={section.title} delay={(index + 1) * 100}>
              <div>
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href ? (
                        <a 
                          href={link.href}
                          className="hover:text-[#C15364] transition-colors cursor-pointer"
                        >
                          {link.text}
                        </a>
                      ) : (
                        <button
                          onClick={() => handleLinkClick(link)}
                          className="hover:text-[#C15364] transition-colors cursor-pointer text-left"
                        >
                          {link.text}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>
          ))}
        </div>
        
        <AnimatedCard delay={400}>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 V21 Fit. All rights reserved.</p>
          </div>
        </AnimatedCard>
      </div>
    </footer>
  );
};

export default Footer;