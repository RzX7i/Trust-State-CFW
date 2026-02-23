"use client";

import { useState, useEffect } from "react";
import { questions, PASSING_SCORE, DISCORD_ROLE_NAME } from "../data/questions";
import { CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { logExamStart } from "../lib/logger";
import { useLanguage } from "../lib/i18n";

export default function ExamPage() {
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [discordUsername, setDiscordUsername] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success: boolean; message: string} | null>(null);
  const [hasTakenExam, setHasTakenExam] = useState(false);
  const [previousResult, setPreviousResult] = useState<{score: number; passed: boolean; date: string} | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{discordUsername: string; discordId: string} | null>(null);

  // Check if user is logged in and has taken exam
  useEffect(() => {
    const savedUser = localStorage.getItem('trustStateUser');
    const examTaken = localStorage.getItem('trustStateExamTaken');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      setDiscordUsername(parsedUser.discordUsername);
      setDiscordId(parsedUser.discordId);
    }
    
    if (examTaken) {
      setHasTakenExam(true);
      setPreviousResult(JSON.parse(examTaken));
    }
  }, []);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= PASSING_SCORE) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-[#C9B896]";
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (discordUsername && discordId) {
      setIsRegistered(true);
    }
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  // Submit result to Discord API when exam is completed
  useEffect(() => {
    if (showResults) {
      const score = calculateScore();
      const passed = score >= PASSING_SCORE;
      
      // Save result to localStorage to prevent retaking
      const resultData = {
        score,
        passed,
        date: new Date().toLocaleDateString('ar-SA'),
        discordUsername
      };
      localStorage.setItem('trustStateExamTaken', JSON.stringify(resultData));
      setHasTakenExam(true);
      setPreviousResult(resultData);
      
      if (passed) {
        submitToDiscord(score, passed);
      }
    }
  }, [showResults]);

  // Function to clear exam data (for testing purposes)
  const clearExamData = () => {
    localStorage.removeItem('trustStateExamTaken');
    setHasTakenExam(false);
    setPreviousResult(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsRegistered(false);
    setDiscordUsername("");
    setDiscordId("");
    window.location.reload();
  };

  const submitToDiscord = async (score: number, passed: boolean) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discordId,
          discordUsername,
          score,
          passed,
        }),
      });

      const data = await response.json();
      setSubmitResult({
        success: data.success,
        message: data.message,
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "حدث خطأ أثناء إرسال النتيجة. يرجى التواصل مع الإدارة.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show message if user has already taken the exam
  if (hasTakenExam && previousResult) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-32 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className={`backdrop-blur-sm rounded-3xl p-8 border ${
              previousResult.passed 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-[#A8956E]/10 border-[#A8956E]/30"
            }`}>
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  previousResult.passed 
                    ? "bg-green-500/20" 
                    : "bg-[#A8956E]/20"
                }`}>
                  {previousResult.passed ? (
                    <Trophy className="w-10 h-10 text-green-400" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-[#C9B896]" />
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {previousResult.passed ? t('youPassed') : t('youTookExam')}
                </h1>
                <p className="text-gray-400">
                  {t('cannotRetake')}
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className={`text-5xl font-bold ${
                  previousResult.passed ? "text-green-400" : "text-[#C9B896]"
                }`}>
                  {previousResult.score}%
                </div>
                <p className="text-gray-400">
                  {t('examDate')}: {previousResult.date}
                </p>
                {previousResult.passed ? (
                  <p className="text-green-300">
                    {t('congratulations')}
                  </p>
                ) : (
                  <p className="text-[#C9B896] 300">
                    {t('unfortunatelyFailed')}
                  </p>
                )}
                <a
                  href="/"
                  className="block w-full bg-gradient-to-r from-[#8B7355] via-[#A8956E] to-[#8B7355] text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 mt-6"
                >
                  {t('backToHome')}
                </a>
                
                {/* Reset button for testing - remove in production */}
                <button
                  onClick={clearExamData}
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 rounded-xl font-semibold transition-all mt-4 text-sm"
                >
                  🔄 {t('clearData')} {t('forTestingOnly')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isRegistered) {
    // If user is logged in, show ready screen instead of form
    if (isLoggedIn && userData) {
      return (
        <>
          <Navbar />
          <div className="min-h-screen bg-black pt-32 pb-20 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">{t('readyForTest')}</h1>
                  <p className="text-gray-400">
                    {t('hello')} {userData.discordUsername} 👋
                  </p>
                  <p className="text-[#C9B896] text-sm mt-2">
                    ⚠️ {t('examOnceOnly')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-gray-300 text-sm mb-1">{t('username')}</p>
                    <p className="text-white font-semibold">{userData.discordUsername}</p>
                  </div>
                  
                  <button
                    onClick={async () => {
                      await logExamStart(userData.discordId, userData.discordUsername);
                      setIsRegistered(true);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-semibold transition-all hover:scale-105"
                  >
                    {t('startTestNow')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    // If not logged in, redirect to login
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-32 pb-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#6B5A45] to-[#8B7355] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(201,184,150,0.5)]">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{t('mustLogin')}</h1>
                <p className="text-gray-400">
                  {t('loginToContinue')}
                </p>
              </div>

              <a
                href="/login"
                className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 rounded-xl font-semibold transition-all hover:scale-105 text-center"
              >
                {t('loginWithDiscord')}
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= PASSING_SCORE;

    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              {passed ? (
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-12 h-12 text-green-400" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-[#A8956E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-[#C9B896]" />
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {passed ? "تهانينا! لقد نجحت" : "لم تنجح هذه المرة"}
              </h1>
              
              <div className={`text-6xl font-bold ${getScoreColor(score)} my-6`}>
                {score}%
              </div>
              
              <p className="text-gray-400 text-lg">
                {passed 
                  ? `لقد اجتزت الاختبار بنجاح! سيتم منحك رتبة "${DISCORD_ROLE_NAME}" في Discord.`
                  : `يجب أن تحصل على ${PASSING_SCORE}% على الأقل للنجاح. حاول مرة أخرى!`
                }
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">تفاصيل الإجابات:</h3>
              {questions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect 
                        ? "bg-green-500/10 border-green-500/30" 
                        : "bg-[#A8956E]/10 border-[#A8956E]/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#C9B896] flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 text-right">
                        <p className="text-white font-medium mb-2">{q.question}</p>
                        <p className="text-sm text-gray-400">
                          إجابتك: <span className={isCorrect ? "text-green-400" : "text-[#C9B896]"}>
                            {q.options[userAnswer]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-400 mt-1">
                            الإجابة الصحيحة: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!passed && (
              <div className="bg-[#A8956E]/20 border border-[#A8956E]/30 rounded-xl p-6 text-center">
                <p className="text-[#C9B896] 300 mb-2">⚠️ {t('cannotRetakeExam')}</p>
                <p className="text-gray-400 text-sm">
                  {t('examOnceOnly')}. {t('contactAdmin')}.
                </p>
              </div>
            )}

            {passed && (
              <div className={`rounded-xl p-6 text-center ${
                submitResult?.success 
                  ? "bg-green-500/20 border border-green-500/30" 
                  : "bg-[#A8956E]/30 border border-[#A8956E]/50 shadow-[0_0_20px_rgba(201,184,150,0.3)]"
              }`}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-[#A8956E] animate-spin" />
                    <p className="text-[#C9B896] font-semibold">{t('sending')}</p>
                  </div>
                ) : (
                  <>
                    <p className={`mb-2 ${submitResult?.success ? "text-green-300" : "text-[#C9B896] font-semibold"}`}>
                      {submitResult?.message || t('resultSent')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {submitResult?.success 
                        ? t('resultSentDesc')
                        : t('contactAdmin')
                      }
                    </p>
                  </>
                )}
                <div className="mt-4 p-3 bg-black/30 rounded-lg">
                  <p className="text-gray-300 text-sm">Discord: {discordUsername}</p>
                  <p className="text-gray-300 text-sm">ID: {discordId}</p>
                  <p className="text-gray-300 text-sm">{t('yourScore')}: {score}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-gray-400 mb-2">
              <span>{t('question')} {currentQuestion + 1} {t('of')} {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gray-600 to-gray-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="mb-2">
              <span className="inline-block bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">
                {question.category}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-8 text-right">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl border text-right transition-all ${
                    selectedAnswer === index
                      ? "bg-white/20 border-white/40 text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? "border-white bg-white"
                        : "border-gray-500"
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 rounded-full bg-black" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`w-full mt-8 py-4 rounded-xl font-semibold transition-all ${
                selectedAnswer !== null
                  ? "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white hover:scale-105"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentQuestion === questions.length - 1 ? t('finish') : t('next')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
