import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState(true);

  const handleRegisterButton = () => {
    setLogin(false);
  };
  const handleLoginButton = () => {
    setLogin(true);
  };

  const BackArrow = () => {
    return (
      <button onClick={handleLoginButton} className="mb-2 cursor-pointer text-blue-500">
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
            {login ? "Login" : "Register"}
          </h1>
          <form className="flex flex-col space-y-4">
            {!login && <BackArrow />}
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
            {!login && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-gray-300 p-2 rounded"
              />
            )}
            {login ? (
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
            {login && (
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
