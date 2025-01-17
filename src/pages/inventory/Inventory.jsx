import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";
import {useParams} from 'react-router-dom'
import {BASE_URL} from '../../lib/utils'
import Cookies from 'universal-cookie'; 



const cookies = new Cookies()


function Inventory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
const user = cookies.get("user")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/pharmacies/${user?.pharmacyId}/inventory`);
        const responseJson = await response.json();
         
        setData(responseJson.data);
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

        <h2 className="text-3xl md:text-4xl font-bold mb-8">Medicine List</h2>
          <DataTable columns={columns} data={data} searchKey="medicineName" />
      </div>
    </div>
  );
}

export default Inventory;
