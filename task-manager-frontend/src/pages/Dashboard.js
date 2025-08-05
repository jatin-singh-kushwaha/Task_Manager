import { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortByDate, setSortByDate] = useState(false);
  const [error, setError] = useState('');
  const [assignModal, setAssignModal] = useState({ show: false, userId: null });
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/tasks?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedTasks = res.data.tasks || [];
      setTasks(fetchedTasks);
      setTotalPages(res.data.totalPages || 1);
      setError('');
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to fetch tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'admin') fetchUsers();
  }, [user?.role, page]);

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this task?')) return;
  try {
    const token = localStorage.getItem('token');
    await API.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks(); // Refresh task list
  } catch (err) {
    console.error('❌ Error deleting task:', err.response?.data || err.message);
    alert(err.response?.data?.msg || 'Failed to delete task');
  }
};

  const handleAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.put(
        `/tasks/${selectedTaskId}/assign`,
        { userId: assignModal.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
      setAssignModal({ show: false, userId: null });
      setSelectedTaskId('');
    } catch (err) {
      alert('Failed to assign task');
    }
  };

  const filteredTasks = tasks
    .filter(
      (t) =>
        (!filterStatus || t.status === filterStatus) &&
        (!filterPriority || t.priority === filterPriority)
    )
    .sort((a, b) =>
      sortByDate ? new Date(a.dueDate) - new Date(b.dueDate) : 0
    );

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-100 border-r p-6 hidden md:block">
          <h3 className="text-xl font-semibold mb-6 text-indigo-700">📂 Menu</h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block px-3 py-2 rounded hover:bg-indigo-100 ${
                  location.pathname === '/' ? 'bg-indigo-200 text-indigo-800 font-semibold' : ''
                }`}
              >
                🏠 Dashboard
              </Link>
            </li>
            {user?.role === 'admin' && (
              <>
                <li>
                  <Link to="/task/create" className="block px-3 py-2 rounded hover:bg-indigo-100">
                    ➕ Create Task
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-indigo-100">
                    👥 Manage Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/users/create"
                    className="block px-3 py-2 rounded hover:bg-indigo-100"
                  >
                    ➕ Add User
                  </Link>
                </li>
              </>
            )}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 bg-white overflow-x-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📋 Dashboard</h2>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">👑 Admin - Users</h3>
              <div className="overflow-x-auto rounded border">
                <table className="w-full table-auto text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter((u) => u.role !== 'admin').map((u) => (
                      <tr key={u._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2 capitalize">{u.role}</td>
                        <td className="px-4 py-2 space-x-4">
                          <Link
                            to={`/users/edit/${u._id}`}
                            className="text-yellow-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            className="text-indigo-600 hover:underline"
                            onClick={() => setAssignModal({ show: true, userId: u._id })}
                          >
                            Assign Task
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.filter((u) => u.role !== 'admin').length === 0 && (
                  <p className="text-center py-4 text-gray-500">No non-admin users found</p>
                )}
              </div>
            </div>
          )}

          {/* Task Table */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">📝 Tasks</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Filter by Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Filter by Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                onClick={() => setSortByDate((prev) => !prev)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {sortByDate ? 'Clear Sort' : 'Sort by Due Date'}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto rounded border">
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Priority</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Due Date</th>
                    <th className="px-4 py-2">Assigned To</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2 capitalize">{task.priority}</td>
                      <td className="px-4 py-2 capitalize">{task.status}</td>
                      <td className="px-4 py-2">{task.dueDate?.slice(0, 10)}</td>
                      <td className="px-4 py-2">{task.assignedTo?.email || 'N/A'}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Link to={`/task/${task._id}`} className="text-blue-600 hover:underline">
                          View
                        </Link>
                        {user?.role === 'admin' && (
                          <>
                            <Link
                              to={`/task/edit/${task._id}`}
                              className="text-yellow-600 hover:underline"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && (
              <p className="text-center py-4 text-gray-500">No tasks found</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Assign Modal */}
      {assignModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Assign Task to User</h3>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="">Select a task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignModal({ show: false, userId: null })}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedTaskId}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
