"use client";

import Navbar from "../components/Navbar";
import { Shield, AlertTriangle, Users, MessageCircle, Car, Skull, Ban } from "lucide-react";
import { useLanguage } from "../lib/i18n";

const getRules = (t: (key: string) => string) => [
  {
    icon: Shield,
    title: t('generalRulesTitle'),
    color: "red",
    items: [
      t('rule1'),
      t('rule2'),
      t('rule3'),
      t('rule4'),
      t('rule5')
    ]
  },
  {
    icon: AlertTriangle,
    title: t('rpRulesTitle'),
    color: "orange",
    items: [
      t('rule6'),
      t('rule7'),
      t('rule8'),
      t('rule9'),
      t('rule10')
    ]
  },
  {
    icon: Car,
    title: t('drivingRules'),
    color: "blue",
    items: [
      t('rule11'),
      t('rule12'),
      t('rule13'),
      t('rule14'),
      t('rule15')
    ]
  },
  {
    icon: Skull,
    title: t('combatRules'),
    color: "red",
    items: [
      t('rule16'),
      t('rule17'),
      t('rule18'),
      t('rule19'),
      t('rule20')
    ]
  },
  {
    icon: MessageCircle,
    title: t('chatRules'),
    color: "green",
    items: [
      t('rule21'),
      t('rule22'),
      t('rule23'),
      t('rule24'),
      t('rule25')
    ]
  },
  {
    icon: Ban,
    title: t('penalties'),
    color: "red",
    items: [
      t('rule26'),
      t('rule27'),
      t('rule28'),
      t('rule29'),
      t('rule30')
    ]
  }
];

export default function RulesPage() {
  const { t } = useLanguage();
  const rules = getRules(t);
  
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('rulesTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('rulesDescription')}
          </p>
        </div>
      </section>

      {/* Rules Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rules.map((rule: any, index: number) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#A8956E]/30 transition-all hover:scale-105 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.3)] ${
                  rule.color === 'red' ? 'bg-[#8B7355]' :
                  rule.color === 'orange' ? 'bg-orange-600' :
                  rule.color === 'blue' ? 'bg-blue-600' :
                  rule.color === 'green' ? 'bg-green-600' :
                  'bg-gray-600'
                }`}>
                  <rule.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{rule.title}</h3>
                <ul className="space-y-3">
                  {rule.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-400">
                      <span className="text-[#A8956E] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 px-4 bg-[#C9B896]/10">
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-[#A8956E] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">{t('importantNotice')}</h2>
          <p className="text-gray-400 text-lg mb-8">
            {t('importantNoticeDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/DRG5Jkfvn2"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-gray-300 via-white to-gray-300 hover:from-white hover:via-gray-100 hover:to-white text-black px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              {t('joinDiscord')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2025 Trust State. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </main>
  );
}
