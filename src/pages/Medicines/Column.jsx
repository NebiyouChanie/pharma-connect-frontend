 
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";
import { MoreHorizontal } from "lucide-react";


export const columns = [
    {
      accessorKey: "medicineName",
      header: "Medicine Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
      accessorKey: "catagory",
      header: "Category",
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
  