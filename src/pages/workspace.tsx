import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import axios from "../utils/axiosInstance"; // Use the configured axios instance
import { useAuth } from "../hooks/AuthContext";
import { useWorkspace } from "../hooks/workspace";
import { useNavigate } from "react-router-dom";

type Workspace = {
  id: number;
  name: string;
  users: string[];
};

export default function WorkspacePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [newUserName, setNewUserName] = useState("");
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Fetch workspaces from the backend
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get("/workspace/get_workspaces", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setWorkspaces(response.data.workspaces);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, [auth?.token]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/workspace/create_workspace",
        { name: newWorkspaceName },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setWorkspaces([...workspaces, response.data.workspace]);
      setNewWorkspaceName("");
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
  };

  const handleInviteUser = async () => {
    if (selectedWorkspace) {
      try {
        await axios.post(
          "/workspace/invite",
          { email: newUserName, workspaceId: selectedWorkspace.id },
          { headers: { Authorization: `Bearer ${auth?.token}` } }
        );
        setNewUserName("");
      } catch (error) {
        console.error("Error inviting user:", error);
      }
    }
  };

  const handleSetCurrentWorkspace = async (workspaceId: number) => {
    try {
      await axios.post(
        "/workspace/current_workspace",
        { workspaceId },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      const response = await axios.get("/workspace/current_workspace", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setCurrentWorkspace(response.data.currentWorkspace);
      setActiveWorkspaceId(workspaceId); // Update the active workspace ID
    } catch (error) {
      console.error("Error setting current workspace:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5">
        <div className="flex flex-col items-center justify-center flex-1 p-5">
          <div className="bg-gray-100 p-6 rounded mb-4 w-full max-w-md mt-8 md:mt-0 shadow">
            <h1 className="text-4xl font-bold text-center">Workspaces</h1>
          </div>
          <div className="bg-gray-100 p-6 rounded mb-4 w-full max-w-md shadow">
            <form onSubmit={handleCreateWorkspace}>
              <h2 className="text-2xl font-semibold text-center mb-4">
                Create New Workspace
              </h2>
              <div className="flex items-center mb-4">
                <label className="mr-2 text-lg">Name:</label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="p-2 border rounded flex-1"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-800 active:bg-blue-700"
                  style={{ width: "auto" }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
          <div className="bg-gray-100 p-6 rounded w-full max-w-md shadow">
            <h2 className="text-2xl font-semibold text-center mb-4">
              My Workspaces
            </h2>
            <h3 className="text-lg font-semibold mb-2">Name:</h3>
            <ul className="list-none list-inside">
              {workspaces &&
                workspaces.map((workspace) => (
                  <li
                    key={workspace.id}
                    className="cursor-pointer mb-2"
                    onClick={() => handleWorkspaceClick(workspace)}
                  >
                    <div className="flex justify-between items-center">
                      {workspace.name}
                      <button
                        onClick={() => handleSetCurrentWorkspace(workspace.id)}
                        className={`px-2 py-1 ml-4 text-white rounded hover:bg-blue-800 ${
                          activeWorkspaceId === workspace.id
                            ? "bg-blue-800"
                            : "bg-blue-500"
                        }`}
                      >
                        Set as Current
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            {selectedWorkspace && (
              <div className="p-4 mt-6 bg-white rounded shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">
                  Workspace Settings
                </h2>
                <h3 className="mb-2 text-lg font-semibold">Invite User</h3>
                <div className="flex items-center mb-4">
                  <label className="mr-2 text-lg">Email:</label>
                  <input
                    type="email"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="p-2 border rounded flex-1"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={handleInviteUser}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-800 active:bg-blue-700"
                    style={{ width: "auto" }}
                  >
                    Invite
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Users</h3>
                <ul className="list-disc list-inside">
                  {/* {selectedWorkspace.users.map((user, index) => (
                    <li key={index}>{user}</li>
                  ))} */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
