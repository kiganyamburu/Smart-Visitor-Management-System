import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
//import { useAuth } from "../../contexts/AuthContext";
import { 
  FiHome, 
  FiUser, 
  FiSettings, 
  FiBarChart2, 
  FiLayers, 
  FiMenu
} from "react-icons/fi";
//import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaUserCheck, FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  //const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/", icon: <FiHome /> },
    { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
    { name: "Departments", path: "/dashboard/departments", icon: <FiLayers /> },
    { name: "Visitors", path: "/dashboard/visitors", icon: <FaUserCheck /> },
    { name: "Attendance", path: "/dashboard/attendance", icon: <FaClipboardList /> },
    { name: "Report", path: "/dashboard/reports", icon: <FiBarChart2 /> },
   // { name: "Administrators", path: "/admins", icon: <MdOutlineAdminPanelSettings /> },
    { name: "Settings", path: "/dashboard/settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-4 left-4 text-[#1A0033] md:hidden z-50 shadow-md p-2 rounded-full bg-white transition-all hover:shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu className="text-3xl" />
      </button>

      {/* Sidebar Container */}
      <aside
        className={`bg-white text-[#1A0033] w-60 h-screen fixed top-0 left-0 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center py-5 border-b border-gray-300 shadow-sm">
          <h2 className="text-xl font-semibold tracking-wide">Admin Panel</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-2 overflow-y-auto h-[calc(100vh-80px)] p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-md transition-all duration-300 shadow-sm ${
                location.pathname === item.path
                  ? "bg-gray-200 text-[#1A0033] font-semibold shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:shadow"
              }`}
            >
              <span className="text-xl">{item.icon}</span> 
              <span className="text-lg">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
