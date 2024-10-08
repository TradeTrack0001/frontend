import { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Sidebar from "../components/sidebar";
import useCheckin from "../hooks/check-in";
import { useWorkspace } from "../hooks/workspace";
import { AuthContext } from "../hooks/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandArrowsAlt,
  faCheckCircle,
  faWrench,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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

  useEffect(() => {
    if (workspaceId) {
      fetchMaterials(workspaceId);
    } else {
      setWorkspaceId(null);
    }
  }, [workspaceId]);

  const fetchMaterials = async (workspaceId: string) => {
    const data = await getInventory();
    // @ts-ignore
    if (data && data.inventoryItems) {
      // @ts-ignore
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      setNewCheckIn((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckIn = (e: FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      setCheckedInItems((prev) =>
        prev.map((item) => (item.id === newCheckIn.id ? newCheckIn : item))
      );
      setIsEditMode(false);
    } else {
      setCheckedInItems((prev) => [...prev, newCheckIn]);
    }
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

  const handleEdit = (item: CheckInItem) => {
    setNewCheckIn(item);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setCheckedInItems([]);
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

    await useCheckin(checkedInItems);

    setCheckedInItems([]);
    setMaterials(updatedMaterials);
  };

  const filteredMaterials = materials.filter((material) => {
    return (
      (material.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.itemDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (sizeFilter === "" || material.itemSize === sizeFilter) &&
      (statusFilter === "" ||
        (statusFilter === "Available"
          ? material.itemStatus
          : !material.itemStatus)) &&
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
          <h2 className="mb-4 text-2xl text-gray-800">Check In Details</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-1 gap-4">
              <h3 className="mb-2 text-xl text-gray-800">Material Details</h3>
              <form
                onSubmit={handleCheckIn}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
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
              </form>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              {isEditMode ? "Update Material" : "Check In Material"}
            </button>
          </div>

          {checkedInItems.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xl text-gray-800">Checked In Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border border-black">Name</th>
                      <th className="hidden px-4 py-2 border border-black md:table-cell">
                        Location
                      </th>
                      <th className="px-4 py-2 border border-black">
                        Check In Quantity
                      </th>
                      <th className="px-4 py-2 border border-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkedInItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b">{item.name}</td>
                        <td className="hidden px-4 py-2 border-b md:table-cell">
                          {item.location}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {item.checkInQuantity}
                        </td>
                        <td className="flex justify-between px-4 py-2 border-b">
                          <button
                            className="px-2 py-1 text-white bg-blue-500 rounded"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 text-white bg-red-500 rounded"
                            onClick={() =>
                              setCheckedInItems((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex mt-4">
                  <button
                    onClick={confirmCheckInItems}
                    className="px-4 py-2 mr-10 text-white bg-blue-500 rounded"
                  >
                    Confirm Check-In Items
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 ml-10 text-white bg-red-500 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 mt-20 mb-4 bg-white rounded shadow">
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faExpandArrowsAlt}
                  className="mr-2 text-blue-500"
                />
                <select
                  name="sizeFilter"
                  value={sizeFilter}
                  onChange={handleChange}
                  className="p-2 border rounded"
                >
                  <option value="">All Sizes</option>
                  {Array.from(
                    new Set(materials.map((material) => material.itemSize))
                  ).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-2 text-blue-500"
                />
                <select
                  name="statusFilter"
                  value={statusFilter}
                  onChange={handleChange}
                  className="p-2 border rounded"
                >
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Checked Out">Checked Out</option>
                </select>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faWrench}
                  className="mr-2 text-blue-500"
                />
                <select
                  name="typeFilter"
                  value={typeFilter}
                  onChange={handleChange}
                  className="p-2 border rounded"
                >
                  <option value="">All Types</option>
                  {Array.from(
                    new Set(materials.map((material) => material.type))
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-2 text-blue-500"
                />
                <select
                  name="locationFilter"
                  value={locationFilter}
                  onChange={handleChange}
                  className="p-2 border rounded"
                >
                  <option value="">All Locations</option>
                  {Array.from(
                    new Set(materials.map((material) => material.location))
                  ).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
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
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr
                    // @ts-ignore
                    key={material.itemID}
                    className="cursor-pointer"
                    onClick={() => handleInventoryItemClick(material)}
                  >
                    <td className="px-4 py-2 border-b">{material.itemName}</td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">
                      {material.itemDescription}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {material.itemQuantity}
                    </td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">
                      {material.itemStatus ? "Available" : "Checked Out"}
                    </td>
                    <td className="px-4 py-2 border-b">{material.itemSize}</td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">
                      {material.type}
                    </td>
                    <td className="hidden px-4 py-2 border-b md:table-cell">
                      {material.location}
                    </td>
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
