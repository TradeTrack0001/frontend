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

export default function Profile() {
    const [employee, setEmployee] = useState<Employee>({
        id: '',
        name: '',
        email: '',
        password: '',
        isAdmin: false,
    });

    useEffect(() => {
        // Fetch employee information from the database
        async function fetchEmployee() {
            try {
                const response = await axios.get('/api/employee'); // Adjust the API endpoint as needed
                setEmployee(response.data);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        }
        fetchEmployee();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({
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

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-5">
                <div className="bg-white p-3 shadow rounded">
                    <h2 className="text-gray-800 text-2xl mb-4">Profile</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
                        )}
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
