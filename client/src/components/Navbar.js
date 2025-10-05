'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, MessageCircleQuestion, Upload, Settings, LogOut, User, ExternalLink, Github, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]); // Re-check on route change

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setUser(null);
      router.push('/auth/login');
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <FileText className="me-2" size={24} />
          <span className="fw-bold">KnowledgeScout</span>
        </Link>

        {/* Developer Links - Top Right */}
        <div className="d-none d-lg-flex align-items-center gap-2 me-3">
          <a 
            href="https://iamabhinav.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
            title="Portfolio"
          >
            <Globe size={14} />
            <span className="small">Portfolio</span>
          </a>
          <a 
            href="https://blog.iamabhinav.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
            title="Blog"
          >
            <ExternalLink size={14} />
            <span className="small">Blog</span>
          </a>
          <a 
            href="https://github.com/rishiyaduwanshi/knowledgescout" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
            title="GitHub Repository"
          >
            <Github size={14} />
            <span className="small">GitHub</span>
          </a>
        </div>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link 
                    href="/upload" 
                    className={`nav-link d-flex align-items-center ${isActive('/upload') ? 'active' : ''}`}
                  >
                    <Upload className="me-1" size={18} />
                    Upload
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/docs" 
                    className={`nav-link d-flex align-items-center ${isActive('/docs') ? 'active' : ''}`}
                  >
                    <FileText className="me-1" size={18} />
                    Documents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/ask" 
                    className={`nav-link d-flex align-items-center ${isActive('/ask') ? 'active' : ''}`}
                  >
                    <MessageCircleQuestion className="me-1" size={18} />
                    Ask Questions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/admin" 
                    className={`nav-link d-flex align-items-center ${isActive('/admin') ? 'active' : ''}`}
                  >
                    <Settings className="me-1" size={18} />
                    Admin
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isLoading ? (
              <li className="nav-item">
                <span className="nav-link">Loading...</span>
              </li>
            ) : user ? (
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle btn btn-link text-light text-decoration-none d-flex align-items-center" 
                  data-bs-toggle="dropdown"
                >
                  <User className="me-1" size={18} />
                  {user.username || user.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                      <LogOut className="me-2" size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/auth/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/auth/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}