import axios from "axios";

const baseUrl = "https://backend-uas6.onrender.com/api/";

interface AddInventoryProps {
    itemID: number;
    itemName: string;
    itemDescription: string;
    itemQuantity: number;
    itemStatus: boolean;
    itemSize: string;
    type: string;
    checkInDate: string;
    checkOutDate: string;
    location: string;
}


export default function useAddInventory(item: any) {
    const url = `${baseUrl}add_product`;
    try {
        console.log("This is the item to be added: ", item);
        const response = axios.post(url, item);
        return response;
    } catch (error) {
        return error;
    }
}