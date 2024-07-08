import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom'
import { library, IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { all } from '@awesome/kit-KIT_CODE/icons'


library.add(...all)
 // @ts-ignore
 const myIcon : IconProp = "fa-regular fa-clipboard" 

 const element = <FontAwesomeIcon icon={myIcon} />

 ReactDOM.render(element, document.body)

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
          <FontAwesomeIcon icon={faClipboard} />
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
  );
}
