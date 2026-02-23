"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";
import { Server, Shield, Users, MessageCircle, Gamepad2 } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Image
            src="/logo.jpg"
            alt="Trust State Logo"
            width={150}
            height={150}
            className="mx-auto mb-8 rounded-2xl"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('aboutDescription')}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">{t('whoWeAre')}</h2>
              <p className="text-gray-400 leading-relaxed">
                {t('aboutText1')}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t('aboutText2')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Server className="w-10 h-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{t('powerfulServer')}</h3>
                <p className="text-gray-500 text-sm">{t('powerfulServerDesc')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Shield className="w-10 h-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{t('advancedProtection')}</h3>
                <p className="text-gray-500 text-sm">{t('advancedProtectionDesc')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Users className="w-10 h-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{t('activeCommunity')}</h3>
                <p className="text-gray-500 text-sm">{t('activeCommunityDesc')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <MessageCircle className="w-10 h-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{t('technicalSupport')}</h3>
                <p className="text-gray-500 text-sm">{t('technicalSupportDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CFW System */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cfwSystem')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('cfwSystemDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">{t('playerManagement')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li>{t('banSystem')}</li>
                <li>{t('violationsLog')}</li>
                <li>{t('warningSystem')}</li>
                <li>{t('playerTracking')}</li>
              </ul>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">{t('adminTools')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li>{t('examSystem')}</li>
                <li>{t('autoRoles')}</li>
                <li>{t('activityLog')}</li>
                <li>{t('reports')}</li>
              </ul>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">{t('economySystem')}</h3>
              <ul className="space-y-3 text-gray-400">
                <li>{t('jobs')}</li>
                <li>{t('businesses')}</li>
                <li>{t('banking')}</li>
                <li>{t('realEstate')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-20 h-20 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('joinUsToday')}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {t('serverFeatures')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </section>

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
