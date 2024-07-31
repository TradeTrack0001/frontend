import axios from "axios";

const baseUrl = "http://localhost:2000/api/";

export const deleteInventory = async (itemID: number) => {
  try {
    const response = await axios.delete(`${baseUrl}delete_product/${itemID}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to delete the item");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
