import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Sidebar from "../components/sidebar";
import getInventory from '../hooks/inventory';
import { updateInventory } from '../hooks/updateInventory';
import { configDir } from '@tauri-apps/api/path';

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
  const [materials, setMaterials] = useState<Material[]>([]);
  const [checkedOutItems, setCheckedOutItems] = useState<CheckOutItem[]>([]);
  const [newCheckOut, setNewCheckOut] = useState<CheckOutItem>({
    id: '',
    name: '',
    location: '',
    checkOutQuantity: '',
    availableQuantity: '',
    employeeId: '',
    employeeName: '',
    checkOutDate: '',
    duration: '',
    dueOn: '',
  });

  useEffect(() => {
    // Fetch data from the database
    async function fetchMaterials() {
      // Replace with your actual API call
      const data = await getInventory();
      setMaterials(data);
    }
    fetchMaterials();
  }, []);

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
      id: '',
      name: '',
      location: '',
      checkOutQuantity: '',
      availableQuantity: '',
      employeeId: '',
      employeeName: '',
      checkOutDate: '',
      duration: '',
      dueOn: '',
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
    // Post checked-out items to the database
    console.log(JSON.stringify(checkedOutItems));
    await updateInventory(checkedOutItems);
    setCheckedOutItems([]);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 mt-16 lg:mt-0">
        <div className="bg-white p-3 shadow rounded">
          <h2 className="text-gray-800 text-2xl mb-4">Check Out Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Material Details */}
            <div>
              <h3 className="text-gray-800 text-xl mb-2">Material Details</h3>
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
                  <label className="block text-gray-700">Check Out Quantity</label>
                  <input
                    type="number"
                    name="checkOutQuantity"
                    value={newCheckOut.checkOutQuantity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Available Quantity</label>
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
          </div>
          <div className="mt-4">
            <button 
              onClick={handleCheckOut} 
              className="bg-blue-500 text-white px-4 py-2 rounded">
              Check Out Material
            </button>
          </div>
          {checkedOutItems.length > 0 && (
            <div className="mt-4">
              <h3 className="text-gray-800 text-xl mb-2">Checked Out Items</h3>
              <table className="min-w-full bg-white mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Location</th>
                    <th className="py-2 px-4 border-b">Check Out Quantity</th>
                    <th className="py-2 px-4 border-b">Employee ID</th>
                    <th className="py-2 px-4 border-b">Employee Name</th>
                    <th className="py-2 px-4 border-b">Check Out Date</th>
                    <th className="py-2 px-4 border-b">Duration</th>
                    <th className="py-2 px-4 border-b">Due On</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedOutItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{item.id}</td>
                      <td className="py-2 px-4 border-b">{item.name}</td>
                      <td className="py-2 px-4 border-b">{item.location}</td>
                      <td className="py-2 px-4 border-b">{item.checkOutQuantity}</td>
                      <td className="py-2 px-4 border-b">{item.employeeId}</td>
                      <td className="py-2 px-4 border-b">{item.employeeName}</td>
                      <td className="py-2 px-4 border-b">{item.checkOutDate}</td>
                      <td className="py-2 px-4 border-b">{item.duration}</td>
                      <td className="py-2 px-4 border-b">{item.dueOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={confirmCheckOutItems} className="bg-blue-500 text-white px-4 py-2 rounded">
                Confirm Check-Out Items
              </button>
            </div>
          )}
          <h3 className="text-gray-800 text-xl mb-2">Inventory</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Description</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Status</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Size</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Type</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Check In Date</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Check Out Date</th>
                <th className="hidden lg:table-cell py-2 px-4 border-b">Location</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr
                  key={material.itemID}
                  className="cursor-pointer"
                  onClick={() => handleInventoryItemClick(material)}
                >
                  <td className="py-2 px-4 border-b">{material.itemID}</td>
                  <td className="py-2 px-4 border-b">{material.itemName}</td>
                  <td className="py-2 px-4 border-b">{material.itemQuantity}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.itemDescription}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.itemStatus ? 'Available' : 'Checked Out'}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.itemSize}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.type}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.checkInDate}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.checkOutDate}</td>
                  <td className="hidden lg:table-cell py-2 px-4 border-b">{material.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
