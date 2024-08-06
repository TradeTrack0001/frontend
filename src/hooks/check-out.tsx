import axios from "axios";
const baseUrl = "https://backend-uas6.onrender.com/api/";

type CheckOutItem = {
  id: string;
  name: string;
  location: string;
  checkOutQuantity: string;
  availableQuantity: string;
  employeeId: string;
  employeeName: string;
  checkOutDate: string;
  duration: string;
  dueOn: string;
};

export default function useCheckOut(data: CheckOutItem[]) {
  data.map((item) => {
    console.log("checkout", item);
    axios.put(`${baseUrl}checkout/${item.id}`, {
      id: item.id,
      name: item.name,
      location: item.location,
      checkOutQuantity: item.checkOutQuantity,
      availableQuantity: item.availableQuantity,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      checkOutDate: item.checkOutDate,
    });
  });
}
