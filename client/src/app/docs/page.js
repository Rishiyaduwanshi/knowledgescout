'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, Calendar, User, Download, RefreshCw } from 'lucide-react';
import { docsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DocsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0
  });
  const [deleting, setDeleting] = useState(null);

  const fetchDocs = async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      const response = await docsAPI.getAll(limit, offset);
      setDocs(response.data.docs);
      setPagination({
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset
      });
    } catch (error) {
      console.error('Error fetching docs:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (docId, fileName) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      setDeleting(docId);
      await docsAPI.delete(docId);
      toast.success('Document deleted successfully');
      fetchDocs(pagination.limit, pagination.offset);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL documents? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting('all');
      await docsAPI.deleteAll();
      toast.success('All documents deleted successfully');
      fetchDocs();
    } catch (error) {
      console.error('Delete all error:', error);
      toast.error('Failed to delete all documents');
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (newOffset) => {
    fetchDocs(pagination.limit, newOffset);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning text-dark',
      processing: 'bg-info text-dark',
      completed: 'bg-success',
      failed: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  if (loading && docs.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <RefreshCw className="text-primary animate-spin" size={48} />
          <p className="text-muted mt-3">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-light mb-2">
            <FileText className="me-3 text-primary" size={36} />
            My Documents
          </h1>
          <p className="text-muted">
            Manage your uploaded documents ({pagination.total} total)
          </p>
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => fetchDocs(pagination.limit, pagination.offset)}
            disabled={loading}
          >
            <RefreshCw className={`me-2 ${loading ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </button>
          <Link href="/upload" className="btn btn-primary me-2">
            Upload New
          </Link>
          {docs.length > 0 && (
            <button
              className="btn btn-outline-danger"
              onClick={handleDeleteAll}
              disabled={deleting === 'all'}
            >
              {deleting === 'all' ? (
                <RefreshCw className="me-2 animate-spin" size={16} />
              ) : (
                <Trash2 className="me-2" size={16} />
              )}
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Documents List */}
      {docs.length === 0 ? (
        <div className="card border-secondary">
          <div className="card-body text-center py-5">
            <FileText className="text-muted mb-3" size={64} />
            <h4 className="text-light mb-2">No Documents Found</h4>
            <p className="text-muted mb-4">
              You haven't uploaded any documents yet. Upload your first document to get started.
            </p>
            <Link href="/upload" className="btn btn-primary">
              Upload Documents
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="card border-secondary">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Metadata</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc) => (
                      <tr key={doc._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <FileText className="text-primary me-2" size={20} />
                            <div>
                              <div className="text-light fw-medium">{doc.fileName}</div>
                              <small className="text-muted">
                                ID: {doc._id.slice(-8)}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                          {doc.error && (
                            <div className="text-danger mt-1">
                              <small>{doc.error}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="text-light">
                            <Calendar className="me-1" size={14} />
                            {formatDate(doc.createdAt)}
                          </div>
                        </td>
                        <td>
                          {doc.metadata ? (
                            <div className="text-muted">
                              <small>
                                Pages: {doc.metadata.totalPages || 'N/A'}
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">Processing...</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(doc._id, doc.fileName)}
                              disabled={deleting === doc._id}
                              title="Delete document"
                            >
                              {deleting === doc._id ? (
                                <RefreshCw className="animate-spin" size={14} />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} documents
                </div>
                <ul className="pagination pagination-dark mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(0)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.offset - pagination.limit)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">
                      {currentPage} of {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange((totalPages - 1) * pagination.limit)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}