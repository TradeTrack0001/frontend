
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Navigate back to the login page
  };

  console.log("Sidebar rendered");

  return (
    <div className="w-1/4 bg-blue-700 text-white p-5 min-h-screen">
      <button onClick={handleBack} className="mb-2 cursor-pointer text-white">
        ← Back
      </button>
      <h1 className="text-center mb-4">TradeTrack</h1>
      <ul className="flex flex-col space-y-2">
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/inventory">Inventory</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/checkout">Checkout</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/checkin">Checkin</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};
