import { useState, useEffect, useContext } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { AuthContext } from "../hooks/AuthContext";

type Workspace = {
  id: number;
  name: string;
  users: string[];
};

export default function WorkspacePage() {
  const { auth } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    // Fetch workspaces from the backend
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get("/api/get_workspaces", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setWorkspaces(response.data.workspaces);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, [auth.token]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/create_workspace",
        { name: newWorkspaceName, adminId: auth.user.id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
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
          "/api/invite",
          { email: newUserName, workspaceId: selectedWorkspace.id },
          { headers: { Authorization: `Bearer ${auth.token}` } }
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
        "/api/current_workspace",
        { workspaceId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      const response = await axios.get("/api/current_workspace", {
        headers: { Authorization: `Bearer ${auth.token}` },
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
        <div className="flex flex-col items-center justify-center flex-1 bg-gray-200 p-5 rounded">
          <h1 className="text-4xl font-bold mb-4">Workspaces</h1>
          <form onSubmit={handleCreateWorkspace} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Create New Workspace</h2>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="border rounded p-2 ml-2"
              />
            </label>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Create
            </button>
          </form>
          <h2 className="text-2xl font-semibold mb-2">My Workspaces</h2>
          <ul className="list-disc list-inside">
            {workspaces.map((workspace) => (
              <li key={workspace.id} className="cursor-pointer" onClick={() => handleWorkspaceClick(workspace)}>
                {workspace.name}
                <button onClick={() => handleSetCurrentWorkspace(workspace.id)} className="ml-4 bg-green-500 text-white px-2 py-1 rounded">
                  Set as Current
                </button>
              </li>
            ))}
          </ul>
          {selectedWorkspace && (
            <div className="mt-6 bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Workspace Settings</h2>
              <h3 className="text-lg font-semibold mb-2">Invite User</h3>
              <label className="block mb-2">
                Email:
                <input
                  type="email"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="border rounded p-2 ml-2"
                />
              </label>
              <button onClick={handleInviteUser} className="bg-blue-500 text-white px-4 py-2 rounded">
                Invite
              </button>
              <h3 className="text-lg font-semibold mt-4">Users</h3>
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
