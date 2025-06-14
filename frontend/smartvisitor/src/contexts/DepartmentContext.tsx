import React, { createContext, useState, ReactNode } from "react";

interface DepartmentContextType {
  department: string;
  setDepartment: (dept: string) => void;
}

export const DepartmentContext = createContext<DepartmentContextType>({
  department: "",
  setDepartment: () => {},
});

interface DepartmentProviderProps {
  children: ReactNode;
}

export const DepartmentProvider: React.FC<DepartmentProviderProps> = ({ children }) => {
  const [department, setDepartment] = useState("IT"); // Default department can be set here

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};
