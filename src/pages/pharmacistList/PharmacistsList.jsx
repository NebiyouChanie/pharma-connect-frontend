import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";
import {useParams} from 'react-router-dom'
import {BASE_URL} from '../../lib/utils'
import Cookies from 'universal-cookie'; 
import { ReferalLink } from "@/components/Link";



const cookies = new Cookies()


function PharmacistsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const {pharmacyId} = useParams()
const user = cookies.get("user")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/pharmacies/${pharmacyId}/pharmacists`);
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
          <h2>Pharmacist List</h2>
          <DataTable columns={columns} data={data} searchKey="firstName" />
      <div className="mt-8">
        <ReferalLink 
            title="Add Pharmacists by sharing this registration link"
            description={`${window.location.protocol}//${window.location.host}/sign-up-pharmacist/${pharmacyId}`}
        />
      </div>
      </div>
    </div>
  );
}

export default PharmacistsList;
