import { Routes, Route } from "react-router-dom";
import  Inventory  from "./pages/inventory";
import  Login  from "./pages/login";
import  Profile  from "./pages/profile";
import Checkout  from "./pages/checkout";
import Checkin  from "./pages/checkin";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkin" element={<Checkin />} />
    </Routes>
    </>
  );
}

export default App;
