import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Dashboard/sidebar';
import Navbar from '../../components/Dashboard/dashboardNavbar';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8081/users', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:8081/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to add user');
      await fetchUsers();
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'author' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role
        })
      });
      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'author' });
      alert('User updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/users/${selectedUser._id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: formData.password })
      });
      if (!response.ok) throw new Error('Failed to update password');
      setShowPasswordModal(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'author' });
      alert('Password updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-screen w-screen overflow-hidden bg-testingColorGrey">
      <div className="flex h-screen overflow-x-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-y-auto p-2">
          <main className="bg-testingColorBlack w-full h-full rounded-xl px-4 py-6 space-y-6">
            <Navbar />
            
            {/* Users Management Section */}
            <div className="bg-none rounded-xl shadow p-4 border-solid border-2 border-testingColorGrey">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-testingColorWhite">Users Management</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-cirtGrey text-white px-4 py-2 rounded-md hover:bg-opacity-80"
                >
                  Add New User
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-testingColorSubtitle uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-testingColorSubtitle uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-testingColorSubtitle uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-testingColorSubtitle uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-testingColorGrey/10">
                        <td className="px-6 py-4 whitespace-nowrap text-testingColorWhite">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-testingColorWhite">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-testingColorWhite">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({
                                name: user.name,
                                email: user.email,
                                role: user.role
                              });
                              setShowEditModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 mr-4"
                          >
                            Edit
                          </button>
                         
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({ password: '' });
                              setShowPasswordModal(true);
                            }}
                            className="text-green-400 hover:text-green-300"
                          >
                            Change Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-testingColorGrey rounded-lg p-6 w-96">
                  <h3 className="text-lg font-semibold mb-4 text-testingColorWhite">Add New User</h3>
                  <form onSubmit={handleAddUser}>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                        required
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                      >
                        <option value="author">Author</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="publisher">Publisher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 text-testingColorSubtitle hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cirtGrey text-white rounded hover:bg-opacity-80"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-testingColorGrey rounded-lg p-6 w-96">
                  <h3 className="text-lg font-semibold mb-4 text-testingColorWhite">Edit User</h3>
                  <form onSubmit={handleUpdateUser}>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                      >
                        <option value="author">Author</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="publisher">Publisher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setSelectedUser(null);
                          setFormData({ name: '', email: '', role: 'author' });
                        }}
                        className="px-4 py-2 text-testingColorSubtitle hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cirtGrey text-white rounded hover:bg-opacity-80"
                      >
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-testingColorGrey rounded-lg p-6 w-96">
                  <h3 className="text-lg font-semibold mb-4 text-testingColorWhite">Change Password</h3>
                  <form onSubmit={handleUpdatePassword}>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">New Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700"
                        required
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordModal(false);
                          setSelectedUser(null);
                          setFormData({ password: '' });
                        }}
                        className="px-4 py-2 text-testingColorSubtitle hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cirtGrey text-white rounded hover:bg-opacity-80"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
