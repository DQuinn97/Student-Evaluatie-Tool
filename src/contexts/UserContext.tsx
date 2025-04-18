import { createContext, useContext, ReactNode, useCallback } from "react";

type UserContextType = {
  refreshUserData: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const refreshUserData = useCallback(async () => {
    try {
      const event = new CustomEvent("user-profile-updated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
