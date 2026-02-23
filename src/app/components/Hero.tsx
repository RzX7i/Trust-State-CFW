"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../lib/i18n";

export default function Hero() {
  const { t, language } = useLanguage();
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Image
          src="/logo.jpg"
          alt=""
          width={800}
          height={800}
          className="object-contain"
        />
      </div>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#C9B896]/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C9B896]/10 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fadeIn">
          <Image
            src="/logo.jpg"
            alt="Trust State Logo"
            width={200}
            height={200}
            className="mx-auto mb-8 rounded-2xl"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
           {t('serverName')}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-4">
            {t('serverDescription')}
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {t('serverFeatures')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/exam"
              className="bg-gradient-to-r from-[#C9B896] via-[#E5D9C3] to-[#C9B896] hover:from-[#E5D9C3] hover:via-[#F0E8D8] hover:to-[#E5D9C3] text-black px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(201,184,150,0.5)] hover:shadow-[0_0_50px_rgba(201,184,150,0.7)]"
            >
              {t('startExam')}
            </Link>
            
            {/* FIVEM JOIN BUTTON HIDDEN - Uncomment to show */}
            {/* <a
              href="fivem://connect/your-server-ip"
              className="bg-gradient-to-r from-[#C9B896] via-[#E5D9C3] to-[#C9B896] hover:from-[#E5D9C3] hover:via-[#F0E8D8] hover:to-[#E5D9C3] text-black px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(201,184,150,0.5)] hover:shadow-[0_0_50px_rgba(201,184,150,0.7)]"
            >
              🎮 {t('enterServer')}
            </a> */}
            
            <a
              href="https://discord.gg/DRG5Jkfvn2"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-gray-300 via-white to-gray-300 hover:from-white hover:via-gray-100 hover:to-white text-black px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
            >
              {t('joinServer')}
            </a>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-bold text-white mb-2">800+</div>
            <div className="text-gray-400">{t('activePlayers')}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">{t('support')}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-4xl font-bold text-white mb-2">{t('completeStore')}</div>
            <div className="text-gray-400">{t('complete')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
