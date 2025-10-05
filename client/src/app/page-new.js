'use client';

import Link from 'next/link';
import { FileText, Upload, MessageCircleQuestion, BarChart3, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-vh-100 bg-dark">
      {/* Hero Section */}
      <div className="container py-5">
        <div className="row justify-content-center text-center py-5">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold text-light mb-4">
              <FileText className="me-3 text-primary" size={48} />
              KnowledgeScout
            </h1>
            <p className="lead text-light mb-4">
              Upload your documents and get intelligent answers to your questions with AI-powered semantic search
            </p>
            {user ? (
              <div className="d-flex gap-3 justify-content-center">
                <Link href="/upload" className="btn btn-primary btn-lg">
                  <Upload className="me-2" size={20} />
                  Upload Documents
                </Link>
                <Link href="/ask" className="btn btn-outline-primary btn-lg">
                  <MessageCircleQuestion className="me-2" size={20} />
                  Ask Questions
                </Link>
              </div>
            ) : (
              <div className="d-flex gap-3 justify-content-center">
                <Link href="/auth/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link href="/auth/login" className="btn btn-outline-primary btn-lg">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="fw-bold text-light">Why Choose KnowledgeScout?</h2>
            <p className="text-muted">Powerful features for intelligent document analysis</p>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-secondary">
              <div className="card-body text-center">
                <Upload className="text-primary mb-3" size={48} />
                <h5 className="card-title text-light">Easy Upload</h5>
                <p className="card-text text-muted">
                  Upload PDF and DOCX documents with drag-and-drop simplicity. 
                  Your documents are processed automatically.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-secondary">
              <div className="card-body text-center">
                <Zap className="text-warning mb-3" size={48} />
                <h5 className="card-title text-light">AI-Powered Search</h5>
                <p className="card-text text-muted">
                  Advanced semantic search with vector embeddings finds relevant 
                  information even when you don't know exact keywords.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-secondary">
              <div className="card-body text-center">
                <Shield className="text-success mb-3" size={48} />
                <h5 className="card-title text-light">Private & Secure</h5>
                <p className="card-text text-muted">
                  Your documents are private and secure. Only you can access 
                  your uploaded content and query results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="fw-bold text-light">How It Works</h2>
            <p className="text-muted">Simple steps to get started with intelligent document Q&A</p>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-md-3 text-center">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
              <span className="text-white fw-bold">1</span>
            </div>
            <h5 className="text-light">Upload</h5>
            <p className="text-muted">Upload your PDF or DOCX documents</p>
          </div>
          
          <div className="col-md-3 text-center">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
              <span className="text-white fw-bold">2</span>
            </div>
            <h5 className="text-light">Process</h5>
            <p className="text-muted">AI processes and indexes your content</p>
          </div>
          
          <div className="col-md-3 text-center">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
              <span className="text-white fw-bold">3</span>
            </div>
            <h5 className="text-light">Ask</h5>
            <p className="text-muted">Ask questions about your documents</p>
          </div>
          
          <div className="col-md-3 text-center">
            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
              <span className="text-white fw-bold">4</span>
            </div>
            <h5 className="text-light">Get Answers</h5>
            <p className="text-muted">Receive intelligent answers with sources</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="card border-primary">
                <div className="card-body py-5">
                  <h3 className="card-title text-light mb-3">Ready to Get Started?</h3>
                  <p className="card-text text-muted mb-4">
                    Join KnowledgeScout today and transform how you interact with your documents
                  </p>
                  <Link href="/auth/register" className="btn btn-primary btn-lg">
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}