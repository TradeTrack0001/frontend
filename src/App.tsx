import { Routes, Route } from "react-router-dom";
import Inventory from "./pages/inventory";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin";
import Orders from "./pages/orders";
import Workspace from "./pages/workspace";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/AuthContext";
import { ProfileProvider } from "./hooks/proflie";

function App() {
  return (
    <>
      <AuthProvider>
        <ProfileProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkin" element={<Checkin />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/workspace" element={<Workspace />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </>
  );
}

export default App;
