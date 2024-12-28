import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";

function MedicineList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchData() {
      try {
        //  API call
        const response = [
        
          {
            id: "728ed52f",
            medicineName:"Paracitamol",
            catagory:"pill",
            stockQuantity: 44 ,
            price: 456.00,
            expireDate:"12/27/2024",
          },
          {
            id: "728ed4552f",
            medicineName:"Paracitamol",
            catagory:"pill",
            stockQuantity: 44 ,
            price: 456.00,
            expireDate:"12/27/2024",
          },
          {
            id: "728ed5dgf2f",
            medicineName:"Paracitamol",
            catagory:"pill",
            stockQuantity: 44 ,
            price: 456.00,
            expireDate:"12/27/2024",
          },
          {
            id: "728ed52f",
            medicineName:"Paracitamol",
            catagory:"pill",
            stockQuantity: 44 ,
            price: 456.00,
            expireDate:"12/27/2024",
          },
        ];

        setData(response);

      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
  }, []);

  return (
    <div>
      <div className="container mx-auto py-10">

        <h2>Medicine List</h2>
          <DataTable columns={columns} data={data} searchkey="medicineName"/>
      </div>
    </div>
  );
}

export default MedicineList;
