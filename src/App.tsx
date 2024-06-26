import { Routes, Route } from "react-router-dom";
import  Inventory  from "./pages/inventory";
import  Login  from "./pages/login";
import  Profile  from "./pages/profile";

function App() {
  return (
    <>
    <nav>
      <ul>
        <li>
          <a href="/">Login</a>
        </li>
        <li>
          <a href="/Inventory">Main</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </>
  );
}

export default App;
