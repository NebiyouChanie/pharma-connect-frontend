import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";
import {BASE_URL} from '../../lib/utils'


function Pharmacies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchData() {
      try {

        const response = await fetch(`${BASE_URL}/pharmacies`)

        const responseJson = await response.json()
        const pharmacies = responseJson.data
        setData(pharmacies)

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

        <h2>Pharmacies </h2>
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
    </div>
  );
}

export default Pharmacies;
