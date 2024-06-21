import "./App.css";
import { useState } from "react";

function App() {
  const [login , setLogin] = useState(true);

  const handleRegisterButton = () => {
    setLogin(false);
  }
  const handleLoginButton = () => {
    setLogin(true);
  }
  return (
    <div className="min-h-screen">
      <h1 className="flex justify-center items-center text-4xl">
        {login ? "Login" : "Register"}
      </h1>
      
    <div className="min-h-screen">
      
      <div className="flex justify-center items-center">
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 p-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2"
          />
          <button
            type="submit"
            onClick={handleLoginButton}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
          <button
            type = 'button'
            onClick={handleRegisterButton}
            className ="bg-blue-500 text-white p-2 rounded">
            Register
          </button>
        </form>
    </div>
    </div>
    </div>
  );
}

export default App;
