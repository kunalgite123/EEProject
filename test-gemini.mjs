import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyBb6xAUDcZit1ldsFZN4SSKxUm9xOfZTl');
async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('hi');
    console.log('SUCCESS:', result.response.text());
  } catch (e) {
    console.error('ERROR:', e.message);
  }
}
test();
