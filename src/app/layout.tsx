"use client";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={` antialiased`}>
          <ReduxProvider >
            <Header />
            {children}
            <Toaster position="bottom-right" reverseOrder={false} />
            <Footer />
          </ReduxProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
