import React, { useEffect, useState } from "react";
import { columns } from "./Column";
import { DataTable } from "../../components/ui/data-table";

function ApplicationList() {
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
            ownerName:"nebiyou chanie",
            pharmacyName:"international phramacy",
            date:"12/12/17",
            status:"Approved"
          },
          {
            id: "728eddg52f",
            ownerName:"Dagim abate",
            pharmacyName:"international phramacy",
            date:"12/12/17",
            status:"Approved"
          },
          {
            id: "728ed5dfg2f",
            ownerName:"Tsigemariam zewdu",
            pharmacyName:"international phramacy",
            date:"12/12/17",
            status:"Approved"
          },
          {
            id: "728eddfg52f",
            ownerName:"Yetmgeta Ewnetu",
            pharmacyName:"international phramacy",
            date:"12/12/17",
            status:"Approved"
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

        <h2>Application List</h2>
        <DataTable columns={columns} data={data} searchkey="PharmacyName" />

      </div>
    </div>
  );
}

export default ApplicationList;
