import { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Sidebar from "../components/sidebar";
import toast from "react-hot-toast";
import useAddInventory from "../hooks/addInventory";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateInventory } from "../hooks/updateInventory";
import { deleteInventory } from "../hooks/deleteInventory"; // Import the delete function
import { useWorkspace } from "../hooks/workspace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandArrowsAlt, faCheckCircle, faWrench, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

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
            "https://backend-uas6.onrender.com/auth/protected",
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
            "https://backend-uas6.onrender.com/workspace/current_workspace",
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          setWorkspaceId(response.data.currentWorkspace?.id || null);
          setNewMaterial((prev) => ({
            ...prev,
            workspaceId: response.data.currentWorkspace?.id || 0,
          }));
          console.log(
            "Current workspace ID:",
            response.data.currentWorkspace?.id
          );
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSize, setFilterSize] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
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
      const data: any = await getInventory();
      setMaterials(data.inventoryItems);
    }
    fetchMaterials();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "filterSize":
        setFilterSize(value);
        break;
      case "filterStatus":
        setFilterStatus(value);
        break;
      case "filterType":
        setFilterType(value);
        break;
      case "filterLocation":
        setFilterLocation(value);
        break;
    }
  };

  const filteredMaterials = materials.filter((material) => {
    return (
      material.itemName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      material.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterSize ? material.itemSize === filterSize : true) &&
      (filterStatus ? (filterStatus === "Available" ? material.itemStatus : !material.itemStatus) : true) &&
      (filterType ? material.type === filterType : true) &&
      (filterLocation ? material.location === filterLocation : true)
    );
  });

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
          "https://backend-uas6.onrender.com/workspace/add_inventory",
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

  // Add the delete function
  const handleDelete = async (itemID: number) => {
    if (auth && auth.token) {
      try {
        const response = await deleteInventory(itemID);
        if (response) {
          setMaterials((prev) => prev.filter((material) => material.itemID !== itemID));
          toast.success("Material deleted successfully");
        } else {
          console.error("Error deleting product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const confirmNewItems = async () => {
    await useAddInventory(tempMaterials);
    setMaterials((prev) => [...prev, ...tempMaterials]);
    setTempMaterials([]);
    setIsFormVisible(false); // Hide form after adding materials
  };

  useEffect(() => {
    // console.log("mats:", materials.inventoryItems);
  }, [materials]);

  if (!workspaceId) {
    return (
      <div>
        <Sidebar />
        <div>Workspace not found, create or join a workspace to get started</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 pt-24 md:ml-64"> {/* Increased top padding */}
        <div className="absolute top-5 right-5 ">
          <button
            onClick={() => {
              setIsFormVisible(!isFormVisible);
              setIsEditMode(false); // Ensure we're not in edit mode when adding new item
            }}
            className={`bg-blue-500 text-white px-4 py-2 mt-20 rounded-full ${
              isFormVisible ? "h-10 w-10" : "h-16 w-16"
            }`}
            style={{ position: 'fixed', top: '1rem', right: '1rem' }} // Make button fixed on mobile
          >
            {isFormVisible ? "-" : "+"}
          </button>
        </div>

        {isFormVisible && (
          <div className="p-3 mb-4 bg-white rounded shadow">
            <h3 className="mb-2 text-xl text-gray-800 border">
              {isEditMode ? "Edit Material" : "Add New Material"}
            </h3>
            <form
              onSubmit={addOrUpdateMaterial}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
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

        <div className="p-3 mb-4 mt-20 bg-white rounded shadow">
          <input
            type="text"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExpandArrowsAlt} className="mr-2" />
              <select
                name="filterSize"
                value={filterSize}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="">Size</option>
                {/* Add size options dynamically based on the materials */}
                {Array.from(new Set(materials.map((material) => material.itemSize))).map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              <select
                name="filterStatus"
                value={filterStatus}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="">Status</option>
                <option value="Available">Available</option>
                <option value="Checked Out">Checked Out</option>
              </select>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faWrench} className="mr-2" />
              <select
                name="filterType"
                value={filterType}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="">Type</option>
                {/* Add type options dynamically based on the materials */}
                {Array.from(new Set(materials.map((material) => material.type))).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              <select
                name="filterLocation"
                value={filterLocation}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="">Location</option>
                {/* Add location options dynamically based on the materials */}
                {Array.from(new Set(materials.map((material) => material.location))).map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-3 bg-white rounded shadow">
          <h2 className="mb-4 text-2xl text-gray-800">Inventory</h2>
          {filteredMaterials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-black">Name</th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Description
                    </th>
                    <th className="px-4 py-2 border border-black">Quantity</th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-2 border border-black">Size</th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Type
                    </th>
                    <th className="hidden px-4 py-2 border border-black md:table-cell">
                      Location
                    </th>
                    <th className="px-4 py-2 border border-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-black">
                        {material.itemName}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.itemDescription}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {material.itemQuantity}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.itemStatus ? "Available" : "Checked Out"}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {material.itemSize}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.type}
                      </td>
                      <td className="hidden px-4 py-2 border border-black md:table-cell">
                        {material.location}
                      </td>
                      <td className="px-4 py-2 border border-black">
  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-between">
    <button
      className="px-2 py-1 text-white bg-blue-500 rounded"
      onClick={() => handleEdit(material)}
    >
      Edit
    </button>
    <button
      className="px-2 py-1 text-white bg-red-500 rounded"
      onClick={() => handleDelete(material.itemID)}
    >
      Delete
    </button>
  </div>
</td>




                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 text-center text-gray-700">No items found</div>
          )}
        </div>
      </div>
    </div>
  );
}
