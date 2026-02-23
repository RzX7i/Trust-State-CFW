"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import { useLanguage } from "./lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            {t('copyright')}
          </p>
        </div>
      </footer>
    </main>
  );
}
