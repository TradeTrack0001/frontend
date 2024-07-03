import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState(true);
  const [mainScreen, setMainScreen] = useState(true);
  const navigate = useNavigate();

  const handleRegisterButton = () => {
    setMainScreen(false);
  };
  const handleMainScreen = () => {
    setMainScreen(true);
  }
  const handleLoginButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/inventory");
  };

  const BackArrow = () => {
    return (
      <button onClick={handleMainScreen} className="mb-2 cursor-pointer text-blue-500">
        ← Back
      </button>
    );
  };

  return (
    <div className="flex min-h-screen">
      <div className="absolute inset-0 w-1/2 bg-white z-0"></div>
      <div className="absolute inset-0 w-1/2 bg-blue-300 z-0 right-0"></div>
      <div className="relative w-full max-w-md p-8 bg-white shadow-lg rounded-lg z-10 m-auto">
          <h1 className="text-4xl mb-2 text-center">
            {mainScreen ? "Login" : "Register"}
          </h1>
          <form className="flex flex-col space-y-4">
            {!mainScreen && <BackArrow />}
            <input
              type="text"
              placeholder="Username"
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 p-2 rounded"
            />
            {!mainScreen && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-gray-300 p-2 rounded"
              />
            )}
            {mainScreen ? (
              <button
                type="submit"
                onClick={handleLoginButton}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Login
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleRegisterButton}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Register
              </button>
            )}
            {mainScreen && (
              <p className="text-center">
                Don't have an account?{" "}
                <span
                  onClick={handleRegisterButton}
                  className="cursor-pointer text-blue-600"
                >
                  Register
                </span>
              </p>
            )}
          </form>
        </div>
      </div>
  );
}
