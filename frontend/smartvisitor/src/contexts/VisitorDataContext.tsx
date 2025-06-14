import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface VisitorStats {
  totalVisitors: number;
  maleVisitors: number;
  femaleVisitors: number;
  otherVisitors: number;
  peakHours: { _id: number; count: number }[];
  frequentVisitors: { name: string; count: number }[];
}

interface VisitorContextType {
  stats: VisitorStats | null;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    if (user) {
      const url = user.role === "ADMIN"
        ? "https://backend-lingering-flower-8936.fly.dev/api/visitor-analysis"
        : `https://backend-lingering-flower-8936.fly.dev/api/visitor-analysis/${user.department}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => setStats(data));
    }
  }, [user]);

  return <VisitorContext.Provider value={{ stats }}>{children}</VisitorContext.Provider>;
};

export const useVisitorData = () => {
  const context = useContext(VisitorContext);
  if (!context) throw new Error("useVisitorData must be used within a VisitorProvider");
  return context;
};

