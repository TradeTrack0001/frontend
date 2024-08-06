import axios from "axios";

const baseUrl = "https://backend-uas6.onrender.com/api/";

export const updateInventory = async (data: any[]) => {
    if (!Array.isArray(data)) {
        throw new Error("Input data must be an array");
        
    }
    const id = data[0].itemID
    const name = data[0].itemName
    const location = data[0].location
    const itemQuantity = data[0].itemQuantity
    const employeeId = data[0].employeeId
    const employeeName = data[0].employeeName
    const checkOutDate = data[0].checkOutDate
    const duration = data[0].duration
    const dueOn = data[0].dueOn
    const description = data[0].itemDescription
    console.log("This is the data in api call: ", id, name, location, employeeId, employeeName, checkOutDate, duration, dueOn, "fucking quantity", itemQuantity);
    
    const response = await axios.put(`${baseUrl}update_product/${id}`, {
        description,
        name,
        itemQuantity,
        location,
        employeeId,
        checkOutDate,
        duration,
        dueOn
    });
    if (response.status === 200) {
        return response.data
    }else{
        return null
    }

    
    
};
