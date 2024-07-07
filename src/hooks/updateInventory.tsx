import axios from "axios";

const baseUrl = "http://localhost:2000/api/";

export const updateInventory = async (data: any[]) => {
    if (!Array.isArray(data)) {
        throw new Error("Input data must be an array");
    }
    
    await Promise.all(data.map(async ({ 
        id,
        name,
        location,
        checkOutQuantity,
        availableQuantity,
        employeeId,
        employeeName,
        checkOutDate,
        duration,
        dueOn
    }) => {
        console.log("This is the data: ", id, name, location, checkOutQuantity, availableQuantity, employeeId, employeeName, checkOutDate, duration, dueOn);

        const newQuantity: number = parseInt(availableQuantity) - parseInt(checkOutQuantity);

        const response = await axios.put(`${baseUrl}update_product/${id}`, {
            id,
            name,
            location,
            newQuantity,
            employeeId,
            checkOutDate,
            duration,
            dueOn
        });
        return response.data;
    }));
};
