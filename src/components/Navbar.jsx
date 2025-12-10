import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function Navbar() {
  const loc = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    loc.pathname.startsWith(path)
      ? "text-primary font-semibold"
      : "text-gray-600 hover:text-gray-800 transition";

  return (
    <header className="backdrop-blur-md bg-white/70 sticky top-0 z-40 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="E-Placer"
            className="h-12 w-12 object-contain drop-shadow-sm"
          />
          <span className="font-bold text-lg text-primary hidden sm:block">E-PLACER</span>
        </div>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-8 text-[15px]">
          <Link to="/" className={isActive('/')}>Home</Link>

          {user && user.role === "student" && (
            <>
              <Link to="/placements/cs" className={isActive('/placements/cs')}>
                Community Service
              </Link>

              <Link to="/placements/internships" className={isActive('/placements/internships')}>
                Internships
              </Link>

              <Link to="/applications" className={isActive('/applications')}>
                My Applications
              </Link>
            </>
          )}

          {user && user.role === "admin" && (
            <Link to="/admin" className={isActive('/admin')}>
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* AUTH SECTION */}
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm hidden sm:block">{user.email}</span>
              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-full border border-gray-300 text-sm hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow"
            >
              Login
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
