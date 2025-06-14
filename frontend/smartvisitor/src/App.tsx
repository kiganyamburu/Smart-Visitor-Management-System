import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./Mainpages/AdminLogin";
import AdminRegister from "./Mainpages/AdminRegister";
import VisitorCheck from "./Mainpages/VisitorsCheck";
import Dashboard from "./componets/layout/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { VisitorProvider } from "./contexts/VisitorDataContext";
import { DepartmentProvider } from "./contexts/DepartmentContext"; // Import the provider



const AppRoutes = () => {
  return (
    <AuthProvider>
      <VisitorProvider>
        <DepartmentProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/register" element={<AdminRegister />} />
              <Route path="/" element={<VisitorCheck />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
          </Router>
        </DepartmentProvider>
      </VisitorProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
