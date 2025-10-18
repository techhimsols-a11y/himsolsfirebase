import React from "react";

export default function AdminContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-green-900">Content Management</h1>
      {/* Upload Section */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <form className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block mb-1 font-medium">File</label>
            <input type="file" className="border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select className="border rounded px-3 py-2">
              <option value="">Select Category</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Upload</button>
        </form>
      </div>
      {/* Uploaded Materials Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr>
              <td className="px-4 py-2">Awareness.pdf</td>
              <td className="px-4 py-2">PDF</td>
              <td className="px-4 py-2">Document</td>
              <td className="px-4 py-2 space-x-2">
                <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">View</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
            {/* More rows will be mapped here */}
          </tbody>
        </table>
      </div>
    </div>
  );
} 