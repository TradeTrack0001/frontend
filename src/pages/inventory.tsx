import { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Sidebar from "../components/sidebar";
import toast from "react-hot-toast";
import useAddInventory from "../hooks/addInventory";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateInventory } from "../hooks/updateInventory";
import { useWorkspace } from "../hooks/workspace";

// Define the material type
type Material = {
  itemID: number;
  itemName: string;
  itemDescription: string;
  itemQuantity: number;
  itemStatus: boolean;
  itemSize: string;
  type: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
  workspaceId: number;
};

export default function Inventory() {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const auth = authContext?.auth;
  const logout = authContext?.logout;
  const { getInventory } = useWorkspace();
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

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
        } catch (error) {
          console.error("Error fetching current workspace", error);
          navigate("/workspace");
        }
      }
    };

    fetchProtectedData();
    fetchCurrentWorkspace();
  }, [auth, logout, navigate]);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState<Material>({
    itemID: 0,
    itemName: "",
    itemDescription: "",
    itemQuantity: 0,
    itemStatus: true, // Default to true for "Available"
    itemSize: "",
    type: "",
    checkInDate: "",
    checkOutDate: "N/A",
    location: "",
    workspaceId: workspaceId?.valueOf() || 0,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // To track if we're editing an item
  const [tempMaterials, setTempMaterials] = useState<Material[]>([]);

  useEffect(() => {
    // Fetch data from the database
    async function fetchMaterials() {
      const data: Material[] = await getInventory();
      setMaterials(data.inventoryItems);
    }
    fetchMaterials();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewMaterial((prev) => {
      const updatedMaterial = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : name === "itemQuantity" || name === "itemID"
            ? parseInt(value, 10)
            : value,
      };

      if (name === "itemQuantity") {
        updatedMaterial.itemStatus = parseInt(value, 10) > 0;
      }

      return updatedMaterial;
    });
  };

  const addOrUpdateMaterial = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        await updateInventory([newMaterial]);
        setMaterials((prev) =>
          prev.map((material) =>
            material.itemID === newMaterial.itemID ? newMaterial : material
          )
        );
        toast.success("Material updated successfully");
      } else {
        response = await axios.post(
          "http://localhost:2000/workspace/add_inventory",
          newMaterial,
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );

        if (response.status === 200) {
          const result = await response.data;
          setTempMaterials((prev) => [...prev, newMaterial]);
          toast.success("Material added successfully");
        } else {
          console.error("Error adding product:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }

    setNewMaterial({
      itemID: 0,
      itemName: "",
      itemDescription: "",
      itemQuantity: 0,
      itemStatus: true, // Default to true for "Available"
      itemSize: "",
      type: "",
      checkInDate: "",
      checkOutDate: "N/A",
      location: "",
      workspaceId: workspaceId?.valueOf() || 0,
    });
    setIsFormVisible(false);
    setIsEditMode(false);
  };

  const handleEdit = (material: Material) => {
    setNewMaterial(material);
    setIsFormVisible(true);
    setIsEditMode(true);
  };

  const confirmNewItems = async () => {
    await useAddInventory(tempMaterials);
    setMaterials((prev) => [...prev, ...tempMaterials]);
    setTempMaterials([]);
    setIsFormVisible(false); // Hide form after adding materials
  };
  useEffect(() => {
    console.log("mats:", materials.inventoryItems);
  }, [materials]);
  if (!workspaceId) {
    return (
      <div>
        <Sidebar />
        <div>
          Workspace not found, create or join a workspace to get started
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 pt-16 md:ml-64">
        <div className="absolute top-5 right-5">
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              setIsEditMode(false); // Ensure we're not in edit mode when adding new item
            }}
            className={`bg-blue-500 text-white px-4 py-2 rounded-full mb-4 mt-20 ${
              isFormVisible ? "h-10 w-10" : "h-16 w-16"
            }`}
          >
            {isFormVisible ? "-" : "+"}
          </button>
        </div>
        <div className="p-3 mt-16 bg-white rounded shadow">
          {isFormVisible && (
            <div className="mt-4 mb-4">
              <h3 className="mb-2 text-xl text-gray-800 border">
                {isEditMode ? "Edit Material" : "Add New Material"}
              </h3>
              <form
                onSubmit={addOrUpdateMaterial}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-gray-700">ID</label>
                  <input
                    type="number"
                    name="itemID"
                    placeholder="ID"
                    value={newMaterial.itemID}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    disabled={isEditMode} // Disable ID field when editing
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Name"
                    value={newMaterial.itemName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Description</label>
                  <input
                    type="text"
                    name="itemDescription"
                    placeholder="Description"
                    value={newMaterial.itemDescription}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="itemQuantity"
                    placeholder="Quantity"
                    value={newMaterial.itemQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="itemStatus"
                    checked={newMaterial.itemStatus}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={newMaterial.itemQuantity > 0} // Disable checkbox if quantity > 0
                  />
                  <label className="text-gray-700">Status (Available)</label>
                </div>
                <div>
                  <label className="block text-gray-700">Size</label>
                  <input
                    type="text"
                    name="itemSize"
                    placeholder="Size"
                    value={newMaterial.itemSize}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Type</label>
                  <input
                    type="text"
                    name="type"
                    placeholder="Type"
                    value={newMaterial.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Check In Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    placeholder="Check In Date"
                    value={newMaterial.checkInDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Check Out Date</label>
                  <input
                    type="text"
                    name="checkOutDate"
                    placeholder="Check Out Date"
                    value={newMaterial.checkOutDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newMaterial.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 px-4 py-2 text-white bg-blue-500 rounded"
                >
                  {isEditMode ? "Update Material" : "Add New Material"}
                </button>
              </form>
            </div>
          )}

          {tempMaterials.length > 0 && (
            <div className="mt-4 mb-4">
              <h3 className="mb-2 text-xl text-gray-800">
                New Materials to be Added
              </h3>
              <div className="overflow-x-auto">
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
                    {tempMaterials.map((material, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b">
                          {material.itemID}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.itemName}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.itemDescription}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.itemQuantity}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.itemStatus ? "Available" : "Checked Out"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.itemSize}
                        </td>
                        <td className="px-4 py-2 border-b">{material.type}</td>
                        <td className="px-4 py-2 border-b">
                          {material.checkInDate}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.checkOutDate}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {material.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button
                  onClick={confirmNewItems}
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                >
                  Confirm New Items
                </button>
              </div>
            </div>
          )}
          <h2 className="mb-4 text-2xl text-gray-800">Inventory</h2>
          {materials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      ID
                    </th>
                    <th className="px-4 py-2 border border-black">Name</th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Description
                    </th>
                    <th className="px-4 py-2 border border-black">Quantity</th>
                    <th className="px-4 py-2 border border-black">Status</th>
                    <th className="px-4 py-2 border border-black">Size</th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Type
                    </th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Check In Date
                    </th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Check Out Date
                    </th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Location
                    </th>
                    <th className="px-4 py-2 border border-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={index}>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.itemID}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {material.itemName}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.itemDescription}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {material.itemQuantity}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {material.itemStatus ? "Available" : "Checked Out"}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {material.itemSize}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.type}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.checkInDate}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.checkOutDate}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.location}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        <button
                          className="px-2 py-1 text-white bg-blue-500 rounded"
                          onClick={() => handleEdit(material)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 text-center text-gray-700">No items found</div>
          )}

          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 text-white bg-blue-500 rounded">
              Check Out
            </button>
            <button className="px-4 py-2 text-white bg-blue-500 rounded">
              Order More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
