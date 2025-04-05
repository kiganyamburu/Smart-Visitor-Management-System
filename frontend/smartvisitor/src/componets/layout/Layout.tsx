import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
//import Footer from "../../Mainpages/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - Visible on larger screens */}
      <aside className="fixed top-0 left-0 h-full w-60 bg-[#1A0033] shadow-2xl z-40 hidden md:flex flex-col">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar & Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 w-60 bg-[#1A0033] shadow-2xl transform transition-transform duration-300 md:hidden z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col transition-all duration-300 md:ml-60">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 md:left-60 w-full md:w-[calc(100%-15rem)] bg-white shadow-md z-50">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto mt-14 p-2">{children}</main>
      </div>
    </div>
    
  );
};

export default Layout;
