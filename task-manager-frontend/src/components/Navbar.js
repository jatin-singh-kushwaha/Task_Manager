import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react'; // Use lucide-react icons (already available if you use shadcn)

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 sm:px-6 lg:px-10 py-3">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-700">🧩 Task App</Link>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="sm:hidden focus:outline-none">
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
              <Link to="/register" className="text-purple-600 font-medium hover:underline">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
                  <Link to="/admin/users" className="text-green-600 hover:underline">Users</Link>
                </>
              )}
              <span className="text-sm text-gray-600">
                {user.role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 font-medium hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
  <div className="sm:hidden mt-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded shadow space-y-3 animate-slide-down">
    {!user ? (
      <>
        <Link
          to="/login"
          className="block text-blue-700 font-medium hover:bg-blue-100 px-3 py-2 rounded"
          onClick={() => setIsOpen(false)}
        >
          🔑 Login
        </Link>
        <Link
          to="/register"
          className="block text-purple-700 font-medium hover:bg-purple-100 px-3 py-2 rounded"
          onClick={() => setIsOpen(false)}
        >
          📝 Register
        </Link>
      </>
    ) : (
      <>
        {user.role === 'admin' && (
          <>
            <Link
              to="/"
              className="block text-blue-700 hover:bg-blue-100 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              🏠 Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="block text-green-700 hover:bg-green-100 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              👥 Manage Users
            </Link>
          </>
        )}
        <div className="text-gray-600 text-sm px-3 pt-2">
          {user.role === 'admin' ? '👑 Admin' : '👤 User'}
        </div>
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="w-full text-left text-red-600 font-medium hover:bg-red-100 px-3 py-2 rounded"
        >
          🚪 Logout
        </button>
      </>
    )}
  </div>
)}

     
    </nav>
  );
}
