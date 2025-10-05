'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Download, ArrowLeft, Calendar, User } from 'lucide-react';
import { docsAPI } from '../../../utils/api';
import toast from 'react-hot-toast';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await docsAPI.getById(params.id);
      setDoc(response.data.doc);
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Failed to load document');
      router.push('/docs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (doc && doc.filePath) {
      // Create download link for the file
      const link = document.createElement('a');
      link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'}/docs/${doc._id}/download`;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('Download not available');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FileText className="text-primary animate-pulse" size={48} />
          <p className="text-muted mt-3">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <FileText className="text-muted" size={64} />
          <h4 className="text-light mt-3">Document Not Found</h4>
          <p className="text-muted">The requested document could not be found.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => router.push('/docs')}
          >
            <ArrowLeft className="me-2" size={16} />
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => router.push('/docs')}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-grow-1">
          <h1 className="text-light mb-2">
            <FileText className="me-3 text-primary" size={36} />
            Document Details
          </h1>
          <p className="text-muted mb-0">View document information and metadata</p>
        </div>
      </div>

      {/* Document Card */}
      <div className="row">
        <div className="col-md-8">
          <div className="card border-secondary">
            <div className="card-header">
              <h5 className="text-light mb-0 d-flex align-items-center">
                <FileText className="me-2 text-primary" size={20} />
                {doc.fileName}
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="text-muted small">Document ID</label>
                    <div className="text-light">{doc._id}</div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="text-muted small">Status</label>
                    <div>
                      <span className={`badge ${
                        doc.status === 'completed' ? 'bg-success' :
                        doc.status === 'processing' ? 'bg-info' :
                        doc.status === 'failed' ? 'bg-danger' : 'bg-warning'
                      }`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="text-muted small">Upload Date</label>
                    <div className="text-light d-flex align-items-center">
                      <Calendar className="me-2" size={16} />
                      {formatDate(doc.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="text-muted small">File Size</label>
                    <div className="text-light">
                      {formatFileSize(doc.fileSize)}
                    </div>
                  </div>
                </div>

                {doc.metadata && (
                  <>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small">Pages</label>
                        <div className="text-light">
                          {doc.metadata.totalPages || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small">Chunks</label>
                        <div className="text-light">
                          {doc.metadata.totalChunks || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {doc.error && (
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="text-muted small">Error</label>
                      <div className="text-danger">
                        {doc.error}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-top border-secondary">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={handleDownload}
                  >
                    <Download className="me-2" size={16} />
                    Download
                  </button>
                  
                  <button 
                    className="btn btn-success"
                    onClick={() => router.push(`/ask?doc=${doc._id}`)}
                  >
                    Ask Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Processing Info */}
          <div className="card border-secondary">
            <div className="card-header">
              <h6 className="text-light mb-0">Processing Information</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-2">
                  <div className="text-muted">Created:</div>
                  <div className="text-light">{formatDate(doc.createdAt)}</div>
                </div>
                
                <div className="mb-2">
                  <div className="text-muted">Updated:</div>
                  <div className="text-light">{formatDate(doc.updatedAt)}</div>
                </div>

                {doc.processedAt && (
                  <div className="mb-2">
                    <div className="text-muted">Processed:</div>
                    <div className="text-light">{formatDate(doc.processedAt)}</div>
                  </div>
                )}

                <div className="mb-2">
                  <div className="text-muted">Searchable:</div>
                  <div className={`${doc.status === 'completed' ? 'text-success' : 'text-warning'}`}>
                    {doc.status === 'completed' ? 'Yes' : 'Processing...'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card border-secondary mt-3">
            <div className="card-header">
              <h6 className="text-light mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-info btn-sm"
                  onClick={() => router.push('/ask')}
                >
                  Ask Questions
                </button>
                
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => router.push('/docs')}
                >
                  View All Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}