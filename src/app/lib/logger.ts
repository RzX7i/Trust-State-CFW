// Logger utility to send logs to Discord

export async function sendLog(type: string, data: any) {
  try {
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      console.error('Failed to send log');
    }
  } catch (error) {
    console.error('Error sending log:', error);
  }
}

// Helper functions for specific log types

// ✅ تسجيل الدخول
export async function logLogin(discordId: string, username: string) {
  await sendLog('login', { discordId, username, activity: 'تسجيل دخول' });
}

// 🚪 تسجيل الخروج
export async function logLogout(discordId: string, username: string) {
  await sendLog('login', { discordId, username, activity: 'تسجيل خروج' });
}

// 🛒 مشتريات المتجر
export async function logStorePurchase(discordId: string, username: string, product: string, price: number) {
  await sendLog('store_purchase', { discordId, username, product, price });
}

// 🛒 إضافة للسلة
export async function logCartAdd(discordId: string, username: string, product: string, price: number) {
  await sendLog('store_purchase', { discordId, username, product, price, activity: 'إضافة للسلة' });
}

// 💳 بدء الدفع
export async function logCheckoutStart(discordId: string, username: string, total: number, items: number) {
  await sendLog('store_purchase', { discordId, username, total, items, activity: 'بدء الدفع' });
}

// 📝 بدء الاختبار
export async function logExamStart(discordId: string, username: string) {
  await sendLog('activity', { discordId, username, activity: 'بدء الاختبار' });
}

// 📄 زيارة صفحة
export async function logPageView(discordId: string, username: string, page: string) {
  await sendLog('activity', { discordId, username, activity: `زيارة صفحة ${page}` });
}

// 👤 تحديث الملف الشخصي
export async function logProfileUpdate(discordId: string, username: string, changes: string) {
  await sendLog('activity', { discordId, username, activity: 'تحديث الملف', changes });
}

// 📊 نشاط عام
export async function logActivity(discordId: string, username: string, activity: string) {
  await sendLog('activity', { discordId, username, activity });
}

// ❌ أخطاء
export async function logError(error: string, location?: string) {
  await sendLog('error', { error, location });
}
