import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; // ✅ admin route
import EditTask from './pages/EditTask';
import UserList from './pages/UserList';
import EditUser from './pages/EditUser';
import AddUser from './pages/AddUser';

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Private Routes (User + Admin) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/task/create"
          element={
            <PrivateRoute>
              <CreateTask />
            </PrivateRoute>
          }
        />
        <Route
          path="/task/:id"
          element={
            <PrivateRoute>
              <TaskDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/task/edit/:id"
          element={
            <PrivateRoute>
              <EditTask />
            </PrivateRoute>
          }
        />

        {/* 🔐 Admin Only Routes */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/create"
          element={
            <AdminRoute>
              <AddUser />
            </AdminRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          }
        />

        {/* ❓ 404 Page */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
