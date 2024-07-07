import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mainScreen, setMainScreen] = useState(true);
  const navigate = useNavigate();

  const handleRegisterButton = () => {
    setMainScreen(false);
  };

  const handleMainScreen = () => {
    setMainScreen(true);
  };

  const handleLoginButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    <div className="relative flex min-h-screen">
      <div className="w-1/2 bg-blue-300 min-h-screen"></div>
      <div className="w-1/2 bg-white min-h-screen"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex bg-white rounded shadow-lg">
          <div className="bg-white p-8 rounded-l-lg">
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
          <div className="bg-blue-900 p-8 rounded-r-lg flex items-center justify-center">
            <div className="text-center">
              <img src="src/assets/TradeTrackLogo.png" alt="Company Logo" className="w-32 h-32 mx-auto"/>
              <h1 className="text-white text-4xl font-bold mt-4">TradeTrack</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
