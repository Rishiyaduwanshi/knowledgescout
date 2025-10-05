'use client';

import Link from 'next/link';
import { FileText, Upload, MessageCircleQuestion, BarChart3, Shield, Zap, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { user, isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from cookies
    initAuth();
  }, []);

  return (
    <div className="min-vh-100 bg-dark text-light">
      {/* Hero Section */}
      <div className="hero-section bg-gradient text-center text-light py-5" style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                <FileText className="me-3 text-primary" size={60} />
                KnowledgeScout
              </h1>
              <p className="lead mb-5">
                Transform your documents into an intelligent, searchable knowledge base. 
                Upload, analyze, and get instant AI-powered answers from your content.
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
          <div className="col-md-3">
            <div className="card border-secondary h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-primary text-white mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span className="fw-bold fs-4">1</span>
                </div>
                <h5 className="text-light">Upload</h5>
                <p className="text-muted">Upload your documents in PDF or DOCX format</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card border-secondary h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-info text-white mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span className="fw-bold fs-4">2</span>
                </div>
                <h5 className="text-light">Process</h5>
                <p className="text-muted">AI analyzes and creates searchable embeddings</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card border-secondary h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-success text-white mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span className="fw-bold fs-4">3</span>
                </div>
                <h5 className="text-light">Ask</h5>
                <p className="text-muted">Ask questions in natural language</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card border-secondary h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-warning text-dark mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span className="fw-bold fs-4">4</span>
                </div>
                <h5 className="text-light">Get Answers</h5>
                <p className="text-muted">Receive accurate, contextual responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features for Logged In Users */}
      {user && (
        <div className="container py-5">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="fw-bold text-light">Your Dashboard</h2>
              <p className="text-muted">Quick access to all features</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card border-secondary h-100 hover-card">
                <div className="card-body text-center">
                  <Upload className="text-primary mb-3" size={48} />
                  <h4 className="text-light mb-3">Upload Documents</h4>
                  <p className="text-muted mb-4">
                    Upload PDFs, text files, and other documents to build your knowledge base
                  </p>
                  <Link href="/upload" className="btn btn-primary">
                    Start Uploading
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-secondary h-100 hover-card">
                <div className="card-body text-center">
                  <FileText className="text-info mb-3" size={48} />
                  <h4 className="text-light mb-3">Manage Documents</h4>
                  <p className="text-muted mb-4">
                    View, organize, and manage your uploaded documents efficiently
                  </p>
                  <Link href="/docs" className="btn btn-info">
                    View Documents
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-secondary h-100 hover-card">
                <div className="card-body text-center">
                  <MessageCircleQuestion className="text-success mb-3" size={48} />
                  <h4 className="text-light mb-3">Ask Questions</h4>
                  <p className="text-muted mb-4">
                    Get intelligent answers from your documents using advanced AI
                  </p>
                  <Link href="/ask" className="btn btn-success">
                    Ask Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-secondary h-100 hover-card">
                <div className="card-body text-center">
                  <Settings className="text-warning mb-3" size={48} />
                  <h4 className="text-light mb-3">System Admin</h4>
                  <p className="text-muted mb-4">
                    Monitor system health, manage resources, and view analytics
                  </p>
                  <Link href="/admin" className="btn btn-warning">
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-dark py-5 border-top border-secondary">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="mb-3">
                <BarChart3 className="text-primary" size={48} />
              </div>
              <h3 className="text-light">Smart Analytics</h3>
              <p className="text-muted">Advanced document processing and intelligent insights</p>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <Shield className="text-success" size={48} />
              </div>
              <h3 className="text-light">Enterprise Security</h3>
              <p className="text-muted">Bank-level security for your sensitive documents</p>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <Zap className="text-warning" size={48} />
              </div>
              <h3 className="text-light">Lightning Fast</h3>
              <p className="text-muted">Get answers in seconds with optimized AI processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}