import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../components/sidebar";
import getInventory from "../hooks/inventory";

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

// Define the check-in item type
type CheckInItem = {
  id: string;
  name: string;
  quantity: string;
  employeeId: string;
  employeeName: string;
  checkInDate: string;
  location: string;
};

export default function Checkin() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [checkedInItems, setCheckedInItems] = useState<CheckInItem[]>([]);
  const [newCheckIn, setNewCheckIn] = useState<CheckInItem>({
    id: "",
    name: "",
    quantity: "",
    employeeId: "",
    employeeName: "",
    checkInDate: "",
    location: "",
  });

  useEffect(() => {
    // Fetch data from the database
    async function fetchMaterials() {
      const data = await getInventory();
      setMaterials(data);
    }
    fetchMaterials();
  }, []);

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
      quantity: "",
      employeeId: "",
      employeeName: "",
      checkInDate: "",
      location: "",
    });
  };

  const handleInventoryItemClick = (material: Material) => {
    setNewCheckIn((prev) => ({
      ...prev,
      id: material.itemID.toString(),
      name: material.itemName,
      location: material.location,
    }));
  };

  const confirmCheckInItems = async () => {
    // Post checked-in items to the database
    await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkedInItems),
    });
    setCheckedInItems([]);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 pt-16 md:ml-64">
        <div className="p-3 bg-white rounded shadow">
          <h2 className="mb-4 text-2xl text-gray-800">Check In</h2>

          <div className="mt-4 mb-4">
            <h3 className="mb-2 text-xl text-gray-800">
              Check In New Material
            </h3>
            <form onSubmit={handleCheckIn} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={newCheckIn.id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newCheckIn.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={newCheckIn.quantity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="Employee ID"
                  value={newCheckIn.employeeId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Employee Name</label>
                <input
                  type="text"
                  name="employeeName"
                  placeholder="Employee Name"
                  value={newCheckIn.employeeName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Check In Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={newCheckIn.checkInDate}
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
                  value={newCheckIn.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>
              <button
                type="submit"
                className="col-span-2 px-4 py-2 text-white bg-blue-500 rounded"
              >
                Check In Material
              </button>
            </form>
          </div>

          <h3 className="mb-2 text-xl text-gray-800">Checked In Materials</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full mb-4 bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Quantity</th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Employee ID
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Employee Name
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Check In Date
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkedInItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{item.id}</td>
                    <td className="px-4 py-2 border-b">{item.name}</td>
                    <td className="px-4 py-2 border-b">{item.quantity}</td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {item.employeeId}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {item.employeeName}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {item.checkInDate}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {checkedInItems.length > 0 && (
            <div className="mt-4">
              <button
                onClick={confirmCheckInItems}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Confirm Check-In Items
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
                  <th className="px-4 py-2 border-b">Quantity</th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Description
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Status
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Size
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Type
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Check In Date
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Check Out Date
                  </th>
                  <th className="hidden px-4 py-2 border-b lg:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr
                    key={material.itemID}
                    className="cursor-pointer"
                  >
                    <td className="px-4 py-2 border-b">{material.itemID}</td>
                    <td className="px-4 py-2 border-b">{material.itemName}</td>
                    <td className="px-4 py-2 border-b">
                      {material.itemQuantity}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.itemDescription}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.itemStatus ? "Available" : "Checked Out"}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.itemSize}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.type}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.checkInDate}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.checkOutDate}
                    </td>
                    <td className="hidden px-4 py-2 border-b lg:table-cell">
                      {material.location}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="px-4 py-2 text-white bg-blue-500 rounded"
                        onClick={() => handleInventoryItemClick(material)}
                      >
                        Add to Check-In
                      </button>
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
