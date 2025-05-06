import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { FaEdit } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { HiArrowSmRight } from "react-icons/hi";
import { HiArrowSmLeft } from "react-icons/hi";
import { TbArrowsRight } from "react-icons/tb";
import { TbArrowsLeft } from "react-icons/tb";
import API_BASE_URL from "../../config.js";




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

  // useEffect(() => {
  //   // For development/testing only
  //   const isDev = process.env.NODE_ENV === 'development';
  
  //   if (isDev) {
  //     setUsers([
  //       { _id: '1', name: 'Sebastian Carter', email: 'sebastian.carter@example.com', role: 'admin' },
  //       { _id: '2', name: 'Natalie Dawson', email: 'natalie.dawson@example.com', role: 'reviewer' },
  //       { _id: '3', name: 'Jackson Lee', email: 'jackson.lee@example.com', role: 'publisher' },
  //       { _id: '4', name: 'Ava Thompson', email: 'ava.thompson@example.com', role: 'author' },
  //       { _id: '5', name: 'Liam Wilson', email: 'liam.wilson@example.com', role: 'reviewer' },
  //       { _id: '6', name: 'Emma Martinez', email: 'emma.martinez@example.com', role: 'admin' },
  //       { _id: '1', name: 'Sebastian Carter', email: 'sebastian.carter@example.com', role: 'admin' },
  //       { _id: '2', name: 'Natalie Dawson', email: 'natalie.dawson@example.com', role: 'reviewer' },
  //       { _id: '3', name: 'Jackson Lee', email: 'jackson.lee@example.com', role: 'publisher' },
  //       { _id: '4', name: 'Ava Thompson', email: 'ava.thompson@example.com', role: 'author' },
  //       { _id: '5', name: 'Liam Wilson', email: 'liam.wilson@example.com', role: 'reviewer' },
  //       { _id: '6', name: 'Emma Martinez', email: 'emma.martinez@example.com', role: 'admin' },
  //       { _id: '1', name: 'Sebastian Carter', email: 'sebastian.carter@example.com', role: 'admin' },
  //       { _id: '2', name: 'Natalie Dawson', email: 'natalie.dawson@example.com', role: 'reviewer' },
  //       { _id: '3', name: 'Jackson Lee', email: 'jackson.lee@example.com', role: 'publisher' },
  //       { _id: '4', name: 'Ava Thompson', email: 'ava.thompson@example.com', role: 'author' },
  //       { _id: '5', name: 'Liam Wilson', email: 'liam.wilson@example.com', role: 'reviewer' },
  //       { _id: '6', name: 'Emma Martinez', email: 'emma.martinez@example.com', role: 'admin' },
        
  //     ]);
  //     setLoading(false);
  //   } else {
  //     fetchUsers();
  //   }
  // }, []);
  
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

  // UNCOMMENT FOR REAL TESTING
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('${API_BASE_URL}/users', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
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
      const response = await fetch('${API_BASE_URL}/signup', {
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
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser._id}`, {
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
      
      // Update the local state immediately
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === selectedUser._id 
            ? { ...user, name: formData.name, email: formData.email, role: formData.role }
            : user
        )
      );
      
      // Then fetch fresh data from server
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
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser._id}/password`, {
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



  if (error?.includes('Access denied')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-testingColorBlack text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
        <p className="text-lg">Please log in as an administrator to view this page.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-testingColorBlack text-white p-4">
      <div className="text-xl">Loading...</div>
    </div>
  );

  if (error) {
    let errorMessage = "";
    let errorTitle = "";
    
    if (error.includes('Please log in')) {
      errorTitle = "Authentication Required";
      errorMessage = "Please log in with appropriate credentials.";
    } else if (error.includes('Access denied')) {
      errorTitle = "Access Restricted";
      errorMessage = "This page is only accessible to administrators.";
    } else {
      errorTitle = "Error";
      errorMessage = error;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-testingColorBlack text-white p-4">
        <h2 className="text-2xl font-bold mb-4">{errorTitle}</h2>
        <p className="text-lg text-center">{errorMessage}</p>
      </div>
    );
  };

  return (
        <div className="flex overflow-hidden bg-transparent">
          <main className="flex-1 p-6 bg-transparent overflow-hidden">
            
            {/* Users Management Section */}
            <div className="flex flex-col bg-transparent rounded-lg  border-solid border-2 border-testingColorOutline">
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
                <div className="flex-1 overflow-x-auto w-full rounded-lg border border-testingColorGrey bg-testingColorBlack min-h-0">
                  <table className="min-w-full table-auto border-gray-300 border-spacing-0 ">
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
                      className="px-3 py-1 text-sm text-testingColorBlack  bg-testingColorSubtitle border  disabled:opacity-50  rounded"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span><TbArrowsLeft size={16} className="flex items-center" /></span>
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-testingColorBlack disabled:opacity-50 bg-testingColorSubtitle border rounded"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span><HiArrowSmLeft size={16} className="flex items-center" /></span>
                    </button>
                    <span className="text-sm text-testingColorSubtitle font-medium">
                      Page {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount()}
                    </span>
                    <button
                      className="px-3 py-1 text-sm text-testingColorBlack disabled:opacity-50 bg-testingColorSubtitle border  rounded"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span><HiArrowSmRight size={16} className="flex items-center" /></span>
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-testingColorBlack disabled:opacity-50 bg-testingColorSubtitle border rounded"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <span><TbArrowsRight size={16} className="flex items-center" /></span>
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
                      <label className="block text-testingColorSubtitle mb-2 ">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700 box-border focus:border-transparent focus:outline-cirtRed focus:ring-0"
                        placeholder="Name"
                        
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle b-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700 box-border focus:border-transparent focus:outline-cirtRed focus:ring-0"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-testingColorSubtitle mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 rounded bg-testingColorBlack text-white border border-gray-700 box-border focus:border-transparent focus:outline-cirtRed focus:ring-0"
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
  );
}
