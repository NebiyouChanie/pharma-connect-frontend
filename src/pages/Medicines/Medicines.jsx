import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";

function Medicines() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchData() {
      try {
        //  API call
        const response = [
        
            {
                id: "728edddd4552f",
                medicineName:"Paracitamol",
                description:"pillllllllllllllllllllllllll",
                catagory:"pill",
                
              },
          {
            id: "728ed4sdf552f",
            medicineName:"Paracitamol",
            description:"pillllllllllllllllllllllllll",
            catagory:"pill",
            
          },
          {
            id: "728ed4sdfsd552f",
            medicineName:"Paracitamol",
            description:"pillllllllllllllllllllllllll",
            catagory:"pill",
            
          },
          {
            id: "728ed45sdfs52f",
            medicineName:"Paracitamol",
            description:"pillllllllllllllllllllllllll",
            catagory:"pill",
            
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

export default Medicines;
