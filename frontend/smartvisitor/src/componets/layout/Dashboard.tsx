import Layout from "./Layout";
import DashboardContent from "./DashboardContent";
import { Routes, Route } from "react-router-dom";
import AdminProfile from "../common/profile";
import Department from "../common/Department";
import VisitorManagement from "../common/Visitor";
import AttendanceDashboard from "../common/Attendance";
import Reports from "../common/Reports";
import Settings from "../common/Settings";

export default function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardContent />} />
        <Route path="profile" element={<AdminProfile/>} />
        <Route path="departments" element={<Department />} />
        <Route path="visitors" element={<VisitorManagement />} />
        <Route path="attendance" element={<AttendanceDashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}