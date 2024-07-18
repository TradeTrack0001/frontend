import axios from "axios";
import { useWorkspace } from "./workspace";

const baseUrl = "http://localhost:2000";

export default async function getInventory() {
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const inventoryList: {
    itemID: any;
    itemName: any;
    itemDescription: any;
    itemQuantity: any;
    itemStatus: any;
    itemSize: any;
    type: any;
    checkInDate: any;
    checkOutDate: any;
    location: any;
  }[] = [];
  const url = `${baseUrl}/workspace/workspaces/${currentWorkspace.id}/inventory`;

  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      console.log("Successfully retrieved the object");
      const data = res.data;
      console.log("This is the data: ", data);

      if (data && data.inventory && currentWorkspace) {
        data.inventory.forEach(
          (value: {
            itemID: any;
            itemName: any;
            itemDescription: any;
            itemQuantity: any;
            itemStatus: any;
            itemSize: any;
            type: any;
            checkInDate: any;
            checkOutDate: any;
            location: any;
          }) => {
            inventoryList.push({
              itemID: value.itemID || "No ID",
              itemName: value.itemName || "No name",
              itemDescription: value.itemDescription || "No description",
              itemQuantity: value.itemQuantity || "No quantity",
              itemStatus: value.itemStatus || "No status",
              itemSize: value.itemSize || "No size",
              type: value.type || "No type",
              checkInDate: value.checkInDate || "No date",
              checkOutDate: value.checkOutDate || "No date",
              location: value.location || "No location",
            });
          }
        );

        console.log(inventoryList);
        console.log("This is the inventory list");
        return inventoryList;
      } else {
        console.log("Failed to parse inventory data");
        return [];
      }
    } else {
      console.log("Failed to get response");
      return [];
    }
  } catch (e: any) {
    console.error("Error in getInventory: " + e.toString());
    return [];
  }
}
