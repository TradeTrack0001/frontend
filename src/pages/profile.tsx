import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Sidebar from "../components/sidebar";
import axios from 'axios';

type Employee = {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    companyEmail?: string;
};

type OrderEmail = {
    name: string;
    email: string;
};

export default function Profile() {
    const [employee, setEmployee] = useState<Employee>({
        id: '',
        name: '',
        email: '',
        password: '',
        isAdmin: true,  // Set to true for development
    });

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [orderEmails, setOrderEmails] = useState<OrderEmail[]>([]);
    const [newOrderEmail, setNewOrderEmail] = useState<OrderEmail>({ name: '', email: '' });

    useEffect(() => {
        // Fetch employee information from the database
        async function fetchEmployee() {
            try {
                const response = await axios.get('/api/employee'); // Adjust the API endpoint as needed
                setEmployee({
                    ...response.data,
                    isAdmin: true,  // Set to true for development
                });
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        }

        // Fetch order emails from the database
        async function fetchOrderEmails() {
            try {
                const response = await axios.get('/api/order-emails'); // Adjust the API endpoint as needed
                setOrderEmails(response.data);
            } catch (error) {
                console.error("Error fetching order emails:", error);
            }
        }

        // Fetch employees list from the database
        async function fetchEmployees() {
            try {
                const response = await axios.get('/api/employees'); // Adjust the API endpoint as needed
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees list:", error);
            }
        }

        fetchEmployee();
        fetchOrderEmails();
        fetchEmployees();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOrderEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewOrderEmail((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.put('/api/employee', employee); // Adjust the API endpoint as needed
            alert('Profile updated successfully');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Error updating profile');
        }
    };

    const handleOrderEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/order-emails', newOrderEmail); // Adjust the API endpoint as needed
            setOrderEmails([...orderEmails, response.data]);
            setNewOrderEmail({ name: '', email: '' });
            alert('Order email added successfully');
        } catch (error) {
            console.error("Error adding order email:", error);
            alert('Error adding order email');
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded mb-10 mt-16">
                    <h2 className="text-gray-800 text-2xl mb-4">Profile</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block text-gray-700">ID</label>
                            <input
                                type="text"
                                name="id"
                                value={employee.id}
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
                                value={employee.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={employee.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={employee.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        {employee.isAdmin && (
                            <>
                                <div>
                                    <label className="block text-gray-700">Company Email</label>
                                    <input
                                        type="email"
                                        name="companyEmail"
                                        value={employee.companyEmail || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded col-span-2 mx-auto">
                            Save Changes
                        </button>
                    </form>
                </div>

                {employee.isAdmin && (
                    <div className="bg-white p-3 shadow rounded mb-10">
                        <h3 className="text-gray-800 text-xl mb-4">Manage Order Emails</h3>
                        <form onSubmit={handleOrderEmailSubmit} className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newOrderEmail.name}
                                    onChange={handleOrderEmailChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newOrderEmail.email}
                                    onChange={handleOrderEmailChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded col-span-2 mx-auto">
                                Add Order Email
                            </button>
                        </form>

                        <h4 className="text-gray-700 text-lg mb-2">Existing Order Emails</h4>
                        <ul>
                            {orderEmails.map((orderEmail, index) => (
                                <li key={index} className="mb-2">
                                    {orderEmail.name} - {orderEmail.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-white p-3 shadow rounded">
                    <h3 className="text-gray-800 text-xl mb-4">Workspace Employees</h3>
                    {employees.length > 0 ? (
                        <table className="min-w-full bg-white mb-4">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td className="py-2 px-4 border-b">{emp.id}</td>
                                        <td className="py-2 px-4 border-b">{emp.name}</td>
                                        <td className="py-2 px-4 border-b">{emp.email}</td>
                                        <td className="py-2 px-4 border-b">{emp.isAdmin ? 'Admin' : 'Employee'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-700 mt-4">No employees found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
