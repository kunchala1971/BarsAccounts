import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { logout } from './api';
import DailyEntry from './pages/DailyEntry';
import BarsMaster from './pages/BarsMaster';
import BrandsMaster from './pages/BrandsMaster';
import Login from './pages/Login';
import { NotificationProvider } from './components/NotificationProvider';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { LogOut, LayoutDashboard, Beer, Tag, Menu, X, Sun, Moon } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Navigation Bar Component
const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { theme, toggleTheme } = useTheme();
  
  if (!token) return null; // Don't show nav on login page

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-slate-900 shadow border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex items-center sm:hidden mr-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
                aria-expanded="false"
              >
                {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">StockSystem</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/daily-entry"
                className={`${isActive('/daily-entry') ? 'border-blue-500 text-gray-900 dark:text-white font-semibold' : 'border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Daily Entry
              </Link>
              <Link
                to="/bars-master"
                className={`${isActive('/bars-master') ? 'border-blue-500 text-gray-900 dark:text-white font-semibold' : 'border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                <Beer className="w-4 h-4 mr-2" />
                Bars Master
              </Link>
              <Link
                to="/brands-master"
                className={`${isActive('/brands-master') ? 'border-blue-500 text-gray-900 dark:text-white font-semibold' : 'border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                <Tag className="w-4 h-4 mr-2" />
                Brands Master
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 animate-in spin-in-90 duration-300" />
              )}
            </button>

            <div className="hidden sm:flex sm:items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-2 pt-2 pb-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <Link
            to="/daily-entry"
            onClick={() => setMobileMenuOpen(false)}
            className={`${
              isActive('/daily-entry')
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            } block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium rounded-r-md flex items-center gap-3`}
          >
            <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Daily Stock Entry
          </Link>
          <Link
            to="/bars-master"
            onClick={() => setMobileMenuOpen(false)}
            className={`${
              isActive('/bars-master')
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            } block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium rounded-r-md flex items-center gap-3`}
          >
            <Beer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Bars Master
          </Link>
          <Link
            to="/brands-master"
            onClick={() => setMobileMenuOpen(false)}
            className={`${
              isActive('/brands-master')
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-400 font-semibold'
                : 'border-transparent text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            } block pl-3 pr-4 py-2.5 border-l-4 text-base font-medium rounded-r-md flex items-center gap-3`}
          >
            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Brands Master
          </Link>
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800 mt-2 flex flex-col gap-1">
            <button
              onClick={handleLogout}
              className="w-full text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 pl-3 pr-4 py-2.5 rounded-md flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors">
            <NavBar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/daily-entry" 
                element={
                  <ProtectedRoute>
                    <DailyEntry />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bars-master" 
                element={
                  <ProtectedRoute>
                    <BarsMaster />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brands-master" 
                element={
                  <ProtectedRoute>
                    <BrandsMaster />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/daily-entry" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
