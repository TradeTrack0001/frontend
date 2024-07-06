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

export default function Inventory() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState<Material>({
    itemID: 0,
    itemName: "",
    itemDescription: "",
    itemQuantity: 0,
    itemStatus: false,
    itemSize: "",
    type: "",
    checkInDate: "",
    checkOutDate: "N/A",
    location: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [tempMaterials, setTempMaterials] = useState<Material[]>([]);

  useEffect(() => {
    // Fetch data from the database
    async function fetchMaterials() {
      // Replace with your actual API call
      const data: Material[] = await getInventory();
      // const response = await fetch("/api/materials");
      // const data = await response.json();
      console.log(data);
      setMaterials(data);
    }
    fetchMaterials();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewMaterial((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "itemQuantity" || name === "itemID"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const addTempMaterial = (e: FormEvent) => {
    e.preventDefault();

    setTempMaterials((prev) => [...prev, newMaterial]);
    setNewMaterial({
      itemID: 0,
      itemName: "",
      itemDescription: "",
      itemQuantity: 0,
      itemStatus: false,
      itemSize: "",
      type: "",
      checkInDate: "",
      checkOutDate: "N/A",
      location: "",
    });
  };

  const confirmNewItems = async () => {
    // Post new materials to the database
    await fetch("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempMaterials),
    });
    setMaterials((prev) => [...prev, ...tempMaterials]);
    setTempMaterials([]);
    setIsFormVisible(false); // Hide form after adding materials
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="relative flex-1 p-5">
        <div className="absolute top-5 right-5">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className={`bg-blue-500 text-white px-4 py-2 rounded-full ${
              isFormVisible ? "h-10 w-10" : "h-16 w-16"
            }`}
          >
            {isFormVisible ? "-" : "+"}
          </button>
        </div>
        <div className="p-3 bg-white rounded shadow">
          {isFormVisible && (
            <div className="mt-4 mb-4">
              <h3 className="mb-2 text-xl text-gray-800">Add New Material</h3>
              <form
                onSubmit={addTempMaterial}
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
                  Add New Material Item
                </button>
              </form>
            </div>
          )}

          {tempMaterials.length > 0 && (
            <div className="mt-4 mb-4">
              <h3 className="mb-2 text-xl text-gray-800">
                New Materials to be Added
              </h3>
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
                      <td className="px-4 py-2 border-b">{material.itemID}</td>
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
                {materials.map((material, index) => (
                  <tr key={index}>
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
