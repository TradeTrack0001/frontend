import axios from "axios";
const baseUrl = "http://localhost:2000/api/";


type CheckInItem = {
    id: string;
    name: string;
    location: string;
    checkInQuantity: string;
    availableQuantity: string;
    employeeId: string;
    employeeName: string;
    checkInDate: string;
  };
export default function useCheckin(data : CheckInItem[]) {
    data.map((item) => {
        console.log("checkin",item)
        axios.put(`${baseUrl}checkin/${item.id}`, {
            id: item.id,
            name: item.name,
            location: item.location,
            checkInQuantity: item.checkInQuantity,
            availableQuantity: item.availableQuantity,
            employeeId: item.employeeId,
            employeeName: item.employeeName,
            checkInDate: item.checkInDate,
        })
    })
}