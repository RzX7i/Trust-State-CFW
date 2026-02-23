"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import { logLogin } from "../lib/logger";
import { useLanguage } from "../lib/i18n";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [discordUsername, setDiscordUsername] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [discordAvatar, setDiscordAvatar] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Check if already logged in or redirected from Discord OAuth
  useEffect(() => {
    const savedUser = localStorage.getItem('trustStateUser');
    if (savedUser) {
      setIsVerified(true);
      const userData = JSON.parse(savedUser);
      setDiscordUsername(userData.discordUsername);
      setDiscordId(userData.discordId);
      setDiscordAvatar(userData.avatar);
      return;
    }

    // Check for OAuth callback data
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');
    
    if (errorParam === 'not_in_guild') {
      setError(`❌ ${t('notInServer')}. ${t('joinToContinue')}!`);
      return;
    }
    
    if (userParam) {
      (async () => {
        try {
          const userData = JSON.parse(Buffer.from(userParam, 'base64').toString());
          setDiscordUsername(userData.discordUsername);
          setDiscordId(userData.discordId);
          setDiscordAvatar(`https://cdn.discordapp.com/avatars/${userData.discordId}/${userData.avatar}.png`);
          
          // Save to localStorage
          localStorage.setItem('trustStateUser', JSON.stringify({
            discordUsername: userData.discordUsername,
            discordId: userData.discordId,
            avatar: `https://cdn.discordapp.com/avatars/${userData.discordId}/${userData.avatar}.png`,
            loginDate: new Date().toISOString()
          }));
          
          // Send login log
          await logLogin(userData.discordId, userData.discordUsername);
          
          setIsVerified(true);
          
          // Clean URL
          router.replace('/login');
        } catch (err) {
          setError(`❌ ${t('error')}`);
        }
      })();
    }
  }, [searchParams, router]);

  const handleDiscordLogin = () => {
    // Redirect to Discord OAuth
    window.location.href = "/api/auth/discord";
  };

  const handleLogout = () => {
    localStorage.removeItem('trustStateUser');
    setIsVerified(false);
    setDiscordUsername("");
    setDiscordId("");
    setDiscordAvatar("");
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-green-500/30 text-center">
            {/* Discord Avatar */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                {discordAvatar ? (
                  <img 
                    src={discordAvatar} 
                    alt="Discord Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                {t('youAreLoggedIn')} ✅
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">{t('welcome')}!</h1>
            <p className="text-gray-400 mb-4">
              {discordUsername} 👋
            </p>
            <p className="text-green-400 text-sm mb-6">
              {t('youAreLoggedIn')}
            </p>
            <a
              href="/"
              className="block w-full bg-gradient-to-r from-[#8B7355] via-[#C9B896] to-[#8B7355] text-black py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(201,184,150,0.5)] mb-4"
            >
              {t('goToHome')}
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-400 text-sm underline"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#C9B896]/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C9B896]/10 via-transparent to-transparent" />
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo.jpg"
            alt="Trust State Logo"
            width={100}
            height={100}
            className="mx-auto mb-4 rounded-2xl shadow-[0_0_30px_rgba(201,184,150,0.5)]"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Trust State</h1>
          <p className="text-gray-400">{t('examTitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8B7355] to-[#C9B896] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(201,184,150,0.5)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t('loginTitle')}</h2>
            <p className="text-gray-400 text-sm">
              {t('loginDescription')}
            </p>
          </div>

          {error && (
            <div className="bg-[#C9B896]/20 border border-[#C9B896]/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-[#C9B896] flex-shrink-0" />
                <p className="text-[#E5D9C3] text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Discord OAuth Login Button */}
          <button
            onClick={handleDiscordLogin}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-3 mb-4"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            {t('loginWithDiscord')}
          </button>

          <p className="text-gray-500 text-sm text-center mb-6">
            {t('loginDescription')}
          </p>

          {/* Not a member? */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm text-center mb-4">
              {t('notInServer')}?
            </p>
            <a
              href="https://discord.gg/DRG5Jkfvn2"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              {t('joinServer')}
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          {t('copyright')}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
