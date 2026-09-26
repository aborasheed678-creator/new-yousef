import React from 'react';
import TelegramTest from '@/components/TelegramTest';

const TelegramTestPage = () => {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">🔒 اختبار أمني - تكامل التليجرام</h1>
            <p className="text-muted-foreground">
              اختبار أمني مرخص - تأكد من أن البيانات يتم إرسالها إلى بوت التليجرام بنجاح
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>تنبيه أمني:</strong> هذا اختبار أمني مرخص من قبل الشركات والحكومات لتقييم أمان المنصات والأنظمة
              </p>
            </div>
          </div>
          
          <TelegramTest />
          
          <div className="mt-8 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-bold mb-4">تعليمات الإعداد</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">1. الحصول على معرف المحادثة:</h3>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>ابدأ محادثة مع البوت: <a href="https://t.me/payment2214" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@payment2214</a></li>
                  <li>أرسل أي رسالة للبوت</li>
                  <li>زر هذا الرابط: <a href="https://api.telegram.org/bot8305496038:AAGBYQUoRMcYw8qiz4NiQo3HCQfcxTIvo2Y/getUpdates" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">احصل على التحديثات</a></li>
                  <li>ابحث عن "chat.id" في النتيجة - هذا هو معرف المحادثة</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2. تحديث الإعدادات:</h3>
                <p className="text-muted-foreground">
                  قم بتحديث <code className="bg-muted px-1 rounded">CHAT_ID</code> في ملف <code className="bg-muted px-1 rounded">/src/lib/telegram.ts</code> (تم ضبطه بالفعل إلى 8680302183).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3. اختبار التكامل:</h3>
                <p className="text-muted-foreground">
                  استخدم الأزرار أعلاه لاختبار الاتصال وإرسال بيانات تجريبية
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramTestPage;