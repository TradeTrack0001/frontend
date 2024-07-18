import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context state
interface ContextState {
  currentWorkspace: string;
  setCurrentWorkspace: (value: string) => void;
}

// Create the context with a default value
const Workspace = createContext<ContextState | null>(null);

// Define the provider's props
interface MyProviderProps {
  children: ReactNode;
}

// Create the provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<string>("");

  return (
    <Workspace.Provider value={{ currentWorkspace, setCurrentWorkspace }}>
      {children}
    </Workspace.Provider>
  );
};

// Create a custom hook to use the context
export const useWorkspace = (): ContextState => {
  const context = useContext(Workspace);
  if (context === null) {
    throw new Error("useWorkspace must be used within a MyProvider");
  }
  return context;
};
