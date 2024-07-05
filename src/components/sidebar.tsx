import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/"); // Navigate back to the login page
  };

  console.log("Sidebar rendered");

  return (
    <div className="w-1/4 bg-blue-700 text-white p-5 min-h-screen max-w-48 flex flex-col justify-between">
      <div>
        <h1 className="mb-4 text-xl">TradeTrack</h1>
        <ul className="flex flex-col space-y-2">
          <li>
            <button
              onClick={() => handleNavigation("/profile")}
              className="hover:bg-blue-600 p-2 rounded w-full text-left"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/inventory")}
              className="hover:bg-blue-600 p-2 rounded w-full text-left"
            >
              Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/checkout")}
              className="hover:bg-blue-600 p-2 rounded w-full text-left"
            >
              Check out
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/checkin")}
              className="hover:bg-blue-600 p-2 rounded w-full text-left"
            >
              Check in
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/orders")}
              className="hover:bg-blue-600 p-2 rounded w-full text-left"
            >
              Orders
            </button>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="p-2 mb-2 cursor-pointer text-white bg-red-800 rounded-md w-full"
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
}
