
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Navigate back to the login page
  };

  console.log("Sidebar rendered");

  return (
    <div className="w-1/4 bg-blue-700 text-white p-5 min-h-screen">
      <h1 className="mb-4 space-y-2 text-xl">TradeTrack</h1>
      <ul className="flex flex-col space-y-2">
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/inventory">Inventory</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/checkout">Check out</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/checkin">Check in</Link>
        </li>
        <li className="hover:bg-blue-600 p-2 rounded cursor-pointer">
          <Link to="/orders">Orders</Link>
        </li>
        
      </ul>
      <div className='mt-auto'>
      <button onClick={handleLogout} className="mb-2 p-2 cursor-pointer text-white bg-red-800 rounded-md">
        LOG OUT
      </button>
      </div>
    </div>
  );
};
