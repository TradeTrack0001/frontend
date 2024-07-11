import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Temporary navigation to the rest of the app
  const authContext = useContext(AuthContext);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (authContext) {
      try {
        await authContext.login(email, password);
        navigate("/inventory"); // Temporary navigation to the rest of the app
      } catch (error) {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 hidden bg-blue-300 md:flex">
        {/* Desktop Welcome Card */}
        <div className="flex items-center justify-center w-full">
          <div className="p-8 text-center text-white bg-blue-900 rounded-lg shadow-lg">
            <img
              src="src/assets/TradeTrackLogo.png"
              alt="Company Logo"
              className="w-32 h-32 mx-auto"
            />
            <h1 className="mt-4 text-4xl font-bold">Welcome to TradeTrack</h1>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 bg-white">
        {/* Login Card */}
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-500 rounded"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
