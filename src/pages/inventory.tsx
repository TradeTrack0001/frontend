import { useNavigate } from "react-router-dom";

export default function Inventory() {
    const BackArrow = () => {
        return (
          <button onClick={handleBackButton} className="mb-2 cursor-pointer text-white">
            ← Back
          </button>
        );
      };
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate("/")}
  return (
    <div className="flex min-h-screen">
      
      <div className="w-1/4 bg-blue-700 text-white p-5">
        <h1 className="text-center mb-4">TradeTrack</h1>
        <BackArrow />
        <ul className="flex flex-col space-y-2">
          <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">Dashboard</li>
          <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">Inventory</li>
          <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">Orders</li>
          <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">Settings</li>
        </ul>
      </div>
      
      <div className="flex-1 p-5">
        <div className="bg-white p-3 shadow rounded">
          <h2 className="text-gray-800 text-2xl">Inventory</h2>
          /* Add your main content here */
        </div>
      </div>
    </div>
  );
}

