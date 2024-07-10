import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Sidebar from "../components/sidebar";

type OrderItem = {
    id: string;
    name: string;
    quantity: string;
    description: string;
};

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

export default function Orders() {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [newOrderItem, setNewOrderItem] = useState<OrderItem>({
        id: '',
        name: '',
        quantity: '',
        description: '',
    });
    const [previousOrders, setPreviousOrders] = useState<OrderItem[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [showUnavailable, setShowUnavailable] = useState(true);

    useEffect(() => {
        // Fetch data from the database
        async function fetchMaterials() {
            const response = await fetch('/api/materials');
            const data = await response.json();
            setMaterials(data);
        }
        async function fetchPreviousOrders() {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setPreviousOrders(data);
        }
        fetchMaterials();
        fetchPreviousOrders();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewOrderItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addOrderItem = (e: FormEvent) => {
        e.preventDefault();
        setOrderItems((prev) => [...prev, newOrderItem]);
        setNewOrderItem({
            id: '',
            name: '',
            quantity: '',
            description: '',
        });
    };

    const exportToEmail = () => {
        const emailBody = orderItems
            .map(item => `ID: ${item.id}, Name: ${item.name}, Quantity: ${item.quantity}, Description: ${item.description}`)
            .join('\n');
        
        const mailtoLink = `mailto:?subject=Order%20Request&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    };

    const handleFilterChange = () => {
        setShowUnavailable(!showUnavailable);
    };

    const handleReceive = async (order: OrderItem) => {
        const updatedMaterials = materials.map(material => {
            if (material.itemID.toString() === order.id) {
                return {
                    ...material,
                    itemQuantity: material.itemQuantity + parseInt(order.quantity, 10),
                };
            }
            return material;
        });
        setMaterials(updatedMaterials);

        await fetch('/api/materials', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMaterials),
        });
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded mt-16">
                    <h2 className="text-gray-800 text-2xl mb-4">Orders</h2>

                    <div className="mb-4">
                        <h3 className="text-gray-800 text-xl mb-2">Add New Item</h3>
                        <form onSubmit={addOrderItem} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">ID</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={newOrderItem.id}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newOrderItem.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Quantity</label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={newOrderItem.quantity}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={newOrderItem.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                                Add Item
                            </button>
                        </form>
                    </div>

                    {orderItems.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-gray-800 text-xl mb-2">Order List</h3>
                            <table className="min-w-full bg-white mb-4">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">ID</th>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Quantity</th>
                                        <th className="py-2 px-4 border-b">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">{item.id}</td>
                                            <td className="py-2 px-4 border-b">{item.name}</td>
                                            <td className="py-2 px-4 border-b">{item.quantity}</td>
                                            <td className="py-2 px-4 border-b">{item.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={exportToEmail} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Export to Email
                            </button>
                        </div>
                    )}

                    <h3 className="text-gray-800 text-xl mb-2">Previous Orders</h3>
                    {previousOrders.length > 0 ? (
                        <table className="min-w-full bg-white mb-4">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Quantity</th>
                                    <th className="py-2 px-4 border-b">Description</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previousOrders.map((order, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{order.id}</td>
                                        <td className="py-2 px-4 border-b">{order.name}</td>
                                        <td className="py-2 px-4 border-b">{order.quantity}</td>
                                        <td className="py-2 px-4 border-b">{order.description}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleReceive(order)}
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                            >
                                                Receive
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-700 mt-4">No previous orders found</div>
                    )}

                    <h3 className="text-gray-800 text-xl mb-2">Inventory</h3>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showUnavailable}
                                onChange={handleFilterChange}
                                className="mr-2"
                            />
                            Show Unavailable Items
                        </label>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Filters</button>
                    </div>
                    {materials.length > 0 ? (
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
                                {materials
                                    .filter(material => showUnavailable || material.itemStatus)
                                    .map((material) => (
                                        <tr key={material.itemID} className="cursor-pointer">
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
                    ) : (
                        <div className="text-center text-gray-700 mt-4">No items found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
