import React from "react";

export default function AdminSettings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-green-900">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-800">Profile</h2>
          <input type="text" placeholder="Name" className="border rounded px-3 py-2 mb-2 w-full" />
          <input type="email" placeholder="Email" className="border rounded px-3 py-2 mb-2 w-full" />
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Update Profile</button>
        </div>
        {/* Security Settings */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-800">Security</h2>
          <input type="password" placeholder="New Password" className="border rounded px-3 py-2 mb-2 w-full" />
          <input type="password" placeholder="Confirm Password" className="border rounded px-3 py-2 mb-2 w-full" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Change Password</button>
        </div>
        {/* Notifications */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-800">Notifications</h2>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="accent-green-600" /> Email Notifications
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="accent-green-600" /> SMS Alerts
          </label>
        </div>
        {/* System Configuration */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-800">System Configuration</h2>
          <input type="text" placeholder="Site Title" className="border rounded px-3 py-2 mb-2 w-full" />
          <button className="bg-amber-600 text-white px-4 py-2 rounded shadow hover:bg-amber-700">Save Settings</button>
        </div>
      </div>
    </div>
  );
} 