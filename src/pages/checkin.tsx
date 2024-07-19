import { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Sidebar from "../components/sidebar";
import useCheckin from "../hooks/check-in";
import { useWorkspace } from "../hooks/workspace";
import { AuthContext } from "../hooks/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Define the material type
type Material = {
  itemID: String;
  itemName: string;
  itemDescription: string;
  itemQuantity: number;
  itemStatus: boolean;
  itemSize: string;
  type: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
};

// Define the check-in item type
type CheckInItem = {
  id: string;
  name: string;
  location: string;
  checkInQuantity: string;
  availableQuantity: string;
  employeeId: string;
  employeeName: string;
  checkInDate: string;
};

export default function Checkin() {
  const { getInventory } = useWorkspace();
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const auth = authContext?.auth;
  const logout = authContext?.logout;
  const [materials, setMaterials] = useState<Material[]>([]);
  
  const [checkedInItems, setCheckedInItems] = useState<CheckInItem[]>([]);
  const [newCheckIn, setNewCheckIn] = useState<CheckInItem>({
    id: "",
    name: "",
    location: "",
    checkInQuantity: "",
    availableQuantity: "",
    employeeId: "",
    employeeName: "",
    checkInDate: "",
  });
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      if (auth && auth.token) {
        try {
          const response = await axios.get(
            "http://localhost:2000/auth/protected",
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          setMessage(response.data);
        } catch (error: any) {
          console.error("Error fetching protected data", error);
          if (error.response && error.response.status === 401) {
            if (logout) {
              logout();
            }
            navigate("/");
          }
        }
      } else {
        navigate("/");
      }
    };
    const fetchCurrentWorkspace = async () => {
      if (auth && auth.token) {
        try {
          const response = await axios.get(
            "http://localhost:2000/workspace/current_workspace",
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          setWorkspaceId(response.data.currentWorkspace?.id || null);
          // setMaterials((prev) => ({
          //   ...prev,
          //   workspaceId: response.data.currentWorkspace?.id || 0,
          // }))
          console.log("Current workspace ID:", response.data.currentWorkspace?.id);
        } catch (error) {
          console.error("Error fetching current workspace", error);
          navigate("/workspace");
        }
      }
    };

    fetchProtectedData();
    fetchCurrentWorkspace();
  }, [auth, logout, navigate]);


  useEffect(() => {
    // Fetch workspaceId from local storage
    if (workspaceId) {
      fetchMaterials(workspaceId); // Fetch data based on workspaceId
    } else {
      setWorkspaceId(null);
    }
  }, [workspaceId]);

  const fetchMaterials = async (workspaceId: string) => {
    const data = await getInventory(); // Adjust your hook to accept workspaceId
    console.log("This is the data: ", data);
    const formattedData = data.inventoryItems.map((item: any) => ({
      itemID: item.itemID,
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      itemQuantity: item.itemQuantity,
      itemStatus: item.itemStatus,
      itemSize: item.itemSize,
      type: item.type,
      checkInDate: item.checkInDate,
      checkOutDate: item.checkOutDate,
      location: item.location,
    }));
    setMaterials(formattedData);
    console.log("This is the materials: ", materials);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCheckIn((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckIn = (e: FormEvent) => {
    e.preventDefault();
    setCheckedInItems((prev) => [...prev, newCheckIn]);
    setNewCheckIn({
      id: "",
      name: "",
      location: "",
      checkInQuantity: "",
      availableQuantity: "",
      employeeId: "",
      employeeName: "",
      checkInDate: "",
    });
  };

  const handleInventoryItemClick = (material: Material) => {
    setNewCheckIn((prev) => ({
      ...prev,
      id: material.itemID.toString(),
      name: material.itemName,
      location: material.location,
      availableQuantity: material.itemQuantity.toString(),
    }));
  };

  const confirmCheckInItems = async () => {
    // Update the inventory with the new quantities
    const updatedMaterials = materials.map((material) => {
      const checkedInItem = checkedInItems.find(
        (item) => item.id === material.itemID.toString()
      );
      if (checkedInItem) {
        return {
          ...material,
          itemQuantity:
            material.itemQuantity + parseInt(checkedInItem.checkInQuantity, 10),
        };
      }
      return material;
    });

    useCheckin(checkedInItems);

    setCheckedInItems([]);
    setMaterials(updatedMaterials);
  };

  if (!workspaceId) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-5 pt-16 md:ml-64">
          <div className="p-3 bg-white rounded shadow">
            <h2 className="mb-4 text-2xl text-gray-800">Workspace Not Found</h2>
            <p className="text-gray-700">
              Create or join a workspace to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 pt-16 md:ml-64">
        <div className="p-3 bg-white rounded shadow">
          <h2 className="mb-4 text-2xl text-gray-800">Check In Details</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Material Details */}
            <div>
              <h3 className="mb-2 text-xl text-gray-800">Material Details</h3>
              <form onSubmit={handleCheckIn}>
                <div className="mb-4">
                  <label className="block text-gray-700">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newCheckIn.id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCheckIn.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newCheckIn.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Check In Quantity
                  </label>
                  <input
                    type="number"
                    name="checkInQuantity"
                    value={newCheckIn.checkInQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={newCheckIn.availableQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    disabled
                  />
                </div>
              </form>
            </div>

            {/* Check In From */}
            <div>
              <h3 className="mb-2 text-xl text-gray-800">Check In From</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={newCheckIn.employeeId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={newCheckIn.employeeName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Check In Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={newCheckIn.checkInDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Check In Material
            </button>
          </div>

          {checkedInItems.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xl text-gray-800">Checked In Items</h3>
              <table className="min-w-full mb-4 bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Location</th>
                    <th className="px-4 py-2 border-b">Check In Quantity</th>
                    <th className="px-4 py-2 border-b">Employee ID</th>
                    <th className="px-4 py-2 border-b">Employee Name</th>
                    <th className="px-4 py-2 border-b">Check In Date</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedInItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b">{item.id}</td>
                      <td className="px-4 py-2 border-b">{item.name}</td>
                      <td className="px-4 py-2 border-b">{item.location}</td>
                      <td className="px-4 py-2 border-b">
                        {item.checkInQuantity}
                      </td>
                      <td className="px-4 py-2 border-b">{item.employeeId}</td>
                      <td className="px-4 py-2 border-b">
                        {item.employeeName}
                      </td>
                      <td className="px-4 py-2 border-b">{item.checkInDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={confirmCheckInItems}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Confirm Check-In Items
              </button>
            </div>
          )}

          <h3 className="mb-2 text-xl text-gray-800">Inventory</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Quantity</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Size</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Check In Date</th>
                <th className="px-4 py-2 border-b">Check Out Date</th>
                <th className="px-4 py-2 border-b">Location</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr
                  key={material.itemID}
                  className="cursor-pointer"
                  onClick={() => handleInventoryItemClick(material)}
                >
                  <td className="px-4 py-2 border-b">{material.itemID}</td>
                  <td className="px-4 py-2 border-b">{material.itemName}</td>
                  <td className="px-4 py-2 border-b">
                    {material.itemDescription}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {material.itemQuantity}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {material.itemStatus ? "Available" : "Checked Out"}
                  </td>
                  <td className="px-4 py-2 border-b">{material.itemSize}</td>
                  <td className="px-4 py-2 border-b">{material.type}</td>
                  <td className="px-4 py-2 border-b">{material.checkInDate}</td>
                  <td className="px-4 py-2 border-b">
                    {material.checkOutDate}
                  </td>
                  <td className="px-4 py-2 border-b">{material.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
