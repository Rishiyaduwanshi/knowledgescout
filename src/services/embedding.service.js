import { config } from '../../config/index.js';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

const embeddingModel = new HuggingFaceInferenceEmbeddings({
  apiKey: config.HUGGINGFACE_API_KEY,
  model: 'google/embeddinggemma-300m',
  provider:"hf-inference"
});

export default embeddingModel;
