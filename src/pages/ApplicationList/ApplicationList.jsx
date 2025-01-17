import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";
import {BASE_URL} from '../../lib/utils'

function ApplicationList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchData() {
      try {
        //  API call
        const response = await fetch(`${BASE_URL}/applications`);
        const responseJson = await response.json();

        // Save the original data
        setData(responseJson.applications);


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

        <h2 className="text-3xl md:text-4xl font-bold mb-8">Applications List</h2>
        <DataTable columns={columns} data={data} searchKey="pharmacyName" />

      </div>
    </div>
  );
}

export default ApplicationList;
