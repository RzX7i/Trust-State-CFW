"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "../lib/i18n";

interface UserData {
  discordUsername: string;
  discordId: string;
  avatar?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const savedUser = localStorage.getItem('trustStateUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('trustStateUser');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Trust State Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Trust State
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              {t('home')}
            </Link>
            {/* STORE HIDDEN - Uncomment to show */}
            {/* <Link href="/store" className="text-gray-300 hover:text-white transition-colors">
              {t('store')}
            </Link> */}
            <Link href="/exam" className="text-gray-300 hover:text-white transition-colors">
              {t('exam')}
            </Link>
            <Link href="/rules" className="text-gray-300 hover:text-white transition-colors">
              {t('rules')}
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              {t('about')}
            </Link>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all text-sm font-semibold"
          >
            {language === 'ar' ? '🇬🇧 EN' : '🇸🇦 عربي'}
          </button>

          {/* User Profile or Join Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full pl-4 pr-2 py-1">
                <span className="text-gray-300 text-sm hidden sm:block">{user.discordUsername}</span>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <img 
                    src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <a
              href="https://discord.gg/DRG5Jkfvn2"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#C9B896] via-[#E5D9C3] to-[#C9B896] hover:from-[#E5D9C3] hover:via-[#F0E8D8] hover:to-[#E5D9C3] text-black px-6 py-2 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(201,184,150,0.4)]"
            >
              {t('joinUs')}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
