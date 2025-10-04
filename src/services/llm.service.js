import { config } from '../../config/index.js';
import { AppError } from '../utils/appError.js';

const {
  MODEL_PROVIDER,
  GROQ_API_KEY,
  GROQ_MODEL,
  HUGGINGFACE_API_KEY,
  HUGGINGFACE_MODEL,
} = config;

let llm;

try {
  switch (MODEL_PROVIDER) {
    case 'huggingface': {
      const { HuggingFaceInference } = await import("@langchain/community/llms/hf")
      console.log(MODEL_PROVIDER, HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL)
      llm = new HuggingFaceInference({
        apiKey: HUGGINGFACE_API_KEY,
        model: HUGGINGFACE_MODEL,
        temperature: 0.3,
        maxOutputTokens: 2048,
        provider : 'huggingface'
      });
      break;
    }

    case 'groq': {
      const { ChatGroq } = await import('@langchain/groq');
      const { GroqEm } = await import('@langchain/groq');
      llm = new ChatGroq({
        apiKey: GROQ_API_KEY,
        model: GROQ_MODEL || 'gpt-3.5-turbo',
        temperature: 0.3,
      });
      break;
    }

    default:
      throw new Error(`Unsupported MODEL_PROVIDER: ${MODEL_PROVIDER}`);
  }
} catch (error) {
  throw new AppError({ message: `LLM load failed: ${error.message}` });
}

export default llm;
