import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";
import {BASE_URL} from '../../lib/utils'

function Medicines() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchData() {
      try {
        //  API call
        try {
      
          const response = await fetch(`${BASE_URL}/medicines`)
          const responseJson = await response.json()
          const Medicines = responseJson.data
          setData(Medicines)
          
        } catch (error) {
          toast.error("unable to fetch medicines")
        }
            
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
          <DataTable columns={columns} data={data} searchKey="name"/>
      </div>
    </div>
  );
}

export default Medicines;
