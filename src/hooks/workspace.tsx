import axios from "axios";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Define the shape of the context state
type Workspace = {
  id: number;
  name: string;
};
interface ContextState {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (value: Workspace) => void;
  getInventory: () => Promise<
    {
      itemID: any;
      itemName: any;
      itemDescription: any;
      itemQuantity: any;
      itemStatus: any;
      itemSize: any;
      type: any;
      checkInDate: any;
      checkOutDate: any;
      location: any;
      workspaceId: any;
    }[]
  >;
}

// Create the context with a default value
const Workspace = createContext<ContextState | null>(null);

// Define the provider's props
interface MyProviderProps {
  children: ReactNode;
}

// Create the provider component
export const WorkspaceProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const { auth } = useAuth();
  const baseUrl = "https://backend-uas6.onrender.com";

  async function getInventory() {
    const inventoryList: any = [];
    if (!currentWorkspace) return [];
    const url = `${baseUrl}/workspace/workspaces/${currentWorkspace?.id}/inventory`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      if (res.status === 200) {
        console.log("Successfully retrieved the object");

        const data = res.data;
        console.log("This is the data: ", data);
        if (data && currentWorkspace) {
          console.log("Successfully parsed");
          return data;
        } else {
          console.log("Failed to parse inventory data");
          return [];
        }
      } else {
        console.log("Failed to get response");
        return [];
      }
    } catch (e: any) {
      console.error("Error in getInventory: " + e.toString());
      return [];
    }
  }

  return (
    <Workspace.Provider
      value={{ currentWorkspace, setCurrentWorkspace, getInventory }}
    >
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
