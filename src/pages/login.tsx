import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
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
        navigate("/inventory");
      } catch (error) {
        alert("Login failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-1/2 bg-white"></div>
      <div className="flex w-1/2 bg-blue-300"></div>
      <div className="flex items-center justify-center w-full absolute inset-0">
        <div className="flex flex-col lg:flex-row w-full max-w-3xl bg-white rounded-lg shadow-2xl z-10 overflow-hidden">
          <div className="lg:w-1/2 p-8 flex flex-col items-center justify-center bg-blue-800">
            <img
              src="src/assets/TradeTrackLogo.png"
              alt="Company Logo"
              className="w-32 h-32 mb-4"
            />
            <h1 className="text-4xl font-bold text-white text-center">Welcome to TradeTrack</h1>
          </div>
          <div className="lg:w-1/2 p-8 flex flex-col items-center justify-center bg-white">
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-800">Login</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
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
                className="w-full py-2 text-white bg-blue-800 rounded"
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
    </div>
  );
};

export default Login;
