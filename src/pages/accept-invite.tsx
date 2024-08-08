import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Your configured axios instance

const AcceptInvitePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setToken(token);
    } else {
      setError("Invalid or expired token");
    }
  }, []);

  const handleAcceptInvite = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        "https://backend-uas6.onrender.com/accept-invite",
        { token }
      );
      alert(response.data.message);
      navigate("/"); // Redirect to home or another appropriate page
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError(
        "Failed to accept the invitation. The token might be invalid or expired."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Accept Workspace Invitation</h1>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div>
            <p className="mb-4">
              Click the button below to accept the invitation.
            </p>
            <button
              onClick={handleAcceptInvite}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Accept Invitation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;
