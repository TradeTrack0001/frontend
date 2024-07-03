import React, { useState } from 'react';
import Sidebar from "../components/sidebar";

export default function Checkin() {
    const [checkedInItems, setCheckedInItems] = useState([]);
    const [newCheckIn, setNewCheckIn] = useState({
        id: '',
        name: '',
        quantity: '',
        employeeId: '',
        employeeName: '',
        checkInDate: '',
        location: '',
    });
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCheckIn((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckIn = (e) => {
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
        setIsFormVisible(false); // Hide form after check-in
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded">
                    <h2 className="text-gray-800 text-2xl mb-4">Check In</h2>

                    <table className="min-w-full bg-white">
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

                    <div className="mt-4">
                        <button 
                            onClick={() => setIsFormVisible(!isFormVisible)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded">
                            {isFormVisible ? 'Cancel' : 'Check In Material'}
                        </button>
                    </div>

                    {isFormVisible && (
                        <div className="mt-4">
                            <h3 className="text-gray-800 text-xl mb-2">Check In New Material</h3>
                            <form onSubmit={handleCheckIn} className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="id"
                                    placeholder="ID"
                                    value={newCheckIn.id}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={newCheckIn.name}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={newCheckIn.quantity}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="employeeId"
                                    placeholder="Employee ID"
                                    value={newCheckIn.employeeId}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="employeeName"
                                    placeholder="Employee Name"
                                    value={newCheckIn.employeeName}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={newCheckIn.checkInDate}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={newCheckIn.location}
                                    onChange={handleChange}
                                    className="p-2 border rounded"
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                                    Check In Material
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
