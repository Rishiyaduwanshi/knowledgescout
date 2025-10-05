# 🚀 KnowledgeScout - AI-Powered Document Query System

![KnowledgeScout Banner](https://via.placeholder.com/800x200/1a1a1a/ffffff?text=KnowledgeScout+AI)

> **Smart Document Intelligence at Your Fingertips** - Upload documents, ask questions, get AI-powered answers with source citations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloudflare%20Pages-orange?style=for-the-badge)](https://knowledgescout.flyo.cc)
[![API Docs](https://img.shields.io/badge/API%20Docs-Documentation-blue?style=for-the-badge)](./API_DOCUMENTATION.md)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/rishiyaduwanshi/knowledgescout)

## 🌟 Overview

KnowledgeScout is a sophisticated AI-powered document intelligence platform that transforms how you interact with your documents. Upload PDFs, ask natural language questions, and receive intelligent answers with precise source citations.

### ✨ Key Features

- 🤖 **AI-Powered Q&A** - Natural language queries with intelligent responses
- 📄 **Multi-Format Support** - PDF, TXT, MD document processing
- 🎯 **Source Citations** - Clickable references with direct document access
- 🔐 **Secure Authentication** - JWT-based user sessions with cookie management
- 📱 **Responsive Design** - Bootstrap dark theme optimized for all devices
- ⚡ **Real-time Processing** - Background document indexing with status updates
- 🔍 **Vector Search** - Advanced similarity search using Qdrant vector database
- 📊 **Admin Dashboard** - System monitoring and analytics

## 🌐 Live URLs

| Service | URL | Status |
|---------|-----|--------|
| 🌐 **Frontend** | [knowledgescout.flyo.cc](https://knowledgescout.flyo.cc) | [![Status](https://img.shields.io/badge/Status-Live-green)](https://knowledgescout.flyo.cc) |
| ⚡ **Backend API** | [api.knowledgescout.flyo.cc](https://api.knowledgescout.flyo.cc) | [![Status](https://img.shields.io/badge/Status-Live-green)](https://api.knowledgescout.flyo.cc/health) |
| 📚 **API Documentation** | [API Docs](./API_DOCUMENTATION.md) | [![Docs](https://img.shields.io/badge/Docs-Available-blue)](./API_DOCUMENTATION.md) |

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 22+ with ES Modules
- **Framework:** Express.js with modern middleware
- **AI/ML:** LangChain + OpenAI GPT-oss-20b
- **Vector Database:** Qdrant (similarity search & embeddings)
- **Database:** MongoDB Atlas (document metadata)
- **Authentication:** JWT with httpOnly cookies
- **File Processing:** Multer + PDF parsing
- **Environment:** Digital Ocean Droplet

### Frontend
- **Framework:** Next.js 15.5.4 with App Router
- **Styling:** Bootstrap 5.3.8 Dark Theme
- **Icons:** Lucide React
- **Markdown:** react-markdown + remark-gfm
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios with cookie support
- **Deployment:** Cloudflare Pages (Static Export)

### Infrastructure
- **Frontend Hosting:** Cloudflare Pages
- **Backend Hosting:** Digital Ocean Droplet
- **Database:** MongoDB Atlas (Global Cloud)
- **Vector Store:** Qdrant Cloud
- **CDN:** Cloudflare Global Network
- **SSL:** Automated HTTPS certificates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Qdrant Cloud account
- OpenAI API key

### Backend Setup

```bash
# Clone repository
git clone https://github.com/rishiyaduwanshi/knowledgescout.git
cd knowledgescout

# Install dependencies
npm install

# Environment configuration
cp .env.example .env.dev
# Edit .env.dev with your API keys

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Environment configuration
cp .env.example .env.local
# Edit .env.local with backend URL

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env.dev)
```env
NODE_ENV=development
PORT=3030
VERSION=1.0.0

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/knowledgescout
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_key
QDRANT_COLLECTION_NAME=documents

# AI Services
OPENAI_API_KEY=sk-your-openai-key
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o-mini

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.knowledgescout.flyo.cc
NEXT_PUBLIC_APP_NAME=KnowledgeScout
```

## 📖 API Documentation

Comprehensive API documentation is available at: **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### Quick API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/signup` | POST | User registration |
| `/api/v1/auth/signin` | POST | User authentication |
| `/api/v1/docs` | POST | Upload documents |
| `/api/v1/docs` | GET | List user documents |
| `/api/v1/ask` | POST | Ask questions to AI |
| `/health` | GET | System health check |

## 🏗️ Architecture

```mermaid
graph TB
    A[User] --> B[Next.js Frontend]
    B --> C[Express.js API]
    C --> D[MongoDB Atlas]
    C --> E[Qdrant Vector DB]
    C --> F[OpenAI API]
    C --> G[File Storage]
    
    subgraph "Frontend - Cloudflare Pages"
        B --> H[React Components]
        B --> I[Bootstrap UI]
        B --> J[Axios HTTP Client]
    end
    
    subgraph "Backend - Digital Ocean"
        C --> K[JWT Auth]
        C --> L[Document Processing]
        C --> M[Vector Embeddings]
        C --> N[LangChain AI]
    end
```

## 🔧 Development Scripts

### Backend
```bash
npm run dev          # Development server with hot reload
npm run pro          # Production server
npm run worker:dev   # Background document processor
npm run migrate:dev  # Database migrations
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run build:static # Static export for deployment
npm start            # Production server
```

## 🚀 Deployment

### Frontend (Cloudflare Pages)
1. Connect GitHub repository
2. Build settings:
   - **Framework:** Next.js
   - **Build command:** `npm run build:static`
   - **Output directory:** `out`
   - **Root directory:** `client`

### Backend (Digital Ocean)
1. Create Ubuntu 22.04 droplet
2. Install Node.js 22+ and PM2
3. Clone repository and install dependencies
4. Configure environment variables
5. Start with PM2: `pm2 start ecosystem.config.js`


**Abhinav Prakash**
- 🌐 **Portfolio:** [iamabhinav.dev](https://iamabhinav.dev)
- 📝 **Blog:** [blog.iamabhinav.dev](https://blog.iamabhinav.dev)
- 💼 **GitHub:** [@rishiyaduwanshi](https://github.com/rishiyaduwanshi)
- 💼 **LinkedIn:** [Abhinav Prakash](https://linkedin.com/in/abhinavkumar-dev)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-oss20b language model
- **Qdrant** for vector similarity search
- **LangChain** for AI orchestration framework
- **Cloudflare** for global CDN and Pages hosting
- **Digital Ocean** for reliable cloud infrastructure

---

<div align="center">

**Built with ❤️ by [Abhinav Prakash](https://iamabhinav.dev)**

[![Portfolio](https://img.shields.io/badge/Portfolio-iamabhinav.dev-blue?style=flat-square)](https://iamabhinav.dev)
[![Blog](https://img.shields.io/badge/Blog-blog.iamabhinav.dev-green?style=flat-square)](https://blog.iamabhinav.dev)
[![GitHub](https://img.shields.io/badge/GitHub-rishiyaduwanshi-black?style=flat-square&logo=github)](https://github.com/rishiyaduwanshi)

</div>