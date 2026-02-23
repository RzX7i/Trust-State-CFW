"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { ShoppingCart, CreditCard, Banknote, Shield, CheckCircle, AlertCircle, X } from "lucide-react";
import { logCartAdd, logCheckoutStart, logStorePurchase } from "../lib/logger";
import { useLanguage } from "../lib/i18n";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  popular?: boolean;
}

const getProducts = (t: (key: string) => string) => [
  // سيارات
  { id: "car_sport", name: t('sportCar'), description: t('sportCarDesc'), price: 30, category: "cars", icon: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop", popular: true },
  { id: "car_luxury", name: t('luxuryCar'), description: t('luxuryCarDesc'), price: 45, category: "cars", icon: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop" },
  { id: "car_offroad", name: t('offroadCar'), description: t('offroadCarDesc'), price: 35, category: "cars", icon: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop" },
  
  // شخصيات
  { id: "skin_police", name: t('policeSkin'), description: t('policeSkinDesc'), price: 15, category: "skins", icon: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=300&fit=crop" },
  { id: "skin_gang", name: t('gangSkin'), description: t('gangSkinDesc'), price: 15, category: "skins", icon: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" },
  { id: "skin_vip", name: t('vipSkin'), description: t('vipSkinDesc'), price: 25, category: "skins", icon: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop" },
  
  // فك باند
  { id: "unban_1", name: t('unbanFirst'), description: t('unbanFirstDesc'), price: 20, category: "unban", icon: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
  { id: "unban_2", name: t('unbanSecond'), description: t('unbanSecondDesc'), price: 40, category: "unban", icon: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop" },
  
  // مقرات ومحلات
  { id: "shop_small", name: t('smallShop'), description: t('smallShopDesc'), price: 60, category: "properties", icon: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop" },
  { id: "shop_large", name: t('largeShop'), description: t('largeShopDesc'), price: 120, category: "properties", icon: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", popular: true },
  { id: "warehouse", name: t('warehouse'), description: t('warehouseDesc'), price: 80, category: "properties", icon: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop" },
  { id: "house", name: t('house'), description: t('houseDesc'), price: 70, category: "properties", icon: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
  { id: "mansion", name: t('mansion'), description: t('mansionDesc'), price: 150, category: "properties", icon: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop" },
];

const getCategories = (t: (key: string) => string) => [
  { id: "all", name: t('all'), icon: "🛍️" },
  { id: "cars", name: t('cars'), icon: "🚗" },
  { id: "skins", name: t('skins'), icon: "👤" },
  { id: "unban", name: t('unban'), icon: "🔓" },
  { id: "properties", name: t('properties'), icon: "🏢" },
];

const getPaymentMethods = (t: (key: string) => string) => [
  { id: "paypal", name: "PayPal", icon: "💳", color: "bg-blue-600" },
  { id: "bank", name: t('bankTransfer'), icon: "🏦", color: "bg-green-600" },
];

export default function StorePage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const products = getProducts(t);
  const categories = getCategories(t);
  const paymentMethods = getPaymentMethods(t);

  useEffect(() => {
    const savedUser = localStorage.getItem('trustStateUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setDiscordUsername(userData.discordUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter((p: Product) => p.category === selectedCategory);

  const addToCart = async (product: Product) => {
    if (!isLoggedIn) {
      alert("يجب تسجيل الدخول أولاً!");
      return;
    }
    setCart([...cart, product]);
    
    // Get user data for logging
    const savedUser = localStorage.getItem('trustStateUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      await logCartAdd(userData.discordId, userData.discordUsername, product.name, product.price);
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = async () => {
    if (!selectedPayment) {
      alert("يرجى اختيار طريقة الدفع");
      return;
    }
    
    // Get user data for logging
    const savedUser = localStorage.getItem('trustStateUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      await logCheckoutStart(userData.discordId, userData.discordUsername, getTotalPrice(), cart.length);
      
      // Log each item purchased
      for (const item of cart) {
        await logStorePurchase(userData.discordId, userData.discordUsername, item.name, item.price);
      }
    }
    
    setOrderComplete(true);
    setCart([]);
  };

  if (orderComplete) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-32 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-green-500/10 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30 text-center">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">تم إرسال الطلب!</h1>
              <p className="text-gray-400 mb-4">
                سيتم مراجعة طلبك والتواصل معك قريباً
              </p>
              <p className="text-green-400 text-sm mb-6">
                Discord: {discordUsername}
              </p>
              <a
                href="/"
                className="block w-full bg-gradient-to-r from-[#C9B896] via-[#E5D9C3] to-[#C9B896] text-white py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                العودة للرئيسية
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-24 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#C9B896]/10 to-black py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('storeTitle')}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('serverFeatures')}
            </p>
            {!isLoggedIn && (
              <div className="mt-6">
                <a
                  href="/login"
                  className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
                >
                  {t('login')}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Cart Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-gray-400">
              {isLoggedIn ? `${discordUsername} 👋` : t('login')}
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{t('cart')}</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9B896] text-white w-6 h-6 rounded-full text-sm flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-[#C9B896] to-[#E5D9C3] text-white shadow-[0_0_20px_rgba(201,184,150,0.5)]"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {t(cat.id)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9B896]/50 transition-all hover:scale-105 group relative"
              >
                {product.popular && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#C9B896] to-[#E5D9C3] text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 {t('popular')}
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.icon} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 text-center">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 text-center">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">{product.price}$</span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!isLoggedIn}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        isLoggedIn
                          ? "bg-gradient-to-r from-[#C9B896] to-[#E5D9C3] hover:from-[#E5D9C3] hover:to-[#F0E8D8] text-white"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isLoggedIn ? t('addToCart') : t('login')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">🛒 {t('cart')}</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t('emptyCart')}</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <img src={item.icon} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="text-white font-semibold">{item.name}</p>
                            <p className="text-green-400">{item.price}$</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-[#C9B896] hover:text-[#E5D9C3]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('total')}:</span>
                      <span className="text-2xl font-bold text-green-400">{getTotalPrice()}$</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-semibold transition-all hover:scale-105"
                  >
                    {t('checkout')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">💳 {t('checkout')}</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 mb-2">{t('paymentMethods')}:</p>
                <div className="space-y-3">
                  {paymentMethods.map((method: any) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                        selectedPayment === method.id
                          ? "border-green-500 bg-green-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-white font-semibold">{method.name}</span>
                      {selectedPayment === method.id && (
                        <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-gray-400 mb-2">ملخص الطلب:</p>
                <p className="text-white">عدد المنتجات: {cart.length}</p>
                <p className="text-2xl font-bold text-green-400 mt-2">{getTotalPrice()}$</p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300 text-sm">
                    بعد إتمام الطلب، سيتم التواصل معك عبر Discord لإتمام عملية الدفع
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                تأكيد الطلب
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
