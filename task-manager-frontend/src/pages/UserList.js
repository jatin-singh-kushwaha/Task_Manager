import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      const updated = users.filter(u => u._id !== id);
      setUsers(updated);
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // 🔍 Filtered + Searched Users
  const filteredUsers = users.filter(user => {
  const matchSearch =
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const matchRole = roleFilter ? user.role === roleFilter : true;

  return matchSearch && matchRole;
});


  // 🧮 Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
              👥 All Users
            </h2>
            <button
              onClick={() => navigate('/')}
              className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* 🔎 Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded w-full sm:w-1/2"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-4 py-2 rounded w-full sm:w-1/4"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* ⚠️ Error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* 📊 User Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">👤 Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">✉️ Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">🛡 Role</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3 space-x-3">
                      <Link
                        to={`/users/edit/${user._id}`}
                        className="text-yellow-600 hover:underline font-medium"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No users found.</p>
          )}

          {/* 🔢 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                ⬅️ Prev
              </button>
              <span className="px-4 py-2 text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next ➡️
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
