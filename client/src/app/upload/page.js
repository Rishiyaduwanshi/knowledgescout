'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { docsAPI } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initAuth } = useAuthStore();

  // ALL HOOKS MUST COME FIRST - NO CONDITIONAL RETURNS BEFORE ALL HOOKS ARE CALLED
  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please login to upload documents');
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // NOW we can do conditional rendering AFTER all hooks are called
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <Loader className="text-primary animate-spin" size={48} />
          <p className="text-muted mt-3">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <AlertCircle className="text-warning" size={64} />
          <h4 className="text-light mt-3">Authentication Required</h4>
          <p className="text-muted">Please login to upload documents.</p>
          <Link href="/auth/login" className="btn btn-primary mt-3">
            Login
          </Link>
        </div>
      </div>
    );
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      status: 'ready',
      progress: 0,
      error: null
    }))]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = async (fileItem) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'uploading', progress: 50 }
          : f
      ));

      const response = await docsAPI.upload(fileItem.file);
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ));
      
      toast.success(`${fileItem.file.name} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Upload failed';
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'error', error: errorMessage }
          : f
      ));
      
      toast.error(`Failed to upload ${fileItem.file.name}: ${errorMessage}`);
    }
  };

  const uploadAll = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const readyFiles = files.filter(f => f.status === 'ready');
    
    for (const fileItem of readyFiles) {
      await uploadFile(fileItem);
    }
    
    setUploading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader className="text-primary animate-spin" size={16} />;
      case 'success':
        return <CheckCircle className="text-success" size={16} />;
      case 'error':
        return <AlertCircle className="text-danger" size={16} />;
      default:
        return <FileText className="text-muted" size={16} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-light mb-3">
              <Upload className="me-3 text-primary" size={36} />
              Upload Documents
            </h1>
            <p className="text-muted">
              Upload your PDF or DOCX files to start asking questions about them
            </p>
          </div>

          {/* Upload Area */}
          <div className="card border-secondary mb-4">
            <div className="card-body">
              <div
                className={`border-2 border-dashed rounded-4 p-5 text-center position-relative ${
                  dragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload 
                  className={`mb-3 ${dragActive ? 'text-primary' : 'text-muted'}`} 
                  size={48} 
                />
                <h5 className="text-light mb-2">
                  {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h5>
                <p className="text-muted mb-3">
                  Or click the button below to select files
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                  className="d-none"
                />
                <div className="mt-3">
                  <small className="text-muted">
                    Supported formats: PDF, DOCX • Maximum size: 10MB per file
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="card border-secondary mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="text-light mb-0">Selected Files ({files.length})</h6>
                <div>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => setFiles([])}
                    disabled={uploading}
                  >
                    Clear All
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={uploadAll}
                    disabled={uploading || files.filter(f => f.status === 'ready').length === 0}
                  >
                    {uploading ? (
                      <>
                        <Loader className="me-2 animate-spin" size={16} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="me-2" size={16} />
                        Upload All
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {files.map((fileItem) => (
                    <div key={fileItem.id} className="list-group-item bg-transparent border-secondary">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {getStatusIcon(fileItem.status)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="text-light mb-1">{fileItem.file.name}</h6>
                              <small className="text-muted">
                                {formatFileSize(fileItem.file.size)}
                              </small>
                              {fileItem.error && (
                                <div className="text-danger mt-1">
                                  <small>{fileItem.error}</small>
                                </div>
                              )}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(fileItem.id)}
                              disabled={fileItem.status === 'uploading'}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {fileItem.status === 'uploading' && (
                            <div className="progress mt-2" style={{height: '4px'}}>
                              <div
                                className="progress-bar bg-primary"
                                style={{width: `${fileItem.progress}%`}}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {files.some(f => f.status === 'success') && (
            <div className="alert alert-success">
              <CheckCircle className="me-2" size={16} />
              Files uploaded successfully! You can now{' '}
              <Link href="/ask" className="alert-link">
                ask questions about your documents
              </Link>
              {' '}or{' '}
              <Link href="/docs" className="alert-link">
                view all your documents
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
}