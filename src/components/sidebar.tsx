import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faUser, faWarehouse, faSignInAlt, faList, faBriefcase, faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

<<<<<<< HEAD
  const handleNavigation = (path: any) => {
=======
  const handleNavigation = (path: string) => {
>>>>>>> efd06545e6fac0da13b36f7ab46351b58e3f8596
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
<<<<<<< HEAD
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
=======
      <div className={`fixed top-0 left-0 bottom-0 bg-blue-700 text-white p-5 min-h-screen w-64 transition-transform transform md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-30`}>
        <div className="flex flex-col h-full">
          <div>
            <img src="src/assets/TradeTrackLogo.png" alt="Company Logo" className="w-32 h-32 mx-auto" />
            <h1 className="mb-6 text-2xl text-center">TradeTrack</h1>
            <ul className="flex flex-col space-y-4"> {/* Increased spacing */}
              <li>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="hover:bg-blue-800 p-4 rounded w-full text-left flex items-center" // Increased padding
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3" /> Profile {/* Increased margin */}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/inventory")}
                  className="hover:bg-blue-800 p-4 rounded w-full text-left flex items-center" // Increased padding
                >
                  <FontAwesomeIcon icon={faWarehouse} className="mr-3" /> Inventory {/* Increased margin */}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/checkout")}
                  className="hover:bg-blue-800 p-4 rounded w-full text-left flex items-center" // Increased padding
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-3 transform rotate-180" /> Check out {/* Increased margin */}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/checkin")}
                  className="hover:bg-blue-800 p-4 rounded w-full text-left flex items-center" // Increased padding
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-3" /> Check in {/* Increased margin */}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/orders")}
                  className="hover:bg-blue-800 p-4 rounded w-full text-left flex items-center" // Increased padding
                >
                  <FontAwesomeIcon icon={faList} className="mr-3" /> Orders {/* Increased margin */}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/workspace")}
                  className="hover:bg-blue-800 p-4 rounded w-full text-left flex items-center" // Increased padding
                >
                  <FontAwesomeIcon icon={faBriefcase} className="mr-3" /> Workspace {/* Increased margin */}
                </button>
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="p-4 mb-2 cursor-pointer text-white hover:bg-red-700 rounded-md w-full flex items-center" // Increased padding
            >
              <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} className="mr-3 scale-x-[-1]" /> LOG OUT {/* Increased margin */}
            </button>
          </div>
>>>>>>> efd06545e6fac0da13b36f7ab46351b58e3f8596
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
