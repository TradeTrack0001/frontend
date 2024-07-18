import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleRegisterButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoginForm(false);
  };

  const handleLoginButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoginForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (authContext) {
      try {
        if (isLoginForm) {
          await authContext.login(email, password);
          navigate("/workspace");
          toast.success("Login successful");
        } else {
          // Add your registration logic here
          if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          await authContext.register(email, password);
          navigate("/inventory");
          toast.success("Registration successful");
        }
      } catch (error) {
        toast.error(isLoginForm ? "Login failed" : "Registration failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-1/2 bg-white"></div>
      <div className="flex w-1/2 bg-blue-300"></div>
      <div className="absolute inset-0 flex items-center justify-center w-full">
        <div className="z-10 flex flex-col w-full max-w-3xl overflow-hidden bg-white rounded-lg shadow-2xl lg:flex-row">
          <div className="flex flex-col items-center justify-center p-8 bg-blue-800 lg:w-1/2">
            <img
              src="src/assets/TradeTrackLogo.png"
              alt="Company Logo"
              className="w-32 h-32 mb-4"
            />
            <h1 className="text-4xl font-bold text-center text-white">
              Welcome to TradeTrack
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-white lg:w-1/2">
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-800">
              {isLoginForm ? "Login" : "Register"}
            </h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <div className="relative w-full">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-3 py-1 text-sm text-gray-600 focus:outline-none"
                  >
                    {isPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {!isLoginForm && (
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 py-1 text-sm text-gray-600 focus:outline-none"
                    >
                      {isPasswordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-800 rounded"
              >
                {isLoginForm ? "Login" : "Register"}
              </button>
              <div className="mt-4 text-center">
                {isLoginForm ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={handleRegisterButton}
                      className="text-blue-500"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={handleLoginButton}
                      className="text-blue-500"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
