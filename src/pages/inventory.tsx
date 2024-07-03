import React, { useState } from 'react';
import Sidebar from "../components/sidebar";

export default function Inventory() {
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({
        id: '',
        name: '',
        description: '',
        material: '',
        type: '',
        size: '',
        quantity: '',
        location: '',
    });
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMaterial((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addMaterial = (e) => {
        e.preventDefault();
        setMaterials((prev) => [...prev, newMaterial]);
        setNewMaterial({
            id: '',
            name: '',
            description: '',
            material: '',
            type: '',
            size: '',
            quantity: '',
            location: '',
        });
        setIsFormVisible(false); // Hide form after adding material
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded">
                    <h2 className="text-gray-800 text-2xl mb-4">Inventory</h2>
                    <div className="mb-4 flex justify-between">
                        <input
                            type="text"
                            placeholder="Search By Material Name"
                            className="p-2 border rounded w-full max-w-xs"
                        />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Search</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2">Filters</button>
                    </div>

                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Material</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">Size</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((material, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{material.id}</td>
                                    <td className="py-2 px-4 border-b">{material.name}</td>
                                    <td className="py-2 px-4 border-b">{material.description}</td>
                                    <td className="py-2 px-4 border-b">{material.material}</td>
                                    <td className="py-2 px-4 border-b">{material.type}</td>
                                    <td className="py-2 px-4 border-b">{material.size}</td>
                                    <td className="py-2 px-4 border-b">{material.quantity}</td>
                                    <td className="py-2 px-4 border-b">{material.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-between">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Check Out</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Order More</button>
                    </div>

                    <div className="mt-4">
                        <button 
                            onClick={() => setIsFormVisible(!isFormVisible)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded">
                            {isFormVisible ? 'Cancel' : 'Add Material'}
                        </button>
                    </div>

                    {isFormVisible && (
                        <div className="mt-4">
                            <h3 className="text-gray-800 text-xl mb-2">Add New Material</h3>
                            <form onSubmit={addMaterial} className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="id"
                                    placeholder="ID"
                                    value={newMaterial.id}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={newMaterial.name}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description"
                                    value={newMaterial.description}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="material"
                                    placeholder="Material"
                                    value={newMaterial.material}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="type"
                                    placeholder="Type"
                                    value={newMaterial.type}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="size"
                                    placeholder="Size"
                                    value={newMaterial.size}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={newMaterial.quantity}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={newMaterial.location}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                                    Add Material
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
