import express from 'express';

const router = express.Router();

router.get('/hackathon.json', (req, res) => {
  res.json({
    name: "KnowledgeScout",
    description: "Document upload, embedding, and intelligent Q&A system with metadata-rich responses",
    version: "1.0.0",
    author: "Abhinav Prakash",
    repository: "https://github.com/rishiyaduwanshi/knowledgescout",
    technologies: [
      "Node.js",
      "Express.js", 
      "MongoDB",
      "Qdrant Vector DB",
      "LangChain",
      "Groq/HuggingFace LLMs",
      "JWT Authentication"
    ],
    features: [
      "Document upload and processing (PDF, DOCX)",
      "Vector embedding and similarity search", 
      "Intelligent question answering with sources",
      "Page-level metadata and references",
      "Private document access control",
      "Query caching for performance",
      "Index rebuilding and statistics",
      "RESTful API with pagination"
    ],
    endpoints: {
      "POST /api/v1/docs": "Upload documents",
      "GET /api/v1/docs": "List documents with pagination", 
      "GET /api/v1/docs/:id": "Get specific document",
      "POST /api/v1/ask": "Ask questions about documents",
      "POST /api/v1/index/rebuild": "Rebuild search index",
      "GET /api/v1/index/stats": "Get index statistics",
      "GET /api/v1/health": "System health check",
      "GET /api/v1/_meta": "API metadata"
    },
    demo: {
      baseUrl: process.env.APP_URL || "http://localhost:3030",
      sampleCredentials: {
        note: "Register via POST /api/v1/auth/register to get credentials"
      }
    },
    architecture: "The system uses a 3-tier architecture: Express.js API layer, MongoDB for document metadata, and Qdrant vector database for semantic search. Documents are processed asynchronously via a queue system, embedded using HuggingFace/Groq models, and stored as vectors with rich metadata including page references. Queries are embedded and matched against document chunks, with results processed through LLM chains to generate contextual answers with valid source citations.",
    timestamp: new Date().toISOString()
  });
});

export default router;