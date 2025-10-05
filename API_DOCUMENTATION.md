# KnowledgeScout API Documentation

## Base URL
```
http://localhost:3030/api/v1
```

## Authentication
All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Sample API Requests

### 1. Register User
```bash
curl -X POST http://localhost:3030/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:3030/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Upload Document
```bash
curl -X POST http://localhost:3030/api/v1/docs \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/document.pdf"
```

### 4. List Documents (with pagination)
```bash
curl -X GET "http://localhost:3030/api/v1/docs?limit=5&offset=0" \
  -H "Authorization: Bearer <your_token>"
```

### 5. Get Specific Document
```bash
curl -X GET http://localhost:3030/api/v1/docs/<document_id> \
  -H "Authorization: Bearer <your_token>"
```

### 6. Ask Query
```bash
curl -X POST http://localhost:3030/api/v1/ask \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is this document about?",
    "k": 5
  }'
```

### 7. Rebuild Index
```bash
curl -X POST http://localhost:3030/api/v1/index/rebuild \
  -H "Authorization: Bearer <your_token>"
```

### 8. Get Index Stats
```bash
curl -X GET http://localhost:3030/api/v1/index/stats \
  -H "Authorization: Bearer <your_token>"
```

### 9. Health Check
```bash
curl -X GET http://localhost:3030/api/v1/health
```

### 10. API Metadata
```bash
curl -X GET http://localhost:3030/api/v1/_meta
```

### 11. Hackathon Info
```bash
curl -X GET http://localhost:3030/.well-known/hackathon.json
```

## Features Implemented

✅ **Document Upload & Processing**
- Multipart file upload
- PDF/DOCX support
- Async processing queue
- Vector embedding generation

✅ **Intelligent Q&A**
- Vector similarity search
- LLM-powered answers
- Source attribution with page references
- Query caching (60s TTL)

✅ **Private Document Access**
- User-based document isolation
- JWT authentication required
- Share tokens (can be implemented for public access)

✅ **Pagination & Performance**
- Limit/offset pagination for documents
- Cached queries flagged in response
- Index rebuild functionality

✅ **System Monitoring**
- Health checks for all services
- Index statistics and metadata
- Comprehensive API documentation

## Architecture Notes

The system employs a modern 3-tier architecture:

**API Layer**: Express.js with JWT authentication, rate limiting, and comprehensive error handling.

**Data Layer**: MongoDB for document metadata and user management, with Qdrant vector database for semantic search capabilities.

**Processing Layer**: Asynchronous document processing using a queue system, with LangChain for document loading, text splitting, and embedding generation via HuggingFace/Groq models.

**Search & QA**: Vector similarity search retrieves relevant document chunks, which are processed through LLM chains to generate contextual answers with accurate source citations including page numbers and line references.

Key optimizations include query caching, efficient pagination, and private document access control ensuring data privacy and system scalability.