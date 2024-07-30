import { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Sidebar from "../components/sidebar";
import useCheckOut from "../hooks/check-out";
import { useWorkspace } from "../hooks/workspace";
import { AuthContext } from "../hooks/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
};

// Define the checkout item type
type CheckOutItem = {
  id: string;
  name: string;
  location: string;
  checkOutQuantity: string;
  availableQuantity: string;
  employeeId: string;
  employeeName: string;
  checkOutDate: string;
  duration: string;
  dueOn: string;
};

export default function Checkout() {
  const { getInventory } = useWorkspace();
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const auth = authContext?.auth;
  const logout = authContext?.logout;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [checkedOutItems, setCheckedOutItems] = useState<CheckOutItem[]>([]);
  const [newCheckOut, setNewCheckOut] = useState<CheckOutItem>({
    id: "",
    name: "",
    location: "",
    checkOutQuantity: "",
    availableQuantity: "",
    employeeId: "",
    employeeName: "",
    checkOutDate: "",
    duration: "",
    dueOn: "",
  });
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

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
    if (workspaceId) {
      fetchMaterials(workspaceId);
    } else {
      setWorkspaceId(null);
    }
  }, [workspaceId]);

  const fetchMaterials = async (workspaceId: string) => {
    const data = await getInventory();
    if (data && data.inventoryItems) {
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
    } else {
      console.error("Data format is incorrect: ", data);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "searchTerm") {
      setSearchTerm(value);
    } else if (name === "sizeFilter") {
      setSizeFilter(value);
    } else if (name === "statusFilter") {
      setStatusFilter(value);
    } else if (name === "typeFilter") {
      setTypeFilter(value);
    } else if (name === "locationFilter") {
      setLocationFilter(value);
    } else {
      setNewCheckOut((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckOut = (e: FormEvent) => {
    e.preventDefault();
    setCheckedOutItems((prev) => [...prev, newCheckOut]);
    setNewCheckOut({
      id: "",
      name: "",
      location: "",
      checkOutQuantity: "",
      availableQuantity: "",
      employeeId: "",
      employeeName: "",
      checkOutDate: "",
      duration: "",
      dueOn: "",
    });
  };

  const handleInventoryItemClick = (material: Material) => {
    setNewCheckOut((prev) => ({
      ...prev,
      id: material.itemID.toString(),
      name: material.itemName,
      location: material.location,
      availableQuantity: material.itemQuantity.toString(),
    }));
  };

  const confirmCheckOutItems = async () => {
    const updatedMaterials = materials.map((material) => {
      const checkedOutItem = checkedOutItems.find(
        (item) => item.id === material.itemID.toString()
      );
      if (checkedOutItem) {
        return {
          ...material,
          itemQuantity:
            material.itemQuantity -
            parseInt(checkedOutItem.checkOutQuantity, 10),
        };
      }
      return material;
    });

    await useCheckOut(checkedOutItems);

    setCheckedOutItems([]);
    setMaterials(updatedMaterials);
  };

  const filteredMaterials = materials.filter((material) => {
    return (
      (material.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (sizeFilter === "" || material.itemSize === sizeFilter) &&
      (statusFilter === "" || (statusFilter === "Available" ? material.itemStatus : !material.itemStatus)) &&
      (typeFilter === "" || material.type === typeFilter) &&
      (locationFilter === "" || material.location === locationFilter)
    );
  });

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
      <div className="flex-1 p-5 pt-24 md:ml-64">
        <div className="p-3 mb-4 bg-white rounded shadow">
          <h2 className="mb-4 text-2xl text-gray-800">Check Out Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-4">
              <h3 className="mb-2 text-xl text-gray-800">Material Details</h3>
              <form onSubmit={handleCheckOut} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCheckOut.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newCheckOut.location}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Check Out Quantity</label>
                  <input
                    type="number"
                    name="checkOutQuantity"
                    value={newCheckOut.checkOutQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Check Out Material
            </button>
          </div>

          {checkedOutItems.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xl text-gray-800">Checked Out Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border border-black">Name</th>
                      <th className="hidden px-4 py-2 border border-black md:table-cell">Location</th>
                      <th className="px-4 py-2 border border-black">Check Out Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkedOutItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b">{item.name}</td>
                        <td className="hidden px-4 py-2 border-b md:table-cell">{item.location}</td>
                        <td className="px-4 py-2 border-b">{item.checkOutQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={confirmCheckOutItems}
                  className="px-4 py-2 text-white bg-blue-500 rounded mt-4"
                >
                  Confirm Check-Out Items
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 mb-4">
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search by name or description"
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="mb-4">
                <select
                  name="sizeFilter"
                  value={sizeFilter}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Sizes</option>
                  {Array.from(new Set(materials.map((material) => material.itemSize))).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="mb-4">
                <select
                  name="statusFilter"
                  value={statusFilter}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Checked Out">Checked Out</option>
                </select>
              </div>
              <div className="mb-4">
                <select
                  name="typeFilter"
                  value={typeFilter}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Types</option>
                  {Array.from(new Set(materials.map((material) => material.type))).map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="mb-4">
                <select
                  name="locationFilter"
                  value={locationFilter}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Locations</option>
                  {Array.from(new Set(materials.map((material) => material.location))).map(
                    (location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <h3 className="mb-2 text-xl text-gray-800">Inventory</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border border-black">Name</th>
                  <th className="hidden px-4 py-2 border border-black md:table-cell">Description</th>
                  <th className="px-4 py-2 border border-black">Quantity</th>
                  <th className="hidden px-4 py-2 border border-black md:table-cell">Status</th>
                  <th className="px-4 py-2 border border-black">Size</th>
                  <th className="hidden px-4 py-2 border border-black md:table-cell">Type</th>
                  <th className="hidden px-4 py-2 border border-black md:table-cell">Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr
                    key={material.itemID}
                    className="cursor-pointer"
                    onClick={() => handleInventoryItemClick(material)}
                  >
                    <td className="px-4 py-2 border-b">{material.itemName}</td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">{material.itemDescription}</td>
                    <td className="px-4 py-2 border-b">{material.itemQuantity}</td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">{material.itemStatus ? "Available" : "Checked Out"}</td>
                    <td className="px-4 py-2 border-b">{material.itemSize}</td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">{material.type}</td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">{material.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
