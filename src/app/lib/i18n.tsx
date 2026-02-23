"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  home: { ar: 'الرئيسية', en: 'Home' },
  store: { ar: 'المتجر', en: 'Store' },
  exam: { ar: 'الاختبار', en: 'Exam' },
  rules: { ar: 'القوانين', en: 'Rules' },
  about: { ar: 'عن السيرفر', en: 'About' },
  login: { ar: 'تسجيل الدخول', en: 'Login' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout' },
  joinUs: { ar: 'انضم لنا', en: 'Join Us' },
  serverName: { ar: 'Trust State', en: 'Trust State' },
  serverDescription: { ar: 'سيرفر FiveM - متجر متكامل', en: 'FiveM Server - Complete Store' },
  serverFeatures: { ar: 'اشتري سيارات، مقرات، زيارات واكثر! متجر متكامل للسيرفر', en: 'Buy cars, properties, outfits and more! Complete server store' },
  startExam: { ar: 'ابدأ اختبار الإدارة', en: 'Start Admin Exam' },
  joinServer: { ar: 'انضم لسيرفر Discord', en: 'Join Discord Server' },
  enterServer: { ar: 'الدخول للسيرفر FiveM', en: 'Enter FiveM Server' },
  activePlayers: { ar: 'لاعب نشط', en: 'Active Players' },
  support: { ar: 'دعم فني', en: '24/7 Support' },
  completeStore: { ar: 'متجر متكامل', en: 'Complete Store' },
  complete: { ar: 'متكامل', en: 'Complete' },
  storeTitle: { ar: 'متجر Trust State', en: 'Trust State Store' },
  storeSubtitle: { ar: 'احصل على أفضل العناصر للسيرفر', en: 'Get the best items for the server' },
  cart: { ar: 'السلة', en: 'Cart' },
  addToCart: { ar: 'أضف للسلة', en: 'Add to Cart' },
  checkout: { ar: 'إتمام الشراء', en: 'Checkout' },
  emptyCart: { ar: 'السلة فارغة', en: 'Cart is Empty' },
  total: { ar: 'المجموع', en: 'Total' },
  all: { ar: 'الكل', en: 'All' },
  cars: { ar: 'السيارات', en: 'Cars' },
  skins: { ar: 'الشخصيات', en: 'Characters' },
  unban: { ar: 'فك الباند', en: 'Unban' },
  properties: { ar: 'المقرات', en: 'Properties' },
  popular: { ar: 'الأكثر مبيعاً', en: 'Popular' },
  examTitle: { ar: 'اختبار الإدارة', en: 'Admin Exam' },
  examDescription: { ar: 'اختبر معرفتك للقوانين والأنظمة', en: 'Test your knowledge of rules and systems' },
  readyForTest: { ar: 'أنت جاهز للاختبار!', en: 'You are ready for the test!' },
  startTestNow: { ar: 'ابدأ الاختبار الآن', en: 'Start Test Now' },
  question: { ar: 'سؤال', en: 'Question' },
  of: { ar: 'من', en: 'of' },
  next: { ar: 'التالي', en: 'Next' },
  previous: { ar: 'السابق', en: 'Previous' },
  submit: { ar: 'إرسال', en: 'Submit' },
  passed: { ar: 'نجحت!', en: 'Passed!' },
  failed: { ar: 'لم تنجح', en: 'Failed' },
  score: { ar: 'النتيجة', en: 'Score' },
  correctAnswers: { ar: 'إجابات صحيحة', en: 'Correct Answers' },
  backToHome: { ar: 'العودة للرئيسية', en: 'Back to Home' },
  copyright: { ar: '© 2025 Trust State. جميع الحقوق محفوظة.', en: '© 2025 Trust State. All rights reserved.' },
  
  // Exam Page
  youPassed: { ar: 'لقد اجتزت الاختبار!', en: 'You Passed the Exam!' },
  youTookExam: { ar: 'لقد أجريت الاختبار مسبقاً', en: 'You Already Took the Exam' },
  cannotRetake: { ar: 'لا يمكن إعادة الاختبار أكثر من مرة واحدة', en: 'You cannot retake the exam more than once' },
  examDate: { ar: 'تاريخ الاختبار', en: 'Exam Date' },
  congratulations: { ar: 'تهانينا! لقد نجحت في الاختبار', en: 'Congratulations! You passed the exam' },
  unfortunatelyFailed: { ar: 'للأسف لم تنجح في الاختبار', en: 'Unfortunately, you did not pass the exam' },
  hello: { ar: 'مرحباً', en: 'Hello' },
  notInServer: { ar: 'أنت لست عضواً في سيرفر Discord', en: 'You are not a member of the Discord server' },
  joinToContinue: { ar: 'انضم للسيرفر للمتابعة', en: 'Join the server to continue' },
  enterDiscordUsername: { ar: 'أدخل اسم المستخدم في Discord', en: 'Enter your Discord username' },
  enterDiscordId: { ar: 'أدخل معرف Discord', en: 'Enter your Discord ID' },
  howToGetId: { ar: 'كيفية الحصول على المعرف؟', en: 'How to get your ID?' },
  sending: { ar: 'جاري الإرسال...', en: 'Sending...' },
  resultSent: { ar: 'تم إرسال النتيجة', en: 'Result Sent' },
  resultSentDesc: { ar: 'تم إرسال نتيجتك إلى Discord', en: 'Your result has been sent to Discord' },
  error: { ar: 'خطأ', en: 'Error' },
  errorSending: { ar: 'حدث خطأ أثناء إرسال النتيجة', en: 'An error occurred while sending the result' },
  contactAdmin: { ar: 'يرجى التواصل مع الإدارة', en: 'Please contact the administration' },
  tryAgain: { ar: 'حاول مرة أخرى', en: 'Try Again' },
  yourScore: { ar: 'نتيجتك', en: 'Your Score' },
  correct: { ar: 'صحيح', en: 'Correct' },
  wrong: { ar: 'خطأ', en: 'Wrong' },
  viewAnswers: { ar: 'عرض الإجابات', en: 'View Answers' },
  hideAnswers: { ar: 'إخفاء الإجابات', en: 'Hide Answers' },
  yourAnswer: { ar: 'إجابتك', en: 'Your Answer' },
  correctAnswer: { ar: 'الإجابة الصحيحة', en: 'Correct Answer' },
  cannotRetakeExam: { ar: 'لا يمكن إعادة الاختبار', en: 'Cannot Retake Exam' },
  clearData: { ar: 'مسح البيانات وإعادة الاختبار', en: 'Clear Data and Retake' },
  forTestingOnly: { ar: '(للاختبار فقط)', en: '(For testing only)' },
  examOnceOnly: { ar: 'يمكنك إجراء الاختبار مرة واحدة فقط', en: 'You can take the exam only once' },
  username: { ar: 'اسم المستخدم', en: 'Username' },
  mustLogin: { ar: 'يجب تسجيل الدخول', en: 'Must Login' },
  loginToContinue: { ar: 'يرجى تسجيل الدخول بحساب Discord للمتابعة', en: 'Please login with Discord to continue' },
  finish: { ar: 'إنهاء', en: 'Finish' },
  
  // Exam Questions Categories
  realScenarios: { ar: 'سيناريوهات واقعية', en: 'Real Scenarios' },
  adminDuties: { ar: 'واجبات الإداري', en: 'Admin Duties' },
  technicalKnowledge: { ar: 'المعرفة التقنية', en: 'Technical Knowledge' },
  
  // Rules Page
  rulesTitle: { ar: 'قوانين Trust State', en: 'Trust State Rules' },
  rulesDescription: { ar: 'للحفاظ على بيئة لعب صحية وممتعة للجميع، يجب الالتزام بهذه القوانين', en: 'To maintain a healthy and enjoyable gaming environment for everyone, these rules must be followed' },
  importantNotice: { ar: 'تنبيه مهم', en: 'Important Notice' },
  importantNoticeDesc: { ar: 'عدم معرفة القوانين لا يعفيك من المسؤولية. بالدخول إلى السيرفر، أنت توافق على الالتزام بجميع هذه القوانين. الإدارة تحتفظ بحق تعديل القوانين في أي وقت.', en: 'Not knowing the rules does not exempt you from responsibility. By entering the server, you agree to comply with all these rules. The administration reserves the right to modify the rules at any time.' },
  joinDiscord: { ar: 'انضم لسيرفر Discord', en: 'Join Discord Server' },
  generalRulesTitle: { ar: 'قوانين عامة', en: 'General Rules' },
  rpRulesTitle: { ar: 'قوانين RP', en: 'RP Rules' },
  drivingRules: { ar: 'قوانين القيادة', en: 'Driving Rules' },
  combatRules: { ar: 'قوانين القتال', en: 'Combat Rules' },
  chatRules: { ar: 'قوانين الشات', en: 'Chat Rules' },
  penalties: { ar: 'عقوبات المخالفات', en: 'Violation Penalties' },
  
  // General Rules Items
  rule1: { ar: 'احترام جميع اللاعبين بدون استثناء', en: 'Respect all players without exception' },
  rule2: { ar: 'عدم استخدام الغش أو الهكات بأي شكل', en: 'No cheating or hacks of any kind' },
  rule3: { ar: 'الالتزام بقوانين Roleplay في جميع الأوقات', en: 'Follow Roleplay rules at all times' },
  rule4: { ar: 'عدم التعرض للاعبين بشكل غير منطقي (RDM/VDM)', en: 'Do not attack players unreasonably (RDM/VDM)' },
  rule5: { ar: 'عدم استخدام معلومات OOC داخل اللعبة (Metagaming)', en: 'Do not use OOC information in-game (Metagaming)' },
  
  // RP Rules Items
  rule6: { ar: 'Fear RP: يجب تقدير حياة شخصيتك والخوف عليها', en: 'Fear RP: Value your character life and fear for it' },
  rule7: { ar: 'New Life Rule: إذا مت تنسى ما حدث في السيناريو السابق', en: 'New Life Rule: If you die, forget what happened in the previous scenario' },
  rule8: { ar: 'Power Gaming: ممنوع استغلال الأخطاء أو اللعب بقوة غير عادلة', en: 'Power Gaming: No exploiting bugs or playing with unfair power' },
  rule9: { ar: 'Combat Logging: ممنوع الخروج أثناء القتال', en: 'Combat Logging: No logging out during combat' },
  rule10: { ar: 'Valid RP: يجب وجود سبب منطقي لأي عملية قتل أو سرقة', en: 'Valid RP: Must have a valid reason for any kill or robbery' },
  
  // Driving Rules Items
  rule11: { ar: 'السرعة داخل المدينة: 80 كم/س كحد أقصى', en: 'City speed limit: 80 km/h maximum' },
  rule12: { ar: 'السرعة خارج المدينة: 120 كم/س كحد أقصى', en: 'Highway speed limit: 120 km/h maximum' },
  rule13: { ar: 'ممنوع القيادة المتهورة بدون سبب RP', en: 'No reckless driving without RP reason' },
  rule14: { ar: 'VDM ممنوع: لا تدهس اللاعبين بالسيارة', en: 'VDM prohibited: Do not run over players with vehicles' },
  rule15: { ar: 'الالتزام بإشارات المرور في المناطق المأهولة', en: 'Obey traffic signals in populated areas' },
  
  // Combat Rules Items
  rule16: { ar: 'RDM ممنوع: لا تقتل بدون سبب RP منطقي', en: 'RDM prohibited: Do not kill without valid RP reason' },
  rule17: { ar: 'يجب إعطاء تهديد واضح قبل القتل', en: 'Must give clear warning before killing' },
  rule18: { ar: 'ممنوع القتل في المناطق الآمنة', en: 'No killing in safe zones' },
  rule19: { ar: 'يجب الانتظار 15 دقيقة بين السيناريوهات', en: 'Must wait 15 minutes between scenarios' },
  rule20: { ar: 'عدم الانتقام فوراً بعد الموت (New Life Rule)', en: 'No immediate revenge after death (New Life Rule)' },
  
  // Chat Rules Items
  rule21: { ar: 'ممنوع الشتم أو الإهانة بأي شكل', en: 'No insults or harassment of any kind' },
  rule22: { ar: 'ممنوع التكلم OOC في الشات العام', en: 'No OOC talk in general chat' },
  rule23: { ar: 'استخدم /ooc للمحادثات خارج الشخصية', en: 'Use /ooc for out-of-character conversations' },
  rule24: { ar: 'ممنوع الإعلانات الغير واقعية', en: 'No unrealistic advertisements' },
  rule25: { ar: 'احترام الجميع في الشات الصوتي والمكتوب', en: 'Respect everyone in voice and text chat' },
  
  // Penalties Items
  rule26: { ar: 'مخالفة بسيطة: تحذير شفهي أو كتابي', en: 'Minor violation: Verbal or written warning' },
  rule27: { ar: 'مخالفة متوسطة: كيك من السيرفر', en: 'Moderate violation: Kick from server' },
  rule28: { ar: 'مخالفة خطيرة: بان مؤقت (1-7 أيام)', en: 'Serious violation: Temporary ban (1-7 days)' },
  rule29: { ar: 'مخالفة خطيرة جداً: بان دائم', en: 'Very serious violation: Permanent ban' },
  rule30: { ar: 'الغش أو الهكات: بان دائم فوري بدون تحذير', en: 'Cheating or hacks: Immediate permanent ban without warning' },
  
  // About Page
  aboutTitle: { ar: 'عن Trust State', en: 'About Trust State' },
  aboutDescription: { ar: 'سيرفر FiveM احترافي يقدم تجربة Roleplay فريدة', en: 'A professional FiveM server offering a unique Roleplay experience' },
  whoWeAre: { ar: 'من نحن؟', en: 'Who We Are?' },
  joinUsToday: { ar: 'انضم إلينا اليوم!', en: 'Join Us Today!' },
  aboutText1: { ar: 'Trust State هو سيرفر FiveM عربي يهدف إلى تقديم أفضل تجربة Roleplay للاعبين. نحن نؤمن بأن الجودة والاحترافية هما أساس نجاح أي سيرفر، ولذلك نعمل باستمرار على تطوير أنظمتنا وتحسين تجربة اللاعبين.', en: 'Trust State is an Arabic FiveM server aiming to provide the best Roleplay experience for players. We believe that quality and professionalism are the foundation of any successful server, so we continuously work on developing our systems and improving player experience.' },
  aboutText2: { ar: 'يتميز سيرفرنا بنظام CFW (Community Framework) المتكامل الذي يوفر أدوات قوية للإدارة ونظام رتب متقدم يكافئ الإداريين المتميزين.', en: 'Our server features the integrated CFW (Community Framework) system that provides powerful management tools and an advanced ranking system that rewards outstanding administrators.' },
  powerfulServer: { ar: 'سيرفر قوي', en: 'Powerful Server' },
  powerfulServerDesc: { ar: 'استضافة عالية الجودة مع استقرار 24/7', en: 'High-quality hosting with 24/7 stability' },
  advancedProtection: { ar: 'حماية متقدمة', en: 'Advanced Protection' },
  advancedProtectionDesc: { ar: 'نظام مكافحة غش متطور', en: 'Advanced anti-cheat system' },
  activeCommunity: { ar: 'مجتمع نشط', en: 'Active Community' },
  activeCommunityDesc: { ar: '+500 لاعب نشط يومياً', en: '+500 active players daily' },
  technicalSupport: { ar: 'دعم فني', en: 'Technical Support' },
  technicalSupportDesc: { ar: 'فريق دعم متاح على مدار الساعة', en: 'Support team available 24/7' },
  cfwSystem: { ar: 'نظام CFW', en: 'CFW System' },
  cfwSystemDesc: { ar: 'نظام إدارة متكامل يوفر جميع الأدوات اللازمة لإدارة السيرفر بكفاءة عالية', en: 'An integrated management system that provides all the necessary tools to manage the server with high efficiency' },
  playerManagement: { ar: 'إدارة اللاعبين', en: 'Player Management' },
  banSystem: { ar: '• نظام باندات متقدم', en: '• Advanced ban system' },
  violationsLog: { ar: '• سجل المخالفات', en: '• Violations log' },
  warningSystem: { ar: '• نظام تحذيرات', en: '• Warning system' },
  playerTracking: { ar: '• تتبع اللاعبين', en: '• Player tracking' },
  adminTools: { ar: 'أدوات الإدارة', en: 'Admin Tools' },
  examSystem: { ar: '• نظام اختبارات', en: '• Exam system' },
  autoRoles: { ar: '• رتب تلقائية', en: '• Automatic roles' },
  activityLog: { ar: '• سجل النشاطات', en: '• Activity log' },
  reports: { ar: '• نظام بلاغات', en: '• Reports system' },
  economySystem: { ar: 'نظام الاقتصاد', en: 'Economy System' },
  jobs: { ar: '• وظائف متنوعة', en: '• Various jobs' },
  businesses: { ar: '• أعمال تجارية', en: '• Business opportunities' },
  banking: { ar: '• نظام بنكي', en: '• Banking system' },
  realEstate: { ar: '• عقارات وممتلكات', en: '• Properties and real estate' },
  
  // Login Page
  loginTitle: { ar: 'تسجيل الدخول', en: 'Login' },
  loginDescription: { ar: 'سجل دخولك باستخدام Discord للوصول لجميع الميزات', en: 'Login with Discord to access all features' },
  loginWithDiscord: { ar: 'تسجيل الدخول بـ Discord', en: 'Login with Discord' },
  welcome: { ar: 'مرحباً بك', en: 'Welcome' },
  youAreLoggedIn: { ar: 'أنت مسجل الدخول', en: 'You are logged in' },
  goToHome: { ar: 'الذهاب للرئيسية', en: 'Go to Home' },
  
  // Features Section
  storeFeatures: { ar: 'مميزات المتجر', en: 'Store Features' },
  storeFeaturesDesc: { ar: 'كل ما تحتاجه للتميز في سيرفر Trust State', en: 'Everything you need to stand out in Trust State server' },
  completeStoreTitle: { ar: 'متجر متكامل', en: 'Complete Store' },
  completeStoreTitleDesc: { ar: 'اشتري كل ما تحتاجه من سيارات، مقرات، وزي مميز', en: 'Buy everything you need from cars, properties, and exclusive outfits' },
  exclusiveCarsTitle: { ar: 'سيارات حصرية', en: 'Exclusive Cars' },
  exclusiveCarsTitleDesc: { ar: 'مجموعة واسعة من السيارات الرياضية والفاخرة والدفع الرباعي', en: 'Wide range of sports, luxury, and off-road vehicles' },
  propertiesAndShopsTitle: { ar: 'مقرات ومحلات', en: 'Properties & Shops' },
  propertiesAndShopsTitleDesc: { ar: 'امتلك منزلك الخاص أو محلك التجاري في السيرفر', en: 'Own your private house or business shop in the server' },
  securePaymentFeature: { ar: 'دفع آمن', en: 'Secure Payment' },
  securePaymentFeatureDesc: { ar: 'طرق دفع متعددة وآمنة عبر PayPal والتحويل البنكي', en: 'Multiple secure payment methods via PayPal and bank transfer' },
  
  // Store Products
  sportCar: { ar: 'سيارة رياضية', en: 'Sports Car' },
  sportCarDesc: { ar: 'سرعة عالية + تعديلات', en: 'High speed + modifications' },
  luxuryCar: { ar: 'سيارة فاخرة', en: 'Luxury Car' },
  luxuryCarDesc: { ar: 'فخامة وأناقة', en: 'Luxury and elegance' },
  offroadCar: { ar: 'سيارة دفع رباعي', en: 'Off-road Vehicle' },
  offroadCarDesc: { ar: 'للطرق الوعرة', en: 'For rough terrain' },
  policeSkin: { ar: 'زي شرطة خاص', en: 'Special Police Uniform' },
  policeSkinDesc: { ar: 'مظهر احترافي', en: 'Professional look' },
  gangSkin: { ar: 'زي عصابة', en: 'Gang Outfit' },
  gangSkinDesc: { ar: 'مظهر مخيف', en: 'Intimidating look' },
  vipSkin: { ar: 'زي حصري', en: 'Exclusive Outfit' },
  vipSkinDesc: { ar: 'مظهر مميز وفاخر', en: 'Distinguished and luxurious look' },
  unbanFirst: { ar: 'فك باند - محاولة أولى', en: 'Unban - First Attempt' },
  unbanFirstDesc: { ar: 'فك الحظر نهائياً', en: 'Permanent unban' },
  unbanSecond: { ar: 'فك باند - محاولة ثانية', en: 'Unban - Second Attempt' },
  unbanSecondDesc: { ar: 'فرصة أخيرة', en: 'Last chance' },
  smallShop: { ar: 'محل صغير', en: 'Small Shop' },
  smallShopDesc: { ar: 'للبيع والتجارة', en: 'For selling and trading' },
  largeShop: { ar: 'محل كبير', en: 'Large Shop' },
  largeShopDesc: { ar: 'موقع مميز + مساحة أكبر', en: 'Prime location + more space' },
  warehouse: { ar: 'مستودع', en: 'Warehouse' },
  warehouseDesc: { ar: 'للتخزين والأعمال', en: 'For storage and business' },
  house: { ar: 'منزل خاص', en: 'Private House' },
  houseDesc: { ar: 'مكان آمن للإقامة', en: 'Safe place to live' },
  mansion: { ar: 'قصر فاخر', en: 'Luxury Mansion' },
  mansionDesc: { ar: 'أفخم مكان في السيرفر', en: 'Most luxurious place in the server' },
  
  // Payment
  paymentMethods: { ar: 'طرق الدفع', en: 'Payment Methods' },
  bankTransfer: { ar: 'تحويل بنكي', en: 'Bank Transfer' },
  securePayment: { ar: 'دفع آمن ومشفر', en: 'Secure encrypted payment' },
  completePurchase: { ar: 'إتمام الشراء', en: 'Complete Purchase' },
  itemAdded: { ar: 'تمت الإضافة!', en: 'Added!' },
  addedToCart: { ar: 'تمت إضافة العنصر للسلة', en: 'Item added to cart' },
  addItemsToCart: { ar: 'أضف عناصر للسلة أولاً', en: 'Add items to cart first' },
  usd: { ar: '$', en: '$' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
