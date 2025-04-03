import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Mainpages/AdminLogin";
import AdminRegister from "./Mainpages/AdminRegister";
import VisitorCheck from "./Mainpages/VisitorsCheck";
import Dashboard from "./componets/layout/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { VisitorProvider } from "./contexts/VisitorDataContext";

//import AdminDashboard from "../pages/AdminDashboard"; // Create a dashboard page

const AppRoutes = () => {
  return (
    <AuthProvider>
      <VisitorProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
         <Route path="/register" element={<AdminRegister/>} />
         <Route path="/" element={<VisitorCheck />} />
         <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
    </VisitorProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
