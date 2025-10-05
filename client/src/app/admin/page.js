'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Activity, 
  Users, 
  FileText, 
  MessageCircle, 
  Trash2, 
  RefreshCw,
  BarChart3,
  Clock,
  HardDrive,
  Cpu,
  Shield,
  AlertCircle,
  Loader
} from 'lucide-react';
import { systemAPI, docsAPI } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemMeta, setSystemMeta] = useState(null);
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalQueries: 0,
    systemUptime: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, initAuth, isAdmin } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        toast.error('Please login to access admin panel');
        router.push('/auth/login');
        return;
      }
      
      if (!isAdmin()) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }
      
      // Only fetch system data if user is admin
      fetchSystemData();
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const fetchSystemData = async () => {
    try {
      const [healthResponse, metaResponse, docsResponse] = await Promise.all([
        systemAPI.health(),
        systemAPI.meta(),
        docsAPI.getAll(1, 0) // Just get count
      ]);

      setSystemHealth(healthResponse.data);
      setSystemMeta(metaResponse.data);
      setStats(prev => ({
        ...prev,
        totalDocs: docsResponse.data.total
      }));
    } catch (error) {
      console.error('Error fetching system data:', error);
      toast.error('Failed to load system information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <Loader className="text-primary animate-spin" size={48} />
          <p className="text-muted mt-3">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || (!user.role || (user.role !== 'admin' && !user.isAdmin))) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <Shield className="text-danger" size={64} />
          <h4 className="text-light mt-3">Access Denied</h4>
          <p className="text-muted">
            Admin privileges required to access this page.
          </p>
          <Link href="/" className="btn btn-primary mt-3">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSystemData();
  };

  const handleResetSystem = async () => {
    if (!confirm('Are you sure you want to reset the entire system? This will delete ALL documents and data. This action cannot be undone.')) {
      return;
    }

    try {
      await docsAPI.deleteAll();
      toast.success('System reset successfully');
      fetchSystemData();
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Failed to reset system');
    }
  };

  const formatUptime = (seconds) => {
    if (!seconds) return 'Unknown';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <RefreshCw className="text-primary animate-spin" size={48} />
          <p className="text-muted mt-3">Loading system information...</p>
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
            <Settings className="me-3 text-primary" size={36} />
            System Administration
          </h1>
          <p className="text-muted">
            Monitor system health, manage resources, and view analytics
          </p>
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`me-2 ${refreshing ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleResetSystem}
          >
            <Trash2 className="me-2" size={16} />
            Reset System
          </button>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-secondary h-100">
            <div className="card-body text-center">
              <Activity className={`mb-3 ${systemHealth?.status === 'healthy' ? 'text-success' : 'text-danger'}`} size={40} />
              <h5 className="text-light">System Status</h5>
              <p className={`mb-0 ${systemHealth?.status === 'healthy' ? 'text-success' : 'text-danger'}`}>
                {systemHealth?.status === 'healthy' ? 'Healthy' : 'Issues Detected'}
              </p>
              {systemHealth?.uptime && (
                <small className="text-muted d-block mt-2">
                  <Clock size={14} className="me-1" />
                  Uptime: {formatUptime(systemHealth.uptime)}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-secondary h-100">
            <div className="card-body text-center">
              <FileText className="text-primary mb-3" size={40} />
              <h5 className="text-light">Documents</h5>
              <p className="text-primary mb-0 fs-4">{stats.totalDocs}</p>
              <small className="text-muted">Total uploaded</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-secondary h-100">
            <div className="card-body text-center">
              <Database className="text-info mb-3" size={40} />
              <h5 className="text-light">Database</h5>
              <p className={`mb-0 ${systemHealth?.database === 'connected' ? 'text-success' : 'text-danger'}`}>
                {systemHealth?.database === 'connected' ? 'Connected' : 'Disconnected'}
              </p>
              <small className="text-muted">MongoDB Status</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-secondary h-100">
            <div className="card-body text-center">
              <BarChart3 className="text-warning mb-3" size={40} />
              <h5 className="text-light">Vector DB</h5>
              <p className={`mb-0 ${systemHealth?.vectorDb === 'connected' ? 'text-success' : 'text-danger'}`}>
                {systemHealth?.vectorDb === 'connected' ? 'Connected' : 'Disconnected'}
              </p>
              <small className="text-muted">Qdrant Status</small>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card border-secondary">
            <div className="card-header">
              <h5 className="text-light mb-0">
                <Cpu className="me-2" size={20} />
                System Information
              </h5>
            </div>
            <div className="card-body">
              {systemMeta ? (
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-muted">Version</div>
                    <div className="text-light">{systemMeta.version}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted">Environment</div>
                    <div className="text-light">{systemMeta.environment}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted">Node Version</div>
                    <div className="text-light">{systemMeta.nodeVersion}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted">Started</div>
                    <div className="text-light">
                      {new Date(systemMeta.startTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted">
                  Loading system information...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-secondary">
            <div className="card-header">
              <h5 className="text-light mb-0">
                <HardDrive className="me-2" size={20} />
                System Resources
              </h5>
            </div>
            <div className="card-body">
              {systemHealth?.memory ? (
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-muted">Memory Usage</div>
                    <div className="text-light">
                      {formatBytes(systemHealth.memory.used)} / {formatBytes(systemHealth.memory.total)}
                    </div>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${(systemHealth.memory.used / systemHealth.memory.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted">CPU Usage</div>
                    <div className="text-light">{systemHealth.cpu?.usage || 'N/A'}%</div>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${systemHealth.cpu?.usage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted">
                  Resource information not available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Health Information */}
      <div className="card border-secondary">
        <div className="card-header">
          <h5 className="text-light mb-0">
            <Activity className="me-2" size={20} />
            Detailed Health Report
          </h5>
        </div>
        <div className="card-body">
          {systemHealth ? (
            <div className="row g-4">
              <div className="col-md-4">
                <h6 className="text-light">Services Status</h6>
                <ul className="list-unstyled">
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Database:</span>
                    <span className={systemHealth.database === 'connected' ? 'text-success' : 'text-danger'}>
                      {systemHealth.database === 'connected' ? '✓ Connected' : '✗ Disconnected'}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Vector DB:</span>
                    <span className={systemHealth.vectorDb === 'connected' ? 'text-success' : 'text-danger'}>
                      {systemHealth.vectorDb === 'connected' ? '✓ Connected' : '✗ Disconnected'}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Queue System:</span>
                    <span className="text-success">✓ Running</span>
                  </li>
                </ul>
              </div>
              
              <div className="col-md-4">
                <h6 className="text-light">Performance Metrics</h6>
                <ul className="list-unstyled">
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Response Time:</span>
                    <span className="text-light">{systemHealth.responseTime || 'N/A'}ms</span>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Queue Length:</span>
                    <span className="text-light">{systemHealth.queueLength || 0}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Active Connections:</span>
                    <span className="text-light">{systemHealth.activeConnections || 'N/A'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="col-md-4">
                <h6 className="text-light">System Info</h6>
                <ul className="list-unstyled">
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Last Check:</span>
                    <span className="text-light">{new Date().toLocaleTimeString()}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Environment:</span>
                    <span className="text-light">{systemMeta?.environment || 'Unknown'}</span>
                  </li>
                  <li className="d-flex justify-content-between py-1">
                    <span className="text-muted">Version:</span>
                    <span className="text-light">{systemMeta?.version || 'Unknown'}</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted">
              Loading health information...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}