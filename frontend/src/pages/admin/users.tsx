import React from "react";

export default function AdminUsers() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-green-900">User Management</h1>
      {/* Search Bar */}
      <div className="mb-4">
        <input type="text" placeholder="Search by name or email" className="border rounded px-3 py-2 w-64" />
      </div>
      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr>
              <td className="px-4 py-2">Sunita Devi</td>
              <td className="px-4 py-2">sunita@example.com</td>
              <td className="px-4 py-2">Admin</td>
              <td className="px-4 py-2"><span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Active</span></td>
              <td className="px-4 py-2 space-x-2">
                <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">View</button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
              </td>
            </tr>
            {/* More rows will be mapped here */}
          </tbody>
        </table>
      </div>
    </div>
  );
} 