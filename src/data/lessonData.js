export const LESSON_ID = 'whatsapp-video-call'

export const lesson = {
  id: LESSON_ID,
  titleEn: 'How to make a WhatsApp video call',
  titleUr: 'واٹس ایپ پر ویڈیو کال کیسے کریں',
  steps: [
    {
      id: 'open-chat',
      startScreen: 'chats',
      expect: 'open-ayesha',
      en: "Tap on Ayesha's name to open her chat.",
      ur: 'عائشہ کی چیٹ کھولنے کے لیے ان کے نام پر ٹیپ کریں۔',
    },
    {
      id: 'start-video',
      startScreen: 'chat',
      expect: 'video-btn',
      en: 'Tap the video camera at the top to start a video call.',
      ur: 'ویڈیو کال شروع کرنے کے لیے اوپر ویڈیو کیمرے پر ٹیپ کریں۔',
    },
    {
      id: 'end-call',
      startScreen: 'video',
      expect: 'end-btn',
      en: 'Tap the red button to end the call.',
      ur: 'کال ختم کرنے کے لیے سرخ بٹن پر ٹیپ کریں۔',
    },
  ],
  retry: {
    startScreen: 'chats',
    sequence: ['open-ayesha', 'video-btn'],
    en: 'Now try on your own. Start a video call with Ayesha.',
    ur: 'اب خود کوشش کریں۔ عائشہ کو ویڈیو کال کریں۔',
  },
  corrections: {
    'audio-btn': {
      en: 'That starts an audio call. To see the other person, choose the video camera.',
      ur: 'اس سے آڈیو کال شروع ہوتی ہے۔ سامنے والے کو دیکھنے کے لیے ویڈیو کیمرہ منتخب کریں۔',
    },
    'open-bilal': {
      en: "That is Bilal's chat. Let's open Ayesha's chat instead.",
      ur: 'یہ بلال کی چیٹ ہے۔ آئیں عائشہ کی چیٹ کھولیں۔',
    },
    default: {
      en: "That wasn't quite it, and that's okay. Let's try again.",
      ur: 'یہ بالکل درست نہیں تھا، اور کوئی بات نہیں۔ آئیں دوبارہ کوشش کریں۔',
    },
  },
}