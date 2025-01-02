 
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";



export const columns = [
    {
      accessorKey: "ownerName",
      header: "Owner Name",
    },
    {
      accessorKey: "pharmacyName",
      header: "Pharmacy Name",
    },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const createdDate = new Date(row.original.createdAt);
          if (isNaN(createdDate)) return "Invalid Date";
          const date = createdDate.getDate().toString().padStart(2, "0");
          const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
          const year = createdDate.getFullYear();
          return `${date}-${month}-${year}`;
        }
      },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => (
          <div className="flex items-center gap-x-2">
            <StatusBadge status={row.original.status}/> 
          </div>
        )
    },

    {
        id: "actions",
        cell: ({ row }) => {
            return(  
            <div className="space-x-6 flex">
             { console.log(row.original._id)     }   
              <Link to={`/applications/${row.original._id}`}>
                <span className="text-primary">See Details</span>
              </Link>
            </div>)
        }} 
  ]
  