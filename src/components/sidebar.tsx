import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigation = (path: string) => {
    setIsSidebarOpen(false); // Close sidebar on navigation
    console.log(path);
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/"); // Navigate back to the login page
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Top bar for small screens */}
      <div className="fixed md:hidden top-0 left-0 right-0 bg-blue-700 text-white flex items-center p-4 z-20">
        <button onClick={toggleSidebar} className="text-white mr-4">
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
        <img src="src/assets/TradeTrackLogo.png" alt="Company Logo" className="w-8 h-8 mr-2" />
        <h1 className="text-xl">TradeTrack</h1>
      </div>

      {/* Sidebar for all screens */}
      <div className={`fixed top-0 left-0 bottom-0 bg-blue-700 text-white p-5 min-h-screen w-64 transition-transform transform md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-30`}>
        <div>
          <img src="src/assets/TradeTrackLogo.png" alt="Company Logo" className="w-32 h-32 mx-auto" />
          <h1 className="mb-6 text-2xl text-center">TradeTrack</h1>
          <ul className="flex flex-col space-y-2">
            <li>
              <button
                onClick={() => handleNavigation("/profile")}
                className="hover:bg-blue-800 p-2 rounded w-full text-left"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/inventory")}
                className="hover:bg-blue-800 p-2 rounded w-full text-left"
              >
                Inventory
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/checkout")}
                className="hover:bg-blue-800 p-2 rounded w-full text-left"
              >
                Check out
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/checkin")}
                className="hover:bg-blue-800 p-2 rounded w-full text-left"
              >
                Check in
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/orders")}
                className="hover:bg-blue-800 p-2 rounded w-full text-left"
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/workspace")}
                className="hover:bg-blue-800 p-2 rounded w-full text-left"
              >
                Workspace
              </button>
            </li>
          </ul>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="p-2 mb-2 cursor-pointer text-white bg-red-700 rounded-md w-full"
          >
            LOG OUT
          </button>
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
