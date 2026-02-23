"use client";

import { ShoppingCart, Car, Home, Shield } from "lucide-react";
import { useLanguage } from "../lib/i18n";

const getFeatures = (t: (key: string) => string) => [
  {
    icon: ShoppingCart,
    title: t('completeStoreTitle'),
    description: t('completeStoreTitleDesc')
  },
  {
    icon: Car,
    title: t('exclusiveCarsTitle'),
    description: t('exclusiveCarsTitleDesc')
  },
  {
    icon: Home,
    title: t('propertiesAndShopsTitle'),
    description: t('propertiesAndShopsTitleDesc')
  },
  {
    icon: Shield,
    title: t('securePaymentFeature'),
    description: t('securePaymentFeatureDesc')
  }
];

export default function Features() {
  const { t } = useLanguage();
  const features = getFeatures(t);
  
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('storeFeatures')}
          </h2>
          <p className="text-gray-500 text-lg">
            {t('storeFeaturesDesc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all hover:scale-105 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
