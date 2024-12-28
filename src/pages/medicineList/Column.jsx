 
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
      accessorKey: "catagory",
      header: "Category",
    },
      {
        accessorKey: "stockQuantity",
        header: "Stock Quantity",
      },
    {
      accessorKey: "price",
      header: () => <div>Price</div>,
      cell: ({row}) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-ET",{
          style: "currency",
          currency: "ETB",
        }).format(amount);
  
        return <div className="font-medium">{formatted}</div>;
      },
    },

    {
        accessorKey: "expireDate",
        header: "Expire Date",
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
  