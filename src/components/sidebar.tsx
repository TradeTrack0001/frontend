import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigation = (path: any) => {
    setIsSidebarOpen(false); // Close sidebar on navigation
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
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center p-4 text-white bg-blue-700 md:hidden">
        <button onClick={toggleSidebar} className="mr-4 text-white">
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
        <img
          src="src/assets/TradeTrackLogo.png"
          alt="Company Logo"
          className="w-8 h-8 mr-2"
        />
        <h1 className="text-xl">TradeTrack</h1>
      </div>

      {/* Sidebar for all screens */}
      <div
        className={`fixed top-0 left-0 bottom-0 bg-blue-700 text-white p-5 min-h-screen w-64 transition-transform transform md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-30`}
      >
        <div>
          <img
            src="src/assets/TradeTrackLogo.png"
            alt="Company Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="mb-6 text-2xl text-center">TradeTrack</h1>
          <ul className="flex flex-col space-y-2">
            <li>
              <button
                onClick={() => handleNavigation("/profile")}
                className="w-full p-2 text-left rounded hover:bg-blue-800"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/inventory")}
                className="w-full p-2 text-left rounded hover:bg-blue-800"
              >
                Inventory
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/checkout")}
                className="w-full p-2 text-left rounded hover:bg-blue-800"
              >
                Check out
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/checkin")}
                className="w-full p-2 text-left rounded hover:bg-blue-800"
              >
                Check in
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/orders")}
                className="w-full p-2 text-left rounded hover:bg-blue-800"
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/workspace")}
                className="w-full p-2 text-left rounded hover:bg-blue-800"
              >
                Workspace
              </button>
            </li>
          </ul>
        </div>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full p-2 mb-2 text-white bg-red-700 rounded-md cursor-pointer"
          >
            LOG OUT
          </button>
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
