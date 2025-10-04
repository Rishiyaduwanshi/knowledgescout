import express from 'express';
import llm from '../services/llm.service.js';
import embeddingModel from '../services/embedding.service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }
    
    const { text } = req.body;

    // 1️⃣ Text generation
    const genResult = await llm.invoke([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: text },
    ]);

    // 2️⃣ Embedding generation
    const embeddingResult = await embeddingModel.embedQuery(text);

    res.json({
      generated_text: genResult.content || genResult,
      embedding: embeddingResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
