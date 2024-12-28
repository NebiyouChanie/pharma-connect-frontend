 
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";
import { MoreHorizontal } from "lucide-react";


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
        accessorKey: "date",
        header: "Date",
      },

    {
        accessorKey: "status",
        header: "Status",
    },

    {
        id: "actions",
        cell: ({ row }) => {
            return(          
            <div className="space-x-6 flex">
                
                <Edit />
                <Trash  color="red"/>

            </div>)
        }} 
  ]
  