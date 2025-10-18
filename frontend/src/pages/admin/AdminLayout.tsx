import { Outlet, NavLink } from "react-router-dom";
import { Home, List, TreePine, Users, FileText, BarChart, Settings, Menu, X, Award } from "lucide-react";
import { useState } from "react";

const menu = [
  { label: "Dashboard", icon: <Home size={20} />, path: "/admin" },
  { label: "Manage Requests", icon: <List size={20} />, path: "/admin/service-requests" },
  { label: "Manage Trees", icon: <TreePine size={20} />, path: "/admin/trees" },
  { label: "Users", icon: <Users size={20} />, path: "/admin/users" },
  { label: "Certificates", icon: <Award size={20} />, path: "/admin/certificates" },
  { label: "Content Management", icon: <FileText size={20} />, path: "/admin/content" },
  { label: "Reports", icon: <BarChart size={20} />, path: "/admin/reports" },
  { label: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#E8F5E9]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-green-100 border-b border-green-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-green-800">Admin Panel</div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-green-200 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-green-100 border-r border-green-200 flex flex-col p-4
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="text-2xl font-bold text-green-800 mb-8 hidden lg:block">Admin Panel</div>
        <nav className="flex-1 space-y-2">
          {menu.map(item => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded transition-colors font-medium text-green-900 hover:bg-green-200 ${isActive ? "bg-green-300" : ""}`
              }
              end
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after click
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:p-6 p-4 pt-20 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
} 