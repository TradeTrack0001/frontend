import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import {  useAuth } from "./AuthContext";

interface ProfileContextType {
  message: string;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const { auth } = useAuth();
  const [message, setMessage] = useState<string>("");

  const fetchProfile = async () => {
    console.log("auth", auth);
    console.log("is this working");

    if (auth && auth.token) {
      try {

        const response = await axios.get(
          "http://localhost:2000/profile/get_user",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setMessage(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access");
        } else {
          console.error("An error occurred while fetching the profile:", error);
        }
      }
    }
  };

  return (
    <ProfileContext.Provider value={{ message, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  console.log(context);
  return context;
};
