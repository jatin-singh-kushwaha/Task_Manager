import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch (err) {
        console.error('❌ Error fetching task detail:', err.response?.data || err.message);
        setError('Could not fetch task details');
      }
    };
    fetchTask();
  }, [id]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!task) return <div className="p-6 text-center text-gray-600">Loading task...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">📄 Task Details</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 font-semibold">📝 Title:</p>
              <p className="text-lg text-gray-800">{task.title}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">📌 Description:</p>
              <p className="text-gray-800">{task.description || 'N/A'}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">🎯 Status:</p>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : task.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {task.status}
              </span>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">🔥 Priority:</p>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-gray-600 font-semibold">📅 Due Date:</p>
              <p className="text-gray-800">{task.dueDate?.slice(0, 10)}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">👤 Assigned To:</p>
              <p className="text-gray-800">{task.assignedTo?.email || 'Unassigned'}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold">🕒 Created:</p>
              <p className="text-gray-800">{new Date(task.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📎 Attached Documents</h3>
          {task.documents.length === 0 ? (
            <p className="text-gray-500 italic">No documents attached.</p>
          ) : (
            <ul className="space-y-2">
              {task.documents.map((doc, index) => (
                <li key={index}>
                  <a
                    href={`http://localhost:5000/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📂 Document {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-200"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
