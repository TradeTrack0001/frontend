import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Sidebar from "../components/sidebar";

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
        id: '',
        name: '',
        quantity: '',
        employeeId: '',
        employeeName: '',
        checkInDate: '',
        location: '',
    });

    useEffect(() => {
        // Fetch data from the database
        async function fetchMaterials() {
            // Replace with your actual API call
            const response = await fetch('/api/materials');
            const data = await response.json();
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
            id: '',
            name: '',
            quantity: '',
            employeeId: '',
            employeeName: '',
            checkInDate: '',
            location: '',
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
        await fetch('/api/checkin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkedInItems),
        });
        setCheckedInItems([]);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded">
                    <h2 className="text-gray-800 text-2xl mb-4">Check In</h2>

                    <div className="mt-4 mb-4">
                        <h3 className="text-gray-800 text-xl mb-2">Check In New Material</h3>
                        <form onSubmit={handleCheckIn} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">ID</label>
                                <input
                                    type="text"
                                    name="id"
                                    placeholder="ID"
                                    value={newCheckIn.id}
                                    onChange={handleChange}
                                    className="p-2 border rounded w-full"
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
                                    className="p-2 border rounded w-full"
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
                                    className="p-2 border rounded w-full"
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
                                    className="p-2 border rounded w-full"
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
                                    className="p-2 border rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Check In Date</label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={newCheckIn.checkInDate}
                                    onChange={handleChange}
                                    className="p-2 border rounded w-full"
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
                                    className="p-2 border rounded w-full"
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                                Check In Material
                            </button>
                        </form>
                    </div>

                    <h3 className="text-gray-800 text-xl mb-2">Checked In Materials</h3>
                    <table className="min-w-full bg-white mb-4">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Employee ID</th>
                                <th className="py-2 px-4 border-b">Employee Name</th>
                                <th className="py-2 px-4 border-b">Check In Date</th>
                                <th className="py-2 px-4 border-b">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkedInItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{item.id}</td>
                                    <td className="py-2 px-4 border-b">{item.name}</td>
                                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                                    <td className="py-2 px-4 border-b">{item.employeeId}</td>
                                    <td className="py-2 px-4 border-b">{item.employeeName}</td>
                                    <td className="py-2 px-4 border-b">{item.checkInDate}</td>
                                    <td className="py-2 px-4 border-b">{item.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {checkedInItems.length > 0 && (
                        <div className="mt-4">
                            <button onClick={confirmCheckInItems} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Confirm Check-In Items
                            </button>
                        </div>
                    )}

                    <h3 className="text-gray-800 text-xl mb-2">Inventory</h3>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Size</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">Check In Date</th>
                                <th className="py-2 px-4 border-b">Check Out Date</th>
                                <th className="py-2 px-4 border-b">Location</th>
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
                                    <td className="py-2 px-4 border-b">{material.itemDescription}</td>
                                    <td className="py-2 px-4 border-b">{material.itemQuantity}</td>
                                    <td className="py-2 px-4 border-b">{material.itemStatus ? 'Available' : 'Checked Out'}</td>
                                    <td className="py-2 px-4 border-b">{material.itemSize}</td>
                                    <td className="py-2 px-4 border-b">{material.type}</td>
                                    <td className="py-2 px-4 border-b">{material.checkInDate}</td>
                                    <td className="py-2 px-4 border-b">{material.checkOutDate}</td>
                                    <td className="py-2 px-4 border-b">{material.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
