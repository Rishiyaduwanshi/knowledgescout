'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, MessageCircleQuestion, Upload, Settings, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/auth/login';
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <FileText className="me-2" size={24} />
          <span className="fw-bold">KnowledgeScout</span>
        </Link>

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
            {user ? (
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