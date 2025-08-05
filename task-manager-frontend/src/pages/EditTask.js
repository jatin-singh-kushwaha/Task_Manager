import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch users:', err.response?.data || err.message);
    }
  };

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { title, description, dueDate, priority, status, assignedTo } = res.data;
      setFormData({
        title,
        description,
        dueDate: dueDate?.slice(0, 10),
        priority,
        status,
        assignedTo: assignedTo?._id || '',
      });
    } catch (err) {
      console.error('❌ Unable to load task data:', err.response?.data || err.message);
      setError('Unable to load task data');
    }
  };

  useEffect(() => {
    fetchTask();
    fetchUsers();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await API.put(`/tasks/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error('❌ Failed to update task:', err.response?.data || err.message);
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">✏️ Edit Task</h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Assign to User</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-indigo-500"
              >
                <option value="">-- Select User --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded transition duration-200"
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
