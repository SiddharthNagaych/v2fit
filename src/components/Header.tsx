"use client";

import React, { useState } from "react";
import { Menu, X, UserCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectCartCount } from "../store/slices/cartSlice"; // Adjust path as needed

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const cartCount = useSelector(selectCartCount);

  const navigationItems = [
    { href: "/programs", label: "Programs" },
    { href: "/schedule", label: "Schedule" },
    { href: "/gyms", label: "Gyms" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-black">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo1.png" alt="V21 Fit Logo" width={120} height={120} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#858B95] hover:text-[#C15364] transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-[#C15364] hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {status === "authenticated" ? (
              <>
                {session?.user?.role === "ADMIN" && (
                  <Link href="/admin/dashboard">
                    <button className="px-4 py-2 text-[#C15364] hover:text-white transition-colors duration-300">
                      Admin Panel
                    </button>
                  </Link>
                )}
                <Link href="/profile">
                  <UserCircle className="w-7 h-7 text-[#C15364] hover:text-white" />
                </Link>
                <button
                  className="px-4 py-2 text-[#858B95] hover:text-[#C15364] transition-colors duration-300"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/Sign-In">
                  <button className="px-4 py-2 text-[#858B95] hover:text-[#C15364] transition-colors duration-300">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/Sign-Up">
                  <button className="px-6 py-2 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 backdrop-blur-md">
            <div className="flex flex-col space-y-4 pt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-1 text-[#858B95] hover:text-[#C15364] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Cart link for mobile */}
              <Link
                href="/cart"
                className="flex items-center space-x-2 px-2 py-1 text-[#858B95] hover:text-[#C15364]"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {status === "authenticated" ? (
                <>
                  {session?.user?.role === "ADMIN" && (
                    <Link href="/admin/dashboard">
                      <button
                        className="px-4 py-2 text-[#C15364] hover:text-white transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/Sign-Up">
                  <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white rounded-full">
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
