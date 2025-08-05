import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function CreateTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...documents, ...files].slice(0, 3);
    setDocuments(updatedFiles);

    if (updatedFiles.length > 3) {
      setError('Only up to 3 PDF files allowed');
    } else {
      setError('');
    }
    e.target.value = '';
  };

  const removeFile = index => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    documents.forEach(doc => {
      formData.append('documents', doc);
    });

    try {
      const token = localStorage.getItem('token');
      await API.post('/tasks', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('✅ Task created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Task creation failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">📝 Create New Task</h2>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Task details or notes"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Assign to User</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- Select User --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.email} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Attach PDF Documents (Max 3)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full border px-4 py-2 rounded shadow-sm"
              />
            </div>

            {documents.length > 0 && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-semibold mb-2">Selected Files:</p>
                <ul className="space-y-1">
                  {documents.map((file, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              ➕ Create Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
