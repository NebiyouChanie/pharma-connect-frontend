import { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export const useRoleContext = () => {
  return useContext(RoleContext);
};

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("user");

  const updateRole = (userRole) => {
    setRole(userRole);
  };

  const getRole = () => {
    return role;
  };

  return (
    <RoleContext.Provider value={{ role, updateRole, getRole }}>
      {children}
    </RoleContext.Provider>
  );
};
