import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Grid } from "antd";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiBarChart2,
  FiLayers,
  FiMenu,
} from "react-icons/fi";
import { FaUserCheck, FaClipboardList } from "react-icons/fa";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  // On medium and up, use a fixed width of 200px; otherwise, full width.
  const siderWidth = screens.md ? 200 : "100%";

  const menuItems = [
    { key: "/dashboard/", label: "Dashboard", icon: <FiHome /> },
    { key: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
    { key: "/dashboard/departments", label: "Departments", icon: <FiLayers /> },
    { key: "/dashboard/visitors", label: "Visitors", icon: <FaUserCheck /> },
    { key: "/dashboard/attendance", label: "Attendance", icon: <FaClipboardList /> },
    { key: "/dashboard/reports", label: "Report", icon: <FiBarChart2 /> },
    { key: "/dashboard/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <Sider
    collapsible
    collapsed={collapsed}
    onCollapse={(value) => setCollapsed(value)}
    breakpoint="md"
    width={screens.md ? 240 : undefined}
    collapsedWidth={screens.md ? 100 : 0}
    style={{ height: "100vh", width: siderWidth }}
    theme="dark"
  >
  
      {/* Sidebar Header */}
      <div
        style={{
          height: 64,
          margin: 16,
          color: "#fff",
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Admin Panel
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.key}>{item.label}</Link>,
        }))}
      />

      {/* Toggle Button only on small screens */}
      {!screens.md && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            icon={<FiMenu />}
          />
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;
