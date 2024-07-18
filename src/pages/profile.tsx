import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Sidebar from "../components/sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { useProfile } from "../hooks/proflie";
import { useAuth } from "../hooks/AuthContext";

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
  const { fetchProfile } = useProfile();
  const {message} = useProfile();
  const [employee, setEmployee] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    password: "",
    isAdmin: true,
    companyEmail: "", // Set to true for development
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orderEmails, setOrderEmails] = useState<OrderEmail[]>([]);
  const [newOrderEmail, setNewOrderEmail] = useState<OrderEmail>({
    name: "",
    email: "",
  });
  const { auth } = useAuth();

  useEffect(() => {
    // Fetch employee information from the database
    async function fetchEmployee() {
      try {
        const response = await axios.get("/api/employee"); // Adjust the API endpoint as needed
        setEmployee({
          ...response.data,
          isAdmin: true, // Set to true for development
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }

    // Fetch order emails from the database
    async function fetchOrderEmails() {
      try {
        const response = await axios.get("/api/order-emails"); // Adjust the API endpoint as needed
        setOrderEmails(response.data);
      } catch (error) {
        console.error("Error fetching order emails:", error);
      }
    }

    // Fetch employees list from the database
    async function fetchEmployees() {
      try {
        // const response = await axios.get("/api/employees"); // Adjust the API endpoint as needed
        // setEmployees(response.data);
        // if(localStorage.getItem("auth")){

        // }
        await fetchProfile();
        console.log("message", message);

        const updateEmployee = (data: any) => {
          setEmployee({
            id: data.id,
            name: "",
            email: data.email,
            password: data.password,
            isAdmin: data.role === "ADMIN",
            companyEmail: data.companyEmail,
          });
        };
        updateEmployee(message);

        // setEmployees(response);
      } catch (error) {
        console.error("Error fetching employees list:", error);
      }
    }

    fetchEmployee();
    fetchOrderEmails();
    fetchEmployees();
  }, [auth]);

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
      await axios.put("/api/employee", employee); // Adjust the API endpoint as needed
      toast("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleOrderEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/order-emails", newOrderEmail); // Adjust the API endpoint as needed
      setOrderEmails([...orderEmails, response.data]);
      setNewOrderEmail({ name: "", email: "" });
      toast("Order email added successfully");
    } catch (error) {
      console.error("Error adding order email:", error);
      toast.error("Error adding order email");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-5 pt-16 md:ml-64">
        <div className="p-3 mb-10 bg-white rounded shadow">
          <h2 className="mb-4 text-2xl text-gray-800">Profile</h2>
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
                    value={employee.companyEmail || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="col-span-2 px-6 py-2 mx-auto text-white bg-blue-500 rounded"
            >
              Save Changes
            </button>
          </form>
        </div>

        {employee.isAdmin && (
          <div className="p-3 mb-10 bg-white rounded shadow">
            <h3 className="mb-4 text-xl text-gray-800">Manage Order Emails</h3>
            <form
              onSubmit={handleOrderEmailSubmit}
              className="grid grid-cols-2 gap-4 mb-8"
            >
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
              <button
                type="submit"
                className="col-span-2 px-6 py-2 mx-auto text-white bg-blue-500 rounded"
              >
                Add Order Email
              </button>
            </form>

            <h4 className="mb-2 text-lg text-gray-700">
              Existing Order Emails
            </h4>
            <ul>
              {orderEmails.map((orderEmail, index) => (
                <li key={index} className="mb-2">
                  {orderEmail.name} - {orderEmail.email}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 bg-white rounded shadow">
          <h3 className="mb-4 text-xl text-gray-800">Workspace Employees</h3>
          {employees.length > 0 ? (
            <table className="min-w-full mb-4 bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="px-4 py-2 border-b">{emp.id}</td>
                    <td className="px-4 py-2 border-b">{emp.name}</td>
                    <td className="px-4 py-2 border-b">{emp.email}</td>
                    <td className="px-4 py-2 border-b">
                      {emp.isAdmin ? "Admin" : "Employee"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="mt-4 text-center text-gray-700">
              No employees found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
