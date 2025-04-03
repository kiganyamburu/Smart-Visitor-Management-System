import { createContext, useContext, useEffect, useState } from "react";
import  { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  role: "super_admin" | "department_admin";
  department?: string; // Only for department admins
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded token", decoded);
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          department: decoded.department,
        });
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    }
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
