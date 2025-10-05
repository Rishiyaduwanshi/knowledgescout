'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, FileText, Loader, Bot, User, Copy, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { askAPI, authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AskPage() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      toast.error('Please login to ask questions');
      router.push('/auth/login');
    } finally {
      setIsAuthLoading(false);
    }
  };
  const textareaRef = useRef(null);

  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <Loader className="text-primary animate-spin" size={48} />
          <p className="text-muted mt-3">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <AlertCircle className="text-warning" size={64} />
          <h4 className="text-light mt-3">Authentication Required</h4>
          <p className="text-muted">Please login to ask questions.</p>
          <Link href="/auth/login" className="btn btn-primary mt-3">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await askAPI.ask({
        query: userMessage.content,
        sessionId,
        includeMetadata: true
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.answer,
        metadata: response.data.metadata,
        sources: response.data.sources,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Ask error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        error: true,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
      toast.error('Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    toast.success('Conversation cleared');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-fluid py-5" style={{ height: '100vh' }}>
      <div className="row h-100">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-light mb-2">
                <MessageCircle className="me-3 text-primary" size={36} />
                Ask Questions
              </h1>
              <p className="text-muted">
                Ask questions about your uploaded documents and get AI-powered answers
              </p>
            </div>
            {conversation.length > 0 && (
              <button
                className="btn btn-outline-secondary"
                onClick={clearConversation}
                disabled={loading}
              >
                <RefreshCw className="me-2" size={16} />
                Clear Chat
              </button>
            )}
          </div>

          {/* Chat Container */}
          <div className="card border-secondary h-75">
            <div className="card-body d-flex flex-column p-0">
              {/* Messages Area */}
              <div className="flex-grow-1 overflow-auto p-4" style={{ maxHeight: '60vh' }}>
                {conversation.length === 0 ? (
                  <div className="text-center py-5">
                    <MessageCircle className="text-muted mb-3" size={64} />
                    <h4 className="text-light mb-2">Start a Conversation</h4>
                    <p className="text-muted mb-4">
                      Ask any question about your uploaded documents. I'll provide detailed answers based on the content.
                    </p>
                    <div className="row g-3 mt-4">
                      <div className="col-md-4">
                        <div className="card border-secondary bg-transparent">
                          <div className="card-body text-center">
                            <FileText className="text-primary mb-2" size={32} />
                            <h6 className="text-light">Document Analysis</h6>
                            <small className="text-muted">Ask about specific content, themes, or concepts</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-secondary bg-transparent">
                          <div className="card-body text-center">
                            <Bot className="text-success mb-2" size={32} />
                            <h6 className="text-light">AI-Powered</h6>
                            <small className="text-muted">Get intelligent responses with context</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-secondary bg-transparent">
                          <div className="card-body text-center">
                            <MessageCircle className="text-info mb-2" size={32} />
                            <h6 className="text-light">Conversational</h6>
                            <small className="text-muted">Follow-up questions and clarifications</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="messages">
                    {conversation.map((message) => (
                      <div
                        key={message.id}
                        className={`d-flex mb-4 ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div className={`d-flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} align-items-start`} style={{ maxWidth: '80%' }}>
                          {/* Avatar */}
                          <div className={`flex-shrink-0 ${message.type === 'user' ? 'ms-3' : 'me-3'}`}>
                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                              message.type === 'user' ? 'bg-primary' : message.error ? 'bg-danger' : 'bg-success'
                            }`} style={{ width: '40px', height: '40px' }}>
                              {message.type === 'user' ? (
                                <User size={20} className="text-white" />
                              ) : (
                                <Bot size={20} className="text-white" />
                              )}
                            </div>
                          </div>

                          {/* Message Bubble */}
                          <div className={`flex-grow-1 ${message.type === 'user' ? 'text-end' : 'text-start'}`}>
                            <div className={`card ${
                              message.type === 'user' 
                                ? 'bg-primary text-white' 
                                : message.error 
                                  ? 'bg-danger text-white'
                                  : 'border-secondary'
                            }`}>
                              <div className="card-body py-2 px-3">
                                <div className="message-content">
                                  {message.type === 'bot' && !message.error ? (
                                    <div className="markdown-content">
                                      <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                          p: ({children}) => <p className="mb-2">{children}</p>,
                                          ul: ({children}) => <ul className="mb-2 ps-3">{children}</ul>,
                                          ol: ({children}) => <ol className="mb-2 ps-3">{children}</ol>,
                                          li: ({children}) => <li className="mb-1">{children}</li>,
                                          strong: ({children}) => <strong className="fw-bold">{children}</strong>,
                                          em: ({children}) => <em className="fst-italic">{children}</em>,
                                          code: ({children}) => <code className="bg-dark text-primary px-1 rounded">{children}</code>,
                                          pre: ({children}) => <pre className="bg-dark p-2 rounded border">{children}</pre>,
                                        }}
                                      >
                                        {message.content}
                                      </ReactMarkdown>
                                    </div>
                                  ) : (
                                    message.content
                                  )}
                                </div>
                                
                                {/* Sources and Metadata for bot messages */}
                                {message.type === 'bot' && message.sources && message.sources.length > 0 && (
                                  <div className="mt-3 pt-2 border-top border-secondary">
                                    <small className="text-muted d-block mb-2">
                                      <FileText size={14} className="me-1" />
                                      Sources ({message.sources.length}):
                                    </small>
                                    <div className="d-flex flex-wrap gap-1">
                                      {message.sources.map((source, index) => (
                                        <button
                                          key={index}
                                          className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                                          onClick={() => {
                                            if (source.fileName) {
                                              // Direct PDF serve from static uploads folder
                                              window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'}/uploads/${source.fileName}`, '_blank');
                                            } else {
                                              toast.info('Document preview not available');
                                            }
                                          }}
                                          title={`Click to view: ${source.fileName || `Document ${index + 1}`}`}
                                        >
                                          <FileText size={12} />
                                          <span className="small">
                                            {source.fileName || `Document ${index + 1}`}
                                          </span>
                                          <ExternalLink size={10} />
                                        </button>
                                      ))}
                                    </div>
                                    
                                    {/* Show source content preview if available */}
                                    {message.sources.some(s => s.content) && (
                                      <div className="mt-2">
                                        <small className="text-muted d-block mb-1">Content excerpts:</small>
                                        {message.sources.filter(s => s.content).map((source, index) => (
                                          <div key={index} className="small bg-dark p-2 rounded mb-1 border-start border-info border-3">
                                            <div className="text-info mb-1 fw-bold">
                                              {source.fileName}:
                                            </div>
                                            <div className="text-light">
                                              "{source.content.substring(0, 150)}..."
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Metadata */}
                                {message.type === 'bot' && message.metadata && (
                                  <div className="mt-2 pt-2 border-top border-secondary">
                                    <small className="text-muted">
                                      Response time: {message.metadata.responseTime}ms
                                      {message.metadata.model && ` • Model: ${message.metadata.model}`}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Message Actions */}
                            <div className={`mt-1 ${message.type === 'user' ? 'text-end' : 'text-start'}`}>
                              <small className="text-muted me-2">{formatTime(message.timestamp)}</small>
                              <button
                                className="btn btn-link btn-sm text-muted p-0"
                                onClick={() => copyToClipboard(message.content)}
                                title="Copy message"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {loading && (
                      <div className="d-flex justify-content-start mb-4">
                        <div className="d-flex align-items-start" style={{ maxWidth: '80%' }}>
                          <div className="flex-shrink-0 me-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-success" style={{ width: '40px', height: '40px' }}>
                              <Bot size={20} className="text-white" />
                            </div>
                          </div>
                          <div className="card border-secondary">
                            <div className="card-body py-2 px-3">
                              <div className="d-flex align-items-center">
                                <Loader className="animate-spin me-2 text-primary" size={16} />
                                <span className="text-muted">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-top border-secondary p-4">
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <textarea
                      ref={textareaRef}
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ask a question about your documents..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows="2"
                      disabled={loading}
                      style={{ resize: 'none' }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!query.trim() || loading}
                    >
                      {loading ? (
                        <Loader className="animate-spin" size={20} />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Press Enter to send, Shift+Enter for new line
                  </small>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}