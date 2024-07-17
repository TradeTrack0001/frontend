import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function useProfile() {
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const auth = authContext?.auth;
  console.log("the fucntion is called higher");


    const fetchProfile = async () => {
        console.log("the fucntion is called high");
      if (auth && auth.token) {
        try {
            console.log("the fucntion is called");
          const response = await axios.get("http://localhost:2000/profile/get_user", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          setMessage(response.data);
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            
          }
        }
      }
    };

    fetchProfile();

  return { message };
}

export default useProfile;
