import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { FaEdit } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

export default function UsersPage() {
  const trimText = (text, maxLength = 50) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // For development/testing only
    const isDev = process.env.NODE_ENV === 'development';
  
    if (isDev) {
      setUsers([
        { _id: '1', name: 'Sebastian Carter', email: 'sebastian.carter@example.com', role: 'admin' },
        { _id: '2', name: 'Natalie Dawson', email: 'natalie.dawson@example.com', role: 'reviewer' },
        { _id: '3', name: 'Jackson Lee', email: 'jackson.lee@example.com', role: 'publisher' },
        { _id: '4', name: 'Ava Thompson', email: 'ava.thompson@example.com', role: 'author' },
        { _id: '5', name: 'Liam Wilson', email: 'liam.wilson@example.com', role: 'reviewer' },
        { _id: '6', name: 'Emma Martinez', email: 'emma.martinez@example.com', role: 'admin' }
      ]);
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, []);
  
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span title={row.original.name}>{trimText(row.original.name)}</span>
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'role',
      header: 'Role'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="space-x-2">
          <button
            onClick={() => {
              setSelectedUser(row.original);
              setFormData({
                name: row.original.name,
                email: row.original.email,
                role: row.original.role
              });
              setShowEditModal(true);
            }}
            className="bg-transparent text-white px-2 py-1 rounded border-solid border-testingColorOutline text-sm w-24"
          >
            <div className="flex items-center justify-center gap-1">
              <FaEdit size={12} className="text-testingColorWhite" />
              <span>Edit</span>
            </div>
            
          </button>
          <button
            onClick={() => {
              setSelectedUser(row.original);
              setShowPasswordModal(true);
            }}
            className="bg-transparent text-white px-2 py-1 rounded border-solid border-testingColorOutline text-sm w-24"
          >
            <div className="flex items-center justify-center gap-1">
              <FaLock size={12} className="text-testingColorWhite"/>
              <span>Password</span>
            </div>
          </button>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author'
  });

  // Fetch users on component mount
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8081/users', {
  //       credentials: 'include'
  //     });
  //     if (!response.ok) throw new Error('Failed to fetch users');
  //     const data = await response.json();
  //     setUsers(data);
  //     setLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //   }
  // };

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



  if (loading) return <div className="bg-testingColorBlack text-white p-4">Loading...</div>;
  if (error) return <div className="bg-testingColorBlack text-white p-4">Error: {error}</div>;

  return (
    <div className="bg-testingColorBlack">
        <div className="flex flex-col flex-1 overflow-hidden p-2 bg-testingColorBlack min-h-screen">
          <main className="flex-1 p-6 bg-testingColorBlack overflow-hidden">
            
            {/* Users Management Section */}
            <div className="flex flex-col h-[calc(100vh-8rem)] bg-testingColorBlack rounded-lg shadow-lg border border-testingColorGrey/30">
              <div className="flex flex-col flex-1 p-4 min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-testingColorSubtitle">User Management</h2>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-transparent border border-solid border-testingColorOutline text-white px-4 py-2 rounded hover:bg-testingColorHover"
                  >
                    Add User
                  </button>
                </div>

                {/* Users Table */}
                <div className="flex-1 overflow-auto rounded-lg border border-testingColorGrey bg-testingColorBlack min-h-0">
                  <table className="min-w-full table-auto border-gray-300 border-spacing-0">
                    <thead className="bg-testingColorOutline">
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th key={header.id} className="px-4 py-2 border text-center text-sm font-medium text-testingColorSubtitle">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-testingColorHover">
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="px-4 py-2 border text-sm text-testingColorSubtitle">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination */}
              <div className="border-t border-testingColorGrey">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <button
                      className="px-3 py-1 text-sm text-testingColorSubtitle disabled:opacity-50 hover:bg-testingColorHover rounded"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {'<<'}
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-testingColorSubtitle disabled:opacity-50 hover:bg-testingColorHover rounded"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {'<'}
                    </button>
                    <span className="text-sm text-testingColorSubtitle font-medium">
                      Page {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount()}
                    </span>
                    <button
                      className="px-3 py-1 text-sm text-testingColorSubtitle disabled:opacity-50 hover:bg-testingColorHover rounded"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      {'>'}
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-testingColorSubtitle disabled:opacity-50 hover:bg-testingColorHover rounded"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      {'>>'}
                    </button>
                  </div>
                  <select
                    className="px-3 py-1 text-sm bg-testingColorBlack text-testingColorSubtitle border border-testingColorGrey rounded hover:bg-testingColorHover"
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                  >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
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
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700 box-border"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700 box-border"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700 box-border"
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
  );
}
