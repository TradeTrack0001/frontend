import { Routes, Route } from "react-router-dom";
import Inventory from "./pages/inventory";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin";
import Orders from "./pages/orders";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
}

export default App;
