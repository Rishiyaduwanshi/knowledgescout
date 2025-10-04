import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { Qdrant } from 'langchain/vectorstores/qdrant';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(config.MONGO_URI);
    console.log(
      'Database connected successfully 🥳 on',
      connection.connection.host
    );
  } catch (error) {
    console.error('Database connection error 😢', error);
    process.exit(1);
  }
};

const connectVector = async () => {
  const embeddings = new OpenAIEmbeddings({ apiKey: 'your-openai-api-key' });

  const qdrant = await Qdrant.fromTexts(
    ['Document text 1', 'Document text 2'],
    embeddings,
    {
      url: 'https://your-cluster-url',
      apiKey: 'your-api-key',
      collectionName: 'documents',
    }
  );
};

connectDb();

export default connectDb;
