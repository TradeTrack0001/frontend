import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";

type Workspace = {
    id: string;
    name: string;
    users: string[];
};

export default function Workspace() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [newUserName, setNewUserName] = useState("");

    useEffect(() => {
        // Fetch workspaces from the backend
        const fetchWorkspaces = async () => {
            try {
                const response = await axios.get("/api/workspaces");
                setWorkspaces(response.data);
            } catch (error) {
                console.error("Error fetching workspaces:", error);
            }
        };
        fetchWorkspaces();
    }, []);

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Fetch the latest workspace UUID
            const response = await axios.get("/api/workspace/fetch-id");
            let newId = response.data.lastUuid ? parseInt(response.data.lastUuid) + 1 : 1;
            const newWorkspace = {
                id: newId.toString(),
                name: newWorkspaceName,
                users: [],
            };

            // Save the new workspace to the backend
            await axios.post("/api/workspaces", newWorkspace);

            // Update the frontend state
            setWorkspaces([...workspaces, newWorkspace]);
            setNewWorkspaceName("");
        } catch (error) {
            console.error("Error creating workspace:", error);
        }
    };

    const handleWorkspaceClick = (workspace: Workspace) => {
        setSelectedWorkspace(workspace);
        // Save the selected workspace ID to localStorage or a global state
        localStorage.setItem("selectedWorkspaceId", workspace.id);
    };

    const handleWorkspaceNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedWorkspace) {
            const updatedWorkspace = { ...selectedWorkspace, name: e.target.value };
            try {
                await axios.put(`/api/workspaces/${selectedWorkspace.id}`, { name: e.target.value });
                setSelectedWorkspace(updatedWorkspace);
                setWorkspaces(workspaces.map(ws => ws.id === selectedWorkspace.id ? updatedWorkspace : ws));
            } catch (error) {
                console.error("Error updating workspace name:", error);
            }
        }
    };

    const handleInviteUser = async () => {
        if (selectedWorkspace) {
            const updatedWorkspace = { ...selectedWorkspace, users: [...selectedWorkspace.users, newUserName] };
            try {
                await axios.post(`/api/workspaces/${selectedWorkspace.id}/invite`, { email: newUserName });
                setSelectedWorkspace(updatedWorkspace);
                setWorkspaces(workspaces.map(ws => ws.id === selectedWorkspace.id ? updatedWorkspace : ws));
                setNewUserName("");
            } catch (error) {
                console.error("Error inviting user:", error);
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="flex flex-col items-center justify-center flex-1 bg-gray-200 p-5 rounded">
                    <h1 className="text-4xl font-bold mb-4">Workspace</h1>
                    <form onSubmit={handleCreateWorkspace} className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Create New Workspace</h2>
                        <label className="block mb-2">
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                className="border rounded p-2 ml-2"
                            />
                        </label>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                    </form>
                    <h2 className="text-2xl font-semibold mb-2">My Workspaces</h2>
                    <ul className="list-disc list-inside">
                        {workspaces.map(workspace => (
                            <li key={workspace.id} className="cursor-pointer" onClick={() => handleWorkspaceClick(workspace)}>
                                {workspace.name}
                            </li>
                        ))}
                    </ul>
                    {selectedWorkspace && (
                        <div className="mt-6 bg-white p-4 rounded shadow-lg">
                            <h2 className="text-xl font-semibold mb-2">Workspace Settings</h2>
                            <label className="block mb-2">
                                Name:
                                <input
                                    type="text"
                                    value={selectedWorkspace.name}
                                    onChange={handleWorkspaceNameChange}
                                    className="border rounded p-2 ml-2"
                                />
                            </label>
                            <h3 className="text-lg font-semibold mb-2">Users</h3>
                            <ul className="list-disc list-inside mb-4">
                                {selectedWorkspace.users.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))}
                            </ul>
                            <label className="block mb-2">
                                Invite User:
                                <input
                                    type="text"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    className="border rounded p-2 ml-2"
                                />
                            </label>
                            <button onClick={handleInviteUser} className="bg-blue-500 text-white px-4 py-2 rounded">Invite</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
