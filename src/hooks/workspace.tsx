import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context state
type Workspace = {
  id: number;
  name: string;
};
interface ContextState {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (value: Workspace) => void;
}

// Create the context with a default value
const Workspace = createContext<ContextState | null>(null);

// Define the provider's props
interface MyProviderProps {
  children: ReactNode;
}

// Create the provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

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
