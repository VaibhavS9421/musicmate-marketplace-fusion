
import React, { createContext, useState, useContext } from 'react';

type UserRole = 'buyer' | 'seller' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

// Create context with a default value
const UserRoleContext = createContext<UserRoleContextType>({
  userRole: null,
  setUserRole: () => {},
});

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if there's a stored role in localStorage
  const storedRole = localStorage.getItem('userRole') as UserRole || null;
  const [userRole, setUserRole] = useState<UserRole>(storedRole);

  // Create a function to update both state and localStorage
  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole: handleSetUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
