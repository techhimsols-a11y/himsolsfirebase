import React from "react";

export default function AdminReports() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-green-900">Reports & Analytics</h1>
      {/* Export and Custom Report Section */}
      <div className="bg-white rounded shadow p-6 mb-8 flex flex-wrap gap-4 items-end">
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Export Data</button>
        <form className="flex gap-2">
          <input type="text" placeholder="Custom Report Name" className="border rounded px-3 py-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Generate Report</button>
        </form>
      </div>
      {/* Placeholder for analytics widgets or charts */}
      <div className="bg-emerald-50 rounded p-8 text-center text-green-700">Analytics and charts will appear here.</div>
    </div>
  );
} 