import axios from "axios";

const baseUrl = "https://backend-uas6.onrender.com/profile/";

export const updateProfile = async (authToken: any, data: any) => {
  console.log("hi");
  try {
    const id = data.id;
    const name = data.name;
    const email = data.email;
    const password = data.password;
    const isAdmin = data?.isAdmin;
    const companyEmail = data?.companyEmail;

    const response = await axios.put(
      `${baseUrl}update_profile/`,
      {
        name,
        email,
        password,
        companyEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};
