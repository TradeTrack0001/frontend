import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../components/sidebar";
import useCheckOut from "../hooks/check-out";
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

  useEffect(() => {
    // Fetch workspaceId from local storage
    const storedWorkspaceId = localStorage.getItem("workspaceId");
    if (storedWorkspaceId) {
      setWorkspaceId(storedWorkspaceId);
      fetchMaterials(storedWorkspaceId); // Fetch data based on workspaceId
    } else {
      setWorkspaceId(null);
    }
  }, []);

  const fetchMaterials = async (workspaceId: string) => {
    const data = await getInventory(); // Adjust your hook to accept workspaceId
    setMaterials(data);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCheckOut((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    // Update the inventory with the new quantities
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
      <div className="flex-1 p-5 ml-64">
        {" "}
        {/* Adjusted this line */}
        <div className="p-3 bg-white rounded shadow">
          <h2 className="mb-4 text-2xl text-gray-800">Check Out Details</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Material Details */}
            <div>
              <h3 className="mb-2 text-xl text-gray-800">Material Details</h3>
              <form onSubmit={handleCheckOut}>
                <div className="mb-4">
                  <label className="block text-gray-700">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newCheckOut.id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
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
                  <label className="block text-gray-700">
                    Check Out Quantity
                  </label>
                  <input
                    type="number"
                    name="checkOutQuantity"
                    value={newCheckOut.checkOutQuantity}
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
                    value={newCheckOut.availableQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </form>
            </div>

            {/* Check Out To */}
            <div>
              <h3 className="mb-2 text-xl text-gray-800">Check Out To</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={newCheckOut.employeeId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={newCheckOut.employeeName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Check Out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={newCheckOut.checkOutDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Duration</label>
                  <input
                    type="number"
                    name="duration"
                    value={newCheckOut.duration}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Due On</label>
                  <input
                    type="date"
                    name="dueOn"
                    value={newCheckOut.dueOn}
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
              <table className="min-w-full mb-4 bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Location</th>
                    <th className="px-4 py-2 border-b">Check Out Quantity</th>
                    <th className="px-4 py-2 border-b">Employee ID</th>
                    <th className="px-4 py-2 border-b">Employee Name</th>
                    <th className="px-4 py-2 border-b">Check Out Date</th>
                    <th className="px-4 py-2 border-b">Duration</th>
                    <th className="px-4 py-2 border-b">Due On</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedOutItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b">{item.id}</td>
                      <td className="px-4 py-2 border-b">{item.name}</td>
                      <td className="px-4 py-2 border-b">{item.location}</td>
                      <td className="px-4 py-2 border-b">
                        {item.checkOutQuantity}
                      </td>
                      <td className="px-4 py-2 border-b">{item.employeeId}</td>
                      <td className="px-4 py-2 border-b">
                        {item.employeeName}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {item.checkOutDate}
                      </td>
                      <td className="px-4 py-2 border-b">{item.duration}</td>
                      <td className="px-4 py-2 border-b">{item.dueOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={confirmCheckOutItems}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Confirm Check-Out Items
              </button>
            </div>
          )}

          <h3 className="mb-2 text-xl text-gray-800">Inventory</h3>
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
                    <td className="px-4 py-2 border-b">
                      {material.checkInDate}
                    </td>
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
    </div>
  );
}
