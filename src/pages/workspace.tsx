import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { useWorkspace } from "../hooks/workspace";

type Workspace = {
  id: number;
  name: string;
  users: string[];
};

export default function WorkspacePage() {
  const { auth } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [newUserName, setNewUserName] = useState("");
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();

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
    } catch (error) {
      console.error("Error setting current workspace:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5">
        <div className="flex flex-col items-center justify-center flex-1 p-5 bg-gray-200 rounded">
          <h1 className="mb-4 text-4xl font-bold">Workspaces</h1>
          <form onSubmit={handleCreateWorkspace} className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Create New Workspace
            </h2>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="p-2 ml-2 border rounded"
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Create
            </button>
          </form>
          <h2 className="mb-2 text-2xl font-semibold">My Workspaces</h2>
          <ul className="list-disc list-inside">
            {workspaces.map((workspace) => (
              <li
                key={workspace.id}
                className="cursor-pointer"
                onClick={() => handleWorkspaceClick(workspace)}
              >
                {workspace.name}
                <button
                  onClick={() => handleSetCurrentWorkspace(workspace.id)}
                  className="px-2 py-1 ml-4 text-white bg-green-500 rounded"
                >
                  Set as Current
                </button>
              </li>
            ))}
          </ul>
          {selectedWorkspace && (
            <div className="p-4 mt-6 bg-white rounded shadow-lg">
              <h2 className="mb-2 text-xl font-semibold">Workspace Settings</h2>
              <h3 className="mb-2 text-lg font-semibold">Invite User</h3>
              <label className="block mb-2">
                Email:
                <input
                  type="email"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="p-2 ml-2 border rounded"
                />
              </label>
              <button
                onClick={handleInviteUser}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Invite
              </button>
              <h3 className="mt-4 text-lg font-semibold">Users</h3>
              <ul className="list-disc list-inside">
                {selectedWorkspace.users.map((user, index) => (
                  <li key={index}>{user}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
