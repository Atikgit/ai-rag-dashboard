import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // ফ্রন্টএন্ড থেকে পাঠানো মেসেজ এবং সিলেক্ট করা মডেল রিসিভ করা
  const { messages, model } = await req.json();

  let aiModel;

  // কন্ডিশন চেক: যদি ইউজার Muse Glimmer সিলেক্ট করে
  if (model === 'muse-glimmer') {
    const customModalOpenAI = createOpenAI({
      baseURL: process.env.MUSE_GLIMMER_URL, // আপনার .env.local এর URL
      apiKey: 'dummy-key', // Modal-এ আপাতত Auth না থাকলে ডামি কি দিলেই হবে
    });
    // মডেলের নাম হুবহু Modal এর কোডের MODEL_NAME এর মতো হতে হবে
    aiModel = customModalOpenAI('meta-models/Muse-Glimmer-30B'); 
  } 
  // কন্ডিশন চেক: যদি অন্য কোনো স্ট্যান্ডার্ড মডেল হয় (GPT-4o ইত্যাদি)
  else {
    const standardOpenAI = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    aiModel = standardOpenAI(model || 'gpt-4o'); // ডিফল্ট হিসেবে gpt-4o
  }

  // AI SDK দিয়ে স্ট্রিম জেনারেট করা
  const result = await streamText({
    model: aiModel,
    messages,
  });

  return result.toTextStreamResponse();
}